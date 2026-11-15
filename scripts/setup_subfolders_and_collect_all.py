import os
import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

base_dir = os.path.join("docs", "지침서_공식_아카이브")

# Create target subfolders
subfolders = {
    "familynet": os.path.join(base_dir, "02_성평등가족부_여가부", "[출처_한국건강가정진흥원_패밀리넷]"),
    "kyci": os.path.join(base_dir, "02_성평등가족부_여가부", "[출처_한국청소년상담복지개발원]"),
    "kedi": os.path.join(base_dir, "03_교육부_한국교육개발원", "[출처_한국교육개발원_KEDI]"),
    "kead": os.path.join(base_dir, "04_고용노동부_장애인고용공단", "[출처_한국장애인고용공단]"),
    "chest": os.path.join(base_dir, "06_사회복지공동모금회_사랑의열매", "[출처_사랑의열매_배분포털]"),
    "wish_esg": os.path.join(base_dir, "08_사회공헌센터_ESG_사회적경제", "[출처_한국사회복지관협회_WISH]")
}

for k, p in subfolders.items():
    os.makedirs(p, exist_ok=True)
    print(f"Created subfolder: {p}")

def download_and_verify(url, target_path, referer=None, min_size_kb=50):
    print(f"\n[FETCH] {os.path.basename(target_path)}")
    print(f"  URL: {url}")
    req_headers = headers.copy()
    if referer:
        req_headers['Referer'] = referer
    req = urllib.request.Request(url, headers=req_headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = resp.read()
            sz_mb = len(data) / (1024 * 1024)
            header = data[:10]
            print(f"  Received: {sz_mb:.2f} MB, Header: {header}")
            
            base_no_ext, ext = os.path.splitext(target_path)
            if b"%PDF" in header:
                final_path = base_no_ext + ".pdf"
            elif b"\xd0\xcf\x11\xe0" in header:
                final_path = base_no_ext + ".hwp"
            elif b"PK" in header:
                final_path = base_no_ext + ".hwpx"
            else:
                final_path = target_path
                
            if len(data) >= min_size_kb * 1024:
                with open(final_path, "wb") as f:
                    f.write(data)
                print(f"  => SUCCESS: Saved to {final_path}")
                return True
            else:
                print(f"  => FAILED: Size too small ({len(data)} bytes)")
                return False
    except Exception as e:
        print(f"  => Error: {e}")
        return False

print("Setup completed.")
