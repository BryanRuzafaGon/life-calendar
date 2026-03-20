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
    document.getElementById('rank-badge').textContent = getRank(currentStreak);
    renderStreakCalendar(completedDays, todayStr);
}

function getRank(streak) {
    if (streak <= 30) return "DJ Promesa Local";
    if (streak <= 90) return "Residente de Club";
    if (streak <= 365) return "DJ de la Ciudad";
    if (streak <= 730) return "Productor Emergente";
    if (streak <= 1095) return "DJ Referente Nacional";
    if (streak <= 1500) return "Dueño del Civic Type R 🏎️";
    return "Leyenda Internacional 👑";
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

// ============================================
// VISION BOARD & TIME CAPSULE LOGIC
// ============================================

function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; // Safe for localStorage
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

[1, 2].forEach(num => {
    document.getElementById(`vision-upload-${num}`)?.addEventListener('change', (e) => {
        if (!e.target.files[0]) return;
        compressImage(e.target.files[0], (base64) => {
            localStorage.setItem(`vision_img_${num}`, base64);
            loadVisionImages();     
        });
    });
});

function loadVisionImages() {
    [1, 2].forEach(num => {
        const base64 = localStorage.getItem(`vision_img_${num}`);
        if (base64) {
            document.getElementById(`placeholder-${num}`).style.display = 'none';
            const imgEl = document.getElementById(`vision-img-${num}`);
            imgEl.src = base64;
            imgEl.style.display = 'block';
        }
    });
}

function loadTimeCapsule() {
    const sealedData = localStorage.getItem('time_capsule');
    if (sealedData) {
        const data = JSON.parse(sealedData);
        const unlockDate = new Date(data.unlockDate);
        unlockDate.setHours(0,0,0,0);
        const now = new Date();
        
        document.getElementById('capsule-composer').style.display = 'none';
        
        if (now >= unlockDate) {
            // Unlocked!
            document.getElementById('capsule-sealed').style.display = 'none';
            document.getElementById('capsule-opened').style.display = 'flex';
            document.getElementById('capsule-content-clear').textContent = data.text;
        } else {
            // Sealed
            document.getElementById('capsule-sealed').style.display = 'flex';
            document.getElementById('capsule-opened').style.display = 'none';
            document.getElementById('sealed-timer').textContent = `Bloqueado intacto hasta el ${unlockDate.toLocaleDateString('es-ES')}`;
        }
    } else {
        document.getElementById('capsule-composer').style.display = 'block';
        document.getElementById('capsule-sealed').style.display = 'none';
        document.getElementById('capsule-opened').style.display = 'none';
    }
}

document.getElementById('btn-seal-capsule')?.addEventListener('click', () => {
    const text = document.getElementById('capsule-text').value;
    const dateStr = document.getElementById('capsule-date').value;
    
    if(!text || !dateStr) {
        alert("Escribe la carta a tu yo del futuro y selecciona una fecha.");
        return;
    }
    
    const unlockDate = new Date(dateStr);
    if(unlockDate <= new Date()) {
        alert("La fecha de bloqueo debe estar en el futuro.");
        return;
    }
    
    if(confirm("¿Estás 100% seguro de sellar esta carta ahora? La criptografía local de tu dispositivo la bloqueará de forma permanente hasta la fecha fijada. No podrás leerla ni editarla hasta entonces.")) {
        localStorage.setItem('time_capsule', JSON.stringify({
            text: text,
            unlockDate: dateStr
        }));
        loadTimeCapsule();
        alert("Cápsula del Tiempo sellada. Enfócate en el hoy, el futuro te espera.");
    }
});

// ============================================
// PHASE 6: DEEP PSYCHOLOGY MODULES
// ============================================

// 1. Dynamic Vision Background
function applyVisionBackground() {
    const img1 = localStorage.getItem('vision_img_1');
    const img2 = localStorage.getItem('vision_img_2');
    const pool = [];
    if (img1) pool.push(img1);
    if (img2) pool.push(img2);
    
    if (pool.length > 0) {
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        document.body.style.backgroundImage = `linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url('${chosen}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

// 2. Evidence Vault
function loadVault() {
    const vaultList = JSON.parse(localStorage.getItem('vault_list') || '[]');
    const container = document.getElementById('vault-list');
    if(!container) return;
    
    container.innerHTML = '';
    vaultList.reverse().forEach(v => {
        const div = document.createElement('div');
        div.className = 'vault-card';
        div.innerHTML = `
            <div class="vault-date">${v.date}</div>
            <div class="vault-text">${v.text}</div>
        `;
        container.appendChild(div);
    });
}

document.getElementById('btn-save-vault')?.addEventListener('click', () => {
    const input = document.getElementById('vault-input');
    const text = input.value.trim();
    if (!text) return;
    
    const vaultList = JSON.parse(localStorage.getItem('vault_list') || '[]');
    vaultList.push({
        date: new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
        text: text
    });
    localStorage.setItem('vault_list', JSON.stringify(vaultList));
    input.value = '';
    loadVault();
});

// 3. El Precio a Pagar (Random Tracker)
const DEFAULT_PRICES = ["Practicar CDJs / Mezcla 1 hora", "Subir 1 Clip a Redes", "Networking musical online", "Ahorrar algo para el Type R"];

function loadPricePool() {
    let pool = JSON.parse(localStorage.getItem('price_pool') || 'null');
    if (!pool) {
        pool = DEFAULT_PRICES;
        localStorage.setItem('price_pool', JSON.stringify(pool));
    }
    return pool;
}

function renderPricePoolManager() {
    const pool = loadPricePool();
    const list = document.getElementById('price-pool-list');
    if(!list) return;
    list.innerHTML = '';
    pool.forEach((val, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${val}</span> <button class="btn-remove-price" data-idx="${idx}">×</button>`;
        list.appendChild(li);
    });
    
    document.querySelectorAll('.btn-remove-price').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-idx');
            pool.splice(idx, 1);
            localStorage.setItem('price_pool', JSON.stringify(pool));
            renderPricePoolManager();
        });
    });
}

document.getElementById('btn-edit-prices')?.addEventListener('click', () => {
    document.getElementById('price-pool-modal').classList.remove('hidden');
    renderPricePoolManager();
});
document.getElementById('btn-close-price-modal')?.addEventListener('click', () => {
    document.getElementById('price-pool-modal').classList.add('hidden');
});
document.getElementById('btn-add-price')?.addEventListener('click', () => {
    const input = document.getElementById('new-price-input');
    if (input.value.trim()) {
        const pool = loadPricePool();
        pool.push(input.value.trim());
        localStorage.setItem('price_pool', JSON.stringify(pool));
        input.value = '';
        renderPricePoolManager();
    }
});

function initDailyPriceSequence(todayStr) {
    let dailyPrice = JSON.parse(localStorage.getItem(`daily_price_${todayStr}`) || 'null');
    const container = document.getElementById('daily-price-container');
    const list = document.getElementById('daily-price-list');
    if(!list) return;
    
    if (!dailyPrice) {
        const isActionDay = Math.random() < 0.5; // 50% chance
        let selected = [];
        if (isActionDay) {
            const pool = loadPricePool();
            if(pool.length > 0) {
                const amnt = Math.floor(Math.random() * Math.min(3, pool.length)) + 1; 
                const shuffled = [...pool].sort(() => 0.5 - Math.random());
                selected = shuffled.slice(0, amnt).map(text => ({ text: text, done: false }));
            }
        }
        dailyPrice = { items: selected };
        localStorage.setItem(`daily_price_${todayStr}`, JSON.stringify(dailyPrice));
    }
    
    if (dailyPrice.items.length > 0) {
        container.style.display = 'block';
        list.innerHTML = '';
        dailyPrice.items.forEach((item, idx) => {
            const wrap = document.createElement('div');
            wrap.className = 'price-checkbox-wrap';
            wrap.innerHTML = `
                <input type="checkbox" id="price-chk-${idx}" ${item.done ? 'checked' : ''}>
                <label for="price-chk-${idx}">${item.text}</label>
            `;
            list.appendChild(wrap);
            
            wrap.querySelector('input').addEventListener('change', (e) => {
                dailyPrice.items[idx].done = e.target.checked;
                localStorage.setItem(`daily_price_${todayStr}`, JSON.stringify(dailyPrice));
                updateStreakUI();
            });
        });
    } else {
        container.style.display = 'none';
    }
}

// 4. Modal de Reflexión Mensual (Checkpoint)
function checkTimeReflection(todayStr) {
    let firstDate = localStorage.getItem('first_manifest_date');
    if (!firstDate) {
        firstDate = todayStr;
        localStorage.setItem('first_manifest_date', firstDate);
        return;
    }
    
    const d1 = new Date(firstDate);
    const d2 = new Date();
    d1.setHours(0,0,0,0);
    d2.setHours(0,0,0,0);
    
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0 && diffDays % 30 === 0) {
        if (localStorage.getItem('checkpoint_shown_date') !== todayStr) {
            document.getElementById('checkpoint-day').textContent = diffDays;
            document.getElementById('checkpoint-original-goal').textContent = `"${localStorage.getItem('manifest_goal') || 'Evolucionar.'}"`;
            document.getElementById('checkpoint-modal').classList.remove('hidden');
        }
    }
}

document.getElementById('btn-close-checkpoint')?.addEventListener('click', () => {
    localStorage.setItem('checkpoint_shown_date', getTodayKey());
    document.getElementById('checkpoint-modal').classList.add('hidden');
});

// Night Action Input save behavior
document.getElementById('night-real-action')?.addEventListener('input', (e) => {
    const todayStr = getTodayKey();
    const actions = JSON.parse(localStorage.getItem(`night_action_history`) || '{}');
    actions[todayStr] = e.target.value;
    localStorage.setItem(`night_action_history`, JSON.stringify(actions));
});
// Load nightly action if previously filled
setInterval(() => {
    const na = document.getElementById('night-real-action');
    if(na && !na.value && document.activeElement !== na) {
        const acts = JSON.parse(localStorage.getItem(`night_action_history`) || '{}');
        if(acts[getTodayKey()]) na.value = acts[getTodayKey()];
    }
}, 3000);


// Ensure UI updates on load
const originalInit = initManifestationEngine;
initManifestationEngine = function() {
    originalInit();
    updateStreakUI();
    loadVisionImages();
    loadTimeCapsule();
    
    // Phase 6 inits
    applyVisionBackground();
    loadVault();
    initDailyPriceSequence(getTodayKey());
    checkTimeReflection(getTodayKey());
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
        "Mete primera marcha hoy. 3 intenciones para programar tu éxito inminente.",
        "Abre los ojos, alza el mentón. Eres el próximo DJ TOP de España. Empieza con 3.",
        "Ese Type R huele a nuevo, pero exige disciplina hoy. Escribe tus 3 manifestaciones.",
        "El universo recompensa a los que madrugan por sus sueños. 3 veces, dale.",
        "La paciencia forja referentes. La pereza forja mediocres. Sigue tu racha de 🔥.",
        "Escucha el rugir del motor de tu futuro Type R en tu cabeza. Siéntate y escribe 3.",
        "No hay excusas para quien está destinado a pinchar frente a miles. 3 intenciones ahora.",
        "Que la primera acción del día sea construir tu imperio musical. 3 veces.",
        "Imagina aparcar ese Honda Civic Type R en el VIP de tu festival. Haz tus 3 frases.",
        "La disciplina matutina hace al maestro de la mesa de mezclas. Aumenta tu racha hoy.",
        "¿Quieres ser referente nacional? Compórtate como uno desde la primera hora. 3 metas."
    ],
    afternoon: [
        "Mitad del día. Mantén la frecuencia alta, futuro DJ Top Nacional. 🎵",
        "No bajes el ritmo. Tu Honda Civic te espera en la meta. Entra y refuerza tu mente (6).",
        "Tu imperio se construye en las horas en que los demás descansan. Adelante.",
        "6 veces. Recuérdale al subconsciente quién va a liderar la escena de este país.",
        "Que tu racha no muera. Afianza tu tarde con tus 6 manifestaciones de poder de fuego.",
        "El sol sigue arriba y tu sueño también. Escribe 6 frases para programar el universo.",
        "Visualiza tus manos tocando los CDJs frente a todo el país. Repite 6 veces tu realidad.",
        "El Type R tiene que acelerar ahora. No dejes caer el día. 6 repeticiones de éxito.",
        "Mientras otros pierden el tiempo, tú construyes tu leyenda como DJ. 6 veces.",
        "La consistencia de la tarde define al referente nacional. Que nada te detenga ahora.",
        "Seis intentos para hackear la realidad. Manifiesta tu Civic Type R brillando en tufa.",
        "Siente la música correr por tus venas. Plasma tu destino 6 veces sin dudar.",
        "Mantén el fuego prendido. Tu racha exige que rellenes estas 6 cajas de intenciones.",
        "Que esta tarde te acerque un paso más al escenario principal. Escribe las 6.",
        "Seis confirmaciones de que nada ni nadie te apartará del Type R y la música."
    ],
    night: [
        "Hora de cerrar el día. Escribe 9 veces tu destino y siente ese volante del Type R.",
        "Antes de dormir, sella tu racha 🔥. 9 intenciones para consagrarte en la cima.",
        "El universo escucha en el silencio. Completa el ciclo 3-6-9 y apaga la mesa de mezclas como un rey.",
        "Tus sueños ya son realidad. 9 manifestaciones directas para grabar el Type R en tu mente libre.",
        "Último empujón estoico. No dejes que la disciplina flaquee hoy.",
        "Cierra el candado y asegúrate tu racha. 9 veces para dormir con mentalidad de n1.",
        "Miles de personas corearán tu nombre, pero todo empieza esta noche. Escribe las 9.",
        "Imagina el sonido del motor VTEC antes de dormir. Escribe tus últimas 9 intenciones.",
        "9 afirmaciones que trabajarán en tu subconsciente mientras duermes. Protégete.",
        "No te defraudes. Termina el maldito día como un ganador. 9 veces tu grandeza.",
        "Siente el tacto frío del cambio de marchas del Type R. Plasma tu victoria (x9).",
        "Solo los referentes nacionales aguantan hasta el final del día con el método 369.",
        "Tu racha te necesita para sobrevivir mañana. Arrasa hoy con 9 afirmaciones perfectas.",
        "Convierte el sueño en materia. Tus cajas están vacías. Llénalas 9 veces y descansa.",
        "El maestro ha terminado su set. Cierra la noche con broche de oro. Las 9 últimas."
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
