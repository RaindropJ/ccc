# -*- coding: utf-8 -*-
"""
Phase 3: Generate the Stitch-aligned src/js/hierarchy.js with:
- Rowspan calculation engine for desktop matrix tables
- Section I (MOHW 7 domains) & Section II (Inter-ministerial 5 domains)
- Responsive mobile touch accordion cards (block md:hidden)
- Live search, 12-domain filter chips, stats header
- Smooth deep-linking to Archive (jumpToArchive) and from Archive (highlight node)
"""

hierarchy_js_code = r'''/**
 * 사회복지 3단계 위계 도감 (숲에서 나무로) - Google Stitch 디자인 규격 컨트롤러
 * - [1단계: 실천분야/법적근거] -> [2단계: 대분류(기능)] -> [3단계: 중분류(사업분야)] -> [소분류(단위서비스/세부내용)]
 * - 데스크톱(hidden md:block): 공문서 행정 표준 Rowspan 매트릭스 테이블
 * - 모바일(block md:hidden): 터치 친화적 원터치 아코디언 카드 뷰
 * - 섹션 Ⅰ: 보건복지부 소관 7개 실천분야 / 섹션 Ⅱ: 범부처 및 공공기관 5개 실천분야
 * - 공식 지침서 아카이브와 1:1 양방향 점프(Deep-linking) 지원
 */

(function () {
    // 상태 관리
    let currentDomainId = 'all';
    let searchQuery = '';
    let openMobileCards = new Set(); // 펼쳐진 모바일 카드 ID 목록

    const SECTION_1_DOMAINS = [
        '01_사회복지관', '02_노인복지', '03_장애인복지', 
        '04_아동돌봄복지', '05_영유아보육', '08_정신건강자살예방', '11_지역보호긴급돌봄'
    ];
    const SECTION_2_DOMAINS = [
        '06_가족복지', '07_청소년여성권익', '09_자활고용지원', 
        '10_학교사회복지', '12_배분모금국제'
    ];

    function getDB() {
        return {
            domains: (typeof window !== 'undefined' && window.WELFARE_HIERARCHY_DOMAINS) ? window.WELFARE_HIERARCHY_DOMAINS : [],
            nodes: (typeof window !== 'undefined' && window.WELFARE_HIERARCHY_NODES) ? window.WELFARE_HIERARCHY_NODES : []
        };
    }

    // 뷰 렌더링 진입점
    window.renderHierarchyView = function (options = {}) {
        const container = document.getElementById('view-hierarchy');
        if (!container) return;

        if (options.domainId) {
            currentDomainId = options.domainId;
        }

        renderLayout(container);

        // 특정 노드로 스크롤 및 하이라이트 요청 시
        if (options.targetNodeId) {
            setTimeout(() => {
                highlightAndScrollNode(options.targetNodeId);
            }, 100);
        }
    };

    function renderLayout(container) {
        const { domains, nodes } = getDB();
        const stats = (typeof window.getHierarchyStats === 'function') 
            ? window.getHierarchyStats() 
            : { totalDomains: domains.length, totalNodes: nodes.length, uniqueFacilitiesCount: 25, uniqueGuidelinesCount: 38 };

        container.innerHTML = `
            <div class="space-y-6 animate-fadeIn pb-16">
                <!-- 1. 헤어로 배너 & 통계 바 -->
                <div class="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800/40 relative overflow-hidden">
                    <div class="relative z-10 max-w-4xl">
                        <div class="flex flex-wrap items-center gap-2 mb-3">
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                                🌳 국가법정기준 3단계 계층 구조
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                                100% 공식 지침서 원문 매칭
                            </span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            대한민국 사회복지 3단계 위계 도감
                        </h2>
                        <p class="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                            숲(1단계: 실천분야 및 법적근거)에서 나무(3단계: 단위서비스 및 세부내용)로 내려가는 공문서 표준 매트릭스 도감입니다. 
                            모든 세부 서비스는 보건복지부 및 6개 중앙부처 38종 공식 실천 지침서 정본과 1:1로 직결됩니다.
                        </p>
                        
                        <!-- 4대 요약 지표 카드 -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
                            <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                                <div class="text-[11px] text-slate-400 font-medium">법정단위서비스</div>
                                <div class="text-xl sm:text-2xl font-black text-emerald-400 font-num">${stats.totalNodes}<span class="text-xs font-normal text-slate-300 ml-1">개</span></div>
                            </div>
                            <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                                <div class="text-[11px] text-slate-400 font-medium">표준 실천 분야</div>
                                <div class="text-xl sm:text-2xl font-black text-white font-num">${stats.totalDomains}<span class="text-xs font-normal text-slate-300 ml-1">대 분야</span></div>
                            </div>
                            <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                                <div class="text-[11px] text-slate-400 font-medium">핵심 시설 도감</div>
                                <div class="text-xl sm:text-2xl font-black text-blue-400 font-num">${stats.uniqueFacilitiesCount}<span class="text-xs font-normal text-slate-300 ml-1">개 종</span></div>
                            </div>
                            <div class="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                                <div class="text-[11px] text-slate-400 font-medium">연계 공식 지침서</div>
                                <div class="text-xl sm:text-2xl font-black text-purple-400 font-num">${stats.uniqueGuidelinesCount}<span class="text-xs font-normal text-slate-300 ml-1">종 전수</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. 검색 및 필터 컨트롤 바 -->
                <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <!-- 검색창 -->
                        <div class="relative flex-1">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input 
                                type="text" 
                                id="hierarchy-search-input" 
                                value="${searchQuery}" 
                                placeholder="사업명, 세부 실천내용, 지침서 키워드 검색 (예: 사례관리, 긴급복지, 일자리, 드림스타트...)" 
                                class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                            ${searchQuery ? `
                                <button type="button" onclick="window.clearHierarchySearch()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    ✕
                                </button>
                            ` : ''}
                        </div>

                        <!-- 퀵 액션 버튼 -->
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <button type="button" onclick="window.expandAllMobileCards()" class="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 md:hidden">
                                <span>모두 펼치기</span>
                            </button>
                            <button type="button" onclick="window.print()" class="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition hidden sm:flex items-center gap-1.5">
                                <span>🖨️ 인쇄</span>
                            </button>
                            <button type="button" onclick="window.exportHierarchyCSV()" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                                <span>📥 CSV 내보내기</span>
                            </button>
                        </div>
                    </div>

                    <!-- 12대 분야 필터 칩 -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                        <button 
                            type="button" 
                            onclick="window.setHierarchyDomain('all')" 
                            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${currentDomainId === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                        >
                            전체보기 (${nodes.length})
                        </button>
                        ${domains.map(d => {
                            const count = nodes.filter(n => n.domainId === d.id).length;
                            const isActive = currentDomainId === d.id;
                            return `
                                <button 
                                    type="button" 
                                    onclick="window.setHierarchyDomain('${d.id}')" 
                                    class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${isActive ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'}"
                                >
                                    <span>${d.icon}</span>
                                    <span>${d.name.split('·')[0].trim()}</span>
                                    <span class="text-[10px] opacity-80 font-num">(${count})</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- 3. 위계 도감 메인 컨텐츠 (섹션 Ⅰ / Ⅱ 분할 매트릭스) -->
                <div id="hierarchy-content-area" class="space-y-8">
                    ${renderSections()}
                </div>
            </div>
        `;

        bindEvents();
    }

    function renderSections() {
        const { domains, nodes } = getDB();

        // 1. 필터링된 노드 산출
        let filteredNodes = nodes;
        if (currentDomainId !== 'all') {
            filteredNodes = filteredNodes.filter(n => n.domainId === currentDomainId);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filteredNodes = filteredNodes.filter(n => 
                n.level1.toLowerCase().includes(q) ||
                n.level2.toLowerCase().includes(q) ||
                n.level3.toLowerCase().includes(q) ||
                (n.summary && n.summary.toLowerCase().includes(q)) ||
                (n.guidelineRef && (n.guidelineRef.file.toLowerCase().includes(q) || n.guidelineRef.chapter.toLowerCase().includes(q)))
            );
        }

        if (filteredNodes.length === 0) {
            return `
                <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <span class="text-4xl">🔍</span>
                    <p class="text-base font-bold text-slate-800 mt-3">검색 조건에 일치하는 위계 항목이 없습니다.</p>
                    <p class="text-xs text-slate-400 mt-1">검색어를 변경하거나 필터를 초기화해 보세요.</p>
                    <button type="button" onclick="window.clearHierarchySearch()" class="mt-4 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        전체 위계 도감 보기
                    </button>
                </div>
            `;
        }

        // 섹션 분할
        const sec1Nodes = filteredNodes.filter(n => SECTION_1_DOMAINS.includes(n.domainId));
        const sec2Nodes = filteredNodes.filter(n => SECTION_2_DOMAINS.includes(n.domainId));

        let html = '';

        // 섹션 Ⅰ 렌더링
        if (sec1Nodes.length > 0) {
            html += renderSectionBlock({
                numeral: 'Ⅰ',
                title: '중앙 정부부처 핵심 법정단위 서비스 (보건복지부 소관 7개 실천분야)',
                subtitle: '종합사회복지관 3대기능 · 노인 · 장애인 · 아동 · 영유아 · 정신건강 · 긴급복지',
                nodes: sec1Nodes,
                domains: domains
            });
        }

        // 섹션 Ⅱ 렌더링
        if (sec2Nodes.length > 0) {
            html += renderSectionBlock({
                numeral: 'Ⅱ',
                title: '범부처 및 공공기관 실천분야 (여가부·고용노동부·교육부·모금회 등 5개 실천분야)',
                subtitle: '가족복지(가족센터) · 청소년여성권익(쉼터/1366) · 자활고용(국민취업) · 학교사회복지 · 배분모금(공동모금회/KOICA)',
                nodes: sec2Nodes,
                domains: domains
            });
        }

        return html;
    }

    function renderSectionBlock({ numeral, title, subtitle, nodes, domains }) {
        return `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
                <!-- 섹션 헤더 배너 -->
                <div class="px-5 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-blue-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 font-num">${numeral}</span>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-extrabold tracking-tight">${title}</h3>
                                <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold font-num">${nodes.length}개 세부서비스</span>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-0.5">${subtitle}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onclick="window.print()" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer">인쇄</button>
                        <button type="button" onclick="window.exportHierarchyCSV()" class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer">CSV 내보내기</button>
                    </div>
                </div>

                <!-- 1. 데스크톱: 계층형 매트릭스 테이블 (Rowspan 구조) -->
                <div class="overflow-x-auto hidden md:block">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold text-center">
                                <th class="py-3 px-3 w-[18%] border-r border-slate-200">1단계: 실천분야 및 법적근거</th>
                                <th class="py-3 px-3 w-[15%] border-r border-slate-200">2단계: 대분류 (기능)</th>
                                <th class="py-3 px-3 w-[16%] border-r border-slate-200">3단계: 중분류 (사업분야)</th>
                                <th class="py-3 px-4 w-[36%] border-r border-slate-200">소분류 (사업 및 세부내용)</th>
                                <th class="py-3 px-3 w-[15%]">공식지침서 / 법령서식</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700">
                            ${renderDesktopTableRows(nodes, domains)}
                        </tbody>
                    </table>
                </div>

                <!-- 2. 모바일: 반응형 터치 아코디언 카드 (md:hidden) -->
                <div class="block md:hidden space-y-3 p-3 bg-slate-50/50">
                    ${renderMobileCards(nodes, domains)}
                </div>
            </div>
        `;
    }

    /**
     * Rowspan 셀 병합 계산 엔진
     * 1열: 실천분야별 전체 노드 수(domainRowspan) 만큼 병합
     * 2열: 2단계 대분류(Level1)별 노드 수(level1Rowspan) 만큼 병합
     */
    function renderDesktopTableRows(nodes, domains) {
        // 분야별 그룹핑
        const domainGroups = {};
        nodes.forEach(node => {
            if (!domainGroups[node.domainId]) domainGroups[node.domainId] = [];
            domainGroups[node.domainId].push(node);
        });

        let rowsHtml = '';

        Object.keys(domainGroups).forEach(domainId => {
            const domainNodes = domainGroups[domainId];
            const domainInfo = domains.find(d => d.id === domainId) || { name: domainId, icon: '🏢', description: '' };
            const domainRowspan = domainNodes.length;

            // 대분류(level1)별 그룹핑
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
                    const trId = `hierarchy-node-${node.id}`;
                    rowsHtml += `<tr id="${trId}" class="hover:bg-blue-50/40 transition">`;

                    // 1열: 실천분야 및 법적근거 (도메인의 첫 번째 행에서만 rowspan 출력)
                    if (isFirstRowOfDomain) {
                        const legalBasisText = getLegalBasis(domainId);
                        rowsHtml += `
                            <td rowspan="${domainRowspan}" class="p-3 align-top border-r border-slate-200 bg-slate-50/50">
                                <div class="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                    <span class="text-base">${domainInfo.icon}</span>
                                    <span>${domainInfo.name.split('·')[0].trim()}</span>
                                </div>
                                <span class="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold mt-1">
                                    공공 핵심기능 (${domainRowspan})
                                </span>
                                <div class="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                                    ${legalBasisText}
                                </div>
                            </td>
                        `;
                        isFirstRowOfDomain = false;
                    }

                    // 2열: 2단계 대분류 (기능) (해당 기능의 첫 번째 행에서만 rowspan 출력)
                    if (isFirstRowOfL1) {
                        rowsHtml += `
                            <td rowspan="${level1Rowspan}" class="p-3 align-top border-r border-slate-200 font-bold text-slate-800 bg-blue-50/15">
                                • ${node.level1}<br>
                                <span class="text-[11px] font-normal text-slate-400 leading-tight block mt-0.5">${node.facilityType || '법정 복지시설'}</span>
                            </td>
                        `;
                        isFirstRowOfL1 = false;
                    }

                    // 3열: 3단계 중분류 (사업분야)
                    rowsHtml += `
                        <td class="p-3 align-top border-r border-slate-200 font-medium text-slate-800">
                            ${node.level2}
                        </td>
                    `;

                    // 4열: 소분류 (사업 및 세부내용)
                    const bullets = (node.details && node.details.length > 0) 
                        ? node.details 
                        : [node.summary || '세부 사업 계획 수립 및 서비스 실천'];
                    rowsHtml += `
                        <td class="p-3 align-top border-r border-slate-200 leading-relaxed text-slate-600">
                            <div class="font-bold text-slate-900 mb-1 flex items-center gap-1">
                                <span>${node.level3}</span>
                            </div>
                            <div class="space-y-0.5 text-[11px]">
                                ${bullets.map(b => `• ${b}`).join('<br>')}
                            </div>
                        </td>
                    `;

                    // 5열: 공식지침서 / 법령서식
                    const manualShort = node.guidelineRef ? truncateTitle(node.guidelineRef.file, 20) : '공식 업무안내';
                    const pageText = node.guidelineRef ? node.guidelineRef.page : '';
                    const arcId = (node.guidelineRef && node.guidelineRef.archiveId) ? node.guidelineRef.archiveId : 'doc-004';

                    rowsHtml += `
                        <td class="p-3 align-top text-center">
                            <div class="text-[11px] font-semibold text-slate-800" title="${node.guidelineRef ? node.guidelineRef.file : ''}">${manualShort}</div>
                            <div class="text-[10px] text-blue-600 font-medium mt-0.5">${node.guidelineRef ? truncateTitle(node.guidelineRef.chapter, 24) : ''}</div>
                            <div class="text-[10px] text-slate-400 font-num">${pageText}</div>
                            <button 
                                type="button" 
                                onclick="window.jumpToArchive('${arcId}')" 
                                class="mt-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-[11px] font-bold border border-slate-200/80 transition cursor-pointer flex items-center gap-1 mx-auto"
                            >
                                <span>지침서 열람</span>
                                <span>→</span>
                            </button>
                        </td>
                    `;

                    rowsHtml += `</tr>`;
                });
            });
        });

        return rowsHtml;
    }

    /**
     * 모바일용 터치 아코디언 카드 렌더러
     */
    function renderMobileCards(nodes, domains) {
        return nodes.map(node => {
            const isOpen = openMobileCards.has(node.id);
            const domainInfo = domains.find(d => d.id === node.domainId) || { name: node.domainId, icon: '🏢' };
            const ministryName = SECTION_1_DOMAINS.includes(node.domainId) ? '보건복지부' : '관계부처';
            const arcId = (node.guidelineRef && node.guidelineRef.archiveId) ? node.guidelineRef.archiveId : 'doc-004';
            const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];

            return `
                <div id="mobile-card-${node.id}" class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition">
                    <!-- 카드 헤더 (원터치 토글) -->
                    <button 
                        type="button" 
                        onclick="window.toggleMobileCard('${node.id}')" 
                        class="w-full p-4 text-left flex items-start justify-between gap-3 tap-bounce cursor-pointer"
                    >
                        <div>
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold text-[10px]">${ministryName}</span>
                                <span class="text-xs font-bold text-slate-900">${domainInfo.icon} ${domainInfo.name.split('·')[0].trim()}</span>
                            </div>
                            <div class="text-xs font-black text-slate-900 tracking-tight">${node.level3}</div>
                            <div class="text-[11px] text-slate-400 mt-0.5">${node.level1} ➔ ${node.level2}</div>
                        </div>
                        <svg 
                            id="mobile-card-icon-${node.id}" 
                            class="w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 mt-1 ${isOpen ? 'rotate-180' : ''}" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>

                    <!-- 아코디언 세부 내용 -->
                    <div id="mobile-card-body-${node.id}" class="${isOpen ? '' : 'hidden'} px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                        <div class="bg-slate-50 p-2.5 rounded-xl leading-relaxed text-[11px] space-y-0.5">
                            ${bullets.map(b => `<div>• ${b}</div>`).join('')}
                        </div>
                        <div class="flex items-center justify-between text-[11px] pt-1">
                            <span class="font-medium text-slate-500 font-num">지침 ${node.guidelineRef ? node.guidelineRef.page : ''}</span>
                            <button 
                                type="button" 
                                onclick="window.jumpToArchive('${arcId}')" 
                                class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition cursor-pointer"
                            >
                                원문 지침서 이동 →
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function getLegalBasis(domainId) {
        const legalMap = {
            '01_사회복지관': '「사회복지사업법」 제34조의5<br>동법 시행규칙 제21조의2<br>사회복지관 위탁관리제도',
            '02_노인복지': '「노인복지법」 제27조의2·제36조<br>노인맞춤돌봄 및 여가복지시설<br>노인학대 예방 및 보호체계',
            '03_장애인복지': '「장애인복지법」 제58조·제59조의9<br>「발달장애인 권리보장법」 제33조<br>장애인활동지원법 제20조',
            '04_아동돌봄복지': '「아동복지법」 제37조·제52조<br>드림스타트 통합사례관리<br>지역아동센터 및 다함께돌봄',
            '05_영유아보육': '「영유아보육법」 제10조·제24조<br>어린이집 설치·운영기준<br>유보통합 표준보육과정',
            '06_가족복지': '「건강가정기본법」 제35조<br>「다문화가족지원법」 제12조<br>한부모가족지원법 제12조',
            '07_청소년여성권익': '「청소년기본법」 제18조<br>「청소년복지지원법」 제16조<br>가정폭력방지법 제5조',
            '08_정신건강자살예방': '「정신건강복지법」 제15조<br>「자살예방법」 제13조<br>24시간 위기대응 및 재활훈련',
            '09_자활고용지원': '「국민기초생활 보장법」 제16조<br>구직자 취업촉진법 제6조<br>자활근로 및 국민취업지원',
            '10_학교사회복지': '「초·중등교육법」 제54조<br>교육복지우선지원사업 운영규정<br>학교사회복지사 협력체계',
            '11_지역보호긴급돌봄': '「긴급복지지원법」 제8조<br>「사회서비스원법」 제10조<br>의료급여법 제3조·푸드뱅크',
            '12_배분모금국제': '「사회복지공동모금회법」 제20조<br>「한국국제협력단법」 제7조<br>민간배분 및 글로벌 ODA'
        };
        return legalMap[domainId] || '사회복지사업법 및 관계 법령';
    }

    function truncateTitle(str, maxLen = 22) {
        if (!str) return '';
        // 파일명에서 확장자 제거
        const clean = str.replace(/\.(pdf|hwp|hwpx|xlsx)$/i, '').replace(/^[0-9]+_/, '');
        if (clean.length <= maxLen) return clean;
        return clean.substring(0, maxLen) + '…';
    }

    function bindEvents() {
        const searchInput = document.getElementById('hierarchy-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                const contentArea = document.getElementById('hierarchy-content-area');
                if (contentArea) contentArea.innerHTML = renderSections();
            });
        }
    }

    // 글로벌 인터랙션 헬퍼
    window.setHierarchyDomain = function (domainId) {
        currentDomainId = domainId;
        const container = document.getElementById('view-hierarchy');
        if (container) renderLayout(container);
    };

    window.clearHierarchySearch = function () {
        searchQuery = '';
        currentDomainId = 'all';
        const container = document.getElementById('view-hierarchy');
        if (container) renderLayout(container);
    };

    window.toggleMobileCard = function (nodeId) {
        if (openMobileCards.has(nodeId)) {
            openMobileCards.delete(nodeId);
        } else {
            openMobileCards.add(nodeId);
        }
        const body = document.getElementById(`mobile-card-body-${nodeId}`);
        const icon = document.getElementById(`mobile-card-icon-${nodeId}`);
        if (body) body.classList.toggle('hidden', !openMobileCards.has(nodeId));
        if (icon) icon.classList.toggle('rotate-180', openMobileCards.has(nodeId));
    };

    window.expandAllMobileCards = function () {
        const { nodes } = getDB();
        nodes.forEach(n => openMobileCards.add(n.id));
        const contentArea = document.getElementById('hierarchy-content-area');
        if (contentArea) contentArea.innerHTML = renderSections();
    };

    // 지침서 아카이브로 점프 (Deep-linking)
    window.jumpToArchive = function (archiveId) {
        if (typeof window.showView === 'function') {
            window.showView('archive', { highlightId: archiveId });
        }
    };

    // 특정 노드 하이라이트 및 스크롤
    function highlightAndScrollNode(nodeId) {
        // 데스크톱 행 확인
        const desktopTr = document.getElementById(`hierarchy-node-${nodeId}`);
        if (desktopTr && !desktopTr.classList.contains('hidden')) {
            desktopTr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            desktopTr.classList.add('bg-amber-100', 'transition-colors', 'duration-500');
            setTimeout(() => {
                desktopTr.classList.remove('bg-amber-100');
            }, 2500);
            return;
        }

        // 모바일 카드 확인
        const mobileCard = document.getElementById(`mobile-card-${nodeId}`);
        if (mobileCard) {
            openMobileCards.add(nodeId);
            const body = document.getElementById(`mobile-card-body-${nodeId}`);
            const icon = document.getElementById(`mobile-card-icon-${nodeId}`);
            if (body) body.classList.remove('hidden');
            if (icon) icon.classList.add('rotate-180');
            mobileCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            mobileCard.classList.add('ring-4', 'ring-emerald-400');
            setTimeout(() => {
                mobileCard.classList.remove('ring-4', 'ring-emerald-400');
            }, 2500);
        }
    }

    // CSV 내보내기 헬퍼
    window.exportHierarchyCSV = function () {
        const { nodes } = getDB();
        let csvContent = "\uFEFF1단계(실천분야),2단계(대분류기능),3단계(중분류사업),소분류(단위서비스),세부실천내용,공식지침서파일명,지침서페이지\n";
        nodes.forEach(n => {
            const bullets = (n.details || []).join(' / ');
            const row = [
                `"${n.domainId}"`,
                `"${n.level1}"`,
                `"${n.level2}"`,
                `"${n.level3}"`,
                `"${bullets.replace(/"/g, '""')}"`,
                `"${(n.guidelineRef && n.guidelineRef.file) || ''}"`,
                `"${(n.guidelineRef && n.guidelineRef.page) || ''}"`
            ];
            csvContent += row.join(',') + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `대한민국_사회복지_3단계_위계도감_90개서비스_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

})();
'''

with open('src/js/hierarchy.js', 'w', encoding='utf-8') as f:
    f.write(hierarchy_js_code)

print("✓ Successfully created Stitch-aligned src/js/hierarchy.js")
