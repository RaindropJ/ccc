/**
 * 사회복지 현장의 이해 - 12대 분야별 인턴·수련·취업처 & 채용공고 관리 모듈 (수도권 150건 고품질 정예화)
 * - 4대 핵심 트랙 분리: [🎓 1년 전문수련 (40)] / [🌱 대학생·청년인턴 (50)] / [💼 신입·정규직 (35)] / [📋 사업전담·계약직 (25)]
 * - 수도권 3대 권역 집중: 서울 72건, 경기 54건, 인천 24건
 * - 카드 외부 링크(바로가기/원문검색) 전면 제거 -> 원클릭 [📄 상세 공고 & 전형 요강 모달] 자체 팝업
 * - 보조 2열 버튼: [🏢 잡플래닛] | [📍 지도위치]
 */

import { DEFAULT_JOB_POSTINGS } from '../data/default-jobs.js';
import { WELFARE_FIELDS, OFFICIAL_PORTALS, getFieldById, classifyJobToFieldId, classifyJobTrack } from '../data/welfare-taxonomy.js';
import {
    getWorkspace,
    setPersonalJobState,
    getPersonalJobState,
    getCustomJobs,
    upsertCustomJob,
    deleteCustomJob,
    addSavedAgency
} from './storage.js';
import { escapeHtml, normalizeHttpUrl } from './utils.js';

let publicJobs = [];
let currentJobFieldFilter = '전체'; // '전체' or fieldId
let currentJobTrackFilter = '전체'; // '전체' | '수련' | '인턴' | '신입·정규직' | '계약직' | 'tracked' | 'custom'
let selectedJobRegionGroup = '전체'; // '전체' | '서울' | '경기' | '인천' | '부산/경남' | '대구/경북' | '대전/충청' | '광주/전라' | '강원/제주'
let selectedJobSubRegion = '전체'; // '전체' | specific subRegion
let currentJobSearch = '';
let currentJobPage = 1;
const JOB_ITEMS_PER_PAGE = 12;

let onNavigateCallback = null;

export const statusBadgeMap = {
    '미지정': 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    '관심': 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    '서류준비': 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    '서류제출': 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    '면접': 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    '합격': 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    '불합격': 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
};

export function setJobsNavigator(callback) {
    onNavigateCallback = callback;
}

export function setJobsData(jobs) {
    publicJobs = Array.isArray(jobs) ? jobs : [];
}

function getMergedJobs() {
    const defaultMap = new Map(DEFAULT_JOB_POSTINGS.map((j) => [j.id, j]));
    const pubList = [];

    if (Array.isArray(publicJobs) && publicJobs.length > 0) {
        publicJobs.forEach((pj) => {
            if (defaultMap.has(pj.id)) {
                // Ensure curated 150 details and modal fields are always preserved
                pubList.push({ ...pj, ...defaultMap.get(pj.id) });
                defaultMap.delete(pj.id);
            } else if (pj.id && (String(pj.id).startsWith('job-clean-') || String(pj.id).startsWith('job-rec-'))) {
                pubList.push(pj);
            }
        });
    }

    const allPublic = [...pubList, ...Array.from(defaultMap.values())];
    const custom = getCustomJobs().map((j) => ({ ...j, isCustom: true }));
    const pub = allPublic.map((j) => ({ ...j, isCustom: false }));
    const merged = [...custom, ...pub];

    return merged.map((job) => {
        const fieldId = classifyJobToFieldId(job);
        const track = classifyJobTrack(job);
        const personal = getPersonalJobState(job.id);
        const personalStatus = job.isCustom
            ? (job.status || personal?.status || '미지정')
            : (personal?.status || '미지정');
        return {
            ...job,
            resolvedFieldId: fieldId,
            resolvedTrack: track,
            personalStatus,
            personalMemo: personal?.memo || ''
        };
    });
}

export function getJobsCount() {
    return getMergedJobs().filter((j) => {
        if (!j.deadline) return true;
        const dday = calcJobDDay(j.deadline);
        return !dday.isExpired;
    }).length;
}

export function calcJobDDay(targetDateStr) {
    if (!targetDateStr) {
        return { text: '🌱 상시/확인필요', badgeClass: 'bg-teal-50 text-teal-800 border-teal-200', isExpired: false, days: 999 };
    }
    const trimmed = String(targetDateStr).trim();
    if (trimmed.includes('상시') || trimmed.includes('채용시') || trimmed.includes('적격자')) {
        return { text: '🌱 상시 채용', badgeClass: 'bg-teal-50 text-teal-800 border-teal-200', isExpired: false, days: 999 };
    }
    let cleanDateStr = trimmed.replace(/[./]/g, '-');
    if (/^\d{2}-\d{2}$/.test(cleanDateStr)) {
        cleanDateStr = `${new Date().getFullYear()}-${cleanDateStr}`;
    }
    const target = new Date(cleanDateStr);
    if (isNaN(target.getTime())) {
        return { text: trimmed, badgeClass: 'bg-gray-100 text-gray-600 border-gray-200', isExpired: false, days: 999 };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: '마감됨', badgeClass: 'bg-gray-100 text-gray-400 border-gray-200 line-through', isExpired: true, days: diffDays };
    } else if (diffDays === 0) {
        return { text: '🚨 오늘 마감', badgeClass: 'bg-red-500 text-white font-black animate-pulse shadow-sm', isExpired: false, days: 0 };
    } else if (diffDays <= 3) {
        return { text: `🔥 D-${diffDays}`, badgeClass: 'bg-rose-500 text-white font-extrabold shadow-sm', isExpired: false, days: diffDays };
    } else if (diffDays <= 7) {
        return { text: `⏳ D-${diffDays}`, badgeClass: 'bg-amber-500 text-white font-extrabold shadow-2xs', isExpired: false, days: diffDays };
    }
    return { text: `D-${diffDays}`, badgeClass: 'bg-emerald-600 text-white font-bold shadow-2xs', isExpired: false, days: diffDays };
}

export function buildGoogleJobSearchUrl(job) {
    if (!job) return 'https://www.google.com';
    const company = job.company || job.institution || '';
    const role = job.role || job.title || '';
    const cleanRole = role.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
    const query = `${company} ${cleanRole} 채용공고`.trim();
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function setJobFieldFilter(fieldId) {
    currentJobFieldFilter = fieldId || '전체';
    currentJobPage = 1;
    renderJobs();
    renderJobFieldPills();
}

export function setJobTrackFilter(track) {
    currentJobTrackFilter = track || '전체';
    currentJobPage = 1;
    renderJobs();
    renderJobTrackButtons();
}

export function setJobRegionGroup(regionGroup) {
    selectedJobRegionGroup = regionGroup || '전체';
    selectedJobSubRegion = '전체';
    currentJobPage = 1;
    renderJobs();
    renderJobRegionButtons();
    renderJobSubRegionSelect();
}

export function setJobSubRegion(sub) {
    selectedJobSubRegion = sub || '전체';
    currentJobPage = 1;
    renderJobs();
    renderJobSubRegionSelect();
}

export function setJobPage(page) {
    currentJobPage = Number(page) || 1;
    renderJobs();
    const container = document.getElementById('jobs-results-bar-wrap');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

export function setJobQuickKeyword(keyword) {
    if (currentJobSearch === keyword.toLowerCase()) {
        currentJobSearch = '';
    } else {
        currentJobSearch = keyword.toLowerCase();
    }
    currentJobPage = 1;
    const searchInput = (document.getElementById('jobs-search-input') || document.getElementById('job-search-input'));
    if (searchInput) searchInput.value = currentJobSearch;
    renderJobs();
    renderJobQuickKeywords();
}

export function resetJobFilters() {
    currentJobFieldFilter = '전체';
    currentJobTrackFilter = '전체';
    selectedJobRegionGroup = '전체';
    selectedJobSubRegion = '전체';
    currentJobSearch = '';
    currentJobPage = 1;
    const searchInput = (document.getElementById('jobs-search-input') || document.getElementById('job-search-input'));
    if (searchInput) searchInput.value = '';
    renderJobsView();
}

export function handleJobSearch(query) {
    currentJobSearch = (query || '').trim().toLowerCase();
    currentJobPage = 1;
    renderJobs();
    renderJobQuickKeywords();
}

// 전국 및 8대 권역 필터 버튼 바 (전국 전체 / 서울 / 경기 / 인천 / 부울경 / 대구경북 / 충청 / 호남 / 강원제주)
function renderJobRegionButtons() {
    const container = document.getElementById('job-region-buttons') || document.getElementById('job-region-chips-wrap');
    if (!container) return;

    const validJobs = getMergedJobs().filter((j) => {
        if (!j.deadline) return true;
        return !calcJobDDay(j.deadline).isExpired;
    });

    const totalCount = validJobs.length;
    const seoulCount = validJobs.filter((j) => j.region === '서울' || j.regionGroup === '서울').length;
    const gyeonggiCount = validJobs.filter((j) => j.region === '경기' || j.regionGroup === '경기').length;
    const incheonCount = validJobs.filter((j) => j.region === '인천' || j.regionGroup === '인천').length;
    const busanCount = validJobs.filter((j) => j.regionGroup === '부산/경남' || ['부산', '경남', '울산'].includes(j.region)).length;
    const daeguCount = validJobs.filter((j) => j.regionGroup === '대구/경북' || ['대구', '경북'].includes(j.region)).length;
    const daejeonCount = validJobs.filter((j) => j.regionGroup === '대전/충청' || ['대전', '세종', '충남', '충북'].includes(j.region)).length;
    const gwangjuCount = validJobs.filter((j) => j.regionGroup === '광주/전라' || ['광주', '전남', '전북'].includes(j.region)).length;
    const gangwonCount = validJobs.filter((j) => j.regionGroup === '강원/제주' || ['강원', '제주'].includes(j.region)).length;

    const regions = [
        { id: '전체', name: '전국 전체', count: totalCount, icon: '🌐' },
        { id: '서울', name: '서울', count: seoulCount, icon: '📍' },
        { id: '경기', name: '경기', count: gyeonggiCount, icon: '🌳' },
        { id: '인천', name: '인천', count: incheonCount, icon: '⚓' },
        { id: '부산/경남', name: '부산·경남', count: busanCount, icon: '🌊' },
        { id: '대구/경북', name: '대구·경북', count: daeguCount, icon: '🏙️' },
        { id: '대전/충청', name: '대전·충청', count: daejeonCount, icon: '🏛️' },
        { id: '광주/전라', name: '광주·전라', count: gwangjuCount, icon: '🌾' },
        { id: '강원/제주', name: '강원·제주', count: gangwonCount, icon: '🌲' }
    ];

    const displayRegions = regions.filter((rg) => rg.count > 0 || rg.id === '전체');
    const html = displayRegions.map((rg) => {
        const isActive = selectedJobRegionGroup === rg.id;
        const cls = isActive
            ? 'px-3.5 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs cursor-pointer transition'
            : 'px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50 transition cursor-pointer';
        return `<button type="button" onclick="setJobRegionGroup('${rg.id}')" class="${cls}">${rg.icon} ${rg.name} (${rg.count.toLocaleString()})</button>`;
    }).join('');

    container.innerHTML = html;
}

// 전국 및 권역별 세부 시·군·구 드롭다운
function renderJobSubRegionSelect() {
    const container = document.getElementById('job-subregion-select-wrap');
    if (!container) return;

    const validJobs = getMergedJobs().filter((j) => {
        if (!j.deadline) return true;
        return !calcJobDDay(j.deadline).isExpired;
    });

    const scopedJobs = selectedJobRegionGroup === '전체'
        ? validJobs
        : validJobs.filter((j) => {
            if (selectedJobRegionGroup === '부산/경남') return j.regionGroup === '부산/경남' || ['부산', '경남', '울산'].includes(j.region);
            if (selectedJobRegionGroup === '대구/경북') return j.regionGroup === '대구/경북' || ['대구', '경북'].includes(j.region);
            if (selectedJobRegionGroup === '대전/충청') return j.regionGroup === '대전/충청' || ['대전', '세종', '충남', '충북'].includes(j.region);
            if (selectedJobRegionGroup === '광주/전라') return j.regionGroup === '광주/전라' || ['광주', '전남', '전북'].includes(j.region);
            if (selectedJobRegionGroup === '강원/제주') return j.regionGroup === '강원/제주' || ['강원', '제주'].includes(j.region);
            return j.region === selectedJobRegionGroup || j.regionGroup === selectedJobRegionGroup;
        });

    const subCounts = {};
    scopedJobs.forEach((j) => {
        if (j.subRegion) {
            subCounts[j.subRegion] = (subCounts[j.subRegion] || 0) + 1;
        }
    });

    const sortedSubs = Object.keys(subCounts).sort((a, b) => a.localeCompare(b, 'ko'));

    let headerLabel = '전국 시·군·구 전체';
    if (selectedJobRegionGroup === '서울') headerLabel = '📍 서울시 자치구 전체';
    else if (selectedJobRegionGroup === '경기') headerLabel = '🌳 경기도 시·군 전체';
    else if (selectedJobRegionGroup === '인천') headerLabel = '⚓ 인천광역시 구·군 전체';
    else if (selectedJobRegionGroup === '부산/경남') headerLabel = '🌊 부산·울산·경남 시·군·구 전체';
    else if (selectedJobRegionGroup === '대구/경북') headerLabel = '🏙️ 대구·경북 시·군·구 전체';
    else if (selectedJobRegionGroup === '대전/충청') headerLabel = '🏛️ 대전·세종·충청 시·군·구 전체';
    else if (selectedJobRegionGroup === '광주/전라') headerLabel = '🌾 광주·전라 시·군·구 전체';
    else if (selectedJobRegionGroup === '강원/제주') headerLabel = '🌲 강원·제주 시·군 전체';

    const options = [
        `<option value="전체" ${selectedJobSubRegion === '전체' ? 'selected' : ''}>${headerLabel} (${scopedJobs.length.toLocaleString()}건)</option>`,
        ...sortedSubs.map((s) => `<option value="${escapeHtml(s)}" ${selectedJobSubRegion === s ? 'selected' : ''}>${escapeHtml(s)} (${subCounts[s]}건)</option>`)
    ].join('');

    container.innerHTML = `
        <select id="job-subregion-select" aria-label="시·군·구 상세 선택" onchange="setJobSubRegion(this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white text-camping-text hover:border-camping-green focus:outline-none focus:ring-1 focus:ring-camping-green cursor-pointer shadow-2xs">
            ${options}
        </select>
    `;
}

// 12대 분야 필터 버튼 바
function renderJobFieldPills() {
    const container = document.getElementById('job-field-pills') || document.getElementById('job-category-filters');
    if (!container) return;

    const validJobs = getMergedJobs().filter((j) => {
        if (!j.deadline) return true;
        return !calcJobDDay(j.deadline).isExpired;
    });

    const isAllActive = currentJobFieldFilter === '전체';
    const allCls = isAllActive
        ? 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs cursor-pointer transition'
        : 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50 transition cursor-pointer';

    const allBtn = `<button type="button" onclick="setJobFieldFilter('전체')" class="${allCls}">전체 분야 (${validJobs.length.toLocaleString()})</button>`;

    const fieldBtns = WELFARE_FIELDS.map((field) => {
        const isActive = currentJobFieldFilter === field.id;
        const count = validJobs.filter((j) => j.resolvedFieldId === field.id).length;
        const cls = isActive
            ? 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs cursor-pointer transition'
            : 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50 transition cursor-pointer';
        return `<button type="button" onclick="setJobFieldFilter('${field.id}')" class="${cls}">${field.icon} ${escapeHtml(field.shortName || field.name)} (${count})</button>`;
    }).join('');

    container.innerHTML = allBtn + fieldBtns;
}

// 4대 트랙 필터 버튼 바 (수련 / 인턴 / 정규직 / 계약직 / 내 지원현황 / 직접 등록)
function renderJobTrackButtons() {
    const container = document.getElementById('job-track-filters');
    if (!container) return;

    const validJobs = getMergedJobs().filter((j) => {
        if (!j.deadline) return true;
        return !calcJobDDay(j.deadline).isExpired;
    });

    const trainingCount = validJobs.filter((j) => j.resolvedTrack === '수련').length;
    const internCount = validJobs.filter((j) => j.resolvedTrack === '인턴').length;
    const regularCount = validJobs.filter((j) => j.resolvedTrack === '신입·정규직').length;
    const contractCount = validJobs.filter((j) => j.resolvedTrack === '계약직').length;
    const trackedCount = validJobs.filter((j) => j.personalStatus && j.personalStatus !== '미지정').length;
    const customCount = validJobs.filter((j) => j.isCustom).length;
    const totalCount = validJobs.length;

    const isAllActive = currentJobTrackFilter === '전체';
    const isTrainingActive = currentJobTrackFilter === '수련';
    const isInternActive = currentJobTrackFilter === '인턴';
    const isRegularActive = currentJobTrackFilter === '신입·정규직';
    const isContractActive = currentJobTrackFilter === '계약직';
    const isTrackedActive = currentJobTrackFilter === 'tracked';
    const isCustomActive = currentJobTrackFilter === 'custom';

    const getBtnCls = (active) => active
        ? 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-black bg-camping-green text-white shadow-2xs cursor-pointer transition'
        : 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-camping-text border border-camping-beige hover:border-camping-green hover:bg-emerald-50 transition cursor-pointer';

    container.innerHTML = `
        <button type="button" onclick="setJobTrackFilter('전체')" class="${getBtnCls(isAllActive)}">🌐 전체 공고 (${totalCount.toLocaleString()})</button>
        <button type="button" onclick="setJobTrackFilter('수련')" class="${getBtnCls(isTrainingActive)}" title="정신건강·의료·학교 2급 전문자격 취득 1년 수련">🎓 1년 전문수련 (${trainingCount.toLocaleString()})</button>
        <button type="button" onclick="setJobTrackFilter('인턴')" class="${getBtnCls(isInternActive)}" title="공기업·복지관·NGO 대학생 및 청년 단기 인턴십">🌱 대학생·청년인턴 (${internCount.toLocaleString()})</button>
        <button type="button" onclick="setJobTrackFilter('신입·정규직')" class="${getBtnCls(isRegularActive)}" title="복지관 3대 기능팀 및 공공기관 신입 정규직 공채">💼 신입·정규직 (${regularCount.toLocaleString()})</button>
        <button type="button" onclick="setJobTrackFilter('계약직')" class="${getBtnCls(isContractActive)}" title="노인맞춤돌봄, 다문화가족 등 정부·지자체 위탁사업 전담 사회복지사">📋 사업전담·계약직 (${contractCount.toLocaleString()})</button>
        <button type="button" onclick="setJobTrackFilter('tracked')" class="${getBtnCls(isTrackedActive)}">⭐ 내 지원현황 (${trackedCount})</button>
        ${customCount > 0 ? `<button type="button" onclick="setJobTrackFilter('custom')" class="${getBtnCls(isCustomActive)}">✏️ 직접 등록 (${customCount})</button>` : ''}
    `;
}

// 추천 검색어 태그 렌더러
function renderJobQuickKeywords() {
    const container = document.getElementById('job-quick-keywords-wrap');
    if (!container) return;

    const tags = [
        { label: '수련', text: '🎓 대학병원·정신 전문수련', tip: '보건복지부 공인 대학병원 및 국립정신건강센터 1년 법정수련' },
        { label: '공단', text: '🏛️ 건보·연금 공기업인턴', tip: '국민건강보험공단, 국민연금공단, 근로복지공단 등' },
        { label: '인턴', text: '🌱 NGO·공익재단 청년인턴', tip: '초록우산, 굿네이버스, 월드비전, 아산나눔재단 등 청년인턴' },
        { label: '종합', text: '🏢 종합사회복지관 정규직', tip: '종합사회복지관 3대 기능팀(사례관리/서비스제공/지역조직) 정규직' },
        { label: '전담', text: '📋 노인·다문화 전담사회복지사', tip: '노인맞춤돌봄 전담사회복지사, 다문화가족 사례관리사' },
        { label: '장애인', text: '♿ 장애인복지관', tip: '장애인종합복지관 및 직업재활시설' }
    ];

    container.innerHTML = `
        <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="font-extrabold text-camping-text shrink-0 flex items-center gap-1">
                <span>💡</span> <span>취업·인턴 추천 검색어:</span>
            </span>
            <div class="flex flex-wrap items-center gap-1.5">
                ${tags.map((t) => {
                    const active = currentJobSearch === t.label.toLowerCase();
                    const cls = active
                        ? 'whitespace-nowrap px-3 py-1 rounded-full bg-camping-green text-white font-black shadow-2xs transition cursor-pointer text-xs flex items-center gap-1'
                        : 'whitespace-nowrap px-3 py-1 rounded-full bg-gray-50 border border-camping-beige text-camping-text hover:border-camping-green hover:bg-emerald-50 hover:text-camping-green font-bold transition shadow-2xs cursor-pointer text-xs flex items-center gap-1';
                    return `<button type="button" onclick="setJobQuickKeyword('${t.label}')" class="${cls}" title="${t.tip} 빠른 검색">${t.text}</button>`;
                }).join('')}
            </div>
        </div>
    `;
}

// 페이지네이션 바 렌더러
function renderJobPaginationBar(currentPage, totalPages) {
    if (totalPages <= 1) return '';

    let pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return `
        <div class="flex items-center justify-center gap-1.5 text-xs font-bold py-3">
            <button type="button" onclick="setJobPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="px-2.5 py-1.5 rounded-lg border border-camping-beige bg-white text-camping-text hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">이전</button>
            ${pages.map((p) => {
                if (p === '...') {
                    return `<span class="px-2 py-1 text-gray-400 font-bold">...</span>`;
                }
                const active = p === currentPage;
                const cls = active
                    ? 'px-3 py-1.5 rounded-lg bg-camping-green text-white font-black shadow-2xs'
                    : 'px-3 py-1.5 rounded-lg border border-camping-beige bg-white text-camping-text hover:bg-gray-50 cursor-pointer';
                return `<button type="button" onclick="setJobPage(${p})" class="${cls}">${p}</button>`;
            }).join('')}
            <button type="button" onclick="setJobPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="px-2.5 py-1.5 rounded-lg border border-camping-beige bg-white text-camping-text hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">다음</button>
        </div>
    `;
}

export function renderCareerRoadmap() {
    const container = document.getElementById('career-roadmap-container');
    if (!container) return;

    if (currentJobFieldFilter === '전체') {
        container.innerHTML = `
            <div class="bg-gradient-to-br from-white via-camping-bg/40 to-emerald-50/40 p-5 rounded-3xl border border-camping-beige shadow-sm mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">🗺️</span>
                    <h3 class="font-extrabold text-sm sm:text-base text-camping-text">12대 분야별 진출 취업처 · 1년 수련(의료·정신·학교) · 인턴 퀵 네비게이션</h3>
                </div>
                <p class="text-xs text-camping-subtext mb-3 leading-relaxed">
                    상단 <strong>12대 세분화 분야 버튼</strong>을 클릭하면 해당 분야의 <strong>대표 취업처, 인턴·수련 코스, 2026년 처우 가이드라인, 필수 자격요건</strong>을 상세히 확인할 수 있습니다.
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    ${WELFARE_FIELDS.map(
                        (f) => `
                        <button type="button" onclick="setJobFieldFilter('${escapeHtml(f.id)}')" class="p-2.5 rounded-2xl bg-white border border-camping-beige/80 hover:border-camping-green hover:shadow-sm text-left transition group cursor-pointer flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between gap-1 mb-1">
                                    <span class="font-extrabold text-xs text-camping-text group-hover:text-camping-green">${f.icon} ${escapeHtml(f.shortName || f.name.split('·')[0])}</span>
                                    <span class="text-[10px] text-camping-green font-bold">&rarr;</span>
                                </div>
                                <p class="text-[10px] text-gray-500 line-clamp-1 leading-snug">${escapeHtml(f.career.workplaces.slice(0, 2).join(' · '))}</p>
                            </div>
                        </button>
                    `
                    ).join('')}
                </div>
            </div>
        `;
        return;
    }

    const field = getFieldById(currentJobFieldFilter);
    if (!field) return;

    container.innerHTML = `
        <div class="bg-white p-5 sm:p-6 rounded-3xl border-2 border-camping-green/40 shadow-sm mb-6">
            <div class="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-camping-beige">
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-2xl">${field.icon}</span>
                        <h3 class="font-extrabold text-xl text-camping-text">${escapeHtml(field.name)} 취업처 · 인턴 · 수련 안내서</h3>
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${field.badgeClass}">${escapeHtml(field.ministries.join(' · '))}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1.5 leading-relaxed">${escapeHtml(field.summary)}</p>
                </div>
                <div class="flex flex-wrap gap-1.5 text-xs">
                    <button type="button" onclick="promptSaveCareerAgency('${escapeHtml(field.id)}')" class="px-3 py-1.5 rounded-xl bg-camping-green text-white font-bold hover:bg-[#3f5a3b] transition cursor-pointer">➕ 희망 취업처 저장</button>
                    <button type="button" onclick="jumpFromJobs('${escapeHtml(field.id)}', 'practicum')" class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-600 hover:text-white transition cursor-pointer">🎒 실습 정보</button>
                    <button type="button" onclick="jumpFromJobs('${escapeHtml(field.id)}', 'news')" class="px-3 py-1.5 rounded-xl bg-camping-bg text-camping-text border border-camping-beige font-bold hover:bg-gray-200 transition cursor-pointer">📰 시사 보기</button>
                    <button type="button" onclick="setJobFieldFilter('전체')" class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition cursor-pointer">전체 보기</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                <div class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                    <div class="font-extrabold text-emerald-900 mb-2">🏢 졸업 후 진출 가능 주요 취업처</div>
                    <ul class="space-y-1 text-gray-700">
                        ${field.career.workplaces.map((w) => `<li>• ${escapeHtml(w)}</li>`).join('')}
                    </ul>
                </div>
                <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                    <div class="font-extrabold text-amber-900 mb-2">🌱 대학생 인턴 · 청년인턴 · 수련 루트</div>
                    <p class="text-gray-700 leading-relaxed">${escapeHtml(field.career.internAndTraining)}</p>
                </div>
                <div class="p-4 rounded-2xl bg-camping-bg/50 border border-camping-beige">
                    <div class="font-extrabold text-camping-text mb-1.5">🎓 필수 · 우대 자격요건 &amp; 역량</div>
                    <p class="text-gray-700 leading-relaxed">${escapeHtml(field.career.qualifications)}</p>
                </div>
                <div class="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80">
                    <div class="font-extrabold text-sky-900 mb-1.5">💰 2026년 보수 · 처우 가이드라인 기준</div>
                    <p class="text-gray-700 leading-relaxed">${escapeHtml(field.career.compensation)}</p>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span class="font-extrabold text-camping-subtext">🔗 이 분야 주요 채용포털:</span>
                ${field.career.portals
                    .map(
                        (p) => `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-full bg-white border border-camping-beige text-camping-green font-bold hover:bg-camping-green hover:text-white transition">${escapeHtml(p.label)} ↗</a>`
                    )
                    .join('')}
            </div>
        </div>
    `;
}

export function renderCareerPortalsHub() {
    const container = document.getElementById('career-portals-hub');
    if (!container) return;

    const colorStyles = {
        emerald: 'bg-emerald-50/60 border-emerald-100 text-emerald-900',
        amber: 'bg-amber-50/60 border-amber-100 text-amber-900',
        blue: 'bg-blue-50/60 border-blue-100 text-blue-900',
        purple: 'bg-purple-50/60 border-purple-100 text-purple-900'
    };

    const btnColorStyles = {
        emerald: 'text-emerald-800 border-emerald-200/60 hover:bg-emerald-600',
        amber: 'text-amber-800 border-amber-200/60 hover:bg-amber-600',
        blue: 'text-blue-800 border-blue-200/60 hover:bg-blue-600',
        purple: 'text-purple-800 border-purple-200/60 hover:bg-purple-600'
    };

    container.innerHTML = `
        <div class="bg-white p-5 rounded-3xl border border-camping-beige shadow-sm mb-6">
            <div class="text-xs font-bold text-camping-subtext mb-3 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                    <span>🧭</span> 전국 8대 권역 &amp; 전문분야 공식 채용 포털 · 기관 리뷰 퀵 링크
                </div>
                <span class="hidden sm:inline text-[11px] text-gray-400 font-normal">새 창으로 바로가기 ↗</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                ${OFFICIAL_PORTALS.career
                    .map(
                        (group) => `
                    <div class="p-3 rounded-2xl border flex flex-col gap-1.5 ${colorStyles[group.color]}">
                        <div class="font-extrabold text-[11px] mb-1">${escapeHtml(group.group)}</div>
                        ${group.links
                            .map(
                                (lnk) => `<a href="${escapeHtml(lnk.url)}" target="_blank" rel="noopener noreferrer" class="py-1 px-2.5 bg-white font-bold rounded-lg hover:text-white transition shadow-2xs border truncate ${btnColorStyles[group.color]}">🌐 ${escapeHtml(lnk.label)}</a>`
                            )
                            .join('')}
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;
}

export function renderJobs() {
    const container = document.getElementById('jobs-container');
    if (!container) return;

    const merged = getMergedJobs();

    // 1. 모니터링 필터링: 마감일 지난 공고 100% 자동 소멸/제거
    const filtered = merged.filter((j) => {
        // A. 마감일 자동 제외
        if (j.deadline) {
            const ddayInfo = calcJobDDay(j.deadline);
            if (ddayInfo.isExpired) return false;
        }
        // B. 분야 필터
        if (currentJobFieldFilter !== '전체' && j.resolvedFieldId !== currentJobFieldFilter) {
            return false;
        }
        // C. 트랙 필터 (수련 / 인턴 / 신입·정규직 / 계약직 / tracked / custom)
        if (currentJobTrackFilter !== '전체') {
            if (currentJobTrackFilter === 'tracked') {
                if (!j.personalStatus || j.personalStatus === '미지정') return false;
            } else if (currentJobTrackFilter === 'custom') {
                if (!j.isCustom) return false;
            } else {
                if (j.resolvedTrack !== currentJobTrackFilter) return false;
            }
        }
        // D. 수도권 권역 필터 (서울 / 경기 / 인천)
        if (selectedJobRegionGroup !== '전체') {
            let matchesRegion = false;
            if (selectedJobRegionGroup === '부산/경남') {
                matchesRegion = j.regionGroup === '부산/경남' || ['부산', '경남', '울산'].includes(j.region);
            } else if (selectedJobRegionGroup === '대구/경북') {
                matchesRegion = j.regionGroup === '대구/경북' || ['대구', '경북'].includes(j.region);
            } else if (selectedJobRegionGroup === '대전/충청') {
                matchesRegion = j.regionGroup === '대전/충청' || ['대전', '세종', '충남', '충북'].includes(j.region);
            } else if (selectedJobRegionGroup === '광주/전라') {
                matchesRegion = j.regionGroup === '광주/전라' || ['광주', '전남', '전북'].includes(j.region);
            } else if (selectedJobRegionGroup === '강원/제주') {
                matchesRegion = j.regionGroup === '강원/제주' || ['강원', '제주'].includes(j.region);
            } else {
                matchesRegion = j.region === selectedJobRegionGroup || j.regionGroup === selectedJobRegionGroup;
            }
            if (!matchesRegion) return false;
        }
        // E. 세부 시·도 / 시·군·구 (SubRegion)
        if (selectedJobSubRegion !== '전체') {
            const matchRegion = j.region === selectedJobSubRegion;
            const matchSub = j.subRegion === selectedJobSubRegion;
            const matchLoc = j.location && j.location.includes(selectedJobSubRegion);
            if (!matchRegion && !matchSub && !matchLoc) return false;
        }
        // F. 검색 키워드
        if (currentJobSearch) {
            const hay = `${j.company || ''} ${j.role || ''} ${j.location || ''} ${j.subRegion || ''} ${j.requirements || ''} ${j.salary || ''} ${j.memo || ''} ${j.personalMemo || ''} ${j.responsibilities || ''}`.toLowerCase();
            if (!hay.includes(currentJobSearch)) return false;
        }
        return true;
    });

    // 페이지네이션 연산
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / JOB_ITEMS_PER_PAGE));
    if (currentJobPage > totalPages) currentJobPage = totalPages;
    if (currentJobPage < 1) currentJobPage = 1;

    const startIdx = (currentJobPage - 1) * JOB_ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + JOB_ITEMS_PER_PAGE, totalItems);
    const pagedItems = filtered.slice(startIdx, endIdx);

    // 활성 필터 태그 목록
    const activeTags = [];
    if (selectedJobRegionGroup !== '전체') {
        const regIcons = { '서울': '📍', '경기': '🌳', '인천': '⚓' };
        const regGroupLbl = selectedJobSubRegion !== '전체' ? `${selectedJobRegionGroup} > ${selectedJobSubRegion}` : selectedJobRegionGroup;
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-800 font-bold">${regIcons[selectedJobRegionGroup] || '📍'} ${escapeHtml(regGroupLbl)} <button type="button" onclick="setJobRegionGroup('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    } else if (selectedJobSubRegion !== '전체') {
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-800 font-bold">📍 ${escapeHtml(selectedJobSubRegion)} <button type="button" onclick="setJobSubRegion('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    }

    if (currentJobFieldFilter !== '전체') {
        const fld = getFieldById(currentJobFieldFilter);
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-sky-100 text-sky-800 font-bold">${fld?.icon || '🏢'} ${escapeHtml(fld?.shortName || currentJobFieldFilter)} <button type="button" onclick="setJobFieldFilter('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    }
    if (currentJobTrackFilter !== '전체') {
        const trackLabels = {
            '수련': '🎓 1년 전문수련',
            '인턴': '🌱 대학생·청년인턴',
            '신입·정규직': '💼 신입·정규직',
            '계약직': '📋 사업전담·계약직',
            'tracked': '⭐ 내 지원현황',
            'custom': '✏️ 직접 등록'
        };
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-purple-100 text-purple-800 font-bold">${escapeHtml(trackLabels[currentJobTrackFilter] || currentJobTrackFilter)} <button type="button" onclick="setJobTrackFilter('전체')" class="hover:text-red-600 font-black">×</button></span>`);
    }
    if (currentJobSearch) {
        activeTags.push(`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-gray-200 text-gray-800 font-bold">🔍 "${escapeHtml(currentJobSearch)}" <button type="button" onclick="handleJobSearch('')" class="hover:text-red-600 font-black">×</button></span>`);
    }

    // 결과 카운트 바 갱신
    const resultsBarWrap = document.getElementById('jobs-results-bar-wrap');
    if (resultsBarWrap) {
        resultsBarWrap.innerHTML = `
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-extrabold text-camping-text">
                    총 <span class="text-emerald-700">${totalItems.toLocaleString()}</span>개 채용 공고
                    <span class="text-gray-400 font-normal">(${totalItems > 0 ? `${startIdx + 1}~${endIdx}건 표시 중` : '0건'} · ${currentJobPage} / ${totalPages} 페이지)</span>
                </span>
                ${activeTags.join('')}
            </div>
            <div class="flex items-center gap-2">
                ${(currentJobFieldFilter !== '전체' || currentJobTrackFilter !== '전체' || selectedJobRegionGroup !== '전체' || selectedJobSubRegion !== '전체' || currentJobSearch) ? `
                    <button type="button" onclick="resetJobFilters()" class="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 transition cursor-pointer">
                        <span>🔄</span> <span>필터 초기화</span>
                    </button>
                ` : ''}
            </div>
        `;
    }

    // 공고 목록 비었을 때
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white rounded-3xl p-10 text-center border border-camping-beige">
                <div class="text-4xl mb-3">🔍</div>
                <h3 class="font-bold text-gray-700 text-base mb-1">조건에 맞는 채용 공고가 없습니다</h3>
                <p class="text-xs text-gray-500 mb-4">선택하신 권역·분야·트랙에 부합하는 공고가 없거나 검색어와 일치하는 결과가 없습니다.</p>
                <button type="button" onclick="resetJobFilters()" class="px-4 py-2 bg-camping-green text-white rounded-xl text-xs font-bold hover:bg-[#3f5a3b] transition cursor-pointer">
                    전체 필터 초기화하고 모든 공고 보기
                </button>
            </div>
        `;
        const paginationWrap = document.getElementById('jobs-pagination-wrap');
        if (paginationWrap) paginationWrap.innerHTML = '';
        return;
    }

    // 150건 카드 렌더링
    const cardsHtml = pagedItems.map((j) => {
        const field = getFieldById(j.resolvedFieldId);
        const ddayInfo = calcJobDDay(j.deadline);
        const safeId = escapeHtml(j.id);
        const selectId = `job-status-${safeId}`;
        const badgeStatus = statusBadgeMap[j.personalStatus] || statusBadgeMap['미지정'];

        const trackBadge = j.resolvedTrack === '수련'
            ? '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-purple-100 text-purple-900 border border-purple-300">🎓 1년 전문수련</span>'
            : (j.resolvedTrack === '인턴'
                ? '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">🌱 대학생·청년인턴</span>'
                : (j.resolvedTrack === '신입·정규직'
                    ? '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-300">💼 신입·정규직</span>'
                    : '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300">📋 사업전담·계약직</span>'));

        const sourceTag = j.isCustom
            ? '<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">내 직접 등록</span>'
            : '<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-50 text-gray-600 border border-gray-200">공식 공고</span>';

        const customActions = j.isCustom
            ? `
                <div class="flex items-center gap-1.5 text-xs">
                    <button type="button" onclick="openJobModal('${safeId}')" class="text-gray-400 hover:text-camping-green p-1 transition cursor-pointer" title="공고 수정">✏️</button>
                    <button type="button" onclick="deleteMyJobItem('${safeId}')" class="text-gray-400 hover:text-red-500 p-1 transition cursor-pointer" title="공고 삭제">🗑️</button>
                </div>
            `
            : '';

        const encCompany = encodeURIComponent(j.company || '');
        const jobplanetUrl = `https://www.jobplanet.co.kr/search?query=${encCompany}`;
        const mapQuery = encodeURIComponent(j.location || j.company || '');
        const mapUrl = `https://map.kakao.com/?q=${mapQuery}`;

        let rawSalary = (j.salary || '가이드라인 준수').split('(')[0].trim().replace(/[,~-]+$/, '').trim();
        const salaryBadge = escapeHtml(rawSalary);

        let rawQual = (j.requirements || '사회복지사 자격증').split(',')[0].trim();
        const qualBadge = escapeHtml(rawQual);

        const locBadge = escapeHtml(j.location || j.subRegion || j.region || '수도권');
        const googleSearchUrl = buildGoogleJobSearchUrl(j);

        return `
            <div class="editorial-card bg-white dark:bg-[#161F30] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-lg hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-200 flex flex-col justify-between group">
                <div>
                    <div class="flex items-start justify-between gap-1 mb-2">
                        <div class="flex flex-wrap gap-1.5 items-center">
                            ${field ? `<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${field.badgeClass}">${field.icon} ${escapeHtml(field.shortName || field.name.split('·')[0])}</span>` : ''}
                            ${trackBadge}
                            ${sourceTag}
                        </div>
                        ${customActions}
                    </div>

                    <div class="flex items-center justify-between gap-2 mt-1 mb-1">
                        <div class="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1 truncate">
                            🏢 <span>${escapeHtml(j.company || '')}</span>
                        </div>
                        <span class="${ddayInfo.badgeClass} text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0">${escapeHtml(ddayInfo.text)}</span>
                    </div>

                    <h3 class="font-bold text-base text-camping-text mb-2 line-clamp-2 leading-snug">${escapeHtml(j.role || j.title || '')}</h3>

                    <!-- 3대 핵심 스펙 가시성 뱃지 -->
                    <div class="flex flex-wrap gap-1.5 mb-2.5">
                        <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-extrabold max-w-[170px] truncate" title="${escapeHtml(j.requirements || '')}">🎓 ${qualBadge}</span>
                        <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold max-w-[190px] truncate" title="${escapeHtml(j.salary || '')}">💰 ${salaryBadge}</span>
                        <span class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-extrabold max-w-[130px] truncate" title="${escapeHtml(j.location || '')}">📍 ${locBadge}</span>
                    </div>

                    <div class="text-xs text-gray-600 mb-2">
                        <span>📝 <strong>1차 서류접수 마감:</strong> ${j.deadline ? `<span class="text-camping-text font-black">${escapeHtml(String(j.deadline).replace(/-/g, '.'))}</span>` : '<span class="text-emerald-700 font-extrabold">상시 접수</span>'}</span>
                    </div>

                    ${j.memo ? `<p class="text-[11px] text-gray-500 bg-camping-bg/40 p-2.5 rounded-xl line-clamp-2 whitespace-pre-wrap mb-2">${escapeHtml(j.memo)}</p>` : ''}
                    ${j.personalMemo ? `<p class="text-[11px] text-amber-900 bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-xl whitespace-pre-wrap mb-2"><strong>📌 나의 메모:</strong> ${escapeHtml(j.personalMemo)}</p>` : ''}
                </div>

                <div>
                    <!-- 내 지원 상태 (개인 localStorage 저장) -->
                    <div class="mb-2.5 pt-2 border-t border-camping-beige/60 flex items-center justify-between gap-2">
                        <label for="${selectId}" class="text-[11px] font-bold text-camping-subtext">내 준비 상태:</label>
                        <select id="${selectId}" name="${selectId}" aria-label="${escapeHtml(j.company || '공고')} 지원 상태" onchange="updatePersonalJobStatus('${safeId}', this.value)" class="px-2.5 py-1 rounded-xl text-[11px] font-extrabold border outline-none cursor-pointer ${badgeStatus}">
                            ${['미지정', '관심', '서류준비', '서류제출', '면접', '합격', '불합격']
                                .map((st) => `<option value="${st}" ${j.personalStatus === st ? 'selected' : ''}>${st === '미지정' ? '선택 안 함' : st}</option>`)
                                .join('')}
                        </select>
                    </div>

                <!-- 1. 메인 2열 액션 버튼: [📄 상세 요강] + [🌐 공식 채용관 ↗] (에디토리얼 스타일) -->
                <div class="grid grid-cols-2 gap-2 text-xs mb-2">
                    <button type="button" onclick="openJobDetailModal('${safeId}')" class="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-blue-500/20 active:scale-98">
                        <span>📄</span> <span>상세 요강</span>
                    </button>
                    <a href="${escapeHtml(j.officialUrl || j.officialHomepage || 'https://www.welfare.net')}" target="_blank" rel="noopener noreferrer" class="py-2.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 text-center active:scale-98" title="기관 공식 채용게시판으로 바로 이동">
                        <span>🌐</span> <span>공식 채용관 ↗</span>
                    </a>
                </div>

                <!-- 2. 보조 3열 버튼: [🔍 구글검색] + [🏢 잡플래닛] + [📍 지도위치] -->
                <div class="grid grid-cols-3 gap-1.5 text-[11px]">
                    <a href="${googleSearchUrl}" target="_blank" rel="noopener noreferrer" class="text-center py-1.5 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold rounded-xl border border-blue-200/60 dark:border-blue-800/60 transition flex items-center justify-center gap-1" title="크롬 구글 검색으로 최신 공고문 및 요강 바로 찾기">
                        <span>🔍</span> <span>공고검색</span>
                    </a>
                    <a href="${jobplanetUrl}" target="_blank" rel="noopener noreferrer" class="text-center py-1.5 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1">
                        <span>🏢</span> <span>잡플래닛</span>
                    </a>
                    <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="text-center py-1.5 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1">
                        <span>📍</span> <span>지도위치</span>
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');

    container.innerHTML = cardsHtml;

    const paginationWrap = document.getElementById('jobs-pagination-wrap');
    if (paginationWrap) {
        paginationWrap.innerHTML = renderJobPaginationBar(currentJobPage, totalPages);
    }
}

export function renderJobsView() {
    renderCareerPortalsHub();
    renderCareerRoadmap();
    renderJobQuickKeywords();
    renderJobRegionButtons();
    renderJobSubRegionSelect();
    renderJobFieldPills();
    renderJobTrackButtons();
    renderJobs();
}

export function updatePersonalJobStatus(jobId, status) {
    const isCustom = getCustomJobs().some((j) => String(j.id) === String(jobId));
    if (isCustom) {
        upsertCustomJob({ id: jobId, status });
        if (getPersonalJobState(jobId)) {
            setPersonalJobState(jobId, { status: '' });
        }
    } else {
        setPersonalJobState(jobId, { status });
    }
    renderJobs();
    renderJobTrackButtons();
}

export function editPersonalJobMemo(jobId) {
    const merged = getMergedJobs();
    const target = merged.find((j) => String(j.id) === String(jobId));
    const current = target?.personalMemo || '';
    const nextMemo = prompt(`[${target?.company || '공고'}] 나만의 개인 지원 메모를 입력하세요 (내 브라우저에만 저장됩니다):`, current);
    if (nextMemo === null) return;
    setPersonalJobState(jobId, { memo: nextMemo.trim() });
    renderJobs();
}

// ==================== [📄 상세 공고 & 전형 요강 자체 모달 시스템] ====================

export function openJobDetailModal(jobId) {
    const job = getMergedJobs().find((j) => String(j.id) === String(jobId));
    if (!job) {
        alert('해당 공고 정보를 찾을 수 없습니다.');
        return;
    }

    const field = getFieldById(job.resolvedFieldId);
    const ddayInfo = calcJobDDay(job.deadline);
    const safeId = escapeHtml(job.id);
    const googleSearchUrl = buildGoogleJobSearchUrl(job);

    const trackBadge = job.resolvedTrack === '수련'
        ? '<span class="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-100 text-purple-900 border border-purple-300">🎓 1년 전문수련</span>'
        : (job.resolvedTrack === '인턴'
            ? '<span class="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">🌱 대학생·청년인턴</span>'
            : (job.resolvedTrack === '신입·정규직'
                ? '<span class="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-300">💼 신입·정규직</span>'
                : '<span class="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300">📋 사업전담·계약직</span>'));

    const headerEl = document.getElementById('job-detail-header');
    if (headerEl) {
        headerEl.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1.5">
                    <div class="flex flex-wrap items-center gap-1.5">
                        ${field ? `<span class="px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${field.badgeClass}">${field.icon} ${escapeHtml(field.name)}</span>` : ''}
                        ${trackBadge}
                        <span class="${ddayInfo.badgeClass} text-xs font-black px-2.5 py-0.5 rounded-full border">${escapeHtml(ddayInfo.text)}</span>
                    </div>
                    <div class="text-xs sm:text-sm font-extrabold text-camping-green flex items-center gap-1">
                        <span>🏢</span> <span>${escapeHtml(job.company || '')}</span>
                    </div>
                    <h2 class="text-base sm:text-xl font-black text-camping-text leading-snug">${escapeHtml(job.role || job.title || '')}</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-2.5">
                        <a href="${escapeHtml(job.officialUrl || job.officialHomepage || 'https://www.welfare.net')}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 text-center">
                            <span>🌐</span> <span>기관 공식 채용게시판 바로가기 ↗</span>
                        </a>
                        <a href="${googleSearchUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 text-center">
                            <span>🔍</span> <span>크롬 구글에서 공고 &amp; 요강 검색 ↗</span>
                        </a>
                    </div>
                </div>
                <button type="button" onclick="closeJobDetailModal()" class="text-gray-400 hover:text-gray-700 text-2xl font-black p-1 leading-none cursor-pointer transition" aria-label="닫기">&times;</button>
            </div>
        `;
    }

    const bodyEl = document.getElementById('job-detail-body');
    if (bodyEl) {
        bodyEl.innerHTML = `
            <div class="space-y-3.5">
                <!-- 1. 주요 담당 직무 및 실습/수련 내용 -->
                <div class="bg-gray-50/80 rounded-2xl p-4 border border-camping-beige/70">
                    <h4 class="font-black text-xs sm:text-sm text-camping-text mb-1.5 flex items-center gap-1.5">
                        <span>📋</span> <span>주요 담당 업무 &amp; 실무 내용</span>
                    </h4>
                    <p class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">${escapeHtml(job.responsibilities || job.memo || '상세 직무 요강 준수')}</p>
                </div>

                <!-- 2. 지원 자격 및 우대 사항 -->
                <div class="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-200/60">
                    <h4 class="font-black text-xs sm:text-sm text-indigo-950 mb-1.5 flex items-center gap-1.5">
                        <span>🎓</span> <span>지원 자격 요건 &amp; 우대 사항</span>
                    </h4>
                    <p class="text-xs sm:text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">${escapeHtml(job.requirementsDetail || job.requirements || '사회복지사 자격증 소지(예정)자')}</p>
                </div>

                <!-- 3. 보수 및 근무 조건 -->
                <div class="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/60">
                    <h4 class="font-black text-xs sm:text-sm text-emerald-950 mb-1.5 flex items-center gap-1.5">
                        <span>💰</span> <span>보수 수준 &amp; 근무 조건</span>
                    </h4>
                    <div class="space-y-1 text-xs sm:text-sm text-emerald-900">
                        <p><strong>급여/처우:</strong> ${escapeHtml(job.salary || '가이드라인 준수')}</p>
                        <p><strong>근무지/위치:</strong> ${escapeHtml(job.location || `${job.region || ''} ${job.subRegion || ''}` || '수도권')}</p>
                        ${job.workingConditions ? `<p><strong>복리후생:</strong> ${escapeHtml(job.workingConditions)}</p>` : ''}
                    </div>
                </div>

                <!-- 4. 전형 절차 및 마감 일정 -->
                <div class="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60">
                    <h4 class="font-black text-xs sm:text-sm text-amber-950 mb-1.5 flex items-center gap-1.5">
                        <span>📅</span> <span>1차 서류전형 마감 &amp; 선발 절차</span>
                    </h4>
                    <div class="space-y-1 text-xs sm:text-sm text-amber-900">
                        <p><strong>📝 1차 서류접수 마감:</strong> <span class="font-black text-rose-700 text-sm">${escapeHtml(job.deadline ? String(job.deadline).replace(/-/g, '.') : '상시 접수 (적격자 채용 시 마감)')}</span> <span class="text-xs text-rose-600 font-bold">(마감 시각 이후 원서접수 불가)</span></p>
                        <p><strong>선발 전형 절차:</strong> ${escapeHtml(job.selectionProcess || job.process || '1차 서류심사 → 2차 심층면접')}</p>
                        <p class="text-[11px] text-amber-800/80 pt-1">💡 본 공고의 D-Day 카운트다운은 대학생 지원자의 <strong>'1차 서류접수 최종 마감일'</strong> 기준이며, 서류 마감 이후의 면접·필기 전형은 서류 합격자에 한해 개별 진행됩니다.</p>
                    </div>
                </div>

                <!-- 5. 기관 정보 & 공식 문의처 -->
                <div class="bg-gray-50/80 rounded-2xl p-4 border border-camping-beige/70">
                    <h4 class="font-black text-xs sm:text-sm text-gray-800 mb-1.5 flex items-center gap-1.5">
                        <span>🏛️</span> <span>기관 정보 &amp; 공식 문의처</span>
                    </h4>
                    <div class="space-y-1 text-xs sm:text-sm text-gray-700">
                        <p><strong>공식 문의처:</strong> ${escapeHtml(job.contactInfo || '해당 기관 채용 담당부서')}</p>
                        <p><strong>공인 출처:</strong> ${escapeHtml(job.sourcePlatform || '보건복지부 / 협회 공인')}</p>
                        ${job.officialHomepage ? `<p><strong>공식 홈페이지:</strong> <a href="${escapeHtml(job.officialHomepage)}" target="_blank" rel="noopener noreferrer" class="text-camping-green underline font-bold hover:text-emerald-700">${escapeHtml(job.officialHomepage)} ↗</a></p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    const footerEl = document.getElementById('job-detail-footer');
    if (footerEl) {
        const currentStatus = job.personalStatus || '미지정';
        const currentMemo = job.personalMemo || '';

        footerEl.innerHTML = `
            <div class="space-y-3">
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-bold text-camping-text shrink-0">내 지원 상태:</label>
                        <select id="modal-job-status-select" onchange="updatePersonalJobStatus('${safeId}', this.value)" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-camping-green/50 bg-white cursor-pointer shadow-2xs">
                            ${['미지정', '관심', '서류준비', '서류제출', '면접', '합격', '불합격'].map((st) => `<option value="${st}" ${currentStatus === st ? 'selected' : ''}>${st === '미지정' ? '선택 안 함' : st}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <a href="https://map.kakao.com/?q=${encodeURIComponent(job.location || job.company || '')}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-bold flex items-center gap-1 shadow-2xs">
                            <span>📍</span> <span>지도</span>
                        </a>
                        <a href="https://www.jobplanet.co.kr/search?query=${encodeURIComponent(job.company || '')}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-bold flex items-center gap-1 shadow-2xs">
                            <span>🏢</span> <span>잡플래닛</span>
                        </a>
                    </div>
                </div>

                <!-- 개인 지원 메모 -->
                <div class="space-y-1">
                    <div class="flex items-center justify-between">
                        <label class="text-xs font-bold text-camping-subtext">📝 나만의 지원 메모 (자동 저장)</label>
                        <span id="modal-memo-save-indicator" class="text-[10px] text-emerald-600 font-bold hidden">✓ 저장 완료</span>
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="modal-job-memo-input" value="${escapeHtml(currentMemo)}" placeholder="예: 자기소개서 초안 작성 완료, 1월 5일 우편발송 예정" class="flex-1 text-xs px-3 py-2 rounded-xl border border-camping-beige focus:border-camping-green focus:outline-none" />
                        <button type="button" onclick="saveJobDetailMemo('${safeId}')" class="px-3.5 py-2 bg-camping-green text-white text-xs font-black rounded-xl hover:bg-[#3f5a3b] transition cursor-pointer shrink-0 shadow-2xs">메모 저장</button>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <a href="${escapeHtml(job.officialUrl || job.officialHomepage || 'https://www.welfare.net')}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition flex items-center justify-center gap-1 shadow-sm">
                            <span>🌐</span> <span>공식 채용게시판 ↗</span>
                        </a>
                        <a href="${googleSearchUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition flex items-center justify-center gap-1 shadow-sm">
                            <span>🔍</span> <span>구글 검색 ↗</span>
                        </a>
                    </div>
                    <button type="button" onclick="closeJobDetailModal()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition cursor-pointer">
                        창 닫기
                    </button>
                </div>
            </div>
        `;
    }

    const modal = document.getElementById('job-detail-modal');
    const content = document.getElementById('job-detail-modal-content');
    if (modal) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            if (content) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
        });
    }
}

export function closeJobDetailModal() {
    const modal = document.getElementById('job-detail-modal');
    const content = document.getElementById('job-detail-modal-content');
    if (modal) {
        modal.classList.add('opacity-0');
        if (content) {
            content.classList.add('scale-95');
            content.classList.remove('scale-100');
        }
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 250);
    }
}

export function saveJobDetailMemo(jobId) {
    const input = document.getElementById('modal-job-memo-input');
    if (!input) return;
    const memo = input.value.trim();
    setPersonalJobState(jobId, { memo });

    const indicator = document.getElementById('modal-memo-save-indicator');
    if (indicator) {
        indicator.classList.remove('hidden');
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 2000);
    }
    renderJobs();
}

export function promptSaveCareerAgency(fieldId) {
    const field = getFieldById(fieldId);
    const agencyName = prompt(`[${field?.name || '취업처'}] 내 준비함에 찜할 희망 기관명을 입력하세요:`);
    if (!agencyName || !agencyName.trim()) return;
    const memo = prompt(`'${agencyName.trim()}' 준비 메모 (요구 스펙, 인턴/공채 시기 등)를 입력하세요:`, '');
    addSavedAgency({
        fieldId,
        name: agencyName.trim(),
        track: '인턴·취업',
        memo: memo || ''
    });
    alert(`'${agencyName.trim()}'이(가) [내 준비함]에 저장되었습니다! 💼`);
}

export function jumpFromJobs(fieldId, targetView) {
    if (onNavigateCallback) {
        onNavigateCallback(targetView, { fieldId });
    }
}

export function openJobModal(id = null) {
    const jobModal = document.getElementById('job-modal');
    const jobModalContent = document.getElementById('job-modal-content');
    const form = document.getElementById('job-form');
    const btnDel = document.getElementById('btn-delete-job');
    if (!jobModal || !jobModalContent || !form) return;

    form.reset();
    if (id) {
        const j = getCustomJobs().find((x) => x.id === id);
        if (!j) return;
        document.getElementById('job-id').value = j.id;
        document.getElementById('job-field').value = j.fieldId || classifyJobToFieldId(j);
        document.getElementById('job-track').value = j.track || classifyJobTrack(j);
        document.getElementById('job-company').value = j.company || '';
        document.getElementById('job-role').value = j.role || '';
        document.getElementById('job-status').value = j.status || getPersonalJobState(j.id)?.status || '관심';
        document.getElementById('job-deadline').value = j.deadline || '';
        document.getElementById('job-url').value = j.url || '';
        document.getElementById('job-memo').value = j.memo || '';
        document.getElementById('job-modal-title').innerText = '내가 추가한 공고 수정 💼';
        if (btnDel) {
            btnDel.classList.remove('hidden');
            btnDel.onclick = () => {
                if (confirm('내가 추가한 이 공고를 삭제할까요?')) {
                    deleteCustomJob(j.id);
                    closeJobModal();
                    renderJobsView();
                }
            };
        }
    } else {
        document.getElementById('job-id').value = '';
        if (currentJobFieldFilter !== '전체') {
            document.getElementById('job-field').value = currentJobFieldFilter;
        }
        document.getElementById('job-modal-title').innerText = '나만의 공고 직접 추가 (개인 저장)';
        if (btnDel) btnDel.classList.add('hidden');
    }

    jobModal.classList.remove('hidden');
    requestAnimationFrame(() => {
        jobModal.classList.remove('opacity-0');
        jobModalContent.classList.remove('scale-95');
    });
}

export function closeJobModal() {
    const jobModal = document.getElementById('job-modal');
    const jobModalContent = document.getElementById('job-modal-content');
    if (!jobModal || !jobModalContent) return;

    jobModal.classList.add('opacity-0');
    jobModalContent.classList.add('scale-95');
    setTimeout(() => jobModal.classList.add('hidden'), 250);
}

export function deleteMyJobItem(id) {
    if (!confirm('내가 추가한 공고를 삭제할까요?')) return;
    deleteCustomJob(id);
    renderJobsView();
}

export function initJobsHandlers(onSaved) {
    const fieldSelect = document.getElementById('job-field');
    if (fieldSelect) {
        fieldSelect.innerHTML = WELFARE_FIELDS.map(
            (f) => `<option value="${escapeHtml(f.id)}">${f.icon} ${escapeHtml(f.name)}</option>`
        ).join('');
    }

    const detailModal = document.getElementById('job-detail-modal');
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                closeJobDetailModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeJobDetailModal();
        }
    });

    const jobForm = document.getElementById('job-form');
    if (!jobForm) return;

    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('job-id').value;
        const fieldId = document.getElementById('job-field').value;
        const field = getFieldById(fieldId);
        const track = document.getElementById('job-track').value;
        const company = document.getElementById('job-company').value.trim();
        const role = document.getElementById('job-role').value.trim();
        const status = document.getElementById('job-status').value;
        const deadline = document.getElementById('job-deadline').value;
        const url = normalizeHttpUrl(document.getElementById('job-url').value);
        const memo = document.getElementById('job-memo').value.trim();

        upsertCustomJob({
            id: id || undefined,
            fieldId,
            category: field?.name || '사회복지',
            track,
            company,
            role,
            status,
            deadline,
            url,
            memo
        });

        closeJobModal();
        renderJobsView();
        if (onSaved) onSaved();
    });
}

// Global window bindings
if (typeof window !== 'undefined') {
    window.setJobFieldFilter = setJobFieldFilter;
    window.setJobTrackFilter = setJobTrackFilter;
    window.setJobRegionGroup = setJobRegionGroup;
    window.setJobSubRegion = setJobSubRegion;
    window.setJobPage = setJobPage;
    window.setJobQuickKeyword = setJobQuickKeyword;
    window.resetJobFilters = resetJobFilters;
    window.handleJobSearch = handleJobSearch;
    window.updatePersonalJobStatus = updatePersonalJobStatus;
    window.editPersonalJobMemo = editPersonalJobMemo;
    window.promptSaveCareerAgency = promptSaveCareerAgency;
    window.openJobModal = openJobModal;
    window.closeJobModal = closeJobModal;
    window.deleteMyJobItem = deleteMyJobItem;
    window.openJobDetailModal = openJobDetailModal;
    window.closeJobDetailModal = closeJobDetailModal;
    window.saveJobDetailMemo = saveJobDetailMemo;
}
