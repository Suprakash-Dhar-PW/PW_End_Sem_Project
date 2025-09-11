// Attendance System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Initialize attendance data from localStorage or set defaults
    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    
    // If no data exists, create some sample data
    if (attendanceData.length === 0) {
        attendanceData = generateSampleData();
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    }
    
    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter data based on button text
            filterAttendanceData(this.textContent.trim());
        });
    });
    
    // Functions
    function handleSaveAttendance() {
        // Validate form
        if (!studentSelect.value || !courseSelect.value || !dateInput.value || !statusSelect.value) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create attendance record
        const attendanceRecord = {
            id: generateId(),
            studentId: studentSelect.value,
            studentName: studentSelect.options[studentSelect.selectedIndex].text,
            courseId: courseSelect.value,
            courseName: courseSelect.options[courseSelect.selectedIndex].text,
            date: dateInput.value,
            status: statusSelect.value,
            timestamp: new Date().toISOString()
        };
        
        // Add to attendance data
        attendanceData.push(attendanceRecord);
        
        // Save to localStorage
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
        
        // Update UI
        updateAttendanceStats();
        updateCourseAttendance();
        
        // Reset form
        resetForm();
        
        // Show success message
        alert('Attendance recorded successfully!');
    }
    
    function resetForm() {
        studentSelect.value = '';
        courseSelect.value = '';
        statusSelect.value = '';
        dateInput.value = formattedDate;
    }
    
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    // Function to generate a unique ID for attendance records
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    }
    
    function generateSampleData() {
        // Sample data for demonstration purposes
        const students = [
            { id: '1', name: 'Saurabh Mukherjee' },
            { id: '2', name: 'Rahul Sharma' },
            { id: '3', name: 'Priya Patel' }
        ];
        
        const courses = [
            { id: 'html', name: 'HTML' },
            { id: 'css', name: 'CSS' },
            { id: 'c', name: 'C Language' },
            { id: 'comm', name: 'Tech Comm.' },
            { id: 'comp', name: 'Computer Fundamentals' }
        ];
        
        const instructors = [
            'Dr. Rajesh Kumar',
            'Prof. Anita Desai',
            'Dr. Vikram Mehta',
            'Prof. Sunita Sharma'
        ];
        
        const statuses = ['present', 'present', 'present', 'present', 'absent', 'late']; // Weighted for more present
        
        // Generate dates for the last 30 days
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            // Skip weekends
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        
        // Generate sample attendance records
        const sampleData = [];
        
        // For each student
        students.forEach(student => {
            // For each date
            dates.forEach(date => {
                // For each course (randomly select 2-4 courses per day)
                const dailyCourses = [...courses];
                shuffleArray(dailyCourses);
                const coursesForDay = dailyCourses.slice(0, Math.floor(Math.random() * 3) + 2);
                
                coursesForDay.forEach(course => {
                    const status = statuses[Math.floor(Math.random() * statuses.length)];
                    const instructor = instructors[Math.floor(Math.random() * instructors.length)];
                    
                    sampleData.push({
                        id: generateUniqueId(),
                        studentId: student.id,
                        studentName: student.name,
                        courseId: course.id,
                        courseName: course.name,
                        date: date,
                        status: status,
                        instructor: instructor,
                        timestamp: new Date().toISOString()
                    });
                });
            });
        });
        
        return sampleData;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function updateAttendanceStats() {
    // Calculate overall attendance percentage
    const totalClasses = attendanceData.length;
    const presentClasses = attendanceData.filter(record => record.status === 'present').length;
    const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    // Calculate warnings (attendance below 75%)
    const studentAttendance = {};
    attendanceData.forEach(record => {
        if (!studentAttendance[record.studentId]) {
            studentAttendance[record.studentId] = {
                total: 0,
                present: 0,
                name: record.studentName
            };
        }
        
        studentAttendance[record.studentId].total++;
        if (record.status === 'present') {
            studentAttendance[record.studentId].present++;
        }
    });
    
    const warnings = Object.values(studentAttendance).filter(student => {
        return student.total > 0 && (student.present / student.total) < 0.75;
    }).length;
    
    // Update UI
    document.querySelector('.attendance-stats .attendance-card:nth-child(1) .attendance-value').textContent = `${overallPercentage}%`;
    document.querySelector('.attendance-stats .attendance-card:nth-child(2) .attendance-value').textContent = warnings;
    document.querySelector('.attendance-stats .attendance-card:nth-child(2) .attendance-subtitle').textContent = 
        warnings === 0 ? 'No warnings issued' : `${warnings} student(s) below 75%`;
    document.querySelector('.attendance-stats .attendance-card:nth-child(3) .attendance-value').textContent = totalClasses;
    document.querySelector('.attendance-stats .attendance-card:nth-child(3) .attendance-subtitle').textContent = 
        `Attended: ${presentClasses}`;
    
    // Initialize attendance chart with weekly data by default
    initializeAttendanceChart('weekly');
}

function updateCourseAttendance() {
    // Calculate course-wise attendance
    const courseAttendance = {};
    
    attendanceData.forEach(record => {
        if (!courseAttendance[record.courseId]) {
            courseAttendance[record.courseId] = {
                total: 0,
                present: 0,
                name: record.courseName
            };
        }
        
        courseAttendance[record.courseId].total++;
        if (record.status === 'present') {
            courseAttendance[record.courseId].present++;
        }
    });
    
    // Generate HTML for course attendance
    const courseAttendanceContainer = document.querySelector('.course-attendance');
    let courseHTML = '<h3 class="course-title">Course-wise Attendance</h3>';
    
    Object.entries(courseAttendance).forEach(([courseId, data]) => {
        const percentage = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
        let iconClass = '';
        let progressColor = '';
        
        // Set color based on percentage
        if (percentage < 75) {
            progressColor = '#FF5252'; // Red for warning
        } else if (percentage < 85) {
            progressColor = '#FFC107'; // Yellow for caution
        } else {
            progressColor = '#4CAF50'; // Green for good
        }
        
        // Assign icon based on course name
        if (data.name.toLowerCase().includes('html')) {
            iconClass = 'fab fa-html5';
        } else if (data.name.toLowerCase().includes('css')) {
            iconClass = 'fab fa-css3-alt';
        } else if (data.name.toLowerCase().includes('c language')) {
            iconClass = 'fas fa-code';
        } else if (data.name.toLowerCase().includes('tech comm')) {
            iconClass = 'fas fa-comments';
        } else {
            iconClass = 'fas fa-book';
        }
        
        courseHTML += `
            <div class="course-item">
                <div class="course-header">
                    <span class="course-name"><i class="${iconClass}"></i> ${data.name}</span>
                    <span class="course-percentage">${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%; background-color: ${progressColor};"></div>
                </div>
            </div>
        `;
    });
    
    courseAttendanceContainer.innerHTML = courseHTML;
}

function initializeAttendanceChart(period) {
    // Get the canvas element
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Define chart data based on selected period
    let labels, datasets;
    
    // Calculate actual attendance data from the records
    const courseData = calculateCourseAttendanceData(period);
    
    if (period === 'weekly') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        datasets = Object.keys(courseData).map(course => {
            let color;
            switch(course) {
                case 'HTML': color = '#E44D26'; break;
                case 'CSS': color = '#264DE4'; break;
                case 'C Language': color = '#A8B9CC'; break;
                case 'Tech Comm.': color = '#00C853'; break;
                default: color = '#' + Math.floor(Math.random()*16777215).toString(16);
            }
            
            return {
                label: course,
                data: courseData[course] || [0, 0, 0, 0],
                borderColor: color,
                backgroundColor: color.replace(')', ', 0.1)').replace('#', 'rgba('),
                tension: 0.4
            };
        });
    } else if (period === 'monthly') {
        labels = ['August', 'September', 'October', 'November'];
        datasets = Object.keys(courseData).map(course => {
            let color;
            switch(course) {
                case 'HTML': color = '#E44D26'; break;
                case 'CSS': color = '#264DE4'; break;
                case 'C Language': color = '#A8B9CC'; break;
                case 'Tech Comm.': color = '#00C853'; break;
                default: color = '#' + Math.floor(Math.random()*16777215).toString(16);
            }
            
            return {
                label: course,
                data: courseData[course] || [0, 0, 0, 0],
                borderColor: color,
                backgroundColor: color.replace(')', ', 0.1)').replace('#', 'rgba('),
                tension: 0.4
            };
        });
    } else { // daily
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        datasets = [
            {
                label: 'Attendance',
                data: courseData['Overall'] || [0, 0, 0, 0, 0],
                borderColor: '#4285F4',
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                tension: 0.4
            }
        ];
    }
    
    // Check if chart already exists and destroy it
    if (window.attendanceChart instanceof Chart) {
        window.attendanceChart.destroy();
    }
    
    // Create new chart
    window.attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function calculateCourseAttendanceData(period) {
    // Group attendance data by course and period
    const courseData = {};
    
    // Get current date for reference
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Process attendance records
    attendanceData.forEach(record => {
        const recordDate = new Date(record.date);
        const courseName = record.courseName;
        
        // Skip future dates
        if (recordDate > today) return;
        
        if (!courseData[courseName]) {
            courseData[courseName] = period === 'daily' ? [0, 0, 0, 0, 0] : 
                                    period === 'weekly' ? [0, 0, 0, 0] : 
                                    [0, 0, 0, 0];
        }
        
        if (!courseData['Overall']) {
            courseData['Overall'] = period === 'daily' ? [0, 0, 0, 0, 0] : 
                                  period === 'weekly' ? [0, 0, 0, 0] : 
                                  [0, 0, 0, 0];
        }
        
        let index = 0;
        
        if (period === 'daily') {
            // Group by day of week (0 = Monday, 4 = Friday)
            index = recordDate.getDay() - 1;
            if (index < 0 || index > 4) return; // Skip weekends
        } else if (period === 'weekly') {
            // Group by week (last 4 weeks)
            const weekDiff = Math.floor((today - recordDate) / (7 * 24 * 60 * 60 * 1000));
            if (weekDiff >= 4) return; // Only consider last 4 weeks
            index = 3 - weekDiff; // Reverse index (most recent week = last index)
        } else if (period === 'monthly') {
            // Group by month (last 4 months)
            const monthDiff = (currentMonth - recordDate.getMonth() + 12) % 12;
            if (monthDiff >= 4) return; // Only consider last 4 months
            index = 3 - monthDiff; // Reverse index (most recent month = last index)
        }
        
        // Count attendance for the course
        if (record.status === 'present') {
            courseData[courseName][index]++;
            courseData['Overall'][index]++;
        }
    });
    
    // Convert counts to percentages
    Object.keys(courseData).forEach(course => {
        courseData[course] = courseData[course].map(count => {
            // If no data, return 0
            if (count === 0) return 0;
            // Otherwise, calculate a percentage (for demo purposes)
            return Math.min(100, Math.max(0, count * 5 + 60));
        });
    });
    
    return courseData;
}

function filterAttendanceData(filter) {
    // Implement filtering logic based on selected filter
    // For now, just update the UI with all data
    updateAttendanceStats();
    updateCourseAttendance();
    
    // Update date information in filter buttons
    updateDateInfo(filter.toLowerCase());
    
    // Update chart based on filter
    if (filter === 'Daily') {
        initializeAttendanceChart('daily');
    } else if (filter === 'Weekly') {
        initializeAttendanceChart('weekly');
    } else if (filter === 'Monthly') {
        initializeAttendanceChart('monthly');
    }
}

function updateDateInfo(filter) {
    // Get current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    // Format dates for different views
    const dailyDate = today.toLocaleDateString('en-US', options);
    
    // Calculate week start and end
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday of current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of current week
    const weeklyDate = `${weekStart.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}-${weekEnd.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
    
    // Format month
    const monthlyDate = today.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
    
    // Update date info in filter buttons
    document.querySelectorAll('.filter-btn .date-info').forEach((element, index) => {
        if (index === 0) element.textContent = dailyDate;
        if (index === 1) element.textContent = weeklyDate;
        if (index === 2) element.textContent = monthlyDate;
    });
    
    // Also update date info in view selector buttons
    document.querySelectorAll('.view-btn .date-info').forEach((element, index) => {
        if (index === 0) element.textContent = dailyDate;
        if (index === 1) element.textContent = weeklyDate;
        if (index === 2) element.textContent = monthlyDate;
    });
    
    // Update daily view table headers with day names and dates
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayDates = [];
    
    // Calculate dates for the current week
    for (let i = 0; i < 5; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dayDates.push(date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}));
    }
    
    // Update daily view table headers
    const dailyHeaders = document.querySelectorAll('#dailyAttendanceView thead th');
    if (dailyHeaders.length > 5) {
        for (let i = 1; i < 6; i++) {
            const dateSpan = dailyHeaders[i].querySelector('.date-info');
            if (dateSpan) {
                dateSpan.textContent = dayDates[i-1];
            }
        }
    }
}
    
    // Initialize UI
    updateAttendanceStats();
    updateCourseAttendance();
    
    // Initialize date information
    updateDateInfo('weekly');
    
    // Add event listeners for view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the view type
            const viewType = this.getAttribute('data-view');
            
            // Show the corresponding view
            document.querySelectorAll('.table-container').forEach(container => {
                container.style.display = 'none';
            });
            document.getElementById(viewType + 'AttendanceView').style.display = 'block';
        });
    });
});