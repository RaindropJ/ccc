/**
 * HTML 특수문자 이스케이프 (카드 렌더링 및 XSS 방지)
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * URL 프로토콜 보정 (http/https 누락 시 https:// 자동 부여, 안전하지 않은 스킴 차단)
 * @param {string} rawUrl
 * @returns {string}
 */
export function normalizeHttpUrl(rawUrl) {
    const trimmed = String(rawUrl || '').trim();
    if (!trimmed) return '';
    if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
