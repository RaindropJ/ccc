import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def inspect_mogef_detail(id_val):
    url = f"https://www.mogef.go.kr/io/lib/lib_v200.do?id={id_val}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Detail id={id_val} size: {len(html)}")
        matches = re.findall(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for href, text in matches:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
            if any(k in href.lower() or k in clean.lower() for k in ['down', 'file', 'attach', 'pdf', 'hwp']):
                print(f"  File: {clean} -> {href}")

if __name__ == '__main__':
    inspect_mogef_detail('31042') # 2026 가족사업안내 1
    inspect_mogef_detail('31043') # 2026 가족사업안내 2
