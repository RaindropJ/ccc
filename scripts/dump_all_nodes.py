# -*- coding: utf-8 -*-
import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(m_nodes.group(1))

with open('scripts/all_nodes_list.txt', 'w', encoding='utf-8') as out:
    for idx, n in enumerate(nodes):
        out.write(f"[{idx+1}] ID: {n['id']} | Domain: {n['domainId']} | Level3: {n['level3']}\n")
        out.write(f"    Summary: {n.get('summary')}\n")
        out.write(f"    Details: {n.get('details')}\n\n")

print("Saved all 167 nodes to scripts/all_nodes_list.txt")
