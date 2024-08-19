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

// Define the shift pattern and special shifts with descriptions
const shifts = ['OFF', 'OFF', 'E', 'E', 'L', 'L', 'N', 'N'];

const specialShifts = {
    '2024-09-24': { code: '#PH', description: 'ទិវា​ប្រកាស​រដ្ឋ​ធម្មនុញ្ញ (Constitution Day)' },
    '2024-10-01': { code: '#PH', description: 'ពិធី​បុណ្យ​ភ្ជុំ​បិណ្ឌ (Pchum Ben Festival)' },
    '2024-10-02': { code: '#PH', description: 'ពិធី​បុណ្យ​ភ្ជុំ​បិណ្ឌ (Pchum Ben Festival)' },
    '2024-10-03': { code: '#PH', description: 'ពិធី​បុណ្យ​ភ្ជុំ​បិណ្ឌ (Pchum Ben Festival)' },
    '2024-10-15': { code: '#PH', description: "ទិវា​ប្រារព្ធ​ពិធី​គោរព​ព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណា​ព្រះបាទ​សម្តេច​ព្រះ នរោត្តម សីហនុ ព្រះមហាវីរក្សត្រ ព្រះ​វររាជ​បិតា​ឯករាជ្យ បូរណភាព​ទឹកដី និង​ឯកភាព​ជាតិ​ខ្មែរ (King Father's Commemoration Day)" },
    '2024-10-29': { code: '#PH', description: "ព្រះ​រាជ​ពិធី​គ្រង​ព្រះ​បរម​រាជ​សម្បត្តិ​របស់​ ព្រះ​ករុណា​ព្រះ​បាទ​សម្តេច​ព្រះ​បរមនាថ នរោត្តម សីហមុនី ព្រះ​មហាក្សត្រ​នៃ​ព្រះរាជាណាចក្រ​កម្ពុជា (King's Coronation Day)" },
    '2024-11-09': { code: '#PH', description: 'ពិធី​បុណ្យ​ឯករាជ្យ​ជាតិ (Independence Day)' },
    '2024-11-14': { code: '#PH', description: 'ព្រះ​រាជ​ពិធី​បុណ្យ​អុំ​ទូក បណ្ដែត​ប្រទីប និង​សំពះ​ព្រះ​ខែ អកអំបុក (Water Festival)' },
    '2024-11-15': { code: '#PH', description: 'ព្រះ​រាជ​ពិធី​បុណ្យ​អុំ​ទូក បណ្ដែត​ប្រទីប និង​សំពះ​ព្រះ​ខែ អកអំបុក (Water Festival)' },
    '2024-11-16': { code: '#PH', description: 'ព្រះ​រាជ​ពិធី​បុណ្យ​អុំ​ទូក បណ្ដែត​ប្រទីប និង​សំពះ​ព្រះ​ខែ អកអំបុក (Water Festival)' },
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

// Get the shift for a given date, including special shift details
function getShift(date) {
    const formattedDate = formatDate(date);

    // Check for special shifts
    if (specialShifts[formattedDate]) {
        return specialShifts[formattedDate];
    }

    // If no special shift, return the regular shift
    const firstDate = new Date(currentYear, 0, 1); // January 1 of the current year
    const daysSinceStart = Math.floor((date - firstDate) / (1000 * 60 * 60 * 24));
    return { code: shifts[daysSinceStart % shifts.length], description: '' };
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

// Process the input expression
const processInput = async (expression) => {
    try {
        // Handle time calculation
        const pattern = /(\d+(\.\d+)?)[Hh]$/;
        const match = expression.match(pattern);
        if (match) {
            const bbt = parseFloat(match[1]);
            const times = ((bbt * 100 / 0.33) / 60000);
            const hours = Math.floor(times);
            const mins = (times - hours) * 60;
            const secs = (mins - Math.floor(mins)) * 60;

            const actualTimeStr = `${hours}h ${Math.floor(mins)}m ${Math.floor(secs)}s`;

            const now = new Date();
            const estimatedTime = new Date(now.getTime() + (hours * 3600000) + (Math.floor(mins) * 60000) + (Math.floor(secs) * 1000));

            let estimatedTimeStr;
            if (estimatedTime.toDateString() === now.toDateString()) {
                estimatedTimeStr = `Today, ${estimatedTime.toLocaleTimeString()}`;
            } else if (estimatedTime.toDateString() === new Date(now.getTime() + 86400000).toDateString()) {
                estimatedTimeStr = `Tomorrow, ${estimatedTime.toLocaleTimeString()}`;
            } else {
                estimatedTimeStr = `${estimatedTime.getDate()} ${estimatedTime.toLocaleString('default', { month: 'short' })}, ${estimatedTime.getFullYear()}`;
            }

            const cans = (bbt * 100 / 0.33);
            const pal = cans / 5940;
            const layer = (pal - Math.floor(pal)) * 20;
            const can = (layer - Math.floor(layer)) * 297;
            const pall = (cans / 24) / 1400;
            const lay = (pall - Math.floor(pall)) * 14;
            const cart = (lay - Math.floor(lay)) * 100;

            return (
                `Results of ${bbt} HL\n\n`
                + `🕒 Cal_Time : ${actualTimeStr}\n`
                + `📅 Est_Time : ${estimatedTimeStr}\n`
                + "━━━━━━━━━━━━━━━━\n"
                + `🥫 Et. Cans : ${Math.floor(pal)} P, ${Math.floor(layer)} L, ${Math.floor(can)} cans\n`
                + "━━━━━━━━━━━━━━━━\n"
                + `📦 Et. Cartons : ${Math.floor(pall)} P, ${Math.floor(lay)} L, ${Math.floor(cart)} pcs\n`
                + "━━━━━━━━━━━━━━━━\n"
            );
        } else {
            // Safe mathematical expression evaluation (consider using a library like math.js)
            const result = safeEval(expression);
            return `Results:\n\n${result}`;
        }
    } catch (error) {
        throw new Error(`Error processing input: ${error.message}`);
    }
};

// Basic evaluation function, replace with a library for safer operations
const safeEval = (expression) => {
    try {
        return Function('"use strict";return (' + expression + ')')();
    } catch (error) {
        throw new Error('Invalid mathematical expression');
    }
};

// Handle sending messages (replace with server-side implementation in production)
const sendMessage = async (text) => {
    const url = `https://api.telegram.org/bot${'7102609047:AAFbxV2DQsV7Xj7S3TaauODyFNDaHvK0ZY8'}/sendMessage`; // Ensure TOKEN is securely managed
    const chatId = -4174307974; // Ensure CHAT_ID is securely managed

    const payload = {
        chat_id: chatId,
        text: text
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return response.json();
};

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
