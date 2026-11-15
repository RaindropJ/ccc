# -*- coding: utf-8 -*-
import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
if m_nodes:
    nodes = json.loads(m_nodes.group(1))
    print(f"Total nodes: {len(nodes)}")

    broken = []
    for n in nodes:
        details = n.get('details', [])
        summary = n.get('summary', '')
        # Check why it was split:
        # e.g., if details can be joined back to summary, or if details items are fragments
        combined = " ".join(details)
        # Check if details has unnatural splits
        is_fragmented = False
        for i, d in enumerate(details):
            d_s = d.strip()
            # If line ends with incomplete word or starts with lower/fragment
            if any(d_s.endswith(p) for p in ['내', '의', '에', '을', '를', '과', '와', '및', '강점', '등', '통해', '위한']):
                is_fragmented = True
                break
        if is_fragmented:
            broken.append(n)

    print(f"Found {len(broken)} fragmented detail nodes out of {len(nodes)} nodes.")
    print("=== SAMPLE FRAGMENTED NODES ===")
    for b in broken[:8]:
        print(f"[{b['id']}] {b['level1']} > {b['level2']} > {b['level3']}")
        print(f"  Summary: {b.get('summary')}")
        print(f"  Details: {b.get('details')}")
        print()
