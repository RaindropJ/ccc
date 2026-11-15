# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find header / navigation block
header_match = re.search(r'<header[\s\S]*?</header>', html)
if header_match:
    print('Header snippet:')
    lines = header_match.group(0).split('\n')
    for l in lines[:40]:
        print(' ', l)

# Find where data-view buttons are defined
btns = re.findall(r'<button[^>]+data-view=["\'][^"\']+["\'][^>]*>[\s\S]*?</button>', html)
print(f'\nFound {len(btns)} data-view buttons:')
for b in btns[:10]:
    print(' ', re.sub(r'\s+', ' ', b.strip())[:120])
