// Stripe front-end integration (test mode)
// Replace with your own publishable key from Stripe Dashboard
const stripe = Stripe('pk_test_51HPvntA8g2bPSigPso54Jv5f25duD5pA8k8a5X7jX3f4u5f6e7d8c9b0a1b2c3d4e5f6');

let elements;

function getCartTotalPence() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    return Math.round(subtotal * 100);
  } catch (_) { return 0; }
}

// Simulate server-created PaymentIntent and return a fake clientSecret
async function createPaymentIntent() {
  console.log('Simulating PaymentIntent creation');
  const amount = getCartTotalPence();
  // In production, call your backend (e.g., Supabase Edge Function) to create a real PaymentIntent
  // return fetch('/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) })
  //   .then(r=>r.json());

  // Return a FAKE client secret for demo only
  return {
    clientSecret: 'pi_3JpQ8mA8g2bPSigP1j2k3l4m_secret_5n6o7p8q9r0s1t2u3v4w5x6y7z'
  };
}

async function initialize() {
  const form = document.querySelector('#payment-form');
  const cardContainer = document.querySelector('#card-element');
  if (!form || !cardContainer || !stripe) return;

  const { clientSecret } = await createPaymentIntent();

  elements = stripe.elements({ clientSecret });
  const cardElement = elements.create('card', {
    style: {
      base: {
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '14px',
        '::placeholder': { color: '#aab7c4' }
      },
      invalid: { color: '#ff6b6b', iconColor: '#ff6b6b' }
    }
  });
  cardElement.mount('#card-element');

  form.addEventListener('submit', handleSubmit);
}

function setLoading(isLoading) {
  const submitButton = document.querySelector('#submit-button');
  if (!submitButton) return;
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner"></div>';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = 'Pay Now';
  }
}

function showMessage(text) {
  const el = document.querySelector('#payment-message');
  if (el) el.textContent = text || '';
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!elements) return;
  setLoading(true);

  try {
    const result = await stripe.confirmCardPayment(elements._clientSecret, {
      payment_method: { card: elements.getElement('card') }
    });
    if (result.error) {
      showMessage(result.error.message || 'Payment failed.');
    } else {
      showMessage('Payment succeeded!');
      // TODO: redirect to a success page
    }
  } catch (err) {
    showMessage('Something went wrong.');
  } finally {
    setLoading(false);
  }
}

// Init on load
window.addEventListener('load', initialize);


