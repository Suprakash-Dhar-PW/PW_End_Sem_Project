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
                    <div class="progress" style="width: ${percentage}%"></div>
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
    
    if (period === 'weekly') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        datasets = [
            {
                label: 'HTML',
                data: [80, 100, 60, 90],
                borderColor: '#E44D26',
                backgroundColor: 'rgba(228, 77, 38, 0.1)',
                tension: 0.4
            },
            {
                label: 'CSS',
                data: [75, 100, 75, 100],
                borderColor: '#264DE4',
                backgroundColor: 'rgba(38, 77, 228, 0.1)',
                tension: 0.4
            },
            {
                label: 'C Language',
                data: [60, 80, 80, 60],
                borderColor: '#A8B9CC',
                backgroundColor: 'rgba(168, 185, 204, 0.1)',
                tension: 0.4
            },
            {
                label: 'Tech Comm.',
                data: [100, 75, 75, 100],
                borderColor: '#00C853',
                backgroundColor: 'rgba(0, 200, 83, 0.1)',
                tension: 0.4
            }
        ];
    } else if (period === 'monthly') {
        labels = ['August', 'September', 'October', 'November'];
        datasets = [
            {
                label: 'HTML',
                data: [85, 90, 95, 92],
                borderColor: '#E44D26',
                backgroundColor: 'rgba(228, 77, 38, 0.1)',
                tension: 0.4
            },
            {
                label: 'CSS',
                data: [80, 85, 90, 88],
                borderColor: '#264DE4',
                backgroundColor: 'rgba(38, 77, 228, 0.1)',
                tension: 0.4
            },
            {
                label: 'C Language',
                data: [70, 75, 80, 76],
                borderColor: '#A8B9CC',
                backgroundColor: 'rgba(168, 185, 204, 0.1)',
                tension: 0.4
            },
            {
                label: 'Tech Comm.',
                data: [75, 80, 85, 82],
                borderColor: '#00C853',
                backgroundColor: 'rgba(0, 200, 83, 0.1)',
                tension: 0.4
            }
        ];
    } else { // daily
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        datasets = [
            {
                label: 'Attendance',
                data: [100, 80, 90, 75, 95],
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

function filterAttendanceData(filter) {
    // Implement filtering logic based on selected filter
    // For now, just update the UI with all data
    updateAttendanceStats();
    updateCourseAttendance();
    
    // Update chart based on filter
    if (filter === 'Daily') {
        initializeAttendanceChart('daily');
    } else if (filter === 'Weekly') {
        initializeAttendanceChart('weekly');
    } else if (filter === 'Monthly') {
        initializeAttendanceChart('monthly');
    }
}
    
    // Initialize UI
    updateAttendanceStats();
    updateCourseAttendance();
});