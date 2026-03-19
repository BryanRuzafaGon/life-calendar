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
        
        if (targetId === 'view-stats') {
            loadJournalArchive();
        }
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
    goalEl.value = localStorage.getItem('manifest_goal') || 'Ser DJ referente nacional y tener mi Honda Civic Type R';
    goalEl.addEventListener('input', () => {
        localStorage.setItem('manifest_goal', goalEl.value);
    });

    loadTodayManifestations();
    checkTimeLocks();
    setInterval(checkTimeLocks, 60000); // Check locks every minute
}

function checkTimeLocks() {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const todayStr = getTodayKey();

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
            
            // Check Notifications!
            if (checkShouldNotify(period, todayStr)) {
                triggerMotivationNotification(period);
            }
            
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
    
    // Fixed Spanish Week: L M X J V S D
    const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const today = new Date();
    
    // Calculate Monday of the current week
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        
        const isDone = completedDays.includes(dateStr);
        const isToday = dateStr === todayStr;
        const isFuture = d.toISOString().slice(0, 10) > todayStr;
        
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
                <span class="streak-letter" style="${isToday ? 'color:#fff' : ''}">${daysOfWeek[i]}</span>
                <div class="${circleClass}" style="${isFuture ? 'opacity: 0.2' : ''}">${innerHtml}</div>
            </div>
        `;
    }
}

// ============================================
// ARCHIVO / JOURNAL LOGIC
// ============================================

function loadJournalArchive() {
    const container = document.getElementById('journal-archive');
    if (!container) return;
    
    // Extract all manifest_369_YYYY-MM-DD keys
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('manifest_369_')) {
            const dateStr = key.replace('manifest_369_', '');
            entries.push({ date: dateStr, data: JSON.parse(localStorage.getItem(key)) });
        }
    }
    
    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; margin-top:20px;">Aún no hay días conquistados.<br>El camino empieza hoy.</p>';
        return;
    }
    
    // Sort descending by date
    entries.sort((a, b) => b.date.localeCompare(a.date));
    const completedDays = JSON.parse(localStorage.getItem('manifest_completed_days') || '[]');
    
    container.innerHTML = '';
    let dayCounter = entries.length;
    
    entries.forEach((entry) => {
        const isDone = completedDays.includes(entry.date);
        
        // Formatting options for Spanish Date
        const fDateParts = new Date(entry.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        
        const card = document.createElement('div');
        card.className = 'journal-card';
        
        let html = `
            <div class="journal-card-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                <div>
                    <div style="font-size: 10px; color: #888; text-transform: uppercase;">Día Documentado</div>
                    <div class="journal-date">${fDateParts}</div>
                </div>
                <div class="journal-status ${isDone ? 'status-done' : 'status-missed'}">
                    ${isDone ? '🔥 369 COMPLETO' : 'INCOMPLETO'}
                </div>
            </div>
            <div class="journal-details">
        `;
        
        ['morning', 'afternoon', 'night'].forEach(period => {
            const label = period === 'morning' ? 'Mañana' : (period === 'afternoon' ? 'Tarde' : 'Noche');
            html += `<div class="journal-section"><h4>${label}</h4>`;
            let hasData = false;
            entry.data[period].forEach((ph, idx) => {
                if (ph.trim()) {
                    html += `<div class="journal-text">"${ph}"</div>`;
                    hasData = true;
                }
            });
            if(!hasData) html += `<div class="journal-text" style="color:#555">Sin registro.</div>`;
            html += `</div>`;
        });
        
        html += `</div>`;
        card.innerHTML = html;
        container.appendChild(card);
    });
}

// Ensure streak UI updates on load
const originalInit = initManifestationEngine;
initManifestationEngine = function() {
    originalInit();
    updateStreakUI();
};

// ============================================
// NOTIFICATION & TOAST ENGINE
// ============================================

const NOTI_MESSAGES = {
    morning: [
        "Despierta. El Civic Type R no se va a conducir solo. Plasma tus 3 metas. 🏎️",
        "Buenos días, referente nacional. Arranca el día con foco puro. 🎧",
        "Cada día que cumples estás más cerca de reventar la pista. Escribe las 3. 🔥",
        "Tu imperio empieza en la mañana. Sella tu destino 3 veces. 🌅",
        "Mete primera marcha hoy. 3 intenciones para programar tu éxito inminente."
    ],
    afternoon: [
        "Mitad del día. Mantén la frecuencia alta, futuro DJ Top Nacional. 🎵",
        "No bajes el ritmo. Tu Honda Civic te espera en la meta. Entra y refuerza tu mente (6).",
        "Tu imperio se construye en las horas en que los demás descansan. Adelante.",
        "6 veces. Recuérdale al subconsciente quién va a liderar la escena de este país.",
        "Que tu racha no muera. Afianza tu tarde con tus 6 manifestaciones de poder de fuego."
    ],
    night: [
        "Hora de cerrar el día. Escribe 9 veces tu destino y siente ese volante del Type R.",
        "Antes de dormir, sella tu racha 🔥. 9 intenciones para consagrarte en la cima.",
        "El universo escucha en el silencio. Completa el ciclo 3-6-9 y apaga la mesa de mezclas como un rey.",
        "Tus sueños ya son realidad. 9 manifestaciones directas para grabar el Type R en tu mente libre.",
        "Último empujón estoico. No dejes que la disciplina flaquee hoy."
    ]
};

function isPeriodCompleted(period, todayStr) {
    const saved = localStorage.getItem(`manifest_369_${todayStr}`);
    if (!saved) return false;
    const data = JSON.parse(saved);
    if (!data[period]) return false;
    // Returns true if array is completely filled with text
    return data[period].length === TIME_LOCKS[period].count && data[period].every(str => str.trim().length > 0);
}

function checkShouldNotify(period, todayStr) {
    if (isPeriodCompleted(period, todayStr)) return false; 
    
    const notifiedKey = `notified_${todayStr}_${period}`;
    if (localStorage.getItem(notifiedKey)) return false; 
    
    return true;
}

function triggerMotivationNotification(period) {
    const todayStr = getTodayKey();
    localStorage.setItem(`notified_${todayStr}_${period}`, 'true');
    
    const msgs = NOTI_MESSAGES[period];
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    const title = `Foco 369: ${period === 'morning' ? 'Mañana' : period === 'afternoon' ? 'Tarde' : 'Noche'}`;
    
    // UI Toast
    showToast(title, randomMsg);
    
    // Browser Native Push (If granted)
    if (window.Notification && Notification.permission === 'granted') {
        new Notification(title, {
            body: randomMsg,
            icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233508.png'
        });
    }
}

function showToast(title, message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">🔥</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div>${message}</div>
        </div>
    `;
    container.appendChild(toast);
    
    // Play subtle ding if possible? 
    // Wait for the next tick to add 'show' class to trigger CSS transition
    setTimeout(() => toast.classList.add('show'), 50);
    
    // Auto remove after 7 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); // 400ms is the CSS animation duration
    }, 7000);
}

document.getElementById('btn-enable-notifications')?.addEventListener('click', async () => {
    if (!('Notification' in window)) {
        alert("Tu dispositivo no soporta Notificaciones Web Push de fondo.");
        return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        alert("¡Sinergia Creada! 🔔 Mantén la app en tus pestañas recientes o actívala en tu pantalla de inicio. Te mandaré ráfagas de poder directamente a tus notificaciones.");
    } else {
        alert("Permiso denegado. Aún así vibrarás en la app.");
    }
});

// Call init at the end
initManifestationEngine();
