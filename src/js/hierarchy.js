/**
 * 대한민국 사회복지 현장 나침반: 3단계 위계 도감 (167개 법정단위서비스 전수 매트릭스)
 * Google Stitch Material Design 3 리디자인 반영 컨트롤러
 */

(function () {
    let currentMinistryGroup = 'all';
    let currentDomainFilter = 'all';
    let currentSearchKeyword = '';

    const DOMAIN_MAP = {
        '01_사회복지관': { key: 'community', icon: 'corporate_fare', short: '종합사회복지관', badge: '3대 핵심기능 (22)', legal: '<span>「사회복지사업법」 제34조의5</span><span>동법 시행규칙 제21조의2</span><span class="text-secondary font-bold">보건복지부 사업안내 제2권</span>' },
        '02_노인복지': { key: 'elder', icon: 'elderly', short: '노인복지·맞춤돌봄', badge: '맞춤돌봄·여가 (20)', legal: '<span>「노인복지법」 제27조의2·제36조</span><span>「노인장기요양보험법」</span><span class="text-secondary font-bold">노인맞춤돌봄 사업안내</span>' },
        '03_장애인복지': { key: 'disabled', icon: 'accessible_forward', short: '장애인자립·재활', badge: '자립·활동지원 (19)', legal: '<span>「장애인복지법」 제58조·제59조의9</span><span>「발달장애인법」 제33조</span><span class="text-secondary font-bold">장애인복지시설 사업안내</span>' },
        '04_아동돌봄복지': { key: 'child', icon: 'child_care', short: '아동보호·돌봄', badge: '학대보호·돌봄 (16)', legal: '<span>「아동복지법」 제37조·제45조</span><span>「아동학대처벌법」 제11조</span><span class="text-secondary font-bold">아동분야 사업안내 1~2권</span>' },
        '05_영유아보육': { key: 'infant', icon: 'child_friendly', short: '영유아·보육지원', badge: '표준보육·누리 (10)', legal: '<span>「영유아보육법」 제10조·제24조</span><span>유보통합 표준보육과정</span><span class="text-secondary font-bold">보육사업안내</span>' },
        '08_정신건강자살예방': { key: 'mental', icon: 'psychology', short: '정신건강·자살예방', badge: '정신의료재활 (12)', legal: '<span>「정신건강복지법」 제15조</span><span>「자살예방법」 제12조</span><span class="text-secondary font-bold">국가정신건강사업안내</span>' },
        '11_지역보호긴급돌봄': { key: 'crisis', icon: 'shield_person', short: '긴급복지·위기개입', badge: '신속개입망 (13)', legal: '<span>「긴급복지지원법」 제5조·제8조</span><span>「사회서비스원법」 제10조</span><span class="text-secondary font-bold">긴급지원사업안내</span>' },
        
        // Section II
        '06_가족복지': { key: 'family', icon: 'diversity_1', short: '가족·다문화', badge: '통합가족 (13)', legal: '<span>「건강가정기본법」 제35조</span><span>「다문화가족지원법」 제12조</span><span class="text-secondary font-bold">여성가족부 가족사업안내</span>' },
        '07_청소년여성권익': { key: 'youth', icon: 'backpack', short: '청소년·여성권익', badge: '상담·보호쉼터 (15)', legal: '<span>「청소년기본법」 제18조</span><span>「가정폭력방지법」 제5조</span><span class="text-secondary font-bold">여성가족부 청소년사업안내</span>' },
        '10_학교사회복지': { key: 'school', icon: 'school', short: '학교사회복지', badge: '교육복지우선 (8)', legal: '<span>「초·중등교육법」 제54조</span><span>교육복지우선지원사업 훈령</span><span class="text-secondary font-bold">교육부 운영매뉴얼</span>' },
        '09_자활고용지원': { key: 'selfhelp', icon: 'work_history', short: '자활·일자리', badge: '고용·복지 (10)', legal: '<span>「국민기초생활보장법」 제15조</span><span>구직자 취업촉진법 제6조</span><span class="text-secondary font-bold">고용노동부·복지부 사업안내</span>' },
        '12_배분모금국제': { key: 'donation', icon: 'volunteer_activism', short: '모금·나눔배분', badge: '나눔배분·ODA (9)', legal: '<span>「사회복지공동모금회법」 제20조</span><span>「한국국제협력단법」 제7조</span><span class="text-secondary font-bold">공동모금회 배분사업지침</span>' }
    };

    const SECTION_1_KEYS = ['01_사회복지관', '02_노인복지', '03_장애인복지', '04_아동돌봄복지', '05_영유아보육', '08_정신건강자살예방', '11_지역보호긴급돌봄'];
    const SECTION_2_KEYS = ['06_가족복지', '07_청소년여성권익', '10_학교사회복지', '09_자활고용지원', '12_배분모금국제'];

    function getDB() {
        return {
            nodes: (typeof window !== 'undefined' && window.WELFARE_HIERARCHY_NODES) ? window.WELFARE_HIERARCHY_NODES : []
        };
    }

    window.renderHierarchyView = function (options = {}) {
        const container = document.getElementById('view-hierarchy');
        if (!container) return;

        container.innerHTML = buildHierarchyHTML();
        bindEvents();

        if (options.targetNodeId) {
            setTimeout(() => {
                highlightAndScrollNode(options.targetNodeId);
            }, 150);
        }
    };

    function buildHierarchyHTML() {
        const { nodes } = getDB();
        const sec1Nodes = nodes.filter(n => SECTION_1_KEYS.includes(n.domainId));
        const sec2Nodes = nodes.filter(n => SECTION_2_KEYS.includes(n.domainId));

        return `
            <div class="flex flex-col w-full animate-fadeIn font-body-md text-on-surface pb-16">
                <!-- Top Statutory Context Banner & Page Metadata -->
                <section class="w-full bg-surface-container-low py-space-md border-b border-surface-container">
                    <div class="max-w-7xl mx-auto px-margin flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                        <div class="flex flex-wrap items-center gap-space-sm">
                            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm">
                                <span class="material-symbols-outlined text-[18px]">account_tree</span>
                            </span>
                            <div class="flex items-center gap-space-xs font-label-md text-label-md">
                                <span class="text-primary font-bold">국가법정기준</span>
                                <span class="text-outline-variant">/</span>
                                <span class="text-on-surface-variant">사회복지사업법 제34조의5 및 각 개별법령</span>
                                <span class="text-outline-variant">/</span>
                                <span class="text-on-surface font-semibold">12대 분야 167개 법정단위서비스 위계 매트릭스</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-space-sm font-legal-code text-legal-code">
                            <a class="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-bold border border-primary/20 hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" onclick="showView('archive'); return false;" title="지침서 아카이브 53종 화면 바로가기">
                                <span class="material-symbols-outlined text-[14px] text-secondary">auto_stories</span>
                                <span>공식 지침서 53종 연계 가동중</span>
                                <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </a>
                            <span class="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface text-secondary font-bold shadow-sm">
                                <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>2026년 정부 고시 표준체계 완결본
                            </span>
                            <span class="text-on-surface-variant">코드: MHW-2026-STAT-90</span>
                        </div>
                    </div>
                </section>

                <!-- Administrative Header & Directive Notice -->
                <section class="max-w-7xl mx-auto px-margin pt-space-lg w-full">
                    <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                            <div class="flex flex-col gap-space-xs">
                                <div class="flex items-center gap-space-sm">
                                    <span class="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">Statutory Matrix v2.4</span>
                                    <span class="text-on-surface-variant font-label-sm text-label-sm">보건복지부 · 여성가족부 · 교육부 소관 38종 업무처리지침 연계</span>
                                </div>
                                <h1 class="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">사회복지 3단계 위계 도감 (167개 법정단위서비스 전수 매트릭스)</h1>
                                <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    기관명의 반복 나열을 배제하고, <strong class="text-on-surface font-semibold">[실천분야] → [대분류(법정기능)] → [중분류(사업체계)] → [소분류(단위서비스/실천내용)]</strong>의 공공 행정 계층 구조로 체계화한 대한민국 표준 복지행정 분류표입니다.
                                </p>
                            </div>
                            <div class="flex flex-wrap items-center gap-space-sm shrink-0">
                                <button type="button" class="inline-flex items-center gap-space-xs h-[38px] px-space-md rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold shadow-sm cursor-pointer" onclick="window.print()">
                                    <span class="material-symbols-outlined text-[18px]">print</span>
                                    <span>표 인쇄 / PDF</span>
                                </button>
                                <button type="button" class="inline-flex items-center gap-space-xs h-[38px] px-space-md rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold shadow-sm cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[18px]">table_view</span>
                                    <span>Excel (.csv) 저장</span>
                                </button>
                                <a class="inline-flex items-center gap-space-xs h-[38px] px-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label-md text-label-md font-semibold shadow-sm ring-2 ring-primary/20 group cursor-pointer" onclick="showView('archive'); return false;" title="지침서 아카이브(SCREEN_2)로 즉시 전환">
                                    <span class="material-symbols-outlined text-[18px]">menu_book</span>
                                    <span>지침서 53종 연계 아카이브</span>
                                    <span class="px-1.5 py-0.5 rounded text-[11px] bg-secondary text-on-secondary font-bold ml-0.5">SCREEN_2 직결</span>
                                    <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </div>

                        <!-- 4대 요약 지표 카드 -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs border-t border-surface-container-low">
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">총 법정단위 서비스</span>
                                    <span class="material-symbols-outlined text-primary text-[20px]">dataset</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-primary">167</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">개 단위</span>
                                </div>
                                <span class="font-legal-code text-legal-code text-secondary font-semibold">● 12개 실천분야 전수 등재</span>
                            </div>
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">소관 정부부처</span>
                                    <span class="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-primary">6</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">개 부처·기구</span>
                                </div>
                                <span class="font-legal-code text-legal-code text-on-surface-variant">복지부·여가부·교육부 등</span>
                            </div>
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">법정 실천분야</span>
                                    <span class="material-symbols-outlined text-secondary text-[20px]">view_comfy</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-secondary">12</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">대 핵심영역</span>
                                </div>
                                <span class="font-legal-code text-legal-code text-on-surface-variant">보건복지 7 + 범부처 5</span>
                            </div>
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">위계도감 데이터 패키지</span>
                                    <span class="material-symbols-outlined text-primary text-[20px]">download_for_offline</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-primary">2026</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">정례개정판</span>
                                </div>
                                <a class="font-legal-code text-legal-code text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[14px]">download</span>
                                    <span>원클릭 CSV 내려받기</span>
                                </a>
                            </div>
                        </div>

                        <!-- 안내문 박스 -->
                        <div class="bg-surface-container-low rounded-lg p-space-md flex items-start gap-space-md">
                            <span class="material-symbols-outlined text-primary text-[24px] mt-0.5 shrink-0">info</span>
                            <div class="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                                <div class="font-headline-sm text-headline-sm text-on-surface font-bold">■ 법정 표준 행정 지침 고시 기준 안내</div>
                                <p class="leading-normal">
                                    1. 본 위계 매트릭스는 <span class="text-primary font-semibold">「사회복지사업법 시행규칙」 제21조의2</span>(사회복지관의 사업 등), <span class="text-primary font-semibold">「노인복지법」</span>, <span class="text-primary font-semibold">「장애인복지법」</span> 등 소관 법령 및 2026년도 보건복지부 공식 사업안내 지침을 기준으로 전수 정리되었습니다.
                                </p>
                                <p class="leading-normal">
                                    2. 종전의 불필요한 시설 단어 중복을 완전히 제거하고, 상위 기능에 하위 서비스를 종속시키는 계층형 그리드(Rowspan Grouping)를 적용하여 실습생, 수련생, 종사자의 서비스 포트폴리오 산출과 사업계획서 작성을 즉각 지원합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Live Filters & Standard Domain Selector Strip -->
                <section class="max-w-7xl mx-auto px-margin pt-space-lg w-full">
                    <div class="flex flex-col gap-space-md">
                        <!-- Search & Realtime Counts Bar -->
                        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
                            <div class="relative flex-1 max-w-xl">
                                <span class="absolute left-space-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
                                <input 
                                    type="text" 
                                    id="matrixSearchInput" 
                                    class="w-full h-10 pl-11 pr-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface focus:shadow-inner" 
                                    placeholder="실천분야, 법정기능, 세부사업명, 단위서비스 키워드 검색 (예: Intake, 주간보호, 사례관리, 돌봄)"
                                />
                            </div>
                            <div class="flex items-center gap-space-sm font-legal-code text-legal-code text-on-surface-variant">
                                <span class="px-space-sm py-1 rounded bg-surface-container font-bold text-primary" id="displayCountTag">
                                    전체 12개 실천분야 / 167개 법정단위서비스 수록
                                </span>
                                <span class="hidden sm:inline text-outline-variant">|</span>
                                <button type="button" class="text-secondary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer" onclick="window.resetHierarchyFilters()">
                                    <span class="material-symbols-outlined text-[14px]">refresh</span> 초기화
                                </button>
                            </div>
                        </div>

                        <!-- 2단 부처 및 분야 탭 -->
                        <div class="w-full bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div class="flex flex-col md:flex-row md:items-center justify-between pb-space-xs border-b border-surface-container gap-space-xs">
                                <div class="flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
                                    <span class="material-symbols-outlined text-[20px]">account_balance</span>
                                    <span>소관 중앙부처 및 주관 주체별 12대 실천분야 필터</span>
                                </div>
                                <div class="flex items-center gap-space-sm font-legal-code text-legal-code text-on-surface-variant">
                                    <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary"></span>부처별 일괄 조회</span>
                                    <span>•</span>
                                    <span id="currentActiveFilterName">단위 실천분야 단독 필터링 지원</span>
                                </div>
                            </div>

                            <!-- 부처 탭 (오른쪽 잘림 방지: flex-wrap 자연스러운 줄바꿈) -->
                            <div class="flex flex-wrap items-center gap-2 pb-space-xs border-b border-surface-container-low" id="ministryGroupTabs">
                                <button type="button" class="ministry-btn active px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all bg-primary text-on-primary shadow-sm flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('all', this)">
                                    <span class="material-symbols-outlined text-[16px]">apps</span>
                                    <span>전체 부처 (12대 분야 · 167개 단위)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mohw', this)">
                                    <span class="material-symbols-outlined text-[16px]">health_and_safety</span>
                                    <span>보건복지부 (7대 분야 · 112개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mogef', this)">
                                    <span class="material-symbols-outlined text-[16px]">family_restroom</span>
                                    <span>여성가족부 (2대 분야 · 28개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moe', this)">
                                    <span class="material-symbols-outlined text-[16px]">school</span>
                                    <span>교육부 (1대 분야 · 8개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moel', this)">
                                    <span class="material-symbols-outlined text-[16px]">work</span>
                                    <span>고용노동부·복지부공동 (1대 분야 · 10개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('civic', this)">
                                    <span class="material-symbols-outlined text-[16px]">volunteer_activism</span>
                                    <span>제3섹터·공동모금회 (1대 분야 · 9개)</span>
                                </button>
                            </div>

                            <!-- 세부 분야 버튼 그룹 -->
                            <div class="flex flex-col gap-space-sm" id="ministryGroupContainer">
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="mohw">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-primary text-on-primary font-legal-code text-legal-code font-bold">보건복지부</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">7개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn active px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-bold bg-primary text-on-primary transition-all shadow-sm cursor-pointer" onclick="window.selectDomainFilter('all', this)">보건복지부 전체</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('community', this)">🏢 종합사회복지관 (22)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('elder', this)">👴 노인복지·맞춤돌봄 (20)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('disabled', this)">♿ 장애인자립·재활 (19)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('child', this)">🧒 아동보호·돌봄 (16)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('infant', this)">🍼 영유아·보육지원 (10)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('mental', this)">🧠 정신건강·자살예방 (12)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('crisis', this)">🛡️ 긴급복지·위기개입 (13)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="mogef">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-secondary text-on-secondary font-legal-code text-legal-code font-bold">여성가족부</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">2개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('family', this)">🏠 가족·다문화 (13)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('youth', this)">🎒 청소년·여성권익 (15)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="moe">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-legal-code text-legal-code font-bold">교육부</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">1개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('school', this)">🏫 학교사회복지 (8)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="moel">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-tertiary text-on-tertiary font-legal-code text-legal-code font-bold">고용·복지</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">1개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('selfhelp', this)">💼 자활·일자리 (10)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="civic">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-surface-variant text-on-surface font-legal-code text-legal-code font-bold">제3섹터</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">1개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('donation', this)">🤝 모금·나눔배분 (9)</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Core Table Matrix Section (Clean Administrative Rowspan Architecture) -->
                <section class="max-w-7xl mx-auto px-margin pt-space-md pb-space-xl w-full flex flex-col gap-space-xl">
                    <!-- 모바일 스마트 카드 뷰 (md:hidden) -->
                    <div class="block md:hidden w-full flex flex-col gap-space-sm mb-space-xs">
                        <div class="p-space-sm rounded-xl bg-primary text-on-primary shadow-sm flex items-center justify-between">
                            <div class="flex items-center gap-space-xs">
                                <span class="material-symbols-outlined text-[20px]">phone_android</span>
                                <div class="flex flex-col">
                                    <span class="font-label-sm text-label-sm font-bold">모바일 최적화 위계 탐색 모드</span>
                                    <span class="font-legal-code text-legal-code text-on-primary-container">167개 단위서비스 스마트 카드 뷰</span>
                                </div>
                            </div>
                            <a class="px-space-sm py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center gap-0.5 cursor-pointer" onclick="showView('archive'); return false;">
                                <span>지침서 53종</span>
                                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </a>
                        </div>
                        <div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
                            <span>※ 터치하여 세부 사업내용과 매핑 서식을 확인하세요</span>
                            <span class="text-primary font-bold">총 167개 전수</span>
                        </div>
                    </div>

                    <!-- 모바일 카드 목록 컨테이너 -->
                    <div class="block md:hidden flex flex-col gap-space-sm w-full" id="mobileCardsContainer">
                        ${renderMobileCards(nodes)}
                    </div>

                    <!-- 데스크톱 섹션 Ⅰ: 보건복지부 소관 7개 실천분야 -->
                    <div class="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-surface-container hidden md:block" id="section1Container">
                        <div class="px-space-lg py-space-md bg-surface-container-high flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container">
                            <div class="flex flex-wrap items-center gap-space-sm">
                                <span class="px-space-sm py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold">섹션 Ⅰ</span>
                                <h2 class="font-headline-sm text-headline-sm text-primary font-extrabold">중앙 정부부처 핵심 법정단위 서비스 (보건복지부 소관 7개 실천분야)</h2>
                                <span class="px-space-xs py-0.5 rounded bg-surface font-semibold text-secondary font-legal-code text-legal-code font-num">${sec1Nodes.length}개 단위서비스 직결</span>
                            </div>
                            <div class="flex items-center gap-space-xs">
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.print()">
                                    <span class="material-symbols-outlined text-[16px]">print</span>
                                    <span>인쇄</span>
                                </button>
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[16px]">download</span>
                                    <span>CSV</span>
                                </button>
                            </div>
                        </div>
                        <div class="overflow-x-auto w-full">
                            <table class="w-full text-left border-collapse table-fixed min-w-[1080px]" id="hierarchicalMatrixTable">
                                <colgroup>
                                    <col class="w-[18%]">
                                    <col class="w-[18%]">
                                    <col class="w-[20%]">
                                    <col class="w-[28%]">
                                    <col class="w-[16%]">
                                </colgroup>
                                <thead>
                                    <tr class="bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider">
                                        <th class="py-space-md px-space-md font-bold" scope="col">1단계: 실천분야 및 법적근거</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">2단계: 대분류 (기능)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">3단계: 중분류 (사업분야)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">소분류 (사업 및 세부내용)</th>
                                        <th class="py-space-md px-space-md font-bold text-center" scope="col">공식지침서 / 법정서식</th>
                                    </tr>
                                </thead>
                                <tbody class="font-body-md text-body-md divide-y divide-surface-container">
                                    ${renderDesktopTableRows(sec1Nodes, SECTION_1_KEYS)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 데스크톱 섹션 Ⅱ: 범부처 및 공공기관 5개 실천분야 -->
                    <div class="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-surface-container hidden md:block" id="section2Container">
                        <div class="px-space-lg py-space-md bg-surface-container-high flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container">
                            <div class="flex flex-wrap items-center gap-space-sm">
                                <span class="px-space-sm py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">섹션 Ⅱ</span>
                                <h2 class="font-headline-sm text-headline-sm text-primary font-extrabold">범부처 및 특화·전문 실천단위 서비스 (여성가족부·고용노동부·교육부·제3섹터 5개 실천분야)</h2>
                                <span class="px-space-xs py-0.5 rounded bg-surface font-semibold text-secondary font-legal-code text-legal-code font-num">${sec2Nodes.length}개 단위서비스 직결</span>
                            </div>
                            <div class="flex items-center gap-space-xs">
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.print()">
                                    <span class="material-symbols-outlined text-[16px]">print</span>
                                    <span>인쇄</span>
                                </button>
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[16px]">download</span>
                                    <span>CSV</span>
                                </button>
                            </div>
                        </div>
                        <div class="overflow-x-auto w-full">
                            <table class="w-full text-left border-collapse table-fixed min-w-[1080px]" id="hierarchicalMatrixTable2">
                                <colgroup>
                                    <col class="w-[18%]">
                                    <col class="w-[18%]">
                                    <col class="w-[20%]">
                                    <col class="w-[28%]">
                                    <col class="w-[16%]">
                                </colgroup>
                                <thead>
                                    <tr class="bg-tertiary text-on-tertiary font-label-md text-label-md uppercase tracking-wider">
                                        <th class="py-space-md px-space-md font-bold" scope="col">1단계: 실천분야 및 소관부처</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">2단계: 대분류 (기능)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">3단계: 중분류 (사업분야)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">소분류 (사업 및 세부내용)</th>
                                        <th class="py-space-md px-space-md font-bold text-center" scope="col">공식지침서 / 법정서식</th>
                                    </tr>
                                </thead>
                                <tbody class="font-body-md text-body-md divide-y divide-surface-container">
                                    ${renderDesktopTableRows(sec2Nodes, SECTION_2_KEYS)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 하단 패키지 배너 -->
                    <div class="bg-surface-container-low rounded-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg border border-surface-container">
                        <div class="flex items-center gap-space-md">
                            <div class="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-[28px]">library_books</span>
                            </div>
                            <div class="flex flex-col gap-0.5">
                                <span class="font-headline-sm text-headline-sm font-bold text-primary">3단계 위계도감 및 업무처리지침 일체 패키지</span>
                                <p class="font-body-sm text-body-sm text-on-surface-variant">2026년 기준 전국 167개 법정단위서비스 분류체계와 연결된 지침서 53종 연계표(PDF·CSV·JSON)를 일괄 다운로드할 수 있습니다.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-space-sm shrink-0">
                            <button type="button" class="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-highest text-primary hover:bg-surface-container font-label-md text-label-md font-bold transition-colors shadow-sm cursor-pointer" onclick="window.print()">
                                <span class="material-symbols-outlined text-[18px]">print</span>
                                <span>인쇄용 출력</span>
                            </button>
                            <button type="button" class="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold transition-colors shadow-sm ring-2 ring-primary/20 cursor-pointer" onclick="window.exportHierarchyCSV()">
                                <span class="material-symbols-outlined text-[18px]">download</span>
                                <span>일괄 데이터 다운로드</span>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- 비교 및 행정 규격 안내 카드 3종 -->
                <section class="max-w-7xl mx-auto px-margin pb-space-xl w-full">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                            <div class="flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
                                <span class="material-symbols-outlined text-[20px]">gavel</span>
                                <span>법정 근거 연계성</span>
                            </div>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">
                                단순 민간 실천명칭이 아닌 시행규칙 및 고시에 명시된 공식 [법정기능/대분류] 기준을 엄격 준수하여 평가 인증 지표와 100% 일치합니다.
                            </p>
                        </div>
                        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                            <div class="flex items-center gap-space-xs font-label-md text-label-md text-secondary font-bold">
                                <span class="material-symbols-outlined text-[20px]">view_column</span>
                                <span>Rowspan 행 병합 가독성</span>
                            </div>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">
                                기관명이 매 행 반복되어 발생하는 시각적 피로를 방지하고, 상위 분류 1개 셀에 복수의 단위서비스를 종속 정렬하여 행정 위계를 직관화했습니다.
                            </p>
                        </div>
                        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                            <div class="flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
                                <span class="material-symbols-outlined text-[20px]">folder_special</span>
                                <span>서식 및 실무 지침 매핑</span>
                            </div>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">
                                각 소분류 행마다 주관 부처의 공식 업무매뉴얼 페이지 및 사용 법정 서식 번호를 직결 표기하여 실습생과 실무자의 행정 편의를 극대화했습니다.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 모바일 하단 플로팅 바 (block md:hidden) -->
                <div class="block md:hidden fixed bottom-3 left-3 right-3 z-40 bg-surface/95 backdrop-blur-md rounded-xl p-space-sm shadow-lg border border-primary/20">
                    <div class="flex items-center justify-between gap-space-xs">
                        <div class="flex items-center gap-space-xs flex-1">
                            <div class="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-[18px]">menu_book</span>
                            </div>
                            <div class="flex flex-col leading-tight">
                                <span class="font-label-sm text-label-sm font-bold text-primary">53종 지침서 연계</span>
                                <span class="font-legal-code text-legal-code text-on-surface-variant">SCREEN_2 즉시 이동</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-space-xs shrink-0">
                            <button type="button" onclick="window.exportHierarchyCSV()" class="px-space-sm py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-0.5 cursor-pointer">
                                <span class="material-symbols-outlined text-[16px]">download</span>
                                <span>CSV</span>
                            </button>
                            <a class="px-space-sm py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-0.5 shadow-sm cursor-pointer" onclick="showView('archive'); return false;">
                                <span>아카이브</span>
                                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Rowspan 셀 병합 계산 엔진 (데스크톱)
     */
    function renderDesktopTableRows(nodes, domainKeys) {
        let html = '';

        domainKeys.forEach(domainId => {
            const domainNodes = nodes.filter(n => n.domainId === domainId);
            if (domainNodes.length === 0) return;

            const domainMeta = DOMAIN_MAP[domainId] || { key: 'misc', icon: 'corporate_fare', short: domainId, badge: `${domainNodes.length}단위`, legal: '' };
            const domainRowspan = domainNodes.length;

            // Group by level1
            const level1Groups = {};
            domainNodes.forEach(n => {
                if (!level1Groups[n.level1]) level1Groups[n.level1] = [];
                level1Groups[n.level1].push(n);
            });

            let isFirstRowOfDomain = true;

            Object.keys(level1Groups).forEach(l1Key => {
                const l1Nodes = level1Groups[l1Key];
                const level1Rowspan = l1Nodes.length;
                let isFirstRowOfL1 = true;

                l1Nodes.forEach(node => {
                    const rowId = `hierarchy-node-${node.id}`;
                    const searchKeywords = `${domainMeta.short} ${node.level1} ${node.level2} ${node.level3} ${(node.details || []).join(' ')} ${(node.guidelineRef && node.guidelineRef.file) || ''}`.toLowerCase();

                    html += `<tr id="${rowId}" class="domain-row group hover:bg-surface-container-low transition-colors" data-domain="${domainMeta.key}" data-keywords="${searchKeywords}">`;

                    // 1열: 실천분야 및 법적근거 (Rowspan)
                    if (isFirstRowOfDomain) {
                        html += `
                            <td class="align-top p-space-md bg-surface-container-lowest font-headline-sm text-headline-sm text-primary font-bold" rowspan="${domainRowspan}">
                                <div class="sticky top-36 flex flex-col gap-space-xs">
                                    <div class="inline-flex items-center gap-space-xs text-primary">
                                        <span class="material-symbols-outlined text-[22px]">${domainMeta.icon}</span>
                                        <span>${domainMeta.short}</span>
                                    </div>
                                    <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm w-fit font-bold font-num">
                                        ${domainMeta.badge}
                                    </span>
                                    <div class="font-legal-code text-legal-code text-on-surface-variant flex flex-col gap-0.5 mt-space-xs">
                                        ${domainMeta.legal}
                                    </div>
                                </div>
                            </td>
                        `;
                        isFirstRowOfDomain = false;
                    }

                    // 2열: 2단계 대분류 (기능) (Rowspan)
                    if (isFirstRowOfL1) {
                        html += `
                            <td class="align-top p-space-md bg-surface-container-low font-headline-sm text-headline-sm text-on-surface font-bold" rowspan="${level1Rowspan}">
                                <div class="flex flex-col gap-space-xs">
                                    <span class="text-primary font-extrabold flex items-center gap-1">
                                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                                        ${node.level1}
                                    </span>
                                    <span class="font-legal-code text-legal-code text-on-surface-variant font-normal">
                                        ${node.facilityType || '법정 실천기준'}
                                    </span>
                                </div>
                            </td>
                        `;
                        isFirstRowOfL1 = false;
                    }

                    // 3열: 3단계 중분류 (사업분야)
                    html += `
                        <td class="align-top p-space-md font-label-md text-label-md text-on-surface font-semibold bg-surface-container-lowest">
                            ${node.level2}
                        </td>
                    `;

                    // 4열: 소분류 (사업 및 세부내용)
                    const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];
                    html += `
                        <td class="align-top p-space-md text-on-surface font-body-sm text-body-sm leading-relaxed bg-surface-container-lowest">
                            <div class="font-bold text-on-surface mb-1">${node.level3}</div>
                            <ul class="space-y-1">
                                ${bullets.map(b => `
                                    <li class="flex items-start gap-1.5">
                                        <span class="text-primary mt-1 text-[10px]">●</span>
                                        <span>${b}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </td>
                    `;

                    // 5열: 공식지침서 / 법정서식
                    const gRef = node.guidelineRef || { file: '공식 업무안내', chapter: '사업안내', page: '', archiveId: 'doc-004' };
                    const cleanFile = gRef.file.replace(/\.(pdf|hwp|hwpx|xlsx)$/i, '').replace(/^[0-9]+_/, '');
                    const shortFile = cleanFile.length > 18 ? cleanFile.slice(0, 18) + '…' : cleanFile;
                    const cleanChapter = (gRef.chapter || '').split('(')[0].replace(/^[ⅠⅡⅢⅣ0-9\.\-\s]+/, '').trim();
                    const formText = cleanChapter ? cleanChapter.slice(0, 16) : '법정서식 수록';

                    html += `
                        <td class="align-top p-space-md text-center bg-surface-container-lowest">
                            <div class="flex flex-col items-center gap-1 font-legal-code text-legal-code text-on-surface-variant">
                                <span class="font-bold text-on-surface" title="${gRef.file}">${shortFile}</span>
                                <span class="px-space-xs py-0.5 rounded bg-surface-container text-primary font-medium">${formText}</span>
                                <span class="font-num">${gRef.page || ''}</span>
                                <button 
                                    type="button" 
                                    onclick="window.jumpToArchive('${gRef.archiveId || 'doc-004'}')" 
                                    class="mt-1 inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer" 
                                    title="${gRef.file} 원문 열람"
                                >
                                    <span>지침서 열람</span>
                                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        </td>
                    `;

                    html += `</tr>`;
                });
            });
        });

        return html;
    }

    /**
     * 모바일 스마트 카드 렌더러
     */
    function renderMobileCards(nodes) {
        return nodes.map(node => {
            const domainMeta = DOMAIN_MAP[node.domainId] || { key: 'misc', icon: 'corporate_fare', short: node.domainId };
            const ministryName = SECTION_1_KEYS.includes(node.domainId) ? '보건복지부' : '관계부처';
            const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];
            const gRef = node.guidelineRef || { file: '공식 업무안내', page: '', archiveId: 'doc-004' };

            return `
                <div id="mobile-card-${node.id}" class="bg-surface-container-lowest border border-surface-container rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm" data-domain="${domainMeta.key}">
                    <div class="flex items-center justify-between border-b border-surface-container pb-space-xs">
                        <div class="flex items-center gap-space-xs">
                            <span class="material-symbols-outlined text-primary text-[20px]">${domainMeta.icon}</span>
                            <span class="font-headline-sm text-headline-sm font-bold text-primary">${domainMeta.short}</span>
                        </div>
                        <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
                            ${ministryName}
                        </span>
                    </div>
                    <div class="flex flex-col gap-space-xs">
                        <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                            <div class="flex items-center justify-between">
                                <span class="font-label-md text-label-md font-bold text-primary flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    ${node.level1} ➔ ${node.level2}
                                </span>
                            </div>
                            <div class="bg-surface-container-lowest p-space-xs rounded border border-surface-container flex flex-col gap-1">
                                <span class="font-label-sm text-label-sm font-bold text-on-surface">${node.level3}</span>
                                <div class="font-body-sm text-body-sm text-on-surface-variant space-y-0.5">
                                    ${bullets.map(b => `<div>• ${b}</div>`).join('')}
                                </div>
                                <div class="flex items-center justify-between pt-1 border-t border-surface-container-low">
                                    <span class="font-legal-code text-legal-code text-secondary font-semibold font-num">
                                        지침 ${gRef.page || ''}
                                    </span>
                                    <button 
                                        type="button" 
                                        onclick="window.jumpToArchive('${gRef.archiveId || 'doc-004'}')" 
                                        class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-legal-code text-legal-code font-bold flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <span>지침서</span>
                                        <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function bindEvents() {
        const input = document.getElementById('matrixSearchInput');
        if (input) {
            input.addEventListener('keyup', filterMatrixTable);
        }
    }

    // 필터링 인터랙션 로직
    window.selectDomainFilter = function (domainKey, buttonElement) {
        currentDomainFilter = domainKey;
        const buttons = document.querySelectorAll('.domain-tab-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-on-primary', 'font-bold', 'shadow-sm');
            btn.classList.add('bg-surface-container', 'text-on-surface-variant', 'font-medium');
        });
        if (buttonElement) {
            buttonElement.classList.add('bg-primary', 'text-on-primary', 'font-bold', 'shadow-sm');
            buttonElement.classList.remove('bg-surface-container', 'text-on-surface-variant', 'font-medium');
        }

        applyFilters();
    };

    window.selectMinistryGroup = function (minKey, buttonElement) {
        currentMinistryGroup = minKey;
        const minButtons = document.querySelectorAll('.ministry-btn');
        minButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
            btn.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        if (buttonElement) {
            buttonElement.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
            buttonElement.classList.remove('bg-surface-container', 'text-on-surface-variant');
        }

        const subgroups = document.querySelectorAll('.ministry-subgroup');
        subgroups.forEach(sg => {
            const sgMin = sg.getAttribute('data-ministry');
            if (minKey === 'all' || sgMin === minKey) {
                sg.style.display = '';
            } else {
                sg.style.display = 'none';
            }
        });

        applyFilters();
    };

    function filterMatrixTable() {
        currentSearchKeyword = (document.getElementById('matrixSearchInput')?.value || '').toLowerCase().trim();
        applyFilters();
    }

    function applyFilters() {
        const rows1 = document.querySelectorAll('#hierarchicalMatrixTable tbody tr.domain-row');
        const rows2 = document.querySelectorAll('#hierarchicalMatrixTable2 tbody tr.domain-row');
        const mobileCards = document.querySelectorAll('#mobileCardsContainer > div');

        const sec1Card = document.getElementById('section1Container');
        const sec2Card = document.getElementById('section2Container');

        let matchedCount = 0;

        // Helper filter function
        const matchRow = (row) => {
            const d = row.getAttribute('data-domain');
            const k = (row.getAttribute('data-keywords') || '') + ' ' + row.innerText.toLowerCase();

            // Ministry match
            let minMatch = true;
            if (currentMinistryGroup === 'mohw') {
                minMatch = ['community', 'elder', 'disabled', 'child', 'infant', 'mental', 'crisis'].includes(d);
            } else if (currentMinistryGroup === 'mogef') {
                minMatch = ['family', 'youth'].includes(d);
            } else if (currentMinistryGroup === 'moe') {
                minMatch = ['school'].includes(d);
            } else if (currentMinistryGroup === 'moel') {
                minMatch = ['selfhelp'].includes(d);
            } else if (currentMinistryGroup === 'civic') {
                minMatch = ['donation'].includes(d);
            }

            // Domain match
            let domMatch = (currentDomainFilter === 'all') || (d === currentDomainFilter);

            // Search keyword match
            let kwMatch = !currentSearchKeyword || k.includes(currentSearchKeyword);

            return minMatch && domMatch && kwMatch;
        };

        let sec1HasVisible = false;
        rows1.forEach(row => {
            if (matchRow(row)) {
                row.style.display = '';
                sec1HasVisible = true;
                matchedCount++;
            } else {
                row.style.display = 'none';
            }
        });

        let sec2HasVisible = false;
        rows2.forEach(row => {
            if (matchRow(row)) {
                row.style.display = '';
                sec2HasVisible = true;
                matchedCount++;
            } else {
                row.style.display = 'none';
            }
        });

        mobileCards.forEach(card => {
            if (matchRow(card)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        if (sec1Card) sec1Card.style.display = sec1HasVisible ? '' : 'none';
        if (sec2Card) sec2Card.style.display = sec2HasVisible ? '' : 'none';

        // Update tag
        const tag = document.getElementById('displayCountTag');
        if (tag) {
            if (currentSearchKeyword) {
                tag.textContent = `검색 결과: ${matchedCount}개 단위서비스 일치`;
            } else if (currentDomainFilter !== 'all' || currentMinistryGroup !== 'all') {
                tag.textContent = `필터링 표시 중 (${matchedCount}개 단위서비스)`;
            } else {
                tag.textContent = '전체 12개 실천분야 / 167개 법정단위서비스 수록';
            }
        }
    }

    window.resetHierarchyFilters = function () {
        const input = document.getElementById('matrixSearchInput');
        if (input) input.value = '';
        currentSearchKeyword = '';
        currentDomainFilter = 'all';
        currentMinistryGroup = 'all';

        const firstTab = document.querySelector('.domain-tab-btn');
        if (firstTab) window.selectDomainFilter('all', firstTab);

        const firstMinTab = document.querySelector('.ministry-btn');
        if (firstMinTab) window.selectMinistryGroup('all', firstMinTab);
    };

    // 지침서 아카이브로 점프
    window.jumpToArchive = function (archiveId) {
        if (typeof window.showView === 'function') {
            window.showView('archive', { highlightId: archiveId });
        }
    };

    // 특정 노드 하이라이트 및 스크롤
    function highlightAndScrollNode(nodeId) {
        const desktopTr = document.getElementById(`hierarchy-node-${nodeId}`);
        if (desktopTr && desktopTr.style.display !== 'none') {
            desktopTr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            desktopTr.classList.add('bg-amber-100', 'transition-colors', 'duration-500');
            setTimeout(() => desktopTr.classList.remove('bg-amber-100'), 2500);
            return;
        }

        const mobileCard = document.getElementById(`mobile-card-${nodeId}`);
        if (mobileCard) {
            mobileCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            mobileCard.classList.add('ring-4', 'ring-primary');
            setTimeout(() => mobileCard.classList.remove('ring-4', 'ring-primary'), 2500);
        }
    }

    // CSV 내보내기
    window.exportHierarchyCSV = function () {
        const { nodes } = getDB();
        let csvContent = "\uFEFF1단계_실천분야,2단계_대분류_법정기능,3단계_중분류_사업체계,소분류_단위서비스실천내용,공식지침서_법정서식,지침서페이지\n";

        nodes.forEach(n => {
            const bullets = (n.details || []).join(' / ');
            const gRef = n.guidelineRef || { file: '', page: '' };
            const row = [
                `"${n.domainId}"`,
                `"${n.level1}"`,
                `"${n.level2}"`,
                `"${n.level3}"`,
                `"${bullets.replace(/"/g, '""')}"`,
                `"${gRef.file.replace(/"/g, '""')}"`,
                `"${gRef.page}"`
            ];
            csvContent += row.join(',') + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `대한민국_사회복지_90개_법정단위서비스_위계매트릭스_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

})();
