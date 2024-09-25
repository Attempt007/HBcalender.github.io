// Calendar Variables and Constants
const monthYearElem = document.getElementById('month-year');
const daysElem = document.getElementById('days');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Calculator Variables
const calculatorForm = document.getElementById('calculator-form');
const inputField = document.getElementById('input-field');
const responseMessage = document.getElementById('response-message');

// Initialize current date variables
let currentYear;
let currentMonth;

// Old shift pattern
const oldShifts = ['OFF', 'OFF', 'E', 'E', 'L', 'L', 'N', 'N']; // Example of old shifts

// New shift pattern
const newShifts = [
    'E', 'E', 'E', 'E', 'E', 'E', // Early Shifts
    'OFF', 'OFF', // Days Off
    'L', 'L', 'L', 'L', 'L', 'L', // Late Shifts
    'OFF', 'OFF', // Days Off
    'N', 'N', 'N', 'N', 'N', 'N', // Night Shifts
    'OFF', 'OFF'  // Days Off
];

// Define the end date for old shifts
const shiftEndDate = new Date(2024, 8, 30); // September 30, 2024

// Define special shifts with descriptions
const specialShifts = {
    '2024-09-24': { code: '#PH', description: 'ទិវា​ប្រកាស​រដ្ឋ​ធម្មនុញ្ញ (Constitution Day)' },
    '2024-10-01': { code: '#PH', description: 'ពិធី​បុណ្យ​ភ្ជុំ​បិណ្ឌ (Pchum Ben Festival)' },
    '2024-10-02': { code: '#PH', description: 'ពិធី​បុណ្យ​ភ្ជុំ​បិណ្ឌ (Pchum Ben Festival)' },
    '2024-10-03': { code: '#PH', description: 'ពិធី​បុណ្យ​ភ្ជុំ​បិណ្ឌ (Pchum Ben Festival)' },
    '2024-10-15': { code: '#PH', description: "ទិវា​ប្រារព្ធ​ពិធី​គោរព​ព្រះវិញ្ញាណក្ខន្ធ (King Father's Commemoration Day)" },
    '2024-10-29': { code: '#PH', description: "ព្រះ​រាជ​ពិធី​គ្រង​ព្រះ​បរម​រាជ​សម្បត្តិ (King's Coronation Day)" },
    '2024-11-09': { code: '#PH', description: 'ពិធី​បុណ្យ​ឯករាជ្យ​ជាតិ (Independence Day)' },
    '2024-11-14': { code: '#PH', description: 'ព្រះ​រាជ​ពិធី​បុណ្យ​អុំ​ទូក (Water Festival)' },
    '2024-11-15': { code: '#PH', description: 'ព្រះ​រាជ​ពិធី​បុណ្យ​អុំ​ទូក (Water Festival)' },
    '2024-11-16': { code: '#PH', description: 'ព្រះ​រាជ​ពិធី​បុណ្យ​អុំ​ទូក (Water Festival)' },
};

// Initialize the calendar to the current date
function initializeCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar(currentYear, currentMonth);
}

// Format date as 'YYYY-MM-DD'
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get the appropriate shift for a given date
function getShift(date) {
    const formattedDate = formatDate(date);

    // Check for special shifts first
    if (specialShifts[formattedDate]) {
        return specialShifts[formattedDate];
    }

    // If the date is after the shift end date, use the new shifts
    if (date > shiftEndDate) {
        return getNewShift(date);
    }

    // Use the old shifts
    return getOldShift(date);
}

// Function to get the old shift
function getOldShift(date) {
    const firstDate = new Date(currentYear, 0, 1);
    const daysSinceStart = Math.floor((date - firstDate) / (1000 * 60 * 60 * 24));
    const regularShiftCode = oldShifts[daysSinceStart % oldShifts.length];

    return { code: regularShiftCode, description: '' };
}

// Function to get the new shift
function getNewShift(date) {
    const firstDate = new Date(2024, 9, 1); // October 1, 2024
    const daysSinceStart = Math.floor((date - firstDate) / (1000 * 60 * 60 * 24));
    const regularShiftCode = newShifts[daysSinceStart % newShifts.length];

    return { code: regularShiftCode, description: '' };
}

// Render the calendar for the given month and year
function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const fragment = document.createDocumentFragment();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'empty';
        fragment.appendChild(div);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= lastDate; day++) {
        const cellDate = new Date(year, month, day);
        const isToday = cellDate.toDateString() === today.toDateString();
        const shift = getShift(cellDate);
        const dayDiv = document.createElement('div');
        dayDiv.className = `day ${isToday ? 'today' : ''}`;
        dayDiv.innerHTML = `${day} <span class="shift ${shift.code === '#PH' ? 'ph' : ''}" data-shift="${shift.code}">${shift.code}</span>`;

        // Add click event listener to the day cell
        dayDiv.addEventListener('click', () => showDateInfo(cellDate));

        fragment.appendChild(dayDiv);
    }

    daysElem.innerHTML = '';
    daysElem.appendChild(fragment);

    // Update the month-year heading
    monthYearElem.textContent = new Date(year, month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
}

// Navigate to the previous month
function goToPreviousMonth() {
    if (currentMonth === 0) {
        currentMonth = 11; // December
        currentYear--;
    } else {
        currentMonth--;
    }
    renderCalendar(currentYear, currentMonth);
}

// Navigate to the next month
function goToNextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0; // January
        currentYear++;
    } else {
        currentMonth++;
    }
    renderCalendar(currentYear, currentMonth);
}

// Show information about the clicked date using alert
function showDateInfo(date) {
    const formattedDate = formatDate(date);
    const shift = getShift(date);

    // Display the information using alert
    alert(`Date: ${formattedDate}\nShift: ${shift.code}\nDescription: ${shift.description || 'Regular Shift'}`);
}

// Handle form submissions
async function handleFormSubmit(event) {
    event.preventDefault();
    const input = inputField.value.trim();

    try {
        const resultMessage = await processInput(input);
        await sendMessage(resultMessage);
        responseMessage.textContent = resultMessage;
    } catch (error) {
        responseMessage.textContent = `Error: ${error.message}`;
    }
}

// Attach event listeners
if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', goToPreviousMonth);
    nextMonthBtn.addEventListener('click', goToNextMonth);
}

if (calculatorForm && inputField && responseMessage) {
    calculatorForm.addEventListener('submit', handleFormSubmit);
}

// Initialize calendar on page load
initializeCalendar();
