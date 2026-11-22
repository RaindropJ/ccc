/**
 * ==============================================================================
 * 대한민국 사회복지 현장 나침반: 모바일 3대 화면 동적 인터랙션 & 데이터 바인딩 모듈
 * (18대 분야·시설 도감 / 3단계 위계 도감 & 바텀시트 인스펙터 / 공식 지침서 아카이브)
 * Google Stitch Mobile Component Controller (Material Design 3 & Local-First)
 * ==============================================================================
 */

(function (window, document) {
  'use strict';

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeJsArg(str) {
    if (str === null || str === undefined) return '';
    return escapeHtml(String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '')
      .replace(/\n/g, ' '));
  }

  // ----------------------------------------------------------------------------
  // 1. 18대 분야·시설 도감 모바일 인터랙션 (Fallback — 기존 전역 구현 우선 보존)
  // ----------------------------------------------------------------------------
  let currentMobileMinistry = '전체';
  let currentMobileSearchQuery = '';

  function filterAndRenderMobileFields() {
    const cards = document.querySelectorAll('#mobile-cards-feed > div, .mobile-fields-container #mobile-cards-feed > div');
    let matchCount = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const ministryAttr = card.getAttribute('data-ministry') || '';
      const matchMinistry = (currentMobileMinistry === '전체') || text.includes(currentMobileMinistry.toLowerCase()) || ministryAttr.includes(currentMobileMinistry);
      const matchQuery = !currentMobileSearchQuery || text.includes(currentMobileSearchQuery);

      if (matchMinistry && matchQuery) {
        card.classList.remove('hidden');
        matchCount++;
      } else {
        card.classList.add('hidden');
      }
    });
    const countBadge = document.getElementById('mobile-match-count');
    if (countBadge) countBadge.textContent = matchCount;
  }

  if (typeof window.handleMobileSearch !== 'function') {
    window.handleMobileSearch = function (query) {
      currentMobileSearchQuery = (query || '').trim().toLowerCase();
      const clearBtn = document.getElementById('search-clear-btn');
      if (clearBtn) clearBtn.classList.toggle('hidden', currentMobileSearchQuery.length === 0);

      const desktopInput = document.getElementById('fields-search-input');
      if (desktopInput && desktopInput.value !== query) {
        desktopInput.value = query;
      }

      if (typeof window.applyFieldsFilter === 'function') {
        window.currentFieldsQuery = currentMobileSearchQuery;
        window.applyFieldsFilter();
      } else {
        filterAndRenderMobileFields();
      }
    };
  }

  if (typeof window.clearMobileSearch !== 'function') {
    window.clearMobileSearch = function () {
      const input = document.getElementById('mobile-field-search');
      if (input) input.value = '';
      window.handleMobileSearch('');
    };
  }

  if (typeof window.filterByMinistry !== 'function') {
    window.filterByMinistry = function (ministry) {
      currentMobileMinistry = ministry || '전체';
      const cleanMin = (ministry || '').replace(/\s*\(.*?\)/g, '').trim();
      const isFamily = (cleanMin === '여성가족부' || cleanMin === '성평등가족부');

      const pills = document.querySelectorAll('#mobile-ministry-pills .ministry-pill');
      pills.forEach(pill => {
        const text = pill.textContent || '';
        const isMatch = (cleanMin === '전체' && text.includes('전체')) ||
                        text.includes(cleanMin) ||
                        (isFamily && (text.includes('여성가족부') || text.includes('성평등가족부')));
        if (isMatch) {
          if (cleanMin === '민간제3섹터') {
            pill.className = 'ministry-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white flex-shrink-0 transition shadow-2xs cursor-pointer flex items-center gap-1';
          } else {
            pill.className = 'ministry-pill px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-900 text-white flex-shrink-0 transition shadow-2xs cursor-pointer';
          }
        } else {
          if (text.includes('민간 제3섹터')) {
            pill.className = 'ministry-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 flex-shrink-0 transition cursor-pointer flex items-center gap-1';
          } else {
            pill.className = 'ministry-pill px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex-shrink-0 transition cursor-pointer';
          }
        }
      });

      if (typeof window.setMinistryFilter === 'function') {
        window.setMinistryFilter(ministry);
      } else {
        filterAndRenderMobileFields();
      }
    };
  }

  if (typeof window.toggleAllCards !== 'function') {
    window.toggleAllCards = function (shouldOpen) {
      if (typeof window.openCardMap !== 'undefined' && typeof window.STATUTORY_DATA !== 'undefined') {
        window.STATUTORY_DATA.forEach(d => {
          window.openCardMap[d.id] = shouldOpen;
        });
        if (typeof window.renderMobileCards === 'function') {
          window.renderMobileCards();
        }
        return;
      }
      const bodies = document.querySelectorAll('#mobile-cards-feed .card-accordion-body, .mobile-fields-container .card-accordion-body');
      const chevrons = document.querySelectorAll('#mobile-cards-feed .card-chevron, .mobile-fields-container .card-chevron');
      bodies.forEach(body => shouldOpen ? body.classList.remove('hidden') : body.classList.add('hidden'));
      chevrons.forEach(icon => { icon.style.transform = shouldOpen ? 'rotate(180deg)' : 'rotate(0deg)'; });
    };
  }

  // ----------------------------------------------------------------------------
  // 2. 3단계 위계 도감 & 바텀시트 인스펙터 (Mobile Hierarchy & Inspector)
  // ----------------------------------------------------------------------------
  function syncInspectorControls(isOpen) {
    const label = document.querySelector('#inspector-toggle-label span');
    const icon = document.getElementById('inspector-toggle-icon');
    const toggleBtn = document.getElementById('inspector-toggle-btn');
    if (label) label.textContent = isOpen ? '접기' : '펼치기';
    if (icon) {
      icon.textContent = isOpen ? '▼' : '▲';
      icon.style.transform = '';
    }
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(Boolean(isOpen)));
  }

  window.toggleMobileInspector = function () {
    const content = document.getElementById('inspector-content');
    if (!content) return;
    const willOpen = content.classList.contains('hidden');
    content.classList.toggle('hidden', !willOpen);
    syncInspectorControls(willOpen);
  };

  window.inspectFacilityDetail = function (facilityData) {
    if (!facilityData) return;
    const inspector = document.getElementById('mobile-hierarchy-inspector');
    const content = document.getElementById('inspector-content');
    if (!inspector || !content) return;

    const isLiving = Boolean(facilityData.isLiving);
    const facName = facilityData.name || '선택된 법정 시설·서비스';
    const facType = facilityData.facilityType || (isLiving ? '생활시설 (거주형 24h)' : '이용시설 (통원형)');
    const department = facilityData.department || '보건복지부';
    const legalBasis = facilityData.legalBasis || '사회복지사업법 제34조의5';
    const cleanSearchName = facName.replace(/\s*\(.*?\)/g, '').trim();
    const matchedGuidelineName = facilityData.matchedGuideline || '2026 사회복지시설 관리안내';
    const guidelineSearchKey = matchedGuidelineName.split('[')[0].replace('.pdf', '').trim();

    let criteriaLines;
    if (Array.isArray(facilityData.staffCriteriaLines) && facilityData.staffCriteriaLines.length > 0) {
      criteriaLines = facilityData.staffCriteriaLines;
    } else if (facilityData.staffCriteria) {
      criteriaLines = String(facilityData.staffCriteria).split(/<br\s*\/?>|\r?\n/i).filter(Boolean);
    } else {
      criteriaLines = ['사회복지사업법 시행규칙 제11조 및 해당 분야 국가공식 사업안내 기준을 준용합니다.'];
    }
    const staffCriteriaHtml = criteriaLines.map(line => escapeHtml(line)).join('<br>');

    content.innerHTML = `
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2 py-0.5 rounded ${isLiving ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'} text-[10px] font-bold">
            ${escapeHtml(facType)}
          </span>
          <span class="text-[11px] text-slate-500 font-medium">${escapeHtml(department)}</span>
        </div>
        <h4 class="text-base font-black text-slate-900 mt-1">${escapeHtml(facName)}</h4>
        <div class="text-[11px] text-emerald-700 font-semibold mt-0.5">✔ 법적근거: ${escapeHtml(legalBasis)}</div>
      </div>

      <div class="bg-amber-50 rounded-xl p-3 border border-amber-200/80 text-xs">
        <div class="font-extrabold text-amber-950 flex items-center gap-1.5 mb-1">
          <span>⚡</span><span>법정 배치기준 &amp; 3대 핵심 실천과업</span>
        </div>
        <div class="text-[11px] text-amber-900 leading-relaxed space-y-1">
          ${staffCriteriaHtml}
        </div>
      </div>

      <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-lg flex-shrink-0">📖</span>
          <div class="min-w-0">
            <div class="text-[10px] text-slate-500 font-medium">정부 공식 지침서 1:1 매칭</div>
            <div class="text-xs font-extrabold text-slate-900 truncate" title="${escapeHtml(matchedGuidelineName)}">${escapeHtml(matchedGuidelineName)}</div>
          </div>
        </div>
        <button type="button" onclick="showView('archive', {search: '${escapeJsArg(guidelineSearchKey)}'})"
                class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition flex-shrink-0 shadow-2xs cursor-pointer">
          <span>원문 열람 ➔</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button type="button" onclick="showView('archive', {search: '${escapeJsArg(cleanSearchName)}'})"
                class="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center hover:bg-blue-100 transition cursor-pointer">
          <div class="text-[10px] text-blue-600 font-bold">70종 정본 아카이브</div>
          <div class="text-[11px] text-blue-900 font-extrabold">공식 지침서 열람 ➔</div>
        </button>
        <button type="button" onclick="showView('fields', {search: '${escapeJsArg(cleanSearchName)}'})"
                class="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center hover:bg-indigo-100 transition cursor-pointer">
          <div class="text-[10px] text-indigo-600 font-bold">45개 법정·민간 체계</div>
          <div class="text-[11px] text-indigo-900 font-extrabold">18대 분야도감 대조 ➔</div>
        </button>
      </div>
    `;

    content.classList.remove('hidden');
    syncInspectorControls(true);
  };

  if (typeof window.selectMobileHierarchyNode !== 'function') {
    window.selectMobileHierarchyNode = function (nodeId) {
      if (typeof window.WELFARE_HIERARCHY_NODES === 'undefined') return;
      const node = window.WELFARE_HIERARCHY_NODES.find(n => n.id === nodeId);
      if (!node) return;

      document.querySelectorAll('.mobile-hierarchy-item').forEach(el => {
        el.className = 'mobile-hierarchy-item p-2.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 flex items-center justify-between cursor-pointer transition select-none';
        const badge = el.querySelector('.item-status-badge');
        if (badge) {
          badge.className = 'px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium flex-shrink-0 item-status-badge';
          badge.textContent = '분석 ➔';
        }
      });

      const activeEl = document.getElementById('mobile-hierarchy-item-' + nodeId);
      if (activeEl) {
        activeEl.className = 'mobile-hierarchy-item p-2.5 rounded-lg bg-emerald-50/80 border-2 border-emerald-500 flex items-center justify-between cursor-pointer transition select-none shadow-xs';
        const badge = activeEl.querySelector('.item-status-badge');
        if (badge) {
          badge.className = 'px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex-shrink-0 item-status-badge';
          badge.textContent = '선택됨';
        }
      }

      const isLiving = (node.level1 || '').includes('주거') || (node.level1 || '').includes('생활') || (node.level1 || '').includes('요양') || (node.facilityType || '').includes('양로') || (node.facilityType || '').includes('요양') || (node.facilityType || '').includes('거주');
      const ministryName = (['01_사회복지관', '02_노인복지', '03_장애인복지', '04_아동돌봄복지', '05_영유아보육', '08_정신건강자살예방', '09_자활고용지원', '11_지역보호긴급돌봄'].includes(node.domainId)) ? '보건복지부' : '관계부처';

      const facilityData = {
        name: `${node.level3} (${node.facilityType || '법정시설'})`,
        facilityType: isLiving ? '생활시설 (거주형 24h 케어)' : '이용시설 (통원형·주간·방문)',
        isLiving: isLiving,
        department: ministryName,
        legalBasis: (node.guidelineRef && node.guidelineRef.chapter) ? node.guidelineRef.chapter : '사회복지사업법 제34조의5 및 각 개별법령',
        staffCriteriaLines: (node.details && node.details.length > 0) ? node.details.map(d => '• ' + d) : [node.summary || '공식 실천 기준을 준용합니다.'],
        matchedGuideline: node.guidelineRef ? `${node.guidelineRef.file} [${node.guidelineRef.page || '전문'}]` : '2026 사회복지시설 관리안내'
      };

      window.inspectFacilityDetail(facilityData);
    };
  }

  let currentHierarchyDomain = 'all';
  let currentHierarchyQuery = '';

  window.resetMobileHierarchyState = function () {
    currentHierarchyDomain = 'all';
    currentHierarchyQuery = '';
  };

  function applyMobileHierarchyFilter() {
    const domainCards = document.querySelectorAll('#mobile-hierarchy-cards-feed .mobile-domain-card');
    domainCards.forEach(card => {
      const cDomain = card.getAttribute('data-domain-id');
      const matchDomain = (currentHierarchyDomain === 'all') || (cDomain === currentHierarchyDomain);

      if (!matchDomain) {
        card.classList.add('hidden');
        return;
      }

      let hasMatch = false;
      const subItems = card.querySelectorAll('.mobile-hierarchy-item');
      subItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matchText = !currentHierarchyQuery || text.includes(currentHierarchyQuery);
        item.classList.toggle('hidden', !matchText);
        if (matchText) hasMatch = true;
      });

      card.classList.toggle('hidden', !hasMatch);
    });
  }

  window.handleMobileHierarchySearch = function (query) {
    currentHierarchyQuery = (query || '').trim().toLowerCase();
    applyMobileHierarchyFilter();
  };

  window.filterMobileHierarchyByDomain = function (domainId, btn) {
    currentHierarchyDomain = domainId || 'all';
    const pills = document.querySelectorAll('#mobile-hierarchy-domain-pills .mobile-hierarchy-pill');
    pills.forEach(p => {
      p.setAttribute('aria-pressed', 'false');
      p.className = 'mobile-hierarchy-pill px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex-shrink-0 cursor-pointer';
    });
    if (btn) {
      btn.setAttribute('aria-pressed', 'true');
      btn.className = 'mobile-hierarchy-pill px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white flex-shrink-0 cursor-pointer shadow-2xs';
    }
    applyMobileHierarchyFilter();
  };

  // ----------------------------------------------------------------------------
  // 3. 공식 지침서 아카이브 모바일 인터랙션 (Fallback — archive.js 구현 우선 보존)
  // ----------------------------------------------------------------------------
  let currentArchiveYear = '전체';
  let currentArchiveMinistry = '전체';
  let currentArchiveSearch = '';

  function filterAndRenderMobileArchive() {
    const cards = document.querySelectorAll('#mobile-archive-cards-feed > div, .mobile-archive-container #mobile-archive-cards-feed > div');
    let visibleCount = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardYear = card.getAttribute('data-year') || '';
      const cardMinistry = card.getAttribute('data-ministry') || '';
      const cardSection = card.getAttribute('data-section') || '';

      const matchSearch = !currentArchiveSearch || text.includes(currentArchiveSearch);
      const matchYear = (currentArchiveYear === '전체') || cardYear.includes(currentArchiveYear) || text.includes(currentArchiveYear);
      const matchMinistry = (currentArchiveMinistry === '전체')
        || (currentArchiveMinistry === 'TRACK2' && cardSection === 'SECTION_3')
        || (currentArchiveMinistry !== 'TRACK2' && (cardMinistry.includes(currentArchiveMinistry) || text.includes(currentArchiveMinistry.toLowerCase())));

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

  if (typeof window.handleMobileArchiveSearch !== 'function') {
    window.handleMobileArchiveSearch = function (query) {
      currentArchiveSearch = (query || '').trim().toLowerCase();
      filterAndRenderMobileArchive();
    };
  }

  if (typeof window.filterArchiveByYear !== 'function') {
    window.filterArchiveByYear = function (year, buttonElement) {
      currentArchiveYear = year;
      const container = document.getElementById('mobile-archive-year-pills');
      if (container) {
        container.querySelectorAll('.archive-year-pill').forEach(btn => {
          btn.className = 'archive-year-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer';
        });
      }
      if (buttonElement) {
        buttonElement.className = 'archive-year-pill px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white flex-shrink-0 shadow-2xs cursor-pointer';
      }
      filterAndRenderMobileArchive();
    };
  }

  if (typeof window.filterArchiveByMinistry !== 'function') {
    window.filterArchiveByMinistry = function (ministry, buttonElement) {
      currentArchiveMinistry = ministry;
      const container = document.getElementById('mobile-archive-ministry-pills');
      if (container) {
        container.querySelectorAll('.archive-ministry-pill').forEach(btn => {
          btn.className = 'archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 flex-shrink-0 cursor-pointer';
        });
      }
      if (buttonElement) {
        buttonElement.className = 'archive-ministry-pill px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-white flex-shrink-0 shadow-2xs cursor-pointer';
      }
      filterAndRenderMobileArchive();
    };
  }

  // ----------------------------------------------------------------------------
  // 4. Google Stitch 1 & 2 Mobile Law Guide & TOC Drawer Controller
  // ----------------------------------------------------------------------------
  const MATERIAL_ICON_MAP = {
    'law-elderly': 'elderly',
    'law-integrated-care': 'diversity_3',
    'law-child': 'child_care',
    'law-childcare': 'stroller',
    'law-disability': 'accessible_forward',
    'law-mental': 'psychology',
    'law-homeless': 'night_shelter',
    'law-welfare-center': 'location_city',
    'law-selfreliance': 'work_outline',
    'law-medical': 'local_hospital',
    'law-kdca': 'vaccines',
    'law-family-center': 'family_restroom',
    'law-youth': 'school',
    'law-single-parent': 'volunteer_activism',
    'law-prostitution': 'shield',
    'law-sexual-violence': 'security',
    'law-domestic-violence': 'home_health',
    'law-unification': 'public',
    'law-school': 'menu_book',
    'law-labor-disability': 'engineering',
    'law-veterans': 'military_tech',
    'law-justice': 'gavel',
    'law-ngo-csr': 'handshake',
    'law-public-admin': 'account_balance',
    'ext-sec-social-enterprise': 'storefront',
    'ext-sec-coop-village': 'groups',
    'ext-sec-social-farm': 'agriculture',
    'ext-jus-correction': 'balance',
    'ext-jus-probation': 'policy',
    'ext-jus-foreign': 'language',
    'ext-med-hospital': 'medical_services',
    'ext-med-rehab': 'healing',
    'ext-med-public-health': 'health_and_safety',
    'ext-med-special': 'emergency',
    'ext-edu-k12': 'auto_stories',
    'ext-edu-special': 'accessibility_new',
    'ext-edu-univ-lifelong': 'workspace_premium',
    'ext-life-housing-disaster': 'foundation',
    'ext-life-finance-volunteer': 'payments',
    'ext-rel-welfare': 'favorite',
    'ext-rel-heritage': 'temple_buddhist',
    'civil-ngo': 'volunteer_activism',
    'civil-fund': 'savings',
    'civil-religion': 'church',
    'civil-se': 'hub',
    'civil-volunteer': 'diversity_1',
    'civil-academic': 'biotech'
  };

  let stitchInitialized = false;
  let stitchToastTimer = null;
  let defaultElderlySnapshot = null;
  let defaultTocTreeHtml = null;
  let currentTocTab = 'all';
  let currentTocSearch = '';
  let currentTocDocId = 'doc-005';
  let lastFocusedBeforeToc = null;
  const savedPrepFacilityIds = new Set();

  window.currentStitchFacilityId = window.currentStitchFacilityId || 'law-elderly';
  window.currentStitchDocId = window.currentStitchDocId || 'doc-005';

  function getAllFacilityRecords() {
    const core = Array.isArray(window.STATUTORY_MATRIX) ? window.STATUTORY_MATRIX : [];
    const ext = Array.isArray(window.EXTENDED_STATUTORY_MATRIX) ? window.EXTENDED_STATUTORY_MATRIX : [];
    const civ = Array.isArray(window.CIVIL_IMPACT_ECOSYSTEM) ? window.CIVIL_IMPACT_ECOSYSTEM : [];
    const merged = [...core];
    [...ext, ...civ].forEach(item => {
      if (item && item.id && !merged.some(m => m.id === item.id)) {
        merged.push(item);
      }
    });
    return merged;
  }

  function findFacilityRecord(facilityId) {
    if (!facilityId) return null;
    if (facilityId === 'law-rural-elderly') facilityId = 'law-elderly';
    if (window.FACILITY_ROW_ID_ALIASES && window.FACILITY_ROW_ID_ALIASES[facilityId]) {
      facilityId = window.FACILITY_ROW_ID_ALIASES[facilityId];
    }
    const pool = getAllFacilityRecords();
    return pool.find(r => r.id === facilityId) || null;
  }

  function getAllArchiveDocs() {
    const out = [];
    const rawDb = (typeof GUIDELINES_ARCHIVE_DB !== 'undefined')
      ? GUIDELINES_ARCHIVE_DB
      : window.GUIDELINES_ARCHIVE_DB;
    const categories = Array.isArray(rawDb)
      ? rawDb
      : (rawDb && Array.isArray(rawDb.categories) ? rawDb.categories : []);
    categories.forEach(cat => {
      (cat.sources || []).forEach(src => {
        (src.files || []).forEach(f => {
          out.push({
            ...f,
            ministry: f.ministry || cat.categoryName || cat.title || '관계부처',
            sourceTitle: src.sourceName || src.title || ''
          });
        });
      });
    });
    return out;
  }

  function resolveArchiveDocForFacility(fac) {
    const docs = getAllArchiveDocs();
    if (docs.length === 0) return null;
    if (!fac) return docs.find(d => d.id === 'doc-005') || docs[0];
    if (fac.id === 'law-elderly') {
      return docs.find(d => d.id === 'doc-005') || docs[0];
    }
    const map = window.FACILITY_ARCHIVE_MAP || {};
    const mappedIds = map[fac.id];
    if (Array.isArray(mappedIds) && mappedIds.length > 0) {
      for (let i = 0; i < mappedIds.length; i++) {
        const hit = docs.find(d => d.id === mappedIds[i]);
        if (hit) return hit;
      }
    }
    const byTarget = docs.find(d => d.facilityTargetId === fac.id);
    if (byTarget) return byTarget;

    const cleanCat = String(fac.facilityCategory || '').replace(/\s*\(.*?\)/g, '').trim();
    const keywords = [
      fac.hierarchyFacility || '',
      cleanCat,
      ...(fac.livingFacilities || []).slice(0, 2),
      ...(fac.usingFacilities || []).slice(0, 2)
    ]
      .join(' ')
      .split(/[·,/()\s]+/)
      .map(s => s.trim())
      .filter(s => s.length >= 2);

    let bestDoc = null;
    let bestScore = 0;
    docs.forEach(d => {
      const hay = `${d.title || ''} ${d.legalTarget || ''} ${(d.keyChapters || []).join(' ')} ${d.ministry || ''}`;
      let score = 0;
      keywords.forEach(k => {
        if (hay.includes(k)) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestDoc = d;
      }
    });
    return bestDoc || docs[0];
  }

  function findHierarchyNodesForFacility(fac, matchedDoc) {
    const nodes = Array.isArray(window.WELFARE_HIERARCHY_NODES) ? window.WELFARE_HIERARCHY_NODES : [];
    if (!fac || nodes.length === 0) return [];
    const terms = new Set();
    const addTerms = (txt) => {
      if (!txt) return;
      const clean = String(txt).replace(/\s*\(.*?\)/g, '').trim();
      if (clean.length >= 2) terms.add(clean);
      clean.split(/[·,/()\s]+/).forEach(tok => {
        const t = tok.trim();
        if (t.length >= 2 && !['시설', '기관', '센터', '사업', '서비스', '지원', '관리', '운영', '복지'].includes(t)) {
          terms.add(t);
        }
      });
    };
    addTerms(fac.hierarchyFacility);
    addTerms(fac.facilityCategory);
    (fac.livingFacilities || []).slice(0, 3).forEach(addTerms);
    (fac.usingFacilities || []).slice(0, 3).forEach(addTerms);

    const scored = [];
    nodes.forEach(node => {
      let score = 0;
      const hay = `${node.facilityType || ''} ${node.level1 || ''} ${node.level2 || ''} ${node.level3 || ''} ${node.summary || ''}`;
      if (matchedDoc && node.guidelineRef && node.guidelineRef.archiveId === matchedDoc.id) {
        score += 5;
      }
      terms.forEach(term => {
        if (hay.includes(term)) score += (term.length >= 4 ? 3 : 2);
      });
      if (score > 0) scored.push({ node, score });
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.node);
  }

  function hostOverlaysOnBody() {
    ['toast', 'stitch-toc-drawer-wrapper'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.parentNode && el.parentNode !== document.body) {
        document.body.appendChild(el);
      }
    });
  }

  window.showStitchMobileToast = function (msg) {
    hostOverlaysOnBody();
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (toast && msgEl) {
      msgEl.textContent = String(msg || '');
      toast.classList.remove('hidden', 'opacity-0', 'pointer-events-none', '-translate-y-2');
      toast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      if (stitchToastTimer) clearTimeout(stitchToastTimer);
      stitchToastTimer = setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
        toast.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }, 2400);
      return;
    }
    if (typeof window.showToast === 'function') {
      window.showToast(String(msg || ''));
    }
  };

  window.togglePrepBox = function () {
    const fac = findFacilityRecord(window.currentStitchFacilityId) || {
      id: window.currentStitchFacilityId || 'law-elderly',
      ministry: '보건복지부',
      facilityCategory: document.getElementById('stitch-fac-title')?.textContent?.trim() || '노인복지관'
    };
    const isSaved = savedPrepFacilityIds.has(fac.id);
    const prepIcon = document.getElementById('prep-icon');
    const prepBox = document.getElementById('prep-box');
    if (prepBox) prepBox.classList.toggle('hidden');

    if (isSaved) {
      savedPrepFacilityIds.delete(fac.id);
      if (prepIcon) {
        prepIcon.style.fontVariationSettings = "'FILL' 0";
        prepIcon.classList.remove('text-amber-500');
      }
      window.showStitchMobileToast(`🔖 '${fac.facilityCategory}' 준비함 선택을 해제했습니다.`);
    } else {
      savedPrepFacilityIds.add(fac.id);
      if (prepIcon) {
        prepIcon.style.fontVariationSettings = "'FILL' 1";
        prepIcon.classList.add('text-amber-500');
      }
      if (typeof window.saveToWorkspace === 'function') {
        window.saveToWorkspace('laws', fac.id, fac.ministry || '관계부처', fac.facilityCategory || '법정시설', '법령 도감');
      }
      window.showStitchMobileToast(`⭐ '${fac.facilityCategory}' 내 준비함에 보관했습니다.`);
    }
  };

  window.copyCurrentLink = function () {
    const facId = window.currentStitchFacilityId || 'law-elderly';
    const baseUrl = window.location.href.split('#')[0];
    const url = `${baseUrl}#fields?facilityId=${encodeURIComponent(facId)}`;
    const copyFn = window.copyTextSafely || ((txt) => navigator.clipboard.writeText(txt));
    Promise.resolve(copyFn(url))
      .then(() => window.showStitchMobileToast('🔗 현재 시설 법정 도감 링크가 복사되었습니다.'))
      .catch(() => window.showStitchMobileToast('⚠️ 클립보드 복사 권한을 확인해 주세요.'));
  };

  window.copyLegalText = function () {
    const clause = document.getElementById('stitch-legal-clause')?.textContent?.trim() || '';
    const body = document.getElementById('stitch-legal-body')?.textContent?.trim() || '';
    const text = [clause, body].filter(Boolean).join('\n');
    const copyFn = window.copyTextSafely || ((txt) => navigator.clipboard.writeText(txt));
    Promise.resolve(copyFn(text))
      .then(() => window.showStitchMobileToast('⚖️ 근거 법령 조문이 클립보드에 복사되었습니다.'))
      .catch(() => window.showStitchMobileToast('⚠️ 클립보드 복사 권한을 확인해 주세요.'));
  };

  window.toggleFacilityDetail = function () {
    const body = document.getElementById('facility-detail-body');
    const chevron = document.getElementById('fac-chevron');
    const btn = document.getElementById('fac-detail-toggle-btn');
    if (!body) return;
    const willOpen = body.classList.contains('hidden');
    body.classList.toggle('hidden', !willOpen);
    if (chevron) chevron.classList.toggle('rotate-180', willOpen);
    if (btn) btn.setAttribute('aria-expanded', String(willOpen));
  };

  window.switchStitchFacilityTab = function (btnEl, secId) {
    const nav = document.getElementById('stitch-anchor-nav');
    if (nav) {
      const targetBtn = btnEl || nav.querySelector(`[onclick*="${secId}"]`);
      nav.querySelectorAll('.tab-btn').forEach(btn => {
        const active = (btn === targetBtn);
        btn.setAttribute('aria-selected', String(active));
        btn.className = active
          ? 'tab-btn py-2 px-1 text-center rounded-lg bg-surface-white text-on-surface font-extrabold shadow-xs transition cursor-pointer'
          : 'tab-btn py-2 px-1 text-center rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition cursor-pointer';
      });
    }
    const sec = document.getElementById(secId);
    if (sec) {
      const behavior = (typeof window.getPreferredScrollBehavior === 'function') ? window.getPreferredScrollBehavior() : 'smooth';
      sec.scrollIntoView({ behavior, block: 'start' });
    }
  };

  if (typeof window.switchTab !== 'function') {
    window.switchTab = function (arg1, arg2) {
      if (typeof arg1 === 'string' && typeof window.showView === 'function') {
        return window.showView(arg1, arg2);
      }
      return window.switchStitchFacilityTab(arg1, arg2);
    };
  }

  window.toggleServiceDetail = function (idx) {
    const detail = document.getElementById(`serv-detail-${idx}`);
    const bar = document.getElementById(`serv-bar-${idx}`);
    const chevron = document.getElementById(`serv-chevron-${idx}`);
    const card = detail ? detail.closest('[data-serv-card]') : document.querySelector(`[data-serv-card="${idx}"]`);
    const triggerBtn = card ? card.querySelector('button[aria-expanded]') : null;
    if (!detail) return;
    const willOpen = detail.classList.contains('hidden');
    detail.classList.toggle('hidden', !willOpen);
    if (bar) bar.classList.toggle('hidden', !willOpen);
    if (chevron) chevron.classList.toggle('rotate-180', willOpen);
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', String(willOpen));
  };

  window.triggerPdfPreview = function () {
    const docId = window.currentStitchDocId || 'doc-005';
    if (typeof window.viewGuidelineModal === 'function') {
      window.viewGuidelineModal(docId);
      return;
    }
    const doc = getAllArchiveDocs().find(d => d.id === docId);
    const safeUrl = (typeof window.safeExternalUrl === 'function')
      ? window.safeExternalUrl(doc && (doc.driveViewUrl || doc.driveDownloadUrl))
      : (doc && (doc.driveViewUrl || doc.driveDownloadUrl));
    if (safeUrl && safeUrl !== '#') window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  window.triggerPdfDownload = function () {
    const docId = window.currentStitchDocId || 'doc-005';
    if (typeof window.downloadGuidelineDirect === 'function') {
      window.downloadGuidelineDirect(docId);
      return;
    }
    const doc = getAllArchiveDocs().find(d => d.id === docId);
    const safeUrl = (typeof window.safeExternalUrl === 'function')
      ? window.safeExternalUrl(doc && (doc.driveDownloadUrl || doc.driveViewUrl))
      : (doc && (doc.driveDownloadUrl || doc.driveViewUrl));
    if (safeUrl && safeUrl !== '#') window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  function buildDynamicAccordionCardsHtml(fac, nodes, doc) {
    const docId = (doc && doc.id) || 'doc-001';
    const cards = [];

    if (nodes.length > 0) {
      nodes.slice(0, 5).forEach((node, idx) => {
        const num = idx + 1;
        const pad = String(num).padStart(2, '0');
        const isFirst = (idx === 0);
        const chapterLabel = (node.guidelineRef && node.guidelineRef.chapter) || node.level2 || fac.facilityCategory;
        const pageLabel = (node.guidelineRef && node.guidelineRef.page) ? `${node.guidelineRef.page}` : '지침서 본문';
        const details = Array.isArray(node.details) && node.details.length > 0
          ? node.details
          : [node.summary || '해당 법정 시설의 공식 사업안내 및 표준 실무 절차를 준용합니다.'];

        cards.push(`
          <div data-serv-card="${num}" class="bg-surface-white rounded-2xl shadow-sm border border-border-subtle/80 overflow-hidden transition-all duration-200">
            <div id="serv-bar-${num}" class="h-1.5 w-full bg-[#0051d5] ${isFirst ? '' : 'hidden'}"></div>
            <button type="button" aria-expanded="${isFirst}" aria-controls="serv-detail-${num}" onclick="toggleServiceDetail(${num})" class="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low/50 transition cursor-pointer">
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-8 h-8 rounded-xl bg-blue-subtle text-[#0051d5] font-label-md text-xs font-extrabold flex items-center justify-center shrink-0">${pad}</span>
                <div class="min-w-0">
                  <div class="text-[11px] font-label-sm text-on-surface-variant truncate">${escapeHtml(node.level1 || '핵심 법정사업')} · ${escapeHtml(node.level2 || fac.ministry)}</div>
                  <h4 class="font-headline-sm text-[15px] font-bold text-on-surface truncate">${escapeHtml(node.level3 || fac.facilityCategory)}</h4>
                </div>
              </div>
              <span id="serv-chevron-${num}" class="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0 transition-transform duration-200 ${isFirst ? 'rotate-180' : ''}">expand_more</span>
            </button>
            <div id="serv-detail-${num}" class="px-4 pb-4 pt-1 border-t border-border-subtle/60 space-y-3 ${isFirst ? '' : 'hidden'}">
              <p class="text-[13px] leading-relaxed text-on-surface-variant">${escapeHtml(node.summary || fac.note || '')}</p>
              <div class="bg-surface-bg rounded-xl p-3 border border-border-subtle/70 space-y-1.5">
                <div class="text-[11px] font-bold text-[#0051d5] flex items-center justify-between gap-2">
                  <span>📌 세부 실천 기준 (${escapeHtml(pageLabel)})</span>
                  <span class="text-[10px] text-on-surface-variant font-medium truncate">${escapeHtml(chapterLabel)}</span>
                </div>
                <ul class="text-[12px] text-on-surface space-y-1 list-disc list-inside leading-relaxed">
                  ${details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
                </ul>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-0.5">
                <button type="button" onclick="openStitchTocDrawer('${escapeJsArg(docId)}', '${escapeJsArg(node.level3)}', 'forms')" class="py-2 px-2.5 rounded-xl bg-amber-subtle/80 hover:bg-amber-subtle text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer">
                  <span class="material-symbols-outlined text-[15px]">description</span>
                  <span>표준 서식 열기</span>
                </button>
                <button type="button" onclick="openStitchTocDrawer('${escapeJsArg(docId)}', '${escapeJsArg(node.level3)}', 'all')" class="py-2 px-2.5 rounded-xl bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer">
                  <span class="material-symbols-outlined text-[15px]">menu_book</span>
                  <span>지침 원문 읽기</span>
                </button>
              </div>
            </div>
          </div>
        `);
      });
    } else {
      const orgs = [...(fac.livingFacilities || []), ...(fac.usingFacilities || [])];
      const fallbackItems = orgs.length > 0 ? orgs.slice(0, 4) : [fac.facilityCategory];
      fallbackItems.forEach((orgName, idx) => {
        const num = idx + 1;
        const pad = String(num).padStart(2, '0');
        const isFirst = (idx === 0);
        const isLiving = (fac.livingFacilities || []).includes(orgName);
        cards.push(`
          <div data-serv-card="${num}" class="bg-surface-white rounded-2xl shadow-sm border border-border-subtle/80 overflow-hidden transition-all duration-200">
            <div id="serv-bar-${num}" class="h-1.5 w-full bg-[#0051d5] ${isFirst ? '' : 'hidden'}"></div>
            <button type="button" aria-expanded="${isFirst}" aria-controls="serv-detail-${num}" onclick="toggleServiceDetail(${num})" class="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low/50 transition cursor-pointer">
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-8 h-8 rounded-xl bg-blue-subtle text-[#0051d5] font-label-md text-xs font-extrabold flex items-center justify-center shrink-0">${pad}</span>
                <div class="min-w-0">
                  <div class="text-[11px] font-label-sm text-on-surface-variant truncate">${isLiving ? '거주형 생활시설' : '통원·전담 이용기관'} · ${escapeHtml(fac.ministry)}</div>
                  <h4 class="font-headline-sm text-[15px] font-bold text-on-surface truncate">${escapeHtml(orgName)}</h4>
                </div>
              </div>
              <span id="serv-chevron-${num}" class="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0 transition-transform duration-200 ${isFirst ? 'rotate-180' : ''}">expand_more</span>
            </button>
            <div id="serv-detail-${num}" class="px-4 pb-4 pt-1 border-t border-border-subtle/60 space-y-3 ${isFirst ? '' : 'hidden'}">
              <p class="text-[13px] leading-relaxed text-on-surface-variant">${escapeHtml(fac.note || fac.articles || '관계 법령 및 공식 사업안내 지침에 따라 운영되는 법정 기관입니다.')}</p>
              <div class="grid grid-cols-2 gap-2 pt-0.5">
                <button type="button" onclick="openStitchTocDrawer('${escapeJsArg(docId)}', '${escapeJsArg(orgName)}', 'forms')" class="py-2 px-2.5 rounded-xl bg-amber-subtle/80 hover:bg-amber-subtle text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer">
                  <span class="material-symbols-outlined text-[15px]">description</span>
                  <span>표준 서식 열기</span>
                </button>
                <button type="button" onclick="openStitchTocDrawer('${escapeJsArg(docId)}', '${escapeJsArg(orgName)}', 'all')" class="py-2 px-2.5 rounded-xl bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer">
                  <span class="material-symbols-outlined text-[15px]">menu_book</span>
                  <span>지침 원문 읽기</span>
                </button>
              </div>
            </div>
          </div>
        `);
      });
    }

    const hierTarget = fac.hierarchyFacility || String(fac.facilityCategory || '').replace(/\s*\(.*?\)/g, '').trim();
    cards.push(`
      <button type="button" onclick="jumpToFacilityHierarchy('${escapeJsArg(hierTarget)}', '${escapeJsArg(fac.facilityCategory)}')" class="w-full py-2.5 px-4 rounded-xl bg-emerald-subtle hover:bg-emerald-100 text-[#00563a] border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer">
        <span>🌳 3단계 위계도감에서 전체 단위서비스(${nodes.length || 1}종) 펼쳐보기</span>
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    `);
    return cards.join('');
  }

  function snapshotDefaultElderlyShowcase() {
    if (defaultElderlySnapshot) return;
    const getHtml = (id) => document.getElementById(id)?.innerHTML ?? '';
    const getText = (id) => document.getElementById(id)?.textContent ?? '';
    defaultElderlySnapshot = {
      activePill: getText('stitch-active-fac-pill'),
      badge1: getText('stitch-fac-badge-1'),
      badge2: getText('stitch-fac-badge-2'),
      badge3: getText('stitch-fac-badge-3'),
      title: getText('stitch-fac-title'),
      en: getText('stitch-fac-en'),
      desc: getText('stitch-fac-desc'),
      icon: getText('stitch-fac-icon'),
      metricLaw: getText('stitch-metric-law'),
      metricTarget: getText('stitch-metric-target'),
      metricStaff: getText('stitch-metric-staff'),
      legalClause: getText('stitch-legal-clause'),
      legalBody: getText('stitch-legal-body'),
      equipSummary: getText('stitch-equip-summary'),
      detailBodyHtml: getHtml('facility-detail-body'),
      hierBadge: getText('stitch-hier-badge'),
      hierDesc: getText('stitch-hier-desc'),
      hierAccordionHtml: getHtml('stitch-hierarchy-accordion'),
      guideVersion: getText('stitch-guide-version'),
      guideTitle: getText('stitch-guide-title'),
      guidePublisher: getText('stitch-guide-publisher'),
      guideInfo: getText('stitch-guide-info')
    };
    const tocTree = document.getElementById('toc-tree-container');
    if (tocTree && defaultTocTreeHtml === null) {
      defaultTocTreeHtml = tocTree.innerHTML;
    }
  }

  window.selectMobileStitchFacility = function (facilityId, opts = {}) {
    snapshotDefaultElderlyShowcase();
    const fac = findFacilityRecord(facilityId) || findFacilityRecord('law-elderly');
    if (!fac) return;

    window.currentStitchFacilityId = fac.id;
    const matchedDoc = resolveArchiveDocForFacility(fac);
    window.currentStitchDocId = (matchedDoc && matchedDoc.id) || 'doc-005';

    // Sync active quick chip UI
    document.querySelectorAll('#stitch-facility-quick-chips .stitch-fac-chip').forEach(btn => {
      const targetId = btn.getAttribute('data-stitch-fac');
      const isActive = (targetId === fac.id);
      btn.setAttribute('aria-pressed', String(isActive));
      btn.className = isActive
        ? 'stitch-fac-chip px-3 py-1.5 rounded-full text-xs font-bold bg-[#00288e] text-white shadow-xs shrink-0 transition cursor-pointer'
        : 'stitch-fac-chip px-3 py-1.5 rounded-full text-xs font-medium bg-surface-white text-on-surface-variant border border-border-subtle hover:border-[#0051d5]/40 shrink-0 transition cursor-pointer';
    });

    const prepIcon = document.getElementById('prep-icon');
    if (prepIcon) {
      const isSaved = savedPrepFacilityIds.has(fac.id);
      prepIcon.style.fontVariationSettings = isSaved ? "'FILL' 1" : "'FILL' 0";
      prepIcon.classList.toggle('text-amber-500', isSaved);
    }

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    if (fac.id === 'law-elderly' && defaultElderlySnapshot) {
      setText('stitch-active-fac-pill', defaultElderlySnapshot.activePill);
      setText('stitch-fac-badge-1', defaultElderlySnapshot.badge1);
      setText('stitch-fac-badge-2', defaultElderlySnapshot.badge2);
      setText('stitch-fac-badge-3', defaultElderlySnapshot.badge3);
      setText('stitch-fac-title', defaultElderlySnapshot.title);
      setText('stitch-fac-en', defaultElderlySnapshot.en);
      setText('stitch-fac-desc', defaultElderlySnapshot.desc);
      setText('stitch-fac-icon', defaultElderlySnapshot.icon);
      setText('stitch-metric-law', defaultElderlySnapshot.metricLaw);
      setText('stitch-metric-target', defaultElderlySnapshot.metricTarget);
      setText('stitch-metric-staff', defaultElderlySnapshot.metricStaff);
      setText('stitch-legal-clause', defaultElderlySnapshot.legalClause);
      setText('stitch-legal-body', defaultElderlySnapshot.legalBody);
      setText('stitch-equip-summary', defaultElderlySnapshot.equipSummary);
      const detailBody = document.getElementById('facility-detail-body');
      if (detailBody) detailBody.innerHTML = defaultElderlySnapshot.detailBodyHtml;
      setText('stitch-hier-badge', defaultElderlySnapshot.hierBadge);
      setText('stitch-hier-desc', defaultElderlySnapshot.hierDesc);
      const acc = document.getElementById('stitch-hierarchy-accordion');
      if (acc) acc.innerHTML = defaultElderlySnapshot.hierAccordionHtml;
      setText('stitch-guide-version', defaultElderlySnapshot.guideVersion);
      setText('stitch-guide-title', defaultElderlySnapshot.guideTitle);
      setText('stitch-guide-publisher', defaultElderlySnapshot.guidePublisher);
      setText('stitch-guide-info', defaultElderlySnapshot.guideInfo);
    } else {
      const cleanCat = String(fac.facilityCategory || '').replace(/\s*\(.*?\)/g, '').trim();
      const shortTitle = fac.hierarchyFacility || cleanCat || fac.facilityCategory;
      const primaryLaw = (fac.laws && fac.laws[0]) ? fac.laws[0].replace(/[「」]/g, '') : (fac.axisGroup || '관련 개별법령');
      const living = Array.isArray(fac.livingFacilities) ? fac.livingFacilities : [];
      const using = Array.isArray(fac.usingFacilities) ? fac.usingFacilities : [];
      const matchedNodes = findHierarchyNodesForFacility(fac, matchedDoc);

      setText('stitch-active-fac-pill', shortTitle);
      setText('stitch-fac-badge-1', fac.ministry || '관계부처');
      setText('stitch-fac-badge-2', fac.tag || (fac.trackGroup || '법정 체계'));
      setText('stitch-fac-badge-3', primaryLaw);
      setText('stitch-fac-title', shortTitle);
      setText('stitch-fac-en', `${fac.facilityCategory || shortTitle} · ${fac.ministry || '소관부처'}`);
      setText('stitch-fac-desc', fac.note || fac.articles || '관계 법령 및 정부 공식 사업안내 지침에 따라 설치·운영되는 현장 시설·전달체계입니다.');
      setText('stitch-fac-icon', MATERIAL_ICON_MAP[fac.id] || 'domain');

      const shortArticle = fac.articles ? String(fac.articles).split(/[,·(]/)[0].trim() : primaryLaw;
      setText('stitch-metric-law', shortArticle || primaryLaw);
      setText('stitch-metric-target', `생활 ${living.length}종 · 이용 ${using.length}종`);
      setText('stitch-metric-staff', `${fac.ministry || '소관부처'} 배치기준`);

      setText('stitch-legal-clause', `${primaryLaw}${fac.articles ? ' · ' + fac.articles : ''}`);
      setText('stitch-legal-body', fac.note || `${fac.facilityCategory}의 설치·신고·종사자 배치 및 운영 기준을 규정한 핵심 조항입니다.`);
      setText('stitch-equip-summary', `거주·생활시설 ${living.length}유형 · 통원·이용기관 ${using.length}유형`);

      const detailBody = document.getElementById('facility-detail-body');
      if (detailBody) {
        detailBody.innerHTML = `
          <div class="space-y-3 pt-2 text-xs">
            <div class="bg-amber-subtle/50 rounded-xl p-3 border border-amber-200/70">
              <div class="font-bold text-amber-900 mb-1.5">🏠 생활시설 (거주형 · ${living.length}종)</div>
              ${living.length > 0
                ? `<ul class="space-y-1 text-on-surface-variant list-disc list-inside">${living.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
                : `<p class="text-on-surface-variant">별도 거주형 생활시설 규정 없음 (이용·전담·연계 중심)</p>`}
            </div>
            <div class="bg-blue-subtle/60 rounded-xl p-3 border border-blue-200/70">
              <div class="font-bold text-[#00288e] mb-1.5">🏢 이용시설 · 전담기관 (${using.length}종)</div>
              ${using.length > 0
                ? `<ul class="space-y-1 text-on-surface-variant list-disc list-inside">${using.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
                : `<p class="text-on-surface-variant">입소·거주형 시설 중심 운영</p>`}
            </div>
            ${(fac.laws && fac.laws.length > 0) ? `
              <div class="flex flex-wrap gap-1.5 pt-0.5">
                ${fac.laws.map(l => {
                  const cl = String(l).replace(/[「」]/g, '');
                  return `<a href="https://www.law.go.kr/LSW/lsSc.do?menuId=1&subMenuId=15&query=${encodeURIComponent(cl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-surface-white border border-border-subtle text-[11px] font-bold text-[#00288e] hover:bg-blue-subtle transition">「${escapeHtml(cl)}」 ↗</a>`;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      setText('stitch-hier-badge', `위계 연동 ${matchedNodes.length || (living.length + using.length) || 1}종`);
      setText('stitch-hier-desc', `${shortTitle} 관련 3단계 위계 서비스 · 지침서 원문 및 서식 바로가기`);
      const acc = document.getElementById('stitch-hierarchy-accordion');
      if (acc) {
        acc.innerHTML = buildDynamicAccordionCardsHtml(fac, matchedNodes, matchedDoc);
      }

      if (matchedDoc) {
        setText('stitch-guide-version', matchedDoc.edition || `${matchedDoc.year || '2026'} 정부 정본`);
        setText('stitch-guide-title', matchedDoc.title || '공식 지침서 원문');
        setText('stitch-guide-publisher', `${matchedDoc.ministry || fac.ministry}${matchedDoc.department ? ' · ' + matchedDoc.department : ''}`);
        setText('stitch-guide-info', `전체 ${matchedDoc.totalPages || 0}면 · ${matchedDoc.sizeStr || 'PDF'} · 원문 열람/목차 지원`);
      }
    }

    if (opts && opts.scrollToTop) {
      const anchor = document.getElementById('stitch-facility-topbar') || document.getElementById('stitch-facility-showcase');
      if (anchor) {
        const behavior = (typeof window.getPreferredScrollBehavior === 'function') ? window.getPreferredScrollBehavior() : 'smooth';
        anchor.scrollIntoView({ behavior, block: 'start' });
      }
    }
  };

  function buildDynamicTocTreeHtml(doc) {
    const chapters = (Array.isArray(doc.keyChapters) && doc.keyChapters.length > 0)
      ? doc.keyChapters
      : ['제1편 총칙 및 제도 개요', '제2편 설치·운영 및 인력 배치기준', '제3편 단위사업별 세부 수행 지침', '제4편 지도·점검 및 표준 서식/별표'];
    const fac = findFacilityRecord(doc.facilityTargetId) || findFacilityRecord(window.currentStitchFacilityId);
    const matchedNodes = findHierarchyNodesForFacility(fac, doc).slice(0, 6);

    const part1Html = `
      <div class="toc-part-card bg-surface-white rounded-lg shadow-sm overflow-hidden" data-toc-part="1">
        <button type="button" onclick="toggleStitchTocPart(this)" aria-expanded="true" class="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-surface-container-low/50 transition cursor-pointer">
          <div class="flex items-center gap-2 min-w-0">
            <span class="px-1.5 py-0.5 rounded bg-blue-subtle text-[#0051d5] text-[10px] font-bold shrink-0">PART 1</span>
            <span class="text-xs font-bold text-on-surface truncate">핵심 장·절 목차 (${chapters.length}개 부문)</span>
          </div>
          <span class="toc-part-chevron material-symbols-outlined text-primary text-[18px] rotate-180 transition-transform">expand_more</span>
        </button>
        <div class="toc-part-body pl-3.5 pr-1.5 py-1.5 space-y-1 bg-surface-white">
          ${chapters.map((ch, idx) => {
            const isForm = /서식|별표|양식|부록|계획|일지/.test(ch);
            const isBookmark = idx < 2;
            const kind = isForm ? 'form' : (isBookmark ? 'bookmark' : 'clause');
            return `
              <button type="button" data-toc-kind="${kind}" ${isForm ? 'data-toc-form="true"' : ''} ${isBookmark ? 'data-toc-bookmark="true"' : ''} onclick="selectStitchTocClause('${escapeJsArg(ch)}', '${escapeJsArg(doc.code || doc.id)}', this)" class="toc-clause-item w-full text-left px-2.5 py-2 rounded-lg text-xs ${idx === 0 ? 'bg-blue-subtle text-[#00288e] font-bold' : 'text-on-surface hover:bg-surface-container-low'} flex items-center justify-between gap-2 transition cursor-pointer">
                <span class="truncate">§ ${idx + 1}. ${escapeHtml(ch)}</span>
                <span class="text-[10px] text-outline shrink-0">${isForm ? '서식' : '본문'}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const part2Html = `
      <div class="toc-part-card bg-surface-white rounded-lg shadow-sm overflow-hidden" data-toc-part="2">
        <button type="button" onclick="toggleStitchTocPart(this)" aria-expanded="true" class="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-surface-container-low/50 transition cursor-pointer">
          <div class="flex items-center gap-2 min-w-0">
            <span class="px-1.5 py-0.5 rounded bg-emerald-subtle text-[#00563a] text-[10px] font-bold shrink-0">PART 2</span>
            <span class="text-xs font-bold text-on-surface truncate">3단계 위계 · 단위서비스 연계 (${matchedNodes.length || 1}건)</span>
          </div>
          <span class="toc-part-chevron material-symbols-outlined text-primary text-[18px] rotate-180 transition-transform">expand_more</span>
        </button>
        <div class="toc-part-body pl-3.5 pr-1.5 py-1.5 space-y-1 bg-surface-white">
          ${(matchedNodes.length > 0 ? matchedNodes : [{ level1: '기본 지침', level3: doc.legalTarget || doc.title, guidelineRef: { page: `전체 ${doc.totalPages || 0}면` } }]).map((node, idx) => {
            const label = node.level3 || node.level2 || doc.legalTarget;
            const pageTxt = (node.guidelineRef && node.guidelineRef.page) || '표준 서식';
            const isForm = idx % 2 === 1;
            const isBookmark = idx < 2;
            return `
              <button type="button" data-toc-kind="${isForm ? 'form' : 'clause'}" ${isForm ? 'data-toc-form="true"' : ''} ${isBookmark ? 'data-toc-bookmark="true"' : ''} onclick="selectStitchTocClause('${escapeJsArg(label)}', '${escapeJsArg(node.level1 || '위계연동')}', this)" class="toc-clause-item w-full text-left px-2.5 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container-low flex items-center justify-between gap-2 transition cursor-pointer">
                <span class="truncate">• ${escapeHtml(label)}</span>
                <span class="text-[10px] text-outline shrink-0">${escapeHtml(pageTxt)}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const part3Html = `
      <div class="toc-part-card bg-surface-white rounded-lg shadow-sm overflow-hidden" data-toc-part="3">
        <button type="button" onclick="toggleStitchTocPart(this)" aria-expanded="false" class="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-surface-container-low/50 transition cursor-pointer">
          <div class="flex items-center gap-2 min-w-0">
            <span class="px-1.5 py-0.5 rounded bg-amber-subtle text-amber-900 text-[10px] font-bold shrink-0">서식·별표</span>
            <span class="text-xs font-bold text-on-surface truncate">법정 표준 서식 · 점검표 인덱스</span>
          </div>
          <span class="toc-part-chevron material-symbols-outlined text-outline text-[18px] transition-transform">expand_more</span>
        </button>
        <div class="toc-part-body pl-3.5 pr-1.5 py-1.5 space-y-1 bg-surface-white hidden">
          <button type="button" data-toc-kind="form" data-toc-form="true" onclick="selectStitchTocClause('[서식 1] 사업 운영계획서 및 인력 배치표', '표준 서식', this)" class="toc-clause-item w-full text-left px-2.5 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container-low flex items-center justify-between gap-2 transition cursor-pointer">
            <span class="truncate">📄 [서식 1] 사업 운영계획서 및 인력 배치표</span>
            <span class="text-[10px] text-amber-800 font-bold shrink-0">서식</span>
          </button>
          <button type="button" data-toc-kind="form" data-toc-form="true" onclick="selectStitchTocClause('[별표] 시설·안전 및 이용자 인권 점검표', '법정 별표', this)" class="toc-clause-item w-full text-left px-2.5 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container-low flex items-center justify-between gap-2 transition cursor-pointer">
            <span class="truncate">📋 [별표] 시설·안전 및 이용자 인권 점검표</span>
            <span class="text-[10px] text-amber-800 font-bold shrink-0">별표</span>
          </button>
        </div>
      </div>
    `;

    return part1Html + part2Html + part3Html;
  }

  function applyStitchTocFiltering() {
    const container = document.getElementById('toc-tree-container');
    if (!container) return;
    const q = (currentTocSearch || '').trim().toLowerCase();
    const cards = container.querySelectorAll('.toc-part-card');
    let visibleItemsTotal = 0;

    cards.forEach(card => {
      const tocType = (card.getAttribute('data-toc-type') || '').toLowerCase();
      const clauseButtons = card.querySelectorAll('.toc-part-body button, button[onclick*="selectStitchTocClause"]');
      const body = card.querySelector('.toc-part-body');
      const cardText = (card.textContent || '').toLowerCase();

      if (body && clauseButtons.length > 0) {
        let matchedInPart = 0;
        clauseButtons.forEach((btn, idx) => {
          if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('toggleStitchTocPart')) return;
          const txt = (btn.textContent || '').toLowerCase();
          const isFormAttr = btn.getAttribute('data-toc-form') === 'true' || /서식|별표|양식|점검표|운영계획|부록|사례관리/.test(txt);
          const isBookmarkAttr = btn.getAttribute('data-toc-bookmark') === 'true'
            || btn.classList.contains('bg-blue-subtle')
            || /§\s*[1345]|01\.\s*총칙|인력배치|노인복지관|맞춤형|사례관리|핵심/.test(txt)
            || (tocType.includes('bookmark') && idx === 0);

          const matchTab = (currentTocTab === 'all')
            || (currentTocTab === 'forms' && isFormAttr)
            || (currentTocTab === 'bookmarks' && isBookmarkAttr);
          const matchQ = !q || txt.includes(q);
          const visible = matchTab && matchQ;

          btn.classList.toggle('hidden', !visible);
          if (visible) {
            matchedInPart++;
            visibleItemsTotal++;
          }
        });

        const activeCard = body.querySelector('#toc-active-clause-card');
        if (activeCard) {
          const activeText = (activeCard.textContent || '').toLowerCase();
          const showActive = ((currentTocTab === 'all')
            || (currentTocTab === 'bookmarks')
            || (currentTocTab === 'forms' && /서식|별표/.test(activeText)))
            && (!q || activeText.includes(q));
          activeCard.classList.toggle('hidden', !showActive);
          if (showActive) {
            matchedInPart++;
            visibleItemsTotal++;
          }
        }

        card.classList.toggle('hidden', matchedInPart === 0);
        if ((q || currentTocTab !== 'all') && matchedInPart > 0) {
          body.classList.remove('hidden');
          const chev = card.querySelector('.toc-part-chevron');
          if (chev) chev.classList.add('rotate-180');
        }
      } else {
        const isFormCard = tocType.includes('forms') || /서식|별표|부록/.test(cardText);
        const isBookmarkCard = tocType.includes('bookmark') || cardText.includes('노인복지관') || cardText.includes('맞춤형');
        const matchTab = (currentTocTab === 'all')
          || (currentTocTab === 'forms' && isFormCard)
          || (currentTocTab === 'bookmarks' && isBookmarkCard);
        const matchQ = !q || cardText.includes(q);
        const visible = matchTab && matchQ;
        card.classList.toggle('hidden', !visible);
        if (visible) visibleItemsTotal++;
      }
    });

    let emptyBanner = document.getElementById('toc-filter-empty-state');
    if (visibleItemsTotal === 0) {
      if (!emptyBanner) {
        emptyBanner = document.createElement('div');
        emptyBanner.id = 'toc-filter-empty-state';
        emptyBanner.className = 'p-6 text-center rounded-xl bg-surface-white border border-border-subtle space-y-2';
        emptyBanner.innerHTML = `
          <div class="text-xs font-bold text-on-surface">일치하는 목차 조항이 없습니다.</div>
          <button type="button" onclick="resetStitchTocClause()" class="px-3 py-1.5 rounded-lg bg-blue-subtle text-[#00288e] text-[11px] font-bold cursor-pointer">목차 필터 초기화</button>
        `;
        container.appendChild(emptyBanner);
      }
      emptyBanner.classList.remove('hidden');
    } else if (emptyBanner) {
      emptyBanner.classList.add('hidden');
    }
  }

  window.openStitchTocDrawer = function (docId, activeClause, tabMode) {
    snapshotDefaultElderlyShowcase();
    hostOverlaysOnBody();

    const targetDocId = docId || window.currentStitchDocId || 'doc-005';
    currentTocDocId = targetDocId;
    const docs = getAllArchiveDocs();
    const doc = docs.find(d => d.id === targetDocId) || docs.find(d => d.id === 'doc-005') || docs[0];

    const titleEl = document.getElementById('toc-drawer-doc-title');
    const subEl = document.getElementById('toc-drawer-doc-subtitle');
    const treeEl = document.getElementById('toc-tree-container');

    if (doc) {
      window.currentStitchDocId = doc.id;
      currentTocDocId = doc.id;
      if (titleEl) titleEl.textContent = '지침서 목차 (TOC)';
      if (subEl) {
        subEl.textContent = (doc.id === 'doc-005')
          ? '2026 노인보건복지사업안내 v26.1 공식지침'
          : `${doc.title || '공식 지침서'} · ${doc.ministry || '관계부처'} (${doc.totalPages || 0}면)`;
      }
      if (treeEl) {
        if (doc.id === 'doc-005' && defaultTocTreeHtml !== null) {
          treeEl.innerHTML = defaultTocTreeHtml;
        } else {
          treeEl.innerHTML = buildDynamicTocTreeHtml(doc);
        }
      }
    }

    const searchInput = document.getElementById('toc-search-input');
    if (searchInput) searchInput.value = '';
    currentTocSearch = '';
    window.setStitchTocTab(tabMode || 'all');

    if (activeClause) {
      const badge = (doc && (doc.code || doc.ministry)) || '선택 조항';
      window.selectStitchTocClause(activeClause, badge);
    } else if (doc && doc.id !== 'doc-005' && doc.keyChapters && doc.keyChapters[0]) {
      window.selectStitchTocClause(`§ 1. ${doc.keyChapters[0]}`, doc.code || doc.ministry || '지침서 본문');
    }

    const wrapper = document.getElementById('stitch-toc-drawer-wrapper');
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('toc-drawer');
    lastFocusedBeforeToc = document.activeElement;

    if (wrapper) wrapper.classList.remove('hidden');
    if (backdrop) {
      backdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
    if (drawer) {
      drawer.classList.remove('-translate-x-full');
      drawer.classList.add('translate-x-0');
      drawer.setAttribute('aria-hidden', 'false');
    }
    const closeBtn = document.getElementById('close-drawer-btn');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 60);
    }
  };

  window.closeStitchTocDrawer = function () {
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('toc-drawer');
    if (backdrop) {
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    }
    if (drawer) {
      drawer.classList.add('-translate-x-full');
      drawer.classList.remove('translate-x-0');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (lastFocusedBeforeToc && typeof lastFocusedBeforeToc.focus === 'function' && document.contains(lastFocusedBeforeToc)) {
      lastFocusedBeforeToc.focus();
    }
  };

  window.toggleStitchTocPart = function (btnEl) {
    if (!btnEl) return;
    const card = btnEl.closest('.toc-part-card');
    if (!card) return;
    const body = card.querySelector('.toc-part-body');
    const chev = card.querySelector('.toc-part-chevron');
    if (!body) return;
    const willOpen = body.classList.contains('hidden');
    body.classList.toggle('hidden', !willOpen);
    btnEl.setAttribute('aria-expanded', String(willOpen));
    if (chev) chev.classList.toggle('rotate-180', willOpen);
  };

  window.selectStitchTocClause = function (clauseTitle, sectionBadge, btnEl) {
    const badgeEl = document.getElementById('toc-active-section-badge');
    const titleEl = document.getElementById('toc-active-clause-title');
    const jumpInput = document.getElementById('toc-jump-input');
    const cleanTitle = String(clauseTitle || '').trim();
    const cleanBadge = String(sectionBadge || '현재 열람 위치').trim();

    if (badgeEl) badgeEl.textContent = cleanBadge;
    if (titleEl) titleEl.textContent = cleanTitle;
    if (jumpInput) jumpInput.value = cleanTitle;

    if (btnEl) {
      const container = document.getElementById('toc-tree-container');
      if (container) {
        container.querySelectorAll('button[onclick*="selectStitchTocClause"]').forEach(b => {
          b.classList.remove('bg-blue-subtle', 'text-[#00288e]', 'font-bold');
        });
      }
      btnEl.classList.add('bg-blue-subtle', 'text-[#00288e]', 'font-bold');
    }
  };

  window.filterStitchTocDrawer = function (query) {
    currentTocSearch = String(query || '').trim();
    applyStitchTocFiltering();
  };

  window.clearStitchTocSearch = function () {
    const inp = document.getElementById('toc-search-input');
    if (inp) inp.value = '';
    currentTocSearch = '';
    applyStitchTocFiltering();
  };

  window.setStitchTocTab = function (mode, btnEl) {
    currentTocTab = (mode === 'forms' || mode === 'bookmarks') ? mode : 'all';
    const tabIds = { all: 'toc-tab-all', forms: 'toc-tab-forms', bookmarks: 'toc-tab-bookmarks' };
    Object.keys(tabIds).forEach(k => {
      const btn = document.getElementById(tabIds[k]);
      if (!btn) return;
      const active = (k === currentTocTab) || (btnEl && btn === btnEl && k === currentTocTab);
      btn.setAttribute('aria-pressed', String(active));
      btn.className = active
        ? 'flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-[#00288e] text-white shadow-xs transition cursor-pointer'
        : 'flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition cursor-pointer';
    });
    applyStitchTocFiltering();
  };

  window.jumpStitchTocClause = function () {
    const jumpInput = document.getElementById('toc-jump-input');
    const clause = (jumpInput && jumpInput.value.trim())
      || document.getElementById('toc-active-clause-title')?.textContent?.trim()
      || '지침서 본문';
    window.closeStitchTocDrawer();

    const archiveView = document.getElementById('view-archive');
    if (archiveView && !archiveView.classList.contains('hidden') && typeof window.viewGuidelineModal === 'function') {
      window.viewGuidelineModal(currentTocDocId || window.currentStitchDocId || 'doc-005');
      window.showStitchMobileToast(`📑 '${clause}' 기준으로 지침서 요약을 열었습니다.`);
      return;
    }

    const targetSec = /서식|별표|단위|서비스|사례|특화|건강|일자리/.test(clause)
      ? document.getElementById('sec-hierarchy')
      : (/지침|원문|총칙/.test(clause) ? document.getElementById('sec-guidelines') : document.getElementById('sec-legal'));
    if (targetSec) {
      const behavior = (typeof window.getPreferredScrollBehavior === 'function') ? window.getPreferredScrollBehavior() : 'smooth';
      targetSec.scrollIntoView({ behavior, block: 'start' });
      if (typeof window.triggerMatchHighlight === 'function') window.triggerMatchHighlight(targetSec);
    }
    window.showStitchMobileToast(`📑 '${clause}' 위치로 본문을 이동했습니다.`);
  };

  window.resetStitchTocClause = function () {
    const inp = document.getElementById('toc-search-input');
    if (inp) inp.value = '';
    currentTocSearch = '';
    window.setStitchTocTab('all');
    const docs = getAllArchiveDocs();
    const doc = docs.find(d => d.id === currentTocDocId);
    if (currentTocDocId === 'doc-005' || !doc) {
      window.selectStitchTocClause('§ 4. 맞춤형 통합 사례관리', '제2편 > 제3장 노인복지관');
    } else {
      window.selectStitchTocClause(`§ 1. ${(doc.keyChapters && doc.keyChapters[0]) || doc.title}`, doc.code || doc.ministry || '본문');
    }
  };

  window.initMobileStitchShowcase = function () {
    if (stitchInitialized) return;
    stitchInitialized = true;
    snapshotDefaultElderlyShowcase();
    hostOverlaysOnBody();

    if (!document.getElementById('stitch-toc-input-reset')) {
      const style = document.createElement('style');
      style.id = 'stitch-toc-input-reset';
      style.textContent = '#toc-drawer input[type="search"], #toc-drawer input[type="text"] { border: 0 !important; box-shadow: none !important; outline: none !important; background: transparent !important; }';
      document.head.appendChild(style);
    }

    const jumpInput = document.getElementById('toc-jump-input');
    if (jumpInput && !jumpInput.dataset.boundJump) {
      jumpInput.dataset.boundJump = '1';
      jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.jumpStitchTocClause();
        }
      });
    }

    if (!window.__stitchTocEscBound) {
      window.__stitchTocEscBound = true;
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const gModal = document.getElementById('guideline-detail-modal') || document.getElementById('guidelineDetailModal');
        if (gModal) return;
        const tocDrawer = document.getElementById('toc-drawer');
        if (tocDrawer && tocDrawer.getAttribute('aria-hidden') === 'false') {
          e.preventDefault();
          window.closeStitchTocDrawer();
        }
      });
    }
  };
})(window, document);
