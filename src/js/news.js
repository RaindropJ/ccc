import { defaultWelfareNews, NEWS_HASHTAGS } from '../data/default-news.js';
import { WELFARE_FIELDS, getFieldById } from '../data/welfare-taxonomy.js';
import { getCustomNews, upsertCustomNews, deleteCustomNews } from './storage.js';
import { escapeHtml, normalizeHttpUrl } from './utils.js';

let publicNews = [];
let currentNewsFilter = '전체';
let currentNewsFieldFilter = '전체'; // 12대 분야 연계 필터
let currentNewsHashtag = '전체'; // 2026 복지 이슈 해시태그 필터
let currentNewsSearch = '';

export const newsCategoryBadgeMap = {
    '정책/제도': 'bg-blue-50 text-blue-700 border-blue-200',
    '복지관/현장': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '정신건강': 'bg-purple-50 text-purple-800 border-purple-200',
    '의료': 'bg-rose-50 text-rose-800 border-rose-200',
    '사회': 'bg-slate-100 text-slate-800 border-slate-300',
    'NGO/국제구호': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    '기업CSR/사회공헌': 'bg-amber-50 text-amber-700 border-amber-200',
    '일반 시사': 'bg-teal-50 text-teal-700 border-teal-200'
};

export function setNewsData(news) {
    publicNews = Array.isArray(news) ? news : [];
}

function enrichNewsItem(item) {
    const matchedDef = defaultWelfareNews.find((d) => d.title === item.title);
    const fieldIds = (Array.isArray(item.fieldIds) && item.fieldIds.length > 0)
        ? item.fieldIds
        : (matchedDef?.fieldIds || []);

    let hashtags = item.hashtags || matchedDef?.hashtags || [];
    if (!Array.isArray(hashtags) || hashtags.length === 0) {
        const text = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
        const tags = [];
        if (/돌봄통합|의료·요양/.test(text)) tags.push('돌봄통합');
        if (/유보통합|어린이집/.test(text)) tags.push('유보통합');
        if (/고립|은둔|청년/.test(text)) tags.push('청년고립');
        if (/인건비|가이드라인|호봉/.test(text)) tags.push('인건비가이드라인');
        if (/사회서비스원/.test(text)) tags.push('사회서비스원');
        if (/정신건강|정신응급|사법입원/.test(text)) tags.push('정신건강');
        if (/개인예산제/.test(text)) tags.push('개인예산제');
        if (/학생맞춤|교육복지/.test(text)) tags.push('학생맞춤통합');
        if (/esg|사회공헌|임팩트|기부/.test(text)) tags.push('ESG사회공헌');
        hashtags = tags;
    }

    if (fieldIds.length > 0) {
        return {
            ...item,
            fieldIds,
            hashtags,
            studyTip: item.studyTip || matchedDef?.studyTip || ''
        };
    }

    const cat = item.category || '';
    const txt = `${item.title || ''} ${item.summary || ''}`;
    const inferred = new Set();

    if (cat === '정신건강' || /정신|자살|중독/.test(txt)) inferred.add('mental-health');
    if (cat === '의료' || /의료|병원|재난적/.test(txt)) inferred.add('medical');
    if (cat === 'NGO/국제구호' || /ngo|국제구호|kcoc/i.test(txt)) inferred.add('ngo');
    if (cat === '기업CSR/사회공헌' || /csr|사회공헌|esg|임팩트/i.test(txt)) inferred.add('csr-foundation');
    if (/노인|통합돌봄|요양/.test(txt)) inferred.add('elderly');
    if (/아동|보육|어린이/.test(txt)) inferred.add('child');
    if (/청소년|고립.*청년/.test(txt)) inferred.add('youth');
    if (/장애/.test(txt)) inferred.add('disability');
    if (/가족|다문화|한부모|여성|성평등/.test(txt)) inferred.add('family-gender');
    if (/학교|교육복지/.test(txt)) inferred.add('school');
    if (/공무원|사회서비스원|교정|고용보험|산재/.test(txt)) inferred.add('public-justice');
    if (cat === '복지관/현장' || /복지관|자활|노숙/.test(txt) || inferred.size === 0) {
        inferred.add('community-selfreliance');
    }

    return {
        ...item,
        fieldIds: Array.from(inferred),
        hashtags,
        studyTip: item.studyTip || matchedDef?.studyTip || ''
    };
}

function getActiveNewsList() {
    const base = publicNews && publicNews.length > 0 ? publicNews : defaultWelfareNews;
    // defaultWelfareNews 중 신규 큐레이션(예: 성평등가족부/교육부 유보통합)은 Firestore에 없으면 함께 보완 노출
    const baseTitles = new Set(base.map((n) => n.title));
    const supplemental = defaultWelfareNews.filter((d) => !baseTitles.has(d.title));
    const custom = getCustomNews().map((n) => ({ ...n, isCustomLocal: true }));
    return [...custom, ...base, ...supplemental].map(enrichNewsItem);
}

export function getNewsCount() {
    return getActiveNewsList().length;
}

export function setNewsCategoryFilter(category) {
    currentNewsFilter = category || '전체';
    document.querySelectorAll('.news-cat-btn').forEach((btn) => {
        if (btn.dataset.cat === currentNewsFilter) {
            btn.className = 'news-cat-btn active px-3.5 py-1.5 bg-camping-green text-white font-bold rounded-full text-xs shadow-xs transition cursor-pointer';
        } else {
            btn.className = 'news-cat-btn px-3.5 py-1.5 bg-white text-camping-text border border-camping-beige font-bold rounded-full text-xs hover:bg-gray-50 transition cursor-pointer';
        }
    });
    renderNews();
}

export function setNewsFieldFilter(fieldId) {
    currentNewsFieldFilter = fieldId || '전체';
    const sel = document.getElementById('news-field-select');
    if (sel) sel.value = currentNewsFieldFilter;
    renderNews();
}

export function setNewsHashtagFilter(tag) {
    currentNewsHashtag = tag || '전체';
    renderNewsHashtags();
    renderNews();
}

export function renderNewsHashtags() {
    const container = document.getElementById('news-hashtag-archive-container');
    if (!container) return;

    const allNews = getActiveNewsList();

    const chipsHtml = NEWS_HASHTAGS.map((h) => {
        const isActive = currentNewsHashtag === h.tag;
        const count = h.tag === '전체'
            ? allNews.length
            : allNews.filter((n) => Array.isArray(n.hashtags) && n.hashtags.includes(h.tag)).length;

        const cls = isActive
            ? 'px-3 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-sm transition cursor-pointer flex items-center gap-1.5'
            : 'px-3 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50/50 transition cursor-pointer flex items-center gap-1.5';

        return `
            <button type="button" onclick="setNewsHashtagFilter('${escapeHtml(h.tag)}')" class="${cls}">
                <span>${escapeHtml(h.label)}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'} font-bold">${count}</span>
            </button>
        `;
    }).join('');

    container.innerHTML = `
        <div class="bg-gradient-to-r from-emerald-50/60 via-white to-sky-50/40 p-4 rounded-3xl border border-camping-beige shadow-2xs mb-5">
            <div class="flex items-center justify-between gap-2 mb-2.5">
                <div class="flex items-center gap-2">
                    <span class="text-lg">🏷️</span>
                    <span class="text-xs font-black text-camping-text">2026 복지 이슈 핵심 해시태그 아카이브 (1초 원클릭 필터):</span>
                </div>
                ${currentNewsHashtag !== '전체' ? `<button type="button" onclick="setNewsHashtagFilter('전체')" class="text-[11px] font-bold text-camping-green hover:underline cursor-pointer">해시태그 초기화 ↺</button>` : ''}
            </div>
            <div class="flex flex-wrap gap-2 items-center">
                ${chipsHtml}
            </div>
        </div>
    `;
}

let newsSearchTimer = null;
export function handleNewsSearch(keyword, immediate = false) {
    clearTimeout(newsSearchTimer);
    const update = () => {
        currentNewsSearch = (keyword || '').trim().toLowerCase();
        renderNews();
    };
    if (immediate) {
        update();
    } else {
        newsSearchTimer = setTimeout(update, 120);
    }
}

export function renderNews() {
    renderNewsHashtags();

    const container = document.getElementById('news-container');
    if (!container) return;

    const fieldSel = document.getElementById('news-field-select');
    if (fieldSel && fieldSel.options.length <= 1) {
        fieldSel.innerHTML =
            `<option value="전체">🧭 전체 12대 분야</option>` +
            WELFARE_FIELDS.map((f) => `<option value="${escapeHtml(f.id)}">${f.icon} ${escapeHtml(f.shortName)}</option>`).join('');
        fieldSel.value = currentNewsFieldFilter;
    }

    const sourceList = getActiveNewsList();
    const filtered = sourceList.filter((n) => {
        const matchesCat = currentNewsFilter === '전체' || (n.category && n.category.includes(currentNewsFilter));
        const matchesField =
            currentNewsFieldFilter === '전체' ||
            (Array.isArray(n.fieldIds) && n.fieldIds.includes(currentNewsFieldFilter));
        const matchesHashtag =
            currentNewsHashtag === '전체' ||
            (Array.isArray(n.hashtags) && n.hashtags.includes(currentNewsHashtag));
        const matchesSearch =
            !currentNewsSearch ||
            (n.title && n.title.toLowerCase().includes(currentNewsSearch)) ||
            (n.summary && n.summary.toLowerCase().includes(currentNewsSearch)) ||
            (n.studyTip && n.studyTip.toLowerCase().includes(currentNewsSearch)) ||
            (n.source && n.source.toLowerCase().includes(currentNewsSearch)) ||
            (Array.isArray(n.hashtags) && n.hashtags.some((t) => t.toLowerCase().includes(currentNewsSearch)));
        return matchesCat && matchesField && matchesHashtag && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16 text-gray-400 border border-dashed border-camping-beige rounded-3xl bg-white">
                선택하신 조건에 맞는 복지 시사 브리핑이 없습니다.<br>
                필터를 초기화하거나 <strong>[➕ 내 시사 노트 스크랩]</strong>으로 새 기사를 정리해 보세요! 📰
            </div>
        `;
        return;
    }

    const activeField = currentNewsFieldFilter !== '전체' ? getFieldById(currentNewsFieldFilter) : null;
    const displayList = currentNewsFilter === '전체' && !activeField && currentNewsHashtag === '전체' ? filtered : filtered.slice(0, 15);

    container.innerHTML = '';

    if (currentNewsFilter !== '전체' || activeField || currentNewsHashtag !== '전체') {
        const headerNotice = document.createElement('div');
        headerNotice.className = 'col-span-full bg-camping-bg/70 border border-camping-beige p-3 rounded-2xl flex items-center justify-between text-xs text-camping-subtext mb-1';
        const label = activeField 
            ? `${activeField.icon} ${activeField.name}` 
            : currentNewsHashtag !== '전체' 
                ? `#${currentNewsHashtag}` 
                : currentNewsFilter;
        headerNotice.innerHTML = `
            <div class="flex items-center gap-1.5 font-bold text-camping-text">
                <span>📌</span>
                <span>[${escapeHtml(label)}] 관련 시사 브리핑 (총 ${displayList.length}건)</span>
            </div>
            <button type="button" onclick="setNewsFieldFilter('전체'); setNewsCategoryFilter('전체'); setNewsHashtagFilter('전체')" class="text-[11px] font-bold text-camping-green hover:underline cursor-pointer">필터 전체 초기화</button>
        `;
        container.appendChild(headerNotice);
    }

    displayList.forEach((n) => {
        const badgeCat = newsCategoryBadgeMap[n.category] || 'bg-gray-100 text-gray-700 border-gray-200';
        const formattedDate = n.date ? String(n.date).replace(/-/g, '.') : '';
        const linkHref = normalizeHttpUrl(n.url);
        const linkBtn = linkHref
            ? `<a href="${escapeHtml(linkHref)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-camping-green hover:underline">
                    <span>원문 보기</span>
                    <span>↗</span>
               </a>`
            : `<span class="text-xs text-gray-400">자체 학습 노트</span>`;

        const safeId = escapeHtml(n.id || '');
        const actionButtons = n.isCustomLocal
            ? `<div class="flex gap-1.5">
                    <button type="button" onclick="openNewsModal('${safeId}')" class="w-7 h-7 rounded-full bg-gray-50 text-camping-green hover:bg-gray-100 flex items-center justify-center text-xs cursor-pointer" title="내 스크랩 수정">✏️</button>
                    <button type="button" onclick="deleteMyNewsItem('${safeId}')" class="w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-xs cursor-pointer" title="내 스크랩 삭제">🗑️</button>
               </div>`
            : `<span class="text-[10px] bg-camping-bg px-2 py-0.5 rounded-full text-camping-green font-bold">큐레이션</span>`;

        const fieldChips = (n.fieldIds || [])
            .slice(0, 3)
            .map((fid) => {
                const f = getFieldById(fid);
                return f
                    ? `<button type="button" onclick="setNewsFieldFilter('${escapeHtml(f.id)}')" class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${f.badgeClass} hover:opacity-80 cursor-pointer">${f.icon} ${escapeHtml(f.shortName)}</button>`
                    : '';
            })
            .join('');

        const hashtagsHtml = (n.hashtags || [])
            .map((tag) => `<button type="button" onclick="event.stopPropagation(); setNewsHashtagFilter('${escapeHtml(tag)}')" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition">#${escapeHtml(tag)}</button>`)
            .join(' ');

        container.innerHTML += `
            <div class="editorial-card bg-white dark:bg-[#161F30] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-lg hover:border-blue-500/40 transition-all duration-200 group flex flex-col h-full justify-between">
                <div class="flex justify-between items-start gap-2 mb-2">
                    <div class="flex gap-1.5 flex-wrap items-center">
                        <span class="px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${badgeCat}">${escapeHtml(n.category || '시사')}</span>
                        <span class="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">🏛️ ${escapeHtml(n.source || '전문출처')}</span>
                    </div>
                    ${actionButtons}
                </div>

                ${formattedDate ? `<div class="text-[11px] text-gray-400 mb-1">📅 ${escapeHtml(formattedDate)}</div>` : ''}

                <h3 class="font-bold text-base text-camping-text mb-2 line-clamp-2 leading-snug group-hover:text-camping-green transition">
                    ${linkHref ? `<a href="${escapeHtml(linkHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(n.title || '')}</a>` : escapeHtml(n.title || '')}
                </h3>

                <!-- 해시태그 뱃지 -->
                ${hashtagsHtml ? `<div class="flex flex-wrap gap-1 mb-2.5">${hashtagsHtml}</div>` : ''}

                <div class="bg-camping-bg/30 p-3 rounded-2xl flex-grow mb-2.5">
                    <div class="text-[11px] font-extrabold text-camping-subtext mb-1 flex items-center gap-1">
                        <span>💡</span> 핵심 브리핑 요약
                    </div>
                    <p class="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed line-clamp-4">${escapeHtml(n.summary || '')}</p>
                </div>

                <!-- 💡 2학년 실습·면접 대비 포인트 (고대비 하이라이트 박스) -->
                ${n.studyTip ? `
                    <div class="mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border-l-4 border-amber-500 text-[11px] text-amber-950 leading-relaxed shadow-2xs">
                        <div class="font-black text-amber-900 flex items-center gap-1 mb-1">
                            <span>💡</span> <span>2학년 실습 · 면접 대비 포인트:</span>
                        </div>
                        <p>${escapeHtml(n.studyTip)}</p>
                    </div>
                ` : ''}

                <div class="flex flex-wrap gap-1 mb-3">${fieldChips}</div>

                <div class="pt-2 border-t border-camping-beige/60 flex items-center justify-between">
                    ${linkBtn}
                    <button type="button" onclick="copyNewsNoteById('${safeId}')" class="text-[11px] text-gray-400 hover:text-camping-green transition flex items-center gap-1 cursor-pointer">
                        <span>📋</span> 요약 복사
                    </button>
                </div>
            </div>
        `;
    });
}

export function copyNewsNoteById(newsId) {
    const item = getActiveNewsList().find((n) => String(n.id) === String(newsId));
    if (!item) return;

    const text = `[사회복지 시사 브리핑]\n출처: ${item.source || '-'}\n제목: ${item.title || ''}\n핵심 요약: ${item.summary || ''}${item.studyTip ? `\n실습·면접 포인트: ${item.studyTip}` : ''}`;
    navigator.clipboard.writeText(text).then(() => {
        alert('뉴스 브리핑 요약이 클립보드에 복사되었습니다! 📋');
    }).catch(() => {
        alert('복사 실패');
    });
}

export function openNewsModal(id = null) {
    const newsModal = document.getElementById('news-modal');
    const newsModalContent = document.getElementById('news-modal-content');
    const form = document.getElementById('news-form');
    const btnDel = document.getElementById('btn-delete-news');
    if (!newsModal || !newsModalContent || !form) return;

    form.reset();
    if (id) {
        const n = getCustomNews().find((x) => x.id === id);
        if (!n) return;
        document.getElementById('news-id').value = n.id;
        document.getElementById('news-category').value = n.category || '정책/제도';
        document.getElementById('news-field').value = (n.fieldIds && n.fieldIds[0]) || 'community-selfreliance';
        document.getElementById('news-source').value = n.source || '';
        document.getElementById('news-title').value = n.title || '';
        document.getElementById('news-date').value = n.date || '';
        document.getElementById('news-url').value = n.url || '';
        document.getElementById('news-summary').value = n.summary || '';
        document.getElementById('news-modal-title').innerText = '내 시사 브리핑 노트 수정';
        if (btnDel) {
            btnDel.classList.remove('hidden');
            btnDel.onclick = () => {
                if (confirm('내가 작성한 시사 노트를 삭제할까요?')) {
                    deleteCustomNews(n.id);
                    closeNewsModal();
                    renderNews();
                }
            };
        }
    } else {
        document.getElementById('news-id').value = '';
        document.getElementById('news-modal-title').innerText = '내 시사 브리핑 스크랩 (개인 저장)';
        document.getElementById('news-date').value = new Date().toISOString().split('T')[0];
        if (currentNewsFieldFilter !== '전체') {
            document.getElementById('news-field').value = currentNewsFieldFilter;
        }
        if (btnDel) btnDel.classList.add('hidden');
    }

    newsModal.classList.remove('hidden');
    requestAnimationFrame(() => {
        newsModal.classList.remove('opacity-0');
        newsModalContent.classList.remove('scale-95');
    });
}

export function closeNewsModal() {
    const newsModal = document.getElementById('news-modal');
    const newsModalContent = document.getElementById('news-modal-content');
    if (!newsModal || !newsModalContent) return;

    newsModal.classList.add('opacity-0');
    newsModalContent.classList.add('scale-95');
    setTimeout(() => newsModal.classList.add('hidden'), 250);
}

export function deleteMyNewsItem(id) {
    if (!confirm('내가 스크랩한 이 시사 노트를 삭제할까요?')) return;
    deleteCustomNews(id);
    renderNews();
}

export function initNewsHandlers(onSaved) {
    const fieldSelect = document.getElementById('news-field');
    if (fieldSelect) {
        fieldSelect.innerHTML = WELFARE_FIELDS.map(
            (f) => `<option value="${escapeHtml(f.id)}">${f.icon} ${escapeHtml(f.shortName)}</option>`
        ).join('');
    }

    const newsForm = document.getElementById('news-form');
    if (!newsForm) return;

    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('news-id').value;
        const category = document.getElementById('news-category').value;
        const fieldId = document.getElementById('news-field').value;
        const source = document.getElementById('news-source').value.trim();
        const title = document.getElementById('news-title').value.trim();
        const date = document.getElementById('news-date').value;
        const url = normalizeHttpUrl(document.getElementById('news-url').value);
        const summary = document.getElementById('news-summary').value.trim();

        upsertCustomNews({
            id: id || undefined,
            category,
            fieldIds: fieldId ? [fieldId] : [],
            source,
            title,
            date,
            url,
            summary
        });

        closeNewsModal();
        renderNews();
        if (onSaved) onSaved();
    });
}


// ==================== [📖 풀 에디토리얼 심층 아티클 모달 시스템] ====================

let modalClapCount = 142;
let hasModalClapped = false;
let isModalBookmarked = false;
let currentEditorialFontSizeIdx = 1;
const editorialFontSizes = ['0.875rem', '1rem', '1.125rem'];

export function openEditorialArticleModal(newsId) {
    const list = getActiveNewsList();
    const item = list.find((n) => String(n.id) === String(newsId)) || list[0];
    if (!item) return;

    const modal = document.getElementById('editorial-article-modal');
    if (!modal) return;

    // Set Title & Content
    const titleEl = document.getElementById('editorial-modal-title');
    const subtitleEl = document.getElementById('editorial-modal-subtitle');
    const catEl = document.getElementById('editorial-modal-category');
    const dateEl = document.getElementById('editorial-modal-date');
    const authorEl = document.getElementById('editorial-modal-author');
    const p1El = document.getElementById('editorial-modal-body-p1');
    const takeawaysEl = document.getElementById('editorial-modal-takeaways');
    const tipEl = document.getElementById('editorial-modal-studytip');
    const linkEl = document.getElementById('editorial-modal-origin-link');
    const tagsEl = document.getElementById('editorial-modal-tags');

    if (titleEl) titleEl.innerText = item.title || '사회복지 현장 인사이트';
    if (subtitleEl) subtitleEl.innerText = item.summary ? item.summary.slice(0, 110) + '...' : '사회복지사를 위한 심층 정책 및 현장 실천 분석 저널';
    if (catEl) catEl.innerText = `${item.category || '시사'} • 현장 심층 분석`;
    if (dateEl) dateEl.innerText = item.date ? String(item.date).replace(/-/g, '.') : '2026. 11. 10';
    if (authorEl) authorEl.innerText = item.source ? `${item.source} 전문위원` : '사회복지 현장 나침반 에디토리얼팀';
    if (p1El) p1El.innerText = item.summary || '본 아티클은 최신 법령 및 현장 전달체계의 개편을 종합 분석하여 사회복지 실무와 실습생이 갖추어야 할 역량을 제시합니다.';
    
    if (takeawaysEl && item.summary) {
        takeawaysEl.innerHTML = `
            <p>• <strong>핵심 쟁점:</strong> ${escapeHtml(item.summary)}</p>
            <p>• <strong>실천적 시사점:</strong> 현장 실무자는 관련 법령의 적용 범위와 사례관리 연계 방안을 명확히 숙지해야 합니다.</p>
        `;
    }

    if (tipEl) {
        tipEl.innerText = item.studyTip || '본 이슈는 종합복지관 및 공단 면접에서 단골로 출제되는 핵심 주제입니다. 당사자 중심의 사례관리 접근법과 연계하여 나만의 실천 철학을 답변으로 준비하세요.';
    }

    if (linkEl) {
        if (item.url) {
            linkEl.href = normalizeHttpUrl(item.url);
            linkEl.classList.remove('hidden');
        } else {
            linkEl.classList.add('hidden');
        }
    }

    if (tagsEl && Array.isArray(item.hashtags)) {
        tagsEl.innerHTML = item.hashtags.map((t) => 
            `<span class="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 text-xs font-bold">#${escapeHtml(t)}</span>`
        ).join(' ');
    }

    // Modal Scroll Progress Bar Listener
    const onModalScroll = () => {
        const docHeight = modal.scrollHeight - modal.clientHeight;
        const scrollPos = modal.scrollTop;
        const percent = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;
        const bar = document.getElementById('modal-reading-progress');
        if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    };
    modal.onscroll = onModalScroll;

    // Show Modal
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.scrollTop = 0;
    });
}

export function closeEditorialArticleModal() {
    const modal = document.getElementById('editorial-article-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

export function handleEditorialClap() {
    if (!hasModalClapped) {
        modalClapCount += 1;
        hasModalClapped = true;
    } else {
        modalClapCount -= 1;
        hasModalClapped = false;
    }
    const counter = document.getElementById('modal-clap-counter');
    const btn = document.getElementById('modal-clap-btn');
    if (counter) counter.innerText = modalClapCount;
    if (btn) {
        if (hasModalClapped) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('bg-slate-50', 'text-blue-600');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-slate-50', 'text-blue-600');
        }
    }
}

export function toggleEditorialBookmark() {
    isModalBookmarked = !isModalBookmarked;
    const btn = document.getElementById('modal-bookmark-btn');
    if (btn) {
        btn.innerText = isModalBookmarked ? '★' : '🔖';
        btn.classList.toggle('text-amber-500', isModalBookmarked);
    }
}

export function adjustEditorialFontSize(delta) {
    currentEditorialFontSizeIdx = Math.max(0, Math.min(editorialFontSizes.length - 1, currentEditorialFontSizeIdx + delta));
    const prose = document.getElementById('editorial-prose');
    if (prose) {
        prose.querySelectorAll('p').forEach((p) => {
            p.style.fontSize = editorialFontSizes[currentEditorialFontSizeIdx];
        });
    }
}

export function submitModalHelpful(isHelpful) {
    const btns = document.getElementById('modal-feedback-buttons');
    const msg = document.getElementById('modal-feedback-msg');
    if (btns) btns.classList.add('hidden');
    if (msg) msg.classList.remove('hidden');
}

export function submitModalComment() {
    const input = document.getElementById('modal-comment-input');
    const feed = document.getElementById('modal-comment-feed');
    const badge = document.getElementById('modal-comment-badge');
    if (!input || !input.value.trim()) {
        alert('코멘트 내용을 작성해 주세요.');
        return;
    }
    const val = escapeHtml(input.value.trim());
    const newBox = document.createElement('div');
    newBox.className = 'p-3.5 rounded-xl bg-white dark:bg-[#161F30] border border-blue-200 dark:border-blue-900/60 text-xs space-y-1';
    newBox.innerHTML = `
        <div class="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200">
            <span class="flex items-center gap-1.5"><span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">나</span> 독자 코멘트</span>
            <span class="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">방금 전</span>
        </div>
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${val}</p>
    `;
    if (feed) feed.prepend(newBox);
    input.value = '';
    if (badge) badge.innerText = String(parseInt(badge.innerText || '2', 10) + 1);
}

// Bind to window for inline onclick accessibility
window.openEditorialArticleModal = openEditorialArticleModal;
window.closeEditorialArticleModal = closeEditorialArticleModal;
window.handleEditorialClap = handleEditorialClap;
window.toggleEditorialBookmark = toggleEditorialBookmark;
window.adjustEditorialFontSize = adjustEditorialFontSize;
window.submitModalHelpful = submitModalHelpful;
window.submitModalComment = submitModalComment;
window.copyArticleUrl = function() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
    }
    alert('아티클 링크가 클립보드에 복사되었습니다.');
};

// ESC Key listener
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditorialArticleModal();
    }
});
