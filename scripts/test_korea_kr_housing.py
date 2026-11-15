import urllib.request
import urllib.parse
import re

url = "https://www.korea.kr/archive/expDocList.do"
params = urllib.parse.urlencode({
    'searchTerm': '주거급여 사업안내'
})

req = urllib.request.Request(
    f"{url}?{params}",
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Korea.kr archive length: {len(html)}")
        matches = re.findall(r'<a[^>]+href=["\']([^"\']*expDocView\.do[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in matches:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            print(f"- {clean} -> {h}")
except Exception as e:
    print("Error:", e)
