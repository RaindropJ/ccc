import urllib.request
import re

url = "https://www.moel.go.kr/policy/policydata/list.do"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        forms = re.findall(r'<form[^>]*>(.*?)</form>', html, re.DOTALL)
        for f in forms:
            inputs = re.findall(r'<input[^>]+name=[\'"]([^\'"]+)[\'"][^>]*>', f)
            selects = re.findall(r'<select[^>]+name=[\'"]([^\'"]+)[\'"][^>]*>', f)
            print("Inputs:", inputs, "Selects:", selects)
except Exception as e:
    print("Error:", e)
