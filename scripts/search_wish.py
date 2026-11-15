import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def search_wish(keyword):
    encoded = urllib.parse.quote(keyword)
    url = f"https://www.welfare.seoul.kr/wish/search?searchWord={encoded}"
    print(f"=== Searching WISH for [{keyword}] ===")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"WISH result size: {len(html)}")
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            found = 0
            for href, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if keyword in clean or any(k in clean for k in ['가이드', '지침', '매뉴얼', '안내', '사업']):
                    print(f"  {clean} -> {href}")
                    found += 1
                    if found >= 5: break
    except Exception as e:
        print(f"Error WISH [{keyword}]: {e}")

if __name__ == '__main__':
    search_wish("배분사업안내")
    search_wish("ESG")
    search_wish("가족센터")
    search_wish("교육복지")
