import urllib.request
import urllib.parse
import re

url = "https://www.moel.go.kr/policy/policydata/list.do"
params = urllib.parse.urlencode({
    'pageIndex': '1',
    'searchKey': '',
    'searchField': '1',
    'searchText': '국정과제'
})

req = urllib.request.Request(
    f"{url}?{params}",
    headers={'User-Agent': 'Mozilla/5.0'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Look for table rows
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        print(f"Total rows: {len(rows)}")
        for r in rows:
            cells = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL)]
            links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', r)
            if cells:
                print("Row:", cells, "Links:", links)
except Exception as e:
    print("Error:", e)
