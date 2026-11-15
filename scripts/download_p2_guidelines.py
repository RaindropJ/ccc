import urllib.request
import ssl
import os
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def safe_download(url, target_path, min_size_kb=50):
    print(f"\n[DOWNLOAD] {os.path.basename(target_path)}")
    print(f"  URL: {url}")
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    if os.path.exists(target_path) and os.path.getsize(target_path) > min_size_kb * 1024:
        print(f"  Already exists ({os.path.getsize(target_path)/(1024*1024):.2f} MB), skipping.")
        return True
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = resp.read()
            size_mb = len(data) / (1024 * 1024)
            header = data[:10]
            print(f"  Received: {size_mb:.2f} MB, Header: {header}")
            
            base, ext = os.path.splitext(target_path)
            if b"%PDF" in header:
                final_path = base + ".pdf"
            elif b"\xd0\xcf\x11\xe0" in header:
                final_path = base + ".hwp"
            elif b"PK" in header:
                final_path = base + ".hwpx"
            else:
                final_path = target_path
                
            with open(final_path, "wb") as f:
                f.write(data)
            print(f"  => SUCCESS: Saved to {final_path}")
            return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

if __name__ == '__main__':
    # 1. ESG 가이드라인 (한국사회복지관협회 / WISH)
    # 2. 사회적기업 인증 업무지침
    # 3. KCOC 인도적지원 가이드라인
    # 4. 사랑의열매 배분사업안내
    # Let's inspect their exact links or download them
    print("Download script ready.")
