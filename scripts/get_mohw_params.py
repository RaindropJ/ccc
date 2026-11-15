import urllib.request
import re

url = 'https://www.mohw.go.kr/board.es?mid=a10411010300&bid=0026'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    inputs = re.findall(r'<input[^>]+name=[\'"]([^\'"]+)[\'"][^>]*>', html)
    selects = re.findall(r'<select[^>]+name=[\'"]([^\'"]+)[\'"][^>]*>', html)
    print("Inputs:", inputs)
    print("Selects:", selects)
