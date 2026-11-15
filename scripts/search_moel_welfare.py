import urllib.request
import urllib.parse
import re

url = "https://www.moel.go.kr/policy/policydata/list.do"

for kw in ['사회적기업', '국민취업지원제도', '장애인고용']:
    params = urllib.parse.urlencode({
        'pageIndex': '1',
        'searchKey': '',
        'searchField': '1',
        'searchText': kw
    })
    req = urllib.request.Request(f"{url}?{params}", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
            print(f"\n=== Search MOEL: '{kw}' ===")
            for r in rows[:5]:
                cells = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL)]
                links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', r)
                if cells:
                    print("Row:", cells, "Links:", links)
    except Exception as e:
        print(f"Error for {kw}:", e)
