import urllib.request
import re

url = "https://www.moel.go.kr/info/publict/publictList.do"
req = urllib.request.Request(
    url,
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        # print form action and inputs
        forms = re.findall(r'<form[^>]*>(.*?)</form>', html, re.DOTALL)
        for f in forms:
            if 'publict' in f:
                inputs = re.findall(r'<input[^>]+name=[\'"]([^\'"]+)[\'"][^>]*>', f)
                print("Form inputs:", inputs)
        
        # print table
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        print("Total rows:", len(rows))
        for r in rows[:5]:
            cells = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL)]
            if cells:
                print("Row:", cells)
except Exception as e:
    print("Error:", e)
