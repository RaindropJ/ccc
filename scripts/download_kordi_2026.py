import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.kordi.or.kr/cws/board/board.do?mode=download&bid=266&cid=643625&filename=643625_202603120930572400.pdf"
dest_folder = r"docs/지침서_공식_아카이브/01_보건복지부/[출처_한국노인인력개발원_KORDI]"
os.makedirs(dest_folder, exist_ok=True)
dest_path = os.path.join(dest_folder, "03_노인일자리_및_사회활동지원사업_운영안내_2026.pdf")

req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.kordi.or.kr/content.do?bid=266&mode=view&cid=643625&cmsId=179'
    }
)

print(f"Downloading {url} to {dest_path}...")
try:
    with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
        data = resp.read()
        print("Downloaded bytes:", len(data))
        print("Header:", data[:10])
        with open(dest_path, "wb") as f:
            f.write(data)
        print(f"Saved: {dest_path} ({len(data)/(1024*1024):.2f} MB)")
        
        # Remove old 2024 version from SASW folder
        old_2024 = r"docs/지침서_공식_아카이브/01_보건복지부/[출처_서울시사회복지사협회_자료실]/03_노인일자리_및_사회활동지원사업_운영안내_2024.pdf"
        if os.path.exists(old_2024):
            os.remove(old_2024)
            print("Removed old 2024 version:", old_2024)
except Exception as e:
    print("Download error:", e)
