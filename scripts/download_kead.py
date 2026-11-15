import urllib.request
import ssl
import re
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.kead.or.kr/bbs/publication/bbsView.do?bbsCnId=124051&menuId=MENU0787"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    print("KEAD page size:", len(html))
    matches = re.findall(r'<a[^>]+href=["\']([^"\']*(?:fileDown|download|down|\.pdf)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.I)
    print("KEAD matches:", matches)
    for href, text in matches:
        clean = re.sub(r'<[^>]+>', '', text).strip()
        print(f"  KEAD File: {clean} -> {href}")
        down_url = href if href.startswith('http') else "https://www.kead.or.kr" + href.replace('&amp;', '&')
        save_path = os.path.join("docs", "지침서_공식_아카이브", "04_고용노동부_장애인고용공단", "[출처_한국장애인고용공단]", "01_장애인직업능력개발_및_취업지원_사업안내_한국장애인고용공단.pdf")
        req2 = urllib.request.Request(down_url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': url})
        with urllib.request.urlopen(req2, context=ctx, timeout=30) as resp2:
            data = resp2.read()
            print(f"  Downloaded: {len(data)/(1024*1024):.2f} MB, Header: {data[:10]}")
            with open(save_path, "wb") as f:
                f.write(data)
            print("  => KEAD saved!")
