// Minimal cart renderer using localStorage 'cart' (same structure as tshirt.js simulateAddToCart)
(function(){
  const itemsEl = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const shippingEl = null; // removed select, shipping calculated later
  const shippingText = document.getElementById('shippingText');
  if (!itemsEl || !subtotalEl || !totalEl) return;

  function formatGBP(n){ return `£${Number(n).toFixed(2)}`; }

  function getCart(){
    try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(_) { return []; }
  }
  function setCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }

  function render(){
    const cart = getCart();
    itemsEl.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, idx)=>{
      const row = document.createElement('div');
      row.className = 'cart-item';
      // Normalize product titles to Essentials naming
      const title = (item.product||'Product')
        .replace(/Angry Rooster Power Drape.*tee/i,'ESSENTIALS TEE 01')
        .replace(/Power Drape.*tee/i,'ESSENTIALS TEE 01')
        .replace(/Angry Rooster PowerKnit.*hoodie/i,'ESSENTIALS HOODIE 02')
        .replace(/PowerKnit.*hoodie/i,'ESSENTIALS HOODIE 02');
      row.innerHTML = `
        <div class="item-thumb"><img src="${(item.image||'../front-tshirt.png').replace('..','')}" alt="${item.product||'Product'}"></div>
        <div class="item-info">
          <div class="item-name">${title}</div>
          <div class="item-sub">Size: ${item.size||'-'} • Qty:
            <select class="qty-select" data-idx="${idx}">
              ${[1,2,3,4,5].map(n=>`<option ${n==(item.quantity||1)?'selected':''} value="${n}">${n}</option>`).join('')}
            </select>
          </div>
          <button class="remove-btn" data-remove="${idx}">Remove</button>
        </div>
        <div class="item-price">${formatGBP(item.price||0)}</div>
      `;
      itemsEl.appendChild(row);
      subtotal += (item.price||0) * (item.quantity||1);
    });
    subtotalEl.textContent = formatGBP(subtotal);
    const shipping = 0; // shown as calculated later
    totalEl.textContent = formatGBP(subtotal + shipping);

    // events
    itemsEl.querySelectorAll('.qty-select').forEach(sel=>{
      sel.addEventListener('change', ()=>{
        const idx = Number(sel.dataset.idx);
        const cart = getCart();
        if(cart[idx]){ cart[idx].quantity = Number(sel.value); setCart(cart); render(); }
      });
    });
    itemsEl.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const idx = Number(btn.dataset.remove);
        const cart = getCart(); cart.splice(idx,1); setCart(cart); render();
      });
    });
  }

  // no shipping selection; calculated later
  document.getElementById('checkoutBtn')?.addEventListener('click', ()=>{
    alert('Checkout coming soon. Join the waitlist to get early access.');
  });

  render();
})();

