# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'view-archive' in l:
        print(f'Line {i+1}: {l.strip()[:100]}')
        for j in range(max(0, i-5), min(len(lines), i+10)):
            print(f'  {j+1}: {lines[j].rstrip()[:100]}')
        break
