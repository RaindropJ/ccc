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

def inspect_mohw_recent_pages(bid, max_pages=3):
    print(f"=== Inspecting MOHW bid={bid} recent pages ===")
    for p in range(1, max_pages + 1):
        url = f"https://www.mohw.go.kr/board.es?mid=a10411010100&bid={bid}&nPage={p}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            items = re.findall(r'<a[^>]+href=["\']([^"\']*list_no=(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            print(f"Page {p}: found {len(items)} items")
            for href, list_no, title in items:
                clean_title = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
                if clean_title and not clean_title.isdigit():
                    print(f"  [{list_no}] {clean_title}")

if __name__ == '__main__':
    inspect_mohw_recent_pages('0019', max_pages=4)
