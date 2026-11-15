# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('id="view-fields"')
pos_end = html.find('id="view-archive"')
fields_html = html[pos:pos_end]
print('view-fields total length:', len(fields_html))

import re
tags = re.findall(r'<div[^>]*class=["\'][^"\']*md:[^"\']*["\'][^>]*>', fields_html)
print(f'Found {len(tags)} tags with md:')
for t in tags[:10]:
    print(' ', t[:100])
