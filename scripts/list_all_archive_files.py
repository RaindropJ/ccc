# -*- coding: utf-8 -*-
import json
import re

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()
match = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', text, re.DOTALL)
archive_db = json.loads(match.group(1))

for cat in archive_db:
    print(f"=== {cat['categoryName']} ===")
    for src in cat.get('sources', []):
        for f in src.get('files', []):
            print(f" - [{f['id']}] {f['filename']} ({f['sizeStr']})")
