import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.kordi.or.kr/kordi/cop/bbs/BBSMSTR_000000000101/selectBoardList.do"
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Board length: {len(html)}")
        links = re.findall(r'<a[^>]+href=[\'"]([^\'"]*selectBoardArticle\.do[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links:
            clean_t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            print(f"- {clean_t} -> {h}")
except Exception as e:
    print("Error:", e)
