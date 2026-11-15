import json
import re

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse WELFARE_HIERARCHY_NODES JSON array
match = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
if not match:
    print("Could not find WELFARE_HIERARCHY_NODES")
    exit(1)

nodes = json.loads(match.group(1))
print(f"Total nodes: {len(nodes)}")

# Let's inspect duplicate level2 per domain/level1
from collections import Counter, defaultdict
grouped = defaultdict(lambda: defaultdict(list))
for n in nodes:
    grouped[n['domainId']][n['level1']].append(n)

print("\n=== CONSECUTIVE DUPLICATE level2 IN DOMAIN/LEVEL1 ===")
for domainId, l1_map in grouped.items():
    print(f"\n[{domainId}]")
    for l1, n_list in l1_map.items():
        l2_counts = Counter(x['level2'] for x in n_list)
        duplicates = {k: v for k, v in l2_counts.items() if v > 1}
        if duplicates:
            print(f"  대분류 [{l1}] (총 {len(n_list)}행):")
            for l2, cnt in duplicates.items():
                print(f"    - 중분류 '{l2}': {cnt}번 연속 반복됨!")
                for item in n_list:
                    if item['level2'] == l2:
                        print(f"        -> 소분류(level3): {item['level3']}")
        else:
            print(f"  대분류 [{l1}]: 중분류 중복 없음 (각 행마다 다른 중분류)")
