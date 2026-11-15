# -*- coding: utf-8 -*-
"""
Google Stitch 디자인 연동 전용 독립형 단독 HTML 파일 생성기
1. stitch_welfare_hierarchy.html  : 3단계 위계 도감 단독 파일
2. stitch_guidelines_archive.html : 지침서 아카이브 단독 파일
3. stitch_portal_viewer.html      : 2대 기능을 통합 전환하여 디자인할 수 있는 쉘 파일
모든 데이터와 스타일을 100% 인라인 임베딩하여 CORS/서버 없이 어떤 브라우저나 구글 스티치에서도 즉시 렌더링.
"""

import os
import json

def load_text(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_exports():
    print("Building Google Stitch Standalone HTML files...")

    # Load DB contents
    hierarchy_js = load_text("src/data/welfare-hierarchy-db.js")
    archive_js = load_text("src/data/guidelines-archive-db.js")
    hierarchy_ctrl = load_text("src/js/hierarchy.js")
    archive_ctrl = load_text("src/js/archive.js")

    common_head = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{TITLE}</title>
    <!-- Tailwind CSS (Google Stitch 최적화 CDN) -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', '"Noto Sans KR"', 'sans-serif'],
                        num: ['"Plus Jakarta Sans"', 'sans-serif']
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
                            500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8'
                        }
                    }
                }
            }
        };
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', 'Noto Sans KR', sans-serif; }
        .font-num { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
        .tap-bounce { transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
        .tap-bounce:active { transform: scale(0.97); }
        /* 스크롤바 숨김 */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* 3대 영역 1:1 인터랙티브 매칭 초록 테두리 강조 애니메이션 */
        @keyframes matchIndicatorPulse {
            0% {
                outline: 3px solid #10b981;
                outline-offset: -2px;
                box-shadow: 0 0 14px rgba(16, 185, 129, 0.75), 0 0 28px rgba(16, 185, 129, 0.45);
                background-color: transparent !important;
            }
            45% {
                outline: 3.5px solid #059669;
                outline-offset: -2px;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.9), 0 0 38px rgba(16, 185, 129, 0.6);
                background-color: transparent !important;
            }
            100% {
                outline: 2px solid transparent;
                outline-offset: -2px;
                box-shadow: none;
                background-color: transparent !important;
            }
        }
        .interactive-match-highlight {
            animation: matchIndicatorPulse 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
            position: relative;
            z-index: 25;
            background-color: transparent !important;
        }
    </style>
    <script>
        window.triggerMatchHighlight = function(element) {
            if (!element) return;
            element.classList.remove('interactive-match-highlight');
            void element.offsetWidth;
            element.classList.add('interactive-match-highlight');
            setTimeout(() => {
                element.classList.remove('interactive-match-highlight');
            }, 2900);
        };
        window.triggerMatchHighlightAll = function(elements) {
            if (!elements || elements.length === 0) return;
            elements.forEach(el => window.triggerMatchHighlight(el));
        };
    </script>
</head>
<body class="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col font-sans">
"""

    # =========================================================================
    # 1. stitch_welfare_hierarchy.html
    # =========================================================================
    h_html = common_head.replace("{TITLE}", "Google Stitch - 사회복지 3단계 위계 도감 (숲에서 나무로)")
    h_html += """
    <!-- 상단 스티치 전용 헤더 바 -->
    <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-sm">🌳</span>
                <div>
                    <div class="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span>사회복지 3단계 위계 도감</span>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Google Stitch Design Mode</span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium">숲(법정 기능)에서 나무(단위 프로그램)로 탐색하는 지식 맵</div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">90개 단위서비스</span>
                <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">38종 지침서 매칭</span>
            </div>
        </div>
    </header>

    <!-- 메인 컨텐츠 영역 -->
    <main class="flex-grow py-8">
        <div id="view-hierarchy" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"></div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Google Stitch Prototyping Template · 12대 분야 3단계 위계 도감 · 2026/2027 정부 공식 지침서 원문 매칭
    </footer>

    <!-- 임베디드 데이터셋 & 컨트롤러 -->
    <script>
"""
    h_html += hierarchy_js + "\n\n"
    h_html += hierarchy_ctrl + "\n\n"
    h_html += """
        // 초기 구동
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof window.renderHierarchyView === 'function') {
                window.renderHierarchyView();
            }
        });
    </script>
</body>
</html>
"""
    with open("stitch_welfare_hierarchy.html", "w", encoding="utf-8") as f:
        f.write(h_html)
    print("✓ Created stitch_welfare_hierarchy.html")

    # =========================================================================
    # 2. stitch_guidelines_archive.html
    # =========================================================================
    a_html = common_head.replace("{TITLE}", "Google Stitch - 공식 지침서 마스터 아카이브 (53종 풀패키지)")
    a_html += """
    <!-- 상단 스티치 전용 헤더 바 -->
    <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-sm">📁</span>
                <div>
                    <div class="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span>공식 지침서 마스터 아카이브</span>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">Google Stitch Design Mode</span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium">8대 정부부처 및 공공기관 53개 정본 지침서 탐색기</div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">53개 정본 (450 MB)</span>
                <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">구글 드라이브 일괄 다운</span>
            </div>
        </div>
    </header>

    <!-- 메인 컨텐츠 영역 -->
    <main class="flex-grow py-8">
        <div id="view-archive" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"></div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Google Stitch Prototyping Template · 공식 지침서 마스터 아카이브 · 8대 부처 최신 정본 단일화
    </footer>

    <!-- 임베디드 데이터셋 & 컨트롤러 -->
    <script>
"""
    a_html += archive_js + "\n\n"
    a_html += archive_ctrl + "\n\n"
    a_html += """
        // 초기 구동
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof window.renderArchiveView === 'function') {
                window.renderArchiveView();
            }
        });
    </script>
</body>
</html>
"""
    with open("stitch_guidelines_archive.html", "w", encoding="utf-8") as f:
        f.write(a_html)
    print("✓ Created stitch_guidelines_archive.html")

    # =========================================================================
    # 3. stitch_portal_viewer.html (2대 기능 통합 스티치 뷰어)
    # =========================================================================
    c_html = common_head.replace("{TITLE}", "Google Stitch - 사회복지 위계도감 & 지침서 아카이브 통합 뷰어")
    c_html += """
    <!-- 상단 스티치 전용 헤더 바 & 기능 탭 전환기 -->
    <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white text-xl shadow-sm">✨</span>
                <div>
                    <div class="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span>사회복지 현장의 이해 · 구글 스티치 디자인 스튜디오</span>
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium">3단계 위계 도감 & 공식 지침서 아카이브 통합 디자인 템플릿</div>
                </div>
            </div>

            <!-- 스티치 기능 전환 탭 -->
            <div class="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
                <button 
                    type="button" 
                    id="tab-btn-hierarchy"
                    onclick="switchStitchTab('hierarchy')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 cursor-pointer bg-white text-emerald-700 shadow-xs border border-slate-200/60"
                >
                    <span>🌳 3단계 위계 도감</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-num">90</span>
                </button>
                <button 
                    type="button" 
                    id="tab-btn-archive"
                    onclick="switchStitchTab('archive')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
                >
                    <span>📁 지침서 아카이브</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-num">53</span>
                </button>
            </div>
        </div>
    </header>

    <!-- 메인 컨텐츠 영역 -->
    <main class="flex-grow py-8">
        <section id="view-hierarchy" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"></section>
        <section id="view-archive" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 hidden"></section>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Google Stitch Prototyping Template · 대한민국 사회복지 현장 나침반 포털
    </footer>

    <!-- 임베디드 데이터셋 & 컨트롤러 -->
    <script>
"""
    c_html += hierarchy_js + "\n\n"
    c_html += archive_js + "\n\n"
    c_html += hierarchy_ctrl + "\n\n"
    c_html += archive_ctrl + "\n\n"
    c_html += """
        // 탭 전환 라우팅 함수
        function switchStitchTab(tab) {
            const hSec = document.getElementById('view-hierarchy');
            const aSec = document.getElementById('view-archive');
            const hBtn = document.getElementById('tab-btn-hierarchy');
            const aBtn = document.getElementById('tab-btn-archive');

            if (tab === 'hierarchy') {
                hSec.classList.remove('hidden');
                aSec.classList.add('hidden');
                hBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 cursor-pointer bg-white text-emerald-700 shadow-xs border border-slate-200/60';
                aBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900';
                if (typeof window.renderHierarchyView === 'function') {
                    window.renderHierarchyView();
                }
            } else {
                aSec.classList.remove('hidden');
                hSec.classList.add('hidden');
                aBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 cursor-pointer bg-white text-blue-700 shadow-xs border border-slate-200/60';
                hBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900';
                if (typeof window.renderArchiveView === 'function') {
                    window.renderArchiveView();
                }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 글로벌 바로가기 연동 (위계도감 -> 아카이브 점프)
        window.goToArchiveSearch = function(filename) {
            switchStitchTab('archive');
            setTimeout(() => {
                const input = document.getElementById('archive-search-input');
                if (input && typeof window.handleArchiveSearch === 'function') {
                    input.value = filename;
                    window.handleArchiveSearch(filename);
                }
            }, 100);
        };

        // 초기 구동
        document.addEventListener('DOMContentLoaded', () => {
            switchStitchTab('hierarchy');
        });
    </script>
</body>
</html>
"""
    with open("stitch_portal_viewer.html", "w", encoding="utf-8") as f:
        f.write(c_html)
    print("✓ Created stitch_portal_viewer.html")

    print("\nAll 3 Stitch templates built successfully!")

if __name__ == "__main__":
    build_exports()
