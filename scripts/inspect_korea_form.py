import urllib.request
import re

url = "https://www.korea.kr/archive/expDocList.do"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        forms = re.findall(r'<form[^>]*>(.*?)</form>', html, re.DOTALL)
        for f in forms:
            if 'expDoc' in f or 'search' in f:
                inputs = re.findall(r'<input[^>]+name=["\']([^"\']+)["\'][^>]*>', f)
                selects = re.findall(r'<select[^>]+name=["\']([^"\']+)["\'][^>]*>', f)
                print("Form inputs:", inputs, "selects:", selects)
except Exception as e:
    print("Error:", e)
