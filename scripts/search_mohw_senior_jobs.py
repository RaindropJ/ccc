import urllib.request
import urllib.parse
import re

url = "https://www.mohw.go.kr/board.es"
params = urllib.parse.urlencode({
    'mid': 'a10411010300',
    'bid': '0026',
    'act': 'list',
    's_key': 'title',
    's_text': '노인일자리'
})

req = urllib.request.Request(
    f"{url}?{params}",
    headers={'User-Agent': 'Mozilla/5.0'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        posts = re.findall(r'<a[^>]+href=[\'"]([^\'"]*act=view[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for link, title in posts:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
            print(clean, "->", link)
except Exception as e:
    print("Error:", e)
