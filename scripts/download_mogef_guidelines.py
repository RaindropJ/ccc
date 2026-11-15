import urllib.request
import ssl
import os
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mogef.go.kr/'
}

def get_mogef_pdf_link(doc_id):
    url = f"https://www.mogef.go.kr/io/lib/lib_v200.do?id={doc_id}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'/io/lib/down\.do\?file=[^\'"\s>]+', html)
            if matches:
                return f"https://www.mogef.go.kr{matches[0]}"
    except Exception as e:
        print(f"Error fetching MOGEF id={doc_id}: {e}")
    return None

def download_mogef_file(url, target_path):
    print(f"\n[DOWNLOAD MOGEF] {os.path.basename(target_path)}")
    print(f"  URL: {url}")
    if os.path.exists(target_path) and os.path.getsize(target_path) > 500 * 1024:
        print(f"  Already exists and valid size ({os.path.getsize(target_path)/(1024*1024):.2f} MB), skipping.")
        return True
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
            data = resp.read()
            size_mb = len(data) / (1024 * 1024)
            print(f"  Received: {size_mb:.2f} MB, Header: {data[:10]}")
            with open(target_path, "wb") as f:
                f.write(data)
            print(f"  => SUCCESS: Saved to {target_path}")
            return True
    except Exception as e:
        print(f"  Download error: {e}")
        return False

def run_mogef_batch():
    target_dir = os.path.join("docs", "지침서_공식_아카이브", "02_성평등가족부_여가부")
    os.makedirs(target_dir, exist_ok=True)
    
    # 1. 2026 가족사업안내(I) - id=31042
    l1 = get_mogef_pdf_link('31042')
    if l1:
        download_mogef_file(l1, os.path.join(target_dir, "01_가족센터_사업안내_1권_가족서비스_2026.pdf"))
        
    # 2. 2026 가족사업안내(II) - id=31043
    l2 = get_mogef_pdf_link('31043')
    if l2:
        download_mogef_file(l2, os.path.join(target_dir, "01_가족센터_사업안내_2권_다문화_한부모_2026.pdf"))
        
    # 3. 2025 가족사업안내(I) - id=31037 (백업)
    # 4. 2025 청소년백서 - id=31039
    l3 = get_mogef_pdf_link('31039')
    if l3:
        download_mogef_file(l3, os.path.join(target_dir, "02_청소년백서_청소년복지총람_2025.pdf"))

if __name__ == '__main__':
    run_mogef_batch()
