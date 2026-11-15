# -*- coding: utf-8 -*-
import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(m_nodes.group(1))

# Let's write out the first 90 nodes with their id, domainId, level3, summary, and current details
with open('scripts/first_90_nodes.json', 'w', encoding='utf-8') as f:
    json.dump([{
        "id": n['id'],
        "domainId": n['domainId'],
        "level1": n['level1'],
        "level2": n['level2'],
        "level3": n['level3'],
        "summary": n.get('summary', ''),
        "details": n.get('details', [])
    } for n in nodes[:90]], f, ensure_ascii=False, indent=2)

print("Dumped first 90 nodes to scripts/first_90_nodes.json")
