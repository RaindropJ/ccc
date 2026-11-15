import urllib.request
import ssl
import os
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mohw.go.kr/'
}

def test_download():
    url = "https://www.mohw.go.kr/boardDownload.es?bid=0021&list_no=1488949&seq=1"
    save_path = os.path.join("docs", "지침서_공식_아카이브", "01_보건복지부", "02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf")
    
    print(f"Downloading from: {url}")
    print(f"Saving to: {save_path}")
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        content_type = resp.headers.get('Content-Type')
        content_disposition = resp.headers.get('Content-Disposition')
        print(f"Content-Type: {content_type}")
        print(f"Content-Disposition: {content_disposition}")
        
        data = resp.read()
        size_mb = len(data) / (1024 * 1024)
        print(f"Downloaded bytes: {len(data)} ({size_mb:.2f} MB)")
        
        with open(save_path, "wb") as f:
            f.write(data)
            
        # check header
        with open(save_path, "rb") as f:
            header = f.read(10)
            print(f"Header: {header}")
            if b"%PDF" in header:
                print(">>> SUCCESS: Valid PDF file verified!")
            else:
                print(">>> WARNING: Header is not PDF (could be HWP or HTML)")

if __name__ == '__main__':
    test_download()
