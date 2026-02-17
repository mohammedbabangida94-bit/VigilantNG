    document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');

    let countdown;
    let timeLeft = 3;
    let isSent = false; 
    const startSOS = () => {
        if (isSent) return; 
        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        sosButton.classList.add('active');
        statusMsg.innerText = "HOLDING...";

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
        if (isSent) return; 
        clearInterval(countdown);
        sosButton.classList.remove('active');
        timerDisplay.innerText = "";
        statusMsg.innerText = "Ready";
    };

    const finishSOS = () => {
        isSent = true; 
        sosButton.classList.remove('active');
        sosButton.classList.add('sent');
        statusMsg.innerText = "LOCATING...";

        if ("vibrate" in navigator) {
            navigator.vibrate([500, 100, 500]);
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            
            const securityPhone = "+234XXXXXXXXXX"; // Put your number here
            const smsBody = `EMERGENCY! I need help. My location: ${mapUrl}`;
            const smsUrl = `sms:${securityPhone}?body=${encodeURIComponent(smsBody)}`;

            statusMsg.innerHTML = `
                <div style="margin-top:20px;">
                    <a href="${smsUrl}" style="background: #25D366; color: white; padding: 15px; display: block; margin-bottom: 10px; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center;">📲 SEND SMS ALERT</a>
                    <a href="${mapUrl}" target="_blank" style="background: #4285F4; color: white; padding: 15px; display: block; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center;">🗺️ VIEW MAP</a>
                    <button onclick="location.reload()" style="margin-top: 20px; background: none; border: 1px solid #ccc; color: #666; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Reset App</button>
                </div>
            `;
        }, (error) => {
            statusMsg.innerText = "GPS Error: " + error.message;
            isSent = false;
        });
    };
    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
});