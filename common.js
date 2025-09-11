// common.js - Handles common UI elements across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Apply theme on page load
    applyTheme();
    
    // Add back-to-top button if not present
    addBackToTopButton();
    
    // Add footer if not present
    addFooter();
    
    // Setup event listeners
    setupEventListeners();
});

// Function to apply theme from localStorage
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', savedTheme === 'light' ? '#f5f5f5' : '#0a0a0a');
    } else {
        const newMetaThemeColor = document.createElement('meta');
        newMetaThemeColor.name = 'theme-color';
        newMetaThemeColor.content = savedTheme === 'light' ? '#f5f5f5' : '#0a0a0a';
        document.head.appendChild(newMetaThemeColor);
    }
}

// Function to add back-to-top button if not present
function addBackToTopButton() {
    if (!document.querySelector('.back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('onclick', 'scrollToTop()');
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.setAttribute('title', 'Back to top');
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
}

// Function to add footer if not present
function addFooter() {
    // Skip adding footer on login page
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('sign-up.html')) {
        return;
    }
    
    if (!document.querySelector('.site-footer')) {
        const footer = document.createElement('footer');
        footer.className = 'site-footer footer';
        footer.innerHTML = `
            <div class="footer-content">
                <p>&copy; 2025 PW IOI. All rights reserved. | Empowering the next generation of developers.</p>

                <div class="social-icons">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
                </div>

                <form class="newsletter-form" onsubmit="handleNewsletterSubmit(event)">
                    <input type="email" placeholder="Enter your email for updates" required aria-label="Email for newsletter" />
                    <button type="submit"><i class="fas fa-paper-plane"></i> Subscribe</button>
                </form>

                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                    <a href="#contact">Contact Support</a>
                    <a href="#about">About Us</a>
                </div>
            </div>
        `;
        
        // Insert before any script tags at the end of the body
        const scripts = document.querySelectorAll('body > script');
        if (scripts.length > 0) {
            document.body.insertBefore(footer, scripts[0]);
        } else {
            document.body.appendChild(footer);
        }
    }
}

// Function to setup event listeners
function setupEventListeners() {
    // Back to top button visibility
    window.addEventListener('scroll', function() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    });
}

// Function to scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Newsletter form submission handler
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    console.log(`Newsletter subscription for: ${email}`);
    event.target.reset();
    showToaster('Success! You\'ve been added to our newsletter.', 'success');
}

// Toaster notification function
function showToaster(message, type = 'info') {
    const toasterContainer = document.getElementById('toasterContainer');
    
    // Create toaster container if it doesn't exist
    if (!toasterContainer) {
        const newToasterContainer = document.createElement('div');
        newToasterContainer.className = 'toaster-container';
        newToasterContainer.id = 'toasterContainer';
        document.body.appendChild(newToasterContainer);
    }
    
    const toaster = document.createElement('div');
    toaster.className = `toaster ${type}`;
    toaster.innerHTML = `
        <div class="toaster-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="toaster-message">${message}</div>
        <button class="toaster-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const container = document.getElementById('toasterContainer') || newToasterContainer;
    container.appendChild(toaster);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toaster.parentElement) {
            toaster.classList.add('hide');
            setTimeout(() => toaster.remove(), 300);
        }
    }, 5000);
}