import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(match.group(1))

print("=== NODES FROM 90 TO 167 (Option B Added Nodes) ===")
for n in nodes[90:130]:
    print(f"[{n['domainId'][:5]}] 대: {n['level1']} | 중: {n['level2']} | 소: {n['level3']}")
