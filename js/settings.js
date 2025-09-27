

const themes = { green: '#22c55e', blue: '#3b82f6', orange: '#f97316', purple: '#8b5cf6', yellow: '#eab308' };
const fontSizes = { sm: 'Pequeno', md: 'Médio', lg: 'Grande' };

function applySettings(theme, fontSize) {
    const body = document.body;
    if (theme) {
        Object.keys(themes).forEach(t => body.classList.remove(`theme-${t}`));
        if (theme !== 'green') body.classList.add(`theme-${theme}`);
        localStorage.setItem('agroConnectTheme', theme);
    }
    if (fontSize) {
        body.classList.remove('font-sm', 'font-lg');
        if (fontSize !== 'md') body.classList.add(`font-${fontSize}`);
        localStorage.setItem('agroConnectFontSize', fontSize);
    }
    updateActiveButtons();
}

function updateActiveButtons() {
    const currentTheme = localStorage.getItem('agroConnectTheme') || 'green';
    const currentSize = localStorage.getItem('agroConnectFontSize') || 'md';
    document.querySelectorAll('.theme-button').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === currentTheme));
    document.querySelectorAll('.font-size-button').forEach(btn => btn.classList.toggle('active', btn.dataset.size === currentSize));
}

export function initializeSettings() {
    const themeContainer = document.getElementById('theme-selector');
    const fontContainer = document.getElementById('font-size-selector');
    
    if (themeContainer) {
        themeContainer.innerHTML = Object.entries(themes).map(([key, color]) => 
            `<button class="theme-button" data-theme="${key}" style="background-color: ${color};" aria-label="Tema ${key}"></button>`
        ).join('');
    }

    if (fontContainer) {
        fontContainer.innerHTML = Object.entries(fontSizes).map(([key, text]) => 
            `<button class="font-size-button" data-size="${key}">${text}</button>`
        ).join('');
    }

    document.querySelectorAll('.theme-button').forEach(btn => btn.addEventListener('click', () => applySettings(btn.dataset.theme, null)));
    document.querySelectorAll('.font-size-button').forEach(btn => btn.addEventListener('click', () => applySettings(null, btn.dataset.size)));
    
    const savedTheme = localStorage.getItem('agroConnectTheme') || 'green';
    const savedFontSize = localStorage.getItem('agroConnectFontSize') || 'md';
    applySettings(savedTheme, savedFontSize);
}