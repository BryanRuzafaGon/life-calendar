const LIFE_EXPECTANCY_YEARS = 80;

let quotes = [];

async function loadQuotes() {
    try {
        const response = await fetch('quotes.json');
        quotes = await response.json();
        rotateQuote();
    } catch (error) {
        console.error("Error cargando frases:", error);
        quotes = ["Memento Mori. Recuerda que morirás."];
        rotateQuote();
    }
}

function rotateQuote() {
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('motivational-quote').textContent = `"${randomQuote}"`;
    }
}

function calculateWeeksLived(birthDateString) {
    const birthDate = new Date(birthDateString);
    const now = new Date();
    const diffTime = Math.abs(now - birthDate);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
}

function renderGrid(weeksLived, totalWeeks) {
    const grid = document.getElementById('life-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < totalWeeks; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i < weeksLived) {
            dot.classList.add('lived');
        } else if (i === weeksLived) {
            dot.classList.add('current');
        } else {
            dot.classList.add('future');
        }
        grid.appendChild(dot);
    }
}

function updateYearProgress() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    
    const percent = ((now - start) / (end - start)) * 100;
    const boundedPercent = Math.min(Math.max(percent, 0), 100);
    
    document.getElementById('progress-year-label').textContent = `${now.getFullYear()} PROGRESS`;
    document.getElementById('progress-percent').textContent = `${boundedPercent.toFixed(1)}%`;
    
    setTimeout(() => {
        const fill = document.getElementById('year-progress-fill');
        if (fill) fill.style.width = `${boundedPercent}%`;
    }, 50);
}

function getActiveSegmentValue(controlId) {
    const activeBtn = document.querySelector(`#${controlId} .segment-btn.active`);
    return activeBtn ? activeBtn.dataset.val : null;
}

function setActiveSegmentValue(controlId, value) {
    const control = document.getElementById(controlId);
    if (!control || !value) return;
    control.querySelectorAll('.segment-btn').forEach(btn => {
        if (btn.dataset.val === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateUI() {
    // Leer valores de localStorage
    const savedBirthday = localStorage.getItem('lc_birthday') || '2006-08-10';
    const savedTitle = localStorage.getItem('lc_title') || 'bryan ruzafa gonçalves';
    const savedOverride = localStorage.getItem('lc_override_weeks') || '';

    const savedBg = localStorage.getItem('lc_bg') || 'black';
    const savedShape = localStorage.getItem('lc_shape') || 'circle';
    const savedGroup = localStorage.getItem('lc_group') || 'decades';
    const savedFooter = localStorage.getItem('lc_footer') || 'quote';

    // Set inputs
    document.getElementById('input-birthday').value = savedBirthday;
    document.getElementById('input-title').value = savedTitle;
    document.getElementById('input-override-weeks').value = savedOverride;

    setActiveSegmentValue('bg-control', savedBg);
    setActiveSegmentValue('shape-control', savedShape);
    setActiveSegmentValue('group-control', savedGroup);
    setActiveSegmentValue('footer-control', savedFooter);

    // Calcular stats
    let weeksLived = calculateWeeksLived(savedBirthday);
    if (savedOverride && !isNaN(parseInt(savedOverride))) {
        weeksLived = parseInt(savedOverride);
    }
    const totalWeeks = LIFE_EXPECTANCY_YEARS * 52;
    const weeksRemaining = totalWeeks - weeksLived;

    // Actualizar Textos
    document.getElementById('wallpaper-title').textContent = savedTitle;
    document.getElementById('weeks-lived-display').textContent = weeksLived;
    document.getElementById('weeks-remaining-display').textContent = weeksRemaining;

    // Year Progress Bar
    updateYearProgress();

    // Apply Styles/Themes
    const container = document.getElementById('wallpaper-container');
    container.className = 'iphone-14-pro-max'; // Reset
    if (savedBg === 'white') container.classList.add('theme-white');
    if (savedShape !== 'circle') container.classList.add(`shape-${savedShape}`);
    if (savedGroup === 'decades') container.classList.add('group-decades');
    if (savedFooter === 'none') container.classList.add('footer-none');

    renderGrid(weeksLived, totalWeeks);
}

function updateMockClock() {
    const now = new Date();
    const mockTime = document.getElementById('mock-time');
    const mockDate = document.getElementById('mock-date');
    
    // Format Time 21:19
    mockTime.textContent = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    // Format Date Wed Mar 18
    mockDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Events
document.querySelectorAll('.segment-control').forEach(control => {
    control.addEventListener('click', (e) => {
        if(e.target.classList.contains('segment-btn')) {
            control.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            saveSettings();
        }
    });
});

document.getElementById('btn-save').addEventListener('click', () => {
    saveSettings();
    rotateQuote();
});

function saveSettings() {
    localStorage.setItem('lc_birthday', document.getElementById('input-birthday').value);
    localStorage.setItem('lc_title', document.getElementById('input-title').value);
    localStorage.setItem('lc_override_weeks', document.getElementById('input-override-weeks').value);

    localStorage.setItem('lc_bg', getActiveSegmentValue('bg-control'));
    localStorage.setItem('lc_shape', getActiveSegmentValue('shape-control'));
    localStorage.setItem('lc_group', getActiveSegmentValue('group-control'));
    localStorage.setItem('lc_footer', getActiveSegmentValue('footer-control'));
    
    updateUI();
}

document.getElementById('btn-export').addEventListener('click', () => {
        // Preparar para foto
        const container = document.getElementById('wallpaper-container');
        const originalTransform = container.style.transform;
        const originalBorderRadius = container.style.borderRadius;
        const originalBorder = container.style.border;
        
        container.style.transform = 'none';
        container.style.borderRadius = '0';
        container.style.border = 'none';
        
        const mockUI = document.getElementById('ios-mock-ui');
        mockUI.style.visibility = 'hidden';
        container.classList.add('export-mode'); // Congela animación para foto

        const savedBg = localStorage.getItem('lc_bg') || 'black';

        html2canvas(container, {
            scale: 3, // Multiplicador de resolución (430x932) -> 1290x2796
            useCORS: true,
            backgroundColor: savedBg === 'white' ? '#FFFFFF' : '#000000'
        }).then(canvas => {
            // Restaurar estilo
            container.style.transform = originalTransform;
            container.style.borderRadius = originalBorderRadius;
            container.style.border = originalBorder;
            mockUI.style.visibility = 'visible';
            container.classList.remove('export-mode');

        const link = document.createElement('a');
        link.download = `life-calendar-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// Init
loadQuotes();
updateUI();
updateMockClock();
setInterval(updateMockClock, 30000);

// PWA Navigation Logic
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update bottom bar highlighting
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show correct view
        const targetId = btn.getAttribute('data-target');
        document.querySelectorAll('.view-panel').forEach(v => {
            v.classList.remove('active');
            v.classList.add('hidden');
        });
        
        const targetView = document.getElementById(targetId);
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    });
});

// ============================================
// 369 MANIFESTATION LOGIC
// ============================================

const TIME_LOCKS = {
    morning: { hour: 6, min: 0, count: 3 },
    afternoon: { hour: 14, min: 0, count: 6 },
    night: { hour: 21, min: 15, count: 9 }
};

function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

function initManifestationEngine() {
    // Generate input fields dynamically
    Object.keys(TIME_LOCKS).forEach(period => {
        const container = document.getElementById(`inputs-${period}`);
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < TIME_LOCKS[period].count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'manifest-input';
            input.placeholder = `Intención ${i+1}...`;
            input.dataset.period = period;
            input.dataset.index = i;
            
            // Save on type
            input.addEventListener('input', () => saveManifestation());
            container.appendChild(input);
        }
    });

    // Load saved goal
    const goalEl = document.getElementById('manifest-goal');
    goalEl.textContent = localStorage.getItem('manifest_goal') || 'Building my empire';
    goalEl.addEventListener('input', () => {
        localStorage.setItem('manifest_goal', goalEl.textContent);
    });

    loadTodayManifestations();
    checkTimeLocks();
    setInterval(checkTimeLocks, 60000); // Check locks every minute
}

function checkTimeLocks() {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    Object.keys(TIME_LOCKS).forEach(period => {
        const lockSettings = TIME_LOCKS[period];
        const unlockMins = lockSettings.hour * 60 + lockSettings.min;
        const blockEl = document.getElementById(`block-${period}`);
        const statusEl = blockEl.querySelector('.lock-status');
        
        if (currentMins >= unlockMins) {
            blockEl.classList.remove('locked');
            statusEl.textContent = 'ABIERTO';
            statusEl.style.color = '#ffd700';
            statusEl.style.background = 'rgba(255, 215, 0, 0.1)';
        } else {
            blockEl.classList.add('locked');
            statusEl.textContent = `Bloqueado hasta ${String(lockSettings.hour).padStart(2,'0')}:${String(lockSettings.min).padStart(2,'0')}`;
            statusEl.style.color = '#666';
            statusEl.style.background = '#222';
        }
    });
}

function saveManifestation() {
    const today = getTodayKey();
    const data = { morning: [], afternoon: [], night: [] };
    
    document.querySelectorAll('.manifest-input').forEach(input => {
        data[input.dataset.period][input.dataset.index] = input.value;
    });
    
    localStorage.setItem(`manifest_369_${today}`, JSON.stringify(data));
    checkDailyCompletion();
}

function loadTodayManifestations() {
    const today = getTodayKey();
    const saved = localStorage.getItem(`manifest_369_${today}`);
    if (saved) {
        const data = JSON.parse(saved);
        document.querySelectorAll('.manifest-input').forEach(input => {
            if (data[input.dataset.period] && data[input.dataset.period][input.dataset.index]) {
                input.value = data[input.dataset.period][input.dataset.index];
            }
        });
    }
}

function checkDailyCompletion() {
    // Check if ALL 18 inputs are filled
    const allFilled = Array.from(document.querySelectorAll('.manifest-input')).every(input => input.value.trim().length > 0);
    
    const today = getTodayKey();
    const completedDays = JSON.parse(localStorage.getItem('manifest_completed_days') || '[]');
    
    if (allFilled && !completedDays.includes(today)) {
        completedDays.push(today);
        localStorage.setItem('manifest_completed_days', JSON.stringify(completedDays));
        // Todo: Recalculate Streak
    } else if (!allFilled && completedDays.includes(today)) {
        // If they delete text
        const index = completedDays.indexOf(today);
        completedDays.splice(index, 1);
        localStorage.setItem('manifest_completed_days', JSON.stringify(completedDays));
    }
    
    updateStreakUI();
}

function updateStreakUI() {
    const completedDays = JSON.parse(localStorage.getItem('manifest_completed_days') || '[]');
    const today = new Date();
    const todayStr = getTodayKey();
    
    let currentStreak = 0;
    
    // Sort array
    completedDays.sort().reverse();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().slice(0, 10);
    
    if (completedDays.length > 0) {
        if (completedDays[0] === todayStr || completedDays[0] === yestStr) {
            currentStreak = 1;
            let checkDate = new Date(completedDays[0]);
            
            for (let i = 1; i < completedDays.length; i++) {
                checkDate.setDate(checkDate.getDate() - 1);
                if (completedDays[i] === checkDate.toISOString().slice(0, 10)) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
    }
    
    document.getElementById('streak-count').textContent = currentStreak;
    renderStreakCalendar(completedDays, todayStr);
}

function renderStreakCalendar(completedDays, todayStr) {
    const container = document.getElementById('streak-calendar');
    if (!container) return;
    container.innerHTML = '';
    
    const daysOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    const today = new Date();
    
    // Render last 7 days ending today
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dayLetter = daysOfWeek[d.getDay()];
        
        const isDone = completedDays.includes(dateStr);
        const isToday = dateStr === todayStr;
        
        let circleClass = 'streak-circle';
        let innerHtml = '';
        
        if (isDone) {
            circleClass += ' done';
            innerHtml = '🔥';
        } else if (isToday) {
            circleClass += ' today-pending';
        }
        
        container.innerHTML += `
            <div class="streak-day">
                <span class="streak-letter" style="${isToday ? 'color:#fff' : ''}">${dayLetter}</span>
                <div class="${circleClass}">${innerHtml}</div>
            </div>
        `;
    }
}

// Ensure streak UI updates on load
const originalInit = initManifestationEngine;
initManifestationEngine = function() {
    originalInit();
    updateStreakUI();
};

document.getElementById('btn-enable-notifications')?.addEventListener('click', async () => {
    if (!('Notification' in window)) {
        alert("Tu dispositivo no soporta Notificaciones Web Push.");
        return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        alert("¡Sinergia Creada! 🔔 Tu PWA ahora tiene permisos para avisarte en tus checkpoints de poder (06:00, 14:00 y 21:15). Mantén la App abierta o mínimamente en segundo plano para que el Worker pueda avisarte.");
    } else {
        alert("Permiso denegado. No te llegarán alertas.");
    }
});

// Call init at the end
initManifestationEngine();
