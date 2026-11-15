# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

scripts = re.findall(r'<script[^>]*>[\s\S]*?</script>', html)
print(f'Total script tags: {len(scripts)}')
for s in scripts[-10:]:
    print(s[:200])
    print('-'*40)
