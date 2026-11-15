import json5
import re

with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const WELFARE_FIELDS\s*=\s*(\[\s*\{.*?\}\s*\]);', text, re.DOTALL)
fields = json5.loads(m.group(1))
print(f"Successfully parsed {len(fields)} fields with json5!")
for f in fields:
    print(f" - {f['name']} (부처: {', '.join(f.get('ministries', []))})")
