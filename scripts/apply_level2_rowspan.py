import re

with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Replace renderDesktopTableRows
old_render_part = """            Object.keys(level1Groups).forEach(l1Key => {
                const l1Nodes = level1Groups[l1Key];
                const level1Rowspan = l1Nodes.length;
                let isFirstRowOfL1 = true;

                l1Nodes.forEach(node => {
                    const rowId = `hierarchy-node-${node.id}`;
                    const searchKeywords = `${domainMeta.short} ${node.level1} ${node.level2} ${node.level3} ${(node.details || []).join(' ')} ${(node.guidelineRef && node.guidelineRef.file) || ''}`.toLowerCase();

                    html += `<tr id="${rowId}" class="domain-row group hover:bg-surface-container-low transition-colors" data-domain="${domainMeta.key}" data-keywords="${searchKeywords}">`;

                    // 1열: 실천분야 및 법적근거 (Rowspan)
                    if (isFirstRowOfDomain) {
                        html += `
                            <td class="align-top p-space-md bg-surface-container-lowest font-headline-sm text-headline-sm text-primary font-bold" rowspan="${domainRowspan}">
                                <div class="sticky top-36 flex flex-col gap-space-xs">
                                    <div class="inline-flex items-center gap-space-xs text-primary">
                                        <span class="material-symbols-outlined text-[22px]">${domainMeta.icon}</span>
                                        <span>${domainMeta.short}</span>
                                    </div>
                                    <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm w-fit font-bold font-num">
                                        ${domainMeta.badge}
                                    </span>
                                    <div class="font-legal-code text-legal-code text-on-surface-variant flex flex-col gap-0.5 mt-space-xs">
                                        ${domainMeta.legal}
                                    </div>
                                </div>
                            </td>
                        `;
                        isFirstRowOfDomain = false;
                    }

                    // 2열: 2단계 대분류 (기능) (Rowspan)
                    if (isFirstRowOfL1) {
                        html += `
                            <td class="align-top p-space-md bg-surface-container-low font-headline-sm text-headline-sm text-on-surface font-bold" rowspan="${level1Rowspan}">
                                <div class="flex flex-col gap-space-xs">
                                    <span class="text-primary font-extrabold flex items-center gap-1">
                                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                                        ${node.level1}
                                    </span>
                                    <span class="font-legal-code text-legal-code text-on-surface-variant font-normal">
                                        ${node.facilityType || '법정 실천기준'}
                                    </span>
                                </div>
                            </td>
                        `;
                        isFirstRowOfL1 = false;
                    }

                    // 3열: 3단계 중분류 (사업분야)
                    html += `
                        <td class="align-top p-space-md font-label-md text-label-md text-on-surface font-semibold bg-surface-container-lowest">
                            ${node.level2}
                        </td>
                    `;

                    // 4열: 소분류 (사업 및 세부내용)
                    const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];
                    html += `
                        <td class="align-top p-space-md text-on-surface font-body-sm text-body-sm leading-relaxed bg-surface-container-lowest">
                            <div class="font-bold text-on-surface mb-1">${node.level3}</div>
                            <ul class="space-y-1">
                                ${bullets.map(b => `
                                    <li class="flex items-start gap-1.5">
                                        <span class="text-primary mt-1 text-[10px]">●</span>
                                        <span>${b}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </td>
                    `;

                    // 5열: 공식지침서 / 법정서식
                    const gRef = node.guidelineRef || { file: '공식 업무안내', chapter: '사업안내', page: '', archiveId: 'doc-004' };
                    const cleanFile = gRef.file.replace(/\\.(pdf|hwp|hwpx|xlsx)$/i, '').replace(/^[0-9]+_/, '');
                    const shortFile = cleanFile.length > 18 ? cleanFile.slice(0, 18) + '…' : cleanFile;
                    const cleanChapter = (gRef.chapter || '').split('(')[0].replace(/^[ⅠⅡⅢⅣ0-9\\.\\-\\s]+/, '').trim();
                    const formText = cleanChapter ? cleanChapter.slice(0, 16) : '법정서식 수록';

                    html += `
                        <td class="align-top p-space-md text-center bg-surface-container-lowest">
                            <div class="flex flex-col items-center gap-1 font-legal-code text-legal-code text-on-surface-variant">
                                <span class="font-bold text-on-surface" title="${gRef.file}">${shortFile}</span>
                                <span class="px-space-xs py-0.5 rounded bg-surface-container text-primary font-medium">${formText}</span>
                                <span class="font-num">${gRef.page || ''}</span>
                                <button 
                                    type="button" 
                                    onclick="window.jumpToArchive('${gRef.archiveId || 'doc-004'}')" 
                                    class="mt-1 inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer" 
                                    title="${gRef.file} 원문 열람"
                                >
                                    <span>지침서 열람</span>
                                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        </td>
                    `;

                    html += `</tr>`;
                });
            });"""

new_render_part = """            Object.keys(level1Groups).forEach(l1Key => {
                const l1Nodes = level1Groups[l1Key];
                const level1Rowspan = l1Nodes.length;
                let isFirstRowOfL1 = true;

                // Group by level2 (중분류 Rowspan 병합)
                const level2Groups = {};
                const level2Order = [];
                l1Nodes.forEach(n => {
                    if (!level2Groups[n.level2]) {
                        level2Groups[n.level2] = [];
                        level2Order.push(n.level2);
                    }
                    level2Groups[n.level2].push(n);
                });

                level2Order.forEach(l2Key => {
                    const l2Nodes = level2Groups[l2Key];
                    const level2Rowspan = l2Nodes.length;
                    let isFirstRowOfL2 = true;

                    l2Nodes.forEach(node => {
                        const rowId = `hierarchy-node-${node.id}`;
                        const searchKeywords = `${domainMeta.short} ${node.level1} ${node.level2} ${node.level3} ${(node.details || []).join(' ')} ${(node.guidelineRef && node.guidelineRef.file) || ''}`.toLowerCase();

                        html += `<tr id="${rowId}" class="domain-row group hover:bg-surface-container-low transition-colors" data-domain="${domainMeta.key}" data-keywords="${searchKeywords}">`;

                        // 1열: 실천분야 및 법적근거 (Rowspan)
                        if (isFirstRowOfDomain) {
                            html += `
                                <td class="align-top p-space-md bg-surface-container-lowest font-headline-sm text-headline-sm text-primary font-bold border-r border-outline-variant/30" rowspan="${domainRowspan}">
                                    <div class="sticky top-36 flex flex-col gap-space-xs">
                                        <div class="inline-flex items-center gap-space-xs text-primary">
                                            <span class="material-symbols-outlined text-[22px]">${domainMeta.icon}</span>
                                            <span>${domainMeta.short}</span>
                                        </div>
                                        <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm w-fit font-bold font-num">
                                            ${domainMeta.badge}
                                        </span>
                                        <div class="font-legal-code text-legal-code text-on-surface-variant flex flex-col gap-0.5 mt-space-xs">
                                            ${domainMeta.legal}
                                        </div>
                                    </div>
                                </td>
                            `;
                            isFirstRowOfDomain = false;
                        }

                        // 2열: 2단계 대분류 (기능) (Rowspan)
                        if (isFirstRowOfL1) {
                            html += `
                                <td class="align-top p-space-md bg-surface-container-low font-headline-sm text-headline-sm text-on-surface font-bold border-r border-outline-variant/30" rowspan="${level1Rowspan}">
                                    <div class="flex flex-col gap-space-xs">
                                        <span class="text-primary font-extrabold flex items-center gap-1">
                                            <span class="w-2 h-2 rounded-full bg-primary"></span>
                                            ${node.level1}
                                        </span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-normal">
                                            ${node.facilityType || '법정 실천기준'}
                                        </span>
                                    </div>
                                </td>
                            `;
                            isFirstRowOfL1 = false;
                        }

                        // 3열: 3단계 중분류 (사업분야) (Rowspan 계층 병합)
                        if (isFirstRowOfL2) {
                            html += `
                                <td class="align-top p-space-md font-label-md text-label-md text-on-surface font-semibold bg-surface-container-lowest border-r border-outline-variant/30" rowspan="${level2Rowspan}">
                                    <div class="flex flex-col gap-1.5">
                                        <span class="text-on-surface font-bold text-[14px] leading-snug">${node.level2}</span>
                                        ${level2Rowspan > 1 ? `<span class="inline-flex items-center gap-1 w-fit text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold font-num"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>${level2Rowspan}개 세부사업</span>` : ''}
                                    </div>
                                </td>
                            `;
                            isFirstRowOfL2 = false;
                        }

                        // 4열: 소분류 (사업 및 세부내용)
                        const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];
                        html += `
                            <td class="align-top p-space-md text-on-surface font-body-sm text-body-sm leading-relaxed bg-surface-container-lowest border-r border-outline-variant/30">
                                <div class="font-bold text-on-surface mb-1">${node.level3}</div>
                                <ul class="space-y-1">
                                    ${bullets.map(b => `
                                        <li class="flex items-start gap-1.5">
                                            <span class="text-primary mt-1 text-[10px]">●</span>
                                            <span>${b}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </td>
                        `;

                        // 5열: 공식지침서 / 법정서식
                        const gRef = node.guidelineRef || { file: '공식 업무안내', chapter: '사업안내', page: '', archiveId: 'doc-004' };
                        const cleanFile = gRef.file.replace(/\\.(pdf|hwp|hwpx|xlsx)$/i, '').replace(/^[0-9]+_/, '');
                        const shortFile = cleanFile.length > 18 ? cleanFile.slice(0, 18) + '…' : cleanFile;
                        const cleanChapter = (gRef.chapter || '').split('(')[0].replace(/^[ⅠⅡⅢⅣ0-9\\.\\-\\s]+/, '').trim();
                        const formText = cleanChapter ? cleanChapter.slice(0, 16) : '법정서식 수록';

                        html += `
                            <td class="align-top p-space-md text-center bg-surface-container-lowest">
                                <div class="flex flex-col items-center gap-1 font-legal-code text-legal-code text-on-surface-variant">
                                    <span class="font-bold text-on-surface" title="${gRef.file}">${shortFile}</span>
                                    <span class="px-space-xs py-0.5 rounded bg-surface-container text-primary font-medium">${formText}</span>
                                    <span class="font-num">${gRef.page || ''}</span>
                                    <button 
                                        type="button" 
                                        onclick="window.jumpToArchive('${gRef.archiveId || 'doc-004'}')" 
                                        class="mt-1 inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer" 
                                        title="${gRef.file} 원문 열람"
                                    >
                                        <span>지침서 열람</span>
                                        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>
                                </div>
                            </td>
                        `;

                        html += `</tr>`;
                    });
                });
            });"""

if old_render_part in code:
    code = code.replace(old_render_part, new_render_part)
    print("✓ Successfully replaced renderDesktopTableRows with Level 2 Rowspan!")
else:
    print("✗ Could not find exact old_render_part")

# 2. Update applyFilters to re-render for perfect rowspan preservation
old_filter = """    function applyFilters() {
        const rows1 = document.querySelectorAll('#hierarchicalMatrixTable tbody tr.domain-row');
        const rows2 = document.querySelectorAll('#hierarchicalMatrixTable2 tbody tr.domain-row');
        const mobileCards = document.querySelectorAll('#mobileCardsContainer > div');

        const sec1Card = document.getElementById('section1Container');
        const sec2Card = document.getElementById('section2Container');

        let matchedCount = 0;

        // Helper filter function
        const matchRow = (row) => {
            const d = row.getAttribute('data-domain');
            const k = (row.getAttribute('data-keywords') || '') + ' ' + row.innerText.toLowerCase();

            // Ministry match
            let minMatch = true;
            if (currentMinistryGroup === 'mohw') {
                minMatch = ['community', 'elder', 'disabled', 'child', 'infant', 'mental', 'crisis'].includes(d);
            } else if (currentMinistryGroup === 'mogef') {
                minMatch = ['family', 'youth'].includes(d);
            } else if (currentMinistryGroup === 'moe') {
                minMatch = ['school'].includes(d);
            } else if (currentMinistryGroup === 'moel') {
                minMatch = ['selfhelp'].includes(d);
            } else if (currentMinistryGroup === 'civic') {
                minMatch = ['donation'].includes(d);
            }

            // Domain match
            let domMatch = (currentDomainFilter === 'all') || (d === currentDomainFilter);

            // Search keyword match
            let kwMatch = !currentSearchKeyword || k.includes(currentSearchKeyword);

            return minMatch && domMatch && kwMatch;
        };

        let sec1HasVisible = false;
        rows1.forEach(row => {
            if (matchRow(row)) {
                row.style.display = '';
                sec1HasVisible = true;
                matchedCount++;
            } else {
                row.style.display = 'none';
            }
        });

        let sec2HasVisible = false;
        rows2.forEach(row => {
            if (matchRow(row)) {
                row.style.display = '';
                sec2HasVisible = true;
                matchedCount++;
            } else {
                row.style.display = 'none';
            }
        });

        mobileCards.forEach(card => {
            if (matchRow(card)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        if (sec1Card) sec1Card.style.display = sec1HasVisible ? '' : 'none';
        if (sec2Card) sec2Card.style.display = sec2HasVisible ? '' : 'none';

        // Update tag count
        const tag = document.getElementById('displayCountTag');
        if (tag) {
            if (currentDomainFilter === 'all' && currentMinistryGroup === 'all' && !currentSearchKeyword) {
                tag.textContent = '전체 12개 실천분야 / 167개 법정단위서비스 수록';
            } else {
                tag.textContent = `선택 필터 표시 중 (${matchedCount}개 단위서비스)`;
            }
        }
    }"""

new_filter = """    function applyFilters() {
        const allNodes = getDB().nodes;

        const matchNode = (node) => {
            const domainMeta = DOMAIN_MAP[node.domainId] || { key: 'misc', short: node.domainId };
            const d = domainMeta.key;

            // Ministry match
            let minMatch = true;
            if (currentMinistryGroup === 'mohw') {
                minMatch = ['community', 'elder', 'disabled', 'child', 'infant', 'mental', 'crisis'].includes(d);
            } else if (currentMinistryGroup === 'mogef') {
                minMatch = ['family', 'youth'].includes(d);
            } else if (currentMinistryGroup === 'moe') {
                minMatch = ['school'].includes(d);
            } else if (currentMinistryGroup === 'moel') {
                minMatch = ['selfhelp'].includes(d);
            } else if (currentMinistryGroup === 'civic') {
                minMatch = ['donation'].includes(d);
            }

            // Domain match
            let domMatch = (currentDomainFilter === 'all') || (d === currentDomainFilter);

            // Search keyword match
            const k = `${domainMeta.short} ${node.level1} ${node.level2} ${node.level3} ${(node.details || []).join(' ')} ${(node.guidelineRef && node.guidelineRef.file) || ''}`.toLowerCase();
            let kwMatch = !currentSearchKeyword || k.includes(currentSearchKeyword);

            return minMatch && domMatch && kwMatch;
        };

        const filteredNodes = allNodes.filter(matchNode);

        // Re-render Section 1 table
        const tbody1 = document.querySelector('#hierarchicalMatrixTable tbody');
        if (tbody1) {
            tbody1.innerHTML = renderDesktopTableRows(filteredNodes, SECTION_1_KEYS);
        }

        // Re-render Section 2 table
        const tbody2 = document.querySelector('#hierarchicalMatrixTable2 tbody');
        if (tbody2) {
            tbody2.innerHTML = renderDesktopTableRows(filteredNodes, SECTION_2_KEYS);
        }

        // Re-render mobile cards
        const mobContainer = document.getElementById('mobileCardsContainer');
        if (mobContainer) {
            mobContainer.innerHTML = renderMobileCards(filteredNodes);
        }

        const sec1Card = document.getElementById('section1Container');
        const sec2Card = document.getElementById('section2Container');
        const sec1HasVisible = filteredNodes.some(n => SECTION_1_KEYS.includes(n.domainId));
        const sec2HasVisible = filteredNodes.some(n => SECTION_2_KEYS.includes(n.domainId));

        if (sec1Card) sec1Card.style.display = sec1HasVisible ? '' : 'none';
        if (sec2Card) sec2Card.style.display = sec2HasVisible ? '' : 'none';

        // Update tag count
        const tag = document.getElementById('displayCountTag');
        if (tag) {
            if (currentDomainFilter === 'all' && currentMinistryGroup === 'all' && !currentSearchKeyword) {
                tag.textContent = `전체 12개 실천분야 / ${allNodes.length}개 법정단위서비스 수록`;
            } else {
                tag.textContent = `선택 필터 표시 중 (${filteredNodes.length}개 단위서비스)`;
            }
        }
    }"""

if old_filter in code:
    code = code.replace(old_filter, new_filter)
    print("✓ Successfully replaced applyFilters with re-rendering engine!")
else:
    print("✗ Could not find exact old_filter")

with open('src/js/hierarchy.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("Updated src/js/hierarchy.js")
