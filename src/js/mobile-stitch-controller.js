/**
 * ==============================================================================
 * 대한민국 사회복지 현장 나침반: 모바일 3대 화면 동적 인터랙션 & 데이터 바인딩 모듈
 * (12대 분야·시설 도감 / 3단계 위계 도감 & 바텀시트 인스펙터 / 공식 지침서 아카이브)
 * Google Stitch Mobile Component Controller (Material Design 3 & Local-First)
 * ==============================================================================
 */

(function (window, document) {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. 12대 분야·시설 도감 모바일 인터랙션 (Mobile Fields Interaction)
  // ----------------------------------------------------------------------------
  let currentMobileMinistry = '전체';
  let currentMobileSearchQuery = '';

  // 실시간 키워드 검색
  window.handleMobileSearch = function(query) {
    currentMobileSearchQuery = (query || '').trim().toLowerCase();
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) clearBtn.classList.toggle('hidden', currentMobileSearchQuery.length === 0);
    
    // 데스크톱 검색창과도 동기화
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

  // 검색어 초기화
  window.clearMobileSearch = function() {
    const input = document.getElementById('mobile-field-search');
    if (input) input.value = '';
    window.handleMobileSearch('');
  };

  // 소관부처 횡스크롤 필터 알약 선택
  window.filterByMinistry = function(ministry) {
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

  // 분야 카드 필터링 및 카운트 동기화 (자체 폴백)
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

  // 전체 카드 펼치기/접기
  window.toggleAllCards = function(shouldOpen) {
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
    chevrons.forEach(icon => icon.style.transform = shouldOpen ? 'rotate(180deg)' : 'rotate(0deg)');
  };


  // ----------------------------------------------------------------------------
  // 2. 3단계 위계 도감 & 바텀시트 인스펙터 (Mobile Hierarchy & Inspector)
  // ----------------------------------------------------------------------------

  // 하단 바텀시트 인스펙터 접기/펼치기 토글
  window.toggleMobileInspector = function() {
    const content = document.getElementById('inspector-content');
    const label = document.querySelector('#inspector-toggle-label span');
    const icon = document.getElementById('inspector-toggle-icon');
    if (!content) return;

    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      if (label) label.textContent = '접기';
      if (icon) { icon.textContent = '▼'; icon.style.transform = 'rotate(0deg)'; }
    } else {
      content.classList.add('hidden');
      if (label) label.textContent = '펼치기';
      if (icon) { icon.textContent = '▲'; icon.style.transform = 'rotate(180deg)'; }
    }
  };

  // 소분류 단위시설 선택 시 하단 인스펙터 실시간 데이터 바인딩 (핵심 3대 플랫폼 집중 규칙 반영)
  window.inspectFacilityDetail = function(facilityData) {
    if (!facilityData) return;
    const inspector = document.getElementById('mobile-hierarchy-inspector');
    const content = document.getElementById('inspector-content');
    if (!inspector || !content) return;

    const isLiving = facilityData.isLiving;
    const cleanSearchName = (facilityData.name || '').replace(/\s*\(.*?\)/g, '').trim();
    const matchedGuidelineName = facilityData.matchedGuideline || '2026 사회복지시설 관리안내';
    const guidelineSearchKey = matchedGuidelineName.split('[')[0].replace('.pdf', '').trim();

    content.innerHTML = `
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded ${isLiving ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'} text-[10px] font-bold">
            ${facilityData.facilityType || (isLiving ? '생활시설 (거주형 24h)' : '이용시설 (통원형)')}
          </span>
          <span class="text-[11px] text-slate-500 font-medium">${facilityData.department || '보건복지부'}</span>
        </div>
        <h4 class="text-base font-black text-slate-900 mt-1">${facilityData.name || '선택된 법정 시설·서비스'}</h4>
        <div class="text-[11px] text-emerald-700 font-semibold mt-0.5">✔ 법적근거: ${facilityData.legalBasis || '사회복지사업법 제34조의5'}</div>
      </div>

      <div class="bg-amber-50 rounded-xl p-3 border border-amber-200/80 text-xs">
        <div class="font-extrabold text-amber-950 flex items-center gap-1.5 mb-1">
          <span>⚡</span><span>법정 배치기준 & 3대 핵심 실천과업</span>
        </div>
        <div class="text-[11px] text-amber-900 leading-relaxed space-y-1">
          ${facilityData.staffCriteria || '사회복지사업법 시행규칙 제11조 및 해당 분야 국가공식 사업안내 기준을 준용합니다.'}
        </div>
      </div>

      <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-lg flex-shrink-0">📖</span>
          <div class="min-w-0">
            <div class="text-[10px] text-slate-500 font-medium">정부 공식 지침서 1:1 매칭</div>
            <div class="text-xs font-extrabold text-slate-900 truncate" title="${matchedGuidelineName}">${matchedGuidelineName}</div>
          </div>
        </div>
        <button type="button" onclick="showView('archive', {search: '${escapeHtml(guidelineSearchKey)}'})" 
                class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition flex-shrink-0 shadow-2xs cursor-pointer">
          <span>원문 열람 ➔</span>
        </button>
      </div>

      <!-- 핵심 3대 실무 플랫폼 집중 2단 그리드 버튼 (지침서 아카이브 ⇄ 12대 분야 시설도감) -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <button type="button" onclick="showView('archive', {search: '${escapeHtml(cleanSearchName)}'})" 
                class="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center hover:bg-blue-100 transition cursor-pointer">
          <div class="text-[10px] text-blue-600 font-bold">70종 정본 아카이브</div>
          <div class="text-[11px] text-blue-900 font-extrabold">공식 지침서 열람 ➔</div>
        </button>
        <button type="button" onclick="showView('fields', {search: '${escapeHtml(cleanSearchName)}'})" 
                class="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center hover:bg-indigo-100 transition cursor-pointer">
          <div class="text-[10px] text-indigo-600 font-bold">34개 법정 시설분류</div>
          <div class="text-[11px] text-indigo-900 font-extrabold">12대 분야도감 대조 ➔</div>
        </button>
      </div>
    `;

    // 인스펙터 보이기 및 펼치기
    content.classList.remove('hidden');
    const label = document.querySelector('#inspector-toggle-label span');
    if (label) label.textContent = '접기';
    const icon = document.getElementById('inspector-toggle-icon');
    if (icon) { icon.textContent = '▼'; icon.style.transform = 'rotate(0deg)'; }
  };

  // 모바일 위계트리 특정 노드 선택
  window.selectMobileHierarchyNode = function(nodeId) {
    if (typeof window.WELFARE_HIERARCHY_NODES === 'undefined') return;
    const node = window.WELFARE_HIERARCHY_NODES.find(n => n.id === nodeId);
    if (!node) return;

    // 전체 아이템 선택 해제
    document.querySelectorAll('.mobile-hierarchy-item').forEach(el => {
      el.className = 'mobile-hierarchy-item p-2.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 flex items-center justify-between cursor-pointer transition select-none';
      const badge = el.querySelector('.item-status-badge');
      if (badge) {
        badge.className = 'px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium flex-shrink-0 item-status-badge';
        badge.textContent = '분석 ➔';
      }
    });

    // 선택된 아이템 강조
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
      staffCriteria: (node.details && node.details.length > 0) ? node.details.map(d => '• ' + d).join('<br>') : (node.summary || '공식 실천 기준을 준용합니다.'),
      matchedGuideline: node.guidelineRef ? `${node.guidelineRef.file} [${node.guidelineRef.page || '전문'}]` : '2026 사회복지시설 관리안내'
    };

    window.inspectFacilityDetail(facilityData);
  };

  // 모바일 위계 도감 상태 관리 및 실시간 교차 필터링
  let currentHierarchyDomain = 'all';
  let currentHierarchyQuery = '';

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

  // 모바일 위계 도감 실시간 검색
  window.handleMobileHierarchySearch = function(query) {
    currentHierarchyQuery = (query || '').trim().toLowerCase();
    applyMobileHierarchyFilter();
  };

  // 모바일 위계 도감 분야 필터 알약
  window.filterMobileHierarchyByDomain = function(domainId, btn) {
    currentHierarchyDomain = domainId || 'all';
    const pills = document.querySelectorAll('#mobile-hierarchy-domain-pills .mobile-hierarchy-pill');
    pills.forEach(p => {
      p.className = 'mobile-hierarchy-pill px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex-shrink-0 cursor-pointer';
    });
    if (btn) {
      btn.className = 'mobile-hierarchy-pill px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white flex-shrink-0 cursor-pointer shadow-2xs';
    }
    applyMobileHierarchyFilter();
  };


  // ----------------------------------------------------------------------------
  // 3. 공식 지침서 아카이브 모바일 인터랙션 (Mobile Archive Interaction)
  // ----------------------------------------------------------------------------
  let currentArchiveYear = '전체';
  let currentArchiveMinistry = '전체';
  let currentArchiveSearch = '';

  window.handleMobileArchiveSearch = function(query) {
    currentArchiveSearch = (query || '').trim().toLowerCase();
    filterAndRenderMobileArchive();
  };

  window.filterArchiveByYear = function(year, buttonElement) {
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

  window.filterArchiveByMinistry = function(ministry, buttonElement) {
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

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})(window, document);
