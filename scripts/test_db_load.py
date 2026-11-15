import re

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's verify all doc IDs, titles, sections, ministries, codes
matches = re.finditer(r'\{[^{}]*"id":\s*"(doc-\d+)"[^{}]*\}', text, re.DOTALL)

count = 0
for m in matches:
    count += 1

print(f"Direct regex matches: {count}")

# Let's inspect by parsing the JSON-like data or using Node
