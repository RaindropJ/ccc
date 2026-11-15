import urllib.request
import ssl
import re
import urllib.parse

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def search_sasw(keyword):
    encoded_kw = urllib.parse.quote(keyword)
    url = f"https://sasw.or.kr/data5?search_target=title_content&search_keyword={encoded_kw}"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            items = re.findall(r'<a[^>]+href=["\'](/data5/(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, doc_id, title in items:
                clean_title = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
                if clean_title and clean_title not in [r[0] for r in results]:
                    results.append((clean_title, doc_id, f"https://sasw.or.kr{href}"))
    except Exception as e:
        print(f"Error searching SASW kw={keyword}: {e}")
    return results

def get_sasw_attachments(doc_id):
    url = f"https://sasw.or.kr/data5/{doc_id}"
    req = urllib.request.Request(url, headers=headers)
    attachments = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Look for download link
            matches = re.findall(r'<a[^>]+href=["\']([^"\']*procFileDownload[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, name in matches:
                clean_name = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', name)).strip()
                attachments.append((clean_name, f"https://sasw.or.kr{href.replace('&amp;', '&')}"))
    except Exception as e:
        print(f"Error getting attachments for SASW doc_id={doc_id}: {e}")
    return attachments

if __name__ == '__main__':
    kws = ['노인보건복지', '장애인복지', '아동분야', '다함께돌봄', '지역아동센터', '정신건강', '자활사업', '청소년', '가족센터', '공동모금회', 'ESG']
    for kw in kws:
        print(f"\n--- SASW search [{kw}] ---")
        items = search_sasw(kw)
        for title, doc_id, link in items[:3]:
            print(f"  [{doc_id}] {title}")
            atts = get_sasw_attachments(doc_id)
            for aname, alink in atts:
                print(f"       -> Attach: {aname} | {alink}")
