// Loading animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1000);
});

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

// Mobile sidebar functionality
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Restore sidebar state
document.addEventListener('DOMContentLoaded', () => {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && window.innerWidth > 768) {
        document.getElementById("sidebar").classList.add("collapsed");
    }
});

// Profile navigation
function goToProfile() {
    window.location.href = "profile.html";
}

// Auth functions
function showLoginModal() {
    window.location.href = "login.html";
}

function showSignupModal() {
    window.location.href = "sign-up.html";
}

// Toaster Notification System
function showToaster(type, title, message, duration = 4000) {
    const container = document.getElementById('toasterContainer');
    const toaster = document.createElement('div');
    toaster.className = `toaster ${type}`;

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toaster.innerHTML = `
        <i class="toaster-icon ${iconMap[type] || iconMap.info}"></i>
        <div class="toaster-content">
            <div class="toaster-title">${title}</div>
            <div class="toaster-message">${message}</div>
        </div>
        <button class="toaster-close" onclick="closeToaster(this.parentElement)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toaster);

    setTimeout(() => {
        toaster.classList.add('show');
    }, 10);

    if (duration > 0) {
        setTimeout(() => {
            closeToaster(toaster);
        }, duration);
    }
    return toaster;
}

function closeToaster(toaster) {
    toaster.classList.remove('show');
    setTimeout(() => {
        if (toaster.parentElement) {
            toaster.parentElement.removeChild(toaster);
        }
    }, 400);
}

// Newsletter subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const button = event.target.querySelector('button');
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    button.disabled = true;

    setTimeout(() => {
        showToaster(
            'success',
            'Subscription Successful!',
            `Thank you for subscribing with ${email}! You'll receive updates soon.`
        );
        button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
            event.target.reset();
        }, 2000);
    }, 1500);
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide back to top button
window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');

    if (window.innerWidth <= 768 &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target) &&
        sidebar.classList.contains('open')) {
        closeMobileSidebar();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            closeMobileSidebar();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Dashboard Enhancements JavaScript

const quickAddTaskForm = document.getElementById('quickAddTaskForm');
const quickTaskTitle = document.getElementById('quickTaskTitle');
const quickTaskCategory = document.getElementById('quickTaskCategory');
const quickTaskPriority = document.getElementById('quickTaskPriority');
const quickTaskDueDate = document.getElementById('quickTaskDueDate');
const recentTasksList = document.getElementById('recentTasksList');

document.addEventListener('DOMContentLoaded', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (quickTaskDueDate) {
        quickTaskDueDate.valueAsDate = tomorrow;
    }

    if (quickAddTaskForm) {
        quickAddTaskForm.addEventListener('submit', handleQuickAddTask);
    }
    
    loadRecentTasks();
});

function handleQuickAddTask(event) {
    event.preventDefault();
    if (!quickTaskTitle.value.trim()) {
        showToaster('error', 'Error', 'Task title is required');
        return;
    }
    const newTask = {
        id: generateTaskId(),
        title: quickTaskTitle.value.trim(),
        category: quickTaskCategory.value || 'other',
        priority: quickTaskPriority.value || 'medium',
        dueDate: quickTaskDueDate.value || null,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.unshift(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    quickAddTaskForm.reset();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    quickTaskDueDate.valueAsDate = tomorrow;
    showToaster('success', 'Task Added', 'Your task has been added successfully');
    loadRecentTasks();
}

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

    const recentTasks = tasks.slice(0, 3);
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
}

function toggleTaskStatus(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadRecentTasks();
        showToaster(
            'success',
            'Task Updated',
            `Task marked as ${tasks[taskIndex].status}`
        );
    }
}

function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskCategory').value = task.category;
        document.getElementById('editTaskPriority').value = task.priority;
        if (task.dueDate) {
            document.getElementById('editTaskDueDate').value = task.dueDate;
        }
        document.getElementById('editTaskModal').classList.add('active');
    }
}

function handleEditTaskSubmit(event) {
    event.preventDefault();
    const taskId = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value.trim();
    if (!title) {
        showToaster('error', 'Error', 'Task title is required');
        return;
    }
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].category = document.getElementById('editTaskCategory').value;
        tasks[taskIndex].priority = document.getElementById('editTaskPriority').value;
        tasks[taskIndex].dueDate = document.getElementById('editTaskDueDate').value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        closeEditTaskModal();
        loadRecentTasks();
        showToaster('success', 'Task Updated', 'Your task has been updated successfully');
    }
}

function closeEditTaskModal() {
    document.getElementById('editTaskModal').classList.remove('active');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadRecentTasks();
        showToaster('success', 'Task Deleted', 'Your task has been deleted successfully');
    }
}

function fillSuggestedTask(title, category, priority) {
    if (!quickTaskTitle || !quickTaskCategory || !quickTaskPriority) return;
    quickTaskTitle.value = title;
    quickTaskCategory.value = category;
    quickTaskPriority.value = priority;
    quickTaskTitle.focus();
}

function generateTaskId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

// Dynamically add styles for recent tasks to avoid cluttering the CSS file
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
        .recent-task.priority-high::before { background: #ff4d4d; }
        .recent-task.priority-medium::before { background: #ffaa00; }
        .recent-task.priority-low::before { background: #00c853; }
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
        .recent-task .task-actions { display: flex; gap: 10px; }
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
        .recent-task .task-meta-item, .recent-task .task-category {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .recent-task .overdue { color: #ff4d4d; }
    `;
    document.head.appendChild(style);
});