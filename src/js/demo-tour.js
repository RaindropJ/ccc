/**
 * 대한민국 사회복지 현장 나침반: 75초 3대 핵심 플랫폼 자동 시연 투어 엔진
 * [12대 분야·시설 도감] ⇄ [3단계 위계 도감] ⇄ [공식 지침서 아카이브]
 * 화면 캡처 영상 녹화 및 라이브 데모 프레젠테이션 전용 자동화 시스템
 */

(function () {
    let isRunning = false;
    let isPaused = false;
    let currentStepIndex = 0;
    let tourTimer = null;

    // 가상 커서 및 오버레이 엘리먼트 생성
    function ensureTourDOMElements() {
        if (document.getElementById('tour-virtual-cursor')) return;

        // 1. 가상 마우스 커서
        const cursor = document.createElement('div');
        cursor.id = 'tour-virtual-cursor';
        cursor.className = 'fixed z-[999999] pointer-events-none transition-all ease-out duration-300 transform -translate-x-1 -translate-y-1 hidden';
        cursor.innerHTML = `
            <svg class="w-8 h-8 drop-shadow-lg filter" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 2L11 26L16 16L26 11L3 2Z" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <div id="tour-cursor-ripple" class="absolute -top-3 -left-3 w-12 h-12 rounded-full border-4 border-emerald-400 opacity-0 transition-all pointer-events-none"></div>
        `;
        document.body.appendChild(cursor);

        // 2. 하단 시네마틱 자막 컨트롤 바
        const bar = document.createElement('div');
        bar.id = 'tour-caption-bar';
        bar.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[999998] w-[92%] max-w-3xl bg-slate-950/90 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700/80 transition-all duration-300 hidden';
        bar.innerHTML = `
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-red-600 text-white text-[11px] font-black animate-pulse">● REC</span>
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider" id="tour-step-badge">DEMO TOUR</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] text-slate-400 font-num" id="tour-time-counter">00:00 / 01:15</span>
                        <button type="button" id="tour-pause-btn" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold transition">일시정지</button>
                        <button type="button" id="tour-stop-btn" class="px-2.5 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-bold transition">종료(ESC)</button>
                    </div>
                </div>
                <div class="space-y-1">
                    <h4 class="text-sm sm:text-base font-black text-white leading-snug tracking-tight" id="tour-caption-title">3대 플랫폼 자동 시연을 시작합니다</h4>
                    <p class="text-xs text-slate-300 leading-normal" id="tour-caption-desc">마우스 커서의 동선과 화면 전환 인터랙션을 녹화하실 수 있습니다.</p>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                    <div id="tour-progress-fill" class="bg-gradient-to-r from-blue-500 via-emerald-400 to-teal-300 h-1.5 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
            </div>
        `;
        document.body.appendChild(bar);

        // 이벤트 바인딩
        document.getElementById('tour-stop-btn').addEventListener('click', stopTour);
        document.getElementById('tour-pause-btn').addEventListener('click', togglePauseTour);
    }

    // 커서 이동 애니메이션
    function moveCursorTo(targetElement, duration = 800, callback) {
        const cursor = document.getElementById('tour-virtual-cursor');
        if (!cursor) return;

        cursor.classList.remove('hidden');

        if (!targetElement) {
            if (callback) setTimeout(callback, duration);
            return;
        }

        const rect = targetElement.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        cursor.style.transitionDuration = `${duration}ms`;
        cursor.style.left = `${targetX}px`;
        cursor.style.top = `${targetY}px`;

        setTimeout(() => {
            if (callback) callback();
        }, duration);
    }

    // 커서 클릭 파동 이펙트
    function triggerCursorClick(targetElement, callback) {
        const ripple = document.getElementById('tour-cursor-ripple');
        if (ripple) {
            ripple.style.transform = 'scale(0.5)';
            ripple.style.opacity = '1';
            void ripple.offsetWidth;
            ripple.style.transform = 'scale(2.2)';
            ripple.style.opacity = '0';
        }

        if (targetElement) {
            if (typeof window.triggerMatchHighlight === 'function') {
                window.triggerMatchHighlight(targetElement);
            }
            targetElement.click();
        }

        setTimeout(() => {
            if (callback) callback();
        }, 500);
    }

    // 자막 및 진행률 업데이트
    function updateTourCaption(stepTitle, stepDesc, progressPercent, stepBadge = '시연 진행중') {
        const titleEl = document.getElementById('tour-caption-title');
        const descEl = document.getElementById('tour-caption-desc');
        const fillEl = document.getElementById('tour-progress-fill');
        const badgeEl = document.getElementById('tour-step-badge');

        if (titleEl) titleEl.innerHTML = stepTitle;
        if (descEl) descEl.innerHTML = stepDesc;
        if (fillEl) fillEl.style.width = `${progressPercent}%`;
        if (badgeEl) badgeEl.innerText = stepBadge;
    }

    // 시연 투어 시나리오 (총 8개 시퀀스, 약 75초)
    const TOUR_STEPS = [
        // 1. 시설도감 인트로 & 스크롤
        {
            timeSec: 8,
            title: "🏛️ [1/8] 12대 분야·시설 도감: 대한민국 24개 복지분야 법정시설 총람",
            desc: "생활(거주)시설과 이용(통원)시설의 법적 분류체계를 한눈에 비교하는 공식 기관 도감입니다.",
            action: (next) => {
                showView('fields');
                window.scrollTo({ top: 180, behavior: 'smooth' });
                setTimeout(() => {
                    const tableContainer = document.getElementById('fields-table-container');
                    moveCursorTo(tableContainer, 1200, next);
                }, 1000);
            }
        },
        // 2. 부처별 원클릭 필터 클릭
        {
            timeSec: 9,
            title: "🏛️ [2/8] 원클릭 부처 필터: 보건복지부 소관 시설 즉시 압축",
            desc: "단 한 번의 클릭으로 보건복지부 소관 10개 핵심 법정 시설군만 즉각 필터링합니다.",
            action: (next) => {
                const btn = document.querySelector('#fields-ministry-filters button[data-ministry="보건복지부"]');
                if (btn) {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    moveCursorTo(btn, 1000, () => {
                        triggerCursorClick(btn, () => {
                            setTimeout(next, 1200);
                        });
                    });
                } else {
                    next();
                }
            }
        },
        // 3. 안내 배너 호버 후 노인복지관 클릭
        {
            timeSec: 10,
            title: "💡 [3/8] 시설명 인터랙티브 안내 & 위계도감 직결 클릭",
            desc: "점선 밑줄이 들어간 시설명을 클릭하면, 해당 기관이 수행하는 법정 기능 및 사업 위계도감으로 즉시 직결됩니다.",
            action: (next) => {
                const targetRow = document.getElementById('facility-row-law-elderly');
                if (targetRow) {
                    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        // 노인복지관 버튼 찾기
                        const btn = Array.from(targetRow.querySelectorAll('button')).find(b => b.innerText.includes('노인복지관')) || targetRow.querySelector('button');
                        if (btn) {
                            moveCursorTo(btn, 1200, () => {
                                triggerCursorClick(btn, () => {
                                    setTimeout(next, 1500);
                                });
                            });
                        } else {
                            next();
                        }
                    }, 600);
                } else {
                    next();
                }
            }
        },
        // 4. 3단계 위계도감 맞춤 배너 및 Breadcrumb Hover 시연
        {
            timeSec: 13,
            title: "🌳 [4/8] 3단계 위계도감: 노인복지관 맞춤 기능 및 Breadcrumb 계층 점등",
            desc: "소분류 행에 마우스를 올리면, 좌측의 [1단계 실천분야]와 [2단계 대분류(기능)]가 동시에 환하게 점등되어 소속 맥락을 완벽히 인지합니다.",
            action: (next) => {
                setTimeout(() => {
                    const rows = document.querySelectorAll('#hierarchicalMatrixTable tbody tr.domain-row');
                    if (rows && rows.length >= 2) {
                        const targetRow1 = rows[0];
                        const targetRow2 = rows[Math.min(2, rows.length - 1)];

                        moveCursorTo(targetRow1, 1000, () => {
                            targetRow1.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                            setTimeout(() => {
                                moveCursorTo(targetRow2, 1200, () => {
                                    targetRow2.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                                    setTimeout(next, 2000);
                                });
                            }, 1800);
                        });
                    } else {
                        next();
                    }
                }, 800);
            }
        },
        // 5. 종합사회복지관 3대 기능 매트릭스 전환
        {
            timeSec: 10,
            title: "🏢 [5/8] 종합사회복지관 3대 기능: 사례관리 · 서비스제공 · 지역조직화 전수 매트릭스",
            desc: "교수님이 강조하신 3대 기능과 22개 단위서비스(Intake, 사례회의, 주민조직화)가 체계적으로 펼쳐집니다.",
            action: (next) => {
                window.scrollTo({ top: 300, behavior: 'smooth' });
                const tabBtn = document.querySelector('.domain-tab-btn[onclick*="community"]');
                if (tabBtn) {
                    moveCursorTo(tabBtn, 900, () => {
                        triggerCursorClick(tabBtn, () => {
                            setTimeout(next, 2000);
                        });
                    });
                } else {
                    if (typeof window.selectDomainFilter === 'function') {
                        window.selectDomainFilter('community', null);
                    }
                    setTimeout(next, 2000);
                }
            }
        },
        // 6. 단위서비스 ➔ 공식 지침서 아카이브 직결
        {
            timeSec: 11,
            title: "📁 [6/8] 공식 지침서 아카이브 직결: 2026 사회복지관 운영안내 원문 매칭",
            desc: "단위서비스 우측의 [지침서 열람] 버튼을 누르면, 2026년도 보건복지부 공식 정본 지침서 행으로 번쩍이며 1초 만에 점프합니다.",
            action: (next) => {
                const intakeRow = document.querySelector('#hierarchicalMatrixTable tbody tr.domain-row');
                if (intakeRow) {
                    intakeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const gBtn = intakeRow.querySelector('button[onclick*="jumpToArchive"]') || intakeRow.querySelector('button');
                    if (gBtn) {
                        moveCursorTo(gBtn, 1000, () => {
                            triggerCursorClick(gBtn, () => {
                                setTimeout(next, 2200);
                            });
                        });
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            }
        },
        // 7. 지침서 상세 모달창 오픈 및 서식 확인
        {
            timeSec: 9,
            title: "📖 [7/8] 지침서 즉시열람 모달: 발간연도, 분량, 관할 법령, 핵심 수록 서식",
            desc: "실무 현장의 종사자와 실습생이 매일 참조하는 정부 공인 업무처리지침 원문 정보를 한눈에 열람합니다.",
            action: (next) => {
                const highlightedRow = document.querySelector('.guideline-row.ring-4, .guideline-row') || document.querySelector('.guideline-row');
                if (highlightedRow) {
                    highlightedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const viewBtn = Array.from(highlightedRow.querySelectorAll('button')).find(b => b.innerText.includes('즉시열람')) || highlightedRow.querySelector('button');
                    if (viewBtn) {
                        moveCursorTo(viewBtn, 1000, () => {
                            triggerCursorClick(viewBtn, () => {
                                setTimeout(next, 2000);
                            });
                        });
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            }
        },
        // 8. 3대 체계 순환 완결 및 복귀
        {
            timeSec: 8,
            title: "🔄 [8/8] 3대 플랫폼 완벽 순환: [시설도감] ⇄ [위계도감] ⇄ [지침서]",
            desc: "모달에서 위계도감 해당 노드로 복귀하고 다시 시설도감으로 이어지는 완벽한 3각 양방향 연동을 실현했습니다.",
            action: (next) => {
                const modal = document.getElementById('guidelineDetailModal');
                if (modal) {
                    const jumpBtn = modal.querySelector('button[onclick*="showView(\'hierarchy\'"]');
                    if (jumpBtn) {
                        moveCursorTo(jumpBtn, 900, () => {
                            triggerCursorClick(jumpBtn, () => {
                                setTimeout(() => {
                                    // 위계도감에서 다시 시설도감으로 복귀 버튼 클릭
                                    const backToFieldBtn = document.querySelector('button[onclick*="jumpToFacility"]') || document.querySelector('button[onclick*="jumpToFacilityByTerm"]');
                                    if (backToFieldBtn) {
                                        moveCursorTo(backToFieldBtn, 900, () => {
                                            triggerCursorClick(backToFieldBtn, () => {
                                                setTimeout(next, 1500);
                                            });
                                        });
                                    } else {
                                        showView('fields');
                                        setTimeout(next, 1500);
                                    }
                                }, 1200);
                            });
                        });
                    } else {
                        showView('fields');
                        next();
                    }
                } else {
                    showView('fields');
                    next();
                }
            }
        }
    ];

    // 투어 루프 실행기
    function runNextStep() {
        if (!isRunning || isPaused) return;

        if (currentStepIndex >= TOUR_STEPS.length) {
            finishTour();
            return;
        }

        const step = TOUR_STEPS[currentStepIndex];
        const progress = Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100);

        updateTourCaption(step.title, step.desc, progress, `STEP ${currentStepIndex + 1}/${TOUR_STEPS.length}`);

        step.action(() => {
            currentStepIndex++;
            tourTimer = setTimeout(runNextStep, 500);
        });
    }

    // 투어 시작
    window.startAutoDemoTour = function () {
        ensureTourDOMElements();
        isRunning = true;
        isPaused = false;
        currentStepIndex = 0;

        const cursor = document.getElementById('tour-virtual-cursor');
        const bar = document.getElementById('tour-caption-bar');
        if (cursor) cursor.classList.remove('hidden');
        if (bar) bar.classList.remove('hidden');

        // 시작 시 화면 최상단 시설도감으로 초기화
        showView('fields');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        runNextStep();
    };

    // 일시정지 토글
    function togglePauseTour() {
        isPaused = !isPaused;
        const pauseBtn = document.getElementById('tour-pause-btn');
        if (pauseBtn) {
            pauseBtn.innerText = isPaused ? '이어보기 ▶' : '일시정지';
            pauseBtn.className = isPaused 
                ? 'px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition'
                : 'px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold transition';
        }
        if (!isPaused) {
            runNextStep();
        }
    }

    // 투어 정상 종료
    function finishTour() {
        isRunning = false;
        updateTourCaption(
            "🎉 75초 3대 핵심 플랫폼 시연 투어가 완결되었습니다!", 
            "이제 화면 캡처 영상을 저장하시거나, 사이트의 각 도감과 지침서를 직접 자유롭게 조작해 보세요.", 
            100, 
            "시연 완결"
        );
        setTimeout(stopTour, 4000);
    }

    // 투어 강제 중지
    function stopTour() {
        isRunning = false;
        isPaused = false;
        if (tourTimer) clearTimeout(tourTimer);

        const cursor = document.getElementById('tour-virtual-cursor');
        const bar = document.getElementById('tour-caption-bar');
        if (cursor) cursor.classList.add('hidden');
        if (bar) bar.classList.add('hidden');

        const modal = document.getElementById('guidelineDetailModal');
        if (modal) modal.remove();
    }

    // ESC 키로 투어 즉시 중지
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isRunning) {
            stopTour();
        }
    });

})();
