import urllib.request
import ssl
import json
import re
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def check_sasw():
    print("=== Checking SASW data5 ===")
    url = 'https://sasw.or.kr/data5'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"SASW accessed, size: {len(html)}")
            # look for article links
            # Typically sasw links are like /data5/12345 or similar
            matches = re.findall(r'href=["\'](/data5/\d+[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            print(f"Found {len(matches)} article links")
            for href, text in matches[:15]:
                clean_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if clean_text:
                    print(f"  {clean_text} -> https://sasw.or.kr{href}")
    except Exception as e:
        print(f"SASW Error: {e}")

def check_mohw_board(bid, name):
    print(f"\n=== Checking MOHW {name} (bid={bid}) ===")
    url = f"https://www.mohw.go.kr/board.es?mid=a10411010100&bid={bid}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"MOHW {name} accessed, size: {len(html)}")
            # find list items
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*board\.es\?[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            found = 0
            for href, text in matches:
                clean_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if any(k in clean_text for k in ['사업안내', '지침', '관리안내', '가이드라인', '노인', '장애인', '아동', '복지관']):
                    print(f"  [{name}] {clean_text} -> https://www.mohw.go.kr{href}")
                    found += 1
                    if found >= 10:
                        break
    except Exception as e:
        print(f"MOHW {name} Error: {e}")

if __name__ == '__main__':
    check_sasw()
    check_mohw_board('0019', '발간자료')
    check_mohw_board('0021', '법인시설단체')
