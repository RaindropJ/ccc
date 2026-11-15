import re

def check_90(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    matches = []
    for line in text.splitlines():
        if any(p in line for p in ['90개', '90단위', '>90<', '"90"', ' 90 ', '90건']):
            matches.append(line.strip())
    print(f"=== {filepath}: {len(matches)} matches ===")
    for m in matches[:10]:
        print(" ", m[:120])

check_90('index.html')
check_90('src/js/hierarchy.js')
check_90('stitch_welfare_hierarchy.html')
check_90('stitch_guidelines_archive.html')
check_90('stitch_portal_viewer.html')
