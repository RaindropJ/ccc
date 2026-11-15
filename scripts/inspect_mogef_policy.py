import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
url = 'https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?bbtSn=705022&mid=plc503'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    print('Size:', len(html))
    for m in re.finditer(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL):
        href = m.group(1)
        text = re.sub(r'<[^>]+>', '', m.group(2)).strip()
        if any(k in text for k in ['가족', '안내', '다운로드', '첨부', 'pdf', 'hwp', '다운']):
            print(f"Match: {text} -> {href}")
    for line in html.splitlines():
        if any(k in line for k in ['다운로드', 'fn_download', 'down', '첨부파일', '.pdf', '.hwp']):
            if len(line.strip()) < 300:
                print("Line:", line.strip())
