// 1. Variable Declarations
let timer = null; 
let count = 3;    

const sosBtn = document.getElementById('sos-btn');
const statusMsg = document.getElementById('status-msg');

// 2. The Main Click Logic
sosBtn.addEventListener('click', () => {
    // Check if a countdown is already happening
    if (timer) {
        cancelSOS();
        return;
    }

    startCountdown();
});

// 3. The Countdown Function
function startCountdown() {
    count = 3;
    sosBtn.innerText = count;
    sosBtn.style.backgroundColor = "#ff9800"; // Orange
    statusMsg.innerText = "🚨 SOS initializing... Click to cancel.";
    statusMsg.style.color = "orange";

    timer = setInterval(() => {
        count--;
        sosBtn.innerText = count;

        if (count <= 0) {
            finishSOS();
        }
    }, 1000);
}

// 4. The Cancel Function
function cancelSOS() {
    clearInterval(timer);
    timer = null;
    sosBtn.innerText = "SOS";
    sosBtn.style.backgroundColor = "#d32f2f"; // Back to Red
    statusMsg.innerText = "Alert Cancelled.";
    statusMsg.style.color = "black";
}

// 5. The "Fire" Function
function finishSOS() {
    clearInterval(timer);
    timer = null;
    sosBtn.innerText = "SENT";
    sosBtn.style.backgroundColor = "#4caf50"; // Green
    statusMsg.innerText = "🚨 Alert Sent to Estate Security!";
    statusMsg.style.color = "red";

    if ("vibrate" in navigator) {
        navigator.vibrate([500, 110, 500]); 
    }
    
    // --- NEW RESET LOGIC ---
    // After 5 seconds (5000ms), reset the button to its original state
    setTimeout(() => {
        if (!timer) { // Only reset if a new countdown hasn't started
            sosBtn.innerText = "SOS";
            sosBtn.style.backgroundColor = "#d32f2f"; // Back to Red
            statusMsg.innerText = "Ready";
            statusMsg.style.color = "black";
        }
    }, 5000);


    console.log("SOS triggered at: " + new Date().toLocaleTimeString());
}

