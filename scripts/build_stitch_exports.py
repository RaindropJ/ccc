# -*- coding: utf-8 -*-
"""
Google Stitch 디자인 연동 전용 단일 통합 HTML 생성기 (모바일 UI 우선 + 반응형 토글 + Pre-baked DOM + Modern Web UX/ARIA)
- 출력 파일: stitch_portal_viewer.html (단일 통합 파일)
  1) 18대 분야·시설 및 사회안전망 도감 (중앙정부 법정분야 39 + 민간·사회적경제·종교 6 = 45개 체계)
  2) 3단계 위계 도감 & 바텀시트 인스펙터 (18대 분야 · 219개 단위서비스)
  3) 공식 지침서 마스터 아카이브 (70종 순수 PDF 정본 · 18,556면)

모든 데이터·컨트롤러·사전 렌더링(Pre-baked) DOM을 100% 인라인 임베딩하여
Google Stitch 업로드 시 정적 파싱 및 실시간 브라우저 인터랙션에서 모두 즉시 모바일 화면이 렌더링됩니다.
"""

import asyncio
import functools
import http.server
import json
import os
import re
import shutil
import socketserver
import subprocess
import tempfile
import threading
import urllib.request

WORKSPACE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

OUTPUT_FILE = "stitch_portal_viewer.html"
OBSOLETE_FILES = [
    "stitch_fields_encyclopedia.html",
    "stitch_welfare_hierarchy.html",
    "stitch_guidelines_archive.html",
]


def load_text(rel_path):
    with open(os.path.join(WORKSPACE, rel_path), "r", encoding="utf-8") as f:
        return f.read()


def save_text(rel_path, content):
    with open(os.path.join(WORKSPACE, rel_path), "w", encoding="utf-8") as f:
        f.write(content)


def cleanup_obsolete_files():
    removed = []
    for fname in OBSOLETE_FILES:
        fpath = os.path.join(WORKSPACE, fname)
        if os.path.exists(fpath):
            os.remove(fpath)
            removed.append(fname)
    if removed:
        print(f"✓ Removed obsolete split Stitch files: {', '.join(removed)}")
    else:
        print("✓ No obsolete split Stitch files present.")


def extract_index_parts(idx_html):
    # 1. Tailwind config script block
    m_tw = re.search(r"(<script>\s*tailwind\.config\s*=\s*\{.*?</script>)", idx_html, re.S)
    assert m_tw, "tailwind.config block not found in index.html"
    tailwind_cfg = m_tw.group(1)

    # 2. Custom CSS <style>...</style> block right after tailwind.config
    m_style = re.search(r"(<style>\s*\.font-num\s*\{.*?</style>)", idx_html, re.S)
    assert m_style, "main custom <style> block not found in index.html"
    custom_style = m_style.group(1)

    # 3. <section id="view-fields" ...>...</section>
    m_vf = re.search(
        r'(<section id="view-fields"[^>]*>.*?</section>)\s*\n\s*<!-- ==================== VIEW: 공식 지침서 마스터 아카이브',
        idx_html,
        re.S,
    )
    assert m_vf, "<section id='view-fields'> not found in index.html"
    view_fields_html = m_vf.group(1)

    # 4. Embedded datasets: STATUTORY_MATRIX + resolveOrgLineage + FACILITY_ROW_ID_ALIASES + CIVIL_IMPACT_ECOSYSTEM
    m_data = re.search(
        r"(const STATUTORY_MATRIX = \[.*?window\.EXTENDED_STATUTORY_MATRIX = EXTENDED_STATUTORY_MATRIX;)",
        idx_html,
        re.S,
    )
    assert m_data, "STATUTORY_MATRIX..EXTENDED_STATUTORY_MATRIX block not found in index.html"
    view1_datasets_js = m_data.group(1)

    # 5. View 1 logic: // 4. View 1: ... up to right before // 5. View 2:
    m_v1 = re.search(
        r"(// 4\. View 1:.*?)(?=\s*// 5\. View 2:)",
        idx_html,
        re.S,
    )
    assert m_v1, "View 1 JS logic block not found in index.html"
    view1_logic_js = m_v1.group(1)

    return {
        "tailwind_cfg": tailwind_cfg,
        "custom_style": custom_style,
        "view_fields_html": view_fields_html,
        "view1_datasets_js": view1_datasets_js,
        "view1_logic_js": view1_logic_js,
    }


def build_common_head(title, parts):
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{title}</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    {parts["tailwind_cfg"]}
    {parts["custom_style"]}
    <style>
        body {{ font-family: 'Plus Jakarta Sans', 'Noto Sans KR', sans-serif; }}
        /* Google Stitch Mobile-First Preview Mode (defaults to active for immediate 390~430px mobile UI inspection) */
        body.stitch-mobile-mode {{
            background-color: #eef2f7 !important;
        }}
        body.stitch-mobile-mode main {{
            padding-top: 1rem !important;
            padding-bottom: 5rem !important;
        }}
        body.stitch-mobile-mode #mobile-fields-view,
        body.stitch-mobile-mode #mobileHierarchyView,
        body.stitch-mobile-mode #mobileArchiveView {{
            display: block !important;
            max-width: 430px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 1.5rem;
            padding: 0.75rem 0.625rem 2.25rem;
            box-shadow: 0 18px 42px -15px rgba(15, 23, 42, 0.14);
        }}
        body.stitch-mobile-mode #mobileHierarchyView {{
            padding-bottom: 10.5rem !important;
        }}
        body.stitch-mobile-mode #view-fields .hidden.md\\:block,
        body.stitch-mobile-mode #view-hierarchy .hidden.md\\:block,
        body.stitch-mobile-mode #view-archive .hidden.md\\:block,
        body.stitch-mobile-mode #view-archive .hidden.md\\:flex {{
            display: none !important;
        }}
        body.stitch-mobile-mode #mobile-hierarchy-inspector {{
            display: block !important;
            max-width: 430px !important;
        }}

        /* Baseline Widely Available: Rendering performance for large unified single-file DOM */
        #mobile-cards-feed > div,
        #mobile-civil-impact-grid > div,
        #mobile-hierarchy-cards-feed > .mobile-domain-card,
        #mobile-archive-cards-feed > div {{
            content-visibility: auto;
            contain-intrinsic-size: auto 180px;
        }}

        /* Baseline Widely Available: Modern touch, scroll containment, safe-area & focus accessibility */
        button, a, [role="tab"], [role="button"] {{
            touch-action: manipulation;
        }}
        :is(button, a, input, select, [tabindex]):focus-visible {{
            outline: 2px solid #2563eb;
            outline-offset: 2px;
        }}
        #inspector-content {{
            overscroll-behavior: contain;
        }}
        #mobile-hierarchy-inspector {{
            padding-bottom: env(safe-area-inset-bottom, 0px);
        }}
        @media (prefers-reduced-motion: reduce) {{
            *, *::before, *::after {{
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }}
        }}
    </style>
</head>
<body class="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col font-sans stitch-mobile-mode">
"""


def build_viewport_toggle_bar():
    return """
            <div role="group" aria-label="뷰포트 미리보기 전환" class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
                <button type="button" id="btn-stitch-mobile" aria-pressed="true" onclick="setStitchViewportMode('mobile')" class="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-slate-900 text-white shadow-2xs transition cursor-pointer whitespace-nowrap">📱 모바일 (430px)</button>
                <button type="button" id="btn-stitch-desktop" aria-pressed="false" onclick="setStitchViewportMode('desktop')" class="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer whitespace-nowrap">🖥️ 데스크톱</button>
            </div>
    """


def build_shared_runtime_js():
    return r"""
        function escapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
        window.escapeHtml = escapeHtml;

        function escapeJsArg(str) {
            if (str === null || str === undefined) return '';
            return escapeHtml(String(str)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/\r/g, '')
                .replace(/\n/g, ' '));
        }
        window.escapeJsArg = escapeJsArg;

        function safeExternalUrl(url, fallback = '#') {
            if (!url) return fallback;
            const s = String(url).trim();
            return /^https?:\/\//i.test(s) ? s : fallback;
        }
        window.safeExternalUrl = safeExternalUrl;

        function getPreferredScrollBehavior() {
            return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
        }
        window.getPreferredScrollBehavior = getPreferredScrollBehavior;

        function copyTextSafely(text) {
            const str = String(text ?? '');
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
                return navigator.clipboard.writeText(str);
            }
            return new Promise((resolve, reject) => {
                try {
                    const ta = document.createElement('textarea');
                    ta.value = str;
                    ta.setAttribute('readonly', '');
                    ta.style.position = 'fixed';
                    ta.style.opacity = '0';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    ta.setSelectionRange(0, str.length);
                    const ok = document.execCommand('copy');
                    document.body.removeChild(ta);
                    if (ok) resolve();
                    else reject(new Error('Clipboard copy failed'));
                } catch (err) {
                    reject(err);
                }
            });
        }
        window.copyTextSafely = copyTextSafely;

        function showToast(msg) {
            const old = document.getElementById('stitch-toast');
            if (old) old.remove();
            const div = document.createElement('div');
            div.id = 'stitch-toast';
            div.setAttribute('role', 'status');
            div.setAttribute('aria-live', 'polite');
            div.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold shadow-xl border border-slate-700 max-w-sm text-center';
            div.textContent = msg;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 2600);
        }

        window.triggerMatchHighlight = function(element) {
            if (!element) return;
            element.classList.remove('interactive-match-highlight');
            void element.offsetWidth;
            element.classList.add('interactive-match-highlight');
            setTimeout(() => element.classList.remove('interactive-match-highlight'), 2900);
        };
        window.triggerMatchHighlightAll = function(elements) {
            if (elements && elements.length) elements.forEach(el => window.triggerMatchHighlight(el));
        };

        const stitchSavedIds = new Set();
        function saveToWorkspace(type, id, institution, title, dday) {
            const key = id || (institution + '|' + title);
            if (stitchSavedIds.has(key)) {
                showToast("⭐ '" + institution + "' 항목이 이미 준비함에 보관되어 있습니다.");
                return;
            }
            stitchSavedIds.add(key);
            showToast("⭐ '" + institution + "' 항목이 준비함에 저장되었습니다.");
        }
        window.saveToWorkspace = saveToWorkspace;

        function setStitchViewportMode(mode) {
            const body = document.body;
            const mBtn = document.getElementById('btn-stitch-mobile');
            const dBtn = document.getElementById('btn-stitch-desktop');
            const isMobile = (mode !== 'desktop');
            body.classList.toggle('stitch-mobile-mode', isMobile);
            if (mBtn) {
                mBtn.setAttribute('aria-pressed', String(isMobile));
                mBtn.className = isMobile
                    ? 'px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-slate-900 text-white shadow-2xs transition cursor-pointer whitespace-nowrap'
                    : 'px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer whitespace-nowrap';
            }
            if (dBtn) {
                dBtn.setAttribute('aria-pressed', String(!isMobile));
                dBtn.className = !isMobile
                    ? 'px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-slate-900 text-white shadow-2xs transition cursor-pointer whitespace-nowrap'
                    : 'px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer whitespace-nowrap';
            }
        }
        window.setStitchViewportMode = setStitchViewportMode;

        function updateStitchTabButtons(viewId) {
            const btns = {
                fields: document.getElementById('tab-btn-fields'),
                hierarchy: document.getElementById('tab-btn-hierarchy'),
                archive: document.getElementById('tab-btn-archive')
            };
            const styles = {
                fields: 'px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center gap-1 cursor-pointer bg-white text-blue-700 shadow-xs border border-slate-200/80 whitespace-nowrap',
                hierarchy: 'px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center gap-1 cursor-pointer bg-white text-emerald-700 shadow-xs border border-slate-200/80 whitespace-nowrap',
                archive: 'px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center gap-1 cursor-pointer bg-white text-indigo-700 shadow-xs border border-slate-200/80 whitespace-nowrap',
                idle: 'px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900 whitespace-nowrap'
            };
            Object.keys(btns).forEach(k => {
                const btn = btns[k];
                if (!btn) return;
                const isActive = (k === viewId);
                btn.className = isActive ? styles[k] : styles.idle;
                btn.setAttribute('aria-selected', String(isActive));
                btn.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        }

        window.showView = function(viewId, options = {}) {
            const valid = ['fields', 'hierarchy', 'archive'];
            if (!valid.includes(viewId)) viewId = 'fields';
            valid.forEach(id => {
                const el = document.getElementById('view-' + id);
                if (el) el.classList.toggle('hidden', id !== viewId);
            });
            updateStitchTabButtons(viewId);

            if (viewId === 'fields') {
                if (typeof applyFieldsFilter === 'function') applyFieldsFilter();
                if (options.search) {
                    const inp = document.getElementById('mobile-field-search') || document.getElementById('fields-search-input');
                    if (inp) { inp.value = options.search; }
                    if (typeof handleMobileSearch === 'function') handleMobileSearch(options.search);
                }
            } else if (viewId === 'hierarchy') {
                if (typeof window.renderHierarchyView === 'function') window.renderHierarchyView(options);
            } else if (viewId === 'archive') {
                if (typeof window.renderArchiveView === 'function') window.renderArchiveView(options);
            }
            if (!options.preventScroll && !options.facilityId && !options.highlightId && !options.facility && !options.targetNodeId) {
                window.scrollTo({ top: 0, behavior: getPreferredScrollBehavior() });
            }
        };

        window.jumpToFacilityHierarchy = function(facilityName, parentCategory) {
            if (!facilityName) return;
            window.showView('hierarchy', { facility: facilityName, parentCategory: parentCategory });
        };

        window.jumpToFacility = function(facilityId) {
            if (!facilityId) return;
            if (facilityId === 'law-justice') facilityId = 'ext-jus-probation';
            if (facilityId === 'law-rural-elderly') facilityId = 'law-elderly';
            if (window.FACILITY_ROW_ID_ALIASES && window.FACILITY_ROW_ID_ALIASES[facilityId]) {
                facilityId = window.FACILITY_ROW_ID_ALIASES[facilityId];
            }
            window.showView('fields', { facilityId: facilityId, preventScroll: true });
            if (typeof window.selectMobileStitchFacility === 'function') {
                window.selectMobileStitchFacility(facilityId, { scrollToTop: false });
            }
            setTimeout(() => {
                const isMob = document.body.classList.contains('stitch-mobile-mode') || window.innerWidth < 768;
                const row = document.getElementById('facility-row-' + facilityId);
                const card = document.getElementById('facility-card-' + facilityId);
                const target = isMob ? (card || row) : (row || card);
                if (target) {
                    const scrollBehavior = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
                    target.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
                    window.triggerMatchHighlight(target);
                }
            }, 180);
        };

        window.jumpToFacilityByTerm = function(term) {
            if (!term) return;
            const rawTerm = String(term).trim();
            const compactRaw = rawTerm.replace(/[·\s()]+/g, '');
            const clean = rawTerm.replace(/\s*\(.*?\)\s*/g, '').trim();
            const pool = [...(window.STATUTORY_MATRIX || []), ...(window.CIVIL_IMPACT_ECOSYSTEM || [])];
            const hit = pool.find(r => {
                const hay = (r.facilityCategory || '') + ' ' + (r.hierarchyFacility || '') + ' ' + (r.livingFacilities || []).join(' ') + ' ' + (r.usingFacilities || []).join(' ');
                return hay.includes(rawTerm) || hay.includes(clean) || hay.replace(/[·\s()]+/g, '').includes(compactRaw);
            });
            if (hit) window.jumpToFacility(hit.id);
            else window.showView('fields', { search: clean });
        };

        window.switchTab = function(arg1, arg2) {
            if (typeof arg1 === 'string') return window.showView(arg1, arg2);
            if (typeof window.switchStitchFacilityTab === 'function') return window.switchStitchFacilityTab(arg1, arg2);
        };
    """


def assemble_html_files():
    cleanup_obsolete_files()

    idx_html = load_text("index.html")
    parts = extract_index_parts(idx_html)

    hierarchy_db_js = load_text("src/data/welfare-hierarchy-db.js")
    archive_db_js = load_text("src/data/guidelines-archive-db.js")
    hierarchy_ctrl_js = load_text("src/js/hierarchy.js")
    archive_ctrl_js = load_text("src/js/archive.js")
    mobile_ctrl_js = load_text("src/js/mobile-stitch-controller.js")

    vf_html = parts["view_fields_html"]
    vf_html = vf_html.replace('class="view-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"', 'class="view-section w-full"')
    vf_html = vf_html.replace(
        '<section id="view-fields"',
        '<section id="view-fields" role="tabpanel" aria-labelledby="tab-btn-fields"',
        1,
    )
    assert 'role="tabpanel" aria-labelledby="tab-btn-fields"' in vf_html, "Failed to add ARIA attributes to #view-fields"

    toggle_bar = build_viewport_toggle_bar()

    p_html = build_common_head("Google Stitch - 3대 핵심 플랫폼 통합 모바일/반응형 스튜디오", parts)
    p_html += f"""
    <header class="no-print w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-sm shrink-0">🧭</span>
                <div>
                    <div class="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>사회복지 현장 나침반</span>
                        <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">Stitch Studio v4.0</span>
                    </div>
                    <div class="text-[10px] text-slate-500 font-medium">3대 핵심 플랫폼 모바일 UI 편집용 단일 통합 파일</div>
                </div>
            </div>

            <div id="stitch-tablist" role="tablist" aria-label="3대 핵심 플랫폼 전환" class="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                <button type="button" id="tab-btn-fields" role="tab" aria-selected="true" aria-controls="view-fields" tabindex="0" onclick="window.showView('fields')" class="px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition flex items-center gap-1 cursor-pointer bg-white text-blue-700 shadow-xs border border-slate-200/80 whitespace-nowrap">
                    <span>🏛️ 분야·시설</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-num">45</span>
                </button>
                <button type="button" id="tab-btn-hierarchy" role="tab" aria-selected="false" aria-controls="view-hierarchy" tabindex="-1" onclick="window.showView('hierarchy')" class="px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900 whitespace-nowrap">
                    <span>🌳 위계도감</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-num">219</span>
                </button>
                <button type="button" id="tab-btn-archive" role="tab" aria-selected="false" aria-controls="view-archive" tabindex="-1" onclick="window.showView('archive')" class="px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900 whitespace-nowrap">
                    <span>📁 아카이브</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-num">70</span>
                </button>
            </div>

            {toggle_bar}
        </div>
    </header>

    <main class="flex-grow py-4">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
            {vf_html}
            <section id="view-hierarchy" role="tabpanel" aria-labelledby="tab-btn-hierarchy" class="view-section w-full hidden"></section>
            <section id="view-archive" role="tabpanel" aria-labelledby="tab-btn-archive" class="view-section w-full hidden"></section>
        </div>
    </main>

    <footer class="no-print bg-white border-t border-slate-200 py-5 text-center text-[11px] text-slate-400">
        Google Stitch Design Template · 18대 분야·시설(45) ⇄ 3단계 위계(219) ⇄ 공식 지침서 아카이브(70종)
    </footer>

    <script>
{parts["view1_datasets_js"]}
{hierarchy_db_js}
{archive_db_js}
{build_shared_runtime_js()}
{parts["view1_logic_js"]}
{hierarchy_ctrl_js}
{archive_ctrl_js}
{mobile_ctrl_js}
        document.addEventListener('DOMContentLoaded', () => {{
            if (typeof renderFieldsTable === 'function') renderFieldsTable();
            if (typeof renderMobileCards === 'function') renderMobileCards();
            if (typeof renderCivilImpactCards === 'function') renderCivilImpactCards();
            if (typeof window.renderHierarchyView === 'function') window.renderHierarchyView();
            if (typeof window.renderArchiveView === 'function') window.renderArchiveView();
            if (typeof window.initMobileStitchShowcase === 'function') window.initMobileStitchShowcase();

            const tablist = document.getElementById('stitch-tablist');
            if (tablist) {{
                tablist.addEventListener('keydown', (e) => {{
                    const order = ['fields', 'hierarchy', 'archive'];
                    const active = document.activeElement;
                    const currentIdx = order.findIndex(id => ('tab-btn-' + id) === (active && active.id));
                    if (currentIdx === -1) return;
                    let nextIdx = null;
                    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % order.length;
                    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + order.length) % order.length;
                    else if (e.key === 'Home') nextIdx = 0;
                    else if (e.key === 'End') nextIdx = order.length - 1;
                    if (nextIdx !== null) {{
                        e.preventDefault();
                        const nextView = order[nextIdx];
                        window.showView(nextView);
                        const nextBtn = document.getElementById('tab-btn-' + nextView);
                        if (nextBtn) nextBtn.focus();
                    }}
                }});
            }}

            window.showView('fields', {{ preventScroll: true }});
        }});
    </script>
</body>
</html>
"""
    save_text(OUTPUT_FILE, p_html)
    print(f"✓ Initial unified {OUTPUT_FILE} assembled.")


# =============================================================================
# Pre-bake Rendered DOM + Full Verification via Headless Edge CDP
# =============================================================================
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def start_server():
    handler = functools.partial(QuietHandler, directory=WORKSPACE)
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd, port


async def cdp_send(ws, mid, method, params=None):
    await ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
    while True:
        raw = await asyncio.wait_for(ws.recv(), timeout=20)
        msg = json.loads(raw)
        if msg.get("id") == mid:
            if "error" in msg:
                raise RuntimeError(f"CDP error {method}: {msg['error']}")
            return msg.get("result", {})


async def eval_js(ws, mid, expr):
    res = await cdp_send(
        ws,
        mid,
        "Runtime.evaluate",
        {"expression": expr, "returnByValue": True, "awaitPromise": True},
    )
    if "exceptionDetails" in res:
        raise RuntimeError(f"JS Exception: {json.dumps(res['exceptionDetails'], ensure_ascii=False)}")
    return res.get("result", {}).get("value")


async def prebake_and_verify():
    import websockets

    httpd, port = start_server()
    user_data = tempfile.mkdtemp(prefix="edge_stitch_bake_")
    dbg_port = 9255

    proc = subprocess.Popen(
        [
            EDGE_EXE,
            "--headless=new",
            "--disable-gpu",
            f"--remote-debugging-port={dbg_port}",
            f"--user-data-dir={user_data}",
            "--window-size=430,900",
            "--no-first-run",
            "--no-default-browser-check",
            f"http://127.0.0.1:{port}/{OUTPUT_FILE}",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        ws_url = None
        for _ in range(40):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{dbg_port}/json", timeout=1) as resp:
                    targets = json.loads(resp.read().decode("utf-8"))
                pages = [t for t in targets if t.get("type") == "page"]
                if pages:
                    ws_url = pages[0]["webSocketDebuggerUrl"]
                    break
            except Exception:
                await asyncio.sleep(0.25)
        if not ws_url:
            raise RuntimeError("Could not connect to Edge CDP target")

        mid = 1
        async with websockets.connect(ws_url, max_size=50 * 1024 * 1024) as ws:
            await cdp_send(ws, mid, "Runtime.enable"); mid += 1
            await cdp_send(ws, mid, "Page.enable"); mid += 1

            # 1. Navigate to unbaked unified file and snapshot rendered DOM
            await cdp_send(ws, mid, "Page.navigate", {"url": f"http://127.0.0.1:{port}/{OUTPUT_FILE}"}); mid += 1
            await asyncio.sleep(1.3)

            snap = await eval_js(ws, mid, """
            (() => {
                window.__stitchErrors = [];
                window.addEventListener('error', e => window.__stitchErrors.push(e.message || String(e)));
                const getHtml = (id) => {
                    const el = document.getElementById(id);
                    return el ? el.innerHTML : null;
                };
                const cnt = (sel) => document.querySelectorAll(sel).length;
                return {
                    fieldsTable: getHtml('fields-table-body'),
                    fieldsMobile: getHtml('mobile-cards-feed'),
                    civilTable: getHtml('civil-impact-table-body'),
                    civilMobile: getHtml('mobile-civil-impact-grid'),
                    viewHierarchy: getHtml('view-hierarchy'),
                    viewArchive: getHtml('view-archive'),
                    counts: {
                        fieldsRows: cnt('#fields-table-body tr[id^="facility-row-"]'),
                        fieldsMobCards: cnt('#mobile-cards-feed > div[id^="facility-card-"]'),
                        civilMobCards: cnt('#mobile-civil-impact-grid > div[id^="facility-card-"]'),
                        hierMobCards: cnt('#mobile-hierarchy-cards-feed .mobile-domain-card'),
                        hierItems: cnt('.mobile-hierarchy-item'),
                        arcMobCards: cnt('#mobile-archive-cards-feed > div'),
                    },
                    errors: window.__stitchErrors
                };
            })()
            """); mid += 1
            assert len(snap["errors"]) == 0, f"{OUTPUT_FILE} initial errors: {snap['errors']}"

            html_src = load_text(OUTPUT_FILE)

            # Assert & replace View 1 placeholders
            ph_fields_table = "<!-- Injected dynamically by renderFieldsTable() -->"
            ph_fields_mobile = "<!-- Dynamically populated by renderMobileCards() -->"
            ph_civil_table = "<!-- Populated dynamically by renderCivilImpactCards() -->"
            ph_civil_mobile = '<div id="mobile-civil-impact-grid" class="space-y-2.5 pt-1"></div>'

            assert ph_fields_table in html_src and snap["fieldsTable"], "Missing fieldsTable placeholder or DOM"
            assert ph_fields_mobile in html_src and snap["fieldsMobile"], "Missing fieldsMobile placeholder or DOM"
            assert ph_civil_table in html_src and snap["civilTable"], "Missing civilTable placeholder or DOM"
            assert ph_civil_mobile in html_src and snap["civilMobile"], "Missing civilMobile placeholder or DOM"

            html_src = html_src.replace(ph_fields_table, snap["fieldsTable"], 1)
            html_src = html_src.replace(ph_fields_mobile, snap["fieldsMobile"], 1)
            html_src = html_src.replace(ph_civil_table, snap["civilTable"], 1)
            html_src = html_src.replace(
                ph_civil_mobile,
                f'<div id="mobile-civil-impact-grid" class="space-y-2.5 pt-1">{snap["civilMobile"]}</div>',
                1,
            )

            # Regex replacement preserving <section ...> attributes (role="tabpanel", aria-labelledby, class)
            assert snap["viewHierarchy"], "Missing rendered viewHierarchy DOM"
            assert snap["viewArchive"], "Missing rendered viewArchive DOM"
            html_src, n_hier = re.subn(
                r'(<section id="view-hierarchy"[^>]*>)(</section>)',
                lambda m: m.group(1) + snap["viewHierarchy"] + m.group(2),
                html_src,
                count=1,
            )
            assert n_hier == 1, "Failed to inject pre-baked #view-hierarchy HTML"

            html_src, n_arc = re.subn(
                r'(<section id="view-archive"[^>]*>)(</section>)',
                lambda m: m.group(1) + snap["viewArchive"] + m.group(2),
                html_src,
                count=1,
            )
            assert n_arc == 1, "Failed to inject pre-baked #view-archive HTML"

            save_text(OUTPUT_FILE, html_src)
            print(f"✓ Pre-baked & saved {OUTPUT_FILE}: {snap['counts']} (size={len(html_src):,} B)")

            # 2. Verify pre-baked file at 1440x960 desktop canvas (confirming stitch-mobile-mode keeps mobile cards visible)
            await cdp_send(ws, mid, "Emulation.setDeviceMetricsOverride", {
                "width": 1440, "height": 960, "deviceScaleFactor": 1, "mobile": False
            }); mid += 1

            await cdp_send(ws, mid, "Page.navigate", {"url": f"http://127.0.0.1:{port}/{OUTPUT_FILE}?verify=1"}); mid += 1
            await asyncio.sleep(1.3)

            check = await eval_js(ws, mid, """
            (() => {
                window.__stitchErrors = [];
                window.addEventListener('error', e => window.__stitchErrors.push(e.message || String(e)));
                const isMobMode = document.body.classList.contains('stitch-mobile-mode');
                const vis = (id) => {
                    const el = document.getElementById(id);
                    if (!el) return null;
                    return getComputedStyle(el).display !== 'none';
                };
                return {
                    isMobMode,
                    mobFieldsVis: vis('mobile-fields-view'),
                    mobHierVis: vis('mobileHierarchyView'),
                    mobArcVis: vis('mobileArchiveView'),
                    fieldsCards: document.querySelectorAll('#mobile-cards-feed > div[id^="facility-card-"]').length,
                    civilCards: document.querySelectorAll('#mobile-civil-impact-grid > div[id^="facility-card-"]').length,
                    hierDomains: document.querySelectorAll('#mobile-hierarchy-cards-feed .mobile-domain-card').length,
                    hierItems: document.querySelectorAll('.mobile-hierarchy-item').length,
                    arcCards: document.querySelectorAll('#mobile-archive-cards-feed > div').length,
                    errors: window.__stitchErrors,
                };
            })()
            """); mid += 1
            print(f"  Verify {OUTPUT_FILE} @1440px stitch-mobile-mode: {check}")
            assert check["errors"] == [], f"Runtime errors after load: {check['errors']}"
            assert check["isMobMode"] is True
            assert check["mobFieldsVis"] is True
            assert check["mobHierVis"] is True
            assert check["mobArcVis"] is True
            assert check["fieldsCards"] == 39, f"Expected 39 fields cards, got {check['fieldsCards']}"
            assert check["civilCards"] == 6, f"Expected 6 civil cards, got {check['civilCards']}"
            assert check["hierDomains"] == 18, f"Expected 18 domain cards, got {check['hierDomains']}"
            assert check["hierItems"] == 219, f"Expected 219 items, got {check['hierItems']}"
            assert check["arcCards"] == 70, f"Expected 70 archive cards, got {check['arcCards']}"

            # 3. Interactive tabs, WAI-ARIA state transitions, bottom-sheet inspector, archive filter/modal, deep-links, viewport toggle
            portal_test = await eval_js(ws, mid, """
            (() => {
                const attr = (id, name) => {
                    const el = document.getElementById(id);
                    return el ? el.getAttribute(name) : null;
                };
                const rectH = (id) => {
                    const el = document.getElementById(id);
                    return el ? el.getBoundingClientRect().height : -1;
                };

                // Initial ARIA & inspector hidden on fields tab
                const initFieldsAria = attr('tab-btn-fields', 'aria-selected');
                const initHierAria = attr('tab-btn-hierarchy', 'aria-selected');
                const initArcAria = attr('tab-btn-archive', 'aria-selected');
                const initMobPressed = attr('btn-stitch-mobile', 'aria-pressed');
                const inspHeightOnFields = rectH('mobile-hierarchy-inspector');

                // Switch to hierarchy
                window.showView('hierarchy');
                const hVis = !document.getElementById('view-hierarchy').classList.contains('hidden');
                const inspHeightOnHier = rectH('mobile-hierarchy-inspector');
                const hierAriaActive = attr('tab-btn-hierarchy', 'aria-selected');
                const inspCollapsedInit = attr('inspector-toggle-btn', 'aria-expanded');

                // Click first item -> opens inspector & syncs aria-expanded + no inverted transform
                const firstItem = document.querySelector('.mobile-hierarchy-item');
                if (firstItem) firstItem.click();
                const inspOpenAfterItem = attr('inspector-toggle-btn', 'aria-expanded');
                const inspContentOpen = !document.getElementById('inspector-content').classList.contains('hidden');
                const inspNoRotateOpen = ((document.getElementById('inspector-toggle-icon') || {}).style || {}).transform === '';

                // Collapse inspector via toggleMobileInspector()
                window.toggleMobileInspector();
                const inspCollapsedAfterToggle = attr('inspector-toggle-btn', 'aria-expanded');
                const inspNoRotateClosed = ((document.getElementById('inspector-toggle-icon') || {}).style || {}).transform === '';

                // Deep-link to archive with facilityId filter & banner + ministry filter + modal Escape test
                window.showView('archive', { facilityId: 'law-elderly', facilityName: '노인복지시설' });
                const aVis = !document.getElementById('view-archive').classList.contains('hidden');
                const inspHeightInArchive = rectH('mobile-hierarchy-inspector');
                const arcAriaActive = attr('tab-btn-archive', 'aria-selected');
                const arcBannerText = (document.getElementById('mobileArchiveFacilityBannerContainer') || {}).textContent || '';
                const hasArcBanner = arcBannerText.includes('노인복지시설');
                window.clearArchiveFacilityFilter();

                window.setArchiveMinistryFilter('보건복지부');
                const mohwArcCards = document.querySelectorAll('#mobile-archive-cards-feed > div').length;
                window.setArchiveMinistryFilter('전체');
                const restoredArcCards = document.querySelectorAll('#mobile-archive-cards-feed > div').length;

                window.viewGuidelineModal('doc-001');
                const gModal = document.getElementById('guideline-detail-modal');
                const modalIsDialog = !!gModal && gModal.getAttribute('role') === 'dialog' && gModal.getAttribute('aria-modal') === 'true';
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                const modalRemovedOnEsc = !document.getElementById('guideline-detail-modal');

                // Deep-link back via jumpToFacility('law-elderly')
                window.jumpToFacility('law-elderly');
                const backToFieldsVis = !document.getElementById('view-fields').classList.contains('hidden');
                const backFieldsAria = attr('tab-btn-fields', 'aria-selected');

                // Ministry filter check
                window.filterByMinistry('보건복지부');
                const mohwCards = document.querySelectorAll('#mobile-cards-feed > div[id^="facility-card-"]').length;
                window.filterByMinistry('전체');

                // Stitch 2 showcase checks (default 노인복지관, facility detail toggle, service accordion, facility switch & restore)
                const stitchDefaultTitle = (document.getElementById('stitch-fac-title') || {}).textContent || '';
                window.toggleFacilityDetail();
                const facDetailOpened = !document.getElementById('facility-detail-body').classList.contains('hidden');
                const facDetailExpandedAttr = attr('fac-detail-toggle-btn', 'aria-expanded');
                window.toggleFacilityDetail();
                const facDetailClosedAgain = document.getElementById('facility-detail-body').classList.contains('hidden');

                window.toggleServiceDetail(2);
                const serv2Opened = !document.getElementById('serv-detail-2').classList.contains('hidden');
                window.toggleServiceDetail(2);

                window.selectMobileStitchFacility('law-welfare-center');
                const stitchSwitchedTitle = (document.getElementById('stitch-fac-title') || {}).textContent || '';
                const stitchWelfareGuide = (document.getElementById('stitch-guide-title') || {}).textContent || '';
                window.selectMobileStitchFacility('law-disability');
                const stitchDisGuide = (document.getElementById('stitch-guide-title') || {}).textContent || '';
                window.selectMobileStitchFacility('law-elderly');
                const stitchRestoredTitle = (document.getElementById('stitch-fac-title') || {}).textContent || '';

                // Stitch 1 TOC drawer checks (open, forms tab, bookmarks tab, Escape close)
                window.openStitchTocDrawer('doc-005');
                const tocOpenedAria = attr('toc-drawer', 'aria-hidden');
                window.setStitchTocTab('forms');
                const tocFormsPressed = attr('toc-tab-forms', 'aria-pressed');
                window.setStitchTocTab('bookmarks');
                const tocBookmarksPressed = attr('toc-tab-bookmarks', 'aria-pressed');
                const tocEmptyEl = document.getElementById('toc-filter-empty-state');
                const tocBookmarksEmpty = !!tocEmptyEl && !tocEmptyEl.classList.contains('hidden');
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                const tocClosedOnEscAria = attr('toc-drawer', 'aria-hidden');

                // Viewport toggle check
                window.setStitchViewportMode('desktop');
                const deskMode = !document.body.classList.contains('stitch-mobile-mode');
                const deskPressed = attr('btn-stitch-desktop', 'aria-pressed');
                const mobPressedInDesk = attr('btn-stitch-mobile', 'aria-pressed');

                window.setStitchViewportMode('mobile');
                const mobPressedRestored = attr('btn-stitch-mobile', 'aria-pressed');
                const deskPressedRestored = attr('btn-stitch-desktop', 'aria-pressed');

                return {
                    initFieldsAria,
                    initHierAria,
                    initArcAria,
                    initMobPressed,
                    inspHeightOnFields,
                    hVis,
                    inspHeightOnHier,
                    hierAriaActive,
                    inspCollapsedInit,
                    inspOpenAfterItem,
                    inspContentOpen,
                    inspNoRotateOpen,
                    inspCollapsedAfterToggle,
                    inspNoRotateClosed,
                    aVis,
                    inspHeightInArchive,
                    arcAriaActive,
                    hasArcBanner,
                    mohwArcCards,
                    restoredArcCards,
                    modalIsDialog,
                    modalRemovedOnEsc,
                    backToFieldsVis,
                    backFieldsAria,
                    mohwCards,
                    stitchDefaultTitle,
                    facDetailOpened,
                    facDetailExpandedAttr,
                    facDetailClosedAgain,
                    serv2Opened,
                    stitchSwitchedTitle,
                    stitchWelfareGuide,
                    stitchDisGuide,
                    stitchRestoredTitle,
                    tocOpenedAria,
                    tocFormsPressed,
                    tocBookmarksPressed,
                    tocBookmarksEmpty,
                    tocClosedOnEscAria,
                    deskMode,
                    deskPressed,
                    mobPressedInDesk,
                    mobPressedRestored,
                    deskPressedRestored,
                    errors: window.__stitchErrors
                };
            })()
            """); mid += 1
            print(f"  Interactive & ARIA verification: {portal_test}")
            assert portal_test["errors"] == [], f"Runtime errors during interaction: {portal_test['errors']}"
            assert portal_test["initFieldsAria"] == "true"
            assert portal_test["initHierAria"] == "false"
            assert portal_test["initArcAria"] == "false"
            assert portal_test["initMobPressed"] == "true"
            assert portal_test["inspHeightOnFields"] == 0
            assert portal_test["hVis"] is True
            assert portal_test["inspHeightOnHier"] > 0
            assert portal_test["hierAriaActive"] == "true"
            assert portal_test["inspCollapsedInit"] == "false"
            assert portal_test["inspOpenAfterItem"] == "true"
            assert portal_test["inspContentOpen"] is True
            assert portal_test["inspNoRotateOpen"] is True
            assert portal_test["inspCollapsedAfterToggle"] == "false"
            assert portal_test["inspNoRotateClosed"] is True
            assert portal_test["aVis"] is True
            assert portal_test["inspHeightInArchive"] == 0
            assert portal_test["arcAriaActive"] == "true"
            assert portal_test["hasArcBanner"] is True
            assert 0 < portal_test["mohwArcCards"] < 70
            assert portal_test["restoredArcCards"] == 70
            assert portal_test["modalIsDialog"] is True
            assert portal_test["modalRemovedOnEsc"] is True
            assert portal_test["backToFieldsVis"] is True
            assert portal_test["backFieldsAria"] == "true"
            assert portal_test["mohwCards"] == 12
            assert "노인복지관" in portal_test["stitchDefaultTitle"], f"Unexpected default hero title: {portal_test['stitchDefaultTitle']}"
            assert portal_test["facDetailOpened"] is True
            assert portal_test["facDetailExpandedAttr"] == "true"
            assert portal_test["facDetailClosedAgain"] is True
            assert portal_test["serv2Opened"] is True
            assert "사회복지관" in portal_test["stitchSwitchedTitle"], f"Unexpected switched hero title: {portal_test['stitchSwitchedTitle']}"
            assert "사회복지관" in portal_test["stitchWelfareGuide"], f"Unexpected welfare center guide title: {portal_test['stitchWelfareGuide']}"
            assert "장애인" in portal_test["stitchDisGuide"], f"Unexpected disability guide title: {portal_test['stitchDisGuide']}"
            assert "노인복지관" in portal_test["stitchRestoredTitle"], f"Unexpected restored hero title: {portal_test['stitchRestoredTitle']}"
            assert portal_test["tocOpenedAria"] == "false"
            assert portal_test["tocFormsPressed"] == "true"
            assert portal_test["tocBookmarksPressed"] == "true"
            assert portal_test["tocBookmarksEmpty"] is False, "Bookmarks tab in default TOC drawer showed empty state"
            assert portal_test["tocClosedOnEscAria"] == "true"
            assert portal_test["deskMode"] is True
            assert portal_test["deskPressed"] == "true"
            assert portal_test["mobPressedInDesk"] == "false"
            assert portal_test["mobPressedRestored"] == "true"
            assert portal_test["deskPressedRestored"] == "false"

            print(f"\nUNIFIED STITCH FILE ({OUTPUT_FILE}) PRE-BAKED & V8 VERIFIED 100%!")
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()
        httpd.shutdown()
        shutil.rmtree(user_data, ignore_errors=True)


def build_exports():
    print("Building unified Phase 3 Google Stitch HTML file (Mobile-First + Pre-baked DOM + Modern Web UX/ARIA)...")
    assemble_html_files()
    asyncio.run(prebake_and_verify())


if __name__ == "__main__":
    build_exports()
