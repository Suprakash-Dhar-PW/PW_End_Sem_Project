// Attendance System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentSelect = document.getElementById('student');
    const courseSelect = document.getElementById('course');
    const dateInput = document.getElementById('date');
    const statusSelect = document.getElementById('status');
    const saveButton = document.getElementById('saveAttendance');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const markAttendanceBtn = document.querySelector('.mark-btn');
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    dateInput.value = formattedDate;
    
    // Initialize attendance data from localStorage or set defaults
    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    
    // Event Listeners
    saveButton.addEventListener('click', handleSaveAttendance);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter attendance data based on button text
            filterAttendanceData(this.textContent.trim());
        });
    });
    
    // Toggle attendance form visibility
    markAttendanceBtn.addEventListener('click', function() {
        const attendanceForm = document.querySelector('.attendance-form');
        attendanceForm.style.display = attendanceForm.style.display === 'none' ? 'block' : 'none';
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
    
    function filterAttendanceData(filter) {
        // Implement filtering logic based on selected filter
        // For now, just update the UI with all data
        updateAttendanceStats();
        updateCourseAttendance();
    }
    
    // Initialize UI
    updateAttendanceStats();
    updateCourseAttendance();
});