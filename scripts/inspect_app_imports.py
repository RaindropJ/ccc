# -*- coding: utf-8 -*-
with open('src/js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re

imports = re.findall(r'import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];?', code)
print(f'Total imports in app.js: {len(imports)}')
for imp in imports:
    print(' ', imp.strip())

exports = re.findall(r'export\s+[\s\S]*?;', code)
print(f'\nTotal exports in app.js: {len(exports)}')
for exp in exports:
    print(' ', exp.strip())
