// Function to check if a date is lunar 1st or 15th
function isLunarFirstOrFifteenth(date) {
    // Ensure we're working with UTC to avoid timezone issues
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));
    const lunar = Lunar.fromDate(utcDate);
    return lunar.getDay() === 1 || lunar.getDay() === 15;
}

// Function to find the next lunar 1st or 15th
function findNextLunarFirstOrFifteenth(startDate) {
    // Ensure we're working with UTC to avoid timezone issues
    const utcDate = new Date(Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    ));
    let currentDate = new Date(utcDate);
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
    return date.toISOString().split('T')[0].replace(/-/g, '');
}

// Function to format datetime for ICS
function formatDateTimeForICS(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
}

// Function to generate ICS content
function generateICSContent() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(); // Start from today
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year
    let currentDate = new Date(startDate);
    
    let events = [];
    
    while (currentDate <= endDate) {
        if (isLunarFirstOrFifteenth(currentDate)) {
            const lunar = Lunar.fromDate(currentDate);
            const eventDate = formatDateForICS(currentDate);
            
            events.push(
                `BEGIN:VEVENT\n` +
                `DTSTART;VALUE=DATE:${eventDate}\n` +
                `DTEND;VALUE=DATE:${formatDateForICS(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}\n` +
                `SUMMARY:Veggie Day 🥬🥕\n` +
                `DESCRIPTION:Lunar ${lunar.getDay() === 1 ? '1st' : '15th'} day of the month\n` +
                `BEGIN:VALARM\n` +
                `ACTION:DISPLAY\n` +
                `DESCRIPTION:Veggie Day Tomorrow\n` +
                `TRIGGER:-PT12H\n` +
                `END:VALARM\n` +
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
           `X-WR-CALNAME:Veggie Days 🥬🥕\n` +
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
    link.download = `veggie-days-${new Date().getFullYear()}.ics`;
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
        todayStatus.innerHTML = `<span class="status-yes">YES</span>`;
        statusBox.classList.add('is-veggie-day');
        statusBox.classList.remove('is-not-veggie-day');
    } else {
        todayStatus.innerHTML = `<span class="status-no">NO</span>
            <span class="date-text">${formatDate(today)}</span>`;
        statusBox.classList.add('is-not-veggie-day');
        statusBox.classList.remove('is-veggie-day');
    }

    // Find and display next lunar 1st or 15th
    const nextLunarDate = findNextLunarFirstOrFifteenth(today);
    if (nextLunarDate) {
        const lunar = Lunar.fromDate(nextLunarDate);
        const nextDateHeading = document.querySelector('#nextDateHeading');
        nextDateHeading.textContent = formatDate(nextLunarDate);
        const moonIcon = lunar.getDay() === 1 
            ? `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
            : `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`;
        nextDate.innerHTML = `<span class="lunar-text">${moonIcon} ${lunar.getDay() === 1 ? '1st' : '15th'}</span>`;
    } else {
        const nextDateHeading = document.querySelector('#nextDateHeading');
        nextDateHeading.textContent = 'Could not determine next date';
        nextDate.textContent = '';
    }
}

// Function to test lunar date calculations
function testLunarDates() {
    // Test some known dates
    const testDates = [
        new Date(2024, 0, 11),  // Jan 11, 2024 - Lunar 1st
        new Date(2024, 0, 25),  // Jan 25, 2024 - Lunar 15th
        new Date(2024, 1, 10),  // Feb 10, 2024 - Lunar 1st
        new Date(2024, 1, 24),  // Feb 24, 2024 - Lunar 15th
    ];

    console.log('Testing lunar date calculations:');
    testDates.forEach(date => {
        const lunar = Lunar.fromDate(date);
        const isVeggieDay = isLunarFirstOrFifteenth(date);
        console.log(`${date.toLocaleDateString()}: Lunar day ${lunar.getDay()}, isVeggieDay: ${isVeggieDay}`);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    document.getElementById('calendarYear').textContent = `${new Date().getFullYear()} DATES`;
    document.getElementById('downloadCalendar').addEventListener('click', downloadICS);
    testLunarDates(); // Run the test
}); 