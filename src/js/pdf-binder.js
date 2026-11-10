/**
 * pdf-binder.js
 * 시사 스크랩 & 면접 대비 PDF 인쇄 바인더 모듈 (Stitch pdf 디자인 100% 반영)
 */

import { getWorkspace } from './storage.js';
import { defaultWelfareNews as DEFAULT_EDITORIAL_ARTICLES } from '../data/default-news.js';
import { escapeHtml } from './utils.js';

let currentPaperSize = 'A4';
let showMemo = true;
let fontScaleIndex = 1; // 0: 작게, 1: 보통, 2: 크게
const fontScales = [
    { label: '본문 작게', textClass: 'text-[11px] leading-relaxed' },
    { label: '본문 보통', textClass: 'text-xs leading-relaxed' },
    { label: '본문 크게', textClass: 'text-sm leading-relaxed' }
];

export function openPdfBinderModal() {
    const modal = document.getElementById('pdf-binder-modal');
    if (!modal) return;
    renderPdfBinderSheet();
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

export function closePdfBinderModal() {
    const modal = document.getElementById('pdf-binder-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

export function toggleMemoInBinder() {
    showMemo = !showMemo;
    renderPdfBinderSheet();
}

export function cycleFontScale() {
    fontScaleIndex = (fontScaleIndex + 1) % fontScales.length;
    renderPdfBinderSheet();
}

export function setPaperSize(size) {
    currentPaperSize = size || 'A4';
    renderPdfBinderSheet();
}

export function triggerPrint() {
    window.print();
}

export function renderPdfBinderSheet() {
    const sheetContainer = document.getElementById('pdf-print-sheet-content');
    if (!sheetContainer) return;

    const fontScaleBtnText = document.getElementById('fontScaleText');
    if (fontScaleBtnText) {
        fontScaleBtnText.textContent = fontScales[fontScaleIndex].label;
    }

    const ws = getWorkspace();
    const bookmarkedArticles = (ws.bookmarkedArticles || []).map((id) => {
        return DEFAULT_EDITORIAL_ARTICLES.find((a) => a.id === id);
    }).filter(Boolean);

    // Fallback if none bookmarked yet, show first 2 default news for preview
    const displayArticles = bookmarkedArticles.length > 0 ? bookmarkedArticles : DEFAULT_EDITORIAL_ARTICLES.slice(0, 2);

    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    const contentHtml = displayArticles.map((art, idx) => `
        <article class="p-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-4 mb-6 break-inside-avoid">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                        ${idx + 1}
                    </span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        ${escapeHtml(art.category || '정책·법령')}
                    </span>
                    <span class="text-xs text-slate-500 font-medium">${escapeHtml(art.source || '공식 정책 브리핑')}</span>
                </div>
                <span class="text-xs text-slate-400 font-medium">${escapeHtml(art.date || todayStr)}</span>
            </div>
            
            <h3 class="text-base font-extrabold text-slate-900 leading-snug">
                ${escapeHtml(art.title)}
            </h3>

            <p class="${fontScales[fontScaleIndex].textClass} text-slate-700 font-serif">
                ${escapeHtml(art.summary || (art.body && art.body[0]) || '')}
            </p>

            ${(art.takeaways && art.takeaways.length > 0) ? `
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <div class="font-bold text-slate-900 flex items-center gap-1">
                        <span>💡</span>
                        <span>실무 및 면접 핵심 체크포인트</span>
                    </div>
                    <ul class="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                        ${art.takeaways.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${showMemo ? `
                <div class="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-amber-900 flex items-center gap-1">
                            <span>✍️</span>
                            <span>나의 준비 메모 & 면접 키워드</span>
                        </span>
                        <span class="text-[10px] text-amber-700 font-medium">실습·면접 전 체크</span>
                    </div>
                    <p class="text-xs text-slate-800 leading-relaxed font-medium">
                        ${escapeHtml(art.studyTip || '통합돌봄 제도화와 전달체계 변화를 1분 자기소개 또는 직무질문 답변에 적극 활용.')}
                    </p>
                </div>
            ` : ''}
        </article>
    `).join('');

    sheetContainer.innerHTML = `
        <div class="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300/80 shadow-md max-w-4xl mx-auto text-slate-900">
            <!-- Sheet Header -->
            <div class="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <div class="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        <span>🧭 사회복지 현장 나침반</span>
                        <span>•</span>
                        <span>시사 & 면접 바인더</span>
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                        2026 사회복지 현장실습·면접 대비 나만의 시사 브리핑 바인더
                    </h2>
                </div>
                <div class="text-right text-xs text-slate-500 font-medium shrink-0">
                    <div>출력일자: ${todayStr}</div>
                    <div>보관 문서: 총 ${displayArticles.length}건</div>
                </div>
            </div>

            <!-- Sheet Content -->
            <div class="space-y-4">
                ${contentHtml}
            </div>

            <!-- Sheet Footer -->
            <div class="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                본 문서는 한국사회복지사협회 및 보건복지부 공인 자료를 기반으로 '사회복지 현장 나침반'에서 실습·취업 학습용으로 출력되었습니다.
            </div>
        </div>
    `;
}

// Window bindings
window.openPdfBinderModal = openPdfBinderModal;
window.closePdfBinderModal = closePdfBinderModal;
window.toggleMemoInBinder = toggleMemoInBinder;
window.cycleFontScale = cycleFontScale;
window.setPaperSize = setPaperSize;
window.triggerPrint = triggerPrint;
