import re
from collections import defaultdict, Counter

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to capture fields
pattern = re.compile(
    r'id:\s*["\']([^"\']+)["\'].*?'
    r'domainName:\s*["\']([^"\']+)["\'].*?'
    r'majorCategory:\s*["\']([^"\']+)["\'].*?'
    r'midCategory:\s*["\']([^"\']+)["\'].*?'
    r'subCategory:\s*["\']([^"\']+)["\']',
    re.DOTALL
)

matches = pattern.findall(content)
print(f"Total matched: {len(matches)}")

domain_data = defaultdict(list)
for m_id, domain, major, mid, sub in matches:
    domain_data[domain].append((major, mid, sub))

for domain, items in domain_data.items():
    print(f"\n[{domain}] (총 {len(items)}개)")
    mid_counter = Counter(m[1] for m in items)
    for mid, cnt in mid_counter.most_common():
        sub_samples = [m[2] for m in items if m[1] == mid][:3]
        print(f"  - 중분류: '{mid}' ({cnt}건) -> 예: {sub_samples}")
