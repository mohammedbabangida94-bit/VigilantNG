// 1. GLOBAL STATE (Top level so all functions see them)
let isSent = false;
let countdown;
let timeLeft = 3;

// Updated Helper for Multiple Contacts
const smsUrlBuilder = (body) => {
    const c1 = document.getElementById('contact1')?.value || "";
    const c2 = document.getElementById('contact2')?.value || "";
    
const cleanC1 = c1.replace(/\s+/g, '');
const cleanC2 = c2.replace(/\s+/g, '');
const contacts = [cleanC1, cleanC2].filter(n => n.length > 0);

    // TRICK: For multi-contact with a body on Android, 
    // some apps prefer a semicolon and a different body prefix.
    const recipients = contacts.join(';'); 
    
    // If multiple contacts exist, we use &body instead of ?body for some Android versions
    const separator = recipients.includes(';') ? '&' : '?';
    
    return `sms:${recipients}${separator}body=${encodeURIComponent(body)}`;
};
const showSmsButton = (smsUrl) => {
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.innerHTML = `
        <a href="${smsUrl}" id="send-sms-final" style="background: #25D366; display:block; padding: 20px; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; text-align: center; margin-top:10px;">
           📲 SEND SMS
        </a>`;
};

// 3. THE RESET LOGIC
window.stopAll = () => {
    if (confirm("Do you want to stop siren and reset App? (Stop & Reset?)")) {
        const siren = document.getElementById('sirenAudio');
        if (siren) {
            siren.pause();
            siren.currentTime = 0;
        }
        if (navigator.vibrate) navigator.vibrate(0);
        isSent = false;
        location.reload(); // Hard reset to clear UI
    }
};

// 4. THE MAIN ENGINE
document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const sosButton = document.getElementById('sos-btn');
    const statusMsg = document.getElementById('statusMsg');
    const timerDisplay = document.getElementById('timer');
    const siren = document.getElementById('sirenAudio');
    const stopBtn = document.getElementById('stop-btn');
    const stealthToggle = document.getElementById('stealthToggle');
    const bloodInput = document.getElementById('bloodGroup');
    const allergiesInput = document.getElementById('allergies');

    // Load Saved Data
    if (stealthToggle) {
        stealthToggle.checked = localStorage.getItem('vgn_stealth_mode') === 'true';
        stealthToggle.addEventListener('change', () => localStorage.setItem('vgn_stealth_mode', stealthToggle.checked));
    }
    if (bloodInput) {
        bloodInput.value = localStorage.getItem('vgn_blood') || '';
        bloodInput.addEventListener('input', () => localStorage.setItem('vgn_blood', bloodInput.value));
    }
    if (allergiesInput) {
        allergiesInput.value = localStorage.getItem('vgn_allergies') || '';
        allergiesInput.addEventListener('input', () => localStorage.setItem('vgn_allergies', allergiesInput.value));
    }

    const contact2Input = document.getElementById('contact2');
if(contact2Input) {
    contact2Input.value = localStorage.getItem('vgn_contact2') || '';
    contact2Input.addEventListener('input', () => {
        localStorage.setItem('vgn_contact2', contact2Input.value);
    });
}

    // Stealth Siren Logic
    window.playSiren = () => {
        const isStealth = localStorage.getItem('vgn_stealth_mode') === 'true';
        if (!isStealth && siren) {
            siren.play().catch(e => console.log("Audio Blocked"));
            if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        }
    };

    // SOS Functions
    const startSOS = () => {
        if (isSent) return;
        timeLeft = 3;
        timerDisplay.innerText = timeLeft;
        sosButton.classList.add('active');
        statusMsg.innerText = "Hold for 3 Seconds...";
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
        statusMsg.innerText = "VigilantNG Ready";
    };

    const finishSOS = () => {
        isSent = true;
        sosButton.classList.add('sent');
        statusMsg.innerText = "Processing Emergency...";

        const blood = localStorage.getItem('vgn_blood') || "Not Provided";
        const allergies = localStorage.getItem('vgn_allergies') || "None";

        navigator.geolocation.getCurrentPosition((position) => {
            const mapUrl = `https://www.google.com/maps?q=$${position.coords.latitude},${position.coords.longitude}`;
            const smsBody = `VIGILANTNG EMERGENCY!%0ALocation: ${mapUrl}%0ABlood: ${blood}%0AAllergies: ${allergies}`;
            showSmsButton(smsUrlBuilder(smsBody));
            window.playSiren();
        }, (err) => {
            const smsBody = `VIGILANTNG EMERGENCY! (GPS Off)%0ABlood: ${blood}%0AAllergies: ${allergies}`;
            showSmsButton(smsUrlBuilder(smsBody));
            window.playSiren();
        }, { enableHighAccuracy: true });
    };

    // Listeners
    sosButton.addEventListener('mousedown', startSOS);
    sosButton.addEventListener('mouseup', cancelSOS);
    sosButton.addEventListener('touchstart', (e) => { e.preventDefault(); startSOS(); });
    sosButton.addEventListener('touchend', cancelSOS);
    
    if (stopBtn) stopBtn.addEventListener('click', window.stopAll);
});

const contactInput = document.getElementById('contact1');
if(contactInput) {
    // Load saved number
    contactInput.value = localStorage.getItem('vgn_contact') || '';
    // Save number as they type
    contactInput.addEventListener('input', () => {
        localStorage.setItem('vgn_contact', contactInput.value);
    });
}