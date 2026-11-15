# -*- coding: utf-8 -*-
import json
import re
import os

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract GUIDELINES_ARCHIVE_DB
match = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', text, re.DOTALL)
if match:
    archive_db = json.loads(match.group(1))
    print(f"Loaded {len(archive_db)} archive categories.")
    all_files = []
    for cat in archive_db:
        cat_files = 0
        for src in cat.get('sources', []):
            for file_obj in src.get('files', []):
                all_files.append(file_obj)
                cat_files += 1
        print(f" - {cat['categoryName']}: {cat_files} files")
    print(f"Total files: {len(all_files)}")
    if all_files:
        print("Sample file 0:", json.dumps(all_files[0], ensure_ascii=False, indent=2))
else:
    print("Could not find GUIDELINES_ARCHIVE_DB")

# Check welfare hierarchy db
with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    h_text = f.read()

h_match = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', h_text, re.DOTALL)
if h_match:
    nodes = json.loads(h_match.group(1))
    print(f"\nLoaded {len(nodes)} hierarchy nodes.")
    print("Sample node 0:", json.dumps(nodes[0], ensure_ascii=False, indent=2))
else:
    print("Could not find WELFARE_HIERARCHY_NODES")
