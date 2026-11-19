/**
 * 대한민국 사회복지 현장 나침반 - 공식 지침서 마스터 아카이브 (70종 순수 PDF 정본)
 * - 중앙행정기관 62종 + 민간 제3섹터·사회적경제·종교공익 8종 (총 70종 18,556면)
 * - 18대 분야·시설 도감(45) ⇄ 3단계 위계도감(219) ⇄ 공식 지침서(70) 1:1 양방향 딥링킹
 * - 전 파일 Google Drive 클라우드 정본 1:1 연동 (PDF 배지 클릭 시 즉시 다운로드)
 * - Excel (.csv) · 클립보드 (TSV) · A4 가로 표 인쇄 완비
 */

(function () {
    let currentMinistry = '전체';
    let searchQuery = '';
    let mobileActiveSection = 'SECTION_1';
    let activeFilterGuidelines = null;
    let currentArchiveFacilityId = null;
    let currentArchiveFacilityName = null;
    let currentArchiveDocIds = null;
    let currentFilteredArchiveFiles = [];

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
        'law-ngo-csr': ['doc-048', 'doc-049', 'doc-050', 'doc-034', 'doc-068'],
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
        'ext-med-industrial': ['doc-063'],
        'ext-med-veterans': ['doc-063', 'doc-052'],
        'ext-med-military': ['doc-063'],
        'ext-edu-k12': ['doc-064', 'doc-045'],
        'ext-edu-special': ['doc-065'],
        'ext-edu-univ-lifelong': ['doc-066'],
        'ext-life-housing-disaster': ['doc-067'],
        'ext-life-housing': ['doc-067'],
        'ext-life-disaster': ['doc-067'],
        'ext-life-finance-volunteer': ['doc-068', 'doc-002'],
        'ext-life-finance': ['doc-068'],
        'ext-life-volunteer': ['doc-068', 'doc-002'],
        'ext-life-npo': ['doc-068', 'doc-002'],
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
    const ARCHIVE_LINEAGE_ORDER = [
        '보건복지부', '성평등가족부', '교육부', '법무부',
        '고용노동부', '국가보훈부', '국방부',
        '행정안전부', '국토교통부', '국무총리', '통일부'
    ];
    const ARCHIVE_AXIS_ORDER = [
        '축 1 · 민법 제32조 비영리·공익법인',
        '축 2 · 사회적경제·연대',
        '축 3 · 종교법인·문화유산 공익'
    ];
    const ARCHIVE_FILTER_PILLS = [
        { key: '전체', label: '전체', icon: '' },
        { key: '보건복지부', label: '보건복지부', icon: '🏥' },
        { key: '성평등가족부', label: '성평등가족부', icon: '👨‍👩‍👧' },
        { key: '교육부', label: '교육부', icon: '🎓' },
        { key: '법무부', label: '법무부', icon: '⚖️' },
        { key: '고용·보훈·국방', label: '고용·보훈·국방', icon: '💼' },
        { key: '행안·국토·금융', label: '행안·국토·금융', icon: '🏛️' },
        { key: '질병청·통일부', label: '질병청·통일부', icon: '🔬' },
        { key: '민간제3섹터', label: '민간제3섹터(6)', icon: '🤝', isCivil: true }
    ];

    function escA(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function safeArchiveLineage(ministryStr) {
        const raw = String(ministryStr || '보건복지부').split('·')[0].trim();
        const normalized = (raw === '여성가족부') ? '성평등가족부' : raw;
        if (normalized === '국무조정실') {
            return {
                primary: '국무조정실',
                orgType: '총리소속',
                lineage: '국무총리',
                lineageLabel: '국무총리 소속',
                lineageIcon: '🏛️',
                orgIcon: '🇰🇷'
            };
        }
        if (typeof window !== 'undefined' && typeof window.resolveOrgLineage === 'function') {
            return window.resolveOrgLineage(normalized);
        }
        if (normalized === '금융위원회') {
            return {
                primary: '금융위원회',
                orgType: '위원회',
                lineage: '국무총리',
                lineageLabel: '국무총리 소속',
                lineageIcon: '🏛️',
                orgIcon: '💳'
            };
        }
        return {
            primary: normalized,
            orgType: '부',
            lineage: normalized,
            lineageLabel: normalized,
            lineageIcon: '🏛️',
            orgIcon: '🏛️'
        };
    }

    function resolveArchiveOrgInfo(file) {
        const catKey = file._categoryKey || '';
        const fId = file.id || '';
        if (catKey === '09_민간제3섹터_사회적경제_종교생태계') {
            let axis = '축 1 · 민법 제32조 비영리·공익법인';
            let icon = '🌍';
            if (['doc-054', 'doc-055', 'doc-056'].includes(fId)) {
                axis = '축 2 · 사회적경제·연대';
                icon = '🌱';
            } else if (['doc-069', 'doc-070'].includes(fId)) {
                axis = '축 3 · 종교법인·문화유산 공익';
                icon = '🕊️';
            }
            return {
                isCivil: true,
                axis,
                primary: file.ministry || '민간제3섹터',
                orgType: '제3섹터·공익',
                lineage: axis,
                lineageLabel: axis,
                lineageIcon: icon,
                orgIcon: icon
            };
        }

        const L = safeArchiveLineage(file.ministry);
        return {
            isCivil: false,
            axis: null,
            primary: L.primary || file.ministry,
            orgType: L.orgType || '부',
            lineage: L.lineage || file.ministry,
            lineageLabel: L.lineageLabel || file.ministry,
            lineageIcon: L.lineageIcon || '🏛️',
            orgIcon: L.orgIcon || '🏛️'
        };
    }

    function matchArchiveMinistryFilter(file, orgInfo, filterKey) {
        if (!filterKey || filterKey === '전체' || filterKey === 'all') return true;
        if (filterKey === '민간제3섹터') return !!orgInfo.isCivil;
        if (orgInfo.isCivil) return false;

        const m = String(file.ministry || '');
        if (filterKey === '행안·국토·금융') {
            return m.includes('행정안전부') || m.includes('행안') || m.includes('국토교통부') || m.includes('금융위원회') || m.includes('국무조정실');
        }
        if (typeof window !== 'undefined' && typeof window.matchMinistryFilter === 'function') {
            return window.matchMinistryFilter(m, filterKey);
        }
        if (filterKey === '성평등가족부' || filterKey === '여성가족부') {
            return m.includes('성평등가족부') || m.includes('여성가족부');
        }
        if (filterKey === '고용·보훈·국방') {
            return m.includes('고용노동부') || m.includes('국가보훈부') || m.includes('국방부');
        }
        if (filterKey === '질병청·통일부') {
            return m.includes('질병관리청') || m.includes('통일부');
        }
        return m.includes(filterKey);
    }

    function collectArchiveFiles() {
        const db = (typeof GUIDELINES_ARCHIVE_DB !== 'undefined') ? GUIDELINES_ARCHIVE_DB : [];
        const allFiles = [];
        db.forEach(cat => {
            (cat.sources || []).forEach(src => {
                (src.files || []).forEach(file => {
                    allFiles.push({
                        ...file,
                        _categoryKey: cat.categoryKey,
                        _categoryName: cat.categoryName,
                        _categoryIcon: cat.icon,
                        _driveFolderUrl: cat.driveFolderUrl || '',
                        _sourceName: src.sourceName
                    });
                });
            });
        });
        return allFiles;
    }

    function renderArchiveFacilityBanner(facilityId, facilityName, filteredFiles) {
        const desktopBanner = document.getElementById('archiveFacilityBannerContainer');
        const mobileBanner = document.getElementById('mobileArchiveFacilityBannerContainer');
        if (!facilityId && !facilityName) {
            [desktopBanner, mobileBanner].forEach(el => {
                if (el) {
                    el.innerHTML = '';
                    el.classList.add('hidden');
                }
            });
            return;
        }
        const docCount = (filteredFiles || []).length;
        const bannerHtml = `
            <div class="mb-5 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-300/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-fadeIn">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">📖</div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-bold text-blue-800 uppercase tracking-wider">시설 1:1 매칭 공식 지침서</span>
                            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold border border-blue-200">${docCount}종 매칭</span>
                        </div>
                        <h3 class="text-base font-black text-slate-900 mt-0.5">
                            <span class="text-blue-700">${escA(facilityName || facilityId)}</span> 관련 소관부처 정본 지침서
                        </h3>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button type="button" onclick="window.clearArchiveFacilityFilter()" class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer transition">
                        ✕ 70종 전체 보기
                    </button>
                    <button type="button" onclick="window.jumpToFacility('${escA(facilityId || '')}'); return false;" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition">
                        🏛️ 시설도감 복귀
                    </button>
                </div>
            </div>
        `;
        [desktopBanner, mobileBanner].forEach(el => {
            if (el) {
                el.innerHTML = bannerHtml;
                el.classList.remove('hidden');
            }
        });
    }

    window.clearArchiveFacilityFilter = function () {
        currentArchiveFacilityId = null;
        currentArchiveFacilityName = null;
        currentArchiveDocIds = null;
        currentFilteredArchiveFiles = collectArchiveFiles();
        currentMinistry = '전체';
        searchQuery = '';
        const input = document.getElementById('guidelineSearchInput');
        if (input) input.value = '';
        if (typeof activeFilterGuidelines === 'function') activeFilterGuidelines();
    };

    window.renderArchiveView = function (options = {}) {
        const container = document.getElementById('view-archive');
        if (!container) return;

        const config = (typeof GOOGLE_DRIVE_ARCHIVE_CONFIG !== 'undefined') ? GOOGLE_DRIVE_ARCHIVE_CONFIG : {};
        const db = (typeof GUIDELINES_ARCHIVE_DB !== 'undefined') ? GUIDELINES_ARCHIVE_DB : [];
        const allFiles = collectArchiveFiles();

        currentMinistry = '전체';
        searchQuery = '';
        currentArchiveFacilityId = null;
        currentArchiveFacilityName = null;
        currentArchiveDocIds = null;
        currentFilteredArchiveFiles = allFiles.slice();

        if (options && options.facilityId) {
            const aliasMap = (typeof window !== 'undefined' && window.FACILITY_ROW_ID_ALIASES) ? window.FACILITY_ROW_ID_ALIASES : {};
            const resolvedId = aliasMap[options.facilityId] || options.facilityId;
            currentArchiveFacilityId = resolvedId;
            currentArchiveFacilityName = options.facilityName || resolvedId;
            const mapped = FACILITY_ARCHIVE_MAP[options.facilityId] || FACILITY_ARCHIVE_MAP[resolvedId];
            if (mapped && mapped.length > 0) {
                currentArchiveDocIds = mapped;
            }
        }

        const centralFiles = allFiles.filter(f => !resolveArchiveOrgInfo(f).isCivil);
        const civilFiles = allFiles.filter(f => resolveArchiveOrgInfo(f).isCivil);
        const totalPagesSum = allFiles.reduce((acc, f) => acc + (Number(f.totalPages) || 0), 0);

        const pillCounts = {};
        ARCHIVE_FILTER_PILLS.forEach(p => {
            if (p.key === '전체') {
                pillCounts[p.key] = allFiles.length;
            } else {
                pillCounts[p.key] = allFiles.filter(f => matchArchiveMinistryFilter(f, resolveArchiveOrgInfo(f), p.key)).length;
            }
        });

        const pillsHtml = ARCHIVE_FILTER_PILLS.map(p => {
            const cnt = pillCounts[p.key] || 0;
            if (p.key === '전체') {
                return `<button type="button" data-ministry="전체" onclick="window.setArchiveMinistryFilter('전체', this)" class="archive-ministry-pill active-pill px-3 py-1.5 rounded-full text-xs font-extrabold bg-primary text-on-primary shadow-2xs transition cursor-pointer">전체 (${cnt}종)</button>`;
            }
            if (p.isCivil) {
                return `<button type="button" data-ministry="${p.key}" onclick="window.setArchiveMinistryFilter('${p.key}', this)" class="archive-ministry-pill px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 shadow-2xs ml-auto"><span>${p.icon}</span><span>${p.label}</span><span class="px-1.5 py-0.2 bg-white/80 rounded-full text-[10px]">${cnt}</span></button>`;
            }
            return `<button type="button" data-ministry="${p.key}" onclick="window.setArchiveMinistryFilter('${p.key}', this)" class="archive-ministry-pill px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer">${p.icon} ${p.label} (${cnt})</button>`;
        }).join('');

        const driveCategoryStripHtml = db.map(cat => {
            const folderUrl = cat.driveFolderUrl || config.driveFolderUrl || 'https://drive.google.com/drive/folders/1xWxy_TsQicTWTuZpoNTBl7-26KirLZe-?usp=sharing';
            return `
                <a href="${escA(folderUrl)}" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-[11px] font-bold text-slate-700 transition shadow-2xs">
                    <span>${cat.icon || '📁'}</span>
                    <span>${escA(cat.categoryName)}</span>
                    <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-extrabold">${cat.fileCount || 0}</span>
                    <span class="text-[10px] opacity-70">↗</span>
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="flex flex-col w-full animate-fadeIn pb-16">
                <!-- 1. Hero & Master Package Header -->
                <section class="no-print w-full bg-surface-container-low py-8 md:py-10 border-b border-outline-variant/20 hidden md:block">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div class="space-y-2 max-w-3xl">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold border border-blue-200">PURE PDF STANDARD v3.5</span>
                                    <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">✓ 70종 100% 순수 PDF 정본 단일화 (${totalPagesSum.toLocaleString()}면)</span>
                                </div>
                                <h1 class="text-3xl font-black text-primary tracking-tight">공식 지침서 아카이브 70종 마스터 통합표</h1>
                                <p class="text-sm text-on-surface-variant leading-relaxed">
                                    상단 탭 1(45개 시설체계) · 탭 2(219개 위계도감)와 동일한 <strong class="text-slate-900">9대 원클릭 부처·섹터 필터</strong> 및 <strong class="text-slate-900">6단계 소속계통-소관기관 체계</strong>로 각 부처·공공기관의 최신 공식 사업안내 PDF 원문을 Google Drive에서 즉시 열람·다운로드합니다.
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
                                <a href="${escA(config.driveFolderUrl || 'https://drive.google.com/drive/folders/1xWxy_TsQicTWTuZpoNTBl7-26KirLZe-?usp=sharing')}" target="_blank" rel="noopener noreferrer"
                                   class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 font-bold text-xs shadow-2xs transition">
                                    <span>☁️</span><span>Google Drive 70종 정본 폴더 ↗</span>
                                </a>
                                <a href="${escA(config.driveDownloadUrl || 'https://drive.google.com/uc?export=download&id=1SYOUxXgZxwmW-5FlJf4iQJUmMF9JgkdF')}" target="_blank" rel="noopener noreferrer"
                                   class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition">
                                    <span>📦</span><span>Drive 전체 ZIP 내려받기 (${escA(config.zipSizeStr || '366.3 MB')})</span>
                                </a>
                            </div>
                        </div>

                        <!-- 9개 부처·섹터별 Google Drive 원클릭 폴더 스트립 -->
                        <div class="bg-white/90 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                                    <span>📂</span><span>9대 분야별 Google Drive 정본 폴더 직통 연결 (전 파일 클릭 즉시 다운로드)</span>
                                </span>
                                <span class="text-[11px] text-slate-500 font-semibold">전 파일 100% 순수 PDF · 비정형 HWP/XLSX 변환 완료</span>
                            </div>
                            <div class="flex flex-wrap items-center gap-1.5">
                                ${driveCategoryStripHtml}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 2. Unified Search & 9-Pill Filter Toolbar -->
                <div class="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full hidden md:block">
                    <div id="archiveFacilityBannerContainer" class="hidden"></div>
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
                        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                            <div class="relative flex-1">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                                <input type="text" id="guidelineSearchInput" placeholder="지침서명, 소관기관, 근거법령, 핵심 챕터 검색 (예: 노인보건복지, 발달장애, 스마일센터, KOICA)..."
                                       class="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition">
                                <button type="button" id="clearSearchBtn" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer">✕</button>
                            </div>
                            <div class="flex flex-wrap items-center gap-1.5 shrink-0">
                                <span id="searchBadgeCount" class="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                                    ${allFiles.length}건 표시중
                                </span>
                                <button type="button" id="copyArchiveTsvBtn" onclick="window.copyArchiveTSV()" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition shadow-2xs" title="현재 필터링된 지침서 목록을 엑셀/구글시트 붙여넣기용(TSV)으로 복사">
                                    <span>📋</span><span>표 복사 (TSV)</span>
                                </button>
                                <button type="button" id="exportCsvBtn" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition border border-slate-200" title="현재 필터링된 지침서 목록을 Excel (.csv) 파일로 다운로드">
                                    <span>📊</span><span>Excel (.csv) 저장</span>
                                </button>
                                <button type="button" onclick="window.print()" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition border border-slate-200" title="현재 화면의 표를 A4 가로 인쇄 또는 PDF로 저장">
                                    <span>🖨️</span><span>표 인쇄 / PDF</span>
                                </button>
                                <button type="button" id="resetArchiveTopBtn" onclick="window.clearArchiveFacilityFilter()" class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer transition">
                                    초기화
                                </button>
                            </div>
                        </div>

                        <!-- 탭 1·2·3 공통 9대 원클릭 부처·섹터 필터 바 -->
                        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                            ${pillsHtml}
                        </div>
                    </div>
                </div>

                <!-- 3. Desktop Unified Tables Container -->
                <div id="archiveTablesContainer" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full hidden md:flex flex-col gap-8">
                    <!-- 단일 중앙행정기관 6단계 마스터 아카이브 표 (62종) -->
                    <div id="archiveCentralSection" class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        <div class="px-5 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-4">
                            <div class="flex items-center gap-2.5">
                                <span class="text-lg">🏛️</span>
                                <div>
                                    <h2 class="text-sm font-extrabold tracking-tight">중앙행정기관 소관 공식 지침서 6단계 마스터 통합표</h2>
                                    <p class="text-[11px] text-slate-300">11개 소속 계통 · 12개 부처·청·위원회 · 중앙부처 정본 PDF ${centralFiles.length}종 (탭 1·2 동일 기준)</p>
                                </div>
                            </div>
                            <span id="archiveCentralCountBadge" class="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-sky-300">
                                중앙 ${centralFiles.length}종
                            </span>
                        </div>
                        <div class="overflow-x-auto">
                            <table id="archiveCentralTable" class="w-full text-left border-collapse table-fixed min-w-[960px]">
                                <colgroup>
                                    <col class="w-[10%]">
                                    <col class="w-[15%]">
                                    <col class="w-[24%]">
                                    <col class="w-[17%]">
                                    <col class="w-[16%]">
                                    <col class="w-[18%]">
                                </colgroup>
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                                        <th class="py-3 px-3 border-r border-slate-200/80">1열 소속 계통<br><span class="text-[10px] font-normal text-slate-400">(부 / 국무총리)</span></th>
                                        <th class="py-3 px-3 border-r border-slate-200/80">2열 소관기관 · 담당과<br><span class="text-[10px] font-normal text-slate-400">(Drive 폴더 직통)</span></th>
                                        <th class="py-3 px-3 border-r border-slate-200/80">3열 지침서 공식 명칭 · 판본<br><span class="text-[10px] font-normal text-slate-400">(순수 PDF · 면수 · 용량)</span></th>
                                        <th class="py-3 px-3 border-r border-slate-200/80">4열 핵심 관할 법령 · 대상시설<br><span class="text-[10px] font-normal text-slate-400">(시설도감 1:1 직결)</span></th>
                                        <th class="py-3 px-3 border-r border-slate-200/80">5열 주요 수록 챕터<br><span class="text-[10px] font-normal text-slate-400">(핵심 지침 요약)</span></th>
                                        <th class="py-3 px-3">6열 연계 위계 · 원문 열람/다운로드<br><span class="text-[10px] font-normal text-slate-400">(위계도감 · 로컬PDF · Drive)</span></th>
                                    </tr>
                                </thead>
                                <tbody id="archiveCentralTbody" class="divide-y divide-slate-200 text-xs">
                                    ${renderDesktopRows(centralFiles, false)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 하단 민간 제3섹터 · 사회적경제 · 종교공익 생태계 지침서 섹션 (8종) -->
                    <div id="archiveCivilSection" class="bg-white rounded-2xl shadow-md border-2 border-amber-200/80 overflow-hidden">
                        <div class="px-5 py-4 bg-gradient-to-r from-amber-50 via-orange-50/70 to-emerald-50/70 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl shadow-xs">🤝</div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-extrabold">민간·사회적경제·종교공익</span>
                                        <h2 class="text-sm font-extrabold text-amber-950">민간 제3섹터 · 사회적경제 · 종교공익 생태계 공식 지침서 (${civilFiles.length}종)</h2>
                                    </div>
                                    <p class="text-xs text-amber-900/80 mt-0.5">
                                        축 1(사랑의열매·KOICA·ESG) · 축 2(사회적기업·협동조합·사회적농업) · 축 3(종교법인·전통사찰 템플스테이)
                                    </p>
                                </div>
                            </div>
                            <span id="archiveCivilCountBadge" class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold shrink-0">
                                제3섹터 ${civilFiles.length}종
                            </span>
                        </div>
                        <div class="overflow-x-auto">
                            <table id="archiveCivilTable" class="w-full text-left border-collapse table-fixed min-w-[960px]">
                                <colgroup>
                                    <col class="w-[10%]">
                                    <col class="w-[15%]">
                                    <col class="w-[24%]">
                                    <col class="w-[17%]">
                                    <col class="w-[16%]">
                                    <col class="w-[18%]">
                                </colgroup>
                                <thead>
                                    <tr class="bg-amber-50/70 border-b border-amber-200/80 text-[11px] font-extrabold text-amber-950 uppercase tracking-wider">
                                        <th class="py-3 px-3 border-r border-amber-200/60">1열 생태계 축</th>
                                        <th class="py-3 px-3 border-r border-amber-200/60">2열 주무기관 · 담당부서</th>
                                        <th class="py-3 px-3 border-r border-amber-200/60">3열 지침서 공식 명칭 · 판본</th>
                                        <th class="py-3 px-3 border-r border-amber-200/60">4열 근거법령 · 대상시설</th>
                                        <th class="py-3 px-3 border-r border-amber-200/60">5열 주요 수록 챕터</th>
                                        <th class="py-3 px-3">6열 연계 위계 · 원문 열람/다운로드</th>
                                    </tr>
                                </thead>
                                <tbody id="archiveCivilTbody" class="divide-y divide-amber-100 text-xs">
                                    ${renderDesktopRows(civilFiles, true)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- 4. Mobile Archive View -->
                <div class="no-print block md:hidden w-full pb-28" id="mobileArchiveView">
                    <div class="max-w-md mx-auto px-4 py-3 space-y-4">
                        <div class="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-4 text-white shadow-md space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold">2026 순수 PDF 아카이브</span>
                                <span class="text-[10px] text-blue-200 font-bold">70종 정본 완결</span>
                            </div>
                            <h2 class="text-base font-extrabold tracking-tight">공식 지침서 아카이브 (70종 · ${totalPagesSum.toLocaleString()}면)</h2>
                            <div class="flex items-center gap-2 pt-1">
                                <a href="${escA(config.driveFolderUrl || 'https://drive.google.com/drive/folders/1xWxy_TsQicTWTuZpoNTBl7-26KirLZe-?usp=sharing')}" target="_blank" rel="noopener noreferrer"
                                   class="flex-1 py-2 rounded-xl bg-white text-blue-900 text-center text-[11px] font-extrabold shadow-xs">☁️ Drive 폴더 열기 ↗</a>
                                <a href="${escA(config.driveDownloadUrl || 'https://drive.google.com/uc?export=download&id=1SYOUxXgZxwmW-5FlJf4iQJUmMF9JgkdF')}" target="_blank" rel="noopener noreferrer"
                                   class="flex-1 py-2 rounded-xl bg-blue-500 text-white text-center text-[11px] font-extrabold shadow-xs">📦 Drive ZIP 다운로드</a>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="relative">
                                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                                <input type="text" id="mobile-archive-search" oninput="window.handleMobileArchiveSearch(this.value)" placeholder="지침서명, 소관부처, 키워드 검색..."
                                       class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500 shadow-xs">
                            </div>
                            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="mobile-archive-ministry-pills">
                                ${ARCHIVE_FILTER_PILLS.map(p => {
                                    const cnt = pillCounts[p.key] || 0;
                                    const cls = p.key === '전체'
                                        ? 'archive-mobile-pill px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-slate-900 text-white flex-shrink-0 cursor-pointer'
                                        : 'archive-mobile-pill px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 flex-shrink-0 cursor-pointer';
                                    return `<button type="button" data-ministry="${p.key}" onclick="window.setArchiveMinistryFilter('${p.key}', this)" class="${cls}">${p.icon ? p.icon + ' ' : ''}${p.label} (${cnt})</button>`;
                                }).join('')}
                            </div>
                        </div>

                        <div id="mobileArchiveFacilityBannerContainer" class="hidden"></div>
                        <div class="space-y-3" id="mobile-archive-cards-feed">
                            ${renderMobileCards(allFiles)}
                        </div>
                        <div id="mobile-archive-empty-notice" class="hidden py-8 text-center bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
                            <span class="text-2xl block">🔍</span>
                            <div class="text-xs font-bold text-slate-700">일치하는 지침서가 없습니다.</div>
                        </div>
                    </div>
                </div>

                <!-- 5. Empty State -->
                <div id="noResultsState" class="hidden max-w-7xl mx-auto px-4 py-16 text-center">
                    <h3 class="text-lg font-extrabold text-slate-800">조건에 일치하는 지침서가 없습니다</h3>
                    <p class="text-xs text-slate-500 mt-1">검색어나 부처 필터를 초기화해 보세요.</p>
                    <button type="button" id="resetSearchFilterBtn" class="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer">필터 초기화</button>
                </div>
            </div>
        `;

        bindArchiveEvents(allFiles);

        if (options && (options.facilityId || options.search || options.highlightId || options.ministry)) {
            if (options.ministry) {
                currentMinistry = options.ministry;
            }
            if (options.search) {
                searchQuery = options.search;
                const sInput = document.getElementById('guidelineSearchInput');
                if (sInput) sInput.value = options.search;
            }
            if (typeof activeFilterGuidelines === 'function') {
                activeFilterGuidelines();
            }
            if (options.highlightId) {
                setTimeout(() => {
                    highlightAndScrollGuideline(options.highlightId);
                }, 180);
            }
        }
    };

    function renderDesktopRows(filesList, isCivilSection = false) {
        if (!filesList || filesList.length === 0) {
            return `<tr><td colspan="6" class="py-10 text-center text-slate-400 font-bold">일치하는 공식 지침서가 없습니다.</td></tr>`;
        }

        const enriched = filesList.map((f, idx) => ({
            file: f,
            orgInfo: resolveArchiveOrgInfo(f),
            idx
        }));

        enriched.sort((a, b) => {
            if (isCivilSection) {
                const ai = ARCHIVE_AXIS_ORDER.indexOf(a.orgInfo.axis);
                const bi = ARCHIVE_AXIS_ORDER.indexOf(b.orgInfo.axis);
                if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
            } else {
                const ai = ARCHIVE_LINEAGE_ORDER.indexOf(a.orgInfo.lineage);
                const bi = ARCHIVE_LINEAGE_ORDER.indexOf(b.orgInfo.lineage);
                if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                if (a.orgInfo.primary === a.orgInfo.lineage && b.orgInfo.primary !== b.orgInfo.lineage) return -1;
                if (b.orgInfo.primary === b.orgInfo.lineage && a.orgInfo.primary !== a.orgInfo.lineage) return 1;
            }
            return a.idx - b.idx;
        });

        // Build Group1(lineage/axis) -> Group2(primary agency) -> items
        const g1Map = new Map();
        enriched.forEach(item => {
            const { orgInfo } = item;
            const g1Key = isCivilSection ? orgInfo.axis : orgInfo.lineage;
            const g2Key = `${g1Key}||${orgInfo.primary}`;
            if (!g1Map.has(g1Key)) g1Map.set(g1Key, { key: g1Key, orgInfo, children: new Map(), count: 0 });
            const g1 = g1Map.get(g1Key);
            g1.count++;
            if (!g1.children.has(g2Key)) g1.children.set(g2Key, { key: g2Key, orgInfo, items: [] });
            g1.children.get(g2Key).items.push(item);
        });

        let html = '';
        g1Map.forEach(g1 => {
            let g1Done = false;
            g1.children.forEach(g2 => {
                let g2Done = false;
                const g2Span = g2.items.length;

                g2.items.forEach(({ file: f, orgInfo }) => {
                    const facilityMatch = resolveFacilityTarget(f.legalTarget, f);
                    const targetFacId = f.facilityTargetId || (facilityMatch && facilityMatch.id) || 'law-welfare-center';
                    const targetFacLabel = (facilityMatch && facilityMatch.name) || f.category || '법정시설 대조';
                    const hLink = f.hierarchyLink || { targetId: 'comm-case-intake', label: '위계도감 보기' };
                    const cleanHLabel = String(hLink.label || '위계도감').replace(/^(L1|Track2)\s*>\s*/i, '');
                    const isSubOrg = !isCivilSection && orgInfo.primary !== orgInfo.lineage;
                    const driveFolderUrl = f._driveFolderUrl || '';
                    const driveViewUrl = f.driveViewUrl || driveFolderUrl || '#';
                    const chaptersHtml = (f.keyChapters || []).map(ch =>
                        `<span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 text-[10px] font-semibold leading-tight">${escA(ch)}</span>`
                    ).join(' ');

                    html += `<tr id="guideline-row-${escA(f.id)}" class="guideline-row hover:bg-blue-50/40 transition-colors" data-doc-id="${escA(f.id)}">`;

                    if (!g1Done) {
                        g1Done = true;
                        if (isCivilSection) {
                            html += `<td class="align-top p-3 bg-amber-50/60 border-r border-amber-200/70 font-extrabold text-amber-950" rowspan="${g1.count}">
                                <div class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 border border-amber-300 text-[11px] font-extrabold text-amber-950 leading-snug">
                                    <span>${orgInfo.lineageIcon}</span><span>${escA(g1.key)}</span>
                                </div>
                                <div class="text-[10px] text-amber-800/80 font-medium mt-1.5">${g1.count}종 지침서</div>
                            </td>`;
                        } else {
                            html += `<td class="align-top p-3 bg-slate-50/90 border-r border-slate-200/80 font-extrabold text-slate-900" rowspan="${g1.count}">
                                <div class="flex items-center gap-1.5">
                                    <span class="text-sm">${orgInfo.lineageIcon}</span>
                                    <span class="text-xs font-extrabold text-slate-900 leading-tight">${escA(orgInfo.lineageLabel)}</span>
                                </div>
                                <div class="text-[10px] text-slate-400 font-semibold mt-1">${g1.count}종 정본</div>
                            </td>`;
                        }
                    }

                    if (!g2Done) {
                        g2Done = true;
                        html += `<td class="align-top p-3 bg-white border-r border-slate-200/80" rowspan="${g2Span}">
                            <div class="space-y-1.5">
                                <div class="flex flex-wrap items-center gap-1">
                                    ${isSubOrg ? `<span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">${escA(orgInfo.orgType)}</span>` : ''}
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-extrabold">
                                        <span>${orgInfo.orgIcon}</span><span>${escA(orgInfo.primary)}</span>
                                    </span>
                                </div>
                                ${f.department ? `<div class="text-[11px] text-slate-600 font-semibold">담당: ${escA(f.department)}</div>` : ''}
                                ${driveFolderUrl ? `
                                    <a href="${escA(driveFolderUrl)}" target="_blank" rel="noopener noreferrer"
                                       class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[10px] font-bold transition">
                                        <span>📂 Drive 폴더 열기</span><span>↗</span>
                                    </a>
                                ` : ''}
                            </div>
                        </td>`;
                    }

                    html += `
                        <td class="align-top p-3 bg-white border-r border-slate-200/80 space-y-1.5">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-extrabold">${escA(f.code || f.id)}</span>
                                <a href="${escA(f.driveDownloadUrl || driveViewUrl)}" target="_blank" rel="noopener noreferrer"
                                   title="클릭 시 Google Drive에서 '${escA(f.title)}' PDF 파일 즉시 다운로드"
                                   class="archive-pdf-badge-link inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 text-[10px] font-extrabold transition cursor-pointer shadow-2xs">⬇ PDF</a>
                                <span class="text-[10px] text-slate-500 font-semibold">${escA(f.edition || (f.year + '판'))}</span>
                            </div>
                            <div class="font-extrabold text-slate-900 text-xs leading-snug">${escA(f.title)}</div>
                            <div class="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                <span>📄 ${Number(f.totalPages || 0).toLocaleString()}면</span>
                                <span>•</span>
                                <span>💾 ${escA(f.sizeStr || '')}</span>
                            </div>
                        </td>
                        <td class="align-top p-3 bg-white border-r border-slate-200/80 space-y-1.5">
                            <div class="text-[11px] text-slate-700 leading-snug font-medium">${escA(f.legalTarget || '')}</div>
                            <button type="button" onclick="window.jumpToFacility('${escA(targetFacId)}'); return false;"
                                class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-[10px] font-bold transition cursor-pointer">
                                <span>🏛️ ${escA(targetFacLabel)}</span><span>➔</span>
                            </button>
                        </td>
                        <td class="align-top p-3 bg-slate-50/40 border-r border-slate-200/80">
                            <div class="flex flex-wrap gap-1">${chaptersHtml}</div>
                        </td>
                        <td class="align-top p-3 bg-slate-50/60 space-y-1.5">
                            <div class="grid grid-cols-2 gap-1">
                                <button type="button" onclick="window.viewGuidelineModal('${escA(f.id)}'); return false;"
                                    class="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold transition cursor-pointer">
                                    👁️ 요약
                                </button>
                                <button type="button" onclick="window.downloadGuidelineDirect('${escA(f.id)}'); return false;"
                                    class="py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition cursor-pointer">
                                    ⬇️ PDF
                                </button>
                            </div>
                            ${driveViewUrl && driveViewUrl !== '#' ? `
                                <a href="${escA(driveViewUrl)}" target="_blank" rel="noopener noreferrer"
                                   class="w-full py-1 px-2 rounded-lg bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 border border-sky-200 text-[10px] font-bold flex items-center justify-center gap-1 transition">
                                    <span>☁️ Google Drive 원문</span><span>↗</span>
                                </a>
                            ` : ''}
                            <button type="button" onclick="showView('hierarchy', { targetNodeId: '${escA(hLink.targetId)}' }); return false;"
                                class="w-full py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer truncate">
                                <span>🌳 ${escA(cleanHLabel)}</span><span>➔</span>
                            </button>
                        </td>
                    </tr>`;
                });
            });
        });
        return html;
    }

    function renderMobileCards(files) {
        return (files || []).map(f => {
            const orgInfo = resolveArchiveOrgInfo(f);
            const hLink = f.hierarchyLink || { targetId: 'comm-case-intake', label: '위계도감 보기' };
            return `
                <div id="mobile-card-${escA(f.id)}" class="guideline-card bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5" data-doc-id="${escA(f.id)}">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-extrabold">${escA(orgInfo.primary)}</span>
                            <a href="${escA(f.driveDownloadUrl || f.driveViewUrl || '#')}" target="_blank" rel="noopener noreferrer"
                               class="archive-pdf-badge-link inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 text-[10px] font-extrabold transition">⬇ PDF · ${Number(f.totalPages || 0)}면</a>
                        </div>
                        <span class="text-[10px] text-slate-400 font-semibold shrink-0">${escA(f.sizeStr || '')}</span>
                    </div>
                    <h4 class="text-sm font-black text-slate-900 leading-snug">${escA(f.title)}</h4>
                    <p class="text-[11px] text-slate-500 line-clamp-2">${escA(f.legalTarget || '')}</p>
                    <div class="grid grid-cols-3 gap-1.5 pt-1">
                        <button type="button" onclick="window.downloadGuidelineDirect('${escA(f.id)}')" class="py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold cursor-pointer">⬇️ PDF</button>
                        <button type="button" onclick="window.viewGuidelineModal('${escA(f.id)}')" class="py-1.5 rounded-xl bg-slate-100 text-slate-800 text-[11px] font-bold cursor-pointer">👁️ 요약</button>
                        <button type="button" onclick="showView('hierarchy', { targetNodeId: '${escA(hLink.targetId)}' })" class="py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold cursor-pointer">🌳 위계</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function bindArchiveEvents(allFiles) {
        const searchInput = document.getElementById('guidelineSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        const badgeCount = document.getElementById('searchBadgeCount');
        const noResults = document.getElementById('noResultsState');
        const resetBtn = document.getElementById('resetSearchFilterBtn');
        const tablesContainer = document.getElementById('archiveTablesContainer');
        const exportCsvBtn = document.getElementById('exportCsvBtn');

        function filterGuidelines() {
            const q = String(searchQuery || '').trim().toLowerCase();
            const normQ = q.replace(/성평등가족부/g, '여성가족부');
            const basePool = (currentArchiveDocIds && currentArchiveDocIds.length > 0)
                ? allFiles.filter(f => currentArchiveDocIds.includes(f.id))
                : allFiles;

            const filtered = basePool.filter(f => {
                const orgInfo = resolveArchiveOrgInfo(f);
                const minMatch = matchArchiveMinistryFilter(f, orgInfo, currentMinistry);
                const hay = [f.title, f.ministry, orgInfo.lineageLabel, f.department, f.code, f.legalTarget, ...(f.keyChapters || [])].filter(Boolean).join(' ').toLowerCase();
                const qMatch = !q || hay.includes(q) || (normQ && hay.includes(normQ));
                return minMatch && qMatch;
            });

            currentFilteredArchiveFiles = filtered;
            renderArchiveFacilityBanner(currentArchiveFacilityId, currentArchiveFacilityName, filtered);

            const centralFiltered = filtered.filter(f => !resolveArchiveOrgInfo(f).isCivil);
            const civilFiltered = filtered.filter(f => resolveArchiveOrgInfo(f).isCivil);

            const cTbody = document.getElementById('archiveCentralTbody');
            const civTbody = document.getElementById('archiveCivilTbody');
            if (cTbody) cTbody.innerHTML = renderDesktopRows(centralFiltered, false);
            if (civTbody) civTbody.innerHTML = renderDesktopRows(civilFiltered, true);

            const cSec = document.getElementById('archiveCentralSection');
            const civSec = document.getElementById('archiveCivilSection');
            if (cSec) cSec.style.display = centralFiltered.length > 0 ? '' : 'none';
            if (civSec) civSec.style.display = civilFiltered.length > 0 ? '' : 'none';

            const cBadge = document.getElementById('archiveCentralCountBadge');
            const civBadge = document.getElementById('archiveCivilCountBadge');
            if (cBadge) cBadge.textContent = `중앙 ${centralFiltered.length}종`;
            if (civBadge) civBadge.textContent = `제3섹터 ${civilFiltered.length}종`;

            const mobFeed = document.getElementById('mobile-archive-cards-feed');
            const mobEmpty = document.getElementById('mobile-archive-empty-notice');
            if (mobFeed) mobFeed.innerHTML = renderMobileCards(filtered);
            if (mobEmpty) mobEmpty.classList.toggle('hidden', filtered.length > 0);

            if (badgeCount) badgeCount.textContent = `${filtered.length}건 표시중`;
            if (noResults) noResults.classList.toggle('hidden', filtered.length > 0);
            if (tablesContainer) tablesContainer.classList.toggle('hidden', filtered.length === 0);
        }
        activeFilterGuidelines = filterGuidelines;

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                currentArchiveFacilityId = null;
                currentArchiveFacilityName = null;
                currentArchiveDocIds = null;
                searchQuery = this.value;
                if (clearBtn) clearBtn.classList.toggle('hidden', !searchQuery);
                filterGuidelines();
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                clearBtn.classList.add('hidden');
                filterGuidelines();
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', window.clearArchiveFacilityFilter);
        }
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', function () {
                exportGuidelinesToCsv(currentFilteredArchiveFiles.length > 0 ? currentFilteredArchiveFiles : allFiles);
            });
        }
    }

    window.setArchiveMinistryFilter = function (ministryKey, btnEl) {
        currentArchiveFacilityId = null;
        currentArchiveFacilityName = null;
        currentArchiveDocIds = null;
        currentFilteredArchiveFiles = allFiles.slice();
        currentMinistry = ministryKey || '전체';

        document.querySelectorAll('.archive-ministry-pill').forEach(p => {
            const key = p.getAttribute('data-ministry');
            const isCivil = key === '민간제3섹터';
            const isActive = key === currentMinistry;
            if (isActive) {
                p.className = isCivil
                    ? 'archive-ministry-pill active-pill px-3 py-1.5 rounded-full text-xs font-extrabold bg-amber-600 text-white shadow-2xs transition cursor-pointer flex items-center gap-1 ml-auto'
                    : 'archive-ministry-pill active-pill px-3 py-1.5 rounded-full text-xs font-extrabold bg-primary text-on-primary shadow-2xs transition cursor-pointer';
            } else {
                p.className = isCivil
                    ? 'archive-ministry-pill px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 shadow-2xs ml-auto'
                    : 'archive-ministry-pill px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer';
            }
        });
        document.querySelectorAll('.archive-mobile-pill').forEach(p => {
            const isActive = p.getAttribute('data-ministry') === currentMinistry;
            p.className = isActive
                ? 'archive-mobile-pill px-2.5 py-1.5 rounded-lg text-xs font-extrabold bg-slate-900 text-white flex-shrink-0 cursor-pointer'
                : 'archive-mobile-pill px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 flex-shrink-0 cursor-pointer';
        });

        if (typeof activeFilterGuidelines === 'function') activeFilterGuidelines();
    };

    window.filterArchiveByMinistry = function (minKey, el) {
        window.setArchiveMinistryFilter(minKey, el);
    };

    window.handleMobileArchiveSearch = function (val) {
        searchQuery = val || '';
        const desktopInput = document.getElementById('guidelineSearchInput');
        if (desktopInput) desktopInput.value = searchQuery;
        if (typeof activeFilterGuidelines === 'function') activeFilterGuidelines();
    };

    window.copyArchiveTSV = function () {
        const files = (currentFilteredArchiveFiles && currentFilteredArchiveFiles.length > 0) ? currentFilteredArchiveFiles : collectArchiveFiles();
        if (!files.length) {
            alert('복사할 지침서 데이터가 없습니다.');
            return;
        }
        const header = ['구분', '소속계통_생태계축', '소관기관', '담당부서', '지침서코드', '지침서명', '판본', '포맷', '면수', '용량', '근거법령_대상시설', '주요챕터', 'Drive_열람링크', 'PDF_다운로드링크'];
        const clean = (v) => String(v || '-').replace(/[\t\r\n]+/g, ' ').trim();
        const lines = [header.join('\t')];
        files.forEach(f => {
            const orgInfo = resolveArchiveOrgInfo(f);
            lines.push([
                orgInfo.isCivil ? '민간·제3섹터' : '중앙행정기관',
                orgInfo.lineageLabel,
                orgInfo.primary,
                f.department,
                f.code,
                f.title,
                f.edition || (f.year + '판'),
                'PDF',
                f.totalPages || 0,
                f.sizeStr,
                f.legalTarget,
                (f.keyChapters || []).join(' / '),
                f.driveViewUrl || '',
                f.driveDownloadUrl || ''
            ].map(clean).join('\t'));
        });
        navigator.clipboard.writeText(lines.join('\n')).then(() => {
            alert(`📋 공식 지침서 아카이브 ${files.length}종 목록이 엑셀·스프레드시트 붙여넣기용(TSV)으로 복사되었습니다!`);
        }).catch(() => {
            alert('클립보드 복사 권한을 허용해 주세요.');
        });
    };

    function exportGuidelinesToCsv(files) {
        const targetFiles = (files && files.length > 0) ? files : collectArchiveFiles();
        let csv = '\uFEFF구분,1열_소속계통,2열_소관기관,담당부서,3열_지침서코드,지침서명,판본,포맷,면수,용량,4열_근거법령_대상시설,5열_주요챕터,6열_Drive열람링크,6열_PDF다운로드링크\n';
        const q = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
        targetFiles.forEach(f => {
            const orgInfo = resolveArchiveOrgInfo(f);
            csv += [
                q(orgInfo.isCivil ? '민간·제3섹터' : '중앙행정기관'),
                q(orgInfo.lineageLabel),
                q(orgInfo.primary),
                q(f.department),
                q(f.code),
                q(f.title),
                q(f.edition || (f.year + '판')),
                q('PDF'),
                q(f.totalPages),
                q(f.sizeStr),
                q(f.legalTarget),
                q((f.keyChapters || []).join(' / ')),
                q(f.driveViewUrl || f._driveFolderUrl || ''),
                q(f.driveDownloadUrl || '')
            ].join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `2026_사회복지_공식지침서_${targetFiles.length}종_마스터목록_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    window.viewGuidelineModal = function (docId) {
        const allFiles = collectArchiveFiles();
        const f = allFiles.find(x => x.id === docId);
        if (!f) return;
        const orgInfo = resolveArchiveOrgInfo(f);
        const old = document.getElementById('guideline-detail-modal');
        if (old) old.remove();

        const facilityMatch = resolveFacilityTarget(f.legalTarget, f);
        const targetFacId = f.facilityTargetId || (facilityMatch && facilityMatch.id) || 'law-welfare-center';
        const hLink = f.hierarchyLink || { targetId: 'comm-case-intake', label: '위계도감 보기' };

        const modal = document.createElement('div');
        modal.id = 'guideline-detail-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
                <div class="p-5 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-start justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2 flex-wrap mb-1.5">
                            <span class="px-2 py-0.5 rounded bg-white/15 text-[11px] font-bold">${escA(orgInfo.lineageLabel)} ▸ ${escA(orgInfo.primary)}</span>
                            <span class="px-2 py-0.5 rounded bg-emerald-500 text-white text-[11px] font-extrabold">순수 PDF · ${Number(f.totalPages || 0)}면 · ${escA(f.sizeStr)}</span>
                        </div>
                        <h3 class="text-lg font-black leading-snug">${escA(f.title)}</h3>
                    </div>
                    <button type="button" onclick="document.getElementById('guideline-detail-modal').remove()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer shrink-0">✕</button>
                </div>
                <div class="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
                    <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div><span class="text-slate-400 font-bold block text-[10px]">문서 코드 / 판본</span><strong class="text-slate-900">${escA(f.code)} · ${escA(f.edition)}</strong></div>
                        <div><span class="text-slate-400 font-bold block text-[10px]">소관부처 / 담당부서</span><strong class="text-slate-900">${escA(f.ministry)} (${escA(f.department || '-')})</strong></div>
                        <div class="col-span-2"><span class="text-slate-400 font-bold block text-[10px]">근거 법령 및 대상 시설</span><strong class="text-slate-900">${escA(f.legalTarget)}</strong></div>
                    </div>
                    <div>
                        <h4 class="font-extrabold text-slate-900 mb-2">📌 주요 수록 챕터 및 지침 핵심</h4>
                        <div class="flex flex-wrap gap-1.5">
                            ${(f.keyChapters || []).map(c => `<span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-bold">${escA(c)}</span>`).join('')}
                        </div>
                    </div>
                    <div class="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 text-[11px] text-slate-700 space-y-2">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <strong class="text-sky-950 flex items-center gap-1"><span>☁️</span><span>Google Drive 공식 클라우드 정본 (즉시 다운로드 가능)</span></strong>
                            ${f._driveFolderUrl ? `<a href="${escA(f._driveFolderUrl)}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline font-bold">📂 소관부처 폴더 열기 ↗</a>` : ''}
                        </div>
                        <div class="text-[10px] text-slate-600">
                            파일명: <strong class="text-slate-800">${escA(f.filename || (f.title + '.pdf'))}</strong>
                        </div>
                    </div>
                </div>
                <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="document.getElementById('guideline-detail-modal').remove(); window.jumpToFacility('${escA(targetFacId)}')" class="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-800 border border-indigo-200 text-xs font-bold cursor-pointer transition">🏛️ 시설도감 보기</button>
                        <button type="button" onclick="document.getElementById('guideline-detail-modal').remove(); showView('hierarchy', { targetNodeId: '${escA(hLink.targetId)}' })" class="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer transition">🌳 위계도감 보기</button>
                    </div>
                    <div class="flex items-center gap-2">
                        ${f.driveViewUrl ? `<a href="${escA(f.driveViewUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 border border-sky-200 text-xs font-bold transition">☁️ Drive 열람 ↗</a>` : ''}
                        <a href="${escA(f.driveDownloadUrl || f.driveViewUrl || '#')}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs transition inline-flex items-center gap-1">⬇️ PDF 다운로드</a>
                    </div>
                </div>
            </div>
        `;
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        document.body.appendChild(modal);
    };

    window.downloadGuidelineDirect = function (docId) {
        const allFiles = collectArchiveFiles();
        const f = allFiles.find(x => x.id === docId);
        if (!f) return;
        const targetUrl = f.driveDownloadUrl || f.driveViewUrl || f._driveFolderUrl;
        if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    };

    function highlightAndScrollGuideline(docId) {
        const target = document.getElementById(`guideline-row-${docId}`) || document.getElementById(`mobile-card-${docId}`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (typeof window.triggerMatchHighlight === 'function') {
                window.triggerMatchHighlight(target);
            }
            target.classList.add('ring-4', 'ring-blue-500', 'bg-blue-50/70', 'transition-all', 'duration-500');
            setTimeout(() => {
                target.classList.remove('ring-4', 'ring-blue-500', 'bg-blue-50/70');
            }, 3000);
        }
    }
})();
