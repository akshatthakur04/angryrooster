// T-Shirt Product Page JavaScript
// Based on hoodie.js but adapted for Power Drape™ Tee

document.addEventListener('DOMContentLoaded', function() {
    // Initialize product page functionality
    initializeImageGallery();
    initializeHeroGallery();
    initializeSizeSelection();
    initializeAddToCart();
    initializeWishlist();
    initializeAccordion();
});

// Image Gallery Functionality
function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newImageSrc = this.dataset.image;
            if (newImageSrc && mainImage) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = newImageSrc;
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
    });

    // Image zoom on hover (optional enhancement)
    const mainImageContainer = document.querySelector('.main-image-container');
    if (mainImageContainer) {
        mainImageContainer.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            mainImage.style.transformOrigin = `${x}% ${y}%`;
        });
    }
}

// Hero Image Gallery Functionality
function initializeHeroGallery() {
    let currentImageIndex = 0;
    const images = [
        { src: '../maintshirtpage.png', alt: 'Power Drape™ Tee Front' },
        { src: '../Background.jpg', alt: 'Power Drape™ Tee Back' }
    ];

    // Gallery thumbnail switching
    document.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.gallery-thumb').forEach(t => { t.classList.remove('active'); t.removeAttribute('aria-current'); });
            thumb.classList.add('active');
            thumb.setAttribute('aria-current','true');
            
            // Switch background image
            const heroImage = document.querySelector('.hero-background-image');
            if (heroImage) {
                heroImage.style.opacity = '0.7';
                setTimeout(() => {
                    heroImage.src = thumb.dataset.image;
                    heroImage.alt = thumb.dataset.alt;
                    heroImage.style.opacity = '1';
                }, 150);
            }
            
            // Update current index
            currentImageIndex = index;
        });
    });

    // Modal functions
    window.openImageModal = function() {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const previouslyFocused = document.activeElement;
        
        if (modal && modalImage) {
            modalImage.src = images[currentImageIndex].src;
            modalImage.alt = images[currentImageIndex].alt;
            
            // Update indicators
            updateModalIndicators();
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus trap
            const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (first) first.focus();
            function handleTab(e){
              if (e.key !== 'Tab') return;
              if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
              else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
            }
            modal.addEventListener('keydown', handleTab);
            modal.dataset.prevFocus = previouslyFocused ? previouslyFocused.id || 'focus-sentinel' : '';
            modal.dataset.trap = 'true';
        }
    };

    window.closeImageModal = function() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // restore focus
            const id = modal.dataset.prevFocus;
            if (id && id !== 'focus-sentinel') {
              const el = document.getElementById(id);
              if (el) el.focus();
            }
        }
    };

    window.switchModalImage = function(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        }
        
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.style.opacity = '0';
            
            setTimeout(() => {
                modalImage.src = images[currentImageIndex].src;
                modalImage.alt = images[currentImageIndex].alt;
                modalImage.style.opacity = '1';
                updateModalIndicators();
                
                // Update hero gallery active state
                document.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
                    const isActive = index === currentImageIndex;
                    thumb.classList.toggle('active', isActive);
                    if (isActive) thumb.setAttribute('aria-current','true'); else thumb.removeAttribute('aria-current');
                });
            }, 150);
        }
    };

    function updateModalIndicators() {
        document.querySelectorAll('.modal-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentImageIndex);
        });
    }

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('imageModal');
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            window.closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            window.switchModalImage(-1);
        } else if (e.key === 'ArrowRight') {
            window.switchModalImage(1);
        }
    });

    // Modal indicator click functionality
    document.querySelectorAll('.modal-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentImageIndex = index;
            const modalImage = document.getElementById('modalImage');
            if (modalImage) {
                modalImage.style.opacity = '0';
                setTimeout(() => {
                    modalImage.src = images[currentImageIndex].src;
                    modalImage.alt = images[currentImageIndex].alt;
                    modalImage.style.opacity = '1';
                    updateModalIndicators();
                    
                    // Update hero gallery active state
                    document.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
                        thumb.classList.toggle('active', index === currentImageIndex);
                    });
                }, 150);
            }
        });
    });

    // Initialize clean purchase functionality
    initializeCleanPurchase();
}

// Clean Purchase Panel Functionality
function initializeCleanPurchase() {
    // Quantity controls
    window.adjustQuantity = function(change) {
        const quantityDisplay = document.getElementById('quantity');
        let currentQuantity = parseInt(quantityDisplay.textContent);
        let newQuantity = Math.max(1, currentQuantity + change);
        
        // Add animation
        quantityDisplay.style.transform = 'scale(0.8)';
        setTimeout(() => {
            quantityDisplay.textContent = newQuantity;
            quantityDisplay.style.transform = 'scale(1)';
        }, 100);
    };

    // Notify me functionality 
    window.notifyMeWhenReady = function() {
        // Redirect to waitlist page
        window.location.href = 'waitlist.html';
    };

    // Add to cart functionality (kept for other buttons)
    window.addToCartClean = async function() {
        const button = document.querySelector('.add-to-cart-clean');
        const selectedSize = document.querySelector('input[name="size"]:checked');
        const quantity = parseInt(document.getElementById('quantity').textContent);

        if (!selectedSize) {
            // Highlight size selection
            const sizeSection = document.querySelector('.size-selection-clean');
            sizeSection.style.background = 'rgba(255, 255, 255, 0.1)';
            sizeSection.style.borderRadius = '12px';
            sizeSection.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            
            setTimeout(() => {
                sizeSection.style.background = '';
                sizeSection.style.borderRadius = '';
                sizeSection.style.border = '';
            }, 1500);
            
            showNotification('Please select a size', 'error');
            return;
        }

        // Add loading state
        button.style.background = 'rgba(0, 0, 0, 0.6)';
        button.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        button.innerHTML = '<span>ADDING...</span><div class="cart-btn-bg"></div>';
        button.disabled = true;

        try {
            // Simulate API call
            await simulateAddToCart({
                product: 'Angry Rooster Power Drape™ Tee',
                size: selectedSize.value,
                quantity: quantity,
                price: 65,
                image: '../front-tshirt.png'
            });

            // Success state
            button.innerHTML = '<span>ADDED ✓</span><div class="cart-btn-bg"></div>';
            button.style.background = 'rgba(34, 197, 94, 0.3)';
            button.style.borderColor = 'rgba(34, 197, 94, 0.6)';
            
            showNotification(`Added ${quantity}x ${selectedSize.value} to cart!`, 'success');
            
            // Reset after delay
            setTimeout(() => {
                button.innerHTML = '<span>ADD TO CART</span><div class="cart-btn-bg"></div>';
                button.style.background = 'rgba(0, 0, 0, 0.4)';
                button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                button.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Add to cart failed:', error);
            showNotification('Failed to add to cart. Please try again.', 'error');
            
            // Reset button
            button.innerHTML = '<span>ADD TO CART</span><div class="cart-btn-bg"></div>';
            button.style.background = 'rgba(0, 0, 0, 0.4)';
            button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            button.disabled = false;
        }
    };

    // Enhanced size selection with animations
    document.querySelectorAll('.size-option-clean').forEach(option => {
        option.addEventListener('click', function() {
            // Add selection animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Quantity button hover effects
    document.querySelectorAll('.qty-btn-clean').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Size Selection Functionality
function initializeSizeSelection() {
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    const sizeLabels = document.querySelectorAll('.size-option');
    
    sizeInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Update UI to reflect selection
            sizeLabels.forEach(label => label.classList.remove('selected'));
            if (this.checked) {
                const label = document.querySelector(`label[for="${this.id}"]`);
                if (label) {
                    label.classList.add('selected');
                }
            }
            
            // Store selected size
            localStorage.setItem('selectedTeeSize', this.value);
            
            // Add subtle animation
            const selectedLabel = document.querySelector(`label[for="${this.id}"]`);
            if (selectedLabel) {
                selectedLabel.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    selectedLabel.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Load previously selected size
    const savedSize = localStorage.getItem('selectedTeeSize');
    if (savedSize) {
        const sizeInput = document.querySelector(`input[value="${savedSize}"]`);
        if (sizeInput) {
            sizeInput.checked = true;
            sizeInput.dispatchEvent(new Event('change'));
        }
    }
}

// Add to Cart Functionality
function initializeAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function() {
            const selectedSize = document.querySelector('input[name="size"]:checked');
            
            if (!selectedSize) {
                showNotification('Please select a size', 'error');
                highlightSizeSection();
                return;
            }
            
            // Show loading state
            this.classList.add('loading');
            this.disabled = true;
            
            try {
                // Simulate API call
                await simulateAddToCart({
                    product: 'Power Drape™ Training Tee',
                    size: selectedSize.value,
                    price: 65,
                    image: '../front-tshirt.png'
                });
                
                // Success feedback
                showNotification('Added to cart successfully!', 'success');
                animateCartIcon();
                
            } catch (error) {
                console.error('Add to cart failed:', error);
                showNotification('Failed to add to cart. Please try again.', 'error');
            } finally {
                // Remove loading state
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                }, 1000);
            }
        });
    }
}

// Wishlist Functionality
function initializeWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    if (wishlistBtn) {
        // Check if item is already in wishlist
        const isInWishlist = localStorage.getItem('tee_in_wishlist') === 'true';
        if (isInWishlist) {
            wishlistBtn.classList.add('active');
        }
        
        wishlistBtn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Remove from wishlist
                this.classList.remove('active');
                localStorage.setItem('tee_in_wishlist', 'false');
                showNotification('Removed from wishlist', 'info');
            } else {
                // Add to wishlist
                this.classList.add('active');
                localStorage.setItem('tee_in_wishlist', 'true');
                showNotification('Added to wishlist', 'success');
                
                // Add heart animation
                animateHeart(this);
            }
        });
    }
}

// Accordion Functionality
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const content = document.getElementById(targetId);
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            accordionHeaders.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                if (content) {
                    content.classList.add('active');
                }
            }
        });
    });
}

// Helper Functions
async function simulateAddToCart(item) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store in localStorage (in real app, this would be an API call)
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.product === item.product && cartItem.size === item.size
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1,
            id: Date.now()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart badge if it exists
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 320px;
        font-weight: 500;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

function highlightSizeSection() {
    const sizeSection = document.querySelector('.size-section');
    if (sizeSection) {
        sizeSection.style.background = 'rgba(255, 255, 255, 0.1)';
        sizeSection.style.borderRadius = '12px';
        sizeSection.style.padding = '32px 20px';
        sizeSection.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        
        setTimeout(() => {
            sizeSection.style.background = '';
            sizeSection.style.borderRadius = '';
            sizeSection.style.padding = '32px 0';
            sizeSection.style.border = '';
        }, 2000);
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

function animateHeart(element) {
    const heart = element.querySelector('svg');
    if (heart) {
        heart.style.transform = 'scale(1.3)';
        heart.style.color = '#ef4444';
        setTimeout(() => {
            heart.style.transform = 'scale(1)';
        }, 200);
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);