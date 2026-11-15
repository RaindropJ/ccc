import glob
import re

for fpath in ['stitch_welfare_hierarchy.html', 'stitch_guidelines_archive.html', 'stitch_portal_viewer.html']:
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    
    # search for nav items or tabs
    navs = re.findall(r'<nav[^>]*>.*?</nav>', content, re.DOTALL)
    print(f"=== {fpath} navs: {len(navs)} ===")
    for n in navs:
        # print text content of nav
        clean = re.sub(r'<[^>]+>', ' ', n)
        clean = ' '.join(clean.split())
        print("  Nav text:", clean[:200])
