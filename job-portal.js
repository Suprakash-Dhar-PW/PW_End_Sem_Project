// Job Portal System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.job-search-input');
    const searchBtn = document.querySelector('.search-btn');
    const jobListings = document.querySelector('.job-listings');
    const jobAlertBtn = document.querySelector('.job-portal-btn');
    const applyButtons = document.querySelectorAll('.job-apply-btn');
    const saveButtons = document.querySelectorAll('.job-save-btn');
    const shareButtons = document.querySelectorAll('.job-share-btn');
    
    // Initialize job data from localStorage or set defaults
    let jobData = JSON.parse(localStorage.getItem('jobData')) || [
        {
            id: 'job1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Solutions',
            logo: 'laptop-code',
            location: 'Remote',
            salary: '$90k - $120k',
            type: 'Full-time',
            posted: '2 days ago',
            description: 'We are looking for an experienced Frontend Developer with strong React skills to join our growing team. You\'ll be responsible for building user interfaces for our enterprise clients.',
            skills: ['React', 'TypeScript', 'Redux', 'CSS-in-JS'],
            featured: true,
            new: false,
            hot: false,
            category: ['Tech', 'Remote', 'Full-time']
        },
        {
            id: 'job2',
            title: 'Backend Engineer',
            company: 'DataFlow Systems',
            logo: 'database',
            location: 'New York, NY',
            salary: '$100k - $130k',
            type: 'Full-time',
            posted: '1 week ago',
            description: 'Join our backend team to develop scalable APIs and microservices. You\'ll work with our data science team to implement efficient data processing pipelines.',
            skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
            featured: false,
            new: true,
            hot: false,
            category: ['Tech', 'Full-time']
        },
        {
            id: 'job3',
            title: 'UX/UI Designer',
            company: 'Creative Minds Agency',
            logo: 'paint-brush',
            location: 'Remote',
            salary: '$80k - $110k',
            type: 'Full-time',
            posted: '3 days ago',
            description: 'We\'re seeking a talented UX/UI Designer to create beautiful, intuitive interfaces for our clients. You\'ll work closely with our development and product teams.',
            skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
            featured: false,
            new: false,
            hot: true,
            category: ['Design', 'Remote', 'Full-time']
        },
        {
            id: 'job4',
            title: 'Data Science Intern',
            company: 'AI Solutions Inc',
            logo: 'brain',
            location: 'Remote',
            salary: '$30 - $40/hr',
            type: 'Internship',
            posted: '1 day ago',
            description: 'Join our data science team as an intern to work on cutting-edge AI projects. You\'ll gain hands-on experience with machine learning models and data analysis.',
            skills: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics'],
            featured: false,
            new: true,
            hot: false,
            category: ['Tech', 'Remote', 'Internships']
        }
    ];
    
    // Save initial job data if not already in localStorage
    if (!localStorage.getItem('jobData')) {
        localStorage.setItem('jobData', JSON.stringify(jobData));
    }
    
    // Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter job listings based on button text
            filterJobs(this.textContent.trim());
        });
    });
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        searchJobs(searchInput.value.trim());
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchJobs(this.value.trim());
        }
    });
    
    // Job Alert Button
    jobAlertBtn.addEventListener('click', function() {
        showJobAlertModal();
    });
    
    // Apply, Save, and Share buttons
    document.addEventListener('click', function(event) {
        // Apply button
        if (event.target.closest('.job-apply-btn')) {
            const jobCard = event.target.closest('.job-card');
            const jobId = jobCard.dataset.jobId;
            applyForJob(jobId);
        }
        
        // Save button
        if (event.target.closest('.job-save-btn')) {
            const jobCard = event.target.closest('.job-card');
            const jobId = jobCard.dataset.jobId;
            toggleSaveJob(jobId, event.target.closest('.job-save-btn'));
        }
        
        // Share button
        if (event.target.closest('.job-share-btn')) {
            const jobCard = event.target.closest('.job-card');
            const jobId = jobCard.dataset.jobId;
            shareJob(jobId);
        }
    });
    
    // Functions
    function filterJobs(filter) {
        let filteredJobs;
        
        if (filter === 'All Jobs') {
            filteredJobs = jobData;
        } else {
            filteredJobs = jobData.filter(job => {
                return job.category.includes(filter);
            });
        }
        
        renderJobs(filteredJobs);
        updateJobStats(filteredJobs);
    }
    
    function searchJobs(query) {
        if (!query) {
            renderJobs(jobData);
            updateJobStats(jobData);
            return;
        }
        
        const searchTerms = query.toLowerCase().split(' ');
        
        const filteredJobs = jobData.filter(job => {
            const searchableText = `${job.title} ${job.company} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
            return searchTerms.some(term => searchableText.includes(term));
        });
        
        renderJobs(filteredJobs);
        updateJobStats(filteredJobs);
        
        // Show toast notification with search results
        showToast({
            type: filteredJobs.length > 0 ? 'success' : 'info',
            message: filteredJobs.length > 0 
                ? `Found ${filteredJobs.length} job${filteredJobs.length === 1 ? '' : 's'} matching "${query}"` 
                : `No jobs found matching "${query}". Try different keywords.`
        });
    }
    
    function renderJobs(jobs) {
        jobListings.innerHTML = '';
        
        if (jobs.length === 0) {
            jobListings.innerHTML = `
                <div class="no-jobs-found">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = `job-card${job.featured ? ' featured-job' : ''}`;
            jobCard.dataset.jobId = job.id;
            
            // Create tags for job status
            let tagHTML = '';
            if (job.featured) tagHTML += `<span class="job-tag featured">Featured</span>`;
            if (job.new) tagHTML += `<span class="job-tag new">New</span>`;
            if (job.hot) tagHTML += `<span class="job-tag hot">Hot</span>`;
            if (job.type === 'Internship') tagHTML += `<span class="job-tag internship">Internship</span>`;
            
            jobCard.innerHTML = `
                <div class="job-card-header">
                    <div class="job-title-container">
                        <div class="company-logo">
                            <i class="fas fa-${job.logo}"></i>
                        </div>
                        <div>
                            <h3 class="job-title">${job.title}</h3>
                            <div class="job-company">${job.company}</div>
                        </div>
                        ${tagHTML}
                    </div>
                </div>
                <div class="job-details">
                    <span class="job-detail"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span class="job-detail"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                    <span class="job-detail"><i class="fas fa-clock"></i> ${job.type}</span>
                    <span class="job-detail"><i class="fas fa-calendar-alt"></i> Posted ${job.posted}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-tags">
                    ${job.skills.map(skill => `<span class="job-skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="job-actions">
                    <button class="job-apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</button>
                    <button class="job-save-btn"><i class="far fa-bookmark"></i></button>
                    <button class="job-share-btn"><i class="fas fa-share-alt"></i></button>
                </div>
            `;
            
            jobListings.appendChild(jobCard);
        });
    }
    
    function updateJobStats(jobs) {
        // Update job statistics cards
        const availableJobs = jobs.length;
        const companiesHiring = new Set(jobs.map(job => job.company)).size;
        const techPositions = jobs.filter(job => job.category.includes('Tech')).length;
        const remoteJobs = jobs.filter(job => job.category.includes('Remote')).length;
        const remotePercentage = Math.round((remoteJobs / availableJobs) * 100) || 0;
        
        // Update the stats cards
        const statsCards = document.querySelectorAll('.job-portal-card .card-value');
        if (statsCards.length >= 4) {
            statsCards[0].textContent = availableJobs.toLocaleString();
            statsCards[1].textContent = companiesHiring.toLocaleString();
            statsCards[2].textContent = techPositions.toLocaleString();
            statsCards[3].textContent = `${remotePercentage}%`;
        }
    }
    
    function applyForJob(jobId) {
        const job = jobData.find(j => j.id === jobId);
        if (!job) return;
        
        // In a real application, this would open an application form or redirect to an application page
        // For this demo, we'll just show a toast notification
        showToast({
            type: 'success',
            message: `Application submitted for ${job.title} at ${job.company}!`,
            duration: 5000
        });
    }
    
    function toggleSaveJob(jobId, button) {
        // Get saved jobs from localStorage
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const isJobSaved = savedJobs.includes(jobId);
        
        if (isJobSaved) {
            // Remove job from saved jobs
            const updatedSavedJobs = savedJobs.filter(id => id !== jobId);
            localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
            
            // Update button icon
            button.innerHTML = '<i class="far fa-bookmark"></i>';
            
            showToast({
                type: 'info',
                message: 'Job removed from saved jobs',
                duration: 3000
            });
        } else {
            // Add job to saved jobs
            savedJobs.push(jobId);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            
            // Update button icon
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
            
            showToast({
                type: 'success',
                message: 'Job saved! You can view it later in your profile.',
                duration: 3000
            });
        }
    }
    
    function shareJob(jobId) {
        const job = jobData.find(j => j.id === jobId);
        if (!job) return;
        
        // In a real application, this would open a share dialog with social media options
        // For this demo, we'll simulate copying a link to clipboard
        
        // Create a dummy text area to copy the text
        const textArea = document.createElement('textarea');
        textArea.value = `Check out this job: ${job.title} at ${job.company}! Apply now at https://example.com/jobs/${jobId}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast({
            type: 'success',
            message: 'Job link copied to clipboard!',
            duration: 3000
        });
    }
    
    function showJobAlertModal() {
        // In a real application, this would open a modal to set job alerts
        // For this demo, we'll just show a toast notification
        showToast({
            type: 'info',
            message: 'Job alerts feature coming soon!',
            duration: 3000
        });
    }
    
    function showToast({ type, message, duration = 3000 }) {
        // Use the existing toaster function from index.js
        if (typeof showToaster === 'function') {
            showToaster(type, message, duration);
        } else {
            // Fallback if the global function is not available
            alert(message);
        }
    }
    
    // Initialize the job portal
    function initJobPortal() {
        renderJobs(jobData);
        updateJobStats(jobData);
        
        // Mark saved jobs
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        savedJobs.forEach(jobId => {
            const saveButton = document.querySelector(`.job-card[data-job-id="${jobId}"] .job-save-btn`);
            if (saveButton) {
                saveButton.innerHTML = '<i class="fas fa-bookmark"></i>';
            }
        });
    }
    
    // Initialize the job portal when the page loads
    initJobPortal();
    
    // Scroll to top function
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Show back-to-top button when scrolling down
    window.addEventListener('scroll', function() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Handle newsletter submission
    window.handleNewsletterSubmit = function(event) {
        event.preventDefault();
        const emailInput = event.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            // Here you would typically send the email to your server
            // For now, we'll just show a success message
            showToast({
                type: 'success',
                message: 'Thank you for subscribing to our newsletter!',
                duration: 5000
            });
            emailInput.value = '';
        }
    };
});