# -*- coding: utf-8 -*-
import os

files = ['index.html', 'stitch_portal_viewer.html', 'stitch_welfare_hierarchy.html', 'stitch_guidelines_archive.html', 'src/js/hierarchy.js', 'src/js/archive.js']

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = False

    # Check mobile sticky tabs in index.html
    if fn == 'index.html':
        old_sticky = """            <button type="button" data-view="archive" onclick="showView('archive')" class="nav-tab-btn flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white shadow-xs hover:bg-slate-100 transition-colors flex items-center gap-1 transition cursor-pointer">
                <span>📁 아카이브</span>
                <span class="nav-badge px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">53</span>
            </button>
            <button type="button" data-view="hierarchy" onclick="showView('hierarchy')" class="nav-tab-btn flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white shadow-xs hover:bg-slate-100 transition-colors flex items-center gap-1 transition cursor-pointer">
                <span>🌳 3단계 위계</span>
                <span class="nav-badge px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-700 rounded-full font-bold">167</span>
            </button>"""
        new_sticky = """            <button type="button" data-view="hierarchy" onclick="showView('hierarchy')" class="nav-tab-btn flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white shadow-xs hover:bg-slate-100 transition-colors flex items-center gap-1 transition cursor-pointer">
                <span>🌳 3단계 위계</span>
                <span class="nav-badge px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-700 rounded-full font-bold">167</span>
            </button>
            <button type="button" data-view="archive" onclick="showView('archive')" class="nav-tab-btn flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white shadow-xs hover:bg-slate-100 transition-colors flex items-center gap-1 transition cursor-pointer">
                <span>📁 아카이브</span>
                <span class="nav-badge px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">53</span>
            </button>"""
        if old_sticky in content:
            content = content.replace(old_sticky, new_sticky)
            changed = True
            print('Swapped mobile sticky tabs in index.html')

    # Update 90 badges and labels
    replacements = [
        ('>90</span>', '>167</span>'),
        ('90개 법정단위', '167개 법정단위'),
        ('90개 단위서비스', '167개 단위서비스'),
        ('90개 단위', '167개 단위'),
        ('90단위', '167단위'),
        ('90개 법정단위서비스', '167개 법정단위서비스'),
        ('90개 노드', '167개 노드'),
    ]
    for o, n in replacements:
        if o in content:
            content = content.replace(o, n)
            changed = True
            print(f'{fn}: replaced {o} -> {n}')

    if changed:
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Successfully updated {fn}')
