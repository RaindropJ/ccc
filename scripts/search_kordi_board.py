import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
}

# Let's search kordi.or.kr
url = "https://www.kordi.or.kr/content.do?method=content&site_id=kordi&menu_id=050201"
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"KORDI length: {len(html)}")
        links = re.findall(r'<a[^>]+href=[\'"]([^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links:
            clean_t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if any(k in clean_t for k in ['일자리', '운영안내', '사업안내', '지침', '2026']):
                print(f"KORDI link: {clean_t} -> {h}")
except Exception as e:
    print("KORDI error:", e)
