import urllib.request, ssl, re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
req = urllib.request.Request('https://proposal.chest.or.kr/main/main.do', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    for m in re.finditer(r'href=["\']([^"\']+)["\']', html):
        print(m.group(1))
    for m in re.finditer(r'onclick=["\']([^"\']+)["\']', html):
        print("onclick:", m.group(1))
