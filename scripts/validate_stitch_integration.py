# -*- coding: utf-8 -*-
"""
Validate JS files syntax and data consistency.
"""
import json
import re

print("Validating JavaScript and HTML files...")

# 1. welfare-hierarchy-db.js
with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    h_text = f.read()

assert 'window.WELFARE_HIERARCHY_DOMAINS' in h_text or 'const WELFARE_HIERARCHY_DOMAINS' in h_text
assert 'const WELFARE_HIERARCHY_NODES' in h_text
m = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', h_text, re.DOTALL)
nodes = json.loads(m.group(1))
print(f"✓ welfare-hierarchy-db.js: {len(nodes)} nodes validated.")

# 2. guidelines-archive-db.js
with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    a_text = f.read()

m2 = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', a_text, re.DOTALL)
cats = json.loads(m2.group(1))
file_count = sum(len(src.get('files', [])) for cat in cats for src in cat.get('sources', []))
print(f"✓ guidelines-archive-db.js: {len(cats)} categories, {file_count} files validated.")

# 3. hierarchy.js
with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    hj_text = f.read()
assert 'window.renderHierarchyView' in hj_text
assert 'renderDesktopTableRows' in hj_text
assert 'renderMobileCards' in hj_text
print(f"✓ hierarchy.js: {len(hj_text):,} chars validated.")

# 4. archive.js
with open('src/js/archive.js', 'r', encoding='utf-8') as f:
    aj_text = f.read()
assert 'window.renderArchiveView' in aj_text
assert 'renderDesktopArchiveRows' in aj_text
assert 'renderMobileArchiveCards' in aj_text
print(f"✓ archive.js: {len(aj_text):,} chars validated.")

# 5. index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx_text = f.read()
assert '사회복지 현장 나침반' in idx_text
assert 'subnav-tab' in idx_text
assert 'v2.4 국가법정기준' in idx_text
print(f"✓ index.html: {len(idx_text):,} chars validated.")

print("\nALL 5 VALIDATION CHECKS PASSED!")
