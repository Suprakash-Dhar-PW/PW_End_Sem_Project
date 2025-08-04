// Mentor Attendance System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const batchSelect = document.getElementById('batchSelect');
    const subjectSelect = document.getElementById('subjectSelect');
    const dateSelect = document.getElementById('dateSelect');
    const deleteSubjectBtn = document.getElementById('deleteSubjectBtn');
    const addSubjectModal = document.getElementById('addSubjectModal');
    const closeAddSubjectModal = document.getElementById('closeAddSubjectModal');
    const newSubjectName = document.getElementById('newSubjectName');
    const newSubjectCode = document.getElementById('newSubjectCode');
    const saveNewSubject = document.getElementById('saveNewSubject');
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
    const presentCount = document.getElementById('presentCount');
    const absentCount = document.getElementById('absentCount');
    const totalCount = document.getElementById('totalCount');
    const mentorName = document.getElementById('mentorName');
    const mentorEmail = document.getElementById('mentorEmail');
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    dateSelect.value = formattedDate;
    
    // Initialize data from localStorage or set defaults
    let subjects = JSON.parse(localStorage.getItem('mentorSubjects')) || [
        { id: 'html', name: 'HTML' },
        { id: 'css', name: 'CSS' },
        { id: 'js', name: 'JavaScript' },
        { id: 'c', name: 'C Language' },
        { id: 'comm', name: 'Tech Communication' }
    ];
    
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let attendanceRecords = JSON.parse(localStorage.getItem('mentorAttendanceRecords')) || [];
    let mentorInfo = JSON.parse(localStorage.getItem('mentorInfo')) || {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@pwioi.edu'
    };
    
    // Initialize mentor info
    mentorName.textContent = mentorInfo.name;
    mentorEmail.textContent = mentorInfo.email;
    
    // If no students data, create sample data
    if (students.length === 0) {
        students = [
            // 2025 Batch
            { id: 1, enrollmentNo: 'PW2025_001', name: 'Rahul Sharma', batch: '2025' },
            { id: 2, enrollmentNo: 'PW2025_002', name: 'Priya Patel', batch: '2025' },
            { id: 3, enrollmentNo: 'PW2025_003', name: 'Amit Singh', batch: '2025' },
            { id: 4, enrollmentNo: 'PW2025_004', name: 'Neha Gupta', batch: '2025' },
            { id: 5, enrollmentNo: 'PW2025_005', name: 'Vikram Mehta', batch: '2025' },
            { id: 6, enrollmentNo: 'PW2025_006', name: 'Ananya Desai', batch: '2025' },
            { id: 7, enrollmentNo: 'PW2025_007', name: 'Suprakash Dhar', batch: '2025' },
            { id: 8, enrollmentNo: 'PW2025_008', name: 'Riya Kapoor', batch: '2025' },
            { id: 9, enrollmentNo: 'PW2025_009', name: 'Arjun Malhotra', batch: '2025' },
            { id: 10, enrollmentNo: 'PW2025_010', name: 'Divya Choudhary', batch: '2025' },
            { id: 11, enrollmentNo: 'PW2025_011', name: 'Rohan Jain', batch: '2025' },
            { id: 12, enrollmentNo: 'PW2025_012', name: 'Nisha Reddy', batch: '2025' },
            { id: 13, enrollmentNo: 'PW2025_013', name: 'Varun Khanna', batch: '2025' },
            { id: 14, enrollmentNo: 'PW2025_014', name: 'Pooja Sharma', batch: '2025' },
            { id: 15, enrollmentNo: 'PW2025_015', name: 'Kunal Verma', batch: '2025' },
            
            // 2024 Batch
            { id: 16, enrollmentNo: 'PW2024_001', name: 'Kiran Rao', batch: '2024' },
            { id: 17, enrollmentNo: 'PW2024_002', name: 'Sanjay Kumar', batch: '2024' },
            { id: 18, enrollmentNo: 'PW2024_003', name: 'Meera Joshi', batch: '2024' },
            { id: 19, enrollmentNo: 'PW2024_004', name: 'Aditya Sharma', batch: '2024' },
            { id: 20, enrollmentNo: 'PW2024_005', name: 'Sneha Gupta', batch: '2024' },
            { id: 21, enrollmentNo: 'PW2024_006', name: 'Raj Malhotra', batch: '2024' },
            { id: 22, enrollmentNo: 'PW2024_007', name: 'Kavita Singh', batch: '2024' },
            { id: 23, enrollmentNo: 'PW2024_008', name: 'Deepak Patel', batch: '2024' },
            { id: 24, enrollmentNo: 'PW2024_009', name: 'Anjali Desai', batch: '2024' },
            { id: 25, enrollmentNo: 'PW2024_010', name: 'Vivek Reddy', batch: '2024' },
            { id: 26, enrollmentNo: 'PW2024_011', name: 'Shweta Khanna', batch: '2024' },
            { id: 27, enrollmentNo: 'PW2024_012', name: 'Nikhil Jain', batch: '2024' },
            
            // 2023 Batch
            { id: 28, enrollmentNo: 'PW2023_001', name: 'Rajat Verma', batch: '2023' },
            { id: 29, enrollmentNo: 'PW2023_002', name: 'Sunita Sharma', batch: '2023' },
            { id: 30, enrollmentNo: 'PW2023_003', name: 'Mohit Agarwal', batch: '2023' },
            { id: 31, enrollmentNo: 'PW2023_004', name: 'Preeti Singhania', batch: '2023' },
            { id: 32, enrollmentNo: 'PW2023_005', name: 'Vikas Choudhary', batch: '2023' },
            { id: 33, enrollmentNo: 'PW2023_006', name: 'Neetu Kapoor', batch: '2023' },
            { id: 34, enrollmentNo: 'PW2023_007', name: 'Suresh Raina', batch: '2023' },
            { id: 35, enrollmentNo: 'PW2023_008', name: 'Manisha Koirala', batch: '2023' },
            { id: 36, enrollmentNo: 'PW2023_009', name: 'Prakash Jha', batch: '2023' },
            { id: 37, enrollmentNo: 'PW2023_010', name: 'Ritika Saxena', batch: '2023' }
        ];
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // Event Listeners
    batchSelect.addEventListener('change', loadStudentsForBatch);
    subjectSelect.addEventListener('change', handleSubjectChange);
    deleteSubjectBtn.addEventListener('click', handleDeleteSubject);
    closeAddSubjectModal.addEventListener('click', () => addSubjectModal.classList.remove('active'));
    saveNewSubject.addEventListener('click', handleSaveNewSubject);
    saveAttendanceBtn.addEventListener('click', handleSaveAttendance);
    
    // Initialize subjects dropdown
    populateSubjectsDropdown();
    
    // Functions
    function populateSubjectsDropdown() {
        // Clear existing options except the default and add new
        while (subjectSelect.options.length > 1) {
            subjectSelect.remove(1);
        }
        
        // Add subjects
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
        
        // Add the "Add New Subject" option
        const addNewOption = document.createElement('option');
        addNewOption.value = 'add-new';
        addNewOption.textContent = '+ Add New Subject';
        subjectSelect.appendChild(addNewOption);
    }
    
    function handleSubjectChange() {
        if (subjectSelect.value === 'add-new') {
            // Show the add subject modal
            addSubjectModal.classList.add('active');
            newSubjectName.value = '';
            newSubjectCode.value = '';
            newSubjectName.focus();
            
            // Reset the select to previous value
            subjectSelect.value = subjectSelect.dataset.previousValue || '';
        } else {
            // Store the current value
            subjectSelect.dataset.previousValue = subjectSelect.value;
        }
    }
    
    function handleSaveNewSubject() {
        const name = newSubjectName.value.trim();
        const code = newSubjectCode.value.trim();
        
        if (!name || !code) {
            showToast('Please enter both subject name and code', 'error');
            return;
        }
        
        // Generate a unique ID
        const id = code.toLowerCase().replace(/\s+/g, '-');
        
        // Check if subject with this ID already exists
        if (subjects.some(subject => subject.id === id)) {
            showToast('A subject with this code already exists', 'error');
            return;
        }
        
        // Add the new subject
        subjects.push({ id, name });
        
        // Save to localStorage
        localStorage.setItem('mentorSubjects', JSON.stringify(subjects));
        
        // Update the dropdown
        populateSubjectsDropdown();
        
        // Select the new subject
        subjectSelect.value = id;
        subjectSelect.dataset.previousValue = id;
        
        // Close the modal
        addSubjectModal.classList.remove('active');
        
        // Show success message
        showToast('Subject added successfully', 'success');
    }
    
    function handleDeleteSubject() {
        const selectedSubject = subjectSelect.value;
        
        if (!selectedSubject || selectedSubject === '' || selectedSubject === 'add-new') {
            showToast('Please select a subject to delete', 'error');
            return;
        }
        
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete the subject: ${subjectSelect.options[subjectSelect.selectedIndex].text}?`)) {
            return;
        }
        
        // Remove the subject
        subjects = subjects.filter(subject => subject.id !== selectedSubject);
        
        // Save to localStorage
        localStorage.setItem('mentorSubjects', JSON.stringify(subjects));
        
        // Update the dropdown
        populateSubjectsDropdown();
        
        // Reset selection
        subjectSelect.value = '';
        subjectSelect.dataset.previousValue = '';
        
        // Show success message
        showToast('Subject deleted successfully', 'success');
    }
    
    function loadStudentsForBatch() {
        const selectedBatch = batchSelect.value;
        
        if (!selectedBatch) {
            attendanceTableBody.innerHTML = '';
            updateAttendanceCounts();
            return;
        }
        
        // Filter students by batch
        const batchStudents = students.filter(student => student.batch === selectedBatch);
        
        // Generate table rows
        let tableHTML = '';
        batchStudents.forEach((student, index) => {
            tableHTML += `
                <tr data-student-id="${student.id}">
                    <td>${index + 1}</td>
                    <td>${student.enrollmentNo}</td>
                    <td>${student.name}</td>
                    <td>
                        <input type="checkbox" class="attendance-checkbox" data-student-id="${student.id}" onchange="updateAttendanceCounts()">
                    </td>
                </tr>
            `;
        });
        
        attendanceTableBody.innerHTML = tableHTML;
        
        // Update counts
        updateAttendanceCounts();
    }
    
    // Function to update attendance counts
    window.updateAttendanceCounts = function() {
        const checkboxes = document.querySelectorAll('.attendance-checkbox');
        const total = checkboxes.length;
        const present = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        const absent = total - present;
        
        totalCount.textContent = total;
        presentCount.textContent = present;
        absentCount.textContent = absent;
    };
    
    function handleSaveAttendance() {
        const selectedBatch = batchSelect.value;
        const selectedSubject = subjectSelect.value;
        const selectedDate = dateSelect.value;
        
        if (!selectedBatch || !selectedSubject || !selectedDate) {
            showToast('Please select batch, subject, and date', 'error');
            return;
        }
        
        // Get all checkboxes
        const checkboxes = document.querySelectorAll('.attendance-checkbox');
        
        if (checkboxes.length === 0) {
            showToast('No students found for this batch', 'error');
            return;
        }
        
        // Create attendance record
        const attendanceRecord = {
            id: generateId(),
            batch: selectedBatch,
            subject: selectedSubject,
            subjectName: subjectSelect.options[subjectSelect.selectedIndex].text,
            date: selectedDate,
            timestamp: new Date().toISOString(),
            students: Array.from(checkboxes).map(checkbox => ({
                studentId: checkbox.dataset.studentId,
                present: checkbox.checked
            }))
        };
        
        // Check if a record for this batch, subject, and date already exists
        const existingRecordIndex = attendanceRecords.findIndex(record => 
            record.batch === selectedBatch && 
            record.subject === selectedSubject && 
            record.date === selectedDate
        );
        
        if (existingRecordIndex !== -1) {
            // Update existing record
            attendanceRecords[existingRecordIndex] = attendanceRecord;
            showToast('Attendance record updated successfully', 'success');
        } else {
            // Add new record
            attendanceRecords.push(attendanceRecord);
            showToast('Attendance record saved successfully', 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('mentorAttendanceRecords', JSON.stringify(attendanceRecords));
    }
    
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    function showToast(message, type = 'info') {
        // Check if toaster function exists in index.js
        if (typeof showToaster === 'function') {
            showToaster(message, type);
        } else {
            // Fallback alert
            alert(message);
        }
    }
});