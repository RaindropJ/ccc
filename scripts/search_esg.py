import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def search_kaswc_esg():
    url = "https://kaswc.or.kr/board/notice?search_category=&search_title=ESG"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print("KASWC notice size:", len(html))
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*board/notice/[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                print(f"  {clean} -> https://kaswc.or.kr{href}")
    except Exception as e:
        print("KASWC notice error:", e)

def search_wish_esg():
    url = "https://www.welfare.seoul.kr/wish/notice?searchWord=ESG"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print("WISH notice size:", len(html))
    except Exception as e:
        print("WISH error:", e)

if __name__ == '__main__':
    search_kaswc_esg()
