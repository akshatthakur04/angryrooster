// Waitlist Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        // Basic validation
        if (!name || !email || !password) {
            showError('Please fill in all fields.');
            return;
        }

        if (password.length < 8) {
            showError('Password must be at least 8 characters long.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Show loading state
        setLoadingState(true);
        hideMessages();

        try {
            // Sign up user with Supabase
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        waitlist: true,
                        waitlist_joined_at: new Date().toISOString()
                    }
                }
            });

            if (error) {
                throw error;
            }

            // Success - show success message
            setLoadingState(false);
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Add success animation to card
            const card = document.querySelector('.waitlist-card');
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);

        } catch (error) {
            setLoadingState(false);
            
            // Handle specific error messages
            let errorMsg = 'Something went wrong. Please try again.';
            
            if (error.message.includes('already registered')) {
                errorMsg = 'This email is already registered. Try logging in instead.';
            } else if (error.message.includes('weak password')) {
                errorMsg = 'Password is too weak. Please choose a stronger password.';
            } else if (error.message.includes('invalid email')) {
                errorMsg = 'Please enter a valid email address.';
            } else if (error.message.includes('network')) {
                errorMsg = 'Network error. Please check your connection and try again.';
            }
            
            showError(errorMsg);
        }
    });

    // Helper functions
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            form.classList.add('submitting');
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            form.classList.remove('submitting');
        }
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Scroll error into view
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        input.addEventListener('input', function() {
            // Clear error styling on input
            this.style.borderColor = '';
            hideMessages();
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'password':
                isValid = value.length >= 8;
                break;
            default:
                isValid = value.length > 0;
        }

        // Visual feedback
        if (!isValid && value.length > 0) {
            input.style.borderColor = '#dc2626';
        } else {
            input.style.borderColor = '';
        }
    }

    // Enhanced form animations
    const card = document.querySelector('.waitlist-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    if (card) {
        observer.observe(card);
    }

    // Feature items animation
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });

    // Smooth scroll for back to home button
    const backHomeBtn = document.querySelector('.back-home-btn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', function(e) {
            // Let the default navigation happen
            // This adds a nice transition effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = this.href;
            }, 150);
        });
    }
});

// Page load animations
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.waitlist-title');
    const heroSubtitle = document.querySelector('.waitlist-subtitle');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 400);
    }
});