import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://sasw.or.kr/data5/919371"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"SASW 919371 length: {len(html)}")
        files = re.findall(r'<a[^>]+href=["\']([^"\']*download[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in files:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            print("File link:", clean, "->", h)
except Exception as e:
    print("Error:", e)
