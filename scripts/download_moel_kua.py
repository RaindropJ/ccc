import urllib.request
import os

url = "https://www.moel.go.kr/common/downloadFile.do?file_seq=20260100622&bbs_seq=20251201817&bbs_id=29&file_ext=pdf"
dest_folder = r"docs/지침서_공식_아카이브/04_고용노동부_장애인고용공단/[출처_고용노동부_공식누리집]"
os.makedirs(dest_folder, exist_ok=True)
dest_path = os.path.join(dest_folder, "02_국민취업지원제도_업무매뉴얼_2026.pdf")

req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20251201817'
    }
)

print(f"Downloading {url} to {dest_path}...")
try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
        print("Downloaded bytes:", len(data))
        with open(dest_path, "wb") as f:
            f.write(data)
        print(f"Saved: {dest_path} ({len(data)/(1024*1024):.2f} MB)")
except Exception as e:
    print("Download error:", e)
