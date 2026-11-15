import urllib.request
import ssl
import os
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mohw.go.kr/'
}

def get_attachment_urls(bid, list_no):
    url = f"https://www.mohw.go.kr/board.es?mid=a10411010100&bid={bid}&act=view&list_no={list_no}"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'href=["\'](/boardDownload\.es\?[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                results.append((clean, f"https://www.mohw.go.kr{href.replace('&amp;', '&')}"))
    except Exception as e:
        print(f"Error fetching view list_no={list_no}: {e}")
    return results

def download_file(url, target_path):
    print(f"\n[DOWNLOAD] {os.path.basename(target_path)}")
    print(f"  URL: {url}")
    if os.path.exists(target_path) and os.path.getsize(target_path) > 300 * 1024:
        print(f"  Already exists and valid size ({os.path.getsize(target_path) / (1024*1024):.2f} MB), skipping.")
        return True, os.path.getsize(target_path)
        
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
            data = resp.read()
            size = len(data)
            size_mb = size / (1024 * 1024)
            print(f"  Received: {size_mb:.2f} MB")
            
            header = data[:10]
            print(f"  Header check: {header}")
            
            base_no_ext, ext = os.path.splitext(target_path)
            if b"%PDF" in header:
                final_path = base_no_ext + ".pdf"
            elif b"\xd0\xcf\x11\xe0" in header:
                final_path = base_no_ext + ".hwp"
            elif b"PK" in header:
                final_path = base_no_ext + ".hwpx"
            else:
                final_path = target_path
                
            with open(final_path, "wb") as f:
                f.write(data)
                
            print(f"  => Saved to: {final_path}")
            return True, size
    except Exception as e:
        print(f"  Download error: {e}")
        return False, 0

def run_more_batch():
    base_dir = os.path.join("docs", "지침서_공식_아카이브", "01_보건복지부")
    os.makedirs(base_dir, exist_ok=True)
    
    # 1. 2026 의료급여 사업 안내 (1491653)
    atts = get_attachment_urls('0019', '1491653')
    if atts:
        download_file(atts[0][1], os.path.join(base_dir, "10_의료급여사업안내_2026.pdf"))
        
    # 2. 2026 아동보호서비스 업무 매뉴얼 (1490500)
    atts = get_attachment_urls('0019', '1490500')
    if atts:
        download_file(atts[0][1], os.path.join(base_dir, "08_아동보호서비스_업무매뉴얼_2026.pdf"))
        
    # 3. 2026 자살예방사업 안내 (1489837)
    atts = get_attachment_urls('0019', '1489837')
    if atts:
        download_file(atts[0][1], os.path.join(base_dir, "11_자살예방사업안내_2026.pdf"))
        
    # 4. 2026 사회복지자원봉사(VMS) 사업 지침 (1490848)
    atts = get_attachment_urls('0019', '1490848')
    if atts:
        download_file(atts[0][1], os.path.join(base_dir, "00_사회복지자원봉사_사업지침_VMS_2026.pdf"))
        
    # 5. 2026 시도 사회서비스원 표준운영지침 (1489262)
    atts = get_attachment_urls('0019', '1489262')
    if atts:
        download_file(atts[0][1], os.path.join(base_dir, "15_시도사회서비스원_표준운영지침_2026.pdf"))

if __name__ == '__main__':
    run_more_batch()
