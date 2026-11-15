import json

with open('src/data/welfare-hierarchy-db.js', encoding='utf-8') as f:
    text = f.read()

# count nodes per domain
import re
domains = [
    "01_사회복지관", "02_노인복지", "03_장애인복지", "04_아동돌봄복지",
    "05_영유아보육", "06_가족복지", "07_청소년여성권익", "08_정신건강자살예방",
    "09_자활고용지원", "10_학교사회복지", "11_지역보호긴급돌봄", "12_배분모금국제"
]

for d in domains:
    matches = re.findall(rf'"domainId":\s*"{d}"', text)
    print(f"  {d}: {len(matches)}개 노드")

# print sample node
m = re.search(r'\{\s*"id":\s*"node-001"[^}]+(?:\{[^}]+?\}[^}]+?)*\}', text)
if m:
    print("\nSample node-001:")
    print(m.group(0)[:500])
