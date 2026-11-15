import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def check_chest():
    print("=== Checking 사랑의열매 (chest.or.kr) ===")
    # 사랑의열매 배분사업안내서
    url = "https://www.chest.or.kr/ca/guidance/initGuidance.do"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"Chest size: {len(html)}")
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if any(k in clean for k in ['배분', '안내', '신청', '사업안내', '가이드']):
                    print(f"  {clean} -> {href}")
    except Exception as e:
        print(f"Chest error: {e}")

def check_crckorea():
    print("\n=== Checking 사회공헌센터 (crckorea.kr) ===")
    url = "https://www.crckorea.kr/data/guidelines"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"CRC size: {len(html)}")
    except Exception as e:
        print(f"CRC error: {e}")

if __name__ == '__main__':
    check_chest()
    check_crckorea()
