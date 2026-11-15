# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find view-archive container
m = re.search(r'<div id=["\']view-archive["\'][\s\S]*?</div>\s*<!-- \/view-archive -->', html)
if not m:
    # Just find start of view-archive
    pos = html.find('id="view-archive"')
    print('Found view-archive at pos:', pos)
    print(html[pos-50:pos+300])
else:
    print('Matched view-archive length:', len(m.group(0)))
    print(m.group(0)[:400])

# Check showView in src/js/app.js
with open('src/js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

show_view_m = re.search(r'function showView[\s\S]*?\{[\s\S]*?\n\}', js)
if show_view_m:
    print('\nshowView function:')
    print(show_view_m.group(0)[:500])
