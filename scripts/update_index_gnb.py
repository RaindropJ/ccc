# -*- coding: utf-8 -*-
"""
Phase 2: Update index.html with the Stitch 2-Tier GNB Header.
"""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Stitch 2-Tier Header HTML
stitch_header = '''    <!-- ==================== GNB: 공통 2단 상단 헤더 & 서브 탭 ==================== -->
    <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs font-sans">
        <!-- 1단: 메인 브랜딩 & 전역 액션 바 -->
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <!-- 좌측: 로고 + 타이틀 + 실시간 동기화 뱃지 -->
            <div class="flex items-center gap-3 sm:gap-4">
                <a href="#" onclick="showView('fields'); return false;" class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm hover:bg-blue-700 transition flex-shrink-0 cursor-pointer" title="현장 나침반 홈 (12대 분야·법령)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    </svg>
                </a>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight cursor-pointer" onclick="showView('fields')">사회복지 현장 나침반</span>
                        <span class="hidden md:inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">v2.4 국가법정기준</span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium hidden sm:block">공식 실무 통합 포털 · 보건복지부 및 6개 중앙부처 공공데이터 연계</div>
                </div>
                <!-- 실시간 동기화 인디케이터 -->
                <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/80 ml-2" title="매일 06:00 전수 수집 및 자동 갱신">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>동기화 06:00</span>
                </div>
            </div>

            <!-- 우측: 드롭다운 퀵 메뉴 + 내 준비함 + 모바일 햄버거 -->
            <div class="flex items-center gap-2">
                <!-- 분야·법령 가이드 드롭다운 퀵 메뉴 -->
                <div class="relative group" id="nav-dropdown-quick">
                    <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                        <span>분야·법령 가이드</span>
                        <svg class="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="absolute right-0 top-full pt-1.5 w-60 hidden group-hover:block z-50">
                        <div class="bg-white rounded-xl shadow-xl border border-slate-200 py-1 overflow-hidden text-xs">
                            <a href="#" onclick="showView('fields'); return false;" class="flex items-center gap-2 px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer">
                                <span>🏛️ 12대 분야·시설 도감</span>
                            </a>
                            <a href="#" onclick="showView('archive'); return false;" class="flex items-center justify-between px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold border-t border-slate-100 cursor-pointer">
                                <span>📁 공식 지침서 아카이브</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold font-num text-[10px]">53</span>
                            </a>
                            <a href="#" onclick="showView('hierarchy'); return false;" class="flex items-center justify-between px-3.5 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold border-t border-slate-100 cursor-pointer">
                                <span>🌳 3단계 위계 도감</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold font-num text-[10px]">90</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 내 준비함 퀵 버튼 -->
                <button type="button" onclick="if(typeof toggleWorkspaceDrawer === 'function') toggleWorkspaceDrawer();" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer">
                    <svg class="text-blue-600 fill-blue-600 w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>내 준비함</span>
                    <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center font-num" id="nav-bookmark-count">6</span>
                </button>

                <!-- 모바일 햄버거 토글 -->
                <button type="button" onclick="const m=document.getElementById('mobile-subnav-menu'); if(m) m.classList.toggle('hidden');" class="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-lg cursor-pointer" title="메뉴 열기">
                    ☰
                </button>
            </div>
        </div>

        <!-- 2단: 서브 네비게이션 가로 탭 바 (글자 세로 꺾임 방지 whitespace-nowrap) -->
        <div class="border-t border-slate-100 bg-slate-50/70">
            <div class="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1" id="sub-nav-tabs">
                <a href="#" onclick="showView('fields'); return false;" data-view="fields" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-white border border-slate-200/90 whitespace-nowrap shadow-2xs cursor-pointer transition">12대 분야·시설 도감</a>
                
                <a href="#" onclick="showView('archive'); return false;" data-view="archive" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
                    <span>공식 지침서 아카이브</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-num">53</span>
                </a>

                <a href="#" onclick="showView('hierarchy'); return false;" data-view="hierarchy" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
                    <span>3단계 위계 도감</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-num">90</span>
                </a>

                <a href="#" onclick="showView('practicum'); return false;" data-view="practicum" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap cursor-pointer transition">
                    <span>실습처</span><span class="text-[10px] text-slate-400 font-num">(320)</span>
                </a>
                <a href="#" onclick="showView('residency'); return false;" data-view="residency" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap cursor-pointer transition">
                    <span>수련처</span><span class="text-[10px] text-slate-400 font-num">(284)</span>
                </a>
                <a href="#" onclick="showView('internship'); return false;" data-view="internship" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap cursor-pointer transition">
                    <span>청년인턴</span><span class="text-[10px] text-slate-400 font-num">(39)</span>
                </a>
                <a href="#" onclick="showView('jobs'); return false;" data-view="jobs" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap cursor-pointer transition">
                    <span>채용</span><span class="text-[10px] text-slate-400 font-num">(3,746)</span>
                </a>
                <a href="#" onclick="showView('useful-sites'); return false;" data-view="useful-sites" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap cursor-pointer transition">
                    <span>유용한 사이트</span><span class="text-[10px] text-slate-400 font-num">(35)</span>
                </a>
                <a href="#" onclick="showView('news'); return false;" data-view="news" class="subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 whitespace-nowrap cursor-pointer transition">
                    <span>복지 뉴스</span><span class="text-[10px] text-slate-400 font-num">(21)</span>
                </a>
            </div>
        </div>

        <!-- 모바일 드롭다운 메뉴 -->
        <div id="mobile-subnav-menu" class="hidden md:hidden bg-white border-t border-slate-200 p-3 space-y-1.5 text-xs font-semibold shadow-lg">
            <button type="button" onclick="showView('fields'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between">
                <span>🏛️ 12대 분야·시설 도감</span>
            </button>
            <button type="button" onclick="showView('archive'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-blue-50 text-blue-700 flex items-center justify-between">
                <span>📁 공식 지침서 아카이브</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold font-num">53건</span>
            </button>
            <button type="button" onclick="showView('hierarchy'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center justify-between">
                <span>🌳 3단계 위계 도감</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-num">90건</span>
            </button>
            <button type="button" onclick="showView('practicum'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-700">실습처 탐색 (320건)</button>
            <button type="button" onclick="showView('residency'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-700">수련처 탐색 (284곳)</button>
            <button type="button" onclick="showView('jobs'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-700">채용공고 (3,746건)</button>
        </div>
    </header>'''

# Replace header block in index.html
new_html = re.sub(r'<header.*?</header>', stitch_header, html, count=1, flags=re.DOTALL)

# Also update the inline showView fallback script in index.html to update subnav active tab classes
update_subnav_script = '''
                // 서브 네비게이션 탭 액티브 상태 동적 갱신
                document.querySelectorAll('.subnav-tab').forEach(tab => {
                    const tv = tab.getAttribute('data-view');
                    if (tv === viewId) {
                        if (tv === 'hierarchy') {
                            tab.className = 'subnav-tab px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 flex items-center gap-1.5 whitespace-nowrap shadow-2xs cursor-pointer';
                        } else if (tv === 'archive') {
                            tab.className = 'subnav-tab px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50/90 border border-blue-200/80 flex items-center gap-1.5 whitespace-nowrap shadow-2xs cursor-pointer';
                        } else {
                            tab.className = 'subnav-tab px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-white border border-slate-200/90 flex items-center gap-1.5 whitespace-nowrap shadow-2xs cursor-pointer';
                        }
                    } else {
                        tab.className = 'subnav-tab px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer';
                    }
                });
'''

# Check if we can inject update_subnav_script into window.showView fallback
if 'window.showView = function(viewId, options = {}) {' in new_html:
    new_html = new_html.replace(
        "window.scrollTo({ top: 0, behavior: 'smooth' });",
        f"{update_subnav_script}\n                window.scrollTo({{ top: 0, behavior: 'smooth' }});"
    )

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("✓ Successfully updated index.html with Stitch 2-Tier GNB Header")
