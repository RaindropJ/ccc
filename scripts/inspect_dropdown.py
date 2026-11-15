# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

dropdown_match = re.search(r'id=["\']nav-fields-dropdown-group["\'][\s\S]*?</div>\s*</div>\s*</div>', html)
if dropdown_match:
    print(dropdown_match.group(0))
