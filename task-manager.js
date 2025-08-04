// Task Manager JavaScript

// DOM Elements
const tasksContainer = document.getElementById('tasksContainer');
const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const filterButtons = document.querySelectorAll('.filter-btn');

// Stats Elements
const totalTasksElement = document.getElementById('total-tasks');
const inProgressTasksElement = document.getElementById('in-progress-tasks');
const completedTasksElement = document.getElementById('completed-tasks');
const completionRateElement = document.getElementById('completion-rate');

// Task Data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize the task manager
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateStats();
    
    // Add event listeners
    addTaskForm.addEventListener('submit', handleAddTask);
    editTaskForm.addEventListener('submit', handleEditTask);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterTasks(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Add tooltips to navbar when collapsed
    updateNavbarTooltips();
    
    // Setup category dropdown custom input
    setupCategoryDropdowns();
});

// Update navbar tooltips based on sidebar state
function updateNavbarTooltips() {
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Check if sidebar is collapsed on page load
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
        // Floating logo functionality removed
    }
    
    // Add tooltip functionality
    navLinks.forEach(link => {
        const tooltipText = link.querySelector('span').textContent;
        link.setAttribute('data-tooltip', tooltipText);
    });
}

// Render tasks based on current filter
function renderTasks(filter = 'all') {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started</p>
                <button class="add-task-btn" onclick="showAddTaskModal()">
                    <i class="fas fa-plus"></i> Add New Task
                </button>
            </div>
        `;
        return;
    }
    
    // Filter tasks if needed
    let filteredTasks = tasks;
    if (filter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === filter);
    }
    
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-filter"></i>
                <h3>No ${filter} tasks</h3>
                <p>Change the filter or add new tasks</p>
                <button class="filter-btn" onclick="filterTasks('all')">
                    <i class="fas fa-list"></i> Show All Tasks
                </button>
            </div>
        `;
        return;
    }
    
    // Sort tasks by due date (closest first)
    filteredTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    // Generate HTML for tasks
    tasksContainer.innerHTML = filteredTasks.map(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
        const tags = task.tags ? task.tags.split(',').map(tag => tag.trim()) : [];
        
        return `
            <div class="task-card priority-${task.priority}" data-id="${task.id}" data-status="${task.status}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button class="task-action-btn" onclick="toggleTaskStatus('${task.id}')" title="${task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}">
                            <i class="fas ${task.status === 'completed' ? 'fa-times-circle' : 'fa-check-circle'}"></i>
                        </button>
                        <button class="task-action-btn" onclick="showEditTaskModal('${task.id}')" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
                
                <div class="task-details">
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                    
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
                        
                        <div class="task-status ${task.status}" title="Status">
                            <i class="fas ${getStatusIcon(task.status)}"></i>
                            ${capitalizeFirstLetter(task.status.replace('-', ' '))}
                        </div>
                    </div>
                    
                    ${tags.length > 0 ? `
                        <div class="task-tags">
                            ${tags.map(tag => `<span class="task-tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Filter tasks
function filterTasks(filter) {
    renderTasks(filter);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const pendingTasks = totalTasks - completedTasks - inProgressTasks;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    totalTasksElement.textContent = totalTasks;
    inProgressTasksElement.textContent = inProgressTasks;
    completedTasksElement.textContent = completedTasks;
    completionRateElement.textContent = `${completionRate}%`;
}

// Show Add Task Modal
function showAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.add('active');
    
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('taskDueDate').valueAsDate = tomorrow;
    
    // Focus on title field
    setTimeout(() => {
        document.getElementById('taskTitle').focus();
    }, 100);
}

// Close Add Task Modal
function closeAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.remove('active');
    addTaskForm.reset();
}

// Show Edit Task Modal
function showEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.getElementById('editTaskModal');
    modal.classList.add('active');
    
    // Fill form with task data
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskCategory').value = task.category;
    document.getElementById('editTaskStatus').value = task.status;
    document.getElementById('editTaskTags').value = task.tags || '';
    
    if (task.dueDate) {
        // Format date for input field (YYYY-MM-DD)
        const date = new Date(task.dueDate);
        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('editTaskDueDate').value = formattedDate;
    } else {
        document.getElementById('editTaskDueDate').value = '';
    }
    
    // Focus on title field
    setTimeout(() => {
        document.getElementById('editTaskTitle').focus();
    }, 100);
}

// Close Edit Task Modal
function closeEditTaskModal() {
    const modal = document.getElementById('editTaskModal');
    modal.classList.remove('active');
    editTaskForm.reset();
}

// Handle Add Task Form Submit
function handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    let category = document.getElementById('taskCategory').value;
    const tags = document.getElementById('taskTags').value.trim();
    
    // Check if custom category is selected and has a value
    if (category === 'other') {
        const customCategory = document.getElementById('customTaskCategory').value.trim();
        if (customCategory) {
            category = customCategory;
        }
    }
    
    if (!title) {
        showToaster('error', 'Error', 'Task title is required');
        return;
    }
    
    const newTask = {
        id: generateId(),
        title,
        description,
        dueDate,
        priority,
        category,
        tags,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    closeAddTaskModal();
    
    showToaster('success', 'Success', 'Task added successfully');
}

// Handle Edit Task Form Submit
function handleEditTask(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const dueDate = document.getElementById('editTaskDueDate').value;
    const priority = document.getElementById('editTaskPriority').value;
    let category = document.getElementById('editTaskCategory').value;
    const tags = document.getElementById('editTaskTags').value.trim();
    const status = document.getElementById('editTaskStatus').value;
    
    // Check if custom category is selected and has a value
    if (category === 'other') {
        const customCategory = document.getElementById('customEditTaskCategory').value.trim();
        if (customCategory) {
            category = customCategory;
        }
    }
    
    if (!title) {
        showToaster('error', 'Error', 'Task title is required');
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        dueDate,
        priority,
        category,
        tags,
        status,
        updatedAt: new Date().toISOString()
    };
    
    saveTasks();
    renderTasks();
    updateStats();
    closeEditTaskModal();
    
    showToaster('success', 'Success', 'Task updated successfully');
}

// Toggle Task Status
function toggleTaskStatus(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    tasks[taskIndex] = {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString()
    };
    
    saveTasks();
    renderTasks();
    updateStats();
    
    showToaster(
        'info', 
        'Status Updated', 
        `Task marked as ${newStatus === 'completed' ? 'complete' : 'incomplete'}`
    );
}

// Confirm Delete Task
function confirmDeleteTask() {
    const taskId = document.getElementById('editTaskId').value;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    
    confirmationMessage.textContent = `Are you sure you want to delete the task "${task.title}"?`;
    confirmationModal.classList.add('active');
    
    confirmActionBtn.onclick = () => {
        deleteTask(taskId);
        closeConfirmationModal();
        closeEditTaskModal();
    };
}

// Close Confirmation Modal
function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.classList.remove('active');
}

// Delete Task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateStats();
    
    showToaster('info', 'Task Deleted', 'The task has been deleted successfully');
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Helper Functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryIcon(category) {
    const icons = {
        'assignment': 'fa-book',
        'project': 'fa-project-diagram',
        'exam': 'fa-graduation-cap',
        'reading': 'fa-book-reader',
        'other': 'fa-clipboard'
    };
    
    return icons[category] || 'fa-clipboard';
}

// Setup category dropdowns to show custom input when 'other' is selected
function setupCategoryDropdowns() {
    // Setup for Add Task form
    const addTaskCategory = document.getElementById('taskCategory');
    if (addTaskCategory) {
        // Create custom category input
        const customCategoryDiv = document.createElement('div');
        customCategoryDiv.className = 'form-group custom-category-input';
        customCategoryDiv.style.display = 'none';
        customCategoryDiv.innerHTML = `
            <label for="customTaskCategory">Custom Category</label>
            <input type="text" id="customTaskCategory" placeholder="Enter custom category">
        `;
        
        // Insert after category dropdown
        addTaskCategory.parentNode.insertAdjacentElement('afterend', customCategoryDiv);
        
        // Add change event listener
        addTaskCategory.addEventListener('change', function() {
            if (this.value === 'other') {
                customCategoryDiv.style.display = 'block';
            } else {
                customCategoryDiv.style.display = 'none';
            }
        });
    }
    
    // Setup for Edit Task form
    const editTaskCategory = document.getElementById('editTaskCategory');
    if (editTaskCategory) {
        // Create custom category input
        const customCategoryDiv = document.createElement('div');
        customCategoryDiv.className = 'form-group custom-category-input';
        customCategoryDiv.style.display = 'none';
        customCategoryDiv.innerHTML = `
            <label for="customEditTaskCategory">Custom Category</label>
            <input type="text" id="customEditTaskCategory" placeholder="Enter custom category">
        `;
        
        // Insert after category dropdown
        editTaskCategory.parentNode.insertAdjacentElement('afterend', customCategoryDiv);
        
        // Add change event listener
        editTaskCategory.addEventListener('change', function() {
            if (this.value === 'other') {
                customCategoryDiv.style.display = 'block';
            } else {
                customCategoryDiv.style.display = 'none';
            }
        });
    }
}

function getStatusIcon(status) {
    const icons = {
        'pending': 'fa-clock',
        'in-progress': 'fa-spinner',
        'completed': 'fa-check-circle'
    };
    
    return icons[status] || 'fa-clock';
}