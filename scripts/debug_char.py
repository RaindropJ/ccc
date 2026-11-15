with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'export const WELFARE_FIELDS\s*=\s*(\[\s*\{.*?\}\s*\]);', text, re.DOTALL)
js_str = m.group(1)

from parse_taxonomy import js_to_json
clean = js_to_json(js_str)
print("Around char 2809:")
print(clean[2700:2900])
