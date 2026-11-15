import urllib.request
import re

url = 'https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no=1489787'
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        # Look for table or board view
        matches = re.findall(r'<div class="board_view[^"]*">(.*?)</div>\s*<!-- //board_view -->', html, re.DOTALL)
        if not matches:
            matches = re.findall(r'<div class="view_cont[^"]*">(.*?)</div>', html, re.DOTALL)
        for m in matches:
            print("View content preview:", m[:500])
        # Look for all links containing 'mohw.go.kr' or 'file'
        all_links = re.findall(r'href="([^"]+)"', html)
        for l in all_links:
            if 'file' in l.lower() or 'down' in l.lower() or 'list_no=1489787' in l:
                print("Relevant link:", l)
except Exception as e:
    print("Error:", e)
