with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Sub-nav tabs: add flex-nowrap to container and flex-shrink-0 to tabs
target_subnav = 'flex items-center gap-1 overflow-x-auto no-scrollbar py-1" id="sub-nav-tabs">'
replace_subnav = 'flex items-center gap-1.5 overflow-x-auto flex-nowrap no-scrollbar py-1" id="sub-nav-tabs">'

if target_subnav in text:
    text = text.replace(target_subnav, replace_subnav)
    print("Patched sub-nav-tabs container with flex-nowrap!")

# Ensure subnav-tab has flex-shrink-0
text = text.replace('class="subnav-tab px-3 py-1.5', 'class="subnav-tab flex-shrink-0 px-3 py-1.5')

# 2. Patch internship source buttons url fallback
target_intern_sources = """                // Sources link buttons
                const sourcesList = item.sources && item.sources.length > 0
                    ? item.sources
                    : [{ platform: item.sourcePlatform || '공식공고', badge: '공고 원문 ↗', url: item.url }];"""

replace_intern_sources = """                // Sources link buttons
                const sourcesList = (item.sources && item.sources.length > 0
                    ? item.sources
                    : [{ platform: item.sourcePlatform || '공식공고', badge: '공고 원문 ↗', url: item.url }])
                    .map(s => {
                        let finalUrl = s.url || 'https://job.alio.go.kr/recruit.do';
                        if (!finalUrl.startsWith('http')) finalUrl = 'https://job.alio.go.kr/recruit.do';
                        return { ...s, url: finalUrl };
                    });"""

if target_intern_sources in text:
    text = text.replace(target_intern_sources, replace_intern_sources)
    print("Patched internship sourcesList URL sanitizer!")

# 3. Patch practicum facility type & field filter in renderPracticumCards
target_filter = """                    } else if (currentPracField === '기타') {
                        matchField = fType.includes('기타');
                    } else {
                        matchField = fType.includes(currentPracField) || pField.includes(currentPracField);
                    }"""

replace_filter = """                    } else if (currentPracField === '기타') {
                        matchField = fType.includes('기타');
                    } else if (currentPracField === '지역사회복지관' || currentPracField === '종합사회복지관') {
                        matchField = fullText.includes('복지관') || fullText.includes('종합') || fullText.includes('지역사회') || fullText.includes('사례관리');
                    } else if (currentPracField === '노인복지') {
                        matchField = fullText.includes('노인') || fullText.includes('어르신') || fullText.includes('요양') || fullText.includes('데이케어') || fullText.includes('시니어');
                    } else if (currentPracField === '아동·청소년') {
                        matchField = fullText.includes('아동') || fullText.includes('청소년') || fullText.includes('지역아동') || fullText.includes('보육');
                    } else if (currentPracField === '의료사회복지') {
                        matchField = fullText.includes('의료') || fullText.includes('병원') || fullText.includes('정신건강') || fullText.includes('재활');
                    } else {
                        matchField = fType.includes(currentPracField) || pField.includes(currentPracField) || fullText.includes(currentPracField.toLowerCase());
                    }"""

if target_filter in text:
    text = text.replace(target_filter, replace_filter)
    print("Patched practicum quiz fields in renderPracticumCards!")

# 4. Patch addWorkspaceItem alert to showToast
target_add_ws = """            setWorkspaceItems(items);
            alert(`⭐ '${institution}' 준비함에 추가되었습니다!`);
            toggleWorkspaceDrawer();"""

replace_add_ws = """            setWorkspaceItems(items);
            showToast(`⭐ '${institution}' 항목이 내 준비함에 저장되었습니다!`);"""

if target_add_ws in text:
    text = text.replace(target_add_ws, replace_add_ws)
    print("Patched addWorkspaceItem alert to showToast!")

target_exists_ws = """            if (exists) {
                alert(`⭐ 이미 '${institution}' 항목이 준비함에 보관되어 있습니다!`);
                return;
            }"""

replace_exists_ws = """            if (exists) {
                showToast(`ℹ️ 이미 '${institution}' 항목이 준비함에 보관되어 있습니다.`);
                return;
            }"""

if target_exists_ws in text:
    text = text.replace(target_exists_ws, replace_exists_ws)
    print("Patched exists workspace alert to showToast!")

# Add showToast definition if not present
if 'function showToast(' not in text:
    toast_code = """
        function showToast(msg) {
            let toast = document.getElementById('app-global-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'app-global-toast';
                toast.className = 'fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-xl bg-slate-900/95 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700/50 flex items-center gap-2 transform transition-all duration-300 translate-y-12 opacity-0 pointer-events-none';
                document.body.appendChild(toast);
            }
            toast.innerText = msg;
            toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
            toast.classList.add('translate-y-0', 'opacity-100');
            
            const badge = document.getElementById('nav-bookmark-count');
            if (badge) {
                badge.classList.add('scale-125', 'bg-emerald-500', 'text-white');
                setTimeout(() => {
                    badge.classList.remove('scale-125', 'bg-emerald-500', 'text-white');
                }, 300);
            }

            clearTimeout(window.__toastTimer);
            window.__toastTimer = setTimeout(() => {
                toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 2500);
        }
    """
    # Insert before </script>
    text = text.replace('function setWorkspaceItems', toast_code + '\n        function setWorkspaceItems')
    print("Added showToast function to index.html!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("index.html successfully updated!")
