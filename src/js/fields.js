export function matchesMinistry(rowMinistry, targetMinistry) {
    if (!targetMinistry || targetMinistry === '전체') return true;
    if (!rowMinistry) return false;
    const cleanTarget = String(targetMinistry).replace(/\s*\(.*?\)\s*/g, '').trim();
    const cleanRow = String(rowMinistry).replace(/\s*\(.*?\)\s*/g, '').trim();
    if (cleanRow === cleanTarget) return true;
    if (cleanRow.includes(cleanTarget) || cleanTarget.includes(cleanRow)) return true;
    return false;
}

import {
    WELFARE_FIELDS,
    STATUTORY_MATRIX,
    MINISTRY_COMPARISON_MATRIX,
    getFieldById,
    getLawUrl
} from '../data/welfare-taxonomy.js';
import { isFieldBookmarked, toggleFieldBookmark, isLawBookmarked, toggleLawBookmark } from './storage.js';
import { escapeHtml, normalizeHttpUrl } from './utils.js';

let fieldsViewMode = 'matrix'; // 'matrix' | 'cards'
let currentMinistryFilter = '전체';
let currentNatureFilter = '전체'; // '전체' | 'living' | 'using'
let currentFieldsSearch = '';
let isMinistryComparisonOpen = false;

let onNavigateCallback = null;

export function setFieldsNavigator(callback) {
    onNavigateCallback = callback;
}

export function setFieldsViewMode(mode) {
    fieldsViewMode = mode === 'cards' ? 'cards' : 'matrix';
    updateFieldsModeButtons();
    renderFieldsView();
}

export function toggleMinistryComparisonHub() {
    isMinistryComparisonOpen = !isMinistryComparisonOpen;
    renderMinistryComparisonHub();
}

export function openAndScrollToMinistryHub() {
    isMinistryComparisonOpen = true;
    renderMinistryComparisonHub();
    const hub = document.getElementById('fields-ministry-comparison-hub');
    if (hub) {
        hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export function setMinistryFilter(ministry, scrollUp = false) {
    currentMinistryFilter = ministry || '전체';
    if (fieldsViewMode !== 'matrix') {
        fieldsViewMode = 'matrix';
    }
    renderFieldsView();
    if (scrollUp) {
        const target = document.getElementById('fields-atlas-container');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

export function setNatureFilter(nature) {
    currentNatureFilter = nature || '전체';
    renderFieldsView();
}

export let fieldsSearchTimer = null;
export function handleFieldsSearch(keyword, immediate = false) {
    clearTimeout(fieldsSearchTimer);
    const update = () => {
        currentFieldsSearch = String(keyword || '').trim().toLowerCase();
        renderFieldsView();
    };
    if (immediate) {
        update();
    } else {
        fieldsSearchTimer = setTimeout(update, 120);
    }
}

function updateFieldsModeButtons() {
    const matrixBtn = document.getElementById('btn-fields-mode-matrix');
    const cardsBtn = document.getElementById('btn-fields-mode-cards');
    const natureWrap = document.getElementById('fields-nature-filter-wrap');

    if (matrixBtn && cardsBtn) {
        if (fieldsViewMode === 'matrix') {
            matrixBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-camping-green text-white shadow-2xs transition cursor-pointer';
            cardsBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:bg-gray-50 transition cursor-pointer';
            if (natureWrap) natureWrap.classList.remove('hidden');
        } else {
            cardsBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-camping-green text-white shadow-2xs transition cursor-pointer';
            matrixBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:bg-gray-50 transition cursor-pointer';
            if (natureWrap) natureWrap.classList.add('hidden');
        }
    }
}

function renderMinistryFilterPills() {
    const container = document.getElementById('fields-ministry-filters');
    if (!container) return;

    const ministries = ['전체', '보건복지부', '성평등가족부', '고용노동부', '교육부', '국가보훈부', '법무부', '통일부', '질병관리청', '행정안전부', '비영리 · 민간임팩트'];
    container.innerHTML = ministries
        .map((m) => {
            const active = currentMinistryFilter === m || (m !== '전체' && currentMinistryFilter !== '전체' && matchesMinistry(m, currentMinistryFilter));
            const cls = active
                ? 'px-3 py-1.5 rounded-full text-xs font-extrabold bg-camping-green text-white shadow-2xs transition cursor-pointer'
                : 'px-3 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:bg-gray-50 transition cursor-pointer';
            const label = m === '성평등가족부' ? '성평등가족부 (구 여가부)' : m;
            return `<button type="button" onclick="setMinistryFilter('${escapeHtml(m)}')" class="${cls}">${escapeHtml(label)}</button>`;
        })
        .join('');
}

function filterMatrixRows() {
    return STATUTORY_MATRIX.filter((row) => {
        if (currentMinistryFilter !== '전체' && !matchesMinistry(row.ministry, currentMinistryFilter)) {
            return false;
        }
        if (currentNatureFilter === 'living' && row.livingFacilities.length === 0) {
            return false;
        }
        if (currentNatureFilter === 'using' && row.usingFacilities.length === 0) {
            return false;
        }
        if (currentFieldsSearch) {
            const field = getFieldById(row.fieldId);
            const hay = [
                row.ministry,
                row.facilityCategory,
                ...row.livingFacilities,
                ...row.usingFacilities,
                ...row.laws,
                row.note,
                field?.name || '',
                field?.targets || ''
            ]
                .join(' ')
                .toLowerCase();
            if (!hay.includes(currentFieldsSearch)) return false;
        }
        return true;
    });
}

function filterFieldCards() {
    return WELFARE_FIELDS.filter((f) => {
        if (currentMinistryFilter !== '전체') {
            const mappedMatch = STATUTORY_MATRIX.some(
                (row) => row.fieldId === f.id && matchesMinistry(row.ministry, currentMinistryFilter)
            );
            const fieldMinistryMatch = f.ministries && f.ministries.some(
                (m) => matchesMinistry(m, currentMinistryFilter)
            );
            if (!mappedMatch && !fieldMinistryMatch) return false;
        }
        if (currentFieldsSearch) {
            const hay = [
                f.name,
                f.summary,
                f.targets,
                ...f.laws,
                ...f.ministries,
                ...f.facilities.living,
                ...f.facilities.using,
                ...f.facilities.extended,
                ...f.career.institutions,
                ...f.keywords
            ]
                .join(' ')
                .toLowerCase();
            if (!hay.includes(currentFieldsSearch)) return false;
        }
        return true;
    });
}

function renderMatrixView(container) {
    const rows = filterMatrixRows();
    if (rows.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-gray-400 border border-dashed border-camping-beige rounded-3xl bg-white">
                <p class="text-sm font-bold text-gray-600 mb-2">검색 조건에 해당하는 법령·시설 분류가 없습니다.</p>
                <p class="text-xs text-gray-400 mb-4">소관부처 필터를 '전체'로 변경하거나 검색어를 확인해 보세요.</p>
                <button type="button" onclick="setMinistryFilter('전체'); setNatureFilter('전체'); handleFieldsSearch('');" class="px-4 py-2 rounded-xl bg-camping-green text-white font-bold text-xs hover:bg-[#3f5a3b] transition cursor-pointer">
                    🔄 필터 초기화
                </button>
            </div>
        `;
        return;
    }

    // 소관부처별 연속 그룹 rowSpan 계산 (wel4u 스타일)
    const groupedRows = rows.map((row, idx) => {
        const isFirstOfMinistry = idx === 0 || rows[idx - 1].ministry !== row.ministry;
        let span = 0;
        if (isFirstOfMinistry) {
            for (let j = idx; j < rows.length && rows[j].ministry === row.ministry; j++) {
                span++;
            }
        }
        return { row, isFirstOfMinistry, span };
    });

    const desktopTableHtml = `
        <div class="hidden md:block bg-white rounded-3xl border border-camping-beige shadow-sm overflow-hidden">
            <div class="px-5 py-3 bg-emerald-50/60 border-b border-camping-beige flex flex-wrap items-center justify-between gap-2 text-xs">
                <div class="font-bold text-camping-text flex items-center gap-2">
                    <span>📜</span>
                    <span>2. 소관부처 · 시설종류 · 생활/이용시설 · 근거법령 통합 분류표 (총 ${rows.length}개 법정·확장 분류)</span>
                </div>
                <span class="text-[11px] text-camping-subtext">행을 클릭하면 실습·인턴·취업처 상세 가이드를 바로 볼 수 있습니다 👆</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-camping-bg/70 text-camping-text border-b border-camping-beige">
                            <th rowspan="2" class="py-3 px-3 font-extrabold text-center border-r border-camping-beige w-[12%]">소관부처</th>
                            <th rowspan="2" class="py-3 px-3 font-extrabold text-center border-r border-camping-beige w-[19%]">시설 · 분야 종류</th>
                            <th colspan="2" class="py-2 px-3 font-extrabold text-center border-b border-r border-camping-beige">세부종류 (서비스 제공 형태)</th>
                            <th rowspan="2" class="py-3 px-3 font-extrabold text-center w-[23%]">근거 법령 &amp; 탐색</th>
                        </tr>
                        <tr class="bg-camping-bg/40 text-camping-subtext border-b-2 border-camping-green/40">
                            <th class="py-2 px-3 font-bold text-center border-r border-camping-beige w-[23%]">🏠 생활시설 (거주형)</th>
                            <th class="py-2 px-3 font-bold text-center border-r border-camping-beige w-[23%]">🏢 이용시설 · 전담기관</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-camping-beige/70">
                        ${groupedRows
                            .map(({ row, isFirstOfMinistry, span }) => {
                                const field = getFieldById(row.fieldId);
                                const isSaved = isLawBookmarked(row.id);

                                const ministryCell = isFirstOfMinistry
                                    ? `<td rowspan="${span}" class="align-top pt-5 text-center p-3 font-extrabold border-r border-camping-beige bg-sky-50/50 text-sky-900 dark-ministry-cell">
                                            <span class="inline-block px-2 py-1 rounded-lg">${escapeHtml(row.ministry)}</span>
                                       </td>`
                                    : '';

                                const livingHtml = row.livingFacilities.length
                                    ? `<ul class="space-y-1 text-gray-700">
                                            ${row.livingFacilities.map((f) => `<li class="flex items-start gap-1.5"><span class="text-camping-green font-bold">•</span><span>${escapeHtml(f)}</span></li>`).join('')}
                                       </ul>`
                                    : row.note && row.usingFacilities.length === 0
                                        ? ''
                                        : '<span class="text-[11px] text-gray-300">-</span>';

                                const usingHtml = row.usingFacilities.length
                                    ? `<ul class="space-y-1 text-gray-700">
                                            ${row.usingFacilities.map((f) => `<li class="flex items-start gap-1.5"><span class="text-sky-600 font-bold">•</span><span>${escapeHtml(f)}</span></li>`).join('')}
                                       </ul>`
                                    : '<span class="text-[11px] text-gray-300">-</span>';

                                const detailCells =
                                    row.livingFacilities.length === 0 && row.usingFacilities.length === 0 && row.note
                                        ? `<td colspan="2" class="p-3 border-r border-camping-beige text-gray-700 leading-relaxed bg-amber-50/30">${escapeHtml(row.note)}</td>`
                                        : `<td class="p-3 align-top border-r border-camping-beige">${livingHtml}</td>
                                           <td class="p-3 align-top border-r border-camping-beige">${usingHtml}</td>`;

                                const lawsHtml = row.laws
                                    .map(
                                        (law) => `<a href="${escapeHtml(getLawUrl(law))}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-camping-bg hover:bg-camping-green hover:text-white text-camping-text font-bold transition text-[11px] border border-camping-beige" title="국가법령정보센터에서 검색">${escapeHtml(law)} ↗</a>`
                                    )
                                    .join(' ');

                                return `
                                    <tr onclick="openFieldDetailModal('${escapeHtml(row.fieldId)}', '${escapeHtml(row.id)}')" class="hover:bg-emerald-50/40 transition cursor-pointer group">
                                        ${ministryCell}
                                        <td class="p-3 align-top border-r border-camping-beige">
                                            <div class="font-extrabold text-sm text-camping-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1">${escapeHtml(row.facilityCategory)}</div>
                                            ${field ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${field.badgeClass}">${field.icon} ${escapeHtml(field.shortName)}</span>` : ''}
                                            ${row.note && (row.livingFacilities.length > 0 || row.usingFacilities.length > 0) ? `<p class="text-[11px] text-gray-500 mt-1.5 leading-snug">${escapeHtml(row.note)}</p>` : ''}
                                        </td>
                                        ${detailCells}
                                        <td class="p-3 align-top">
                                            <div class="flex flex-wrap gap-1 mb-2.5">${lawsHtml}</div>
                                            <div class="flex items-center justify-between gap-1.5 pt-1.5 border-t border-camping-beige/60">
                                                <button type="button" onclick="event.stopPropagation(); toggleLawBookmarkAndRender('${escapeHtml(row.id)}')" class="px-2 py-1 rounded-lg text-[11px] font-bold border ${isSaved ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50'} transition cursor-pointer">
                                                    ${isSaved ? '★ 찜함' : '☆ 찜하기'}
                                                </button>
                                                <span class="text-[11px] font-extrabold text-camping-green group-hover:underline">실습·취업 상세 &rarr;</span>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            })
                            .join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // 모바일 전용 반응형 카드 뷰
    const mobileCardsHtml = `
        <div class="md:hidden space-y-3">
            ${rows
                .map((row) => {
                    const field = getFieldById(row.fieldId);
                    const isSaved = isLawBookmarked(row.id);
                    return `
                        <div onclick="openFieldDetailModal('${escapeHtml(row.fieldId)}', '${escapeHtml(row.id)}')" class="bg-white p-4 rounded-2xl border border-camping-beige shadow-xs cursor-pointer">
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${row.ministryBadge}">${escapeHtml(row.ministry)}</span>
                                ${field ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${field.badgeClass}">${field.icon} ${escapeHtml(field.shortName)}</span>` : ''}
                            </div>
                            <h4 class="font-extrabold text-base text-camping-text mb-2">${escapeHtml(row.facilityCategory)}</h4>
                            ${row.livingFacilities.length ? `<div class="mb-2"><div class="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1">🏠 생활시설</div><div class="text-xs text-gray-600">${row.livingFacilities.map((f) => `• ${escapeHtml(f)}`).join('<br>')}</div></div>` : ''}
                            ${row.usingFacilities.length ? `<div class="mb-2"><div class="text-[11px] font-bold text-sky-700 mb-1">🏢 이용시설 · 전담기관</div><div class="text-xs text-gray-600">${row.usingFacilities.map((f) => `• ${escapeHtml(f)}`).join('<br>')}</div></div>` : ''}
                            ${row.note ? `<p class="text-[11px] text-gray-500 bg-camping-bg/50 p-2 rounded-xl mb-2">${escapeHtml(row.note)}</p>` : ''}
                            <div class="flex flex-wrap gap-1 mb-2.5">
                                ${row.laws.map((law) => `<a href="${escapeHtml(getLawUrl(law))}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="px-2 py-0.5 rounded bg-camping-bg text-[11px] font-bold text-camping-text border border-camping-beige">${escapeHtml(law)} ↗</a>`).join('')}
                            </div>
                            <div class="flex items-center justify-between pt-2 border-t border-camping-beige/60 text-xs">
                                <button type="button" onclick="event.stopPropagation(); toggleLawBookmarkAndRender('${escapeHtml(row.id)}')" class="px-2.5 py-1 rounded-lg font-bold border ${isSaved ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-gray-50 text-gray-600 border-gray-200'}">
                                    ${isSaved ? '★ 찜함' : '☆ 찜하기'}
                                </button>
                                <span class="font-extrabold text-camping-green">상세 · 실습 · 취업 보기 &rarr;</span>
                            </div>
                        </div>
                    `;
                })
                .join('')}
        </div>
    `;

    container.innerHTML = desktopTableHtml + mobileCardsHtml;
}

function renderFieldCardsView(container) {
    const fields = filterFieldCards();
    if (fields.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-gray-400 border border-dashed border-camping-beige rounded-3xl bg-white">
                검색 조건에 맞는 세분화 분야가 없습니다.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${fields
                .map((f) => {
                    const isSaved = isFieldBookmarked(f.id);
                    const totalFacilities = f.facilities.living.length + f.facilities.using.length + f.facilities.extended.length;
                    return `
                        <div onclick="openFieldDetailModal('${escapeHtml(f.id)}')" class="editorial-card bg-white dark:bg-[#161F30] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-lg hover:border-blue-500/40 transition-all duration-200 cursor-pointer flex flex-col h-full group justify-between">
                            <div>
                                <div class="flex items-start justify-between gap-2 mb-3">
                                    <div class="flex items-center gap-2">
                                        <span class="text-2xl">${f.icon}</span>
                                        <div>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${f.badgeClass}">${escapeHtml(f.ministries.join(' · '))}</span>
                                            <h3 class="font-extrabold text-base text-camping-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mt-1">${escapeHtml(f.name)}</h3>
                                        </div>
                                    </div>
                                    <button type="button" onclick="event.stopPropagation(); toggleFieldBookmarkAndRender('${escapeHtml(f.id)}')" class="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition cursor-pointer ${isSaved ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-500'}" title="내 준비함에 찜하기">
                                        ${isSaved ? '★' : '☆'}
                                    </button>
                                </div>

                                <p class="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-3">${escapeHtml(f.summary)}</p>

                                <div class="bg-camping-bg/50 p-3 rounded-2xl text-[11px] space-y-1.5 mb-3">
                                    <div><strong class="text-camping-text">📌 근거법령:</strong> <span class="text-gray-600">${escapeHtml(f.laws.slice(0, 2).join(', '))}${f.laws.length > 2 ? ` 외 ${f.laws.length - 2}건` : ''}</span></div>
                                    <div><strong class="text-camping-text">🎒 현장실습:</strong> <span class="font-bold text-blue-600 dark:text-blue-400">${escapeHtml(f.practicum.availability)}</span></div>
                                    <div><strong class="text-camping-text">🏢 주요기관:</strong> <span class="text-gray-600">${totalFacilities}개 세부기관군</span></div>
                                </div>
                            </div>

                            <div class="pt-2 border-t border-camping-beige/60 flex items-center justify-between gap-2 text-[11px]">
                                <button type="button" onclick="event.stopPropagation(); jumpFromField('${escapeHtml(f.id)}', 'practicum')" class="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition cursor-pointer">🎒 실습 탐색</button>
                                <button type="button" onclick="event.stopPropagation(); jumpFromField('${escapeHtml(f.id)}', 'jobs')" class="flex-1 py-1.5 px-2 rounded-xl bg-amber-50 text-amber-800 font-bold hover:bg-amber-600 hover:text-white transition cursor-pointer">💼 취업·공고</button>
                                <button type="button" onclick="event.stopPropagation(); openFieldDetailModal('${escapeHtml(f.id)}')" class="py-1.5 px-2.5 rounded-xl bg-camping-bg text-camping-text font-bold hover:bg-camping-green hover:text-white transition cursor-pointer">상세</button>
                            </div>
                        </div>
                    `;
                })
                .join('')}
        </div>
    `;
}

// 3. 원클릭 소관부처별 법령 비교 매트릭스 (맨 밑에 배치)
export function renderMinistryComparisonHub() {
    const container = document.getElementById('fields-ministry-comparison-hub');
    if (!container) return;

    if (!isMinistryComparisonOpen) {
        container.innerHTML = `
            <div class="bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/70 p-4 sm:p-5 rounded-3xl border border-emerald-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span class="text-3xl p-2 bg-emerald-100/70 rounded-2xl">🏛️</span>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="font-extrabold text-sm sm:text-base text-camping-text">
                                3. 원클릭 소관부처별 법령 비교 매트릭스
                            </h3>
                            <span class="text-[10px] font-extrabold bg-emerald-100 text-camping-green px-2 py-0.5 rounded-full">2학년 수험·실습 나침반</span>
                        </div>
                        <p class="text-xs text-camping-subtext mt-0.5">
                            복지부·성평등가족부·노동부·교육부·보훈부·법무부 6대 부처별 핵심 법령·생활/이용시설 체계 심층 비교
                            ${currentMinistryFilter !== '전체' ? `<span class="ml-2 font-bold text-blue-600 dark:text-blue-400">(선택 필터: ${escapeHtml(currentMinistryFilter)})</span>` : ''}
                        </p>
                    </div>
                </div>
                <button type="button" onclick="toggleMinistryComparisonHub()" class="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-camping-green text-white hover:bg-[#3f5a3b] transition shadow-2xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer">
                    <span>6대 부처 비교 매트릭스 펼쳐보기 ▾</span>
                </button>
            </div>
        `;
        return;
    }

    const cardsHtml = MINISTRY_COMPARISON_MATRIX.map((item) => {
        const isActive = currentMinistryFilter !== '전체' && matchesMinistry(item.ministry, currentMinistryFilter);
        const activeBorder = isActive ? 'border-2 border-camping-green ring-2 ring-camping-green/20' : 'border border-camping-beige';
        return `
            <div onclick="setMinistryFilter('${isActive ? '전체' : escapeHtml(item.ministry)}', true)" class="bg-white rounded-2xl p-4 ${activeBorder} shadow-2xs hover:shadow-md hover:border-camping-green transition cursor-pointer flex flex-col justify-between group">
                <div>
                    <div class="flex items-center justify-between gap-1 mb-1.5">
                        <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${item.badgeClass}">${item.icon} ${escapeHtml(item.ministry)}</span>
                        ${isActive ? '<span class="text-[10px] font-black bg-camping-green text-white px-2 py-0.5 rounded-full">선택됨 ✓</span>' : '<span class="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">필터적용 &uarr;</span>'}
                    </div>
                    <div class="font-extrabold text-xs text-camping-text mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">${escapeHtml(item.headline)}</div>
                    <p class="text-[11px] text-gray-600 mb-2 leading-relaxed">${escapeHtml(item.summary)}</p>
                    
                    <div class="space-y-1 mb-2.5 pt-2 border-t border-gray-100">
                        <div class="text-[10px] font-extrabold text-camping-subtext">📜 주요 근거 법령:</div>
                        <ul class="text-[10px] text-gray-700 space-y-0.5">
                            ${item.keyLaws.slice(0, 3).map((l) => `<li><strong class="text-camping-text">${escapeHtml(l.name)}</strong>: ${escapeHtml(l.desc)}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="text-[10px] text-gray-600 space-y-0.5 mb-2 bg-gray-50/70 p-2 rounded-xl">
                        <div><strong>🏠 생활:</strong> <span class="text-gray-700">${escapeHtml(item.livingFacilities)}</span></div>
                        <div><strong>🏢 이용:</strong> <span class="text-gray-700">${escapeHtml(item.usingFacilities)}</span></div>
                    </div>
                </div>

                <div class="text-[10px] text-amber-900 bg-amber-50/80 border border-amber-200/70 rounded-xl p-2 font-medium mt-1">
                    ${escapeHtml(item.studentPoint)}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 p-5 rounded-3xl border-2 border-emerald-200/80 shadow-sm mb-6">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🏛️</span>
                    <div>
                        <h3 class="font-extrabold text-sm sm:text-base text-camping-text flex items-center gap-2">
                            <span>3. 원클릭 소관부처별 법령 비교 매트릭스</span>
                            <span class="text-[10px] font-extrabold bg-emerald-100 text-camping-green px-2 py-0.5 rounded-full">2학년 수험·실습 나침반</span>
                        </h3>
                        <p class="text-xs text-camping-subtext">부처 카드를 클릭하면 상단 분류표가 해당 소관부처로 즉시 필터링되며 상단으로 이동합니다.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="setMinistryFilter('전체')" class="px-3 py-1 rounded-full text-xs font-bold ${currentMinistryFilter === '전체' ? 'bg-camping-green text-white' : 'bg-white text-camping-text border border-camping-beige hover:bg-gray-50'} transition cursor-pointer">
                        전체 초기화
                    </button>
                    <button type="button" onclick="toggleMinistryComparisonHub()" class="px-3 py-1 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:bg-gray-50 transition cursor-pointer">
                        접기 ▴
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                ${cardsHtml}
            </div>
        </div>
    `;
}

export function renderFieldsView() {
    updateFieldsModeButtons();
    renderMinistryFilterPills();

    const container = document.getElementById('fields-atlas-container');
    if (!container) return;

    if (fieldsViewMode === 'matrix') {
        renderMatrixView(container);
    } else {
        renderFieldCardsView(container);
    }

    // 3. 원클릭 소관부처별 법령 비교 매트릭스는 맨 밑에 렌더링!
    renderMinistryComparisonHub();
}

export function toggleFieldBookmarkAndRender(fieldId) {
    toggleFieldBookmark(fieldId);
    renderFieldsView();
    const modalFieldId = document.getElementById('field-detail-modal')?.dataset.fieldId;
    if (modalFieldId === fieldId) {
        updateModalBookmarkState(fieldId);
    }
}

export function toggleLawBookmarkAndRender(lawId) {
    toggleLawBookmark(lawId);
    renderFieldsView();
}

function updateModalBookmarkState(fieldId) {
    const btn = document.getElementById('btn-detail-bookmark-field');
    if (!btn) return;
    const saved = isFieldBookmarked(fieldId);
    btn.className = saved
        ? 'px-3.5 py-2 rounded-xl text-xs font-extrabold border bg-amber-100 text-amber-800 border-amber-300 transition cursor-pointer'
        : 'px-3.5 py-2 rounded-xl text-xs font-bold border bg-white text-camping-text border-camping-beige hover:bg-amber-50 transition cursor-pointer';
    btn.innerText = saved ? '★ 내 준비함에 찜됨' : '☆ 이 분야 찜하기';
}

export function openFieldDetailModal(fieldId, lawRowId = null) {
    const field = getFieldById(fieldId);
    const modal = document.getElementById('field-detail-modal');
    const content = document.getElementById('field-detail-modal-content');
    const body = document.getElementById('field-detail-body');
    if (!field || !modal || !content || !body) return;

    modal.dataset.fieldId = fieldId;
    const lawRow = lawRowId ? STATUTORY_MATRIX.find((r) => r.id === lawRowId) : null;

    document.getElementById('field-detail-title').innerHTML = `${field.icon} ${escapeHtml(field.name)}`;
    document.getElementById('field-detail-subtitle').innerText = lawRow
        ? `선택한 법령 분류: ${lawRow.ministry} · ${lawRow.facilityCategory}`
        : `소관부처: ${field.ministries.join(', ')}`;

    updateModalBookmarkState(field.id);
    const bmBtn = document.getElementById('btn-detail-bookmark-field');
    if (bmBtn) {
        bmBtn.onclick = () => toggleFieldBookmarkAndRender(field.id);
    }

    const lawLinksHtml = field.laws
        .map(
            (law) => `<a href="${escapeHtml(getLawUrl(law))}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-camping-bg hover:bg-camping-green hover:text-white text-xs font-bold text-camping-text border border-camping-beige transition">${escapeHtml(law)} ↗</a>`
        )
        .join('');

    body.innerHTML = `
        <div class="space-y-4 text-xs sm:text-sm">
            <div class="bg-emerald-50/60 border border-emerald-200/70 p-4 rounded-2xl">
                <p class="text-camping-text leading-relaxed font-medium">${escapeHtml(field.summary)}</p>
                <div class="mt-2.5 text-xs text-gray-600"><strong>🎯 주요 대상자:</strong> ${escapeHtml(field.targets)}</div>
            </div>

            <div>
                <h4 class="font-extrabold text-xs text-camping-subtext mb-2">📜 관련 법령 (클릭 시 국가법령정보센터 이동)</h4>
                <div class="flex flex-wrap gap-1.5">${lawLinksHtml}</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div class="bg-camping-bg/40 p-3.5 rounded-2xl border border-camping-beige">
                    <div class="font-extrabold text-camping-green mb-1.5">🏠 생활시설 (거주형)</div>
                    ${field.facilities.living.length
                        ? `<ul class="space-y-1 text-gray-700">${field.facilities.living.map((x) => `<li>• ${escapeHtml(x)}</li>`).join('')}</ul>`
                        : '<p class="text-gray-400">해당 없음 (주로 이용·전담조직 형태)</p>'}
                </div>
                <div class="bg-camping-bg/40 p-3.5 rounded-2xl border border-camping-beige">
                    <div class="font-extrabold text-sky-700 mb-1.5">🏢 이용시설 (지역·통원형)</div>
                    ${field.facilities.using.length
                        ? `<ul class="space-y-1 text-gray-700">${field.facilities.using.map((x) => `<li>• ${escapeHtml(x)}</li>`).join('')}</ul>`
                        : '<p class="text-gray-400">해당 없음</p>'}
                </div>
                <div class="bg-camping-bg/40 p-3.5 rounded-2xl border border-camping-beige">
                    <div class="font-extrabold text-amber-700 mb-1.5">🧭 공공 · 비영리 확장기관</div>
                    ${field.facilities.extended.length
                        ? `<ul class="space-y-1 text-gray-700">${field.facilities.extended.map((x) => `<li>• ${escapeHtml(x)}</li>`).join('')}</ul>`
                        : '<p class="text-gray-400">해당 없음</p>'}
                </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-camping-beige">
                <h4 class="font-extrabold text-xs text-camping-text mb-2">👩‍💼 사회복지사 핵심 역할</h4>
                <ul class="space-y-1 text-xs text-gray-600">
                    ${field.roles.map((r) => `<li>✓ ${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70">
                    <div class="font-extrabold text-emerald-900 mb-1.5 flex items-center justify-between">
                        <span>🎒 현장실습 핵심 요약</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] border ${field.practicum.availabilityBadge}">${escapeHtml(field.practicum.availability)}</span>
                    </div>
                    <p class="text-gray-600 mb-1.5"><strong>모집시기:</strong> ${escapeHtml(field.practicum.timing)}</p>
                    <p class="text-gray-600"><strong>준비 팁:</strong> ${escapeHtml(field.practicum.tips)}</p>
                </div>
                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70">
                    <div class="font-extrabold text-amber-900 mb-1.5">💼 인턴 · 수련 · 취업처 요약</div>
                    <p class="text-gray-600 mb-1.5"><strong>진입 루트:</strong> ${escapeHtml(field.career.internAndTraining)}</p>
                    <p class="text-gray-600"><strong>필수·우대:</strong> ${escapeHtml(field.career.qualifications)}</p>
                </div>
            </div>
        </div>
    `;

    const actions = document.getElementById('field-detail-actions');
    if (actions) {
        actions.innerHTML = `
            <button type="button" onclick="jumpFromField('${escapeHtml(field.id)}', 'practicum')" class="flex-1 py-2.5 px-3 rounded-xl bg-camping-green text-white font-bold text-xs hover:bg-[#3f5a3b] transition cursor-pointer">🎒 이 분야 실습 정보 보기</button>
            <button type="button" onclick="jumpFromField('${escapeHtml(field.id)}', 'jobs')" class="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition cursor-pointer">💼 취업처 · 공고 보기</button>
            <button type="button" onclick="jumpFromField('${escapeHtml(field.id)}', 'news')" class="flex-1 py-2.5 px-3 rounded-xl bg-white text-camping-text border border-camping-beige font-bold text-xs hover:bg-gray-50 transition cursor-pointer">📰 관련 시사 보기</button>
        `;
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    });
}

export function closeFieldDetailModal() {
    const modal = document.getElementById('field-detail-modal');
    const content = document.getElementById('field-detail-modal-content');
    if (!modal || !content) return;
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

export function jumpFromField(fieldId, targetView) {
    closeFieldDetailModal();
    if (onNavigateCallback) {
        const opts = targetView === 'jobs' ? { fieldId, trackFilter: '전체' } : { fieldId };
        onNavigateCallback(targetView, opts);
    }
}
