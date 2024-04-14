let completedDaysofCode;
let currentDay;

async function main() {
    let loader = document.getElementById('loader');
    let mainbody = document.getElementById('maincontainer');
    setTimeout(() => {
        loader.classList.replace('flex', 'hidden');
        mainbody.classList.replace('hidden', 'block');
    }, 1000);
    loader.classList.replace('hidden', 'flex');
    mainbody.classList.replace('block', 'hidden');
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
        progressAchieved.title = `${Math.round(completedPercentage)}% Completed`;
        const progressRemaining = document.getElementById('progress-placeholder');
        progressRemaining.title = `${Math.round(100 - completedPercentage)}% remaining`;
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
        // Set the current day
        currentDay = completedDays + 1;
        document.getElementById('currentDay').innerHTML = currentDay;
        // Find the next day's tasks
        const nextDayData = data.find(day => day.day === currentDay);

        if (nextDayData) {
            completedDaysofCode = data.length;

            // Update HTML with tasks for the next day
            const tasksContainer = document.getElementById('tasks');
            tasksContainer.innerHTML = '';
            nextDayData.tasks.forEach(task => {
                const taskElement = document.createElement('details');
                taskElement.classList.add('pl-6', 'mt-2');

                const taskTitle = document.createElement('summary');
                taskTitle.classList.add('bg-blue-600', 'text-xl', 'md:text-sm', 'p-1', 'pl-2', 'text-white', 'rounded-md');
                taskTitle.textContent = `${task.task_title}`;
                taskElement.appendChild(taskTitle);

                const taskDescription = document.createElement('p');
                taskDescription.classList.add('bg-blue-950', 'text-sm', 'my-2', 'p-1', 'text-white', 'rounded-md');
                taskDescription.textContent = task.task_description;
                taskElement.appendChild(taskDescription);

                tasksContainer.appendChild(taskElement);

            });
            const discordLink = nextDayData.discordLink;
            const disLink = document.getElementById('dislink');
            disLink.href = discordLink;

            // Update progress bar
            const totalDays = data.length;
            document.getElementById('totalDays').innerHTML = `/ ${totalDays}`;
            const completedPercentage = (completedDays / totalDays) * 100;
            updateProgress(completedPercentage);
        } else {
            document.getElementById('done').classList.replace('hidden', 'block');
            document.getElementById('data').classList.replace('block', 'hidden');
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}
main();

function markAllTasksAsCompleted() {
    let completedDays = localStorage.getItem('completedDays');
    if (!completedDaysofCode) {
        console.error('No more days available.');
        return; // Exit function if no more days available
    }
    if (completedDaysofCode !== parseInt(completedDays)) {
        // Check if completedDays is less than or equal to total days
        if (parseInt(completedDays) <= completedDaysofCode) {
            localStorage.setItem('completedDays', parseInt(completedDays) + 1);
            main(); // Update tasks for the next day
        }
    } else { // No more days available
        document.getElementById('done').classList.replace('hidden', 'block');
        document.getElementById('data').classList.replace('block', 'hidden');
    }
}
