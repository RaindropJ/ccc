import urllib.request
import urllib.parse
import re

url = "https://www.moel.go.kr/info/publict/publictList.do"
params = urllib.parse.urlencode({
    'searchField': 'all',
    'searchText': '국정과제',
    'pageIndex': '1'
}).encode('utf-8')

req = urllib.request.Request(
    url,
    data=params,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Response status: {resp.status}, length: {len(html)}")
        
        # Look for table rows or links
        items = re.findall(r'<a[^>]+href=[\'"]([^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        matched = []
        for href, text in items:
            t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
            if '국정과제' in t or 'publictDetail' in href:
                matched.append((t, href))
        
        print(f"Matched {len(matched)} items:")
        for t, h in matched[:20]:
            print(f"- {t} -> {h}")
except Exception as e:
    print("Error:", e)
