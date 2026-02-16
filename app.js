document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS (Check these IDs against your HTML!)
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');

    let countdown;
    let timeLeft = 3;

    // 2. THE FUNCTIONS
    const startSOS = () => {
        if (!sosButton || !statusMsg || !timerDisplay) return; // Safety check
        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        sosButton.classList.add('active');
        statusMsg.innerText = "Hold for 3 seconds...";

        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                finishSOS();
            }
        }, 1000);
    };

    const cancelSOS = () => {
        clearInterval(countdown);
        if (sosButton) sosButton.classList.remove('active');
        if (timerDisplay) timerDisplay.innerText = "";
        if (statusMsg) statusMsg.innerText = "Alert Cancelled";
        
        setTimeout(() => {
            if (statusMsg) statusMsg.innerText = "Ready";
        }, 2000);
    };

    const finishSOS = () => {
        sosButton.classList.remove('active');
        sosButton.classList.add('sent');
        statusMsg.innerText = "Locating...";

        if ("vibrate" in navigator) {
            navigator.vibrate([500, 100, 500]);
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // FIXED SYNTAX BELOW:
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            
            statusMsg.innerHTML = `🚨 ALERT SENT!<br><a href="${mapUrl}" target="_blank" style="color: white; font-weight: bold;">TAP TO VIEW MAP</a>`;
        }, (error) => {
            statusMsg.innerText = "GPS Error: " + error.message;
        });

        setTimeout(() => {
            sosButton.classList.remove('sent');
            statusMsg.innerText = "Ready";
            timerDisplay.innerText = "";
        }, 10000);
    };

    // 3. LISTENERS
    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
});