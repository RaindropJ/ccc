import urllib.request
import os

url = "https://www.moel.go.kr/common/downloadFile.do?file_seq=20251000761&bbs_seq=20251000292&bbs_id=29&file_ext=pdf"
dest_dir = r"docs/지침서_공식_아카이브/04_고용노동부_장애인고용공단/[출처_고용노동부_공식누리집]"
os.makedirs(dest_dir, exist_ok=True)
dest_file = os.path.join(dest_dir, "01_이재명정부_123대_국정과제.pdf")

req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20251000292'
    }
)

print(f"Downloading from {url} to {dest_file}...")
with urllib.request.urlopen(req, timeout=30) as resp:
    data = resp.read()
    with open(dest_file, 'wb') as f:
        f.write(data)
    print(f"Saved {dest_file}, size: {len(data):,} bytes ({len(data)/(1024*1024):.2f} MB)")
