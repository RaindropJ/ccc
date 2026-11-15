import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
urls = [
    'https://www.mogef.go.kr/nw/rpd/nw_rpd_s001.do',
    'https://www.mogef.go.kr/nw/pcd/nw_pcd_s001.do'
]
for u in urls:
    req = urllib.request.Request(u, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"{u} -> size: {len(html)}")
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if any(k in clean for k in ['가족센터', '청소년', '한부모', '사업안내', '지침', '아이돌봄', '폭력']):
                    print(f"   {clean} -> {href}")
    except Exception as e:
        print(f"{u} error: {e}")
