import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

print("=== Scanning SASW data5 (pages 1 to 15) for supplementary guidelines ===")
articles = {}
keywords = ['자활', '다함께돌봄', '아동', '일자리', '활동지원', '정신', '노숙인', '사회서비스']

for p in range(1, 16):
    url = f"https://sasw.or.kr/data5?page={p}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'<a[^>]+href=["\'](/data5/(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, doc_id, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if clean and not clean.isdigit() and doc_id not in articles:
                    articles[doc_id] = clean
                    for kw in keywords:
                        if kw in clean:
                            print(f"[p.{p}] ID: {doc_id} | Title: {clean} | URL: https://sasw.or.kr/data5/{doc_id}")
                            break
    except Exception as e:
        print(f"Error page {p}: {e}")
