# -*- coding: utf-8 -*-
import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(m_nodes.group(1))

# Check initial 90 nodes vs added 77 nodes
# The initial 90 nodes are the ones that were present before commit e0e2e94e.
# Let's inspect all nodes whose details are sliced from summary.
legacy_sliced = []
for idx, n in enumerate(nodes):
    summary = n.get('summary', '')
    details = n.get('details', [])
    combined_details = "".join(d.replace(" ", "") for d in details)
    # Check if details is essentially a slice of summary
    # Or if details elements look like fragments
    is_fragment = False
    for d in details:
        ds = d.strip()
        if any(ds.endswith(p) for p in ['내', '의', '에', '을', '를', '과', '와', '및', '통해', '함께', '위한', '강점', '위해']):
            is_fragment = True
            break
        if len(ds) < 18 and not any(ds.endswith(e) for e in ['지원', '관리', '사업', '교육', '운영', '상담', '연계', '개입', '조사', '평가', '배치', '지급', '설치', '보호', '의뢰', '수립', '점검', '제공']):
            is_fragment = True
            break
    
    if is_fragment:
        legacy_sliced.append((idx, n))

print(f"Total fragmented nodes found: {len(legacy_sliced)}")
for idx, n in legacy_sliced:
    print(f"[{idx+1}] {n['id']} ({n['domainId']}) - {n['level3']}")
    print(f"   Summary: {n.get('summary')}")
    print(f"   Details: {n.get('details')}")
    print()
