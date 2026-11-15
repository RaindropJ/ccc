import urllib.request
import ssl
import re
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.gne.go.kr/user/bbs/BD_selectBbs.do?q_bbsSn=1425&q_bbsDocNo=20250630133622749"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    print("Edu page size:", len(html))
    matches = re.findall(r'<a[^>]+href=["\']([^"\']*(?:fileDown|download|down)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.I)
    print("Edu matches:", matches)
    for href, text in matches:
        clean = re.sub(r'<[^>]+>', '', text).strip()
        print(f"  Edu File: {clean} -> {href}")
        down_url = href if href.startswith('http') else "https://www.gne.go.kr" + href
        save_path = os.path.join("docs", "지침서_공식_아카이브", "03_교육부_한국교육개발원", "[출처_한국교육개발원_KEDI]", "01_교육복지우선지원사업_운영매뉴얼_학교사회복지.pdf")
        req2 = urllib.request.Request(down_url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': url})
        with urllib.request.urlopen(req2, context=ctx, timeout=30) as resp2:
            data = resp2.read()
            print(f"  Downloaded: {len(data)/(1024*1024):.2f} MB, Header: {data[:10]}")
            with open(save_path, "wb") as f:
                f.write(data)
            print("  => Edu manual saved!")
