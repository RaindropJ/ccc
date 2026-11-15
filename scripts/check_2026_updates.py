import urllib.request
import re
import json

def check_board():
    # Let's search '아동분야' on adongbokji.or.kr
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    for page in range(1, 5):
        url = f'http://www.adongbokji.or.kr/bbs/board.php?bo_table=sub03_02&page={page}'
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                links = re.findall(r'href=[\'"]([^\'"]+wr_id=\d+[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
                for link, title in links:
                    t_clean = re.sub(r'<[^>]+>', '', title).strip()
                    if '아동분야' in t_clean or '사업안내' in t_clean:
                        print(f"[adongbokji P{page}] {t_clean} -> {link}")
        except Exception as e:
            print(f"Error on page {page}: {e}")

check_board()
