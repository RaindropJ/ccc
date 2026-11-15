import urllib.request
import re

url = "https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no=1489787"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        # Find post title
        title = re.findall(r'<span class=\"view_title\">(.*?)</span>', html)
        print("Page Title:", title)
        # Find download links
        # href="/board.es?mid=...&act=fileDown..."
        downloads = re.findall(r'href=[\'"]([^\'"]*act=fileDown[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        print(f"Found {len(downloads)} download links:")
        for link, name in downloads:
            n_clean = re.sub(r'<[^>]+>', '', name).strip()
            print(f"  {n_clean} -> https://www.mohw.go.kr{link}")
except Exception as e:
    print("Error:", e)
