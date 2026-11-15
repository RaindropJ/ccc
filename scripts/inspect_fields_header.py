# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

pos = html.find('id="view-fields"')
sub = html[pos:pos+3500]

# Find desktop header in view-fields
m = re.search(r'<div class=["\']hidden md:block[\s\S]*?</div>\s*</div>', sub)
if m:
    print('Found desktop header in view-fields:')
    print(m.group(0)[:600])
else:
    print('Snippet from view-fields:')
    lines = sub.split('\n')
    for l in lines[:40]:
        print(' ', l)
