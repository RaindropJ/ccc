import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect headers, metric cards, filter pills, tables, mobile sections
print(f"Total HTML length: {len(text)} chars")

# Metrics ribbon
metrics = re.findall(r'<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4.*?</section>', text, re.DOTALL)
print(f"Metrics section found: {len(metrics)}")
if metrics:
    print("--- METRICS SECTION HEAD (500 chars) ---")
    print(metrics[0][:500])

# Ministry pills
pills = re.findall(r'class="[^"]*ministry-pill[^"]*"[^>]*>(.*?)<', text)
print(f"Ministry pills count: {len(pills)}, values: {pills}")

# Tables
table_matches = re.finditer(r'<table[^>]*>(.*?)</table>', text, re.DOTALL)
for i, tm in enumerate(table_matches):
    tbl_text = tm.group(0)
    rows = re.findall(r'<tr[^>]*>', tbl_text)
    print(f"Table {i+1}: length={len(tbl_text)}, tr count={len(rows)}")
    # get sample tr
    trs = re.findall(r'<tr class="guideline-row[^"]*"[^>]*>.*?</tr>', tbl_text, re.DOTALL)
    print(f"  guideline-row count: {len(trs)}")
    if trs:
        print("  Sample row:")
        print(trs[0][:600])

# Mobile cards
mobile_secs = re.findall(r'<div class="[^"]*md:hidden[^"]*".*?</div>\s*</div>', text, re.DOTALL)
print(f"Mobile sections found: {len(mobile_secs)}")

