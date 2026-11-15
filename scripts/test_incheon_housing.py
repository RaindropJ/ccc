import urllib.request
import urllib.parse
import re

url = "https://www.incheon.go.kr/portal/bbs"
params = urllib.parse.urlencode({
    'bbsId': 'BBS_0000000000000001',
    'searchCnd': '0',
    'searchWrd': '주거급여 사업안내'
})

req = urllib.request.Request(
    f"https://www.incheon.go.kr/welfare/WE030101?searchWrd=%EC%A3%BC%EA%B1%B0%EA%B8%89%EC%97%AC",
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Incheon length: {len(html)}")
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in links:
            clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if '주거급여' in clean:
                print(f"- {clean} -> {h}")
except Exception as e:
    print("Error:", e)
