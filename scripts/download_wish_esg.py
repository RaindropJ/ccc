import urllib.request
import ssl
import re
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://wish.welfare.seoul.kr/swflmsfront/board/boardr.do?bmno=10015&opno=10007&bno=102034"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    print("WISH ESG page size:", len(html))
    matches = re.findall(r'<a[^>]+href=["\']([^"\']*(?:fileDown|download|down)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.I)
    print("Matches:", matches)
    for href, text in matches:
        clean = re.sub(r'<[^>]+>', '', text).strip()
        print(f"  File: {clean} -> {href}")
        down_url = href if href.startswith('http') else "https://wish.welfare.seoul.kr" + href
        save_path = os.path.join("docs", "지침서_공식_아카이브", "08_사회공헌센터_ESG_사회적경제", "[출처_한국사회복지관협회_WISH]", "01_사회복지관_ESG_실천가이드_한국사회복지관협회.pdf")
        req2 = urllib.request.Request(down_url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': url})
        with urllib.request.urlopen(req2, context=ctx, timeout=30) as resp2:
            data = resp2.read()
            print(f"  Downloaded: {len(data)/(1024*1024):.2f} MB, Header: {data[:10]}")
            with open(save_path, "wb") as f:
                f.write(data)
            print("  => Saved successfully!")
