import re
from collections import Counter

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

sec1 = len(re.findall(r'"section":\s*"SECTION_1"', text))
sec2 = len(re.findall(r'"section":\s*"SECTION_2"', text))
print(f"SECTION_1: {sec1}, SECTION_2: {sec2}")

mins = re.findall(r'"ministry":\s*"([^"]+)"', text)
print("Ministries count:", Counter(mins))

docs = re.findall(r'"id":\s*"(doc-\d+)"', text)
print("Total doc IDs:", len(docs))
