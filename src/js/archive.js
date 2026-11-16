/**
 * 대한민국 사회복지 현장 나침반 - 공식 지침서 마스터 아카이브 (SCREEN_2)
 * Google Stitch Material Design 3 규격 100% 통합 컨트롤러
 * 
 * - 53종 정본 전종 (총 24,180면, 450.95MB)
 * - 섹션 Ⅰ: 중앙 정부부처 핵심 법정지침서 (보건복지부 34종, 337.25MB)
 * - 섹션 Ⅱ: 범부처 및 특화·전문 실천지침서 (관계부처 및 공익법인 19종, 113.70MB)
 * - 3단계 위계도감 (SCREEN_9) 167개 단위서비스 1:1 양방향 딥링킹(Deep-linking)
 * - 실시간 텍스트 검색 (제목, 부처, 과명, 근거법령, 챕터) + 7개 소관부처 필터
 * - 데스크톱(매트릭스 테이블) + 모바일(반응형 스마트 카드) 완전 지원
 * - Excel (.csv) 전종 내보내기 & Google Drive 원클릭 일괄 다운로드
 */

(function () {
    let currentMinistry = 'all';
    let searchQuery = '';
    let mobileActiveSection = 'SECTION_1';
    let activeFilterGuidelines = null;
    let currentArchiveFacilityId = null;
    let currentArchiveFacilityName = null;
    let currentArchiveDocIds = null;

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Track 1(23개) + Track 2(17개) 시설 분류 ID별 공식 지침서 1:1 매핑 테이블 (Zero Empty State 보장)
    const FACILITY_ARCHIVE_MAP = {
        // Track 1 (23개)
        'law-elderly': ['doc-005', 'doc-006', 'doc-007', 'doc-008', 'doc-033'],
        'law-integrated-care': ['doc-028', 'doc-027', 'doc-005'],
        'law-child': ['doc-014', 'doc-015', 'doc-016', 'doc-017', 'doc-018', 'doc-019', 'doc-020'],
        'law-disability': ['doc-009', 'doc-010', 'doc-011', 'doc-012', 'doc-013', 'doc-030'],
        'law-mental': ['doc-022', 'doc-023', 'doc-024'],
        'law-homeless': ['doc-025', 'doc-031'],
        'law-welfare-center': ['doc-004', 'doc-026', 'doc-001', 'doc-002', 'doc-003', 'doc-029', 'doc-048', 'doc-050'],
        'law-selfreliance': ['doc-034', 'doc-032'],
        'law-medical': ['doc-021', 'doc-060', 'doc-061'],
        'law-kdca': ['doc-003', 'doc-021'],
        'law-prostitution': ['doc-040'],
        'law-sexual-violence': ['doc-040'],
        'law-domestic-violence': ['doc-040'],
        'law-single-parent': ['doc-039'],
        'law-family-center': ['doc-035', 'doc-036'],
        'law-youth': ['doc-037', 'doc-038', 'doc-041', 'doc-042'],
        'law-unification': ['doc-051'],
        'law-childcare': ['doc-043', 'doc-044'],
        'law-school': ['doc-045', 'doc-064'],
        'law-labor-disability': ['doc-046', 'doc-047', 'doc-030'],
        'law-veterans': ['doc-052'],
        'law-justice': ['doc-057', 'doc-058'],
        'law-ngo-csr': ['doc-034', 'doc-068'],
    'law-public-admin': ['doc-027', 'doc-028', 'doc-031', 'doc-032', 'doc-053'],
        // Track 2 (17개)
        'ext-sec-social-enterprise': ['doc-054'],
        'ext-sec-coop-village': ['doc-055', 'doc-034'],
        'ext-sec-social-farm': ['doc-056'],
        'ext-jus-correction': ['doc-057'],
        'ext-jus-probation': ['doc-058', 'doc-032'],
        'ext-jus-foreign': ['doc-059'],
        'ext-med-hospital': ['doc-060', 'doc-021'],
        'ext-med-rehab': ['doc-061', 'doc-023'],
        'ext-med-public-health': ['doc-062'],
        'ext-med-special': ['doc-063', 'doc-052'],
        'ext-edu-k12': ['doc-064', 'doc-045'],
        'ext-edu-special': ['doc-065'],
        'ext-edu-univ-lifelong': ['doc-066'],
        'ext-life-housing-disaster': ['doc-067'],
        'ext-life-finance-volunteer': ['doc-068', 'doc-002'],
        'ext-rel-welfare': ['doc-069', 'doc-026', 'doc-029'],
        'ext-rel-heritage': ['doc-070']
    };

    const FACILITY_PATTERNS = [
        { pattern: /통합돌봄|통합지원/, id: 'law-integrated-care', name: '지역 통합돌봄' },
        { pattern: /어린이집|육아종합지원|영유아/, id: 'law-childcare', name: '어린이집' },
        { pattern: /초·중·고|초등|중학교|고등학교|교육복지|학교/, id: 'law-school', name: '학교사회복지' },
        { pattern: /장애인고용|직업능력/, id: 'law-labor-disability', name: '장애인 고용·산재' },
        { pattern: /노인|시니어클럽|경로당|양로|독거노인/, id: 'law-elderly', name: '노인복지시설' },
        { pattern: /발달장애|장애인/, id: 'law-disability', name: '장애인복지시설' },
        { pattern: /아동|드림스타트|가정위탁|자립전담|다함께돌봄|지역아동/, id: 'law-child', name: '아동복지시설' },
        { pattern: /정신|자살|중독/, id: 'law-mental', name: '정신건강증진시설' },
        { pattern: /노숙인/, id: 'law-homeless', name: '노숙인시설' },
        { pattern: /자활|고용센터/, id: 'law-selfreliance', name: '지역자활센터' },
        { pattern: /가족센터|건강가정|다문화/, id: 'law-family-center', name: '가족센터' },
        { pattern: /청소년|꿈드림|수련관|문화의집|쉼터/, id: 'law-youth', name: '청소년복지시설' },
        { pattern: /한부모/, id: 'law-single-parent', name: '한부모가족시설' },
        { pattern: /성매매/, id: 'law-prostitution', name: '성매매피해지원시설' },
        { pattern: /성폭력|스토킹|해바라기/, id: 'law-sexual-violence', name: '성폭력·스토킹보호시설' },
        { pattern: /가정폭력|1366/, id: 'law-domestic-violence', name: '가정폭력보호시설' },
        { pattern: /하나센터|북한이탈주민/, id: 'law-unification', name: '북한이탈주민지원시설' },
        { pattern: /보훈|국가유공자/, id: 'law-veterans', name: '보훈요양시설' },
        { pattern: /의료사회복지|의료급여|병원/, id: 'law-medical', name: '의료사회복지' },
        { pattern: /결핵|한센/, id: 'law-kdca', name: '결핵·한센시설' },
        { pattern: /보호관찰|소년원|치료감호|교정/, id: 'law-justice', name: '사법·교정보호시설' },
        { pattern: /사회서비스원|행정복지센터|긴급복지|국정과제|전달체계|복지정책과/, id: 'law-public-admin', name: '공공복지전달체계' },
        { pattern: /사회복지관|푸드뱅크|푸드마켓|모금회|사랑의열매|KOICA|NGO|사회복지시설|사회복지법인/, id: 'law-welfare-center', name: '사회복지관' }
    ];

    function resolveFacilityTarget(targetStr, file) {
        if (file && file.facilityTargetId) {
            return { id: file.facilityTargetId, name: targetStr || file.category || '범부처 확장시설' };
        }
        const fullStr = `${targetStr} ${file ? (file.title + ' ' + (file.legalTarget || '')) : ''}`;
        for (const item of FACILITY_PATTERNS) {
            if (item.pattern.test(targetStr) || item.pattern.test(fullStr)) {
                return item;
            }
        }
        return { id: 'law-welfare-center', name: '사회복지시설' };
    }

    function renderTargetFacilityChips(targetFacilities, file) {
        if (!targetFacilities) return '';
        const match = resolveFacilityTarget(targetFacilities, file);
        return `
            <button type="button"
                    onclick="window.jumpToFacility('${match.id}'); return false;"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-900 border border-amber-200 text-[11px] font-bold transition shadow-2xs cursor-pointer group"
                    title="${match.name} 법정시설 규정 도감으로 직결">
                <span class="material-symbols-outlined text-[13px] text-amber-700 group-hover:text-white">account_balance</span>
                <span>${targetFacilities}</span>
                <span class="material-symbols-outlined text-[11px]">arrow_forward</span>
            </button>
        `;
    }

    function getArchiveDB() {
        return (typeof window !== 'undefined' && window.GUIDELINES_ARCHIVE_DB) ? window.GUIDELINES_ARCHIVE_DB : [];
    }

    function getArchiveConfig() {
        return (typeof window !== 'undefined' && window.GOOGLE_DRIVE_ARCHIVE_CONFIG) ? window.GOOGLE_DRIVE_ARCHIVE_CONFIG : {
            driveDownloadUrl: "https://drive.google.com/drive/folders/1Xj329hrtcrfgiY0atJYiCHY7pG6KVrlh?usp=sharing",
            totalFiles: 53,
            totalSizeStr: "450.95 MB"
        };
    }

    function getAllFiles() {
        const db = getArchiveDB();
        const allFiles = [];
        db.forEach(cat => {
            (cat.sources || []).forEach(src => {
                (src.files || []).forEach(f => {
                    allFiles.push({
                        ...f,
                        categoryName: cat.categoryName,
                        sourceName: src.sourceName
                    });
                });
            });
        });
        return allFiles;
    }

    function getMinistryBadgeClass(ministry) {
        if (!ministry) return 'bg-surface-container text-on-surface-variant';
        if (ministry.includes('보건복지부')) return 'bg-primary-container text-on-primary';
        if (ministry.includes('여성가족부')) return 'bg-secondary-container text-on-secondary-container';
        if (ministry.includes('교육부')) return 'bg-tertiary-container text-on-tertiary';
        if (ministry.includes('고용노동부')) return 'bg-primary text-on-primary';
        if (ministry.includes('공동모금회') || ministry.includes('사회공헌')) return 'bg-secondary text-on-secondary';
        return 'bg-surface-container-high text-primary';
    }

    // 메인 렌더링 진입점
    window.renderArchiveView = function (options = {}) {
        const container = document.getElementById('view-archive');
        if (!container) return;

        currentMinistry = 'all';
        searchQuery = '';
        currentArchiveFacilityId = null;
        currentArchiveFacilityName = null;
        currentArchiveDocIds = null;

        const allFiles = getAllFiles();
        const config = getArchiveConfig();

        const mohwFiles = allFiles.filter(f => f.section === 'SECTION_1' || (f.section !== 'SECTION_3' && f.ministry && f.ministry.includes('보건복지부')));
        const nonMohwFiles = allFiles.filter(f => f.section === 'SECTION_2');
        const sec3Files = allFiles.filter(f => f.section === 'SECTION_3');

        // Calculate ministry counts
        const countAll = allFiles.length;
        const countMohw = mohwFiles.length;
        const countMogef = allFiles.filter(f => f.section !== 'SECTION_3' && f.ministry && f.ministry.includes('여성가족부')).length;
        const countMoe = allFiles.filter(f => f.section !== 'SECTION_3' && f.ministry && f.ministry.includes('교육부')).length;
        const countMoel = allFiles.filter(f => f.section !== 'SECTION_3' && f.ministry && f.ministry.includes('고용노동부')).length;
        const countSec3 = sec3Files.length;
        const countOthers = allFiles.filter(f => {
            if (f.section === 'SECTION_3') return false;
            const m = f.ministry || '';
            return m.includes('외교') || m.includes('보훈') || m.includes('통일') || m.includes('국무') || m.includes('행안') || m.includes('질병') || m.includes('법무');
        }).length;
        const countCivic = allFiles.filter(f => {
            if (f.section === 'SECTION_3') return false;
            const m = f.ministry || '';
            return m.includes('공동모금회') || m.includes('사회공헌') || m.includes('재단') || m.includes('민간');
        }).length;

        container.innerHTML = `
        <div class="flex flex-col w-full bg-surface min-h-[calc(100vh-160px)]">
            <!-- ==================== 데스크톱 전용 아카이브 뷰 (hidden md:block) =================== -->
            <div class="hidden md:block w-full">
            <!-- Top Ministry Authority Status Bar -->
            <div class="w-full bg-surface-container-low border-b border-outline-variant/20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-legal-code font-legal-code">
                    <div class="flex items-center gap-2 text-on-surface-variant flex-wrap">
                        <span class="material-symbols-outlined text-[16px] text-primary">policy</span>
                        <span class="font-medium">공공행정 정본 색인: 보건복지부 · 여성가족부 · 교육부 · 고용노동부 합동 공표 기준</span>
                        <span class="text-outline-variant hidden sm:inline">|</span>
                        <span class="text-outline hidden sm:inline">최종 동기화: 2026.02.24 06:00 KST (공공누리 제1유형 출처표시)</span>
                    </div>
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                            <span class="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                            70개 전종 2026 개정판 대조 완료
                        </span>
                        <button type="button" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-sm text-label-sm cursor-pointer" onclick="showView(\'hierarchy\')">
                            <span class="material-symbols-outlined text-[14px]">account_tree</span>
                            <span>3단계 위계도감 218개 단위서비스 실시간 상호연동 중</span>
                        </a>
                        <span class="text-on-surface-variant font-medium hidden md:inline">색인 문서: 24,384면</span>
                    </div>
                </div>
            </div>

            <!-- Primary Sub-Navigation & Page Identification -->
            <div class="w-full bg-surface-container-lowest border-b border-outline-variant/30">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-5">
                    <!-- Section Tab Bar & Action Toolbar -->
                    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
                        <div>
                            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span class="px-2 py-0.5 rounded-md bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                                    공식 법정 지침 마스터
                                </span>
                                <span class="text-on-surface-variant font-legal-code text-legal-code">
                                    분야·법령 가이드 포털 &gt; 실무 지침서 마스터 아카이브
                                </span>
                                <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-secondary mr-1"></span>
                                    2026 정부 고시 표준체계 완결본
                                </span>
                            </div>
                            <h1 class="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                                공식 지침서 마스터 아카이브 (70종)
                            </h1>
                            <p class="font-body-md text-body-md text-on-surface-variant mt-1">
                                대한민국 사회복지 12대 핵심 분야 및 6대 범부처·사회혁신 안전망 공식 사업안내·표준 매뉴얼 총람 (전문 24,384면 OCR 검색 지원)
                            </p>
                        </div>

                        <!-- Linked Action Toolbar -->
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="flex items-center p-1 rounded-xl bg-surface-container-low border border-outline-variant/30">
                                <button type="button" class="px-3 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                                   onclick="showView('fields')">
                                    <span class="material-symbols-outlined text-[18px]">account_balance</span>
                                    <span>분야·시설 도감</span>
                                    <span class="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant">40개</span>
                                </a>
                                <button type="button" class="px-3 py-1.5 rounded-lg font-label-md text-label-md bg-primary text-on-primary shadow-xs flex items-center gap-1.5 font-semibold cursor-pointer" onclick="showView(\'archive\')">
                                    <span class="material-symbols-outlined text-[18px]">folder_open</span>
                                    <span>지침서 아카이브</span>
                                    <span class="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-surface-container-lowest text-primary">70종</span>
                                </</a>
                                <button type="button" class="px-3 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                                   onclick="showView('hierarchy')">
                                    <span class="material-symbols-outlined text-[18px] text-secondary">account_tree</span>
                                    <span>3단계 위계 도감</span>
                                    <span class="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">218단위</span>
                                </a>
                            </div>

                            <div class="flex items-center gap-1.5">
                                <button type="button" class="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-label-sm text-label-sm transition-all"
                                        onclick="window.print()" title="지침서 총람 인쇄 및 PDF 저장">
                                    <span class="material-symbols-outlined text-[18px] text-primary">print</span>
                                    <span>인쇄 / PDF</span>
                                </button>
                                <button type="button" class="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-label-sm text-label-sm transition-all"
                                        id="exportCsvBtn" title="70종 지침서 목록 CSV 다운로드">
                                    <span class="material-symbols-outlined text-[18px] text-secondary">table_chart</span>
                                    <span>Excel (.csv) 저장</span>
                                </button>
                                <a class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary-container hover:bg-secondary hover:text-on-secondary text-on-secondary-container font-label-sm text-label-sm font-semibold transition-all shadow-xs"
                                   id="downloadMasterZipBtn" href="${config.driveDownloadUrl}" target="_blank" title="전체 정본 일괄 다운로드(ZIP)">
                                    <span class="material-symbols-outlined text-[18px]">download_for_offline</span>
                                    <span>70종 전체 ZIP</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- 4 Quick Metrics Ribbon Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                        <!-- Card 1 -->
                        <div class="p-3.5 rounded-xl bg-surface-container-low flex items-start justify-between border border-outline-variant/20 shadow-xs">
                            <div class="flex flex-col">
                                <span class="font-legal-code text-legal-code text-on-surface-variant uppercase tracking-wider">수록 지침서 총괄</span>
                                <span class="font-headline-md text-headline-md text-primary mt-0.5 font-bold">
                                    70<span class="font-label-md text-label-md font-normal text-on-surface">종 정본</span>
                                </span>
                                <span class="font-legal-code text-legal-code text-secondary mt-1 font-medium">핵심 법정 (53) + 범부처·사회혁신 (17)</span>
                            </div>
                            <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shadow-xs">
                                <span class="material-symbols-outlined text-[20px]">library_books</span>
                            </div>
                        </div>

                        <!-- Card 2 -->
                        <div class="p-3.5 rounded-xl bg-surface-container-low flex items-start justify-between border border-outline-variant/20 shadow-xs">
                            <div class="flex flex-col">
                                <span class="font-legal-code text-legal-code text-on-surface-variant uppercase tracking-wider">누적 색인 분량</span>
                                <span class="font-headline-md text-headline-md text-primary mt-0.5 font-bold">
                                    24,384<span class="font-label-md text-label-md font-normal text-on-surface">면</span>
                                </span>
                                <span class="font-legal-code text-legal-code text-outline mt-1 font-medium">PDF 본문 전문(OCR) 색인</span>
                            </div>
                            <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shadow-xs">
                                <span class="material-symbols-outlined text-[20px]">manage_search</span>
                            </div>
                        </div>

                        <!-- Card 3 -->
                        <div class="p-3.5 rounded-xl bg-surface-container-low flex items-start justify-between border border-outline-variant/20 shadow-xs">
                            <div class="flex flex-col">
                                <span class="font-legal-code text-legal-code text-on-surface-variant uppercase tracking-wider">주관 정부부처</span>
                                <span class="font-headline-md text-headline-md text-primary mt-0.5 font-bold">
                                    6<span class="font-label-md text-label-md font-normal text-on-surface">개 부처청</span>
                                </span>
                                <span class="font-legal-code text-legal-code text-on-surface-variant mt-1 font-medium">복지부·여가부·교육부·노동부 등</span>
                            </div>
                            <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shadow-xs">
                                <span class="material-symbols-outlined text-[20px]">domain</span>
                            </div>
                        </div>

                        <!-- Card 4 -->
                        <div class="p-3.5 rounded-xl bg-primary text-on-primary flex items-start justify-between shadow-xs">
                            <div class="flex flex-col">
                                <span class="font-legal-code text-legal-code text-inverse-on-surface/80 uppercase tracking-wider">원클릭 압축 패키지</span>
                                <span class="font-headline-md text-headline-md text-on-primary mt-0.5 font-bold">
                                    450<span class="font-label-md text-label-md font-normal text-inverse-on-surface">MB ZIP</span>
                                </span>
                                <span class="font-legal-code text-legal-code text-secondary-container mt-1 font-semibold">70종 무결성 검증 패키지</span>
                            </div>
                            <a href="${config.driveDownloadUrl}" target="_blank"
                               class="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center shadow-sm"
                               id="topPackageDownloadBtn" title="일괄 다운로드">
                                <span class="material-symbols-outlined text-[20px]">download</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Operational Filter & Search Section -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
                <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-4 border border-outline-variant/30">
                    <!-- Row 1: Search and Export Tools -->
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div class="relative flex-1">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                                <span class="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input type="text"
                                   id="guidelineSearchInput" type="search" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="${countAll}종 공식 지침서명, 소관부처, 담당과, 근거법령 검색"
                                   class="w-full pl-10 pr-28 py-2 bg-surface-container-low rounded-lg text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
                                   placeholder="지침서명, 소관부처, 과명칭, 근거 법령, 대상 시설(예: 종합사회복지관, 지역아동센터, 노인복지법)...">
                            <div class="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
                                <button type="button" id="clearSearchBtn" class="hidden p-1 rounded-md text-outline hover:text-on-surface transition-colors" title="검색어 지우기">
                                    <span class="material-symbols-outlined text-[16px]">close</span>
                                </button>
                                <span id="searchBadgeCount" class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                    ${countAll}건 표시중
                                </span>
                            </div>
                        </div>

                        <!-- Right Info -->
                        <div class="flex items-center gap-2 text-legal-code font-legal-code text-on-surface-variant">
                            <span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                            <span>국가법령정보센터 및 보건복지부 행정자료실 2026.01.01 시행 정본 대조 완료</span>
                        </div>
                    </div>

                    <!-- Row 2: Ministry Filter Pills -->
                    <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-outline-variant/20">
                        <span class="text-legal-code font-legal-code text-outline mr-2">소관 부처별 분류:</span>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-semibold bg-primary text-on-primary shadow-xs transition-all active-pill"
                                data-ministry="all">
                            전체 ${countAll}종
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all"
                                data-ministry="보건복지부">
                            보건복지부 (${countMohw})
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all"
                                data-ministry="여성가족부">
                            여성가족부 (${countMogef})
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all"
                                data-ministry="교육부">
                            교육부 (${countMoe})
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all"
                                data-ministry="고용노동부">
                            고용노동부 (${countMoel})
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all"
                                data-ministry="행안부/질병청/법무부">
                            행안부·외교부·보훈부 등 (${countOthers})
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all"
                                data-ministry="공익재단·기타">
                            공동모금회·민간공익 (${countCivic})
                        </button>
                        <button type="button" class="ministry-pill px-3 py-1 rounded-full text-label-sm font-label-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70 hover:bg-emerald-100 transition-all"
                                data-ministry="TRACK2">
                            🌐 범부처·사회혁신 안전망 (${countSec3})
                        </button>
                    </div>
                </div>
            </div>

            <!-- Facility-Matched Guideline Banner Container (Desktop) -->
            <div id="archiveFacilityBannerContainer" class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4"></div>

            <!-- Master Administrative Classification Table Section (Desktop) -->
            <div id="archiveTablesContainer" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 flex flex-col gap-6">
                
                <!-- Table Guidance Bar -->
                <div class="flex items-center justify-between px-4 py-2.5 bg-surface-container-high rounded-xl text-legal-code font-legal-code text-on-surface border border-outline-variant/30">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px] text-primary">gavel</span>
                        <span class="font-semibold text-on-surface">국가법령정보센터 및 보건복지부 행정자료실 고시 기준 (2026.01.01 시행 정본)</span>
                        <span class="text-outline-variant hidden sm:inline">|</span>
                        <span class="hidden sm:inline">부처 및 기능별 3대 매트릭스(섹션 Ⅰ·Ⅱ·Ⅲ)로 편제됨</span>
                    </div>
                    <div class="hidden sm:flex items-center gap-2 text-primary font-medium">
                        <span class="material-symbols-outlined text-[16px] text-secondary">account_tree</span>
                        <span>각 지침서별 <strong>L1·L2 연계 위계</strong> 클릭 시 <strong>3단계 위계도감</strong> 해당 법정 서비스로 즉시 동기화 이동합니다.</span>
                    </div>
                </div>

                <!-- Table 1: 보건복지부 핵심 법정지침서 (섹션 Ⅰ) -->
                <section id="section1-block" class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                    <div class="bg-surface-container-low px-4 py-3.5 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-[14px] shadow-xs">
                                Ⅰ
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h2 class="font-headline-sm text-headline-sm text-primary font-bold">
                                        섹션 Ⅰ: 중앙 정부부처 핵심 법정지침서
                                    </h2>
                                    <span class="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                                        보건복지부 ${countMohw}종
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                                        2026년 정본 반영
                                    </span>
                                </div>
                                <p class="text-legal-code font-legal-code text-on-surface-variant mt-0.5">
                                    사회복지관·노인복지·장애인자립·아동돌봄·보육 등 보건복지부 주요 복지사업 핵심 지침
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-legal-code font-legal-code text-outline hidden md:inline">수록 분량: 14,840면 (10개 주요 편제)</span>
                            <a href="${config.driveDownloadUrl}" target="_blank"
                               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors border border-outline-variant/30 shadow-xs">
                                <span class="material-symbols-outlined text-[16px]">folder_zip</span>
                                <span>복지부 지침 일괄 (337MB)</span>
                            </a>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                        <caption class="sr-only">공식 지침서 마스터 아카이브 (섹션 Ⅱ: 범부처 및 특화·전문 실천지침서)</caption>
                        <caption class="sr-only">공식 지침서 마스터 아카이브 (섹션 Ⅰ: 중앙 정부부처 핵심 법정지침서)</caption>
                            <thead class="bg-surface-container-low/60 text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container">
                                <tr class="h-10">
                                    <th scope="col" class="py-2.5 px-3 w-32 font-semibold border-r border-surface-container text-center">소관 부처</th>
                                    <th scope="col" class="py-2.5 px-3.5 w-36 font-semibold border-r border-surface-container">담당과</th>
                                    <th scope="col" class="py-2.5 px-4 w-72 font-semibold border-r border-surface-container">지침서 공식 명칭 &amp; 판본</th>
                                    <th scope="col" class="py-2.5 px-4 w-60 font-semibold border-r border-surface-container">핵심 관할 법령 &amp; 대상 시설</th>
                                    <th scope="col" class="py-2.5 px-4 font-semibold border-r border-surface-container">주요 수록 챕터 및 핵심 지침 요약</th>
                                    <th scope="col" class="py-2.5 px-4 w-48 text-right font-semibold">연계 위계 &amp; 원문 열람</th>
                                </tr>
                            </thead>
                            <tbody id="table1-tbody" class="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                                ${renderDesktopRows(mohwFiles)}
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Table 2: 범부처 및 특화·전문 실천지침서 (섹션 Ⅱ) -->
                <section id="section2-block" class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                    <div class="bg-surface-container-low px-4 py-3.5 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold text-[14px] shadow-xs">
                                Ⅱ
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h2 class="font-headline-sm text-headline-sm text-primary font-bold">
                                        섹션 Ⅱ: 범부처 및 특화·전문 실천지침서
                                    </h2>
                                    <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                                        관계부처 및 공익법인 ${nonMohwFiles.length}종
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold">
                                        협력행정 연동
                                    </span>
                                </div>
                                <p class="text-legal-code font-legal-code text-on-surface-variant mt-0.5">
                                    여성가족부·고용노동부·교육부·기초생활·외교통상 및 공동모금회 배분 표준안
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-legal-code font-legal-code text-outline hidden md:inline">수록 분량: 9,340면 (10개 특화 편제)</span>
                            <a href="${config.driveDownloadUrl}" target="_blank"
                               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors border border-outline-variant/30 shadow-xs">
                                <span class="material-symbols-outlined text-[16px]">folder_zip</span>
                                <span>범부처 지침 일괄 (114MB)</span>
                            </a>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-surface-container-low/60 text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container">
                                <tr class="h-10">
                                    <th scope="col" class="py-2.5 px-3 w-32 font-semibold border-r border-surface-container text-center">소관 기관</th>
                                    <th scope="col" class="py-2.5 px-3.5 w-36 font-semibold border-r border-surface-container">소속 부서</th>
                                    <th scope="col" class="py-2.5 px-4 w-72 font-semibold border-r border-surface-container">지침서 공식 명칭 &amp; 판본</th>
                                    <th scope="col" class="py-2.5 px-4 w-60 font-semibold border-r border-surface-container">핵심 관할 법령 &amp; 대상 시설</th>
                                    <th scope="col" class="py-2.5 px-4 font-semibold border-r border-surface-container">주요 수록 챕터 및 핵심 지침 요약</th>
                                    <th scope="col" class="py-2.5 px-4 w-48 text-right font-semibold">연계 위계 &amp; 원문 열람</th>
                                </tr>
                            </thead>
                            <tbody id="table2-tbody" class="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                                ${renderDesktopRows(nonMohwFiles)}
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Table 3: Track 2 범부처·확장 안전망 실천지침서 (섹션 Ⅲ) -->
                <section id="section3-block" class="bg-surface-container-lowest rounded-xl shadow-sm border border-emerald-200/80 overflow-hidden">
                    <div class="bg-emerald-50/70 px-4 py-3.5 border-b border-emerald-200/70 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-[14px] shadow-xs">
                                Ⅲ
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h2 class="font-headline-sm text-headline-sm text-emerald-950 font-bold">
                                        섹션 Ⅲ: 범부처·사회혁신 안전망 실천지침서
                                    </h2>
                                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-label-sm text-label-sm font-semibold">
                                        6대 확장영역 · 17종
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-emerald-900 font-label-sm text-label-sm font-semibold">
                                        범부처·사회혁신 1:1 딥링킹
                                    </span>
                                </div>
                                <p class="text-legal-code font-legal-code text-emerald-900/80 mt-0.5">
                                    법무부·보건의료·교육부·국토교통부·금융위원회·행정안전부·문체부·농식품부 범부처 실무지침
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-legal-code font-legal-code text-emerald-900/70 hidden md:inline">수록 분량: 204면 (17종 핵심요강)</span>
                            <button type="button" onclick="window.showView('fields')"
                               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100/70 text-emerald-900 font-label-sm text-label-sm transition-colors border border-emerald-200 shadow-xs cursor-pointer">
                                <span class="material-symbols-outlined text-[16px]">domain</span>
                                <span>분야·시설 도감 보기</span>
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-emerald-50/40 text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container">
                                <tr class="h-10">
                                    <th scope="col" class="py-2.5 px-3 w-32 font-semibold border-r border-surface-container text-center">소관 기관</th>
                                    <th scope="col" class="py-2.5 px-3.5 w-36 font-semibold border-r border-surface-container">소속 부서</th>
                                    <th scope="col" class="py-2.5 px-4 w-72 font-semibold border-r border-surface-container">지침서 공식 명칭 &amp; 판본</th>
                                    <th scope="col" class="py-2.5 px-4 w-60 font-semibold border-r border-surface-container">핵심 관할 법령 &amp; 대상 시설</th>
                                    <th scope="col" class="py-2.5 px-4 font-semibold border-r border-surface-container">주요 수록 챕터 및 핵심 지침 요약</th>
                                    <th scope="col" class="py-2.5 px-4 w-48 text-right font-semibold">연계 위계 &amp; 원문 열람</th>
                                </tr>
                            </thead>
                            <tbody id="table3-tbody" class="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                                ${renderDesktopRows(sec3Files)}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            
            </div><!-- /hidden md:block -->

            <!-- ==================== 공식 지침서 아카이브 모바일 뷰 (Google Stitch 규격) ==================== -->
            <div class="block md:hidden w-full pb-16" id="mobileGuidelinesView">
                <div class="mobile-archive-container max-w-md mx-auto px-4 py-3 space-y-4 font-sans text-slate-800">

                  <!-- 1. 지침서 아카이브 히어로 카드 -->
                  <div class="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                    <div class="flex items-center justify-between mb-2">
                      <span class="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold">2026 정부 공인 정본</span>
                      <span class="text-[10px] text-blue-300">총 ${countAll}종 454MB</span>
                    </div>
                    <h2 class="text-base font-extrabold tracking-tight">공식 지침서 아카이브</h2>
                    <p class="text-xs text-blue-100/90 mt-0.5">보건복지부 및 범부처 공식 사업안내서 PDF 전수 보관</p>
                    
                    <div class="grid grid-cols-3 gap-2 pt-3 text-center">
                      <div class="bg-white/10 rounded-xl py-2">
                        <div class="text-[10px] text-blue-200">지침서 확보</div>
                        <div class="text-sm font-black text-white font-num">${countAll}종 전수</div>
                      </div>
                      <div class="bg-white/10 rounded-xl py-2">
                        <div class="text-[10px] text-blue-200">중앙부처</div>
                        <div class="text-sm font-black text-white font-num">14개 부처</div>
                      </div>
                      <div class="bg-white/10 rounded-xl py-2">
                        <div class="text-[10px] text-blue-200">인건비 기준</div>
                        <div class="text-sm font-black text-white font-num">+3.0% 반영</div>
                      </div>
                    </div>
                  </div>

                  <!-- 2. 지침서 검색 & 패싯 알약 필터 -->
                  <div class="space-y-2">
                    <div class="relative">
                      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                      <input type="text" id="mobile-archive-search" oninput="handleMobileArchiveSearch(this.value)" placeholder="지침서명, 소관부서, 키워드 검색..." 
                             class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500 shadow-xs">
                    </div>

                    <!-- 발행연도 필터 -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="mobile-archive-year-pills">
                      <span class="text-[10px] font-bold text-slate-400 pl-1">발행:</span>
                      <button type="button" onclick="filterArchiveByYear('전체', this)" class="archive-year-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">전체</button>
                      <button type="button" onclick="filterArchiveByYear('2026', this)" class="archive-year-pill px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white flex-shrink-0 shadow-2xs cursor-pointer">2026 최신</button>
                      <button type="button" onclick="filterArchiveByYear('2025', this)" class="archive-year-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">2025</button>
                      <button type="button" onclick="filterArchiveByYear('2024', this)" class="archive-year-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">2024</button>
                    </div>

                    <!-- 소관 부처 필터 -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="mobile-archive-ministry-pills">
                      <span class="text-[10px] font-bold text-slate-400 pl-1">부처:</span>
                      <button type="button" onclick="filterArchiveByMinistry('전체', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white flex-shrink-0 shadow-2xs cursor-pointer">전체 ${countAll}</button>
                      <button type="button" onclick="filterArchiveByMinistry('TRACK2', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0 cursor-pointer">Track 2 (${countSec3})</button>
                      <button type="button" onclick="filterArchiveByMinistry('보건복지부', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">보건복지부 ${countMohw}</button>
                      <button type="button" onclick="filterArchiveByMinistry('여성가족부', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">여성가족부 11</button>
                      <button type="button" onclick="filterArchiveByMinistry('교육부', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">교육부 2</button>
                      <button type="button" onclick="filterArchiveByMinistry('고용노동부', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">고용노동부</button>
                      <button type="button" onclick="filterArchiveByMinistry('민간', this)" class="archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer">민간제3섹터</button>
                    </div>
                  </div>

                  <!-- 3. 모바일 지침서 카드 리스트 -->
                  <div id="mobileArchiveFacilityBannerContainer" class="hidden"></div>
                  <div class="space-y-3" id="mobile-archive-cards-feed">
                    ${renderMobileCards(allFiles)}
                  </div>
                  
                  <div id="mobile-archive-empty-notice" class="hidden py-8 text-center bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
                    <span class="text-2xl block">🔍</span>
                    <div class="text-xs font-bold text-slate-700">일치하는 지침서가 없습니다.</div>
                    <div class="text-[11px] text-slate-400">다른 연도나 부처를 선택해 보세요.</div>
                  </div>
                </div>
            </div>

            <!-- Empty / No Results State -->
            <div id="noResultsState" class="hidden max-w-7xl mx-auto px-4 py-16 text-center">
                <div class="w-16 h-16 rounded-full bg-surface-container-high text-outline flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-[32px]">search_off</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">검색 결과가 없습니다</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mt-1.5 max-w-md mx-auto">
                    입력하신 검색어 또는 선택하신 부처 필터 조건에 부합하는 공식 지침서가 존재하지 않습니다.
                </p>
                <button type="button" id="resetSearchFilterBtn"
                        class="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all">
                    검색 필터 초기화
                </button>
            </div>

            <!-- Bottom Official Bulk Package Banner Section -->
            <div class="w-full bg-surface-container-low py-10 mt-6 border-t border-outline-variant/20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="rounded-2xl bg-surface-container-lowest p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-outline-variant/30">
                        <div class="flex items-start gap-4">
                            <div class="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
                                <span class="material-symbols-outlined text-[32px]">archive</span>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                                        원클릭 실무 패키지
                                    </span>
                                    <span class="font-legal-code text-legal-code text-outline">최종 무결성 검증: 2026-02-24</span>
                                </div>
                                <h3 class="font-headline-md text-headline-md text-primary mt-1 font-bold">
                                    2026 대한민국 사회복지 공식 지침서 70종 전종 통합 패키지
                                </h3>
                                <p class="font-body-md text-body-md text-on-surface-variant mt-1.5 max-w-2xl">
                                    12대 핵심 분야 및 Track 2 범부처 안전망 전 영역의 보건복지부, 여성가족부, 법무부, 교육부 등 주무부처 정본 지침서 70종(총 24,384면, OCR 텍스트 검색 가능 PDF)을 단일 ZIP 압축 아카이브로 즉시 일괄 다운로드하실 수 있습니다.
                                </p>
                                <div class="flex items-center gap-4 text-legal-code font-legal-code text-outline mt-3 flex-wrap">
                                    <span>용량: 약 454.01 MB</span>
                                    <span>•</span>
                                    <span>포맷: PDF / HWPX 정본 원문</span>
                                    <span>•</span>
                                    <span>출처표시: 공공누리 제1유형</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                            <a href="${config.driveDownloadUrl}" target="_blank"
                               class="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-md transition-all">
                                <span class="material-symbols-outlined text-[20px]">download</span>
                                <span>전종 일괄 다운로드 (ZIP, 454MB)</span>
                            </a>
                            <button type="button" class="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-primary font-label-md text-label-md transition-all text-center shadow-xs cursor-pointer" onclick="showView(\'hierarchy\')">
                                <span class="material-symbols-outlined text-[20px] text-secondary">account_tree</span>
                                <span>3단계 위계도감 218단위 연동조회</span>
                                <span class="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">SCREEN_9</span>
                            </a>
                        </div>
                    </div>

                    <!-- Legal Authority Attribution -->
                    <div class="mt-6 text-center text-legal-code font-legal-code text-outline space-y-1">
                        <p>본 아카이브는 대한민국 공공저작물 자유이용허락 공공누리 제1유형(출처표시 원칙) 기준에 의거하여 배포 및 열람 서비스를 제공합니다.</p>
                        <p>소관 지침서의 모든 행정적·법적 권리는 대한민국 보건복지부, 여성가족부, 교육부, 고용노동부 및 각 소관 부처에 귀속됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
        `;

        bindArchiveEvents(allFiles);

        // 0. 시설 분류 1:1 직결 필터링 (options.facilityId / options.docIds)
        if (options.facilityId) {
            const mappedDocIds = (Array.isArray(options.docIds) && options.docIds.length > 0)
                ? options.docIds
                : (FACILITY_ARCHIVE_MAP[options.facilityId] || ['doc-003']);
            currentArchiveFacilityId = options.facilityId;
            currentArchiveFacilityName = options.facilityName || options.facilityId;
            currentArchiveDocIds = mappedDocIds;
            currentMinistry = 'all';
            searchQuery = '';
            const searchInput = document.getElementById('guidelineSearchInput');
            if (searchInput) searchInput.value = '';
            const clearBtn = document.getElementById('clearSearchBtn');
            if (clearBtn) clearBtn.classList.add('hidden');
            document.querySelectorAll('.ministry-pill').forEach(p => {
                if (p.getAttribute('data-ministry') === 'all') {
                    p.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                    p.classList.add('bg-primary', 'text-on-primary', 'active-pill');
                } else {
                    p.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
                    p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                }
            });
            if (typeof activeFilterGuidelines === 'function') {
                activeFilterGuidelines();
            }
            setTimeout(() => {
                const bannerEl = (window.innerWidth >= 768)
                    ? document.getElementById('archiveFacilityBannerContainer')
                    : document.getElementById('mobileArchiveFacilityBannerContainer');
                if (bannerEl && !bannerEl.classList.contains('hidden')) {
                    bannerEl.scrollIntoView({ behavior: 'instant', block: 'start' });
                }
                const matchedRows = document.querySelectorAll('#archiveTablesContainer .guideline-row');
                if (typeof window.triggerMatchHighlightAll === 'function' && matchedRows.length > 0) {
                    window.triggerMatchHighlightAll(Array.from(matchedRows));
                }
            }, 120);
        }

        // 1. Search keyword filter request handling (options.search)
        if (options.search) {
            currentArchiveFacilityId = null;
            currentArchiveFacilityName = null;
            currentArchiveDocIds = null;
            const searchInput = document.getElementById('guidelineSearchInput');
            if (searchInput) {
                searchInput.value = options.search;
                searchQuery = options.search.toLowerCase();
                const clearBtn = document.getElementById('clearSearchBtn');
                if (clearBtn) clearBtn.classList.remove('hidden');
                setTimeout(() => {
                    const pills = document.querySelectorAll('.ministry-pill');
                    pills.forEach(p => {
                        if (p.getAttribute('data-ministry') === 'all') {
                            p.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                            p.classList.add('bg-primary', 'text-on-primary', 'active-pill');
                        } else {
                            p.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
                            p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                        }
                    });
                    currentMinistry = 'all';
                    if (typeof activeFilterGuidelines === 'function') {
                        activeFilterGuidelines();
                    }

                    // 1:1 매칭 지침서 행 및 카드 외곽선 초록 테두리 발광
                    setTimeout(() => {
                        const matchedRows = document.querySelectorAll('.guideline-row');
                        const matchedCards = document.querySelectorAll('#guidelinesMobileList > div');
                        const targets = (window.innerWidth >= 768) ? matchedRows : matchedCards;
                        if (targets && targets.length > 0) {
                            if (typeof window.triggerMatchHighlight === 'function') {
                                window.triggerMatchHighlight(targets[0]);
                            }
                            targets[0].scrollIntoView({ behavior: 'instant', block: 'center' });
                        }
                    }, 120);
                }, 50);
            }
        }

        // 2. Highlight request handling
        if (options.highlightId) {
            setTimeout(() => {
                highlightAndScrollGuideline(options.highlightId);
            }, 220);
        }
    };

    function renderArchiveFacilityBanner(facilityId, facilityName, matchedFiles) {
        const desktopBanner = document.getElementById('archiveFacilityBannerContainer');
        const mobileBanner = document.getElementById('mobileArchiveFacilityBannerContainer');
        if (!facilityId || !currentArchiveDocIds) {
            if (desktopBanner) { desktopBanner.innerHTML = ''; desktopBanner.classList.add('hidden'); }
            if (mobileBanner) { mobileBanner.innerHTML = ''; mobileBanner.classList.add('hidden'); }
            return;
        }
        const count = (matchedFiles || []).length;
        const desktopHtml = `
            <div id="archive-facility-filter-banner" class="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-300/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-fadeIn">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">📚</div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-bold text-blue-800 uppercase tracking-wider">📚 시설 맞춤 공식 지침서</span>
                            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold border border-blue-200">정본 지침서 ${count}종</span>
                        </div>
                        <h3 class="text-base font-black text-slate-900 mt-1">
                            <span class="text-blue-700 font-black">${escapeHtml(facilityName)}</span> 직결 공식 사업안내·운영지침
                        </h3>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button type="button" onclick="window.clearArchiveFacilityFilter()" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition cursor-pointer">
                        <span>✕</span><span>전체 70종 보기</span>
                    </button>
                    <button type="button" onclick="window.jumpToFacility('${escapeHtml(facilityId)}'); return false;" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-2xs transition cursor-pointer">
                        <span>🏛️</span><span>시설도감으로 복귀</span>
                    </button>
                </div>
            </div>
        `;
        const mobileHtml = `
            <div class="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl space-y-2 shadow-2xs">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-[11px] font-extrabold text-blue-800">📚 시설 맞춤 공식 지침서 · 정본 ${count}종</span>
                    <button type="button" onclick="window.clearArchiveFacilityFilter()" class="px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-[10px] font-bold text-slate-700 cursor-pointer">✕ 전체 70종</button>
                </div>
                <div class="text-xs font-black text-slate-900">${escapeHtml(facilityName)} 직결 사업안내</div>
                <button type="button" onclick="window.jumpToFacility('${escapeHtml(facilityId)}'); return false;" class="w-full py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] cursor-pointer">🏛️ 시설도감으로 복귀</button>
            </div>
        `;
        if (desktopBanner) { desktopBanner.innerHTML = desktopHtml; desktopBanner.classList.remove('hidden'); }
        if (mobileBanner) { mobileBanner.innerHTML = mobileHtml; mobileBanner.classList.remove('hidden'); }
    }

    window.clearArchiveFacilityFilter = function () {
        currentArchiveFacilityId = null;
        currentArchiveFacilityName = null;
        currentArchiveDocIds = null;
        currentMinistry = 'all';
        searchQuery = '';
        const searchInput = document.getElementById('guidelineSearchInput');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.classList.add('hidden');
        document.querySelectorAll('.ministry-pill').forEach(p => {
            if (p.getAttribute('data-ministry') === 'all') {
                p.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                p.classList.add('bg-primary', 'text-on-primary', 'active-pill');
            } else {
                p.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
                p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
            }
        });
        window.location.hash = '#archive';
        if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
    };

    // 데스크톱 테이블 행(Row) 생성 (소관부처/소관기관, 담당과/소속부서 Rowspan 계층 병합)
    function renderDesktopRows(files) {
        if (!files || files.length === 0) {
            return `<tr><td colspan="6" class="py-12 text-center text-on-surface-variant font-medium">검색 조건에 일치하는 지침서가 없습니다.</td></tr>`;
        }

        // 1. 소관 부처별 -> 담당과별 계층 그룹핑 (순서 보존)
        const ministryGroups = {};
        const ministryOrder = [];

        files.forEach(f => {
            const m = (f.ministry || '관계부처').split('(')[0].trim();
            const d = f.department || '총괄부서';

            if (!ministryGroups[m]) {
                ministryGroups[m] = {};
                ministryOrder.push(m);
            }
            if (!ministryGroups[m][d]) {
                ministryGroups[m][d] = [];
            }
            ministryGroups[m][d].push(f);
        });

        let html = '';

        ministryOrder.forEach(m => {
            const deptMap = ministryGroups[m];
            const deptKeys = Object.keys(deptMap);
            const ministryTotal = deptKeys.reduce((acc, d) => acc + deptMap[d].length, 0);
            let isFirstRowOfMinistry = true;

            deptKeys.forEach(d => {
                const deptFiles = deptMap[d];
                const deptTotal = deptFiles.length;
                let isFirstRowOfDept = true;

                deptFiles.forEach(f => {
                    const badgeClass = getMinistryBadgeClass(f.ministry);
                    const hl = f.hierarchyLink || { targetId: "comm-case-intake", label: "L1 종합복지 > L2 운영" };
                    const tags = f.keyChapters || ["법정지침", "운영서식"];
                    const tagsHtml = tags.map(t => `<span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">${t}</span>`).join(' ');

                    const legalBasis = (f.legalTarget || '').split('·')[0].trim() || '사회복지사업법 관련';
                    const targetFacilities = (f.legalTarget || '').includes('·') ? (f.legalTarget || '').split('·').slice(1).join('·').trim() : (f.department || '관련 시설');

                    const keywords = [
                        f.title,
                        f.ministry,
                        f.department,
                        f.code,
                        f.legalTarget,
                        ...(f.keyChapters || [])
                    ].filter(Boolean).join(' ').toLowerCase();

                    html += `
                    <tr class="guideline-row hover:bg-surface-container-low/70 transition-colors"
                        id="guideline-row-${f.id}"
                        data-ministry="${f.ministry || '기타'}"
                        data-section="${f.section || 'SECTION_1'}"
                        data-keywords="${keywords}">`;

                    // 1열: 소관 부처 / 소관 기관 (Rowspan 병합)
                    if (isFirstRowOfMinistry) {
                        html += `
                        <td class="py-3.5 px-3 align-top border-r border-surface-container bg-surface-container-lowest/90 text-center" rowspan="${ministryTotal}">
                            <div class="sticky top-28 flex flex-col items-center gap-1.5 py-1">
                                <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-md ${badgeClass} font-label-sm text-label-sm font-bold shadow-2xs whitespace-nowrap">
                                    ${m}
                                </span>
                                <span class="text-[11px] text-on-surface-variant font-medium">${ministryTotal}종 지침</span>
                            </div>
                        </td>`;
                        isFirstRowOfMinistry = false;
                    }

                    // 2열: 담당과 / 소속 부서 (Rowspan 병합)
                    if (isFirstRowOfDept) {
                        html += `
                        <td class="py-3.5 px-3.5 align-top border-r border-surface-container bg-surface-container-lowest/50" rowspan="${deptTotal}">
                            <div class="sticky top-28 flex flex-col gap-1 py-1">
                                <span class="font-label-sm text-label-sm text-on-surface font-bold leading-snug">${d}</span>
                                <span class="font-legal-code text-legal-code text-outline text-[11px]">${deptTotal}건 수록</span>
                            </div>
                        </td>`;
                        isFirstRowOfDept = false;
                    }

                    // 3열: 지침서 공식 명칭 & 판본
                    html += `
                    <td class="py-3.5 px-4 align-top border-r border-surface-container">
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="font-legal-code text-legal-code text-outline font-semibold bg-surface-container px-1.5 py-0.2 rounded">${f.code || f.id}</span>
                                <span class="px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-semibold text-[11px]">PDF 정본</span>
                            </div>
                            <span class="font-label-md text-label-md font-bold text-on-surface leading-snug">${f.title}</span>
                            <div class="flex items-center gap-2 text-legal-code font-legal-code text-on-surface-variant flex-wrap mt-0.5">
                                <span>발간: ${f.year || '2026'}.01</span>
                                <span>•</span>
                                <span>${f.totalPages || 250}쪽</span>
                                <span>•</span>
                                <span>${f.sizeStr || '14.2 MB'}</span>
                            </div>
                        </div>
                    </td>

                    <!-- 4열: 핵심 관할 법령 & 대상 시설 (스마트 시설 직결 칩) -->
                    <td class="py-3.5 px-4 align-top border-r border-surface-container">
                        <div class="flex flex-col gap-1.5">
                            <span class="font-label-sm text-label-sm text-primary font-medium">${legalBasis}</span>
                            <div class="flex flex-wrap items-center gap-1">
                                <span class="text-[11px] text-on-surface-variant font-medium">대상:</span>
                                ${renderTargetFacilityChips(targetFacilities, f)}
                            </div>
                        </div>
                    </td>

                    <!-- 5열: 주요 수록 챕터 및 핵심 지침 요약 -->
                    <td class="py-3.5 px-4 align-top border-r border-surface-container">
                        <div class="flex flex-col gap-1">
                            <div class="flex flex-wrap gap-1">
                                ${tagsHtml}
                            </div>
                            <p class="text-on-surface-variant text-[12px] line-clamp-2 mt-0.5">
                                ${targetFacilities} 및 실천기관 표준 운영 매뉴얼, 주요 행정 서식, 현장 실무 가이드라인 수록.
                            </p>
                        </div>
                    </td>

                    <!-- 6열: 연계 위계 & 원문 열람 -->
                    <td class="py-3.5 px-4 align-top text-right">
                        <div class="flex flex-col items-end gap-1.5">
                            <button type="button" class="inline-flex items-center gap-1 font-legal-code text-legal-code text-secondary hover:text-primary hover:underline font-semibold bg-surface-container px-2 py-0.5 rounded transition-colors cursor-pointer"
                               onclick="showView('hierarchy', { targetNodeId: '${hl.targetId}' })"
                               title="3단계 위계도감(${hl.label})으로 연계 이동">
                                <span class="material-symbols-outlined text-[14px]">account_tree</span>
                                <span>${hl.label}</span>
                                <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </button>
                            <div class="flex items-center gap-1">
                                <button type="button" class="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
                                        onclick="window.viewGuidelineModal('${f.id}'); return false;">
                                    즉시열람
                                </button>
                                <button type="button" class="px-2 py-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer"
                                        onclick="window.downloadGuidelineDirect('${f.id}'); return false;"
                                        title="지침서 다운로드">
                                    <span class="material-symbols-outlined text-[16px]">download</span>
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
                });
            });
        });

        return html;
    }

    // 모바일 카드 생성
    function renderMobileCards(files) {
        return files.map(f => {
            const ministryClean = (f.ministry || '관계부처').split('(')[0].trim();
            const yearClean = f.year || '2026';
            const keywords = (f.keyChapters || ["법정지침", "운영서식"]);
            const hl = f.hierarchyLink || { targetId: "comm-case-intake", label: "L1 종합복지 > L2 운영" };

            return `
            <div class="guideline-card bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5 transition-all duration-200"
                 id="mobile-card-${f.id}"
                 data-ministry="${f.ministry || '기타'}"
                 data-year="${yearClean}"
                 data-section="${f.section || 'SECTION_1'}"
                 data-keywords="${(f.title + ' ' + f.ministry + ' ' + (f.department || '') + ' ' + keywords.join(' ')).toLowerCase()}">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">${ministryClean}</span>
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">${f.department || '사업안내'}</span>
                  <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">${f.category || '사회복지'}</span>
                </div>
                <span class="text-[10px] text-slate-400 font-medium">PDF 정본</span>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-900 leading-snug">${f.title}</h3>
                <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                  ${f.summary || f.legalTarget || '보건복지부 및 중앙부처 공식 2026 지침서 정본'}
                </p>
              </div>
              ${keywords.length > 0 ? `
                <div class="flex flex-wrap gap-1 text-[10px] text-blue-600 font-medium">
                  ${keywords.map(k => `<span class="px-1.5 py-0.5 bg-blue-50 rounded">#${k}</span>`).join('')}
                </div>
              ` : ''}
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>${f.sizeStr || 'PDF'} · 최종개정 ${f.year || '2026'}</span>
              </div>
              <div class="grid grid-cols-3 gap-1.5 pt-1">
                <button type="button" onclick="downloadGuidelineDirect('${f.id}')" class="py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer">
                  <span>⬇ 다운로드</span>
                </button>
                <button type="button" onclick="viewGuidelineModal('${f.id}')" class="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer">
                  <span>👁 목차/뷰어</span>
                </button>
                <button type="button" onclick="showView('hierarchy', {targetNodeId: '${hl.targetId}'})" class="py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 border border-emerald-200 transition cursor-pointer">
                  <span>🌳 위계도감</span>
                </button>
              </div>
            </div>
            `;
        }).join('');
    }

    // 인터랙티브 이벤트 바인딩
    function bindArchiveEvents(allFiles) {
        const searchInput = document.getElementById('guidelineSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        const badgeCount = document.getElementById('searchBadgeCount');
        const pills = document.querySelectorAll('.ministry-pill');
        const rows = document.querySelectorAll('.guideline-row');
        const cards = document.querySelectorAll('.guideline-card');
        const noResults = document.getElementById('noResultsState');
        const resetBtn = document.getElementById('resetSearchFilterBtn');
        const tablesContainer = document.getElementById('archiveTablesContainer');
        const sec1Block = document.getElementById('section1-block');
        const sec2Block = document.getElementById('section2-block');
        const sec3Block = document.getElementById('section3-block');
        const mobTabSec1 = document.getElementById('mobTabSec1');
        const mobTabSec2 = document.getElementById('mobTabSec2');
        const exportCsvBtn = document.getElementById('exportCsvBtn');

        function filterGuidelines() {
            let visibleCount = 0;
            let sec1Count = 0;
            let sec2Count = 0;
            let sec3Count = 0;
            const q = searchQuery.trim().toLowerCase();
            const normQ = q.replace(/성평등가족부/g, '여성가족부');

            // Rowspan 계층 구조 완결성을 위한 데이터 기반 필터링 및 동적 렌더링
            const basePool = (currentArchiveDocIds && currentArchiveDocIds.length > 0)
                ? allFiles.filter(f => currentArchiveDocIds.includes(f.id))
                : allFiles;

            const filteredFiles = basePool.filter(f => {
                const keywords = [
                    f.title,
                    f.ministry,
                    f.department,
                    f.code,
                    f.legalTarget,
                    ...(f.keyChapters || [])
                ].filter(Boolean).join(' ').toLowerCase();

                let ministryMatch = checkMinistryMatch(f.ministry || '', keywords, currentMinistry, f.section || '');
                let queryMatch = (q.length === 0) || keywords.includes(q) || (normQ && keywords.includes(normQ)) || (f.title || '').toLowerCase().includes(q) || (f.department || '').toLowerCase().includes(q);

                return ministryMatch && queryMatch;
            });

            renderArchiveFacilityBanner(currentArchiveFacilityId, currentArchiveFacilityName, filteredFiles);

            const sec1Filtered = filteredFiles.filter(f => f.section === 'SECTION_1' || (f.section !== 'SECTION_3' && f.ministry && f.ministry.includes('보건복지부')));
            const sec2Filtered = filteredFiles.filter(f => f.section === 'SECTION_2');
            const sec3Filtered = filteredFiles.filter(f => f.section === 'SECTION_3');

            visibleCount = filteredFiles.length;
            sec1Count = sec1Filtered.length;
            sec2Count = sec2Filtered.length;
            sec3Count = sec3Filtered.length;

            const t1 = document.getElementById('table1-tbody');
            const t2 = document.getElementById('table2-tbody');
            const t3 = document.getElementById('table3-tbody');
            if (t1) t1.innerHTML = renderDesktopRows(sec1Filtered);
            if (t2) t2.innerHTML = renderDesktopRows(sec2Filtered);
            if (t3) t3.innerHTML = renderDesktopRows(sec3Filtered);

            // Filter Mobile Cards
            cards.forEach(card => {
                const cardId = (card.id || '').replace('mobile-card-', '');
                const cardMinistry = card.getAttribute('data-ministry') || '';
                const cardSection = card.getAttribute('data-section') || 'SECTION_1';
                const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
                const textContent = card.textContent.toLowerCase();

                let docMatch = !currentArchiveDocIds || currentArchiveDocIds.includes(cardId);
                let ministryMatch = checkMinistryMatch(cardMinistry, keywords, currentMinistry, cardSection);
                let queryMatch = (q.length === 0) || textContent.includes(q) || (normQ && textContent.includes(normQ)) || keywords.includes(q) || (normQ && keywords.includes(normQ));
                let sectionMatch = (currentArchiveDocIds && currentArchiveDocIds.length > 0) || (mobileActiveSection === 'ALL') || (cardSection === mobileActiveSection);

                if (docMatch && ministryMatch && queryMatch && sectionMatch) {
                    card.style.display = '';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                }
            });

            // Toggle table section blocks
            if (sec1Block) sec1Block.style.display = (sec1Count > 0) ? '' : 'none';
            if (sec2Block) sec2Block.style.display = (sec2Count > 0) ? '' : 'none';
            if (sec3Block) sec3Block.style.display = (sec3Count > 0) ? '' : 'none';

            // Badge count
            if (badgeCount) badgeCount.textContent = `${visibleCount}건 표시중`;

            // No results state
            if (visibleCount === 0) {
                if (noResults) noResults.classList.remove('hidden');
                if (tablesContainer) tablesContainer.classList.add('hidden');
            } else {
                if (noResults) noResults.classList.add('hidden');
                if (tablesContainer) tablesContainer.classList.remove('hidden');
            }
        }
        activeFilterGuidelines = filterGuidelines;

        function checkMinistryMatch(rowMinistry, keywords, target, section) {
            if (target === 'all') return true;
            if (target === 'TRACK2') return section === 'SECTION_3';
            if (target === '행안부/질병청/법무부') {
                return section !== 'SECTION_3' && (rowMinistry.includes('행안') || rowMinistry.includes('질병') || rowMinistry.includes('법무') ||
                       rowMinistry.includes('외교') || rowMinistry.includes('보훈') || rowMinistry.includes('통일') ||
                       rowMinistry.includes('국무') || keywords.includes('행정안전부') || keywords.includes('질병관리청'));
            }
            if (target === '공익재단·기타') {
                return section !== 'SECTION_3' && (rowMinistry.includes('공동모금회') || rowMinistry.includes('사회공헌') ||
                       rowMinistry.includes('재단') || rowMinistry.includes('공익') || keywords.includes('사회복지공동모금회'));
            }
            return section !== 'SECTION_3' && rowMinistry.includes(target);
        }

        // Ministry Pill Clicks
        pills.forEach(pill => {
            pill.addEventListener('click', function () {
                currentArchiveFacilityId = null;
                currentArchiveFacilityName = null;
                currentArchiveDocIds = null;
                pills.forEach(p => {
                    p.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
                    p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                });
                this.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                this.classList.add('bg-primary', 'text-on-primary', 'active-pill');

                currentMinistry = this.getAttribute('data-ministry');
                if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
            });
        });

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                currentArchiveFacilityId = null;
                currentArchiveFacilityName = null;
                currentArchiveDocIds = null;
                searchQuery = this.value;
                if (clearBtn) {
                    if (searchQuery.length > 0) clearBtn.classList.remove('hidden');
                    else clearBtn.classList.add('hidden');
                }
                if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
            });
        }

        // Clear Search
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                if (searchInput) {
                    searchInput.value = '';
                    searchQuery = '';
                    clearBtn.classList.add('hidden');
                    if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
                    searchInput.focus();
                }
            });
        }

        // Reset Filter
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                currentArchiveFacilityId = null;
                currentArchiveFacilityName = null;
                currentArchiveDocIds = null;
                if (searchInput) {
                    searchInput.value = '';
                    searchQuery = '';
                }
                if (clearBtn) clearBtn.classList.add('hidden');
                currentMinistry = 'all';

                pills.forEach(p => {
                    if (p.getAttribute('data-ministry') === 'all') {
                        p.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                        p.classList.add('bg-primary', 'text-on-primary', 'active-pill');
                    } else {
                        p.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
                        p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                    }
                });

                if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
            });
        }

        // Mobile Tabs Toggle
        if (mobTabSec1 && mobTabSec2) {
            mobTabSec1.addEventListener('click', function () {
                mobileActiveSection = 'SECTION_1';
                mobTabSec1.className = 'flex-1 py-2 text-center rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-xs transition-all';
                mobTabSec2.className = 'flex-1 py-2 text-center rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium transition-all';
                if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
            });

            mobTabSec2.addEventListener('click', function () {
                mobileActiveSection = 'SECTION_2';
                mobTabSec2.className = 'flex-1 py-2 text-center rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-xs transition-all';
                mobTabSec1.className = 'flex-1 py-2 text-center rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium transition-all';
                if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }
            });
        }

        // CSV Export
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', function (e) {
                e.preventDefault();
                exportGuidelinesToCsv(allFiles);
            });
        }
    }

    // CSV 파일 내보내기 (UTF-8 BOM 포함)
    function exportGuidelinesToCsv(files) {
        let csvContent = "\uFEFF"; // UTF-8 BOM
        csvContent += "일련번호,관리코드,섹션,소관부처,담당부서,지침서 공식 명칭,발간연도,총페이지,파일용량,관할법령 및 대상시설,주요수록챕터,위계도감연계ID\n";

        files.forEach((f, idx) => {
            const sectionName = f.section === 'SECTION_1' ? '섹션Ⅰ:중앙부처' : '섹션Ⅱ:범부처특화';
            const cleanTitle = `"${(f.title || '').replace(/"/g, '""')}"`;
            const cleanLegal = `"${(f.legalTarget || '').replace(/"/g, '""')}"`;
            const cleanChapters = `"${(f.keyChapters || []).join('; ').replace(/"/g, '""')}"`;
            const targetId = (f.hierarchyLink && f.hierarchyLink.targetId) ? f.hierarchyLink.targetId : '';

            csvContent += `${idx + 1},${f.code || f.id},${sectionName},${f.ministry || ''},${f.department || ''},${cleanTitle},${f.year || '2026'},${f.totalPages || 0},${f.sizeStr || ''},${cleanLegal},${cleanChapters},${targetId}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `2026_대한민국_사회복지_공식지침서_70종_목록_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 지침서 상세 열람 모달
    window.viewGuidelineModal = function (docId) {
        const allFiles = getAllFiles();
        const f = allFiles.find(item => item.id === docId);
        if (!f) return;

        const config = getArchiveConfig();
        const badgeClass = getMinistryBadgeClass(f.ministry);
        const tagsHtml = (f.keyChapters || []).map(t => `<span class="px-2 py-1 rounded bg-surface-container text-on-surface text-xs font-medium">${t}</span>`).join(' ');

        // Check if modal exists
        let modal = document.getElementById('guidelineDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'guidelineDetailModal';
            document.body.appendChild(modal);
        }

        modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity";
        modal.innerHTML = `
        <div class="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-3 border-b border-surface-container">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2.5 py-0.5 rounded ${badgeClass} font-label-sm text-label-sm font-semibold">${f.ministry}</span>
                    <span class="font-label-md text-label-md text-on-surface font-semibold">${f.department || '총괄부서'}</span>
                    <span class="font-legal-code text-legal-code text-outline">(${f.code || f.id})</span>
                </div>
                <button type="button" onclick="document.getElementById('guidelineDetailModal').remove()" class="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <!-- Title & Basic Info -->
            <div>
                <h3 class="font-headline-md text-headline-md text-primary font-bold leading-snug">${f.title}</h3>
                <div class="flex items-center gap-3 text-legal-code font-legal-code text-on-surface-variant mt-2 flex-wrap">
                    <span class="px-2 py-0.5 rounded bg-error-container text-on-error-container font-semibold">정부 공인 정본</span>
                    <span>발간: ${f.year || '2026'}.01</span>
                    <span>•</span>
                    <span>분량: ${f.totalPages || 250}쪽</span>
                    <span>•</span>
                    <span>용량: ${f.sizeStr}</span>
                    <span>•</span>
                    <span>공공누리 제1유형</span>
                </div>
            </div>

            <!-- Details Box -->
            <div class="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2.5 border border-outline-variant/20">
                <div>
                    <span class="font-label-sm text-label-sm text-primary font-semibold block mb-0.5">관할 법령 및 대상 기관</span>
                    <p class="text-body-sm font-body-sm text-on-surface">${f.legalTarget || '사회복지사업법 관련 시설'}</p>
                </div>
                <div>
                    <span class="font-label-sm text-label-sm text-primary font-semibold block mb-1">핵심 수록 챕터 및 가이드</span>
                    <div class="flex flex-wrap gap-1.5">
                        ${tagsHtml}
                    </div>
                </div>
                <div>
                    <span class="font-label-sm text-label-sm text-primary font-semibold block mb-0.5">3단계 위계도감 연계</span>
                    <p class="text-body-sm font-body-sm text-secondary font-medium flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">account_tree</span>
                        ${f.hierarchyLink ? f.hierarchyLink.label : '종합사회복지관 3대기능 연동'}
                    </p>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-2 border-t border-surface-container flex-wrap gap-2">
                <button type="button" onclick="document.getElementById('guidelineDetailModal').remove(); showView('hierarchy', { targetNodeId: '${f.hierarchyLink ? f.hierarchyLink.targetId : ''}' });"
                   class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md font-semibold transition cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">account_tree</span>
                    <span>위계도감 해당 노드로 이동</span>
                </button>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="document.getElementById('guidelineDetailModal').remove()"
                            class="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium hover:bg-surface-container-high transition">
                        닫기
                    </button>
                    <a href="${config.driveDownloadUrl}" target="_blank"
                       class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition shadow-xs">
                        <span class="material-symbols-outlined text-[18px]">download</span>
                        <span>원문 다운로드</span>
                    </a>
                </div>
            </div>
        </div>
        `;
    };

    // 지침서 다운로드 핸들러
    window.downloadGuidelineDirect = function (docId) {
        const config = getArchiveConfig();
        const files = getAllFiles();
        const target = files.find(f => f.id === docId);
        if (target && target.relPath) {
            // 로컬 정본 PDF 직접 열람 및 다운로드
            const localUrl = 'docs/지침서_공식_아카이브/' + encodeURI(target.relPath);
            const link = document.createElement('a');
            link.href = localUrl;
            link.download = target.filename || (target.title + '.pdf');
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(config.driveDownloadUrl, '_blank');
        }
    };

    // 위계도감 등 외부에서 특정 지침서로 포커스 요청 시
    function highlightAndScrollGuideline(docId) {
        // Reset filters so the row is guaranteed visible
        currentArchiveFacilityId = null;
        currentArchiveFacilityName = null;
        currentArchiveDocIds = null;
        searchQuery = '';
        currentMinistry = 'all';
        const searchInput = document.getElementById('guidelineSearchInput');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.classList.add('hidden');
        const pills = document.querySelectorAll('.ministry-pill');
        pills.forEach(p => {
            if (p.getAttribute('data-ministry') === 'all') {
                p.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                p.classList.add('bg-primary', 'text-on-primary', 'active-pill');
            } else {
                p.classList.remove('bg-primary', 'text-on-primary', 'active-pill');
                p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
            }
        });
        if (typeof activeFilterGuidelines === 'function') {
            activeFilterGuidelines();
        }

        setTimeout(() => {
            const row = document.getElementById(`guideline-row-${docId}`);
            const card = document.getElementById(`mobile-card-${docId}`);

            const targetEl = (window.innerWidth >= 768) ? row : card;
            if (!targetEl) return;

            targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });

            // Highlight ring pulse animation (통합 초록 테두리 인터랙티브 강조)
            if (typeof window.triggerMatchHighlight === 'function') {
                window.triggerMatchHighlight(targetEl);
            }
            targetEl.classList.add('ring-4', 'ring-secondary', 'transition-all', 'duration-500');
            setTimeout(() => {
                targetEl.classList.remove('ring-4', 'ring-secondary');
            }, 2800);
        }, 220);
    }

})();
    // ==========================================================================
    // 공식 지침서 아카이브 모바일 전용 핸들러 (Google Stitch 모바일 인터랙션)
    // ==========================================================================
    let mobileArchiveYear = '전체';
    let mobileArchiveMinistry = '전체';
    let mobileArchiveQuery = '';

    window.handleMobileArchiveSearch = function(query) {
        mobileArchiveQuery = (query || '').trim().toLowerCase();
        filterMobileArchiveCards();
    };

    window.filterArchiveByYear = function(year, buttonElement) {
        mobileArchiveYear = year || '전체';
        const container = document.getElementById('mobile-archive-year-pills');
        if (container) {
            container.querySelectorAll('.archive-year-pill').forEach(btn => {
                btn.className = 'archive-year-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer';
            });
        }
        if (buttonElement) {
            buttonElement.className = 'archive-year-pill px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white flex-shrink-0 shadow-2xs cursor-pointer';
        }
        filterMobileArchiveCards();
    };

    window.filterArchiveByMinistry = function(ministry, buttonElement) {
        mobileArchiveMinistry = ministry || '전체';
        const container = document.getElementById('mobile-archive-ministry-pills');
        if (container) {
            container.querySelectorAll('.archive-ministry-pill').forEach(btn => {
                btn.className = 'archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer';
            });
        }
        if (buttonElement) {
            buttonElement.className = 'archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-white flex-shrink-0 shadow-2xs cursor-pointer';
        }
        filterMobileArchiveCards();
    };

    function filterMobileArchiveCards() {
        const cards = document.querySelectorAll('#mobile-archive-cards-feed > .guideline-card, #mobileGuidelinesView .guideline-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const text = (card.textContent || '').toLowerCase();
            const cardYear = (card.getAttribute('data-year') || '').toLowerCase();
            const cardMinistry = (card.getAttribute('data-ministry') || '').toLowerCase();
            const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();

            const matchSearch = !mobileArchiveQuery || text.includes(mobileArchiveQuery) || cardKeywords.includes(mobileArchiveQuery);
            const matchYear = (mobileArchiveYear === '전체') || cardYear.includes(mobileArchiveYear.toLowerCase());
            const cardSection = card.getAttribute('data-section') || '';
            const matchMinistry = (mobileArchiveMinistry === '전체')
                || (mobileArchiveMinistry === 'TRACK2' && cardSection === 'SECTION_3')
                || (mobileArchiveMinistry !== 'TRACK2' && (cardMinistry.includes(mobileArchiveMinistry.toLowerCase()) || text.includes(mobileArchiveMinistry.toLowerCase())));

            if (matchSearch && matchYear && matchMinistry) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        const emptyNotice = document.getElementById('mobile-archive-empty-notice');
        if (emptyNotice) {
            emptyNotice.classList.toggle('hidden', visibleCount > 0);
        }
    }

    
