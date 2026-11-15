# -*- coding: utf-8 -*-
import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
nodes = json.loads(m_nodes.group(1))

print(f"Total nodes: {len(nodes)}")

# Let's check each node in the initial 90 (or all 167)
# For each node, let's create high-quality 3 bullets based on its level3 and summary.
# Let's inspect which ones are bad.
bad_nodes = []
for idx, n in enumerate(nodes):
    details = n.get('details', [])
    summary = n.get('summary', '')
    
    # Heuristics for bad details:
    # 1. Any detail item ends in particle (내, 의, 에, 을, 를, 과, 와, 및, 위해, 위한, 등, 취, 과 함께)
    # 2. Details items are literally substrings of a single split summary sentence
    # 3. Ends abruptly without a complete noun or verb ending
    is_bad = False
    for d in details:
        ds = d.strip()
        if any(ds.endswith(p) for p in ['내', '의', '에', '을', '를', '과', '와', '및', '위해', '위한', '등', '취', '함께', '통한', '통해']):
            is_bad = True
            break
        if len(ds) <= 12 and not any(ds.endswith(e) for e in ['지원', '관리', '사업', '교육', '운영', '상담', '연계', '개입', '조사', '평가', '배치', '지급', '설치', '보호', '의뢰', '수립', '점검', '제공', '동행', '홍보']):
            is_bad = True
            break

    if is_bad:
        bad_nodes.append((idx + 1, n))

print(f"Identified {len(bad_nodes)} bad nodes needing Option A normalization.")
with open('scripts/bad_nodes_list.txt', 'w', encoding='utf-8') as out:
    for idx_num, n in bad_nodes:
        out.write(f"[{idx_num}] ID: {n['id']} ({n['domainId']}) - {n['level3']}\n")
        out.write(f"    Summary: {n.get('summary')}\n")
        out.write(f"    Current Details: {n.get('details')}\n\n")

print("Saved bad nodes to scripts/bad_nodes_list.txt")
