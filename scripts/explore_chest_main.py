import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
req = urllib.request.Request('https://proposal.chest.or.kr/main/main.do', headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    print('main.do size:', len(html))
    matches = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
    for href, text in matches:
        clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
        if any(k in clean for k in ['배분', '안내', '공고', '신청', '양식', '지침']):
            print(f"  {clean} -> {href}")
