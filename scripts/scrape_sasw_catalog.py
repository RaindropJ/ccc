import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'}

def scrape_sasw_pages(max_pages=8):
    print("=== Scraping SASW data5 pages ===")
    articles = []
    for p in range(1, max_pages + 1):
        url = f"https://sasw.or.kr/data5?page={p}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                # find links like href="/data5/12345"
                matches = re.findall(r'<a[^>]+href=["\'](/data5/(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
                for href, doc_id, text in matches:
                    clean = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                    if clean and not clean.isdigit() and (doc_id, clean) not in articles:
                        articles.append((doc_id, clean))
                        if any(k in clean for k in ['안내', '지침', '매뉴얼', '가이드라인', '공동모금', '배분', '가족', '청소년', 'ESG', '노인', '장애인', '자활']):
                            print(f"  (p{p}) [{doc_id}] {clean}")
        except Exception as e:
            print(f"Error page {p}: {e}")
    print(f"Total relevant articles indexed: {len(articles)}")

if __name__ == '__main__':
    scrape_sasw_pages()
