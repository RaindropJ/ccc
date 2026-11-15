import re

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

hwps = re.findall(r'"filename":\s*"([^"]+\.hwp[x]?)"', text)
print('HWP/HWPX filenames in guidelines-archive-db.js:', hwps)
