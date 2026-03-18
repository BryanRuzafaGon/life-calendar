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
    const container = document.getElementById('wallpaper-container');
    const oldRadius = container.style.borderRadius;
    const oldOutline = container.style.outline;
    
    container.style.borderRadius = '0px';
    container.style.outline = 'none';

    html2canvas(container, {
        scale: 3, 
        backgroundColor: getActiveSegmentValue('bg-control') === 'white' ? '#ffffff' : '#050505',
        logging: false,
        useCORS: true
    }).then(canvas => {
        container.style.borderRadius = oldRadius;
        container.style.outline = oldOutline;

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
