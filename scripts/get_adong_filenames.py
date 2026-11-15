import urllib.request
import re

url = 'https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no=1489787'
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    # Find post title
    title_match = re.findall(r'<span class="title">([^<]+)</span>', html)
    if not title_match:
        title_match = re.findall(r'<p class="view_title">([^<]+)</p>', html)
    if not title_match:
        title_match = re.findall(r'<th>제목</th>\s*<td[^>]*>(.*?)</td>', html, re.DOTALL)
    print("Post Title:", [t.strip() for t in title_match])
    
    # Find attachments
    files = re.findall(r'/boardDownload\.es\?bid=0026&amp;list_no=1489787&amp;seq=(\d+)[^>]*>(.*?)</a>', html, re.DOTALL)
    for seq, name in files:
        print(f"Seq {seq}: {re.sub(r'<[^>]+>', '', name).strip()}")
