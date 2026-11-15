import urllib.request
import ssl
import os
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
}

def download_sasw_post_files(doc_id, target_folder, prefix_name):
    url = f"https://sasw.or.kr/data5/{doc_id}"
    req = urllib.request.Request(url, headers={'User-Agent': headers['User-Agent'], 'Referer': 'https://sasw.or.kr/data5'})
    os.makedirs(target_folder, exist_ok=True)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*procFileDownload[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            print(f"[{doc_id}] Found {len(matches)} files")
            for href, name in matches:
                clean_name = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', name)).strip()
                down_url = f"https://sasw.or.kr{href.replace('&amp;', '&')}"
                print(f"  Downloading: {clean_name}")
                
                req2 = urllib.request.Request(down_url, headers={'User-Agent': headers['User-Agent'], 'Referer': url})
                with urllib.request.urlopen(req2, context=ctx, timeout=60) as resp2:
                    data = resp2.read()
                    size_mb = len(data) / (1024 * 1024)
                    header = data[:10]
                    
                    ext = ".pdf"
                    if b"%PDF" in header:
                        ext = ".pdf"
                    elif b"\xd0\xcf\x11\xe0" in header:
                        ext = ".hwp"
                    elif b"PK" in header:
                        ext = ".hwpx"
                    
                    save_name = f"{prefix_name}_{clean_name}"
                    if not save_name.lower().endswith(('.pdf', '.hwp', '.hwpx')):
                        save_name += ext
                        
                    save_path = os.path.join(target_folder, save_name)
                    with open(save_path, "wb") as f:
                        f.write(data)
                    print(f"    Saved: {save_path} ({size_mb:.2f} MB, Header: {header})")
    except Exception as e:
        print(f"Error on doc_id={doc_id}: {e}")

if __name__ == '__main__':
    mohw_folder = os.path.join("docs", "지침서_공식_아카이브", "01_보건복지부")
    
    # 2026 사회복지법인 관리안내 (918966)
    download_sasw_post_files('918966', mohw_folder, '00_사회복지법인_관리안내_2026')
    
    # 2026 긴급복지지원사업 안내 (919368)
    download_sasw_post_files('919368', mohw_folder, '16_긴급복지지원사업안내_2026')
    
    # 2024 노숙인 등의 복지사업안내 (725929)
    download_sasw_post_files('725929', mohw_folder, '12_노숙인_등의_복지사업안내_2024')
    
    # 2023 아동분야 사업안내 (647189)
    download_sasw_post_files('647189', mohw_folder, '07_아동분야사업안내_2023')
    
    # 2023 다함께돌봄 사업안내 (640512)
    download_sasw_post_files('640512', mohw_folder, '09_다함께돌봄사업안내_2023')
