import {
    REGION_GROUPS,
    getRegionGroup,
    WELFARE_FIELDS,
    PRACTICUM_CHECKLIST_ITEMS,
    PRACTICUM_DIAGNOSIS_QUESTIONS,
    PRACTICUM_RECRUITMENT_POSTINGS,
    SEOUL_DISTRICTS,
    GYEONGGI_CITIES,
    OFFICIAL_PORTALS,
    getFieldById
} from '../data/welfare-taxonomy.js';
import {
    getWorkspace,
    getChecklistState,
    toggleChecklistItem,
    isFieldBookmarked,
    toggleFieldBookmark,
    saveDiagnosisResult,
    addSavedAgency
} from './storage.js';
import { escapeHtml } from './utils.js';

let selectedPracticumFieldFilter = '전체';
let selectedAvailabilityFilter = '전체';
let selectedPracticumTermFilter = '전체';
let selectedPracticumPostingFieldFilter = '전체';
let selectedPracticumRegionGroup = '전체'; // '전체', '수도권', '영남권', '충청권', '호남권', '강원권', '제주권'
let selectedPracticumRegion = '전체'; // '전체', '서울', '경기'
let selectedPracticumSubRegion = '전체'; // '전체' or specific district/city
let selectedPracticumFeeFilter = '전체'; // '전체', '0', '50000', '100000'
let currentPracticumPage = 1;
const PRACTICUM_ITEMS_PER_PAGE = 10;
let practicumSearchKeyword = '';
let diagnosisDraftAnswers = {};
let onNavigateCallback = null;
let selectedPracticumSubTab = 'postings'; // 'postings', 'diagnosis', 'guide', 'checklist', 'all'


export function updatePracticumSubTabUI() {
    const selectEl = document.getElementById('practicum-subtab-select');
    if (selectEl) {
        selectEl.value = selectedPracticumSubTab;
    }

    document.querySelectorAll('.practicum-subtab-pill').forEach((btn) => {
        const isActive = btn.dataset.subtab === selectedPracticumSubTab;
        if (isActive) {
            btn.className = 'practicum-subtab-pill px-3 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs cursor-default flex items-center gap-1 transition';
        } else {
            btn.className = 'practicum-subtab-pill px-3 py-1.5 rounded-full text-xs font-bold bg-camping-bg/60 text-camping-subtext hover:bg-emerald-50 hover:text-camping-green border border-camping-beige/70 cursor-pointer flex items-center gap-1 transition';
        }
    });

    const postingsEl = document.getElementById('practicum-recruitment-container');
    const portalsEl = document.getElementById('practicum-portals-container');
    const guideBannerEl = document.getElementById('practicum-postings-guide-banner');
    const diagnosisEl = document.getElementById('practicum-diagnosis-container');
    const cardsSectionEl = document.getElementById('practicum-cards-section');
    const checklistEl = document.getElementById('practicum-checklist-container');

    const showPostings = selectedPracticumSubTab === 'postings' || selectedPracticumSubTab === 'all';
    const showDiagnosis = selectedPracticumSubTab === 'diagnosis' || selectedPracticumSubTab === 'all';
    const showGuide = selectedPracticumSubTab === 'guide' || selectedPracticumSubTab === 'all';
    const showChecklist = selectedPracticumSubTab === 'checklist' || selectedPracticumSubTab === 'all';

    if (postingsEl) postingsEl.classList.toggle('hidden', !showPostings);
    if (portalsEl) portalsEl.classList.toggle('hidden', !showPostings);
    if (guideBannerEl) guideBannerEl.classList.toggle('hidden', !showPostings);
    if (diagnosisEl) diagnosisEl.classList.toggle('hidden', !showDiagnosis);
    if (cardsSectionEl) cardsSectionEl.classList.toggle('hidden', !showGuide);
    if (checklistEl) checklistEl.classList.toggle('hidden', !showChecklist);
}

export function setPracticumSubTab(subTab, scrollToTop = false) {
    selectedPracticumSubTab = subTab || 'postings';
    updatePracticumSubTabUI();
    if (scrollToTop) {
        const viewEl = document.getElementById('view-practicum');
        if (viewEl) {
            viewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

export function jumpToPracticumPostingField(fieldId) {
    selectedPracticumPostingFieldFilter = fieldId || '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
    setPracticumSubTab('postings', true);
}

export function setPracticumNavigator(callback) {
    onNavigateCallback = callback;
}

export function setPracticumFieldFilter(fieldId) {
    selectedPracticumFieldFilter = fieldId || '전체';
    renderPracticumFieldCards();
    renderPracticumFieldPills();
}

export function setPracticumAvailabilityFilter(level) {
    selectedAvailabilityFilter = level || '전체';
    renderPracticumFieldCards();
}

export function selectDiagnosisAnswer(questionId, optionIndex) {
    diagnosisDraftAnswers[questionId] = optionIndex;
    renderDiagnosisWidget();
}

export function calculateAndSaveDiagnosis() {
    const missing = PRACTICUM_DIAGNOSIS_QUESTIONS.filter((q) => diagnosisDraftAnswers[q.id] === undefined);
    if (missing.length > 0) {
        alert(`아직 선택하지 않은 문항(${missing.length}개)이 있습니다. 4문항 모두 선택해 주세요!`);
        return;
    }

    const scoreMap = {};
    WELFARE_FIELDS.forEach((f) => {
        scoreMap[f.id] = 0;
    });

    PRACTICUM_DIAGNOSIS_QUESTIONS.forEach((q) => {
        const optIdx = diagnosisDraftAnswers[q.id];
        const opt = q.options[optIdx];
        if (opt && opt.scores) {
            Object.entries(opt.scores).forEach(([fid, pts]) => {
                scoreMap[fid] = (scoreMap[fid] || 0) + pts;
            });
        }
    });

    const ranked = Object.entries(scoreMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([fieldId, score]) => ({ fieldId, score }));

    saveDiagnosisResult({
        answers: { ...diagnosisDraftAnswers },
        topFields: ranked
    });

    renderDiagnosisWidget();
}

export function resetDiagnosis() {
    diagnosisDraftAnswers = {};
    saveDiagnosisResult({ answers: {}, topFields: [] });
    renderDiagnosisWidget();
}

export function renderDiagnosisWidget() {
    const container = document.getElementById('practicum-diagnosis-container');
    if (!container) return;

    const ws = getWorkspace();
    const saved = ws.diagnosisResult;
    if (saved && saved.answers && Object.keys(diagnosisDraftAnswers).length === 0) {
        diagnosisDraftAnswers = { ...saved.answers };
    }

    const topFields = saved?.topFields || [];
    const resultHtml = topFields.length
        ? `
            <div class="mt-5 p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div class="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                        <span>🎯</span> 나에게 어울리는 추천 실습·진로 분야 TOP 3
                    </div>
                    <button type="button" onclick="resetPracticumDiagnosis()" class="text-[11px] font-bold text-gray-500 hover:text-red-500 underline cursor-pointer">다시 진단하기</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    ${topFields
                        .map((item, idx) => {
                            const f = getFieldById(item.fieldId);
                            if (!f) return '';
                            const isSaved = isFieldBookmarked(f.id);
                            return `
                                <div class="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
                                    <div>
                                        <div class="flex items-center justify-between mb-1.5">
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-camping-green text-white">${idx + 1}순위 추천</span>
                                            <button type="button" onclick="togglePracticumBookmark('${escapeHtml(f.id)}')" class="text-sm cursor-pointer" title="찜하기">${isSaved ? '★' : '☆'}</button>
                                        </div>
                                        <div class="font-extrabold text-sm text-camping-text mb-1">${f.icon} ${escapeHtml(f.name)}</div>
                                        <p class="text-[11px] text-gray-600 leading-snug mb-2">${escapeHtml(f.practicum.recommendedFor)}</p>
                                    </div>
                                    <div class="flex flex-wrap gap-1.5 pt-2 border-t border-camping-beige/60 text-[11px]">
                                        <button type="button" onclick="jumpToPracticumPostingField('${escapeHtml(f.id)}')" class="flex-1 py-1.5 rounded-lg bg-camping-green text-white font-extrabold hover:bg-[#3f5a3b] transition cursor-pointer">📢 실습공고</button>
                                        <button type="button" onclick="setPracticumSubTab('guide', true); setPracticumFieldFilter('${escapeHtml(f.id)}')" class="flex-1 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition cursor-pointer">📚 가이드</button>
                                        <button type="button" onclick="jumpFromPracticum('${escapeHtml(f.id)}', 'jobs')" class="flex-1 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-bold hover:bg-amber-600 hover:text-white transition cursor-pointer">💼 취업처</button>
                                    </div>
                                </div>
                            `;
                        })
                        .join('')}
                </div>
            </div>
        `
        : '';

    container.innerHTML = `
        <div class="bg-white p-5 sm:p-6 rounded-3xl border border-camping-beige shadow-sm mb-8">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                <div class="flex items-center gap-2">
                    <span class="text-lg">🧭</span>
                    <span class="text-amber-950 font-black">현재 화면: <strong>STEP 1. 나에게 맞는 실습 분야 자가진단 (4문항)</strong></span>
                </div>
                <button type="button" onclick="setPracticumSubTab('postings', true)" class="px-3.5 py-1.5 bg-camping-green text-white font-extrabold rounded-full hover:bg-[#3f5a3b] transition cursor-pointer text-xs flex items-center gap-1 shadow-2xs">
                    <span>📢</span> 2026 실습생 모집 공고 &amp; DB 보러가기 ↗
                </button>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                    <h3 class="font-extrabold text-lg text-camping-text flex items-center gap-2">
                        <span>🧭</span> STEP 1. 나에게 맞는 실습 분야 자가진단 (4문항)
                    </h3>
                    <p class="text-xs text-camping-subtext mt-0.5">관심 대상 · 희망 환경 · 강점 · 졸업 후 목표를 고르면 12대 분야 중 가장 적합한 실습 트랙을 매칭해 드립니다.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                ${PRACTICUM_DIAGNOSIS_QUESTIONS.map((q) => {
                    const chosenIdx = diagnosisDraftAnswers[q.id];
                    return `
                        <div class="p-4 rounded-2xl bg-camping-bg/40 border border-camping-beige/80">
                            <div class="font-bold text-xs sm:text-sm text-camping-text mb-2.5">${escapeHtml(q.title)}</div>
                            <div class="flex flex-col gap-1.5">
                                ${q.options
                                    .map((opt, idx) => {
                                        const selected = chosenIdx === idx;
                                        return `
                                            <button type="button" onclick="selectPracticumAnswer('${escapeHtml(q.id)}', ${idx})" class="text-left px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${selected ? 'bg-camping-green text-white border-camping-green font-bold shadow-2xs' : 'bg-white text-camping-text border-camping-beige hover:border-camping-green/60'}">
                                                ${selected ? '● ' : '○ '}${escapeHtml(opt.label)}
                                            </button>
                                        `;
                                    })
                                    .join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span class="text-xs text-camping-subtext">진단 결과는 내 브라우저(내 준비함)에 자동 저장됩니다.</span>
                <button type="button" onclick="submitPracticumDiagnosis()" class="px-5 py-2.5 rounded-full bg-camping-green text-white font-extrabold text-xs sm:text-sm hover:bg-[#3f5a3b] shadow-sm transition cursor-pointer">
                    🎯 나에게 맞는 실습 분야 추천받기
                </button>
            </div>

            ${resultHtml}
        </div>
    `;
}

function renderPracticumFieldPills() {
    const container = document.getElementById('practicum-field-filters');
    if (!container) return;

    const allBtn = `<button type="button" onclick="setPracticumFieldFilter('전체')" class="px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${selectedPracticumFieldFilter === '전체' ? 'bg-camping-green text-white border-camping-green shadow-2xs' : 'bg-white text-camping-text border-camping-beige hover:bg-gray-50'}">전체 12대 분야</button>`;

    const fieldBtns = WELFARE_FIELDS.map((f) => {
        const active = selectedPracticumFieldFilter === f.id;
        return `<button type="button" onclick="setPracticumFieldFilter('${escapeHtml(f.id)}')" class="px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${active ? 'bg-camping-green text-white border-camping-green shadow-2xs' : 'bg-white text-camping-text border-camping-beige hover:bg-gray-50'}">${f.icon} ${escapeHtml(f.shortName)}</button>`;
    }).join('');

    container.innerHTML = allBtn + fieldBtns;
}

export function renderPracticumFieldCards() {
    const container = document.getElementById('practicum-cards-container');
    if (!container) return;

    const filtered = WELFARE_FIELDS.filter((f) => {
        if (selectedPracticumFieldFilter !== '전체' && f.id !== selectedPracticumFieldFilter) {
            return false;
        }
        if (selectedAvailabilityFilter === 'active' && !f.practicum.availability.includes('활발')) {
            return false;
        }
        if (selectedAvailabilityFilter === 'competitive' && !(f.practicum.availability.includes('경쟁') || f.practicum.availability.includes('제한'))) {
            return false;
        }
        if (selectedAvailabilityFilter === 'intern' && !f.practicum.availability.includes('인턴')) {
            return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-14 text-gray-400 border border-dashed border-camping-beige rounded-3xl bg-white">조건에 맞는 분야 실습 정보가 없습니다. 필터를 '전체'로 돌려보세요.</div>`;
        return;
    }

    container.innerHTML = filtered
        .map((f) => {
            const isSaved = isFieldBookmarked(f.id);
            return `
                <div class="bg-white p-5 rounded-3xl border border-camping-beige shadow-sm hover:shadow-md transition flex flex-col h-full">
                    <div class="flex items-start justify-between gap-2 mb-2.5">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${f.icon}</span>
                            <div>
                                <h4 class="font-extrabold text-base text-camping-text">${escapeHtml(f.name)}</h4>
                                <span class="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${f.practicum.availabilityBadge}">실습 접근성: ${escapeHtml(f.practicum.availability)}</span>
                            </div>
                        </div>
                        <button type="button" onclick="togglePracticumBookmark('${escapeHtml(f.id)}')" class="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition cursor-pointer ${isSaved ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-500'}" title="관심 분야 찜하기">
                            ${isSaved ? '★' : '☆'}
                        </button>
                    </div>

                    <p class="text-xs text-camping-green font-bold bg-emerald-50/70 px-3 py-2 rounded-xl mb-3">
                        💡 추천 대상: ${escapeHtml(f.practicum.recommendedFor)}
                    </p>

                    <div class="space-y-2.5 text-xs flex-grow mb-4">
                        <div>
                            <div class="font-extrabold text-camping-text mb-1">📋 실습 중 주요 과업 · 일과</div>
                            <ul class="space-y-1 text-gray-600">
                                ${f.practicum.dailyTasks.map((t) => `<li>• ${escapeHtml(t)}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-camping-bg/40 p-2.5 rounded-xl space-y-1">
                            <div><strong class="text-camping-text">📚 선행과목 · 준비:</strong> <span class="text-gray-600">${escapeHtml(f.practicum.prerequisites)}</span></div>
                            <div><strong class="text-camping-text">📅 모집 시기:</strong> <span class="text-gray-600">${escapeHtml(f.practicum.timing)}</span></div>
                        </div>
                        <div class="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-gray-700">
                            <strong>✨ 합격 · 실무 팁:</strong> ${escapeHtml(f.practicum.tips)}
                        </div>
                    </div>

                    <div class="pt-3 border-t border-camping-beige/60 flex flex-wrap gap-1.5 text-[11px]">
                        <button type="button" onclick="jumpToPracticumPostingField('${escapeHtml(f.id)}')" class="py-1.5 px-2 rounded-xl bg-camping-green text-white font-black hover:bg-[#3f5a3b] transition cursor-pointer" title="해당 분야 실습 공고 보기">📢 실습공고</button>
                        <button type="button" onclick="promptSavePracticumAgency('${escapeHtml(f.id)}')" class="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-100 transition cursor-pointer">➕ 실습기관 메모</button>
                        <button type="button" onclick="jumpFromPracticum('${escapeHtml(f.id)}', 'fields')" class="py-1.5 px-2 rounded-xl bg-camping-bg text-camping-text font-bold hover:bg-gray-200 transition cursor-pointer">📜 법령</button>
                        <button type="button" onclick="jumpFromPracticum('${escapeHtml(f.id)}', 'jobs')" class="py-1.5 px-2 rounded-xl bg-amber-50 text-amber-800 font-bold hover:bg-amber-600 hover:text-white transition cursor-pointer">💼 취업처</button>
                    </div>
                </div>
            `;
        })
        .join('');
}

export function renderPracticumChecklistAndPortals() {
    const checklistContainer = document.getElementById('practicum-checklist-container');
    const portalContainer = document.getElementById('practicum-portals-container');

    if (checklistContainer) {
        const state = getChecklistState();
        const doneCount = PRACTICUM_CHECKLIST_ITEMS.filter((item) => Boolean(state[item.id])).length;
        const total = PRACTICUM_CHECKLIST_ITEMS.length;
        const pct = Math.round((doneCount / total) * 100);

        checklistContainer.innerHTML = `
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-camping-beige shadow-sm">
                <div class="mb-5 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">📋</span>
                        <span class="text-indigo-950 font-black">현재 화면: <strong>STEP 3. 사회복지현장실습 법정 요건 &amp; 준비 체크리스트</strong></span>
                    </div>
                    <button type="button" onclick="setPracticumSubTab('postings', true)" class="px-3.5 py-1.5 bg-camping-green text-white font-extrabold rounded-full hover:bg-[#3f5a3b] transition cursor-pointer text-xs flex items-center gap-1 shadow-2xs">
                        <span>📢</span> 2026 실습생 모집 공고 &amp; DB 보러가기 ↗
                    </button>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                        <h3 class="font-extrabold text-lg text-camping-text flex items-center gap-2">
                            <span>✅</span> STEP 3. 사회복지현장실습 법정 요건 &amp; 준비 체크리스트
                        </h3>
                        <p class="text-xs text-camping-subtext mt-0.5">「사회복지사업법 시행규칙」 기준 (160시간 + 세미나 30시간 · 개인 진행률 자동 저장)</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">${doneCount} / ${total} 완료 (${pct}%)</span>
                    </div>
                </div>

                <div class="w-full h-2.5 bg-camping-bg rounded-full overflow-hidden mb-4 border border-camping-beige">
                    <div class="h-full bg-camping-green transition-all duration-300" style="width: ${pct}%"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    ${PRACTICUM_CHECKLIST_ITEMS.map((item) => {
                        const checked = Boolean(state[item.id]);
                        return `
                            <button type="button" role="checkbox" aria-checked="${checked}" onclick="togglePracticumChecklist('${escapeHtml(item.id)}')" class="w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${checked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-camping-bg/30 border-camping-beige hover:border-camping-green/60'}">
                                <span class="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold flex-shrink-0 ${checked ? 'bg-camping-green text-white border-camping-green' : 'bg-white border-gray-300 text-transparent'}">✓</span>
                                <div class="text-xs">
                                    <span class="inline-block text-[10px] font-extrabold text-camping-green mb-0.5">${escapeHtml(item.step)}</span>
                                    <div class="font-bold text-camping-text ${checked ? 'line-through opacity-70' : ''}">${escapeHtml(item.title)}</div>
                                    <p class="text-[11px] text-gray-500 mt-1 leading-snug">${escapeHtml(item.detail)}</p>
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    if (portalContainer) {
        portalContainer.innerHTML = `
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-camping-beige shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                        <h3 class="font-extrabold text-base sm:text-lg text-camping-text flex items-center gap-2">
                            <span>🔍</span> 공식 실습기관 조회 · 모집 공고 포털 바로가기
                        </h3>
                        <p class="text-xs text-camping-subtext mt-0.5">실습 신청 전 한국사회복지사협회에서 ‘보건복지부 선정 실습기관’ 여부를 반드시 먼저 조회하세요.</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    ${OFFICIAL_PORTALS.practicum
                        .map(
                            (p) => `
                            <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="p-3.5 rounded-2xl bg-camping-bg/50 border border-camping-beige hover:border-camping-green hover:bg-emerald-50/50 transition flex flex-col justify-between group">
                                <div>
                                    <div class="font-extrabold text-camping-text group-hover:text-camping-green flex items-center justify-between gap-1">
                                        <span>${escapeHtml(p.name)}</span>
                                        <span>↗</span>
                                    </div>
                                    <p class="text-[11px] text-gray-500 mt-1 leading-snug">${escapeHtml(p.desc)}</p>
                                </div>
                            </a>
                        `
                        )
                        .join('')}
                </div>
            </div>
        `;
    }
}

export function togglePracticumChecklistAndRender(itemId) {
    toggleChecklistItem(itemId);
    renderPracticumChecklistAndPortals();
}

export function togglePracticumBookmarkAndRender(fieldId) {
    toggleFieldBookmark(fieldId);
    renderDiagnosisWidget();
    renderPracticumFieldCards();
}

export function promptSavePracticumAgency(fieldId) {
    const field = getFieldById(fieldId);
    const agencyName = prompt(`[${field?.name || '현장실습'}] 내 준비함에 저장할 희망 실습 기관명을 입력하세요:\n(예: ○○종합사회복지관, ○○대학병원 사회사업팀)`);
    if (!agencyName || !agencyName.trim()) return;
    const memo = prompt(`'${agencyName.trim()}' 관련 메모 (모집시기, 위치, 요구사항 등)를 간단히 남겨보세요 (선택사항):`, '');
    addSavedAgency({
        fieldId,
        name: agencyName.trim(),
        track: '현장실습',
        memo: memo || ''
    });
    alert(`'${agencyName.trim()}'이(가) 상단 [내 준비함]에 저장되었습니다! 🎒`);
}

export function setPracticumTermFilter(term) {
    selectedPracticumTermFilter = term || '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
}

export function setPracticumPostingFieldFilter(fieldId) {
    selectedPracticumPostingFieldFilter = fieldId || '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
}

export function setPracticumRegionGroup(rgKey) {
    selectedPracticumRegionGroup = rgKey || '전체';
    selectedPracticumSubRegion = '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
}

export function setPracticumRegion(region) {
    selectedPracticumRegion = region || '전체';
    selectedPracticumSubRegion = '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
}

export function setPracticumSubRegion(subRegion) {
    selectedPracticumSubRegion = subRegion || '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
}

export function setPracticumFeeFilter(feeKey) {
    selectedPracticumFeeFilter = feeKey || '전체';
    currentPracticumPage = 1;
    renderPracticumPostings();
}

export function setPracticumPage(page) {
    currentPracticumPage = page;
    renderPracticumPostings();
    const container = document.getElementById('practicum-recruitment-container');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

let practicumSearchTimer = null;

export function resetPracticumPostingsFilters() {
    clearTimeout(practicumSearchTimer);
    selectedPracticumTermFilter = '전체';
    selectedPracticumPostingFieldFilter = '전체';
    selectedPracticumRegion = '전체';
    selectedPracticumRegionGroup = '전체';
    selectedPracticumSubRegion = '전체';
    selectedPracticumFeeFilter = '전체';
    practicumSearchKeyword = '';
    currentPracticumPage = 1;
    const inp = document.getElementById('practicum-search-input');
    if (inp) inp.value = '';
    renderPracticumPostings();
}

export function handlePracticumSearch(keyword, immediate = false) {
    clearTimeout(practicumSearchTimer);
    const update = () => {
        practicumSearchKeyword = String(keyword || '').trim().toLowerCase();
        currentPracticumPage = 1;
        renderPracticumPostings();
    };
    if (immediate) {
        update();
    } else {
        practicumSearchTimer = setTimeout(update, 120);
    }
}

export function setPracticumQuickKeyword(keyword) {
    const nextKeyword = (practicumSearchKeyword === keyword ? '' : keyword);
    const inp = document.getElementById('practicum-search-input');
    if (inp) inp.value = nextKeyword;
    handlePracticumSearch(nextKeyword, true);
}

export function savePracticumPostingToWorkspace(postingId) {
    const posting = PRACTICUM_RECRUITMENT_POSTINGS.find((p) => p.id === postingId);
    if (!posting) return;
    addSavedAgency({
        fieldId: posting.fieldId,
        name: posting.institution,
        track: posting.term,
        memo: `[실습처] ${posting.period} | ${posting.fee} (${posting.feeNote}) | 마감: ${posting.deadline}`
    });
    alert(`[${posting.institution}] 실습처가 [내 준비함]에 저장되었습니다! ⭐`);
}

function calcPracticumDDay(deadlineStr) {
    if (!deadlineStr) return { text: '상시모집', badgeClass: 'bg-teal-50 text-teal-800 border-teal-200', isExpired: false };
    const target = new Date(deadlineStr);
    if (isNaN(target.getTime())) return { text: deadlineStr, badgeClass: 'bg-gray-100 text-gray-600', isExpired: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: '마감됨', badgeClass: 'bg-gray-100 text-gray-400 border-gray-200 line-through', isExpired: true };
    if (diff === 0) return { text: '🚨 오늘마감', badgeClass: 'bg-red-500 text-white font-black animate-pulse shadow-sm', isExpired: false };
    if (diff <= 3) return { text: `🔥 D-${diff}`, badgeClass: 'bg-rose-500 text-white font-black shadow-sm', isExpired: false };
    if (diff <= 7) return { text: `⏳ D-${diff}`, badgeClass: 'bg-amber-500 text-white font-extrabold shadow-2xs', isExpired: false };
    return { text: `📅 D-${diff}`, badgeClass: 'bg-emerald-600 text-white font-extrabold shadow-2xs', isExpired: false };
}

function renderPaginationBar(currentPage, totalPages) {
    if (totalPages <= 1) return '';

    let pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;

    const pageButtons = pages.map((p) => {
        if (p === '...') {
            return `<span class="px-2 py-1 text-xs text-gray-400 select-none">…</span>`;
        }
        const active = p === currentPage;
        const cls = active
            ? 'w-8 h-8 rounded-xl text-xs font-black bg-camping-green text-white shadow-2xs cursor-default flex items-center justify-center'
            : 'w-8 h-8 rounded-xl text-xs font-bold bg-white text-camping-text hover:bg-emerald-50 border border-camping-beige transition cursor-pointer flex items-center justify-center';
        return `<button type="button" onclick="setPracticumPage(${p})" class="${cls}">${p}</button>`;
    }).join('');

    return `
        <div class="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button type="button" onclick="setPracticumPage(${currentPage - 1})" ${prevDisabled ? 'disabled' : ''} class="px-3 py-1.5 rounded-xl text-xs font-bold border transition ${prevDisabled ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-camping-text border-camping-beige hover:bg-emerald-50 cursor-pointer'}">
                ◀ 이전
            </button>
            <div class="flex items-center gap-1 sm:gap-1.5">
                ${pageButtons}
            </div>
            <button type="button" onclick="setPracticumPage(${currentPage + 1})" ${nextDisabled ? 'disabled' : ''} class="px-3 py-1.5 rounded-xl text-xs font-bold border transition ${nextDisabled ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-camping-text border-camping-beige hover:bg-emerald-50 cursor-pointer'}">
                다음 ▶
            </button>
        </div>
    `;
}

export function renderPracticumPostings() {
    const container = document.getElementById('practicum-recruitment-container');
    if (!container) return;

    // Filter logic
    const filtered = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => {
        // 0. 마감일 지난 공고 자동 제외 (현재 시점 기준 지난 공고는 100% 자동 숨김)
        if (p.deadline) {
            const dday = calcPracticumDDay(p.deadline);
            if (dday.isExpired) return false;
        }

        // Season / term (학기)
        if (selectedPracticumTermFilter !== '전체') {
            const keyword = selectedPracticumTermFilter.includes('동계') ? '동계' : '학기중';
            if (!p.term.includes(keyword)) return false;
        }
        // Welfare field
        if (selectedPracticumPostingFieldFilter !== '전체' && p.fieldId !== selectedPracticumPostingFieldFilter) {
            return false;
        }
        // 8대 거점 지역 필터 ('전체', '서울', '경기', '인천', '영남권', '충청권', '호남권', '강원권', '제주권')
        if (selectedPracticumRegionGroup !== '전체') {
            if (['서울', '경기', '인천'].includes(selectedPracticumRegionGroup)) {
                if (p.region !== selectedPracticumRegionGroup) return false;
            } else {
                const rg = p.regionGroup || getRegionGroup(p.region);
                if (rg !== selectedPracticumRegionGroup) return false;
            }
        }
        // 세부 시·도 / 시·군·구 (SubRegion)
        if (selectedPracticumSubRegion !== '전체') {
            const matchRegion = p.region === selectedPracticumSubRegion;
            const matchSub = p.subRegion === selectedPracticumSubRegion;
            const matchLoc = p.location && p.location.includes(selectedPracticumSubRegion);
            if (!matchRegion && !matchSub && !matchLoc) return false;
        }
        // Search keyword
        if (practicumSearchKeyword) {
            const hay = `${p.institution} ${p.formerName || ''} ${p.renameNote || ''} ${p.fieldName} ${p.term} ${p.location} ${p.requirements} ${p.process} ${p.memo} ${p.subRegion || ''} ${p.supervisors || ''} ${p.facilityType || ''}`.toLowerCase();
            if (!hay.includes(practicumSearchKeyword)) return false;
        }
        return true;
    });

    // Pagination calculations
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PRACTICUM_ITEMS_PER_PAGE));
    if (currentPracticumPage > totalPages) currentPracticumPage = totalPages;
    if (currentPracticumPage < 1) currentPracticumPage = 1;

    const startIdx = (currentPracticumPage - 1) * PRACTICUM_ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + PRACTICUM_ITEMS_PER_PAGE, totalItems);
    const pagedItems = filtered.slice(startIdx, endIdx);

    // 8대 지역 버튼 & 세부 시·도/시군구 드롭다운
    const regionGroups = [
        { id: '전체', label: '🌐 전국 전체' },
        { id: '서울', label: '📍 서울' },
        { id: '경기', label: '📍 경기' },
        { id: '인천', label: '📍 인천' },
        { id: '영남권', label: '🌊 영남권' },
        { id: '충청권', label: '🏛️ 충청권' },
        { id: '호남권', label: '🌾 호남권' },
        { id: '강원권', label: '🌲 강원권' },
        { id: '제주권', label: '🌴 제주권' }
    ];

    const regionGroupBtnsHtml = regionGroups.map((rg) => {
        const active = selectedPracticumRegionGroup === rg.id;
        let count = PRACTICUM_RECRUITMENT_POSTINGS.length;
        if (rg.id !== '전체') {
            if (['서울', '경기', '인천'].includes(rg.id)) {
                count = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === rg.id).length;
            } else {
                count = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => (p.regionGroup || getRegionGroup(p.region)) === rg.id).length;
            }
        }
        const cls = active
            ? 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs transition cursor-pointer'
            : 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50 transition cursor-pointer';
        return `<button type="button" onclick="setPracticumRegionGroup('${escapeHtml(rg.id)}')" class="${cls}">${escapeHtml(rg.label)} <span class="opacity-80">(${count.toLocaleString()})</span></button>`;
    }).join('');

    // 시·도 및 시군구 옵션 생성 헬퍼
    const makeProvinceOptions = (provName, provLabel) => {
        const provPostings = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === provName);
        if (provPostings.length === 0) return '';
        const subs = Array.from(new Set(provPostings.map((p) => p.subRegion).filter(Boolean))).sort();
        const subOpts = subs.map((sub) => {
            const count = provPostings.filter((p) => p.subRegion === sub).length;
            const isSel = selectedPracticumSubRegion === sub ? 'selected' : '';
            return `<option value="${escapeHtml(sub)}" ${isSel}>${escapeHtml(provName)} ${escapeHtml(sub)} (${count}건)</option>`;
        }).join('');
        const isProvSel = selectedPracticumSubRegion === provName ? 'selected' : '';
        return `
            <optgroup label="${escapeHtml(provLabel || provName)} (${provPostings.length}건)">
                <option value="${escapeHtml(provName)}" ${isProvSel}>${escapeHtml(provLabel || provName)} 전체 (${provPostings.length}건)</option>
                ${subOpts}
            </optgroup>
        `;
    };

    let subRegionSelectHtml = '';
    if (selectedPracticumRegionGroup === '전체') {
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🏛️ 세부지역:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>🌐 전국 17개 시·도 상세구역 전체 (${PRACTICUM_RECRUITMENT_POSTINGS.length.toLocaleString()}건)</option>
                    ${makeProvinceOptions('서울', '서울특별시')}
                    ${makeProvinceOptions('경기', '경기도')}
                    ${makeProvinceOptions('인천', '인천광역시')}
                    ${makeProvinceOptions('부산', '부산광역시')}
                    ${makeProvinceOptions('대구', '대구광역시')}
                    ${makeProvinceOptions('울산', '울산광역시')}
                    ${makeProvinceOptions('경남', '경상남도')}
                    ${makeProvinceOptions('경북', '경상북도')}
                    ${makeProvinceOptions('대전', '대전광역시')}
                    ${makeProvinceOptions('세종', '세종특별자치시')}
                    ${makeProvinceOptions('충남', '충청남도')}
                    ${makeProvinceOptions('충북', '충청북도')}
                    ${makeProvinceOptions('광주', '광주광역시')}
                    ${makeProvinceOptions('전북', '전북특별자치도')}
                    ${makeProvinceOptions('전남', '전라남도')}
                    ${makeProvinceOptions('강원', '강원특별자치도')}
                    ${makeProvinceOptions('제주', '제주특별자치도')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '서울') {
        const seoulCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === '서울').length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🏛️ 서울 자치구:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>📍 서울특별시 전체 (${seoulCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('서울', '서울특별시')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '경기') {
        const gyeonggiCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === '경기').length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🌳 경기 시·군:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>📍 경기도 전체 (${gyeonggiCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('경기', '경기도')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '인천') {
        const incheonCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === '인천').length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">⚓ 인천 자치구:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>📍 인천광역시 전체 (${incheonCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('인천', '인천광역시')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '영남권') {
        const ynCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => ['부산', '대구', '울산', '경남', '경북'].includes(p.region)).length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🌊 영남권 구역:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>🌊 영남권 전체 (${ynCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('부산', '부산광역시')}
                    ${makeProvinceOptions('대구', '대구광역시')}
                    ${makeProvinceOptions('울산', '울산광역시')}
                    ${makeProvinceOptions('경남', '경상남도')}
                    ${makeProvinceOptions('경북', '경상북도')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '충청권') {
        const ccCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => ['대전', '세종', '충남', '충북'].includes(p.region)).length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🏛️ 충청권 구역:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>🏛️ 충청권 전체 (${ccCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('대전', '대전광역시')}
                    ${makeProvinceOptions('세종', '세종특별자치시')}
                    ${makeProvinceOptions('충남', '충청남도')}
                    ${makeProvinceOptions('충북', '충청북도')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '호남권') {
        const hnCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => ['광주', '전북', '전남'].includes(p.region)).length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🌾 호남권 구역:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>🌾 호남권 전체 (${hnCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('광주', '광주광역시')}
                    ${makeProvinceOptions('전북', '전북특별자치도')}
                    ${makeProvinceOptions('전남', '전라남도')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '강원권') {
        const gwCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === '강원').length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🌲 강원권 시·군:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>🌲 강원권 전체 (${gwCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('강원', '강원특별자치도')}
                </select>
            </div>
        `;
    } else if (selectedPracticumRegionGroup === '제주권') {
        const jjCount = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => p.region === '제주').length;
        subRegionSelectHtml = `
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-camping-text shrink-0">🌴 제주권 구역:</span>
                <select onchange="setPracticumSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
                    <option value="전체" ${selectedPracticumSubRegion === '전체' ? 'selected' : ''}>🌴 제주권 전체 (${jjCount.toLocaleString()}건)</option>
                    ${makeProvinceOptions('제주', '제주특별자치도')}
                </select>
            </div>
        `;
    }

    // Welfare Field Chips (검색 시 많은 수의 검색량이 나온 순으로 내림차순 정렬)
    const baseCandidatePostings = PRACTICUM_RECRUITMENT_POSTINGS.filter((p) => {
        if (p.deadline && calcPracticumDDay(p.deadline).isExpired) return false;
        if (selectedPracticumRegionGroup !== '전체') {
            if (['서울', '경기', '인천'].includes(selectedPracticumRegionGroup)) {
                if (p.region !== selectedPracticumRegionGroup) return false;
            } else {
                const rg = p.regionGroup || getRegionGroup(p.region);
                if (rg !== selectedPracticumRegionGroup) return false;
            }
        }
        if (selectedPracticumSubRegion !== '전체') {
            const matchRegion = p.region === selectedPracticumSubRegion;
            const matchSub = p.subRegion === selectedPracticumSubRegion;
            const matchLoc = p.location && p.location.includes(selectedPracticumSubRegion);
            if (!matchRegion && !matchSub && !matchLoc) return false;
        }
        if (practicumSearchKeyword) {
            const hay = `${p.institution} ${p.formerName || ''} ${p.renameNote || ''} ${p.fieldName} ${p.term} ${p.location} ${p.requirements} ${p.process} ${p.memo} ${p.subRegion || ''} ${p.supervisors || ''} ${p.facilityType || ''}`.toLowerCase();
            if (!hay.includes(practicumSearchKeyword)) return false;
        }
        return true;
    });

    const sortedFields = WELFARE_FIELDS.map((f) => {
        const count = baseCandidatePostings.filter((p) => p.fieldId === f.id).length;
        return {
            id: f.id,
            label: f.name.split('·')[0].trim(),
            icon: f.icon,
            count
        };
    }).sort((a, b) => b.count - a.count);

    const fieldChipsList = [
        { id: '전체', label: '전체 분야', icon: '🌐', count: baseCandidatePostings.length },
        ...sortedFields
    ];
    const fieldChipsHtml = fieldChipsList.map((item) => {
        const active = selectedPracticumPostingFieldFilter === item.id;
        const cls = active
            ? 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs cursor-pointer'
            : 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50 transition cursor-pointer';
        return `<button type="button" onclick="setPracticumPostingFieldFilter('${escapeHtml(item.id)}')" class="${cls}">${item.icon} ${escapeHtml(item.label)} <span class="opacity-75">(${item.count.toLocaleString()})</span></button>`;
    }).join('');

    // Check if any non-default filter is applied
    const isFiltered = selectedPracticumTermFilter !== '전체'
        || selectedPracticumPostingFieldFilter !== '전체'
        || selectedPracticumRegionGroup !== '전체'
        || selectedPracticumSubRegion !== '전체'
        || Boolean(practicumSearchKeyword);

    // Active filter tags
    const activeTags = [];
    if (selectedPracticumTermFilter !== '전체') {
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-800 font-bold">${escapeHtml(selectedPracticumTermFilter)} <button type="button" onclick="setPracticumTermFilter('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    }
    if (selectedPracticumRegionGroup !== '전체') {
        const regGroupLbl = selectedPracticumSubRegion !== '전체' ? `${selectedPracticumRegionGroup} > ${selectedPracticumSubRegion}` : selectedPracticumRegionGroup;
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-800 font-bold">📍 ${escapeHtml(regGroupLbl)} <button type="button" onclick="setPracticumRegionGroup('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    } else if (selectedPracticumSubRegion !== '전체') {
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-800 font-bold">📍 ${escapeHtml(selectedPracticumSubRegion)} <button type="button" onclick="setPracticumSubRegion('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    }

    if (selectedPracticumPostingFieldFilter !== '전체') {
        const fld = getFieldById(selectedPracticumPostingFieldFilter);
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-sky-100 text-sky-800 font-bold">${fld?.icon || '🏢'} ${escapeHtml(fld?.name?.split('·')[0] || selectedPracticumPostingFieldFilter)} <button type="button" onclick="setPracticumPostingFieldFilter('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    }
    if (practicumSearchKeyword) {
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-gray-200 text-gray-800 font-bold">🔍 "${escapeHtml(practicumSearchKeyword)}" <button type="button" onclick="handlePracticumSearch('')" class="hover:text-red-600 font-black">×</button></span>`);
    }

    // Cards HTML
    const cardsHtml = pagedItems.length === 0
        ? `
            <div class="col-span-full text-center py-12 text-gray-400 border border-dashed border-camping-beige rounded-3xl bg-white">
                <p class="text-sm font-bold text-gray-600 mb-2">선택하신 조건에 해당하는 실습 모집 공고가 없습니다.</p>
                <p class="text-xs text-gray-400 mb-4">지역, 분야 조건을 변경하거나 필터를 초기화해 보세요.</p>
                <button type="button" onclick="resetPracticumPostingsFilters()" class="px-4 py-2 rounded-xl bg-camping-green text-white font-bold text-xs hover:bg-[#3f5a3b] transition cursor-pointer">
                    🔄 필터 전체 초기화
                </button>
            </div>
        `
        : pagedItems.map((p) => {
            const field = getFieldById(p.fieldId);
            const dday = calcPracticumDDay(p.deadline);
            const isFree = p.fee.includes('무료') || p.feeAmount === 0;
            const feeBadgeCls = isFree
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black'
                : 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold';
            const termBadgeCls = p.term.includes('하계')
                ? 'bg-orange-50 text-orange-800 border-orange-200'
                : p.term.includes('동계')
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-purple-50 text-purple-800 border-purple-200';

            return `
                <div class="editorial-card bg-white dark:bg-[#161F30] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-lg hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-200 flex flex-col justify-between group">
                    <div>
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <div class="flex flex-wrap gap-1.5 items-center">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black border ${field?.badgeClass || 'bg-gray-100'}">${field?.icon || '🏢'} ${escapeHtml(p.fieldName)}</span>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${termBadgeCls}">${escapeHtml(p.term)}</span>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">📍 ${escapeHtml(p.location)}</span>
                            </div>
                            <span class="px-2.5 py-1 rounded-full text-[11px] font-black shrink-0 ${dday.badgeClass}">${dday.text}</span>
                        </div>

                        <h4 class="text-base sm:text-lg font-black text-camping-text group-hover:text-camping-green transition mb-3">
                            ${escapeHtml(p.institution)}
                        </h4>

                        <div class="grid grid-cols-2 gap-2 text-xs mb-3 bg-camping-bg/40 p-3 rounded-2xl border border-camping-beige/60">
                            <div>
                                <span class="text-gray-500 font-bold block text-[10px]">📅 실습 일정</span>
                                <span class="font-extrabold text-camping-text text-[11px]">${escapeHtml(p.period)}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 font-bold block text-[10px]">💰 실습비</span>
                                <span class="inline-block px-2 py-0.5 rounded-md text-[11px] border ${feeBadgeCls}">${escapeHtml(p.fee)} <span class="text-[10px] font-normal text-gray-600">(${escapeHtml(p.feeNote)})</span></span>
                            </div>
                            <div>
                                <span class="text-gray-500 font-bold block text-[10px]">👥 모집 인원</span>
                                <span class="font-extrabold text-camping-text text-[11px]">${escapeHtml(p.recruits)}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 font-bold block text-[10px]">⏳ 원서 마감</span>
                                <span class="font-extrabold text-camping-text text-[11px]">${escapeHtml(p.deadline)}</span>
                            </div>
                        </div>

                        <div class="space-y-1.5 text-xs text-gray-700 mb-2">
                            ${p.supervisors ? `<div><strong>🏛️ 법정 지도자:</strong> <span class="text-gray-800 font-semibold">${escapeHtml(p.supervisors)}</span></div>` : ''}
                            ${p.tel ? `<div><strong>📞 기관 문의처:</strong> <a href="tel:${escapeHtml(p.tel)}" class="text-camping-green font-bold hover:underline">${escapeHtml(p.tel)}</a> <span class="text-gray-400">|</span> <span class="text-gray-500">${escapeHtml(p.address || p.location)}</span></div>` : ''}
                        </div>
                    </div>

                    <div class="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
                        <a href="https://search.naver.com/search.naver?query=${encodeURIComponent(p.institution)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs text-center transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-blue-500/20 active:scale-98" title="${escapeHtml(p.institution)} 공식 홈페이지 검색">
                            <span>🌐</span> <span>기관 홈페이지 검색 ↗</span>
                        </a>
                        <button type="button" onclick="savePracticumPostingToWorkspace('${escapeHtml(p.id)}')" class="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-extrabold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition cursor-pointer active:scale-98" title="내 준비함에 실습처 저장">
                            ⭐ 실습처 찜
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    const paginationHtml = renderPaginationBar(currentPracticumPage, totalPages);

    const searchInput = document.getElementById('practicum-search-input');
    const cardsGrid = document.getElementById('practicum-cards-grid');
    const paginationWrap = document.getElementById('practicum-pagination-wrap');
    const resultsBarWrap = document.getElementById('practicum-results-bar-wrap');
    const fieldChipsWrap = document.getElementById('practicum-field-chips-wrap');
    const regionChipsWrap = document.getElementById('practicum-region-chips-wrap');
    const subRegionSelectWrap = document.getElementById('practicum-subregion-select-wrap');
    const quickKeywordsWrap = document.getElementById('practicum-quick-keywords-wrap');

    // 추천 검색어 태그 렌더링 헬퍼 (줄바꿈 방지 whitespace-nowrap 보장)
    const makeQuickKeywordsHtml = () => {
        const tags = [
            { label: '종합', text: '🏘️ 종합사회복지관', tip: '지역사회 3대 기능 중심 종합사회복지관 검색' },
            { label: '장애인', text: '♿ 장애인복지관', tip: '장애인 재활·자립 전문 복지관 검색' },
            { label: '노인', text: '👴 노인복지관', tip: '어르신 맞춤 돌봄·여가 복지관 검색' }
        ];
        return `
            <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="font-extrabold text-camping-text shrink-0 flex items-center gap-1">
                    <span>💡</span> <span>3대 복지관 빠른 검색:</span>
                </span>
                <div class="flex flex-wrap items-center gap-1.5">
                    ${tags.map((t) => {
                        const active = practicumSearchKeyword === t.label.toLowerCase();
                        const cls = active
                            ? 'whitespace-nowrap px-3 py-1 rounded-full bg-camping-green text-white font-black shadow-2xs transition cursor-pointer text-xs flex items-center gap-1'
                            : 'whitespace-nowrap px-3 py-1 rounded-full bg-gray-50 border border-camping-beige text-camping-text hover:border-camping-green hover:bg-emerald-50 hover:text-camping-green font-bold transition shadow-2xs cursor-pointer text-xs flex items-center gap-1';
                        return `<button type="button" onclick="setPracticumQuickKeyword('${t.label}')" class="${cls}" title="${t.tip}">${t.text}</button>`;
                    }).join('')}
                </div>
            </div>
        `;
    };

    // DOM 보존형 부분 갱신: 검색창 및 외부 껍데기가 이미 존재하면 입력 포커스/IME를 파괴하지 않고 카드 및 필터만 갱신
    if (searchInput && cardsGrid && paginationWrap && resultsBarWrap && fieldChipsWrap && regionChipsWrap && subRegionSelectWrap) {
        if (quickKeywordsWrap) {
            quickKeywordsWrap.innerHTML = makeQuickKeywordsHtml();
        }
        const clearBtn = document.getElementById('practicum-search-clear-btn');
        if (clearBtn) {
            clearBtn.style.display = practicumSearchKeyword ? 'inline-flex' : 'none';
        }
        cardsGrid.innerHTML = cardsHtml;
        paginationWrap.innerHTML = paginationHtml;
        resultsBarWrap.innerHTML = `
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-extrabold text-camping-text">
                    총 <span class="text-emerald-700">${totalItems.toLocaleString()}</span>개 실습 공고
                    <span class="text-gray-400 font-normal">(${totalItems > 0 ? `${startIdx + 1}~${endIdx}건 표시 중` : '0건'} · ${currentPracticumPage} / ${totalPages} 페이지)</span>
                </span>
                ${activeTags.join('')}
            </div>
            ${isFiltered ? `
                <button type="button" onclick="resetPracticumPostingsFilters()" class="text-[11px] font-bold text-gray-500 hover:text-red-500 flex items-center gap-1 cursor-pointer transition">
                    <span>🔄</span> 필터 전체 초기화
                </button>
            ` : ''}
        `;
        fieldChipsWrap.innerHTML = fieldChipsHtml;
        regionChipsWrap.innerHTML = regionGroupBtnsHtml;
        subRegionSelectWrap.innerHTML = subRegionSelectHtml;

        // 만약 검색창이 활성 포커스 상태가 아니면서 외부(필터 태그 등)에서 초기화된 경우 값 동기화
        if (document.activeElement !== searchInput && searchInput.value !== practicumSearchKeyword) {
            searchInput.value = practicumSearchKeyword;
        }
        return;
    }

    container.innerHTML = `
        <div class="bg-gradient-to-br from-amber-50/30 via-white to-emerald-50/40 p-5 sm:p-7 rounded-3xl border-2 border-camping-green/30 shadow-sm mb-8">
            <!-- 1. 헤더 타이틀 및 배너 -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
                <div>
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-2xl">❄️</span>
                        <h3 class="text-lg sm:text-xl font-black text-camping-text tracking-tight">
                            2026-2027 동계방학 실습생 모집 공고 &amp; 전국 법정 실습기관 전수 DB
                        </h3>
                        <span class="text-[11px] font-black bg-camping-green text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                            보건복지부 법정 선정 8,434개 전수
                        </span>
                    </div>
                    <p class="text-xs text-camping-subtext mt-1">
                        전국 8대 권역 8,434개 보건복지부 법정 선정기관 전수 수록! 2026-2027 동계방학 실습생 모집에 100% 집중하여 12대 분야별 실습처를 검색하세요.
                    </p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-200">
                        <span>❄️</span> 동계방학 집중
                    </span>
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span>🏛️</span> 법정 공인 100%
                    </span>
                </div>
            </div>

            <!-- 2. 시원하고 가시성 높은 검색창 카드 -->
            <div class="bg-white p-4 sm:p-5 rounded-2xl border-2 border-camping-green/30 shadow-xs mb-5 space-y-3">
                <div class="relative w-full">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
                    <input 
                        type="text" 
                        id="practicum-search-input" 
                        value="${escapeHtml(practicumSearchKeyword)}" 
                        oninput="handlePracticumSearch(this.value)" 
                        onkeydown="if(event.key==='Enter'){handlePracticumSearch(this.value, true);}"
                        placeholder="실습기관명, 지역(시·군·구), 지도자 성명, 분야 검색... (예: 하계, 노원구, 종합사회복지관, 장애인)" 
                        class="w-full pl-10 pr-10 py-3 rounded-xl border border-camping-beige text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-camping-green focus:ring-2 focus:ring-camping-green/20 transition shadow-inner"
                    >
                    <button 
                        type="button" 
                        id="practicum-search-clear-btn" 
                        onclick="handlePracticumSearch(''); const el = document.getElementById('practicum-search-input'); if(el) el.focus();" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white text-gray-500 text-xs font-bold items-center justify-center transition cursor-pointer"
                        style="display: ${practicumSearchKeyword ? 'inline-flex' : 'none'};"
                        title="검색어 지우기"
                    >✕</button>
                </div>
                <div id="practicum-quick-keywords-wrap" class="pt-1">
                    ${makeQuickKeywordsHtml()}
                </div>
            </div>

            <!-- 3. 필터 컨트롤 패널 (지역 & 분야 2대 핵심 축) -->
            <div class="bg-white/95 p-4 sm:p-5 rounded-2xl border border-camping-beige/80 shadow-2xs mb-5 space-y-4">
                <!-- 행 1: 📍 지역 필터 (8대 권역 버튼 + 17개 시도 세부구역 드롭다운) -->
                <div class="space-y-2.5 pb-4 border-b border-camping-beige/50">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xs font-extrabold text-camping-text flex items-center gap-1.5">
                            <span>📍</span> <span>지역 선택 (전국 8대 권역 및 17개 시·도 상세구역)</span>
                        </span>
                        <div id="practicum-subregion-select-wrap">
                            ${subRegionSelectHtml}
                        </div>
                    </div>
                    <div id="practicum-region-chips-wrap" class="flex flex-wrap items-center gap-1.5">
                        ${regionGroupBtnsHtml}
                    </div>
                </div>

                <!-- 행 2: 🏷️ 분야 필터 (검색량 순 정렬, 가로 스크롤바 없는 자연스러운 줄바꿈) -->
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-extrabold text-camping-text flex items-center gap-1.5">
                            <span>🏷️</span> <span>복지 분야 선택 (모집기관 많은 순 정렬)</span>
                        </span>
                        <span class="text-[11px] text-gray-400">클릭하여 특정 복지 분야 공고만 필터링할 수 있습니다</span>
                    </div>
                    <div id="practicum-field-chips-wrap" class="flex flex-wrap items-center gap-1.5">
                        ${fieldChipsHtml}
                    </div>
                </div>
            </div>

            <!-- 4. 한사협 전국 1만 개 공인 실습기관 즉시 조회 연계 배너 -->
            <div class="mb-5 p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
                <div class="flex items-center gap-2">
                    <span class="text-lg shrink-0">🏛️</span>
                    <span class="text-camping-text font-bold leading-relaxed">
                        찾으시는 특정 동네/시설 공고가 없으신가요? 
                        <span class="text-emerald-900 font-extrabold underline decoration-emerald-400">한국사회복지사협회 전국 10,000+ 법정 공인 실습기관 포털</span>에서 실시간으로 직접 검색하실 수 있습니다.
                    </span>
                </div>
                <a href="https://lic.welfare.net/lic/form/selectRecuritList.do" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition shadow-2xs flex items-center gap-1.5 shrink-0 text-xs cursor-pointer">
                    <span>한사협 1만 실습기관 즉시 조회 ↗</span>
                </a>
            </div>

            <!-- 5. 결과 카운트 및 활성 필터 태그 -->
            <div id="practicum-results-bar-wrap" class="flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-extrabold text-camping-text">
                        총 <span class="text-emerald-700">${totalItems.toLocaleString()}</span>개 실습 공고
                        <span class="text-gray-400 font-normal">(${totalItems > 0 ? `${startIdx + 1}~${endIdx}건 표시 중` : '0건'} · ${currentPracticumPage} / ${totalPages} 페이지)</span>
                    </span>
                    ${activeTags.join('')}
                </div>
                ${isFiltered ? `
                    <button type="button" onclick="resetPracticumPostingsFilters()" class="text-[11px] font-bold text-gray-500 hover:text-red-500 flex items-center gap-1 cursor-pointer transition">
                        <span>🔄</span> 필터 전체 초기화
                    </button>
                ` : ''}
            </div>

            <!-- 6. 공고 카드 그리드 (10개씩 페이지네이션) -->
            <div id="practicum-cards-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${cardsHtml}
            </div>

            <!-- 7. 페이지네이션 바 -->
            <div id="practicum-pagination-wrap">
                ${paginationHtml}
            </div>
        </div>
    `;
}
export function jumpFromPracticum(fieldId, targetView) {
    if (onNavigateCallback) {
        const opts = targetView === 'jobs' ? { fieldId, trackFilter: '전체' } : { fieldId };
        onNavigateCallback(targetView, opts);
    }
}

export function renderPracticumView() {
    renderDiagnosisWidget();
    renderPracticumFieldPills();
    renderPracticumFieldCards();
    renderPracticumPostings();
    renderPracticumChecklistAndPortals();
    updatePracticumSubTabUI();
}
