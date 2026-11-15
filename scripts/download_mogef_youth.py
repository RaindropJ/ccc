import urllib.request
import urllib.parse
import http.cookiejar
import ssl
import os
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(
    urllib.request.HTTPCookieProcessor(cj),
    urllib.request.HTTPSHandler(context=ctx)
)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
}

def download_mogef_post_files(bbtSn, mid, target_folder, prefix_name):
    page_url = f'https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?bbtSn={bbtSn}&mid={mid}'
    req1 = urllib.request.Request(page_url, headers=headers)
    resp1 = opener.open(req1)
    html = resp1.read().decode('utf-8', errors='ignore')
    
    # find fn_fileDownload
    matches = re.findall(r'fn_fileDownload\([\'"](\d+)[\'"],\s*[\'"](\d+)[\'"]\).*?>(.*?)<', html)
    print(f"[{bbtSn}] Found {len(matches)} files")
    os.makedirs(target_folder, exist_ok=True)
    
    for atfileSn, atfileSeq, text in matches:
        clean_text = text.strip()
        print(f"  Downloading: {clean_text} (sn={atfileSn}, seq={atfileSeq})")
        post_url = 'https://www.mogef.go.kr/plc/down.do'
        data = urllib.parse.urlencode({
            'bbid': mid,
            'bbtSn': bbtSn,
            'atfileSn': atfileSn,
            'atfileSeq': atfileSeq
        }).encode('utf-8')
        
        req2 = urllib.request.Request(post_url, data=data, headers={'User-Agent': headers['User-Agent'], 'Referer': page_url})
        resp2 = opener.open(req2)
        content = resp2.read()
        
        header = content[:10]
        ext = ".pdf"
        if b"%PDF" in header: ext = ".pdf"
        elif b"\xd0\xcf\x11\xe0" in header: ext = ".hwp"
        elif b"PK" in header: ext = ".hwpx"
        
        fname = f"{prefix_name}_{clean_text}"
        if not fname.lower().endswith(('.pdf', '.hwp', '.hwpx')):
            fname += ext
            
        save_path = os.path.join(target_folder, fname)
        with open(save_path, "wb") as f:
            f.write(content)
        print(f"    Saved: {save_path} ({len(content)/(1024*1024):.2f} MB, Header: {header})")

if __name__ == '__main__':
    youth_folder = os.path.join("docs", "지침서_공식_아카이브", "02_성평등가족부_여가부", "[출처_한국청소년상담복지개발원]")
    # 704878: 청소년복지시설현황(청소년쉼터, 자립지원관, 회복지원시설)
    download_mogef_post_files('704878', 'plc502', youth_folder, '02_청소년복지시설_쉼터_자립지원관_현황')
    # 704876: 2025 청소년백서
    download_mogef_post_files('704876', 'plc502', youth_folder, '02_청소년백서_2025')
