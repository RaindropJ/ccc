import urllib.request
import urllib.parse
import re

def search_mohw_field(kw):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    encoded_kw = urllib.parse.quote(kw)
    url = f'https://www.mohw.go.kr/board.es?mid=a10411010300&bid=0026&act=list&keyField=title&keyWord={encoded_kw}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            items = re.findall(r'<a href=\"([^\"]*list_no=\d+[^\"]*)\"[^>]*>(.*?)</a>', html, re.DOTALL)
            print(f"\n=== Search results for '{kw}' ===")
            for link, title in items:
                t_clean = re.sub(r'<[^>]+>', '', title).strip()
                if kw in t_clean or '202' in t_clean:
                    print(f"  {t_clean} -> https://www.mohw.go.kr/board.es{link}")
    except Exception as e:
        print(f"Error: {e}")

search_mohw_field("아동분야")
search_mohw_field("다함께돌봄")
search_mohw_field("하나센터")
search_mohw_field("북한이탈주민")
