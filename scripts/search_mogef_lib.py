import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def search_mogef_lib(keyword):
    # Search MOGEF publication library
    url = f"https://www.mogef.go.kr/io/lib/lib_s200.do?mid=libm200"
    # let's first inspect the form / parameters
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"MOGEF lib accessed, size: {len(html)}")
            # look for items on first page
            items = re.findall(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, text in items:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if any(k in clean for k in ['가족', '청소년', '사업안내', '지침', '편람', '매뉴얼', '보고서']):
                    print(f"  {clean} -> {href}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    search_mogef_lib('가족센터')
