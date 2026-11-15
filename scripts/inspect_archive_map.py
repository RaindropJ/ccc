import json
import re

with open('src/data/guidelines-archive-db.js', encoding='utf-8') as f:
    text = f.read()

# find all file objects with filename, id, code
files = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"filename":\s*"([^"]+)"[^}]+?"code":\s*"([^"]+)"', text, re.DOTALL)
print(f"Total files in archive db: {len(files)}")
file_map = {}
for fid, fname, fcode in files:
    file_map[fname] = {'id': fid, 'code': fcode}

print(f"Mapped {len(file_map)} filenames")
# print sample
for k, v in list(file_map.items())[:10]:
    print(f"  {k} -> {v}")
