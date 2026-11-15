import urllib.request
import re

url = "https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20251201817"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]+href=["\'](/common/downloadFile\.do\?[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in matches:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            print("File:", clean, "->", h)
except Exception as e:
    print("Error:", e)
