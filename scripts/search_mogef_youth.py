import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def search_mogef_youth():
    url = 'https://www.mogef.go.kr/mp/pcd/mp_pcd_s001.do?mid=plc502'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("Youth page size:", len(html))
        # look for posts
        matches = re.findall(r'<a[^>]+href=["\']([^"\']*bbtSn=(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for href, bbtSn, title in matches:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
            print(f"[{bbtSn}] {clean}")

if __name__ == '__main__':
    search_mogef_youth()
