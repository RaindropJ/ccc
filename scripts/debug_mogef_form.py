import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}
url = 'https://www.mogef.go.kr/io/lib/lib_v200.do?id=31042'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    for m in re.finditer(r'fn_oleDownload\((.*?)\)', html):
        print('fn_oleDownload:', m.group(0))
    match_form = re.search(r'<form[^>]+gnrFileDownForm[^>]*>.*?</form>', html, re.DOTALL)
    if match_form:
        print('Form:', match_form.group(0))
    for line in html.splitlines():
        if 'WR025082' in line or 'down.do' in line or 'fDirectory' in line:
            print('Line:', line.strip())
