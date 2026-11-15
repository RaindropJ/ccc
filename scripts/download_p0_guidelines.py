import urllib.request
import ssl
import os
import re
import time

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
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1024 * 1024:
        print(f"  Already exists and valid size ({os.path.getsize(target_path) / (1024*1024):.2f} MB), skipping.")
        return True, os.path.getsize(target_path)
        
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
            data = resp.read()
            size = len(data)
            size_mb = size / (1024 * 1024)
            print(f"  Received: {size_mb:.2f} MB")
            
            # Check content
            header = data[:10]
            print(f"  Header check: {header}")
            
            with open(target_path, "wb") as f:
                f.write(data)
                
            if b"%PDF" in header:
                print("  => Status: SUCCESS (Valid PDF)")
                return True, size
            elif b"\xd0\xcf\x11\xe0" in header or b"HWP" in data[:50]:
                print("  => Status: SUCCESS (Valid HWP/DOC document)")
                return True, size
            elif b"PK" in header:
                print("  => Status: SUCCESS (Valid ZIP / HWPX / Office document)")
                return True, size
            else:
                print("  => Status: WARNING (Unexpected header)")
                return True, size
    except Exception as e:
        print(f"  Download error: {e}")
        return False, 0

def run_p0_batch():
    base_dir = os.path.join("docs", "지침서_공식_아카이브", "01_보건복지부")
    os.makedirs(base_dir, exist_ok=True)
    
    # 1. 2026 사회복지시설 관리안내
    f1 = os.path.join(base_dir, "01_사회복지시설_관리안내_공통_2026.pdf")
    download_file("https://www.mohw.go.kr/boardDownload.es?bid=0021&list_no=1488923&seq=1", f1)
    
    # 2. 2026 사회복지관 운영관련 업무처리 안내
    f2 = os.path.join(base_dir, "02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf")
    download_file("https://www.mohw.go.kr/boardDownload.es?bid=0021&list_no=1488949&seq=1", f2)
    
    # 3. 2026 사회복지시설 종사자 인건비 가이드라인
    f3 = os.path.join(base_dir, "00_사회복지시설_종사자_인건비가이드라인_2026.pdf")
    download_file("https://www.mohw.go.kr/boardDownload.es?bid=0021&list_no=1488526&seq=1", f3)
    
    # 4. 2026 노인보건복지 사업안내 (list_no=1488990)
    print("\n--- Resolving attachments for 2026 노인보건복지 사업안내 (1488990) ---")
    elderly_atts = get_attachment_urls('0019', '1488990')
    idx = 1
    for name, link in elderly_atts:
        print(f"  Found elderly attach: {name}")
        fn = f"03_노인보건복지사업안내_{idx}권_2026.pdf"
        download_file(link, os.path.join(base_dir, fn))
        idx += 1
        
    # 5. 2026 장애인복지 사업안내 (list_no=1490835, 1487676)
    print("\n--- Resolving attachments for 장애인복지 사업안내 ---")
    disabled_atts = get_attachment_urls('0021', '1490835')
    idx = 1
    for name, link in disabled_atts:
        print(f"  Found disabled attach: {name}")
        fn = f"05_장애인복지사업안내_2026_첨부{idx}.pdf"
        download_file(link, os.path.join(base_dir, fn))
        idx += 1
        
    # 2025 장애인복지 사업안내 1권 (1487676)
    d1_atts = get_attachment_urls('0019', '1487676')
    for name, link in d1_atts:
        print(f"  Found disabled 2025 attach: {name}")
        download_file(link, os.path.join(base_dir, "05_장애인복지사업안내_1권_지역사회재활_2025.pdf"))
        break
        
    # 6. 2026 지역아동센터 지원 사업안내 (1490797)
    print("\n--- Resolving attachments for 2026 지역아동센터 지원 사업안내 (1490797) ---")
    child_atts = get_attachment_urls('0019', '1490797')
    idx = 1
    for name, link in child_atts:
        print(f"  Found child attach: {name}")
        fn = f"09_지역아동센터_지원사업안내_2026_첨부{idx}.pdf"
        download_file(link, os.path.join(base_dir, fn))
        idx += 1

if __name__ == '__main__':
    run_p0_batch()
