/**
 * 다크모드 / 라이트모드 UI 상태 동기화
 * @param {boolean} isDark
 */
export function updateDarkModeUI(isDark = document.documentElement.classList.contains('dark')) {
    const icon = document.getElementById('dark-mode-icon');
    const text = document.getElementById('dark-mode-text');
    const iconM = document.getElementById('dark-mode-icon-m');
    const menuIcon = document.getElementById('dark-mode-menu-icon');
    const menuText = document.getElementById('dark-mode-menu-text');

    if (isDark) {
        if (icon) icon.innerText = '☀️';
        if (text) text.innerText = '낮 모드';
        if (iconM) iconM.innerText = '☀️';
        if (menuIcon) menuIcon.innerText = '☀️';
        if (menuText) menuText.innerText = '라이트 모드로 전환';
    } else {
        if (icon) icon.innerText = '🌙';
        if (text) text.innerText = '다크 모드';
        if (iconM) iconM.innerText = '🌙';
        if (menuIcon) menuIcon.innerText = '🌙';
        if (menuText) menuText.innerText = '다크 모드로 보기';
    }
}

/**
 * 다크모드 토글 및 localStorage 저장
 */
export function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeUI(isDark);
}

/**
 * 초기 테마 버튼 상태 동기화
 */
export function initTheme() {
    updateDarkModeUI();
}
