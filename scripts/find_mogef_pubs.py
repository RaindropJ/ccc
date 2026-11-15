import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
url = 'https://www.mogef.go.kr/index.do'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    matches = re.findall(r'<a[^>]+href=["\']([^"\']*\.do[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
    for href, text in matches:
        clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
        if any(k in clean for k in ['간행물', '자료', '사전정보', '정책', '지침', '업무안내', '정보공개']):
            print(f"{clean} -> {href}")
