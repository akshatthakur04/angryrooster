// account.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutButton = document.getElementById('logout-button');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginWrapper = document.getElementById('login-form-wrapper');
    const signupWrapper = document.getElementById('signup-form-wrapper');
    
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const userEmailSpan = document.getElementById('user-email');
    const messageContainer = document.getElementById('message-container');

    // Redesigned Dashboard Elements
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editModalOverlay = document.getElementById('edit-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const updatePasswordForm = document.getElementById('update-password-form');
    const modalMessageContainer = document.getElementById('modal-message-container');

    // --- HELPER FUNCTIONS ---

    function showMessage(message, isError = false) {
        messageContainer.textContent = message;
        messageContainer.style.backgroundColor = isError ? '#d9534f' : '#000000';
        messageContainer.classList.add('visible');
        setTimeout(() => {
            messageContainer.classList.remove('visible');
        }, 3000);
    }

    function toggleAuthForms(show) {
        if (show === 'signup') {
            loginWrapper.style.display = 'none';
            signupWrapper.style.display = 'block';
        } else {
            signupWrapper.style.display = 'none';
            loginWrapper.style.display = 'block';
        }
    }

    // --- UI EVENT LISTENERS ---

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms('signup');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms('login');
    });

    // --- MODAL VISIBILITY ---
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            editModalOverlay.classList.add('visible');
            editModalOverlay.style.display = 'flex'; // Make sure it's visible
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            editModalOverlay.classList.remove('visible');
        });
    }
    
    if (editModalOverlay) {
        editModalOverlay.addEventListener('click', (e) => {
            if (e.target === editModalOverlay) {
                editModalOverlay.classList.remove('visible');
            }
        });
    }

    // --- SUPABASE AUTH LOGIC ---

    // Sign up a new user
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const { data, error } = await supabaseClient.auth.signUp({ email, password });

        if (error) {
            showMessage(error.message, true);
        } else {
            showMessage('Success! Please check your email to verify your account.');
            toggleAuthForms('login');
            signupForm.reset();
        }
    });

    // Log in an existing user
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            showMessage(error.message, true);
        } else {
            updateUI(data.user);
            loginForm.reset();
        }
    });

    // Handle Password Update
    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        modalMessageContainer.textContent = '';

        const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

        if (error) {
            modalMessageContainer.textContent = `Error: ${error.message}`;
            modalMessageContainer.style.color = '#ff6b6b';
        } else {
            modalMessageContainer.textContent = 'Password updated successfully!';
            modalMessageContainer.style.color = '#6bff94';
            updatePasswordForm.reset();
            setTimeout(() => {
                editModalOverlay.classList.remove('visible');
                modalMessageContainer.textContent = '';
            }, 2000);
        }
    });

    // Log out the current user
    logoutButton.addEventListener('click', async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            showMessage(error.message, true);
        } else {
            updateUI(null);
        }
    });

    // --- SESSION & UI MANAGEMENT ---

    // Check for an active session on page load
    async function checkSession() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            updateUI(session.user);
        } else {
            updateUI(null);
            // Check for #signup hash
            if (window.location.hash === '#signup') {
                toggleAuthForms('signup');
            }
        }
    }

    // Update the UI based on auth state
    function updateUI(user) {
        if (user) {
            // User is logged in
            authContainer.style.display = 'none';
            dashboardContainer.style.display = 'grid';
            userEmailSpan.textContent = user.email;

            // Generate avatar
            generateAvatar(user.email);
            
            // Add visible class for fade-in animation with stagger effect
            setTimeout(() => {
                dashboardContainer.classList.add('visible');
                
                // Stagger animation for dashboard cards
                const cards = dashboardContainer.querySelectorAll('.dashboard-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 200 * (index + 1));
                });

                // Animate stat values counting up
                setTimeout(() => {
                    animateStats();
                    initializeQuoteRotation();
                }, 800);
            }, 50);

        } else {
            // User is logged out
            authContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
            dashboardContainer.classList.remove('visible');
            userEmailSpan.textContent = '';
        }
    }

    // Animate statistics counting up
    function animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
            const finalValue = stat.textContent;
            if (finalValue.includes('%')) {
                // Skip percentage values
                return;
            }
            
            if (!isNaN(parseInt(finalValue))) {
                const target = parseInt(finalValue);
                let current = 0;
                const increment = target / 30; // 30 frames
                
                function updateCount() {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                    } else {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCount);
                    }
                }
                
                setTimeout(() => {
                    stat.textContent = '0';
                    updateCount();
                }, index * 200);
            }
        });
    }

    // Rotate motivational quotes
    function initializeQuoteRotation() {
        const quotes = [
            { quote: "Excellence isn't a skill, it's an attitude", author: "— The Rooster Mindset" },
            { quote: "Discipline before daylight. Power before praise.", author: "— Angry Rooster Creed" },
            { quote: "The only bad workout is the one that didn't happen", author: "— Champions Daily" },
            { quote: "Your strongest muscle and worst enemy is your mind", author: "— Mental Warfare" },
            { quote: "Pain is weakness leaving the body", author: "— Forge Philosophy" }
        ];

        const quoteElement = document.querySelector('.motivation-quote');
        const authorElement = document.querySelector('.motivation-author');
        
        if (!quoteElement || !authorElement) return;

        let currentIndex = 0;

        function rotateQuote() {
            currentIndex = (currentIndex + 1) % quotes.length;
            
            // Fade out
            quoteElement.style.opacity = '0';
            authorElement.style.opacity = '0';
            
            setTimeout(() => {
                quoteElement.textContent = quotes[currentIndex].quote;
                authorElement.textContent = quotes[currentIndex].author;
                
                // Fade in
                quoteElement.style.transition = 'opacity 0.5s ease';
                authorElement.style.transition = 'opacity 0.5s ease';
                quoteElement.style.opacity = '1';
                authorElement.style.opacity = '1';
            }, 250);
        }

        // Start rotation after 5 seconds, then every 8 seconds
        setTimeout(() => {
            setInterval(rotateQuote, 8000);
        }, 5000);
    }

    // --- DASHBOARD ENHANCEMENT FUNCTIONS ---

    function generateAvatar(email) {
        const avatar = document.getElementById('profile-avatar');
        if (avatar) {
            const initial = email ? email.charAt(0).toUpperCase() : '?';
            avatar.textContent = initial;
        }
    }
    
    // Initial check
    checkSession();
}); 