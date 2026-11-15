import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = "https://www.kordi.or.kr/content.do?bid=266&mode=view&cid=643625&cmsId=179"
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("Article length:", len(html))
        # Find file download links
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if any(k in h.lower() or k in clean.lower() for k in ['down', 'file', 'pdf', 'hwp']):
                print(f"File: {clean} -> {h}")
except Exception as e:
    print("Error:", e)
