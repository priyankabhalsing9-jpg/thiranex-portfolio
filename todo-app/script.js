
// Get HTML elements
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");

// Application state
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.action = "toggle";
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.dataset.action = "edit";
        editButton.textContent = "Edit";
        editButton.setAttribute("aria-label", `Edit ${task.text}`);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        actions.append(editButton, deleteButton);
        li.append(checkbox, span, actions);
        taskList.appendChild(li);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent =
        `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;

    emptyMessage.hidden = filteredTasks.length > 0;

    if (tasks.length === 0) {
        emptyMessage.textContent = "No tasks yet. Add your first task!";
    } else if (filteredTasks.length === 0) {
        emptyMessage.textContent = "No tasks in this filter.";
    }
}

// CREATE: Add a new task
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// READ, UPDATE and DELETE using event delegation
taskList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const li = button.closest(".task-item");

    if (!li) {
        return;
    }

    const taskId = li.dataset.id;
    const task = tasks.find(item => item.id === taskId);

    if (!task) {
        return;
    }

    // UPDATE: Edit task
    if (button.dataset.action === "edit") {
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) {
            return;
        }

        if (!updatedText.trim()) {
            alert("Task cannot be empty.");
            return;
        }

        task.text = updatedText.trim();
        saveTasks();
        renderTasks();
    }

    // DELETE: Remove task
    if (button.dataset.action === "delete") {
        const confirmed = confirm(
            `Are you sure you want to delete "${task.text}"?`
        );

        if (confirmed) {
            tasks = tasks.filter(item => item.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }
});

// UPDATE: Mark a task completed or active
taskList.addEventListener("change", function (event) {
    if (!event.target.matches('input[data-action="toggle"]')) {
        return;
    }

    const li = event.target.closest(".task-item");

    if (!li) {
        return;
    }

    const task = tasks.find(item => item.id === li.dataset.id);

    if (task) {
        task.completed = event.target.checked;
        saveTasks();
        renderTasks();
    }
});

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        renderTasks();
    });
});

// Show saved tasks when the application opens
renderTasks();
