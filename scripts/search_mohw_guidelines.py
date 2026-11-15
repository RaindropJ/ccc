import urllib.request
import urllib.parse
import re

def search_mohw(keyword):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    # mohw.go.kr 지침 게시판
    # search parameter: s_keyword or keyField/keyWord
    encoded_kw = urllib.parse.quote(keyword)
    url = f'https://www.mohw.go.kr/board.es?mid=a10411010300&bid=0026&act=list&s_keyword={encoded_kw}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            items = re.findall(r'<a href=\"([^\"]*list_no=\d+[^\"]*)\"[^>]*>(.*?)</a>', html, re.DOTALL)
            print(f"=== MOHW Results for '{keyword}' ({len(items)} items) ===")
            for link, title in items:
                t_clean = re.sub(r'<[^>]+>', '', title).strip()
                if keyword in t_clean or '202' in t_clean:
                    print(f"  {t_clean} -> https://www.mohw.go.kr/board.es{link}")
    except Exception as e:
        print(f"Error querying MOHW for {keyword}: {e}")

search_mohw("아동분야")
search_mohw("다함께돌봄")
