import re

with open('src/data/welfare-hierarchy-db.js', encoding='utf-8') as f:
    text = f.read()

# find node IDs
node_ids = re.findall(r'"id":\s*"([^"]+)"', text)
# exclude domain IDs
domain_ids = [
    "01_사회복지관", "02_노인복지", "03_장애인복지", "04_아동돌봄복지",
    "05_영유아보육", "06_가족복지", "07_청소년여성권익", "08_정신건강자살예방",
    "09_자활고용지원", "10_학교사회복지", "11_지역보호긴급돌봄", "12_배분모금국제"
]

actual_node_ids = [nid for nid in node_ids if nid not in domain_ids]
print(f"Total node IDs: {len(actual_node_ids)}")
print("Sample node IDs:", actual_node_ids[:10])
print("Last 5 node IDs:", actual_node_ids[-5:])
