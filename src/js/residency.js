/**
 * residency.js
 * 전문사회복지사 수련기관 탐색 모듈 (Stitch _5, _12 디자인 100% 반영)
 * - 3대 전문수련 트랙: 정신건강사회복지사(142), 의료사회복지사(98), 학교사회복지사(44) 총 284곳
 * - 권역별 필터: 전국, 수도권, 영남권, 호남권, 충청권, 강원·제주권
 * - 실시간 검색 및 워크스페이스 저장 연동
 */

import { escapeHtml } from './utils.js';
import { addSavedAgency, getWorkspace } from './storage.js';

export const RESIDENCY_POSTINGS = [
    {
        id: 'res-001',
        track: '의료',
        trackLabel: '의료사회복지 수련',
        trackClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dday: 'D-5 원서마감',
        ddayClass: 'bg-rose-50 text-rose-600 border-rose-200',
        institution: '서울대학교병원 의료사회복지팀',
        title: '2026년도 제24기 수련의료사회복지사 모집',
        region: '수도권',
        subRegion: '서울 종로구',
        period: '2026.03.01 ~ 2027.02.28 (1년, 주 5일)',
        quota: '4명 (사회복지사 1급 소지자 및 2026년 졸업예정자)',
        treatment: '유급 수련 (서울대병원 규정 준용, 4대보험, 가운 및 교육비 지원)',
        deadline: '2026.01.10 17:00 (온라인 채용홈페이지)',
        address: '서울 종로구 대학로 101 본원 사회복지팀 (02-2072-2487)',
        url: 'https://www.snuh.org',
        association: '대한의료사회복지사협회 (KAMSW) 인증'
    },
    {
        id: 'res-002',
        track: '정신건강',
        trackLabel: '정신건강사회복지 수련',
        trackClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dday: 'D-8 원서마감',
        ddayClass: 'bg-amber-50 text-amber-600 border-amber-200',
        institution: '국립정신건강센터 정신건강사업부',
        title: '2026년도 2급 정신건강사회복지사 수련생 선발',
        region: '수도권',
        subRegion: '서울 광진구',
        period: '2026.03.01 ~ 2027.02.28 (1년 임상수련)',
        quota: '6명 (사회복지사 1급 필수, 임상실습 이수자 우대)',
        treatment: '보건복지부 국립병원 수련비 지급, 기숙사/식사 제공',
        deadline: '2026.01.15 18:00 (우편 및 전자접수)',
        address: '서울 광진구 용마산로 127 국립정신건강센터 (02-2204-0114)',
        url: 'https://www.ncmh.go.kr',
        association: '한국정신건강사회복지사협회 (KAMHSW) 인증'
    },
    {
        id: 'res-003',
        track: '의료',
        trackLabel: '의료사회복지 수련',
        trackClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dday: 'D-12 원서접수중',
        ddayClass: 'bg-blue-50 text-blue-600 border-blue-200',
        institution: '연세대학교 신촌세브란스병원 사회사업팀',
        title: '2026년도 수련의료사회복지사 임상수련 과정 전형',
        region: '수도권',
        subRegion: '서울 서대문구',
        period: '2026.03.01 ~ 2027.02.28 (1년 풀타임)',
        quota: '5명 (사회복지사 1급 취득(예정)자, 토익 750점 이상 우대)',
        treatment: '급여 지급 (연세의료원 인턴급여 규정), 세브란스 복리후생',
        deadline: '2026.01.20 17:00 (세브란스 채용포털)',
        address: '서울 서대문구 연세로 50-1 세브란스병원 (02-2228-1004)',
        url: 'https://yuhs.severance.healthcare',
        association: '대한의료사회복지사협회 (KAMSW) 인증'
    },
    {
        id: 'res-004',
        track: '의료',
        trackLabel: '의료사회복지 수련',
        trackClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dday: 'D-15 원서접수중',
        ddayClass: 'bg-blue-50 text-blue-600 border-blue-200',
        institution: '서울특별시 보라매병원 공공의료사회공헌팀',
        title: '2026년도 공공의료 수련의료사회복지사 선발',
        region: '수도권',
        subRegion: '서울 동작구',
        period: '2026.03.01 ~ 2027.02.28 (1년, 취약계층 퇴원연계)',
        quota: '3명 (사회복지사 1급 자격증 취득자)',
        treatment: '서울시 시립병원 호봉 기준 수련비, 중식 제공',
        deadline: '2026.01.25 17:00 (병원 채용게시판)',
        address: '서울 동작구 보라매로5길 20 (02-870-2114)',
        url: 'https://www.brmh.org',
        association: '대한의료사회복지사협회 (KAMSW) 인증'
    },
    {
        id: 'res-005',
        track: '정신건강',
        trackLabel: '정신건강사회복지 수련',
        trackClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dday: 'D-18 원서접수중',
        ddayClass: 'bg-blue-50 text-blue-600 border-blue-200',
        institution: '용인정신병원 수련센터',
        title: '2026년도 정신건강전문요원(사회복지) 2급 수련과정',
        region: '수도권',
        subRegion: '경기 용인시',
        period: '2026.03.01 ~ 2027.02.28 (1,000시간 법정수련)',
        quota: '4명 (사회복지학 학사 및 1급 자격 소지자)',
        treatment: '수련수당 지급, 원내 기숙사 및 삼식 무료 제공',
        deadline: '2026.01.28 18:00 (이메일 접수)',
        address: '경기 용인시 기흥구 중부대로 940 (031-288-0114)',
        url: 'https://www.yonginmh.co.kr',
        association: '한국정신건강사회복지사협회 (KAMHSW) 인증'
    },
    {
        id: 'res-006',
        track: '학교',
        trackLabel: '학교사회복지 수련',
        trackClass: 'bg-purple-50 text-purple-800 border-purple-200',
        dday: 'D-20 모집공고',
        ddayClass: 'bg-purple-50 text-purple-600 border-purple-200',
        institution: '한국학교사회복지사협회 지정 수련 거점학교군',
        title: '2026년도 제8기 학교사회복지사 전문수련생 선발',
        region: '수도권',
        subRegion: '서울/경기 교육지원청',
        period: '2026.03.01 ~ 2027.02.28 (초·중등 교육복지실 1년 파견)',
        quota: '12명 (사회복지사 1급 소지자, 학교사회복지론 이수자)',
        treatment: '교육청 실습비 지원 및 협회 수련과정 공식 이수증 발급',
        deadline: '2026.01.30 17:00 (협회 온라인 접수)',
        address: '서울 영등포구 선유로 49 (02-588-4228)',
        url: 'https://www.kassw.or.kr',
        association: '한국학교사회복지사협회 공식 인증'
    },
    {
        id: 'res-007',
        track: '의료',
        trackLabel: '의료사회복지 수련',
        trackClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dday: 'D-22 모집공고',
        ddayClass: 'bg-blue-50 text-blue-600 border-blue-200',
        institution: '부산대학교병원 사회사업팀',
        title: '2026년도 수련의료사회복지사 임상수련 전형',
        region: '영남권',
        subRegion: '부산 서구',
        period: '2026.03.01 ~ 2027.02.28 (1년, 임상사례관리 및 호스피스)',
        quota: '3명 (사회복지사 1급 소지 및 예정자)',
        treatment: '부산대병원 수련의료인 급여 기준, 피복비 지원',
        deadline: '2026.02.05 17:00 (병원 채용포털)',
        address: '부산 서구 구덕로 179 (051-240-7000)',
        url: 'https://www.pnuh.or.kr',
        association: '대한의료사회복지사협회 (KAMSW) 인증'
    },
    {
        id: 'res-008',
        track: '정신건강',
        trackLabel: '정신건강사회복지 수련',
        trackClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dday: 'D-25 모집공고',
        ddayClass: 'bg-blue-50 text-blue-600 border-blue-200',
        institution: '국립나주병원 정신건강사업과',
        title: '2026년도 국립나주병원 정신건강사회복지사 2급 수련',
        region: '호남권',
        subRegion: '전남 나주시',
        period: '2026.03.01 ~ 2027.02.28 (보건복지부 책임운영기관)',
        quota: '4명 (사회복지사 1급 소지자)',
        treatment: '국립병원 인턴 급여 규정 적용, 관사 지원',
        deadline: '2026.02.08 18:00 (등기우편 및 방문)',
        address: '전남 나주시 산포면 세남로 1328-31 (061-330-4114)',
        url: 'https://www.najumh.go.kr',
        association: '한국정신건강사회복지사협회 (KAMHSW) 인증'
    }
];

let selectedResidencyTrack = '전체';
let selectedResidencyRegion = '전체';
let residencySearchQuery = '';

export function initResidencyView() {
    renderResidencyView();
    bindResidencyEvents();
}

export function setResidencyTrack(track) {
    selectedResidencyTrack = track || '전체';
    renderResidencyView();
}

export function setResidencyRegion(region) {
    selectedResidencyRegion = region || '전체';
    renderResidencyView();
}

export function handleResidencySearch(query) {
    residencySearchQuery = (query || '').trim().toLowerCase();
    renderResidencyView();
}

export function renderResidencyView() {
    const listContainer = document.getElementById('residency-postings-list');
    if (!listContainer) return;

    const filtered = RESIDENCY_POSTINGS.filter((item) => {
        const matchTrack = selectedResidencyTrack === '전체' || item.track === selectedResidencyTrack;
        const matchRegion = selectedResidencyRegion === '전체' || item.region === selectedResidencyRegion;
        const matchQuery = !residencySearchQuery ||
            item.title.toLowerCase().includes(residencySearchQuery) ||
            item.institution.toLowerCase().includes(residencySearchQuery) ||
            item.address.toLowerCase().includes(residencySearchQuery);
        return matchTrack && matchRegion && matchQuery;
    });

    // Update track badges/buttons
    document.querySelectorAll('.residency-track-btn').forEach((btn) => {
        const track = btn.dataset.track;
        if (track === selectedResidencyTrack) {
            btn.className = 'residency-track-btn px-4 py-2 rounded-xl text-xs font-black bg-blue-600 text-white shadow-xs transition';
        } else {
            btn.className = 'residency-track-btn px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition';
        }
    });

    // Update region pills
    document.querySelectorAll('.residency-region-btn').forEach((btn) => {
        const region = btn.dataset.region;
        if (region === selectedResidencyRegion) {
            btn.className = 'residency-region-btn px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300';
        } else {
            btn.className = 'residency-region-btn px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200';
        }
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="col-span-1 md:col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
                <span class="text-3xl">🔍</span>
                <p class="text-sm font-bold text-slate-700 mt-2">조건에 일치하는 전문수련 모집공고가 없습니다.</p>
                <p class="text-xs text-slate-400 mt-1">필터 조건을 재설정하거나 전체보기를 눌러보세요.</p>
                <button type="button" onclick="window.resetResidencyFilters()" class="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200">
                    전체 필터 초기화
                </button>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = filtered.map((post) => `
        <div class="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between">
            <div class="space-y-3.5">
                <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${post.trackClass}">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        ${escapeHtml(post.trackLabel)}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold ${post.ddayClass}">
                        ${escapeHtml(post.dday)}
                    </span>
                </div>
                <div>
                    <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>${escapeHtml(post.institution)}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">${escapeHtml(post.region)}</span>
                    </div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white mt-1 hover:text-blue-600 transition-colors">
                        ${escapeHtml(post.title)}
                    </h3>
                </div>
                <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-white/10">
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-medium">수련기간</span>
                        <span class="font-semibold text-slate-900 dark:text-slate-200">${escapeHtml(post.period)}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-medium">모집인원</span>
                        <span class="font-semibold text-slate-900 dark:text-slate-200">${escapeHtml(post.quota)}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-medium">수련처우</span>
                        <span class="font-semibold text-slate-900 dark:text-slate-200 text-right text-[11px]">${escapeHtml(post.treatment)}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-medium">원서마감</span>
                        <span class="font-bold text-rose-600 dark:text-rose-400">${escapeHtml(post.deadline)}</span>
                    </div>
                    <div class="pt-2 border-t border-slate-100 dark:border-white/10 text-[11px] flex flex-col gap-0.5 bg-slate-50/70 dark:bg-slate-800/50 p-2.5 rounded-lg">
                        <span class="text-slate-500 dark:text-slate-400 font-medium">기관문의처 및 소재지</span>
                        <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(post.address)}</span>
                    </div>
                </div>
            </div>
            <div class="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <button type="button" onclick="window.saveResidencyToWorkspace('${post.id}')" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-50 text-slate-700 dark:text-slate-200 hover:text-amber-700 border border-slate-200 dark:border-white/10 text-xs font-semibold shadow-xs transition-colors">
                    <span>⭐</span>
                    <span>내 준비함 담기</span>
                </button>
                <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all">
                    <span>공식 전형요강 ↗</span>
                </a>
            </div>
        </div>
    `).join('');
}

function bindResidencyEvents() {
    window.setResidencyTrack = setResidencyTrack;
    window.setResidencyRegion = setResidencyRegion;
    window.handleResidencySearch = handleResidencySearch;
    window.resetResidencyFilters = () => {
        selectedResidencyTrack = '전체';
        selectedResidencyRegion = '전체';
        residencySearchQuery = '';
        const input = document.getElementById('residency-search-input');
        if (input) input.value = '';
        renderResidencyView();
    };

    window.saveResidencyToWorkspace = (id) => {
        const item = RESIDENCY_POSTINGS.find((p) => p.id === id);
        if (!item) return;
        addSavedAgency({
            id: item.id,
            name: item.institution,
            type: `${item.trackLabel} (${item.title})`,
            address: item.address,
            fieldId: 'medical',
            memo: `[수련모집] ${item.period} / ${item.quota}`
        });
        alert(`⭐ '${item.institution}' 수련 공고가 내 준비함에 저장되었습니다!`);
    };
}
