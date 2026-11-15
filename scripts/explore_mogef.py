import urllib.request
import ssl
import re
import urllib.parse

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mogef.go.kr/'
}

def explore_mogef():
    print("=== Exploring MOGEF (여성가족부) ===")
    # MOGEF publication board: typically board.es or similar
    # Let's check mogef homepage or search
    urls = [
        "https://www.mogef.go.kr/mp/pcd/mp_pcd_s001.do", # 정책자료실
        "https://www.mogef.go.kr/korea/view/policyGuide/policyGuide06_01.jsp"
    ]
    for u in urls:
        try:
            req = urllib.request.Request(u, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                print(f"MOGEF url {u} accessed, size: {len(html)}")
                matches = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
                for href, text in matches:
                    clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                    if any(k in clean for k in ['가족센터', '청소년', '한부모', '사업안내', '지침']):
                        print(f"  {clean} -> {href}")
        except Exception as e:
            print(f"Error {u}: {e}")

if __name__ == '__main__':
    explore_mogef()
