# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

sections = re.findall(r'<section[^>]+id=["\'](view-[^"\']+)["\'][^>]*>', html)
for s in sections:
    # get full tag
    tag_m = re.search(r'<section[^>]+id=["\']' + re.escape(s) + r'["\'][^>]*>', html)
    if tag_m:
        print(tag_m.group(0))
