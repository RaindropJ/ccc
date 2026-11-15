# -*- coding: utf-8 -*-
import json
import os
import re

DOMAINS = [
    "01_사회복지관", "02_노인복지", "03_장애인복지", "04_아동돌봄복지",
    "05_영유아보육", "06_가족복지", "07_청소년여성권익", "08_정신건강자살예방",
    "09_자활고용지원", "10_학교사회복지", "11_지역보호긴급돌봄", "12_배분모금국제"
]

def main():
    db_path = 'src/data/welfare-hierarchy-db.js'
    with open(db_path, 'r', encoding='utf-8') as f:
        text = f.read()

    start_pos = text.find('const WELFARE_HIERARCHY_NODES = [')
    end_pos = text.find('];', start_pos)
    assert start_pos != -1 and end_pos != -1, "Array boundaries not found"

    array_content = text[start_pos + len('const WELFARE_HIERARCHY_NODES = '):end_pos + 1]
    nodes = json.loads(array_content)

    print(f"=== HIERARCHY VALIDATION AUDIT ===")
    print(f"Total Nodes: {len(nodes)} (Expected: 167)")
    assert len(nodes) == 167, f"Expected 167 nodes, got {len(nodes)}"

    # 1. Unique IDs
    ids = [n['id'] for n in nodes]
    assert len(ids) == len(set(ids)), f"Duplicate IDs found: {[x for x in ids if ids.count(x) > 1]}"
    print("  [Pass] All 167 IDs are unique.")

    # 2. Domain breakdown and validity
    domain_counts = {}
    for n in nodes:
        d = n.get('domainId')
        assert d in DOMAINS, f"Invalid domain: {d}"
        domain_counts[d] = domain_counts.get(d, 0) + 1

    print("\n=== DOMAIN BREAKDOWN ===")
    for d in DOMAINS:
        print(f"  {d}: {domain_counts.get(d, 0)} nodes")

    # 3. Efficiency_DB file existence check
    print("\n=== EFFICIENCY_DB FILE RESOLUTION ===")
    all_files_in_db = {}
    for d in DOMAINS:
        p = os.path.join('Efficiency_DB', d)
        if os.path.isdir(p):
            for fname in os.listdir(p):
                all_files_in_db[fname] = os.path.join(p, fname)

    missing_files = set()
    for n in nodes:
        ref = n.get('guidelineRef', {})
        fname = ref.get('file')
        if not fname or fname not in all_files_in_db:
            missing_files.add(fname)

    if missing_files:
        print(f"  [Fail] Missing files in Efficiency_DB: {missing_files}")
        assert False, f"Missing files: {missing_files}"
    else:
        print(f"  [Pass] All {len(nodes)} nodes reference verified physical files in Efficiency_DB!")

    # 4. Content fields check
    for n in nodes:
        assert n.get('level1'), f"Missing level1 in {n.get('id')}"
        assert n.get('level2'), f"Missing level2 in {n.get('id')}"
        assert n.get('level3'), f"Missing level3 in {n.get('id')}"
        assert n.get('summary'), f"Missing summary in {n.get('id')}"
        assert n.get('facilityType'), f"Missing facilityType in {n.get('id')}"
        assert isinstance(n.get('details'), list) and len(n.get('details')) > 0, f"Invalid details in {n.get('id')}"

    print("  [Pass] All 167 nodes pass complete schema and content validation!")
    print("\n=== AUDIT COMPLETE: 100% SUCCESS ===")

if __name__ == '__main__':
    main()
