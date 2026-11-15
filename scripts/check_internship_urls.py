import json

with open('src/data/internships-db.js', encoding='utf-8') as f:
    text = f.read()

# find js variable declaration
start = text.find('[')
end = text.rfind(']')
if start != -1 and end != -1:
    data = json.loads(text[start:end+1])
    print(f"Loaded {len(data)} items")
    bad_items = []
    for item in data:
        sources = item.get('sources', [])
        for s in sources:
            if s.get('url') == '공공·행정':
                bad_items.append(item)
                break
    print(f"Bad items count: {len(bad_items)}")
    for item in bad_items[:5]:
        print(f"ID: {item.get('id')}, Company: {item.get('company')}, Title: {item.get('title')}, Platform: {item.get('sourcePlatform')}")
