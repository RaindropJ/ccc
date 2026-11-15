# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
pos = html.find('id="view-fields"')
print('view-fields starts at:', pos)
print(html[pos:pos+1500])
