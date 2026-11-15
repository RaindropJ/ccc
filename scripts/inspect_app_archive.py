# -*- coding: utf-8 -*-
with open('src/js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'archive' in l:
        print(f'{i+1}: {l.strip()[:100]}')
