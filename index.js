// Loading animation
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loadingOverlay').classList.add('hidden');
            }, 1000);
        });

        // Sidebar functionality
        function toggleSidebar() {
            const sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("collapsed");
            document.body.classList.toggle("show-floating-logo");
            
            // Store sidebar state
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        }

        // Mobile sidebar functionality
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        }

        function closeMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Restore sidebar state
        document.addEventListener('DOMContentLoaded', () => {
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed && window.innerWidth > 768) {
                document.getElementById("sidebar").classList.add("collapsed");
                document.body.classList.add("show-floating-logo");
            }
        });

        // Profile navigation
        function goToProfile() {
            window.location.href = "profile.html";
        }

        // Auth functions
        function showLoginModal() {
            window.location.href = "login.html";
        }

        function showSignupModal() {
            window.location.href = "sign-up.html";
        }

        // Toaster Notification System
        function showToaster(type, title, message, duration = 4000) {
            const container = document.getElementById('toasterContainer');
            const toaster = document.createElement('div');
            toaster.className = `toaster ${type}`;
            
            const iconMap = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            
            toaster.innerHTML = `
                <i class="toaster-icon ${iconMap[type] || iconMap.info}"></i>
                <div class="toaster-content">
                    <div class="toaster-title">${title}</div>
                    <div class="toaster-message">${message}</div>
                </div>
                <button class="toaster-close" onclick="closeToaster(this.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(toaster);
            
            // Trigger animation
            setTimeout(() => {
                toaster.classList.add('show');
            }, 10);
            
            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    closeToaster(toaster);
                }, duration);
            }
            
            return toaster;
        }
        
        function closeToaster(toaster) {
            toaster.classList.remove('show');
            setTimeout(() => {
                if (toaster.parentElement) {
                    toaster.parentElement.removeChild(toaster);
                }
            }, 400);
        }

        // Newsletter subscription
        function handleNewsletterSubmit(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            
            // Simulate API call
            const button = event.target.querySelector('button');
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                showToaster(
                    'success',
                    'Subscription Successful!',
                    `Thank you for subscribing with ${email}! You'll receive updates soon.`
                );
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    event.target.reset();
                }, 2000);
            }, 1500);
        }

        // Smooth scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            const backToTop = document.querySelector('.back-to-top');
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        // Navigation link highlighting
        document.addEventListener('DOMContentLoaded', () => {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Close mobile sidebar when link is clicked
                    if (window.innerWidth <= 768) {
                        closeMobileSidebar();
                    }
                });
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.querySelector('.mobile-menu-toggle');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target) && 
                sidebar.classList.contains('open')) {
                closeMobileSidebar();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('sidebar');
                if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                    closeMobileSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Add smooth hover effects for progress bars
        document.addEventListener('DOMContentLoaded', () => {
            const studentCard = document.querySelector('.student-card');
            const progressBars = document.querySelectorAll('.progress');
            
            if (studentCard && progressBars.length > 0) {
                studentCard.addEventListener('mouseenter', () => {
                    progressBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transform = 'scaleX(1)';
                        }, index * 100);
                    });
                });
            }
        });

        // Touch events for better mobile interaction
        let startY = 0;
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const sidebar = document.getElementById('sidebar');
            
            // Prevent page scroll when sidebar is open on mobile
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target)) {
                    e.preventDefault();
                }
            }
        });

        // Smooth animations for mobile
        document.addEventListener('DOMContentLoaded', () => {
            // Add touch-friendly classes for mobile devices
            if ('ontouchstart' in window) {
                document.body.classList.add('touch-device');
            }
        });