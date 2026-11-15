# -*- coding: utf-8 -*-
import json
import re
from build_option_a_replacements import OPTION_A_DETAILS

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(m_nodes.group(1))

print(f"Total nodes in DB: {len(nodes)}")

# Check matching
matched = 0
unmatched_broken = []

for n in nodes:
    nid = n['id']
    if nid in OPTION_A_DETAILS:
        matched += 1
    else:
        # Check if the remaining 77 nodes have any fragment
        details = n.get('details', [])
        for d in details:
            ds = d.strip()
            if any(ds.endswith(p) for p in ['내', '의', '에', '을', '를', '과', '와', '및', '통해', '함께', '위한', '강점']):
                unmatched_broken.append((n, d))
                break

print(f"Matched entries from OPTION_A_DETAILS: {matched}")
print(f"Unmatched entries that might have broken text: {len(unmatched_broken)}")
if unmatched_broken:
    for n, d in unmatched_broken:
        print(f"  [{n['id']}] {d}")
else:
    print("All remaining 77 nodes are completely clean and well-formed!")
