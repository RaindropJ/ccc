import re

with open('src/data/welfare-hierarchy-db.js', encoding='utf-8') as f:
    text = f.read()

domain_matches = re.findall(r'"domainId":\s*"([^"]+)"', text)
sub_matches = re.findall(r'"subId":\s*"([^"]+)"', text)
print(f"Total domains referenced: {len(domain_matches)}, unique: {len(set(domain_matches))}")
print(f"Total subId nodes (소분류 단위서비스): {len(sub_matches)}")

# Count per domain
domains = [
    "01_사회복지관", "02_노인복지", "03_장애인복지", "04_아동돌봄복지",
    "05_영유아보육", "06_가족복지", "07_청소년여성권익", "08_정신건강자살예방",
    "09_자활고용지원", "10_학교사회복지", "11_지역보호긴급돌봄", "12_배분모금국제"
]

for d in domains:
    # count subId under domain
    idx = text.find(f'"domainId": "{d}"')
    if idx != -1:
        # find until next domainId
        next_idx = text.find('"domainId":', idx + 20)
        chunk = text[idx:next_idx] if next_idx != -1 else text[idx:]
        c = len(re.findall(r'"subId":', chunk))
        print(f"  {d}: {c}개 노드")
