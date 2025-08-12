// main.js - for site-wide scripts

document.addEventListener('DOMContentLoaded', () => {
    // Standardize loader across pages. If the page has a dedicated intro (#introScreen),
    // skip this logic and let the page-specific script handle it.
    const loadingScreen = document.getElementById('loadingScreen');
    const introScreen = document.getElementById('introScreen');
    if (loadingScreen && !introScreen) {
        let hasHidden = false;
        const hideLoading = () => {
            if (hasHidden) return;
            hasHidden = true;
            // Smooth fade and cleanup
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = '';
            }, 800);
        };

        // Prevent scroll while loader is visible
        document.body.style.overflow = 'hidden';

        // Luxury pacing: keep loader visible briefly, then fade
        setTimeout(hideLoading, 1200);
        // Also hide when the full page load event fires (secondary trigger)
        window.addEventListener('load', hideLoading, { once: true });
        // Absolute fallback in case of slow/failed assets
        setTimeout(hideLoading, 5000);
    }



    // Navbar Scroll Effects (if navbar exists)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu (injects a toggle and slide-in panel on small screens)
    const MOBILE_MAX_WIDTH = 768;
    let mobileMenuInitialized = false;
    let mobileToggleBtn;
    let mobileMenuPanel;
    let mobileMenuBackdrop;
    let previousActiveElement;

    function closeMobileMenu() {
        document.body.classList.remove('mobile-menu-open');
        if (mobileToggleBtn) mobileToggleBtn.classList.remove('active');
        if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
        // Restore focus back to toggle for accessibility
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    }

    function destroyMobileMenu() {
        closeMobileMenu();
        if (mobileToggleBtn && mobileToggleBtn.parentNode) {
            mobileToggleBtn.parentNode.removeChild(mobileToggleBtn);
        }
        if (mobileMenuPanel && mobileMenuPanel.parentNode) {
            mobileMenuPanel.parentNode.removeChild(mobileMenuPanel);
        }
        if (mobileMenuBackdrop && mobileMenuBackdrop.parentNode) {
            mobileMenuBackdrop.parentNode.removeChild(mobileMenuBackdrop);
        }
        mobileToggleBtn = null;
        mobileMenuPanel = null;
        mobileMenuBackdrop = null;
        mobileMenuInitialized = false;
    }

    function initMobileMenu() {
        if (mobileMenuInitialized) return;
        const navContainer = document.querySelector('.navbar .nav-container');
        if (!navContainer) return;

        // Toggle button
        mobileToggleBtn = document.createElement('button');
        mobileToggleBtn.className = 'mobile-menu-toggle';
        mobileToggleBtn.setAttribute('aria-label', 'Toggle menu');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileToggleBtn.setAttribute('aria-haspopup', 'true');
        mobileToggleBtn.innerHTML = '<span class="bar"></span>';
        navContainer.appendChild(mobileToggleBtn);

        // Backdrop and Panel
        mobileMenuBackdrop = document.createElement('div');
        mobileMenuBackdrop.className = 'mobile-menu-backdrop';
        mobileMenuPanel = document.createElement('div');
        mobileMenuPanel.className = 'mobile-menu-panel';
        mobileMenuPanel.id = 'mobileMenuPanel';
        mobileToggleBtn.setAttribute('aria-controls', 'mobileMenuPanel');
        mobileMenuPanel.setAttribute('role', 'dialog');
        mobileMenuPanel.setAttribute('aria-modal', 'true');

        document.body.appendChild(mobileMenuBackdrop);
        document.body.appendChild(mobileMenuPanel);

        // Collect existing nav links from left and right groups
        const sourceLinks = document.querySelectorAll('.nav-left a, .nav-right a');
        sourceLinks.forEach((link) => {
            const cloned = link.cloneNode(true);
            // Ensure target attributes preserved; open externals in new tab remains
            cloned.addEventListener('click', () => {
                // Close menu on navigation
                closeMobileMenu();
            });
            mobileMenuPanel.appendChild(cloned);
        });

        // Handlers
        mobileToggleBtn.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('mobile-menu-open');
            mobileToggleBtn.classList.toggle('active', isOpen);
            mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) {
                previousActiveElement = document.activeElement;
                // Focus first focusable link inside panel
                const focusable = mobileMenuPanel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                if (focusable.length > 0) {
                    focusable[0].focus();
                } else {
                    mobileMenuPanel.setAttribute('tabindex', '-1');
                    mobileMenuPanel.focus();
                }
            }
        });
        mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

        // Focus trap and Escape-to-close
        document.addEventListener('keydown', (e) => {
            if (!document.body.classList.contains('mobile-menu-open')) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                closeMobileMenu();
                return;
            }
            if (e.key === 'Tab') {
                const focusable = mobileMenuPanel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        mobileMenuInitialized = true;
    }

    function handleResponsiveMenu() {
        if (window.innerWidth <= MOBILE_MAX_WIDTH) {
            initMobileMenu();
        } else if (mobileMenuInitialized) {
            destroyMobileMenu();
        }
    }

    // Initialize on load and on resize
    handleResponsiveMenu();
    window.addEventListener('resize', () => {
        // Throttle with requestAnimationFrame to avoid jank
        window.requestAnimationFrame(handleResponsiveMenu);
    });
}); 