import urllib.request
import urllib.parse
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
    'Referer': 'https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?bbtSn=705022&mid=plc503'
}

def download_mogef_family_manual(atfileSeq, filename):
    # 1. visit page to get session cookies
    page_url = 'https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?bbtSn=705022&mid=plc503'
    req1 = urllib.request.Request(page_url, headers=headers)
    resp1 = opener.open(req1)
    
    # 2. post to download
    post_url = 'https://www.mogef.go.kr/plc/down.do'
    data = urllib.parse.urlencode({
        'bbid': 'plc503',
        'bbtSn': '705022',
        'atfileSn': '706142',
        'atfileSeq': str(atfileSeq)
    }).encode('utf-8')
    
    req2 = urllib.request.Request(post_url, data=data, headers=headers)
    resp2 = opener.open(req2)
    content = resp2.read()
    
    target_dir = os.path.join("docs", "지침서_공식_아카이브", "02_성평등가족부_여가부", "[출처_한국건강가정진흥원_패밀리넷]")
    os.makedirs(target_dir, exist_ok=True)
    save_path = os.path.join(target_dir, filename)
    
    size_mb = len(content) / (1024 * 1024)
    print(f"Downloaded {filename}: {size_mb:.2f} MB, Header: {content[:10]}")
    with open(save_path, "wb") as f:
        f.write(content)
    print(f"  => SUCCESS: Saved to {save_path}")

if __name__ == '__main__':
    download_mogef_family_manual(1, "01_가족센터_사업안내_1권_2025.pdf")
    download_mogef_family_manual(2, "01_가족센터_사업안내_2권_2025.pdf")
