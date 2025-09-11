 // Show loading overlay
        document.addEventListener('DOMContentLoaded', function() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            
            // Simulate loading time
            setTimeout(function() {
                loadingOverlay.classList.add('hidden');
            }, 800);

            // Initialize the notes functionality
            initNotesSystem();
        });

        // Toggle sidebar
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const main = document.getElementById('main');
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        }

        // Mobile sidebar toggle
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            sidebar.classList.toggle('mobile-open');
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        }

        function closeMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        // Modal functions
        function showModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        // Profile navigation
        function goToProfile() {
            window.location.href = 'profile.html';
        }

        // Login/Signup Modal functions
        function showLoginModal() {
            window.location.href = 'login.html';
        }

        function showSignupModal() {
            window.location.href = 'sign-up.html';
        }

        // Scroll to top function
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Notes System Initialization
        function initNotesSystem() {
            const generateSubjectsBtn = document.getElementById('generateSubjectsBtn');
            const backToSubjectsBtn = document.getElementById('backToSubjectsBtn');
            const subjectsContainer = document.getElementById('subjectsContainer');
            const notesListContainer = document.getElementById('notesListContainer');
            const notesList = document.getElementById('notesList');
            const currentSubjectTitle = document.getElementById('currentSubjectTitle');
            const noSubjectsMessage = document.getElementById('noSubjectsMessage');

            // Sample subject data
            const subjectsData = {
                '1': { // Batch 1
                    '1': { // Year 1
                        '1': [ // Semester 1
                            { id: 1, name: 'Introduction to Programming', code: 'CS101', icon: 'fas fa-code' },
                            { id: 2, name: 'Data Structures', code: 'CS102', icon: 'fas fa-project-diagram' },
                            { id: 3, name: 'Web Development Basics', code: 'CS103', icon: 'fas fa-globe' },
                            { id: 4, name: 'Mathematics for Computer Science', code: 'MA101', icon: 'fas fa-calculator' }
                        ],
                        '2': [ // Semester 2
                            { id: 5, name: 'Object-Oriented Programming', code: 'CS201', icon: 'fas fa-cubes' },
                            { id: 6, name: 'Database Systems', code: 'CS202', icon: 'fas fa-database' },
                            { id: 7, name: 'Computer Networks', code: 'CS203', icon: 'fas fa-network-wired' },
                            { id: 8, name: 'Algorithms', code: 'CS204', icon: 'fas fa-sitemap' }
                        ]
                    },
                    '2': { // Year 2
                        '1': [ // Semester 1
                            { id: 9, name: 'Operating Systems', code: 'CS301', icon: 'fas fa-desktop' },
                            { id: 10, name: 'Software Engineering', code: 'CS302', icon: 'fas fa-cogs' },
                            { id: 11, name: 'Artificial Intelligence', code: 'CS303', icon: 'fas fa-robot' },
                            { id: 12, name: 'Mobile App Development', code: 'CS304', icon: 'fas fa-mobile-alt' }
                        ],
                        '2': [ // Semester 2
                            { id: 13, name: 'Cloud Computing', code: 'CS401', icon: 'fas fa-cloud' },
                            { id: 14, name: 'Cybersecurity', code: 'CS402', icon: 'fas fa-shield-alt' },
                            { id: 15, name: 'Machine Learning', code: 'CS403', icon: 'fas fa-brain' },
                            { id: 16, name: 'Big Data Analytics', code: 'CS404', icon: 'fas fa-chart-bar' }
                        ]
                    }
                },
                // Add more batches as needed
                '2': { // Batch 2
                    '1': { // Year 1
                        '1': [ // Semester 1
                            { id: 17, name: 'Programming Fundamentals', code: 'CS101B', icon: 'fas fa-code' },
                            { id: 18, name: 'Computer Architecture', code: 'CS102B', icon: 'fas fa-microchip' },
                            { id: 19, name: 'Discrete Mathematics', code: 'MA101B', icon: 'fas fa-calculator' }
                        ],
                        '2': [ // Semester 2
                            { id: 20, name: 'Advanced Programming', code: 'CS201B', icon: 'fas fa-laptop-code' },
                            { id: 21, name: 'Data Communication', code: 'CS202B', icon: 'fas fa-exchange-alt' },
                            { id: 22, name: 'Web Technologies', code: 'CS203B', icon: 'fas fa-globe' }
                        ]
                    }
                }
            };

            // Sample notes data
            const notesData = {
                1: [ // Subject ID 1 (Introduction to Programming)
                    { id: 1, day: 1, title: 'Introduction to Programming - Day 1', date: '2023-01-10', author: 'Prof. Johnson', content: 'Introduction to programming concepts and basic syntax.' },
                    { id: 2, day: 2, title: 'Variables and Data Types - Day 2', date: '2023-01-12', author: 'Prof. Johnson', content: 'Understanding variables, data types, and basic operations.' },
                    { id: 3, day: 3, title: 'Control Structures - Day 3', date: '2023-01-14', author: 'Prof. Johnson', content: 'Conditional statements and loops in programming.' },
                    { id: 4, day: 4, title: 'Functions and Methods - Day 4', date: '2023-01-16', author: 'Prof. Johnson', content: 'Creating and using functions in programming.' },
                    { id: 5, day: 5, title: 'Arrays and Lists - Day 5', date: '2023-01-18', author: 'Prof. Johnson', content: 'Working with collections of data in programming.' }
                ],
                2: [ // Subject ID 2 (Data Structures)
                    { id: 6, day: 1, title: 'Introduction to Data Structures - Day 1', date: '2023-01-11', author: 'Prof. Smith', content: 'Overview of data structures and their importance.' },
                    { id: 7, day: 2, title: 'Arrays and Linked Lists - Day 2', date: '2023-01-13', author: 'Prof. Smith', content: 'Understanding arrays and linked lists implementations.' },
                    { id: 8, day: 3, title: 'Stacks and Queues - Day 3', date: '2023-01-15', author: 'Prof. Smith', content: 'Implementation and applications of stacks and queues.' },
                    { id: 9, day: 4, title: 'Trees and Graphs - Day 4', date: '2023-01-17', author: 'Prof. Smith', content: 'Understanding tree and graph data structures.' },
                    { id: 10, day: 5, title: 'Hash Tables - Day 5', date: '2023-01-19', author: 'Prof. Smith', content: 'Hash tables and their applications in programming.' }
                ]
                // Add more subjects as needed
            };

            // Generate subjects based on selection
            generateSubjectsBtn.addEventListener('click', function() {
                const batchValue = document.getElementById('batchSelect').value;
                const yearValue = document.getElementById('yearSelect').value;
                const semesterValue = document.getElementById('semesterSelect').value;

                if (!batchValue || !yearValue || !semesterValue) {
                    showToaster('error', 'Selection Error', 'Please select batch, year, and semester');
                    return;
                }

                // Check if subjects exist for the selection
                if (!subjectsData[batchValue] || 
                    !subjectsData[batchValue][yearValue] || 
                    !subjectsData[batchValue][yearValue][semesterValue]) {
                    noSubjectsMessage.style.display = 'flex';
                    subjectsContainer.innerHTML = '';
                    subjectsContainer.appendChild(noSubjectsMessage);
                    showToaster('warning', 'No Subjects', 'No subjects found for the selected criteria');
                    return;
                }

                // Generate subject cards
                const subjects = subjectsData[batchValue][yearValue][semesterValue];
                subjectsContainer.innerHTML = '';
                noSubjectsMessage.style.display = 'none';

                subjects.forEach(subject => {
                    const subjectCard = document.createElement('div');
                    subjectCard.className = 'subject-card';
                    subjectCard.innerHTML = `
                        <div class="subject-icon">
                            <i class="${subject.icon}"></i>
                        </div>
                        <div class="subject-info">
                            <h3 class="subject-name">${subject.name}</h3>
                            <p class="subject-code">${subject.code}</p>
                        </div>
                    `;

                    // Add click event to show notes for this subject
                    subjectCard.addEventListener('click', function() {
                        showNotesForSubject(subject);
                    });

                    subjectsContainer.appendChild(subjectCard);
                });

                showToaster('success', 'Subjects Generated', 'Click on a subject to view notes');
            });

            // Show notes for selected subject
            function showNotesForSubject(subject) {
                currentSubjectTitle.textContent = subject.name;
                subjectsContainer.style.display = 'none';
                notesListContainer.style.display = 'block';

                // Clear previous notes
                notesList.innerHTML = '';

                // Check if notes exist for this subject
                if (!notesData[subject.id]) {
                    notesList.innerHTML = `
                        <div class="no-notes-message">
                            <i class="fas fa-sticky-note"></i>
                            <p>No notes available for this subject yet</p>
                        </div>
                    `;
                    return;
                }

                // Sort notes by day
                const notes = notesData[subject.id].sort((a, b) => a.day - b.day);

                // Generate notes list
                notes.forEach(note => {
                    const noteItem = document.createElement('div');
                    noteItem.className = 'note-item';
                    noteItem.innerHTML = `
                        <div class="note-day">Day ${note.day}</div>
                        <div class="note-info">
                            <h3 class="note-title">${note.title}</h3>
                            <div class="note-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${note.date}</span>
                                <span><i class="fas fa-user"></i> ${note.author}</span>
                            </div>
                        </div>
                        <div class="note-actions">
                            <button class="note-btn view-btn" title="View Note">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="note-btn download-btn" title="Download Note">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    `;

                    // Add event listeners for view and download buttons
                    const viewBtn = noteItem.querySelector('.view-btn');
                    const downloadBtn = noteItem.querySelector('.download-btn');

                    viewBtn.addEventListener('click', function() {
                        viewNote(note);
                    });

                    downloadBtn.addEventListener('click', function() {
                        downloadNote(note);
                    });

                    notesList.appendChild(noteItem);
                });
            }

            // Back to subjects button
            backToSubjectsBtn.addEventListener('click', function() {
                subjectsContainer.style.display = 'grid';
                notesListContainer.style.display = 'none';
            });

            // View note function
            function viewNote(note) {
                document.getElementById('noteTitle').textContent = note.title;
                document.getElementById('noteDate').textContent = note.date;
                document.getElementById('noteAuthor').textContent = note.author;
                document.getElementById('noteContent').innerHTML = `<p>${note.content}</p>`;

                // Set up download button in modal
                document.getElementById('downloadNoteBtn').onclick = function() {
                    downloadNote(note);
                };

                // Set up print button in modal
                document.getElementById('printNoteBtn').onclick = function() {
                    printNote(note);
                };

                showModal('noteViewerModal');
            }

            // Download note function
            function downloadNote(note) {
                // In a real application, this would generate a PDF or other document
                // For this demo, we'll just show a toaster message
                showToaster('success', 'Download Started', `Downloading ${note.title}`);
                
                // Simulate download delay
                setTimeout(() => {
                    showToaster('success', 'Download Complete', `${note.title} has been downloaded`);
                }, 1500);
            }

            // Print note function
            function printNote(note) {
                // In a real application, this would open the print dialog
                // For this demo, we'll just show a toaster message
                showToaster('info', 'Print', `Preparing ${note.title} for printing`);
            }
        }

        // Show toaster message
        function showToaster(type, title, message) {
            // Check if showToaster function exists in global scope (from index.js)
            if (typeof window.showToaster === 'function') {
                window.showToaster(type, title, message);
            } else {
                // Fallback implementation
                const toasterContainer = document.getElementById('toasterContainer');
                const toasterId = 'toaster-' + Date.now();
                
                const toaster = document.createElement('div');
                toaster.className = `toaster ${type}`;
                toaster.id = toasterId;
                
                toaster.innerHTML = `
                    <div class="toaster-icon">
                        <i class="fas ${getIconForType(type)}"></i>
                    </div>
                    <div class="toaster-content">
                        <h4>${title}</h4>
                        <p>${message}</p>
                    </div>
                    <button class="toaster-close" onclick="closeToaster('${toasterId}')">&times;</button>
                `;
                
                toasterContainer.appendChild(toaster);
                
                // Show the toaster
                setTimeout(() => {
                    toaster.classList.add('show');
                }, 10);
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    closeToaster(toasterId);
                }, 5000);
            }
            
            function getIconForType(type) {
                switch(type) {
                    case 'success': return 'fa-check-circle';
                    case 'error': return 'fa-exclamation-circle';
                    case 'warning': return 'fa-exclamation-triangle';
                    case 'info': return 'fa-info-circle';
                    default: return 'fa-bell';
                }
            }
        }
        
        function closeToaster(toasterId) {
            const toaster = document.getElementById(toasterId);
            if (toaster) {
                toaster.classList.remove('show');
                setTimeout(() => {
                    toaster.remove();
                }, 300);
            }
        }