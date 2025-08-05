// Dashboard Enhancements JavaScript

// DOM Elements
const quickAddTaskForm = document.getElementById('quickAddTaskForm');
const quickTaskTitle = document.getElementById('quickTaskTitle');
const quickTaskCategory = document.getElementById('quickTaskCategory');
const quickTaskPriority = document.getElementById('quickTaskPriority');
const quickTaskDueDate = document.getElementById('quickTaskDueDate');
const recentTasksList = document.getElementById('recentTasksList');

// Initialize the dashboard enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Set default due date to tomorrow for the quick add task form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (quickTaskDueDate) {
        quickTaskDueDate.valueAsDate = tomorrow;
    }
    
    // Add event listeners
    if (quickAddTaskForm) {
        quickAddTaskForm.addEventListener('submit', handleQuickAddTask);
    }
    
    // Load recent tasks
    loadRecentTasks();
});

// Handle quick add task form submission
function handleQuickAddTask(event) {
    event.preventDefault();
    
    if (!quickTaskTitle.value.trim()) {
        showToaster('error', 'Error', 'Task title is required');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: generateTaskId(),
        title: quickTaskTitle.value.trim(),
        category: quickTaskCategory.value || 'other',
        priority: quickTaskPriority.value || 'medium',
        dueDate: quickTaskDueDate.value || null,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Get existing tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Add new task to the beginning of the array
    tasks.unshift(newTask);
    
    // Save updated tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Reset form
    quickAddTaskForm.reset();
    
    // Set default due date again
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    quickTaskDueDate.valueAsDate = tomorrow;
    
    // Show success message
    showToaster('success', 'Task Added', 'Your task has been added successfully');
    
    // Reload recent tasks
    loadRecentTasks();
}

// Load recent tasks from localStorage
function loadRecentTasks() {
    if (!recentTasksList) return;
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    if (tasks.length === 0) {
        recentTasksList.innerHTML = `
            <div class="empty-tasks-message">
                <i class="fas fa-clipboard-list"></i>
                <p>No recent tasks. Add a new task to get started!</p>
            </div>
        `;
        return;
    }
    
    // Get only the 3 most recent tasks
    const recentTasks = tasks.slice(0, 3);
    
    // Generate HTML for recent tasks
    recentTasksList.innerHTML = recentTasks.map(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
        
        return `
            <div class="recent-task priority-${task.priority}" data-id="${task.id}">
                <div class="task-header">
                    <h4 class="task-title">${task.title}</h4>
                    <div class="task-actions">
                        <button class="task-action-btn" onclick="toggleTaskStatus('${task.id}')" title="${task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}">
                            <i class="fas ${task.status === 'completed' ? 'fa-times-circle' : 'fa-check-circle'}"></i>
                        </button>
                        <button class="task-action-btn" onclick="editTask('${task.id}')" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn" onclick="deleteTask('${task.id}')" title="Delete task">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="task-meta">
                    <div class="task-meta-item" title="Due date">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="${isOverdue ? 'overdue' : ''}">${dueDate}</span>
                    </div>
                    
                    <div class="task-meta-item" title="Priority">
                        <i class="fas fa-flag"></i>
                        <span>${capitalizeFirstLetter(task.priority)} Priority</span>
                    </div>
                    
                    <div class="task-category" title="Category">
                        <i class="fas ${getCategoryIcon(task.category)}"></i>
                        ${capitalizeFirstLetter(task.category)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add edit task modal to the page if it doesn't exist
    if (!document.getElementById('editTaskModal')) {
        const editTaskModal = document.createElement('div');
        editTaskModal.id = 'editTaskModal';
        editTaskModal.className = 'task-modal';
        editTaskModal.innerHTML = `
            <div class="task-modal-content">
                <div class="task-modal-header">
                    <h3>Edit Task</h3>
                    <button class="close-modal" onclick="closeEditTaskModal()">&times;</button>
                </div>
                <form id="editTaskForm">
                    <input type="hidden" id="editTaskId">
                    <div class="form-group">
                        <label for="editTaskTitle">Task Title</label>
                        <input type="text" id="editTaskTitle" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editTaskCategory">Category</label>
                            <select id="editTaskCategory">
                                <option value="assignment">Assignment</option>
                                <option value="project">Project</option>
                                <option value="exam">Exam</option>
                                <option value="reading">Reading</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editTaskPriority">Priority</label>
                            <select id="editTaskPriority">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editTaskDueDate">Due Date</label>
                        <input type="date" id="editTaskDueDate">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeEditTaskModal()">Cancel</button>
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(editTaskModal);
        
        // Add event listener to the edit task form
        document.getElementById('editTaskForm').addEventListener('submit', handleEditTaskSubmit);
    }
}

// Toggle task status (completed/pending)
function toggleTaskStatus(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Reload recent tasks
        loadRecentTasks();
        
        // Show success message
        showToaster(
            'success', 
            'Task Updated', 
            `Task marked as ${tasks[taskIndex].status === 'completed' ? 'completed' : 'pending'}`
        );
    }
}

// Edit task function
function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        // Fill the edit form with task data
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskCategory').value = task.category;
        document.getElementById('editTaskPriority').value = task.priority;
        
        if (task.dueDate) {
            document.getElementById('editTaskDueDate').value = task.dueDate;
        }
        
        // Show the edit modal
        document.getElementById('editTaskModal').classList.add('active');
    }
}

// Handle edit task form submission
function handleEditTaskSubmit(event) {
    event.preventDefault();
    
    const taskId = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value.trim();
    const category = document.getElementById('editTaskCategory').value;
    const priority = document.getElementById('editTaskPriority').value;
    const dueDate = document.getElementById('editTaskDueDate').value;
    
    if (!title) {
        showToaster('error', 'Error', 'Task title is required');
        return;
    }
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        // Update task data
        tasks[taskIndex].title = title;
        tasks[taskIndex].category = category;
        tasks[taskIndex].priority = priority;
        tasks[taskIndex].dueDate = dueDate;
        
        // Save updated tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Close the edit modal
        closeEditTaskModal();
        
        // Reload recent tasks
        loadRecentTasks();
        
        // Show success message
        showToaster('success', 'Task Updated', 'Your task has been updated successfully');
    }
}

// Close edit task modal
function closeEditTaskModal() {
    document.getElementById('editTaskModal').classList.remove('active');
}

// Delete task function
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        
        // Save updated tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        
        // Reload recent tasks
        loadRecentTasks();
        
        // Show success message
        showToaster('success', 'Task Deleted', 'Your task has been deleted successfully');
    }
}

// Fill suggested task in the form
function fillSuggestedTask(title, category, priority) {
    if (!quickTaskTitle || !quickTaskCategory || !quickTaskPriority) return;
    
    quickTaskTitle.value = title;
    quickTaskCategory.value = category;
    quickTaskPriority.value = priority;
    
    // Focus on the title input
    quickTaskTitle.focus();
}

// Helper function to generate a unique task ID
function generateTaskId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to get category icon
function getCategoryIcon(category) {
    const iconMap = {
        'assignment': 'fa-clipboard-list',
        'project': 'fa-project-diagram',
        'exam': 'fa-book',
        'reading': 'fa-book-open',
        'other': 'fa-tasks'
    };
    
    return iconMap[category] || 'fa-tasks';
}

// Add styles for recent tasks
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .recent-task {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 15px;
            margin-bottom: 15px;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
        }
        
        .recent-task:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
            border-color: rgba(0, 255, 210, 0.2);
        }
        
        .recent-task::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--primary-color);
            opacity: 0.7;
        }
        
        .recent-task.priority-high::before {
            background: #ff4d4d;
        }
        
        .recent-task.priority-medium::before {
            background: #ffaa00;
        }
        
        .recent-task.priority-low::before {
            background: #00c853;
        }
        
        .recent-task .task-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .recent-task .task-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-right: 10px;
        }
        
        .recent-task .task-actions {
            display: flex;
            gap: 10px;
        }
        
        .recent-task .task-action-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 16px;
            cursor: pointer;
            transition: var(--transition);
            padding: 5px;
        }
        
        .recent-task .task-action-btn:hover {
            color: var(--primary-color);
            transform: scale(1.1);
        }
        
        .recent-task .task-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 13px;
            color: var(--text-secondary);
        }
        
        .recent-task .task-meta-item,
        .recent-task .task-category {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .recent-task .overdue {
            color: #ff4d4d;
        }
    `;
    document.head.appendChild(style);
});