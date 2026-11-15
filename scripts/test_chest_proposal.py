import urllib.request
import ssl
import re
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def check_proposal_chest():
    url = "https://proposal.chest.or.kr"
    print(f"Checking proposal chest: {url}")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"Proposal chest size: {len(html)}")
            # look for notices or links
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, text in matches:
                clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if any(k in clean for k in ['배분', '사업안내', '공고', '지침']):
                    print(f"  {clean} -> {href}")
    except Exception as e:
        print("Error proposal chest:", e)

if __name__ == '__main__':
    check_proposal_chest()
