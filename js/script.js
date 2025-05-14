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

// Function to format date for ICS
function formatDateForICS(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
}

// Function to generate ICS content
function generateICSContent() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year
    let currentDate = new Date(startDate);
    
    let events = [];
    
    while (currentDate <= endDate) {
        if (isLunarFirstOrFifteenth(currentDate)) {
            const lunar = Lunar.fromDate(currentDate);
            const eventDate = formatDateForICS(currentDate);
            const eventEndDate = formatDateForICS(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
            
            events.push(
                `BEGIN:VEVENT\n` +
                `DTSTART:${eventDate}\n` +
                `DTEND:${eventEndDate}\n` +
                `SUMMARY:Lunar ${lunar.getDay() === 1 ? '1st' : '15th'} Day\n` +
                `DESCRIPTION:Lunar ${lunar.getDay() === 1 ? '1st' : '15th'} day of the month\n` +
                `END:VEVENT`
            );
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return `BEGIN:VCALENDAR\n` +
           `VERSION:2.0\n` +
           `PRODID:-//Lunar Calendar Events//EN\n` +
           `CALSCALE:GREGORIAN\n` +
           `METHOD:PUBLISH\n` +
           `X-WR-CALNAME:Lunar Calendar Events\n` +
           `X-WR-TIMEZONE:UTC\n` +
           events.join('\n') +
           `\nEND:VCALENDAR`;
}

// Function to download ICS file
function downloadICS() {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lunar-calendar-events-${new Date().getFullYear()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Update the UI with the results
function updateUI() {
    const today = new Date();
    const todayStatus = document.getElementById('todayStatus');
    const nextDate = document.getElementById('nextDate');
    const statusBox = todayStatus.closest('.result-box');

    // Check today's status
    if (isLunarFirstOrFifteenth(today)) {
        const lunar = Lunar.fromDate(today);
        todayStatus.textContent = `Today (${formatDate(today)}) is lunar ${lunar.getDay() === 1 ? '1st' : '15th'} day of the month.`;
        statusBox.classList.add('is-veggie-day');
        statusBox.classList.remove('is-not-veggie-day');
    } else {
        todayStatus.textContent = `Today (${formatDate(today)}) is not a lunar 1st or 15th day.`;
        statusBox.classList.add('is-not-veggie-day');
        statusBox.classList.remove('is-veggie-day');
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
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    document.getElementById('downloadCalendar').addEventListener('click', downloadICS);
}); 