# -*- coding: utf-8 -*-
import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(m_nodes.group(1))

print(f"Total nodes: {len(nodes)}")

# Let's check patterns across all nodes
summary_only = 0
details_count = 0
broken_nodes = []

for n in nodes:
    details = n.get('details', [])
    summary = n.get('summary', '')
    
    # Check if details has chopped sentence fragments
    # A genuine bullet point is usually a discrete clause or task (often ending in 명사형, e.g., 지원, 상담, 연계, 관리, 운영, 교육, 평가, 조사)
    # A broken bullet point ends with particles or fragments like:
    # '내', '을', '를', '과', '와', '의', '에', '및', '통해', '함께', '정밀' or very short fragments
    fragments = []
    for d in details:
        d_strip = d.strip()
        if any(d_strip.endswith(p) for p in ['내', '을', '를', '과', '와', '의', '에', '및', '통해', '함께', '정밀', '위한', '강점']):
            fragments.append(d)
        elif len(d_strip) < 15 and not any(d_strip.endswith(e) for e in ['지원', '관리', '사업', '교육', '운영', '상담', '연계', '개입', '조사', '평가', '배치', '지급', '설치', '보호', '의뢰']):
            fragments.append(d)

    if fragments:
        broken_nodes.append((n, fragments))

print(f"Identified {len(broken_nodes)} nodes with chopped/fragmented details:")
for n, frags in broken_nodes:
    print(f"[{n['id']}] {n['domainId']} > {n['level3']}")
    print(f"  Summary: {n.get('summary')}")
    print(f"  Details: {n.get('details')}")
    print(f"  Flagged: {frags}")
    print("-" * 50)
