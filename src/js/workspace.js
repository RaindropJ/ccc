import { STATUTORY_MATRIX, PRACTICUM_CHECKLIST_ITEMS, WELFARE_FIELDS, getFieldById } from '../data/welfare-taxonomy.js';
import { defaultWelfareNews as DEFAULT_EDITORIAL_ARTICLES } from '../data/default-news.js';
import {
    getWorkspace,
    getWorkspaceBadgeCount,
    toggleFieldBookmark,
    toggleLawBookmark,
    addSavedAgency,
    removeSavedAgency,
    exportWorkspaceJson,
    importWorkspaceJson,
    resetWorkspace
} from './storage.js';
import { escapeHtml } from './utils.js';

let onNavigateCallback = null;
let currentDrawerTab = 'news'; // 'news', 'agencies', 'laws', 'checklist'
let activeMemoItem = null; // { type: 'article'|'agency', id: string, title: string, source: string, date: string }

export function setWorkspaceNavigator(callback) {
    onNavigateCallback = callback;
}

export function updateWorkspaceBadge() {
    const count = getWorkspaceBadgeCount();
    const ids = ['workspace-badge-count', 'workspace-badge-count-m', 'header-badge-count', 'mobile-header-badge-count'];
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerText = String(count);
    });
}

export function setDrawerTab(tab) {
    currentDrawerTab = tab || 'news';
    renderWorkspaceDrawer();
}

export function openWorkspaceDrawer(initialTab = null) {
    if (initialTab) currentDrawerTab = initialTab;
    const drawer = document.getElementById('workspace-drawer');
    const panel = document.getElementById('workspace-drawer-panel');
    if (!drawer || !panel) return;
    renderWorkspaceDrawer();
    drawer.classList.remove('hidden');
    requestAnimationFrame(() => {
        drawer.classList.remove('opacity-0');
        panel.classList.remove('translate-x-full');
    });
}

export function closeWorkspaceDrawer() {
    const drawer = document.getElementById('workspace-drawer');
    const panel = document.getElementById('workspace-drawer-panel');
    if (!drawer || !panel) return;
    drawer.classList.add('opacity-0');
    panel.classList.add('translate-x-full');
    setTimeout(() => drawer.classList.add('hidden'), 250);
}

export function renderWorkspaceDrawer() {
    const body = document.getElementById('workspace-drawer-body');
    if (!body) return;

    const ws = getWorkspace();
    const doneChecklist = PRACTICUM_CHECKLIST_ITEMS.filter((c) => Boolean(ws.checklist[c.id])).length;
    const totalChecklist = PRACTICUM_CHECKLIST_ITEMS.length;
    const pct = Math.round((doneChecklist / totalChecklist) * 100);

    const newsCount = (ws.bookmarkedArticles || []).length;
    const agenciesCount = (ws.savedAgencies || []).length;
    const lawsCount = (ws.bookmarkedFields || []).length + (ws.bookmarkedLaws || []).length;

    // Tabs Nav Header
    const tabsNavHtml = `
        <nav aria-label="준비함 분류" class="flex items-center px-5 border-b border-slate-200/90 bg-slate-50/60 overflow-x-auto gap-1 text-xs font-bold py-2 shrink-0">
            <button type="button" onclick="window.setDrawerTab('news')" class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${currentDrawerTab === 'news' ? 'bg-white text-blue-600 shadow-2xs font-extrabold border border-slate-200' : 'text-slate-600 hover:text-slate-900'}">
                <span>📰 시사 스크랩</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentDrawerTab === 'news' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}">${newsCount}</span>
            </button>
            <button type="button" onclick="window.setDrawerTab('agencies')" class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${currentDrawerTab === 'agencies' ? 'bg-white text-blue-600 shadow-2xs font-extrabold border border-slate-200' : 'text-slate-600 hover:text-slate-900'}">
                <span>🎒 실습·수련 공고</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentDrawerTab === 'agencies' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}">${agenciesCount}</span>
            </button>
            <button type="button" onclick="window.setDrawerTab('laws')" class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${currentDrawerTab === 'laws' ? 'bg-white text-blue-600 shadow-2xs font-extrabold border border-slate-200' : 'text-slate-600 hover:text-slate-900'}">
                <span>📜 찜한 법령</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentDrawerTab === 'laws' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}">${lawsCount}</span>
            </button>
            <button type="button" onclick="window.setDrawerTab('checklist')" class="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${currentDrawerTab === 'checklist' ? 'bg-white text-blue-600 shadow-2xs font-extrabold border border-slate-200' : 'text-slate-600 hover:text-slate-900'}">
                <span>📋 법정 체크리스트</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentDrawerTab === 'checklist' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}">${pct}%</span>
            </button>
        </nav>
    `;

    let tabBodyHtml = '';

    if (currentDrawerTab === 'news') {
        const bookmarkedList = (ws.bookmarkedArticles || []).map((id) => {
            return DEFAULT_EDITORIAL_ARTICLES.find((a) => a.id === id);
        }).filter(Boolean);

        if (bookmarkedList.length === 0) {
            tabBodyHtml = `
                <div class="py-12 text-center text-slate-400">
                    <span class="text-3xl">📰</span>
                    <p class="text-xs font-bold mt-2">스크랩된 시사 아티클이 없습니다.</p>
                    <p class="text-[11px] mt-1 text-slate-400">[복지 뉴스·브리핑]에서 관심 기사를 스크랩해보세요.</p>
                </div>
            `;
        } else {
            tabBodyHtml = `
                <div class="space-y-3">
                    ${bookmarkedList.map((art) => `
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                            <div class="flex items-center justify-between text-[11px]">
                                <span class="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">${escapeHtml(art.category || '정책')}</span>
                                <span class="text-slate-400">${escapeHtml(art.date || '')}</span>
                            </div>
                            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">${escapeHtml(art.title)}</h4>
                            <p class="text-[11px] text-slate-500 line-clamp-2">${escapeHtml(art.summary || '')}</p>
                            <div class="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                                <button type="button" onclick="window.openMemoEditor('article', '${art.id}', '${escapeHtml(art.title)}')" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 flex items-center gap-1">
                                    <span>✍️ 메모 작성/수정</span>
                                </button>
                                <button type="button" onclick="window.removeArticleBookmark('${art.id}')" class="text-[11px] text-rose-500 hover:underline">
                                    스크랩 취소
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else if (currentDrawerTab === 'agencies') {
        const saved = ws.savedAgencies || [];
        if (saved.length === 0) {
            tabBodyHtml = `
                <div class="py-12 text-center text-slate-400">
                    <span class="text-3xl">🎒</span>
                    <p class="text-xs font-bold mt-2">보관된 실습·수련 기관이 없습니다.</p>
                    <p class="text-[11px] mt-1 text-slate-400">[실습처 탐색] 또는 [수련처 탐색]에서 별표(⭐)를 눌러보세요.</p>
                </div>
            `;
        } else {
            tabBodyHtml = `
                <div class="space-y-3">
                    ${saved.map((ag) => `
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(ag.name)}</span>
                                <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">${escapeHtml(ag.type || '실습기관')}</span>
                            </div>
                            <p class="text-[11px] text-slate-500">${escapeHtml(ag.address || '')}</p>
                            ${ag.memo ? `<div class="p-2 bg-amber-50/70 text-amber-900 text-[10px] rounded-lg border border-amber-200">${escapeHtml(ag.memo)}</div>` : ''}
                            <div class="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                                <button type="button" onclick="window.openMemoEditor('agency', '${ag.id}', '${escapeHtml(ag.name)}')" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 flex items-center gap-1">
                                    <span>✍️ 메모 수정</span>
                                </button>
                                <button type="button" onclick="window.removeSavedAgencyItem('${escapeHtml(ag.id)}')" class="text-[11px] text-rose-500 hover:underline">
                                    삭제
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else if (currentDrawerTab === 'laws') {
        const fieldsHtml = (ws.bookmarkedFields || []).map((fid) => {
            const f = getFieldById(fid);
            if (!f) return '';
            return `
                <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span class="font-bold text-slate-800">${f.icon} ${escapeHtml(f.name)}</span>
                    <button type="button" onclick="window.toggleFieldBookmarkAndRender('${escapeHtml(f.id)}')" class="text-rose-500 hover:underline text-[11px]">취소</button>
                </div>
            `;
        }).join('');

        const lawsHtml = (ws.bookmarkedLaws || []).map((law) => `
            <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span class="font-bold text-slate-800">📜 ${escapeHtml(law)}</span>
                <button type="button" onclick="window.toggleLawBookmarkAndRender('${escapeHtml(law)}')" class="text-rose-500 hover:underline text-[11px]">취소</button>
            </div>
        `).join('');

        tabBodyHtml = (fieldsHtml || lawsHtml) ? `
            <div class="space-y-4">
                ${fieldsHtml ? `<div><h5 class="text-xs font-bold text-slate-500 mb-1.5">찜한 복지 분야 (${ws.bookmarkedFields.length})</h5><div class="space-y-1.5">${fieldsHtml}</div></div>` : ''}
                ${lawsHtml ? `<div><h5 class="text-xs font-bold text-slate-500 mb-1.5">찜한 근거 법령 (${ws.bookmarkedLaws.length})</h5><div class="space-y-1.5">${lawsHtml}</div></div>` : ''}
            </div>
        ` : `
            <div class="py-12 text-center text-slate-400">
                <span class="text-3xl">📜</span>
                <p class="text-xs font-bold mt-2">찜한 법령이 없습니다.</p>
                <p class="text-[11px] mt-1 text-slate-400">[12대 분야와 법령] 도감에서 별표(⭐)를 눌러보세요.</p>
            </div>
        `;
    } else if (currentDrawerTab === 'checklist') {
        tabBodyHtml = `
            <div class="space-y-3">
                <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                    <div>
                        <div class="text-xs font-bold text-blue-900">법정 160시간 이수 진척률</div>
                        <div class="text-[11px] text-blue-700">${doneChecklist} / ${totalChecklist} 문항 완료</div>
                    </div>
                    <span class="text-base font-black text-blue-700">${pct}%</span>
                </div>
                <div class="space-y-2">
                    ${PRACTICUM_CHECKLIST_ITEMS.map((item) => {
                        const checked = Boolean(ws.checklist[item.id]);
                        return `
                            <label class="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition">
                                <input type="checkbox" ${checked ? 'checked' : ''} onchange="window.toggleChecklistItemAndRender('${item.id}')" class="mt-0.5 rounded text-blue-600 focus:ring-blue-500">
                                <div>
                                    <span class="font-bold text-slate-800 ${checked ? 'line-through text-slate-400' : ''}">${escapeHtml(item.title)}</span>
                                    <p class="text-[11px] text-slate-500 mt-0.5">${escapeHtml(item.desc || '')}</p>
                                </div>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    body.innerHTML = `
        ${tabsNavHtml}
        <div class="p-5 overflow-y-auto flex-grow">
            ${tabBodyHtml}
        </div>
        <div class="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10 space-y-2">
            <button type="button" onclick="window.openPdfBinderModal()" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                <span>📄 스크랩 노트 전체 인쇄 / PDF 저장</span>
            </button>
            <button type="button" onclick="window.clearWorkspaceAll()" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer">
                전체 비우기
            </button>
        </div>
    `;
}

// Memo Modal Handling
export function openMemoEditor(type, id, title) {
    activeMemoItem = { type, id, title };
    const modal = document.getElementById('memo-edit-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('p.text-xs.font-bold');
    if (titleEl) titleEl.innerText = title;

    const textarea = document.getElementById('prep-memo-content');
    const ws = getWorkspace();
    const existingMemo = (ws.memos || {})[id] || '';
    if (textarea) textarea.value = existingMemo;

    modal.classList.remove('hidden');
}

export function closeMemoEditor() {
    const modal = document.getElementById('memo-edit-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    activeMemoItem = null;
}

export function saveActiveMemo() {
    if (!activeMemoItem) return;
    const textarea = document.getElementById('prep-memo-content');
    const memoContent = textarea ? textarea.value.trim() : '';

    const ws = getWorkspace();
    ws.memos = ws.memos || {};
    if (memoContent) {
        ws.memos[activeMemoItem.id] = memoContent;
    } else {
        delete ws.memos[activeMemoItem.id];
    }
    localStorage.setItem('career_hub_workspace', JSON.stringify(ws));
    closeMemoEditor();
    renderWorkspaceDrawer();
    alert('✍️ 메모가 성공적으로 저장되었습니다!');
}

export function deleteActiveMemo() {
    if (!activeMemoItem) return;
    const ws = getWorkspace();
    if (ws.memos && ws.memos[activeMemoItem.id]) {
        delete ws.memos[activeMemoItem.id];
        localStorage.setItem('career_hub_workspace', JSON.stringify(ws));
    }
    closeMemoEditor();
    renderWorkspaceDrawer();
}

// Global Window Bindings
window.toggleDrawer = (open) => {
    if (open) openWorkspaceDrawer();
    else closeWorkspaceDrawer();
};
window.setDrawerTab = setDrawerTab;
window.openMemoEditor = openMemoEditor;
window.closeMemoEditor = closeMemoEditor;
window.saveActiveMemo = saveActiveMemo;
window.deleteActiveMemo = deleteActiveMemo;
window.removeSavedAgencyItem = (id) => {
    removeSavedAgency(id);
    renderWorkspaceDrawer();
    updateWorkspaceBadge();
};
window.removeArticleBookmark = (id) => {
    const ws = getWorkspace();
    ws.bookmarkedArticles = (ws.bookmarkedArticles || []).filter((a) => a !== id);
    localStorage.setItem('career_hub_workspace', JSON.stringify(ws));
    renderWorkspaceDrawer();
    updateWorkspaceBadge();
};
window.clearWorkspaceAll = () => {
    if (confirm('준비함의 모든 스크랩과 저장 내역을 비우시겠습니까?')) {
        resetWorkspace();
        renderWorkspaceDrawer();
        updateWorkspaceBadge();
    }
};
