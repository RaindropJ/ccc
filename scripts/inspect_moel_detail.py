import urllib.request
import re

url = "https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20251000292"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"View page length: {len(html)}")
        
        # Look for attachments
        files = re.findall(r'<a[^>]+href=[\'"]([^\'"]*file_down\.do[^\'"]*|[^\'"]*download[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        print("Found file links:", files)
        
        # Also look for any link with onclick or file
        all_links = re.findall(r'<a[^>]+(?:href|onclick)=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for h, t in all_links:
            clean_t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
            if any(k in clean_t.lower() for k in ['pdf', 'hwp', 'hwpx', '국정과제', '다운', 'down']):
                print(f"File/Download: {clean_t} -> {h}")
                
        # Also check text body snippet
        text_match = re.search(r'<div class="view_cont">(.*?)</div>', html, re.DOTALL)
        if text_match:
            print("Body snippet:", re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text_match.group(1)))[:500])
except Exception as e:
    print("Error:", e)
