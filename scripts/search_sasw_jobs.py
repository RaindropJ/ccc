import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

for p in range(1, 4):
    url = f"https://sasw.or.kr/data5?page={p}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]+href=["\'](/data5/(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for href, doc_id, text in matches:
            t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
            if '노인' in t or '일자리' in t:
                print(f"(p{p}) [{doc_id}] {t}")
