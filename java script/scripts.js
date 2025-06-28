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