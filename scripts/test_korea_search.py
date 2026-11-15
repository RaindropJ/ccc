import urllib.request
import urllib.parse
import re

query = urllib.parse.quote("주거급여 사업안내")
url = f"https://www.korea.kr/search/search.do?query={query}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Korea search length: {len(html)}")
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links[:30]:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if any(k in clean for k in ['주거급여', '사업안내', '국토']):
                print(f"- {clean} -> {h}")
except Exception as e:
    print("Error:", e)
