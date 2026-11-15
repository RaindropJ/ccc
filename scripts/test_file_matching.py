# -*- coding: utf-8 -*-
import json
import re

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()
match = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', text, re.DOTALL)
archive_db = json.loads(match.group(1))

file_map = {}
for cat in archive_db:
    for src in cat.get('sources', []):
        for f in src.get('files', []):
            file_map[f['filename']] = f

with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    h_text = f.read()
h_match = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', h_text, re.DOTALL)
nodes = json.loads(h_match.group(1))

matched = 0
unmatched = []
for n in nodes:
    ref_file = n['guidelineRef']['file']
    if ref_file in file_map:
        matched += 1
    else:
        unmatched.append((n['id'], ref_file))

print(f"Matched: {matched}/{len(nodes)}")
if unmatched:
    print(f"Unmatched {len(unmatched)}:")
    for uid, ufile in unmatched[:10]:
        print(f" - {uid}: {ufile}")
