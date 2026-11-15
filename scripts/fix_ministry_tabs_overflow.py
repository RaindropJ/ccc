# -*- coding: utf-8 -*-

# 1. Update src/js/hierarchy.js
with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text_h = f.read()

old_block_h = """                            <!-- 부처 탭 -->
                            <div class="flex items-center gap-1.5 pb-space-xs border-b border-surface-container-low overflow-x-auto whitespace-nowrap no-scrollbar" id="ministryGroupTabs">
                                <button type="button" class="ministry-btn active px-space-md py-space-xs rounded-lg font-label-sm text-label-sm font-bold transition-all bg-primary text-on-primary shadow-sm flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('all', this)">
                                    <span class="material-symbols-outlined text-[16px]">apps</span>
                                    <span>전체 부처 (12대 분야 · 167개 단위)</span>
                                </button>
                                <button type="button" class="ministry-btn px-space-md py-space-xs rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mohw', this)">
                                    <span class="material-symbols-outlined text-[16px]">health_and_safety</span>
                                    <span>보건복지부 (7대 분야 · 112개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-space-md py-space-xs rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mogef', this)">
                                    <span class="material-symbols-outlined text-[16px]">family_restroom</span>
                                    <span>여성가족부 (2대 분야 · 15개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-space-md py-space-xs rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moe', this)">
                                    <span class="material-symbols-outlined text-[16px]">school</span>
                                    <span>교육부 (1대 분야 · 4개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-space-md py-space-xs rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moel', this)">
                                    <span class="material-symbols-outlined text-[16px]">work</span>
                                    <span>고용노동부·복지부공동 (1대 분야 · 5개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-space-md py-space-xs rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('civic', this)">
                                    <span class="material-symbols-outlined text-[16px]">volunteer_activism</span>
                                    <span>제3섹터·공동모금회 (1대 분야 · 4개)</span>
                                </button>
                            </div>"""

new_block_h = """                            <!-- 부처 탭 (오른쪽 잘림 방지: flex-wrap 자연스러운 줄바꿈) -->
                            <div class="flex flex-wrap items-center gap-2 pb-space-xs border-b border-surface-container-low" id="ministryGroupTabs">
                                <button type="button" class="ministry-btn active px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all bg-primary text-on-primary shadow-sm flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('all', this)">
                                    <span class="material-symbols-outlined text-[16px]">apps</span>
                                    <span>전체 부처 (12대 분야 · 167개 단위)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mohw', this)">
                                    <span class="material-symbols-outlined text-[16px]">health_and_safety</span>
                                    <span>보건복지부 (7대 분야 · 112개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mogef', this)">
                                    <span class="material-symbols-outlined text-[16px]">family_restroom</span>
                                    <span>여성가족부 (2대 분야 · 28개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moe', this)">
                                    <span class="material-symbols-outlined text-[16px]">school</span>
                                    <span>교육부 (1대 분야 · 8개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moel', this)">
                                    <span class="material-symbols-outlined text-[16px]">work</span>
                                    <span>고용노동부·복지부공동 (1대 분야 · 10개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('civic', this)">
                                    <span class="material-symbols-outlined text-[16px]">volunteer_activism</span>
                                    <span>제3섹터·공동모금회 (1대 분야 · 9개)</span>
                                </button>
                            </div>"""

assert old_block_h in text_h, "old_block_h not found in src/js/hierarchy.js"
text_h = text_h.replace(old_block_h, new_block_h)

with open('src/js/hierarchy.js', 'w', encoding='utf-8') as f:
    f.write(text_h)
print("Updated src/js/hierarchy.js with flex-wrap and accurate counts!")


# 2. Update stitch_welfare_hierarchy.html
with open('stitch_welfare_hierarchy.html', 'r', encoding='utf-8') as f:
    text_s = f.read()

old_s = '<div class="flex items-center gap-1.5 pb-space-xs border-b border-surface-container-low overflow-x-auto whitespace-nowrap no-scrollbar" id="ministryGroupTabs">'
new_s = '<div class="flex flex-wrap items-center gap-2 pb-space-xs border-b border-surface-container-low" id="ministryGroupTabs">'

if old_s in text_s:
    text_s = text_s.replace(old_s, new_s)
    text_s = text_s.replace('여성가족부 (2대 분야 · 15개)', '여성가족부 (2대 분야 · 28개)')
    text_s = text_s.replace('교육부 (1대 분야 · 4개)', '교육부 (1대 분야 · 8개)')
    text_s = text_s.replace('고용노동부·복지부공동 (1대 분야 · 5개)', '고용노동부·복지부공동 (1대 분야 · 10개)')
    text_s = text_s.replace('제3섹터·공동모금회 (1대 분야 · 4개)', '제3섹터·공동모금회 (1대 분야 · 9개)')
    text_s = text_s.replace('보건복지부 (7대 분야 · 55개)', '보건복지부 (7대 분야 · 112개)')
    
    with open('stitch_welfare_hierarchy.html', 'w', encoding='utf-8') as f:
        f.write(text_s)
    print("Updated stitch_welfare_hierarchy.html with flex-wrap and accurate counts!")
else:
    print("old_s not found in stitch_welfare_hierarchy.html")
