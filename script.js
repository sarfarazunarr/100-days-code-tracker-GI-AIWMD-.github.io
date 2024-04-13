// Function to fetch data from data.json
async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update progress
function updateProgress(completedPercentage) {
    const progressAchieved = document.getElementById('progress-achieved');
    progressAchieved.style.width = `${completedPercentage}%`;
    progressAchieved.title = `${completedPercentage}% Completed`;
    const progressRemaining = document.getElementById('progress-placeholder');
    progressRemaining.title = `${100 - completedPercentage}% remaining`;
}

// Check if user has completed days in localStorage
let completedDays = localStorage.getItem('completedDays');
if (!completedDays) {
    completedDays = parseInt(prompt("How many days' tasks have you completed?"));
    localStorage.setItem('completedDays', completedDays);
} else {
    completedDays = parseInt(completedDays);
}

// Fetch data and then display tasks for the next day
fetchData().then(data => {
    // Find the next day's tasks
    const nextDay = completedDays + 1;
    document.getElementById('currentDay').innerHTML = nextDay;
    const nextDayData = data.find(day => day.day === nextDay);

    if (nextDayData) {
        const tasksForNextDay = nextDayData.tasks;

        // Update HTML with tasks for the next day
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = '';
        tasksForNextDay.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('pl-6', 'mt-2');

            const taskTitle = document.createElement('div');
            taskTitle.classList.add('bg-blue-600', 'text-xl', 'md:text-sm', 'p-1', 'pl-2', 'text-white', 'rounded-md', 'peer');
            taskTitle.textContent = `Task ${task.task_title}`;
            taskElement.appendChild(taskTitle);

            const taskDescription = document.createElement('div');
            taskDescription.classList.add('hidden', 'peer-hover:block', 'bg-blue-950', 'text-sm', 'my-2', 'p-1', 'text-white', 'rounded-md');
            taskDescription.textContent = task.task_description;
            taskElement.appendChild(taskDescription);

            tasksContainer.appendChild(taskElement);
        });

        // Update progress bar
        const totalDays = data.length;
        const completedPercentage = (completedDays / totalDays) * 100;
        updateProgress(completedPercentage);
    } else {
        console.error('Data for the next day not found.');
    }
}).catch(error => {
    console.error('Error fetching data:', error);
});
function markAllTasksAsCompleted() {
    let completedDays = localStorage.getItem('completedDays');
    localStorage.setItem('completedDays', parseInt(completedDays) + 1);
    location.reload();
}

