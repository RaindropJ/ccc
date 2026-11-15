import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = "https://www.kordi.or.kr/content.do?cmsId=179"
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("cmsId=179 length:", len(html))
        # Find articles
        links = re.findall(r'<a[^>]+href=["\']([^"\']*cid=\d+[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            print(f"- {clean} -> {h}")
except Exception as e:
    print("Error:", e)
