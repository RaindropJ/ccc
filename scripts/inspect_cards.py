import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect between title and table 1
title_idx = text.find('공식 지침서 마스터 아카이브 (53종)')
tbl_idx = text.find('<table')
middle_section = text[title_idx:tbl_idx]
print(f"Length between title and table: {len(middle_section)}")

# Let's find all divs with classes
for m in re.finditer(r'<div[^>]*class="([^"]*)"[^>]*>', middle_section):
    cls = m.group(1)
    if 'grid' in cls or 'card' in cls or 'p-4' in cls or 'rounded-xl' in cls or 'bg-surface' in cls:
        print(f"DIV: {cls[:80]}")

print("\n--- FIRST 2500 CHARACTERS OF MIDDLE SECTION ---")
print(middle_section[:2500])
