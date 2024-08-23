document.addEventListener('DOMContentLoaded', function () {
    const opiInput = document.getElementById('opi');
    const bbtInput = document.getElementById('bbt');
    const resultMessage = document.getElementById('resultMessage');
    const sendButton = document.getElementById('sendButton');

    const botToken = '7102609047:AAFbxV2DQsV7Xj7S3TaauODyFNDaHvK0ZY8'; // Replace with your bot token
    const chatId = '-4174307974'; // Replace with your chat ID

    // Set default value for OPI input field
    opiInput.value = '100';

    function calculateResults() {
        const opiPercentage = parseFloat(opiInput.value) || 100; // Default OPI percentage
        const bbt = parseFloat(bbtInput.value) || 0;

        if (isNaN(bbt) || bbt <= 0) {
            resultMessage.textContent = 'Please enter a valid BBT value.';
            sendButton.style.display = 'none'; // Hide the send button if BBT is invalid
            return;
        }

        // Convert OPI percentage to milliseconds
        const opiFraction = (opiPercentage / 100) * 60000;

        // Calculate times in minutes
        const times = ((bbt * 100 / 0.33) / opiFraction);
        const hours = Math.floor(times);
        const mins = (times - hours) * 60;
        const secs = (mins - Math.floor(mins)) * 60;
        const actualTimeStr = `${hours}h ${Math.floor(mins)}m ${Math.floor(secs)}s`;

        // Calculate estimated time without adding extra hours
        const now = new Date();
        const estimatedTime = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (Math.floor(mins) * 60 * 1000) + (Math.floor(secs) * 1000));

        // Format estimated time
        let estimatedTimeStr;
        const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
        if (estimatedTime.toDateString() === now.toDateString()) {
            estimatedTimeStr = `Today, ${estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (estimatedTime.toDateString() === tomorrow.toDateString()) {
            estimatedTimeStr = `Tomorrow, ${estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            estimatedTimeStr = estimatedTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        // Calculate additional metrics
        const cans = (bbt * 100 / 0.33);
        const pal = cans / 5940;
        const layer = (pal - Math.floor(pal)) * 20;
        const can = (layer - Math.floor(layer)) * 297;
        const pall = (cans / 24) / 1400;
        const lay = (pall - Math.floor(pall)) * 14;
        const cart = (lay - Math.floor(lay)) * 100;

        // Create result message
        const resultMessageStr = `
            Results of ${bbt} HL at OPI ${opiPercentage}%\n\n
            🕒 Cal_Time : ${actualTimeStr}\n
            📅 Est_Time : ${estimatedTimeStr}\n
            ━━━━━━━━━━━━━━\n
            🥫 Et. Cans : ${Math.floor(pal)} P, ${Math.floor(layer)} L, ${Math.floor(can)} cans\n
            ━━━━━━━━━━━━━━\n
            📦 Et. Cartons : ${Math.floor(pall)} P, ${Math.floor(lay)} L, ${Math.floor(cart)} pcs\n
            ━━━━━━━━━━━━━━
        `;

        // Update result box and show send button
        resultMessage.textContent = resultMessageStr.trim();
        sendButton.style.display = 'block'; // Show the send button
    }

    function sendToTelegram() {
        const message = encodeURIComponent(resultMessage.textContent);

        // Construct the URL to send the message
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('Message sent successfully!');
            } else {
                alert('Failed to send message.');
            }
        };
    }

    function handleDocumentClick(event) {
        if (event.target !== opiInput && event.target !== bbtInput) {
            // If the clicked target is not the input elements, blur the inputs
            opiInput.blur();
            bbtInput.blur();
        }
    }

    // Add event listeners to update results on input change
    opiInput.addEventListener('input', calculateResults);
    bbtInput.addEventListener('input', calculateResults);

    // Add event listener for the send button
    sendButton.addEventListener('click', sendToTelegram);

    // Add event listener to handle clicks outside the input fields
    document.addEventListener('click', handleDocumentClick);

    // Initialize results
    calculateResults();
});
