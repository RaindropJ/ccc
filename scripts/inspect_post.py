import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def inspect_mohw_post(url):
    print(f"Inspecting MOHW: {url}")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        # look for file download links in mohw
        # usually /boardFileDownload.es or fileDownload or similar
        files = re.findall(r'<a[^>]+href=["\']([^"\']*(?:download|file|attach)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        print(f"Found {len(files)} file matches:")
        for href, text in files:
            clean_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
            print(f"  File: {clean_text} -> {href}")
            
def inspect_sasw_post(url):
    print(f"\nInspecting SASW: {url}")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        files = re.findall(r'<a[^>]+href=["\']([^"\']*(?:download|file|attach)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        print(f"Found {len(files)} file matches:")
        for href, text in files:
            clean_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
            print(f"  File: {clean_text} -> {href}")

if __name__ == '__main__':
    # 2026 사회복지관 운영관련 업무처리 안내
    inspect_mohw_post("https://www.mohw.go.kr/board.es?mid=a10411010100&bid=0021&act=view&list_no=1488949")
    # 2026 사회복지시설 관리안내 (SASW)
    inspect_sasw_post("https://sasw.or.kr/data5/918986")
