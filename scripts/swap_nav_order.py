# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# sub-nav-tabs swap
old_subnav = """                <a href="#" onclick="showView('fields'); return false;" data-view="fields" class="subnav-tab flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-white border border-slate-200/90 whitespace-nowrap shadow-2xs cursor-pointer transition">12대 분야·시설 도감</a>
                
                <a href="#" onclick="showView('archive'); return false;" data-view="archive" class="subnav-tab flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
                    <span>공식 지침서 아카이브</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-num">53</span>
                </a>

                <a href="#" onclick="showView('hierarchy'); return false;" data-view="hierarchy" class="subnav-tab flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
                    <span>3단계 위계 도감</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-num">90</span>
                </a>"""

new_subnav = """                <a href="#" onclick="showView('fields'); return false;" data-view="fields" class="subnav-tab flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-white border border-slate-200/90 whitespace-nowrap shadow-2xs cursor-pointer transition">12대 분야·시설 도감</a>

                <a href="#" onclick="showView('hierarchy'); return false;" data-view="hierarchy" class="subnav-tab flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
                    <span>3단계 위계 도감</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-num">90</span>
                </a>
                
                <a href="#" onclick="showView('archive'); return false;" data-view="archive" class="subnav-tab flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition">
                    <span>공식 지침서 아카이브</span>
                    <span class="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-num">53</span>
                </a>"""

assert old_subnav in text, "old_subnav not found in index.html"
text = text.replace(old_subnav, new_subnav)

# dropdown swap
old_dropdown = """                            <a href="#" onclick="showView('fields'); return false;" class="flex items-center gap-2 px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer">
                                <span>🏛️ 12대 분야·시설 도감</span>
                            </a>
                            <a href="#" onclick="showView('archive'); return false;" class="flex items-center justify-between px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold border-t border-slate-100 cursor-pointer">
                                <span>📁 공식 지침서 아카이브</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold font-num text-[10px]">53</span>
                            </a>
                            <a href="#" onclick="showView('hierarchy'); return false;" class="flex items-center justify-between px-3.5 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold border-t border-slate-100 cursor-pointer">
                                <span>🌳 3단계 위계 도감</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold font-num text-[10px]">90</span>
                            </a>"""

new_dropdown = """                            <a href="#" onclick="showView('fields'); return false;" class="flex items-center gap-2 px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold cursor-pointer">
                                <span>🏛️ 12대 분야·시설 도감</span>
                            </a>
                            <a href="#" onclick="showView('hierarchy'); return false;" class="flex items-center justify-between px-3.5 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold border-t border-slate-100 cursor-pointer">
                                <span>🌳 3단계 위계 도감</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold font-num text-[10px]">90</span>
                            </a>
                            <a href="#" onclick="showView('archive'); return false;" class="flex items-center justify-between px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold border-t border-slate-100 cursor-pointer">
                                <span>📁 공식 지침서 아카이브</span>
                                <span class="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold font-num text-[10px]">53</span>
                            </a>"""

assert old_dropdown in text, "old_dropdown not found in index.html"
text = text.replace(old_dropdown, new_dropdown)

# mobile-subnav-menu swap
old_mobile = """            <button type="button" onclick="showView('fields'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between">
                <span>🏛️ 12대 분야·시설 도감</span>
            </button>
            <button type="button" onclick="showView('archive'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-blue-50 text-blue-700 flex items-center justify-between">
                <span>📁 공식 지침서 아카이브</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold font-num">53건</span>
            </button>
            <button type="button" onclick="showView('hierarchy'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center justify-between">
                <span>🌳 3단계 위계 도감</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-num">90건</span>
            </button>"""

new_mobile = """            <button type="button" onclick="showView('fields'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between">
                <span>🏛️ 12대 분야·시설 도감</span>
            </button>
            <button type="button" onclick="showView('hierarchy'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center justify-between">
                <span>🌳 3단계 위계 도감</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-num">90건</span>
            </button>
            <button type="button" onclick="showView('archive'); document.getElementById('mobile-subnav-menu').classList.add('hidden');" class="w-full text-left py-2 px-3 rounded-lg hover:bg-blue-50 text-blue-700 flex items-center justify-between">
                <span>📁 공식 지침서 아카이브</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold font-num">53건</span>
            </button>"""

assert old_mobile in text, "old_mobile not found in index.html"
text = text.replace(old_mobile, new_mobile)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated index.html successfully!")


# 2. Update stitch_welfare_hierarchy.html
with open('stitch_welfare_hierarchy.html', 'r', encoding='utf-8') as f:
    s_hier = f.read()

old_s_hier = '<a class="text-on-surface-variant hover:text-primary font-label-md text-label-md py-space-xs transition-colors inline-flex items-center gap-1 group" data-path="official-guidelines" href="#" title="공식 지침서 아카이브 화면(SCREEN_2)으로 바로 이동"><span class="material-symbols-outlined text-[16px] text-secondary group-hover:text-primary transition-colors">auto_stories</span><span>공식 지침서 아카이브(53)</span></a><a class="text-primary font-bold border-b-2 border-primary font-label-md text-label-md py-space-xs transition-colors inline-flex items-center gap-1" data-path="statutory-hierarchy" href="#"><span class="material-symbols-outlined text-[16px] text-primary">account_tree</span><span>3단계 위계 도감(90)</span></a>'

new_s_hier = '<a class="text-primary font-bold border-b-2 border-primary font-label-md text-label-md py-space-xs transition-colors inline-flex items-center gap-1" data-path="statutory-hierarchy" href="#"><span class="material-symbols-outlined text-[16px] text-primary">account_tree</span><span>3단계 위계 도감(90)</span></a><a class="text-on-surface-variant hover:text-primary font-label-md text-label-md py-space-xs transition-colors inline-flex items-center gap-1 group" data-path="official-guidelines" href="#" title="공식 지침서 아카이브 화면(SCREEN_2)으로 바로 이동"><span class="material-symbols-outlined text-[16px] text-secondary group-hover:text-primary transition-colors">auto_stories</span><span>공식 지침서 아카이브(53)</span></a>'

if old_s_hier in s_hier:
    s_hier = s_hier.replace(old_s_hier, new_s_hier)
    with open('stitch_welfare_hierarchy.html', 'w', encoding='utf-8') as f:
        f.write(s_hier)
    print("Updated stitch_welfare_hierarchy.html successfully!")


# 3. Update stitch_guidelines_archive.html
with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    s_arch = f.read()

old_s_arch_drop = '<a class="flex items-start gap-2.5 px-3.5 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface" data-path="guidelines-archive" href="#"><span class="material-symbols-outlined text-primary text-[18px] mt-0.5">folder_open</span><div><div class="font-label-sm text-label-sm text-on-surface">공식 지침서 아카이브</div><div class="text-legal-code font-legal-code text-outline">53종 일괄 다운로드</div></div></a><a class="flex items-start gap-2.5 px-3.5 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface" data-path="hierarchy-map" href="#"><span class="material-symbols-outlined text-secondary text-[18px] mt-0.5">account_tree</span><div><div class="font-label-sm text-label-sm text-on-surface">3단계 위계 도감</div><div class="text-legal-code font-legal-code text-outline">90개 법정단위 서비스</div></div></a>'

new_s_arch_drop = '<a class="flex items-start gap-2.5 px-3.5 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface" data-path="hierarchy-map" href="#"><span class="material-symbols-outlined text-secondary text-[18px] mt-0.5">account_tree</span><div><div class="font-label-sm text-label-sm text-on-surface">3단계 위계 도감</div><div class="text-legal-code font-legal-code text-outline">90개 법정단위 서비스</div></div></a><a class="flex items-start gap-2.5 px-3.5 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface" data-path="guidelines-archive" href="#"><span class="material-symbols-outlined text-primary text-[18px] mt-0.5">folder_open</span><div><div class="font-label-sm text-label-sm text-on-surface">공식 지침서 아카이브</div><div class="text-legal-code font-legal-code text-outline">53종 일괄 다운로드</div></div></a>'

if old_s_arch_drop in s_arch:
    s_arch = s_arch.replace(old_s_arch_drop, new_s_arch_drop)
    with open('stitch_guidelines_archive.html', 'w', encoding='utf-8') as f:
        f.write(s_arch)
    print("Updated stitch_guidelines_archive.html successfully!")
