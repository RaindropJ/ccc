# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

m = re.search(r'id=["\']mobile-nav-panel["\'][\s\S]*?</div>\s*</div>', html)
if not m:
    m = re.search(r'data-view=["\']archive["\']', html)
    if m:
        pos = m.start()
        print(html[pos-150:pos+350])
else:
    print(m.group(0)[:600])
