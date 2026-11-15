# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '<script src=' in l:
        print(f'Line {i+1}: {l.strip()}')
