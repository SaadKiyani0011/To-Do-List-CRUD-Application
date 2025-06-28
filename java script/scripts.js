// Utility: Generate current date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Utility: Check if a date is in the current week
function getWeekNumber(date) {
    const d = new Date(date);
    const oneJan = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
}
// DOM Elements
const taskInput = document.getElementById("task-input");
const endDateInput = document.getElementById("end-date");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filters = document.querySelectorAll("#task-filters button");

let tasks = []; // Local array for storing tasks

// Load tasks from backend (Django integration-ready)
function loadTasks() {
    // TODO: Replace this with Django AJAX fetch later
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();
}

// Save tasks locally (temporary before backend)
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
addTaskBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    const endDate = endDateInput.value;

    if (!title || !endDate) {
        alert("Please enter task title and expected end date.");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        startDate: getTodayDate(),
        endDate,
        completed: false,
        completedDate: null
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    endDateInput.value = "";
});
// Render Tasks
function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    const today = getTodayDate();
    const currentWeek = getWeekNumber(today);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    tasks.forEach(task => {
        let taskWeek = getWeekNumber(task.startDate);
        let taskMonth = new Date(task.startDate).getMonth();
        let taskYear = new Date(task.startDate).getFullYear();

        // Filtering
        if (
            (filter === "week1" && taskWeek !== 1) ||
            (filter === "week2" && taskWeek !== 2) ||
            (filter === "week3" && taskWeek !== 3) ||
            (filter === "week4" && taskWeek !== 4) ||
            (filter === "month" && taskMonth !== currentMonth) ||
            (filter === "year" && taskYear !== currentYear)
        ) return;

        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) li.classList.add("completed");

        // Task Content
        const content = document.createElement("div");
        content.className = "task-content";

        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.title;

        const dates = document.createElement("div");
        dates.className = "task-date";
        dates.innerHTML = `
            <span class="start">Start: ${task.startDate}</span>
            <span class="end">End: ${task.endDate}</span>
            ${task.completed ? `<span class="end">Completed: ${task.completedDate}</span>` : ""}
        `;

        content.appendChild(title);
        content.appendChild(dates);

        // Task Actions
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Edit
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "✏️";
        editBtn.addEventListener("click", () => editTask(task.id));

        // Complete
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.innerHTML = "✅";
        completeBtn.addEventListener("click", () => completeTask(task.id));

        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(content);
        li.appendChild(actions);
        taskList.appendChild(li);

        // Alert for overdue task
        if (!task.completed && task.endDate < today) {
            alert(`⚠️ Task "${task.title}" is overdue and incomplete!`);
        }
    });
}
// Complete Task
function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
        task.completed = true;
        task.completedDate = getTodayDate();
        alert(`🎉 Task "${task.title}" marked as completed!`);
        saveTasks();
        renderTasks();
    }
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newTitle = prompt("Edit your task title:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
        task.title = newTitle.trim();
        saveTasks();
        renderTasks();
    }
}

// Filter Buttons
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        filters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        renderTasks(filter);
    });
});

// On Page Load
loadTasks();