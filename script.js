// Timer Form Container
const timerEl = document.getElementById('timer-popup');

// Timer Form Selector
const timerForm = document.getElementById('timer-form');

// Timer Settings Button
const settingsBtn = document.getElementById('settingsBtn');

// Progress Bar
const progressEl = document.getElementById('progress-wrapper');

// Close Popup Button
const closePopup = document.getElementById('closePopup');

// Timer Text
const timerText = document.getElementById('timer-wrapper');

// Play or Pause Button
const ppBtn = document.getElementById('pause_play_btn');

// Stop Button
const stopBtn = document.getElementById('stop_btn');

// Water Audio Selector
const waterAudio = document.getElementById('waterAudio');

// Nature Audio Selector
const natureAudio = document.getElementById('natureAudio');

const fireAudio = document.getElementById('fireAudio');

const rainAudio = document.getElementById('rainAudio');

const beachAudio = document.getElementById('beachAudio');

// Current set Timer 
let currentTimer = timerText.innerText;

// Current set Timer Total Seconds
let currentTimerTotalSec = timerText.innerText;

// Progress Total
let progressTotal = parseFloat((window.getComputedStyle(progressEl.querySelector('circle')).strokeDasharray).replace('px', ''));

// Timer Interval
let TimerInterval;

// Initialize Audio Settings
waterAudio.loop = true;
waterAudio.currentTime = 0;

natureAudio.loop = true;
natureAudio.currentTime = 0;

fireAudio.loop = true;
fireAudio.currentTime = 0;

rainAudio.loop = true;
rainAudio.currentTime = 0;

beachAudio.loop = true;
beachAudio.currentTime = 0;

// Getting Total Seconds of the Timer 
const getTotalSecs = () => {
    var timer = timerText.innerText;
    timer = timer.split(":");
    
    timer[0] = parseInt(timer[0]);
    timer[1] = parseInt(timer[1]);
    timer[2] = parseInt(timer[2]);

    return ((timer[0] * (60 * 60)) + (timer[1] * 60) + timer[2]);
};
currentTimerTotalSec = getTotalSecs();

// Open Meditation Timer Configuration or settings
settingsBtn.addEventListener('click', e => {
    e.preventDefault();
    if(!timerEl.classList.contains('show'))
        timerEl.classList.add('show');
});

// Close Meditation Timer Configuration or settings
closePopup.addEventListener('click', e => {
    e.preventDefault();
    if(timerEl.classList.contains('show'))
        timerEl.classList.remove('show');
});

// Function to reset all audios except the selected one
const resetAudiosExcept = (selectedAudio) => {
    [natureAudio, waterAudio, fireAudio, rainAudio, beachAudio].forEach(audio => {
        if (audio !== selectedAudio) {
            audio.dataset.selected = false;
        }
    });
};

// Helper function to get the selected audio based on the background music selection
const getSelectedAudio = () => {
    switch (document.getElementById('bg-select').value) {
        case 'nature':
            return natureAudio;
        case 'water':
            return waterAudio;
        case 'fire':
            return fireAudio;
        case 'rain':
            return rainAudio;
        case 'beach':
            return beachAudio;
        default:
            return natureAudio; // default to nature audio if nothing is selected
    }
};

// Update Meditation Timer Configuration or settings
timerForm.addEventListener('submit', function(e){
    e.preventDefault();
    var timer = document.getElementById('timer-input');
    var audio = document.getElementById('bg-select').value;

    timerText.innerText = timer.value;
    currentTimer = timerText.innerText;
    currentTimerTotalSec = getTotalSecs();
    progressEl.querySelector('circle').style.animationDuration = `${currentTimerTotalSec}s`;

    // Removed the if-else block as switch-case is handling all cases

    switch(audio) {
        case 'nature':
            natureAudio.dataset.selected = true;
            resetAudiosExcept(natureAudio);
            break;
        case 'water':
            waterAudio.dataset.selected = true;
            resetAudiosExcept(waterAudio);
            break;
        case 'fire':
            fireAudio.dataset.selected = true;
            resetAudiosExcept(fireAudio);
            break;
        case 'rain':
            rainAudio.dataset.selected = true;
            resetAudiosExcept(rainAudio);
            break;
        case 'beach':
            beachAudio.dataset.selected = true;
            resetAudiosExcept(beachAudio);
            break;
        default:
            natureAudio.dataset.selected = true;
            resetAudiosExcept(natureAudio);
            break;
    }

    alert("Meditation Configuration has been updated successfully!");
    if(timerEl.classList.contains('show'))
        timerEl.classList.remove('show');
    reset_timer();
});

// Reset Meditation Timer
const reset_timer = () => {
    var audio = getSelectedAudio();
    audio.pause();
    clearInterval(TimerInterval);
    audio.currentTime = 0;
    timerText.innerText = currentTimer;
    settingsBtn.style.display = 'block';
    ppBtn.removeAttribute('data-play');
    ppBtn.innerHTML = `<span class="material-symbols-outlined">sound_sampler</span>`;
    progressEl.querySelector('circle').style.animationName = 'none';

    setTimeout(() => {
        progressEl.querySelector('circle').style.animationName = 'radialProgress';
        progressEl.querySelector('circle').style.animationPlayState = 'paused';
    }, 0);
};

// Start Meditation Timer
const start_timer = () => {
    var audio = getSelectedAudio();
    audio.play();
    TimerInterval = setInterval(() => {
        var timer = timerText.innerText.split(":");

        timer[0] = parseInt(timer[0]);
        timer[1] = parseInt(timer[1]);
        timer[2] = parseInt(timer[2]);

        if (timer[2] > 0) {
            timer[2] -= 1;
        } else if (timer[1] > 0) {
            timer[2] = 59;
            timer[1] -= 1;
        } else if (timer[0] > 0) {
            timer[2] = 59;
            timer[1] = 59;
            timer[0] -= 1;
        } else {
            audio.pause();
            alert("Meditation Time is Finish!");
            reset_timer();
            return false;
        }

        timer[0] = String(timer[0]).padStart(2, '0');
        timer[1] = String(timer[1]).padStart(2, '0');
        timer[2] = String(timer[2]).padStart(2, '0');
        timerText.innerText = `${timer[0]}:${timer[1]}:${timer[2]}`;
    }, 1000);
};

// Pause Meditation Timer
const pause_timer = () => {
    var audio = getSelectedAudio();
    audio.pause();
    clearInterval(TimerInterval);
    progressEl.querySelector('circle').style.animationPlayState = 'paused';
};

// Play/Pause Button Event Listener
ppBtn.addEventListener('click', e => {
    e.preventDefault();
    var is_started = ppBtn.hasAttribute('data-play');
    if(!is_started){
        ppBtn.setAttribute('data-play', true);
        ppBtn.innerHTML = `<span class="material-symbols-outlined">pause_circle</span>`;
        stopBtn.style.display = `block`;
        settingsBtn.style.display = 'none';
        start_timer();
        progressEl.querySelector('circle').style.animationPlayState = `running`;
    } else {
        ppBtn.removeAttribute('data-play');
        ppBtn.innerHTML = `<span class="material-symbols-outlined">sound_sampler</span>`;
        // stopBtn.style.display = `none`;
        settingsBtn.style.display = 'block';
        pause_timer();
        progressEl.querySelector('circle').style.animationPlayState = `paused`;
    }
});

// Stop Button Event Listener
stopBtn.addEventListener('click', e => {
    e.preventDefault();
    reset_timer();
});
