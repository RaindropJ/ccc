import urllib.request
import re

# Search dadol.or.kr board for 2026
url = 'https://dadol.or.kr/board/list?board_id=notice'
headers = {'User-Agent': 'Mozilla/5.0'}
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("dadol notice length:", len(html))
        items = re.findall(r'<a[^>]+href=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for link, text in items:
            t = re.sub(r'<[^>]+>', '', text).strip()
            if '사업안내' in t or '지침' in t or '202' in t:
                print(f"dadol: {t} -> {link}")
except Exception as e:
    print("dadol error:", e)
