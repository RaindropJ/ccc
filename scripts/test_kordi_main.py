import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = "https://www.kordi.or.kr/main.do"
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("Main length:", len(html))
        # Find links with 'BBS' or 'board' or 'bbs' or 'sub'
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if any(k in clean for k in ['재정지원', '자료', '일자리', '안내', '지침', '공지']):
                print(f"{clean} -> {h}")
except Exception as e:
    print("Error:", e)
