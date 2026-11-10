/**
 * 개인 준비 워크스페이스 (localStorage 기반 독립 저장 + JSON 내보내기/복원)
 * - 공용 Firestore 데이터(자동수집 공고·뉴스)를 오염시키지 않고 방문 대학생마다 독립적으로 관리
 */

const STORAGE_KEY = 'welfare_compass_workspace_v1';

const DEFAULT_WORKSPACE = {
    bookmarkedFields: [],       // ['elderly', 'medical', ...]
    bookmarkedLaws: [],         // ['law-elderly', ...]
    savedAgencies: [],          // [{ id, fieldId, name, track, memo, createdAt }]
    checklist: {},              // { 'chk-prereq': true, ... }
    jobStates: {},              // { [jobId]: { status: '서류준비', memo: '...', updatedAt } }
    customJobs: [],             // 사용자가 직접 추가한 개인 공고
    customNews: [],             // 사용자가 직접 작성한 개인 시사 브리핑 노트
    diagnosisResult: null       // 최근 실습 성향 자가진단 결과 { answers, topFields, updatedAt }
};

function readRawWorkspace() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(DEFAULT_WORKSPACE);
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_WORKSPACE,
            ...parsed,
            bookmarkedFields: Array.isArray(parsed.bookmarkedFields) ? parsed.bookmarkedFields : [],
            bookmarkedLaws: Array.isArray(parsed.bookmarkedLaws) ? parsed.bookmarkedLaws : [],
            savedAgencies: Array.isArray(parsed.savedAgencies) ? parsed.savedAgencies : [],
            checklist: parsed.checklist && typeof parsed.checklist === 'object' ? parsed.checklist : {},
            jobStates: parsed.jobStates && typeof parsed.jobStates === 'object' ? parsed.jobStates : {},
            customJobs: Array.isArray(parsed.customJobs) ? parsed.customJobs : [],
            customNews: Array.isArray(parsed.customNews) ? parsed.customNews : []
        };
    } catch (e) {
        console.warn('개인 워크스페이스 로드 실패, 기본값 사용:', e);
        return structuredClone(DEFAULT_WORKSPACE);
    }
}

let workspaceState = readRawWorkspace();
const listeners = new Set();

function persistWorkspace() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceState));
    } catch (e) {
        console.error('localStorage 저장 오류:', e);
    }
    listeners.forEach((fn) => {
        try {
            fn(workspaceState);
        } catch (err) {
            console.error('workspace listener error:', err);
        }
    });
}

export function getWorkspace() {
    return workspaceState;
}

export function subscribeWorkspace(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

// --- 분야 & 법령 북마크 ---
export function isFieldBookmarked(fieldId) {
    return workspaceState.bookmarkedFields.includes(fieldId);
}

export function toggleFieldBookmark(fieldId) {
    if (!fieldId) return false;
    const exists = workspaceState.bookmarkedFields.includes(fieldId);
    workspaceState.bookmarkedFields = exists
        ? workspaceState.bookmarkedFields.filter((id) => id !== fieldId)
        : [...workspaceState.bookmarkedFields, fieldId];
    persistWorkspace();
    return !exists;
}

export function isLawBookmarked(lawId) {
    return workspaceState.bookmarkedLaws.includes(lawId);
}

export function toggleLawBookmark(lawId) {
    if (!lawId) return false;
    const exists = workspaceState.bookmarkedLaws.includes(lawId);
    workspaceState.bookmarkedLaws = exists
        ? workspaceState.bookmarkedLaws.filter((id) => id !== lawId)
        : [...workspaceState.bookmarkedLaws, lawId];
    persistWorkspace();
    return !exists;
}

// --- 희망 실습/취업 기관 메모 저장 ---
export function addSavedAgency({ fieldId, name, track = '현장실습', memo = '' }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) return null;
    const item = {
        id: `ag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fieldId: fieldId || 'community-selfreliance',
        name: cleanName,
        track,
        memo: String(memo || '').trim(),
        createdAt: new Date().toISOString()
    };
    workspaceState.savedAgencies = [item, ...workspaceState.savedAgencies];
    persistWorkspace();
    return item;
}

export function removeSavedAgency(agencyId) {
    workspaceState.savedAgencies = workspaceState.savedAgencies.filter((a) => a.id !== agencyId);
    persistWorkspace();
}

// --- 실습 체크리스트 ---
export function getChecklistState() {
    return workspaceState.checklist;
}

export function toggleChecklistItem(itemId) {
    workspaceState.checklist = {
        ...workspaceState.checklist,
        [itemId]: !workspaceState.checklist[itemId]
    };
    persistWorkspace();
    return workspaceState.checklist[itemId];
}

// --- 실습 자가진단 저장 ---
export function saveDiagnosisResult(result) {
    workspaceState.diagnosisResult = {
        ...result,
        updatedAt: new Date().toISOString()
    };
    persistWorkspace();
}

// --- 공고별 개인 지원상태 & 메모 오버레이 ---
export function getPersonalJobState(jobId) {
    return workspaceState.jobStates[String(jobId)] || null;
}

export function setPersonalJobState(jobId, patch) {
    const key = String(jobId);
    const prev = workspaceState.jobStates[key] || {};
    const next = {
        ...prev,
        ...patch,
        updatedAt: new Date().toISOString()
    };
    // 상태가 미지정이고 메모도 비어있으면 정리
    if ((!next.status || next.status === '미지정') && !next.memo) {
        const clone = { ...workspaceState.jobStates };
        delete clone[key];
        workspaceState.jobStates = clone;
    } else {
        workspaceState.jobStates = {
            ...workspaceState.jobStates,
            [key]: next
        };
    }
    persistWorkspace();
    return next;
}

// --- 개인 직접 추가 공고 ---
export function getCustomJobs() {
    return workspaceState.customJobs;
}

export function upsertCustomJob(jobPayload) {
    const now = new Date().toISOString();
    if (jobPayload.id) {
        workspaceState.customJobs = workspaceState.customJobs.map((j) =>
            j.id === jobPayload.id ? { ...j, ...jobPayload, updatedAt: now, isCustom: true } : j
        );
    } else {
        const newJob = {
            ...jobPayload,
            id: `myjob-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            isCustom: true,
            createdAt: now,
            updatedAt: now
        };
        workspaceState.customJobs = [newJob, ...workspaceState.customJobs];
    }
    persistWorkspace();
}

export function deleteCustomJob(jobId) {
    workspaceState.customJobs = workspaceState.customJobs.filter((j) => j.id !== jobId);
    const clone = { ...workspaceState.jobStates };
    delete clone[String(jobId)];
    workspaceState.jobStates = clone;
    persistWorkspace();
}

// --- 개인 시사 브리핑 노트 ---
export function getCustomNews() {
    return workspaceState.customNews;
}

export function upsertCustomNews(newsPayload) {
    const now = new Date().toISOString();
    if (newsPayload.id) {
        workspaceState.customNews = workspaceState.customNews.map((n) =>
            n.id === newsPayload.id ? { ...n, ...newsPayload, updatedAt: now, isCustomLocal: true } : n
        );
    } else {
        const newItem = {
            ...newsPayload,
            id: `mynews-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            isCustomLocal: true,
            createdAt: now,
            updatedAt: now
        };
        workspaceState.customNews = [newItem, ...workspaceState.customNews];
    }
    persistWorkspace();
}

export function deleteCustomNews(newsId) {
    workspaceState.customNews = workspaceState.customNews.filter((n) => n.id !== newsId);
    persistWorkspace();
}

// --- 백업 내보내기 / 복원 / 초기화 ---
export function getWorkspaceBadgeCount() {
    const bmCount = workspaceState.bookmarkedFields.length + workspaceState.bookmarkedLaws.length;
    const agencyCount = workspaceState.savedAgencies.length;
    const trackedJobIds = new Set([
        ...Object.keys(workspaceState.jobStates || {}),
        ...(workspaceState.customJobs || []).map((j) => String(j.id))
    ]);
    return bmCount + agencyCount + trackedJobIds.size;
}

export function exportWorkspaceJson() {
    const blob = new Blob([JSON.stringify(workspaceState, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `welfare-compass-workspace-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importWorkspaceJson(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
        throw new Error('올바른 백업 JSON 파일이 아닙니다.');
    }
    workspaceState = {
        ...structuredClone(DEFAULT_WORKSPACE),
        ...parsed,
        bookmarkedFields: Array.isArray(parsed.bookmarkedFields) ? parsed.bookmarkedFields : [],
        bookmarkedLaws: Array.isArray(parsed.bookmarkedLaws) ? parsed.bookmarkedLaws : [],
        savedAgencies: Array.isArray(parsed.savedAgencies) ? parsed.savedAgencies : [],
        checklist: parsed.checklist && typeof parsed.checklist === 'object' ? parsed.checklist : {},
        jobStates: parsed.jobStates && typeof parsed.jobStates === 'object' ? parsed.jobStates : {},
        customJobs: Array.isArray(parsed.customJobs) ? parsed.customJobs : [],
        customNews: Array.isArray(parsed.customNews) ? parsed.customNews : []
    };
    persistWorkspace();
    return workspaceState;
}

export function resetWorkspace() {
    workspaceState = structuredClone(DEFAULT_WORKSPACE);
    persistWorkspace();
}
