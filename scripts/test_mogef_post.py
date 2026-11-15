import urllib.request
import urllib.parse
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mogef.go.kr/io/lib/lib_v200.do?id=31042'
}

def test_mogef_post_download():
    # check detail page 31042
    url = 'https://www.mogef.go.kr/io/lib/lib_v200.do?id=31042'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        for line in html.splitlines():
            if 'fn_oleDownload' in line or 'download(' in line or 'down.do' in line or 'infile' in line:
                print(line.strip())

if __name__ == '__main__':
    test_mogef_post_download()
