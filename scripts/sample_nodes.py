import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(match.group(1))

# Let's inspect all domains to see text redundancy between level1, level2, level3, facilityType
for n in nodes[:25]:
    print(f"[{n['domainId'][:5]}] 대: {n['level1']} | 중: {n['level2']} | 소: {n['level3']}")
