import urllib.request
import re

url = "https://www.moel.go.kr/policy/policydata/list.do"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        selects = re.findall(r'<select[^>]+id=[\'"]searchField[\'"][^>]*>(.*?)</select>', html, re.DOTALL)
        for s in selects:
            print("searchField options:", s)
except Exception as e:
    print("Error:", e)
