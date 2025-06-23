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
            dashboardContainer.style.display = 'block';
            userEmailSpan.textContent = user.email;

            // Generate avatar
            generateAvatar(user.email);
            
            // Add visible class for fade-in animation
            setTimeout(() => dashboardContainer.classList.add('visible'), 50);

        } else {
            // User is logged out
            authContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
            dashboardContainer.classList.remove('visible');
            userEmailSpan.textContent = '';
        }
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