import urllib.request
import re

url = "https://www.moel.go.kr/policy/policydata/list.do"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        # print form with searchText
        forms = re.findall(r'<form[^>]*>(.*?)</form>', html, re.DOTALL)
        for f in forms:
            if 'searchText' in f:
                print("Form details:\n", f[:1000])
except Exception as e:
    print("Error:", e)
