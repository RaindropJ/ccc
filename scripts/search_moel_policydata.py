import urllib.request
import urllib.parse
import re

url = "https://www.moel.go.kr/policy/policydata/list.do"
params = urllib.parse.urlencode({
    'searchField': 'all',
    'searchText': '국정과제',
    'pageIndex': '1'
})

req = urllib.request.Request(
    f"{url}?{params}",
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Policy data list length: {len(html)}")
        
        # Look for links to view.do
        links = re.findall(r'<a[^>]+href=[\'"]([^\'"]*view\.do[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        print(f"Found {len(links)} view links:")
        for href, text in links[:15]:
            t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
            print(f"- {t} -> {href}")
            
        # Also find table rows
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        for r in rows:
            if '국정과제' in r:
                cells = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL)]
                print("Row with 국정과제:", cells)
except Exception as e:
    print("Error:", e)
