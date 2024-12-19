document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompleted = document.getElementById('clearCompleted');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            li.classList.toggle('completed');
            saveTasks();
            updateTaskCount();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.classList.add('fade-out');
            setTimeout(() => {
                tasks = tasks.filter(t => t !== task);
                renderTasks();
                saveTasks();
            }, 300);
        });

        return li;
    }

    function renderTasks(filterType = 'all') {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (filterType === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filterType === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });

        updateTaskCount();
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    function addTask(text) {
        if (text.trim() !== '') {
            const newTask = {
                text: text,
                completed: false,
                id: Date.now()
            };
            tasks.unshift(newTask);
            renderTasks();
            saveTasks();
            taskInput.value = '';
        }
    }

    addButton.addEventListener('click', () => {
        addTask(taskInput.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        saveTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.getAttribute('data-filter'));
        });
    });

    // Initial render
    renderTasks();
});
