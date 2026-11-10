import { COLLECTIONS, ensureAnonymousAuth, subscribeCollection } from './firebase-config.js';
import { initTheme, toggleDarkMode } from './theme.js';
import { subscribeWorkspace } from './storage.js';
import {
    setFieldsNavigator,
    setFieldsViewMode,
    toggleMinistryComparisonHub,
    openAndScrollToMinistryHub,
    setMinistryFilter,
    setNatureFilter,
    handleFieldsSearch,
    renderFieldsView,
    openFieldDetailModal,
    closeFieldDetailModal,
    toggleFieldBookmarkAndRender,
    toggleLawBookmarkAndRender,
    jumpFromField
} from './fields.js';
import {
    setPracticumNavigator,
    setPracticumFieldFilter,
    setPracticumAvailabilityFilter,
    setPracticumTermFilter,
    setPracticumPostingFieldFilter,
    setPracticumRegionGroup,
    setPracticumRegion,
    setPracticumSubRegion,
    setPracticumFeeFilter,
    setPracticumPage,
    resetPracticumPostingsFilters,
    handlePracticumSearch,
    setPracticumQuickKeyword,
    savePracticumPostingToWorkspace,
    selectDiagnosisAnswer,
    calculateAndSaveDiagnosis,
    resetDiagnosis,
    renderPracticumView,
    renderPracticumPostings,
    renderPracticumChecklistAndPortals,
    togglePracticumChecklistAndRender,
    togglePracticumBookmarkAndRender,
    promptSavePracticumAgency,
    jumpToPracticumPostingField,
    setPracticumSubTab
} from './practicum.js';
import {
    initResidencyView,
    renderResidencyView,
    setResidencyTrack,
    setResidencyRegion,
    handleResidencySearch
} from './residency.js';
import {
    setJobsNavigator,
    setJobsData,
    getJobsCount,
    setJobFieldFilter,
    setJobTrackFilter,
    setJobRegionGroup,
    setJobSubRegion,
    setJobPage,
    handleJobSearch,
    setJobQuickKeyword,
    resetJobFilters,
    openJobDetailModal,
    closeJobDetailModal,
    openJobModal,
    closeJobModal,
    deleteMyJobItem,
    updatePersonalJobStatus,
    renderJobsView,
    initJobsHandlers
} from './jobs.js';
import {
    setNewsData,
    getNewsCount,
    setNewsFieldFilter,
    setNewsCategoryFilter,
    setNewsHashtagFilter,
    renderNewsHashtags,
    handleNewsSearch,
    openEditorialArticleModal,
    closeEditorialArticleModal,
    handleEditorialClap,
    toggleEditorialBookmark,
    adjustEditorialFontSize,
    submitModalHelpful,
    submitModalComment,
    copyNewsNoteById,
    openNewsModal,
    closeNewsModal,
    deleteMyNewsItem,
    renderNews,
    initNewsHandlers
} from './news.js';
import {
    setWorkspaceNavigator,
    updateWorkspaceBadge,
    openWorkspaceDrawer,
    closeWorkspaceDrawer,
    setDrawerTab,
    openMemoEditor,
    closeMemoEditor,
    saveActiveMemo,
    deleteActiveMemo
} from './workspace.js';
import './pdf-binder.js';

function updateHeaderCounters() {
    const jobsCountEl = document.getElementById('hub-jobs-count');
    const newsCountEl = document.getElementById('hub-news-count');
    if (jobsCountEl) jobsCountEl.innerText = getJobsCount().toLocaleString();
    if (newsCountEl) newsCountEl.innerText = String(getNewsCount());
    updateWorkspaceBadge();
}

export function showView(viewId, options = {}) {
    document.querySelectorAll('.view-section').forEach((el) => el.classList.add('hidden'));
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) targetSection.classList.remove('hidden');

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
    const mobilePanel = document.getElementById('mobile-nav-panel');
    if (mobilePanel) mobilePanel.classList.add('hidden');

    // Update 5-tab desktop buttons style
    const tabIds = ['fields', 'practicum', 'residency', 'jobs', 'news'];
    tabIds.forEach((tId) => {
        const btn = document.getElementById(`nav-btn-${tId}`);
        if (!btn) return;
        if (tId === viewId) {
            btn.className = 'px-3 py-2 rounded-xl text-blue-600 bg-blue-50/70 border border-blue-200 font-extrabold flex items-center gap-1 transition';
        } else {
            btn.className = 'px-3 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition';
        }
    });

    if (viewId === 'fields') {
        renderFieldsView();
        if (options.fieldId) {
            openFieldDetailModal(options.fieldId);
        }
        if (options.ministry) {
            setMinistryFilter(options.ministry);
        }
    } else if (viewId === 'practicum') {
        if (options.fieldId) {
            setPracticumFieldFilter(options.fieldId);
            setPracticumPostingFieldFilter(options.fieldId);
        }
        const targetSubTab = options.subTab || 'postings';
        setPracticumSubTab(targetSubTab);
        renderPracticumView();
    } else if (viewId === 'residency') {
        if (options.track) {
            setResidencyTrack(options.track);
        }
        if (options.region) {
            setResidencyRegion(options.region);
        }
        renderResidencyView();
    } else if (viewId === 'jobs') {
        if (options.fieldId) {
            setJobFieldFilter(options.fieldId);
        }
        if (options.trackFilter) {
            setJobTrackFilter(options.trackFilter);
        }
        renderJobsView();
    } else if (viewId === 'news') {
        if (options.fieldId) {
            setNewsFieldFilter(options.fieldId);
        }
        renderNews();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function subscribePublicFeedData() {
    subscribeCollection(COLLECTIONS.JOBS, (items) => {
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setJobsData(items);
        updateHeaderCounters();
        if (!document.getElementById('view-jobs')?.classList.contains('hidden')) {
            renderJobsView();
        }
    });

    subscribeCollection(COLLECTIONS.NEWS, (items) => {
        items.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
        setNewsData(items);
        updateHeaderCounters();
        if (!document.getElementById('view-news')?.classList.contains('hidden')) {
            renderNews();
        }
    });
}

// Global exports for HTML onclick handlers
window.showView = showView;
window.switchTab = (tabId, options) => showView(tabId, options);
window.toggleDarkMode = toggleDarkMode;
window.toggleDrawer = (open) => {
    if (open) openWorkspaceDrawer();
    else closeWorkspaceDrawer();
};
window.toggleMobileNav = () => {
    const p = document.getElementById('mobile-nav-panel');
    if (p) p.classList.toggle('hidden');
};

// View 1: 분야와 법령
window.setFieldsViewMode = setFieldsViewMode;
window.toggleMinistryComparisonHub = toggleMinistryComparisonHub;
window.openAndScrollToMinistryHub = openAndScrollToMinistryHub;
window.setMinistryFilter = setMinistryFilter;
window.setNatureFilter = setNatureFilter;
window.handleFieldsSearch = handleFieldsSearch;
window.openFieldDetailModal = openFieldDetailModal;
window.closeFieldDetailModal = closeFieldDetailModal;
window.toggleFieldBookmarkAndRender = toggleFieldBookmarkAndRender;
window.toggleLawBookmarkAndRender = toggleLawBookmarkAndRender;
window.jumpFromField = jumpFromField;

// View 2: 현장실습 자가탐색
window.setPracticumSubTab = setPracticumSubTab;
window.setPracticumFieldFilter = setPracticumFieldFilter;
window.setPracticumAvailabilityFilter = setPracticumAvailabilityFilter;
window.setPracticumTermFilter = setPracticumTermFilter;
window.setPracticumPostingFieldFilter = setPracticumPostingFieldFilter;
window.setPracticumRegionGroup = setPracticumRegionGroup;
window.setPracticumRegion = setPracticumRegion;
window.setPracticumSubRegion = setPracticumSubRegion;
window.setPracticumFeeFilter = setPracticumFeeFilter;
window.setPracticumPage = setPracticumPage;
window.resetPracticumPostingsFilters = resetPracticumPostingsFilters;
window.handlePracticumSearch = handlePracticumSearch;
window.setPracticumQuickKeyword = setPracticumQuickKeyword;
window.savePracticumPostingToWorkspace = savePracticumPostingToWorkspace;
window.selectDiagnosisAnswer = selectDiagnosisAnswer;
window.calculateAndSaveDiagnosis = calculateAndSaveDiagnosis;
window.resetDiagnosis = resetDiagnosis;
window.togglePracticumChecklistAndRender = togglePracticumChecklistAndRender;
window.toggleChecklistItemAndRender = togglePracticumChecklistAndRender; // alias
window.togglePracticumBookmarkAndRender = togglePracticumBookmarkAndRender;
window.jumpToPracticumPostingField = jumpToPracticumPostingField;

// View 3: 수련처 탐색
window.setResidencyTrack = setResidencyTrack;
window.setResidencyRegion = setResidencyRegion;
window.handleResidencySearch = handleResidencySearch;

// View 4: 인턴·취업처 75선
window.setJobFieldFilter = setJobFieldFilter;
window.setJobTrackFilter = setJobTrackFilter;
window.setJobRegionGroup = setJobRegionGroup;
window.setJobSubRegion = setJobSubRegion;
window.setJobPage = setJobPage;
window.handleJobSearch = handleJobSearch;
window.setJobQuickKeyword = setJobQuickKeyword;
window.resetJobFilters = resetJobFilters;
window.openJobDetailModal = openJobDetailModal;
window.closeJobDetailModal = closeJobDetailModal;
window.openJobModal = openJobModal;
window.closeJobModal = closeJobModal;
window.deleteMyJobItem = deleteMyJobItem;
window.updatePersonalJobStatus = updatePersonalJobStatus;

// View 5: 복지 뉴스·브리핑
window.setNewsFieldFilter = setNewsFieldFilter;
window.setNewsCategoryFilter = setNewsCategoryFilter;
window.setNewsHashtagFilter = setNewsHashtagFilter;
window.handleNewsSearch = handleNewsSearch;
window.openEditorialArticleModal = openEditorialArticleModal;
window.closeEditorialArticleModal = closeEditorialArticleModal;
window.handleEditorialClap = handleEditorialClap;
window.clapEditorialArticle = handleEditorialClap; // alias
window.toggleEditorialBookmark = toggleEditorialBookmark;
window.adjustEditorialFontSize = adjustEditorialFontSize;
window.submitModalHelpful = submitModalHelpful;
window.submitModalComment = submitModalComment;
window.copyNewsNoteById = copyNewsNoteById;
window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;
window.deleteMyNewsItem = deleteMyNewsItem;

// 내 준비함 (마이 워크스페이스)
window.openWorkspaceDrawer = openWorkspaceDrawer;
window.closeWorkspaceDrawer = closeWorkspaceDrawer;
window.setDrawerTab = setDrawerTab;
window.openMemoEditor = openMemoEditor;
window.closeMemoEditor = closeMemoEditor;
window.saveActiveMemo = saveActiveMemo;
window.deleteActiveMemo = deleteActiveMemo;

async function initApp() {
    initTheme();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const p = document.getElementById('mobile-nav-panel');
            if (p) p.classList.toggle('hidden');
        });
    }

    setFieldsNavigator(showView);
    setPracticumNavigator(showView);
    setJobsNavigator(showView);
    setWorkspaceNavigator(showView);

    initResidencyView();
    initJobsHandlers(() => updateHeaderCounters());
    initNewsHandlers(() => updateHeaderCounters());

    subscribeWorkspace(() => {
        updateHeaderCounters();
        if (!document.getElementById('view-fields')?.classList.contains('hidden')) {
            renderFieldsView();
        }
        if (!document.getElementById('view-practicum')?.classList.contains('hidden')) {
            renderPracticumView();
        }
        if (!document.getElementById('view-residency')?.classList.contains('hidden')) {
            renderResidencyView();
        }
        if (!document.getElementById('view-jobs')?.classList.contains('hidden')) {
            renderJobsView();
        }
        if (!document.getElementById('view-news')?.classList.contains('hidden')) {
            renderNews();
        }
    });

    // 실시간 스크롤 리딩 프로그레스 바 연동
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPos = window.scrollY;
        const percent = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;
        const bar = document.getElementById('reading-progress-bar');
        if (bar) {
            bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
        }
    }, { passive: true });

    // 첫 진입 화면: 법령·분야별 기관 도감
    showView('fields');
    updateHeaderCounters();

    await ensureAnonymousAuth();
    subscribePublicFeedData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
