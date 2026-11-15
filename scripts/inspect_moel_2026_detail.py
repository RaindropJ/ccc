import urllib.request
import re

url = "https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20260500939"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        all_links = re.findall(r'<a[^>]+(?:href|onclick)=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in all_links:
            clean_t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if any(k in clean_t.lower() for k in ['pdf', 'hwp', 'hwpx', '국정과제', '다운', 'down']):
                print(f"File: {clean_t} -> {h}")
except Exception as e:
    print("Error:", e)
