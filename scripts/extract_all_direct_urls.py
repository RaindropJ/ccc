import glob
import re
import os

scripts = glob.glob('scripts/*.py')
urls = {}
for s in scripts:
    if os.path.basename(s) == 'extract_all_direct_urls.py': continue
    with open(s, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    matches = re.findall(r'https?://[^\s\'\",]+', content)
    for m in matches:
        if any(dom in m for dom in ['mohw.go.kr', 'mogef.go.kr', 'moe.go.kr', 'kdiss.or.kr', 'sasw.or.kr', 'kyci.or.kr', 'kedi.re.kr', 'kead.or.kr', 'chest.or.kr', 'koica.go.kr', 'wish.welfare.seoul.kr', 'koreahana.or.kr', 'mpva.go.kr', 'korea.kr']):
            urls[m] = urls.get(m, 0) + 1

print(f"Found {len(urls)} official endpoints in scripts:")
for u in sorted(urls.keys()):
    print(f"  {u}")
