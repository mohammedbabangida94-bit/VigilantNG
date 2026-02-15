// app.js - The Heart of VigilantNG

        const sosBtn = document.getElementById('sos-btn');
        const statusMsg = document.getElementById('status-msg');

        sosBtn.addEventListener('click', () => {
            // 1. Physical Feedback (Vibration)
            if ("vibrate" in navigator) {
            navigator.vibrate([500, 110, 500]); // SOS vibration pattern
            }

            // 2. Visual Feedback
            statusMsg.innerText = "🚨 Alert Sent to Estate Security!";
            statusMsg.style.color = "red";

            // 3. Console log for local server testing
            console.log("SOS triggered at: " + new Date().toLocaleTimeString());
    });