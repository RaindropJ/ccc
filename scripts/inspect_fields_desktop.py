# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

pos = html.find('id="view-fields"')
sub = html[pos:pos+7000]

m = re.search(r'<!-- \[데스크탑 전용 뷰[\s\S]*?-->', sub)
if m:
    p = sub.find(m.group(0))
    print(sub[p:p+1200])
else:
    pos2 = sub.find('hidden md:block')
    if pos2 != -1:
        print(sub[pos2-100:pos2+800])
    else:
        print('Not found')
