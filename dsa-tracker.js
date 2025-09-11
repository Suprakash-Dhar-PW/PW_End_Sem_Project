// dsa-tracker.js - Handles DSA tracker functionality

document.addEventListener('DOMContentLoaded', function() {
    // Hide loading overlay when page is loaded
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    // Initialize platform progress circles
    initializeProgressCircles();
});

function initializeProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    progressCircles.forEach(circle => {
        const progress = circle.getAttribute('data-progress');
        const circlePath = circle.querySelector('.circle');
        
        if (circlePath) {
            circlePath.setAttribute('stroke-dasharray', `${progress}, 100`);
        }
    });
}