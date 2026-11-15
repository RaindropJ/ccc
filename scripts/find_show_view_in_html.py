# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

matches = [m.start() for m in re.finditer(r'function showView', html)]
print('showView in index.html matches count:', len(matches))
for pos in matches:
    print('--- match at pos', pos, '---')
    print(html[pos:pos+400])
