// Function to check if a date is lunar 1st or 15th
function isLunarFirstOrFifteenth(date) {
    const lunar = Lunar.fromDate(date);
    return lunar.getDay() === 1 || lunar.getDay() === 15;
}

// Function to find the next lunar 1st or 15th
function findNextLunarFirstOrFifteenth(startDate) {
    let currentDate = new Date(startDate);
    let daysChecked = 0;
    const maxDaysToCheck = 30; // Maximum days to look ahead

    while (daysChecked < maxDaysToCheck) {
        if (isLunarFirstOrFifteenth(currentDate)) {
            return currentDate;
        }
        currentDate.setDate(currentDate.getDate() + 1);
        daysChecked++;
    }
    return null;
}

// Function to format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Update the UI with the results
function updateUI() {
    const today = new Date();
    const todayStatus = document.getElementById('todayStatus');
    const nextDate = document.getElementById('nextDate');

    // Check today's status
    if (isLunarFirstOrFifteenth(today)) {
        const lunar = Lunar.fromDate(today);
        todayStatus.textContent = `Today (${formatDate(today)}) is lunar ${lunar.getDay() === 1 ? '1st' : '15th'} day of the month.`;
    } else {
        todayStatus.textContent = `Today (${formatDate(today)}) is not a lunar 1st or 15th day.`;
    }

    // Find and display next lunar 1st or 15th
    const nextLunarDate = findNextLunarFirstOrFifteenth(today);
    if (nextLunarDate) {
        const lunar = Lunar.fromDate(nextLunarDate);
        nextDate.textContent = `The next lunar ${lunar.getDay() === 1 ? '1st' : '15th'} will be on ${formatDate(nextLunarDate)}.`;
    } else {
        nextDate.textContent = 'Could not determine the next lunar 1st or 15th date.';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', updateUI); 