import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

comments = re.findall(r'<!--(.*?)-->', text)
print(f"Total HTML comments: {len(comments)}")
for c in comments:
    if any(k in c for k in ['Table', '섹션', 'Mobile', 'Filter', 'Nav', 'Section']):
        print(f"  Comment: {c.strip()[:80]}")
