import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mohw.go.kr/'
}

def inspect_mohw_pages(bid, start_page=5, end_page=12):
    print(f"=== Inspecting MOHW bid={bid} pages {start_page}..{end_page} ===")
    for p in range(start_page, end_page + 1):
        url = f"https://www.mohw.go.kr/board.es?mid=a10411010100&bid={bid}&nPage={p}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            items = re.findall(r'<a[^>]+href=["\']([^"\']*list_no=(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, list_no, title in items:
                clean_title = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
                if clean_title and not clean_title.isdigit():
                    if any(k in clean_title for k in ['사업안내', '지침', '매뉴얼', '노인', '장애인', '아동', '자활', '노숙인', '돌봄', '다함께']):
                        print(f"  [{list_no}] (p{p}) {clean_title}")

if __name__ == '__main__':
    inspect_mohw_pages('0019', 5, 12)
