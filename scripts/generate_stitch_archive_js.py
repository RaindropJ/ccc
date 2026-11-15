# -*- coding: utf-8 -*-
"""
Phase 4: Generate the Stitch-aligned src/js/archive.js with:
- 2 Divided Matrix Sections (Section I: MOHW 34 files, Section II: Non-MOHW 19 files)
- Section header banners with batch download buttons
- Desktop matrix tables with 5 statutory columns
- Reverse link to 3-tier hierarchy (jumpToHierarchy)
- Mobile responsive card view (block md:hidden)
- Google Drive master cloud sync & direct file view
- Highlight & scroll support when coming from hierarchy
"""

archive_js_code = r'''/**
 * 공식 지침서 마스터 아카이브 - Google Stitch 디자인 규격 컨트롤러
 * - 섹션 Ⅰ: 보건복지부 소관 34종 핵심 법정지침서 (337.25 MB)
 * - 섹션 Ⅱ: 범부처 및 공공기관 19종 핵심 지침서 (113.70 MB)
 * - 3단계 위계도감과 1:1 역방향 점프(Deep-linking) 지원
 * - 데스크톱(hidden md:block) 매트릭스 테이블 + 모바일(block md:hidden) 카드 뷰
 */

(function () {
    let archiveSearchQuery = "";
    let selectedMinistryFilter = "all";

    function getArchiveDB() {
        return (typeof window !== 'undefined' && window.GUIDELINES_ARCHIVE_DB) ? window.GUIDELINES_ARCHIVE_DB : [];
    }

    function getArchiveConfig() {
        return (typeof window !== 'undefined' && window.GOOGLE_DRIVE_ARCHIVE_CONFIG) ? window.GOOGLE_DRIVE_ARCHIVE_CONFIG : {
            driveDownloadUrl: "https://drive.google.com/drive/folders/1welfare-archive-master-2026?usp=sharing",
            totalFiles: 53,
            totalSizeStr: "450.95 MB"
        };
    }

    // 뷰 렌더링 진입점
    window.renderArchiveView = function (options = {}) {
        const container = document.getElementById('view-archive');
        if (!container) return;

        renderLayout(container);

        // 특정 지침서로 스크롤 및 하이라이트 요청 시
        if (options.highlightId) {
            setTimeout(() => {
                highlightAndScrollGuideline(options.highlightId);
            }, 100);
        }
    };

    function renderLayout(container) {
        const db = getArchiveDB();
        const config = getArchiveConfig();

        // Flatten all files
        const allFiles = [];
        db.forEach(cat => {
            (cat.sources || []).forEach(src => {
                (src.files || []).forEach(f => {
                    allFiles.push(f);
                });
            });
        });

        const totalFiles = allFiles.length;
        const totalMB = config.totalSizeStr || "450.95 MB";

        container.innerHTML = `
            <div class="space-y-6 animate-fadeIn pb-16">
                <!-- 1. 헤어로 배너 & 드라이브 동기화 바 -->
                <div class="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-blue-800/40 relative overflow-hidden">
                    <div class="relative z-10 max-w-4xl">
                        <div class="flex flex-wrap items-center gap-2 mb-3">
                            <span class="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                                📁 대한민국 정부부처 공식 정본 단일화
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                                구글 드라이브 초고속 일괄 다운로드
                            </span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            공식 실무 지침서 마스터 아카이브
                        </h2>
                        <p class="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                            보건복지부, 여성가족부, 고용노동부, 교육부 등 8대 중앙부처 및 공공기관의 최신 2026 실천 지침서 53개 정본 풀패키지입니다. 
                            중복·구판을 정리하고 PDF 단일 정본으로 정비하여 3단계 위계도감과 완벽히 연계됩니다.
                        </p>

                        <!-- 핵심 지표 카드 & 전체 다운로드 액션 -->
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-800">
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                                <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                                    <div class="text-[11px] text-slate-400 font-medium">정본 지침서</div>
                                    <div class="text-xl sm:text-2xl font-black text-blue-400 font-num">${totalFiles}<span class="text-xs font-normal text-slate-300 ml-1">건</span></div>
                                </div>
                                <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                                    <div class="text-[11px] text-slate-400 font-medium">전체 총 용량</div>
                                    <div class="text-xl sm:text-2xl font-black text-white font-num">${totalMB}</div>
                                </div>
                                <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
                                    <div class="text-[11px] text-slate-400 font-medium">소관 부처·기관</div>
                                    <div class="text-xl sm:text-2xl font-black text-emerald-400 font-num">${db.length}<span class="text-xs font-normal text-slate-300 ml-1">대 기관</span></div>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 flex-shrink-0">
                                <a 
                                    href="${config.driveDownloadUrl}" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                                >
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                                    <span>구글 드라이브 일괄 다운 (${totalMB})</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. 검색 및 부처 필터 컨트롤 바 -->
                <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <!-- 검색창 -->
                        <div class="relative flex-1">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input 
                                type="text" 
                                id="archive-search-input" 
                                value="${archiveSearchQuery}" 
                                placeholder="지침서명, 소관 부서, 근거 법령, 챕터 태그 검색 (예: 사회복지관, 노인맞춤돌봄, 드림스타트, 발달장애...)" 
                                class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            ${archiveSearchQuery ? `
                                <button type="button" onclick="window.clearArchiveSearch()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    ✕
                                </button>
                            ` : ''}
                        </div>

                        <!-- 퀵 점프 버튼 -->
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <button 
                                type="button" 
                                onclick="showView('hierarchy')" 
                                class="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>🌳 3단계 위계도감 이동</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-num text-[10px]">90</span>
                            </button>
                        </div>
                    </div>

                    <!-- 소관 부처 필터 칩 -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                        <button 
                            type="button" 
                            onclick="window.setArchiveMinistry('all')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${selectedMinistryFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            전체 지침서 (${allFiles.length})
                        </button>
                        <button 
                            type="button" 
                            onclick="window.setArchiveMinistry('보건복지부')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${selectedMinistryFilter === '보건복지부' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            <span>🏥</span>
                            <span>보건복지부</span>
                            <span class="text-[10px] opacity-80 font-num">(34)</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="window.setArchiveMinistry('여성가족부')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${selectedMinistryFilter === '여성가족부' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            <span>👩‍👧</span>
                            <span>여성가족부</span>
                            <span class="text-[10px] opacity-80 font-num">(8)</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="window.setArchiveMinistry('교육부')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${selectedMinistryFilter === '교육부' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            <span>🏫</span>
                            <span>교육부 (영유아·학교)</span>
                            <span class="text-[10px] opacity-80 font-num">(3)</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="window.setArchiveMinistry('고용노동부')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${selectedMinistryFilter === '고용노동부' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            <span>💼</span>
                            <span>고용노동부</span>
                            <span class="text-[10px] opacity-80 font-num">(2)</span>
                        </button>
                        <button 
                            type="button" 
                            onclick="window.setArchiveMinistry('공공기관')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${selectedMinistryFilter === '공공기관' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            <span>🏛️</span>
                            <span>공동모금회·KOICA·기타</span>
                            <span class="text-[10px] opacity-80 font-num">(6)</span>
                        </button>
                    </div>
                </div>

                <!-- 3. 지침서 아카이브 2개 분할 매트릭스 컨텐츠 -->
                <div id="archive-content-area" class="space-y-8">
                    ${renderArchiveSections(allFiles)}
                </div>
            </div>
        `;

        bindEvents();
    }

    function renderArchiveSections(allFiles) {
        // 필터링 적용
        let filtered = allFiles;
        if (selectedMinistryFilter !== 'all') {
            if (selectedMinistryFilter === '보건복지부') {
                filtered = filtered.filter(f => f.ministry === '보건복지부');
            } else if (selectedMinistryFilter === '여성가족부') {
                filtered = filtered.filter(f => (f.ministry || '').includes('여성가족부'));
            } else if (selectedMinistryFilter === '교육부') {
                filtered = filtered.filter(f => (f.ministry || '').includes('교육부'));
            } else if (selectedMinistryFilter === '고용노동부') {
                filtered = filtered.filter(f => (f.ministry || '').includes('고용노동부'));
            } else if (selectedMinistryFilter === '공공기관') {
                filtered = filtered.filter(f => !['보건복지부', '여성가족부 (성평등가족부)', '교육부', '고용노동부'].includes(f.ministry));
            }
        }

        if (archiveSearchQuery.trim()) {
            const q = archiveSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(f => 
                f.title.toLowerCase().includes(q) ||
                f.filename.toLowerCase().includes(q) ||
                (f.department && f.department.toLowerCase().includes(q)) ||
                (f.code && f.code.toLowerCase().includes(q)) ||
                (f.legalTarget && f.legalTarget.toLowerCase().includes(q)) ||
                (f.keyChapters && f.keyChapters.some(c => c.toLowerCase().includes(q)))
            );
        }

        if (filtered.length === 0) {
            return `
                <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <span class="text-4xl">🔍</span>
                    <p class="text-base font-bold text-slate-800 mt-3">검색 조건과 일치하는 공식 지침서가 없습니다.</p>
                    <p class="text-xs text-slate-400 mt-1">지침서 제목이나 부처명을 다시 확인해 보세요.</p>
                    <button type="button" onclick="window.clearArchiveSearch()" class="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 cursor-pointer">
                        전체 지침서 보기
                    </button>
                </div>
            `;
        }

        const sec1Files = filtered.filter(f => f.section === 'SECTION_1' || f.ministry === '보건복지부');
        const sec2Files = filtered.filter(f => f.section === 'SECTION_2' || f.ministry !== '보건복지부');

        let html = '';

        // 섹션 Ⅰ: 보건복지부 핵심 법정지침서
        if (sec1Files.length > 0) {
            html += renderArchiveSectionBlock({
                numeral: 'Ⅰ',
                title: '중앙 정부부처 핵심 법정지침서',
                badgeText: `보건복지부 ${sec1Files.length}종`,
                subtitle: '사회복지관·노인복지·장애인자립·아동돌봄·보육 등 보건복지부 주요 복지사업 핵심 지침',
                batchText: '📥 복지부 지침 일괄 (337MB)',
                files: sec1Files
            });
        }

        // 섹션 Ⅱ: 범부처 및 공공기관 핵심 지침서
        if (sec2Files.length > 0) {
            html += renderArchiveSectionBlock({
                numeral: 'Ⅱ',
                title: '범부처 및 공공기관 핵심 지침서',
                badgeText: `범부처 및 공공기관 ${sec2Files.length}종`,
                subtitle: '여성가족부·교육부·고용노동부·사회복지공동모금회·KOICA 등 실천분야별 정본 지침',
                batchText: '📥 범부처 지침 일괄 (114MB)',
                files: sec2Files
            });
        }

        return html;
    }

    function renderArchiveSectionBlock({ numeral, title, badgeText, subtitle, batchText, files }) {
        const config = getArchiveConfig();

        return `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
                <!-- 섹션 헤더 배너 -->
                <div class="px-5 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-blue-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 font-num">${numeral}</span>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-extrabold tracking-tight">${title}</h3>
                                <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold font-num">${badgeText}</span>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-0.5">${subtitle}</p>
                        </div>
                    </div>
                    <a 
                        href="${config.driveDownloadUrl}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                        <span>${batchText}</span>
                    </a>
                </div>

                <!-- 1. 데스크톱: 공식 지침서 매트릭스 테이블 -->
                <div class="overflow-x-auto hidden md:block">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold text-center">
                                <th class="py-3 px-3 w-[13%] border-r border-slate-200">소관 부서 / 담당과</th>
                                <th class="py-3 px-4 w-[25%] border-r border-slate-200">지침서 공식 명칭 & 판본</th>
                                <th class="py-3 px-4 w-[24%] border-r border-slate-200">핵심 관련 법령 & 대상 시설</th>
                                <th class="py-3 px-4 w-[24%] border-r border-slate-200">주요 수록 챕터 및 핵심 지침 요약</th>
                                <th class="py-3 px-3 w-[14%]">연계 위계 & 원문 열람</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700">
                            ${renderDesktopArchiveRows(files)}
                        </tbody>
                    </table>
                </div>

                <!-- 2. 모바일: 반응형 지침서 카드 리스트 -->
                <div class="block md:hidden space-y-3 p-3 bg-slate-50/50">
                    ${renderMobileArchiveCards(files)}
                </div>
            </div>
        `;
    }

    function renderDesktopArchiveRows(files) {
        return files.map(f => {
            const trId = `guideline-row-${f.id}`;
            const tags = f.keyChapters || ["법정지침", "운영서식"];
            const hl = f.hierarchyLink || { targetId: "comm-case-intake", label: "L1 종합복지 > L2 운영 →" };
            const ministryClean = (f.ministry || '관계부처').split('(')[0].trim();
            const relPath = f.relPath || `Efficiency_DB/${f.filename}`;

            return `
                <tr id="${trId}" class="hover:bg-slate-50/70 transition">
                    <!-- 1열: 소관 부서 / 담당과 -->
                    <td class="p-3 text-center align-middle border-r border-slate-200 bg-slate-50/20">
                        <span class="inline-block px-2 py-0.5 rounded bg-blue-900 text-white text-[10px] font-bold">
                            ${ministryClean}
                        </span>
                        <div class="font-bold text-slate-800 text-[11px] mt-1">${f.department || '총괄부서'}</div>
                        <div class="text-[10px] text-slate-400 font-num">${f.code || f.id}</div>
                    </td>

                    <!-- 2열: 지침서 공식 명칭 & 판본 -->
                    <td class="p-3 align-middle border-r border-slate-200">
                        <div class="font-bold text-slate-900 text-xs leading-snug">${f.title}</div>
                        <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span class="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                                PDF 정본
                            </span>
                            <span class="text-[10px] text-slate-400">발간: 2026.01</span>
                            <span class="text-[10px] text-slate-400 font-num font-medium">${f.totalPages || 250}쪽 · ${f.sizeStr}</span>
                        </div>
                    </td>

                    <!-- 3열: 핵심 관련 법령 & 대상 시설 -->
                    <td class="p-3 align-middle border-r border-slate-200 leading-relaxed text-slate-600">
                        <div class="text-[11px] font-sans">${f.legalTarget || '사회복지사업법 및 관계 법령'}</div>
                    </td>

                    <!-- 4열: 주요 수록 챕터 및 핵심 지침 요약 -->
                    <td class="p-3 align-middle border-r border-slate-200 leading-relaxed text-slate-600">
                        <div class="flex flex-wrap gap-1 mb-1">
                            ${tags.map(t => `<span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">${t}</span>`).join('')}
                        </div>
                        <div class="text-[11px] text-slate-400">지자체 표준 위탁기준 및 평가지표 조항 반영</div>
                    </td>

                    <!-- 5열: 연계 위계 & 원문 열람 -->
                    <td class="p-3 text-center align-middle">
                        <button 
                            type="button" 
                            onclick="window.jumpToHierarchy('${hl.targetId}')" 
                            class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                            <span>${hl.label}</span>
                        </button>
                        <div class="mt-2">
                            <a 
                                href="${relPath}" 
                                target="_blank" 
                                class="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-bold hover:bg-blue-100 border border-blue-200/60 transition cursor-pointer"
                            >
                                즉시열람 📥
                            </a>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderMobileArchiveCards(files) {
        return files.map(f => {
            const cardId = `mobile-guideline-${f.id}`;
            const tags = f.keyChapters || ["법정지침"];
            const hl = f.hierarchyLink || { targetId: "comm-case-intake", label: "3단계 위계도감 이동 →" };
            const ministryClean = (f.ministry || '관계부처').split('(')[0].trim();
            const relPath = f.relPath || `Efficiency_DB/${f.filename}`;

            return `
                <div id="${cardId}" class="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3 transition">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold text-[10px]">${ministryClean}</span>
                                <span class="text-xs font-bold text-slate-600">${f.department || ''}</span>
                            </div>
                            <h4 class="text-xs font-extrabold text-slate-900 tracking-tight leading-snug">${f.title}</h4>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold flex-shrink-0">PDF</span>
                    </div>

                    <div class="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1">
                        <div><strong class="text-slate-700">근거법령:</strong> ${f.legalTarget || ''}</div>
                        <div class="flex flex-wrap gap-1 pt-1">
                            ${tags.map(t => `<span class="px-1.5 py-0.2 rounded bg-white text-slate-600 text-[10px] border border-slate-200/70 font-medium">${t}</span>`).join('')}
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] pt-1">
                        <button 
                            type="button" 
                            onclick="window.jumpToHierarchy('${hl.targetId}')" 
                            class="text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                            ${hl.label}
                        </button>
                        <a 
                            href="${relPath}" 
                            target="_blank" 
                            class="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] shadow-2xs hover:bg-blue-700 transition"
                        >
                            원문 열람 📥
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    function bindEvents() {
        const input = document.getElementById('archive-search-input');
        if (input) {
            input.addEventListener('input', (e) => {
                archiveSearchQuery = e.target.value;
                const db = getArchiveDB();
                const allFiles = [];
                db.forEach(cat => (cat.sources || []).forEach(src => (src.files || []).forEach(f => allFiles.push(f))));
                const area = document.getElementById('archive-content-area');
                if (area) area.innerHTML = renderArchiveSections(allFiles);
            });
        }
    }

    window.setArchiveMinistry = function (ministryKey) {
        selectedMinistryFilter = ministryKey;
        const container = document.getElementById('view-archive');
        if (container) renderLayout(container);
    };

    window.clearArchiveSearch = function () {
        archiveSearchQuery = "";
        selectedMinistryFilter = "all";
        const container = document.getElementById('view-archive');
        if (container) renderLayout(container);
    };

    // 3단계 위계도감으로 점프 (Deep-linking)
    window.jumpToHierarchy = function (targetNodeId) {
        if (typeof window.showView === 'function') {
            window.showView('hierarchy', { targetNodeId: targetNodeId });
        }
    };

    // 특정 지침서 하이라이트 및 스크롤
    function highlightAndScrollGuideline(guidelineId) {
        const tr = document.getElementById(`guideline-row-${guidelineId}`);
        if (tr && !tr.classList.contains('hidden')) {
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            tr.classList.add('bg-amber-100', 'transition-colors', 'duration-500');
            setTimeout(() => {
                tr.classList.remove('bg-amber-100');
            }, 2500);
            return;
        }

        const card = document.getElementById(`mobile-guideline-${guidelineId}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('ring-4', 'ring-blue-400');
            setTimeout(() => {
                card.classList.remove('ring-4', 'ring-blue-400');
            }, 2500);
        }
    }

})();
'''

with open('src/js/archive.js', 'w', encoding='utf-8') as f:
    f.write(archive_js_code)

print("✓ Successfully created Stitch-aligned src/js/archive.js")
