import urllib.request
import re

url = 'https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no=1489787'
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    # search where boardDownload.es appears
    for m in re.finditer(r'/boardDownload\.es\?bid=0026&amp;list_no=1489787&amp;seq=\d+', html):
        start = max(0, m.start() - 200)
        end = min(len(html), m.end() + 200)
        snippet = html[start:end]
        print("--- Snippet ---")
        print(re.sub(r'<[^>]+>', ' ', snippet).strip())
        print()
