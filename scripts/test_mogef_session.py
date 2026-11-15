import urllib.request
import http.cookiejar
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(
    urllib.request.HTTPCookieProcessor(cj),
    urllib.request.HTTPSHandler(context=ctx)
)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mogef.go.kr/io/lib/lib_v200.do?id=31042'
}

def test_session_download():
    # 1. visit detail page
    detail_url = 'https://www.mogef.go.kr/io/lib/lib_v200.do?id=31042'
    req1 = urllib.request.Request(detail_url, headers=headers)
    resp1 = opener.open(req1)
    print("Page 1 cookies:", [c.name for c in cj])
    
    # 2. visit download url
    down_url = 'https://www.mogef.go.kr/io/lib/down.do?file=WR025082.PDF'
    req2 = urllib.request.Request(down_url, headers=headers)
    resp2 = opener.open(req2)
    data = resp2.read()
    print(f"Down response size: {len(data)}, header: {data[:20]}")

if __name__ == '__main__':
    test_session_download()
