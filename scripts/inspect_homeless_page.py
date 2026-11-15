import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
url = 'http://homeless-seoul.or.kr/pages/page_62.php?sn=6389'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    for m in re.finditer(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL):
        href = m.group(1)
        text = re.sub(r'<[^>]+>', '', m.group(2)).strip()
        if any(k in href.lower() or k in text for k in ['down', 'file', 'attach', '배분', '안내', 'pdf', 'hwp']):
            print(f"{text} -> {href}")
