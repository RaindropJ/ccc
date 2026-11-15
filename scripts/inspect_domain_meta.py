import re
import json5

with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const DOMAIN_META\s*=\s*(\{.*?\n\s*\};)', text, re.DOTALL)
if m:
    meta = json5.loads(m.group(1).rstrip(';'))
    print("DOMAIN_META found, count:", len(meta))
    for k, v in meta.items():
        print(f" {k}: {v.get('short')} | 부처: {v.get('ministry')} | 법령: {v.get('legal')}")
else:
    print("DOMAIN_META not found")
