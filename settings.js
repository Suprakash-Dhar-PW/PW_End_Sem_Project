// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check if user previously set a theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply the saved theme or default to dark
    applyTheme(currentTheme);
    
    // Update toggle switch position based on current theme
    themeSwitch.checked = currentTheme === 'light';
    
    // Add event listener for theme toggle
    themeSwitch.addEventListener('change', function() {
        const theme = this.checked ? 'light' : 'dark';
        applyTheme(theme);
        localStorage.setItem('theme', theme);
        
        // Show theme change notification
        showToaster(
            'info',
            `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme Activated`,
            `The ${theme} theme has been applied to all pages.`
        );
    });
});

// Function to apply theme to document
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'light' ? '#f5f5f5' : '#0a0a0a');
    } else {
        const newMetaThemeColor = document.createElement('meta');
        newMetaThemeColor.name = 'theme-color';
        newMetaThemeColor.content = theme === 'light' ? '#f5f5f5' : '#0a0a0a';
        document.head.appendChild(newMetaThemeColor);
    }
}

// Apply theme on page load for all pages
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Settings Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Profile Information Edit Button
    const profileEditBtn = document.querySelector('.setting-item:nth-child(1) .settings-btn');
    if (profileEditBtn) {
        profileEditBtn.addEventListener('click', () => {
            showToaster(
                'info',
                'Edit Profile',
                'Profile editing functionality will be implemented soon.'
            );
        });
    }
    
    // Password Change Button
    const passwordChangeBtn = document.querySelector('.setting-item:nth-child(2) .settings-btn');
    if (passwordChangeBtn) {
        passwordChangeBtn.addEventListener('click', () => {
            showToaster(
                'info',
                'Change Password',
                'Password change functionality will be implemented soon.'
            );
        });
    }
    
    // Email Update Button
    const emailUpdateBtn = document.querySelector('.setting-item:nth-child(3) .settings-btn');
    if (emailUpdateBtn) {
        emailUpdateBtn.addEventListener('click', () => {
            showToaster(
                'info',
                'Update Email',
                'Email update functionality will be implemented soon.'
            );
        });
    }
    
    // Toggle Switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h3').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            
            showToaster(
                this.checked ? 'success' : 'info',
                `${settingName} ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                `${settingName} has been ${status}.`
            );
        });
    });
    
    // Language Select
    const languageSelect = document.querySelector('.setting-item:nth-child(1) .settings-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.options[this.selectedIndex].text;
            
            showToaster(
                'success',
                'Language Updated',
                `Language has been changed to ${selectedLanguage}.`
            );
        });
    }
    
    // Time Zone Select
    const timezoneSelect = document.querySelector('.setting-item:nth-child(2) .settings-select');
    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', function() {
            const selectedTimezone = this.options[this.selectedIndex].text;
            
            showToaster(
                'success',
                'Time Zone Updated',
                `Time zone has been changed to ${selectedTimezone}.`
            );
        });
    }
});