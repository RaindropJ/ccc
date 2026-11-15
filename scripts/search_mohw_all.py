import urllib.request
import ssl
import re
import os
import urllib.parse

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.mohw.go.kr/'
}

def search_mohw(bid, keyword):
    encoded_kw = urllib.parse.quote(keyword)
    url = f"https://www.mohw.go.kr/board.es?mid=a10411010100&bid={bid}&act=list&keyField=title&keyWord={encoded_kw}"
    req = urllib.request.Request(url, headers=headers)
    results = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # find links
            items = re.findall(r'<a[^>]+href=["\']([^"\']*list_no=(\d+)[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, list_no, title in items:
                clean_title = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
                if keyword in clean_title or any(k in clean_title for k in keyword.split()):
                    results.append((clean_title, list_no, f"https://www.mohw.go.kr{href.replace('&amp;', '&')}"))
    except Exception as e:
        print(f"Error searching MOHW bid={bid} kw={keyword}: {e}")
    return results

def get_mohw_attachment_url(bid, list_no):
    url = f"https://www.mohw.go.kr/board.es?mid=a10411010100&bid={bid}&act=view&list_no={list_no}"
    req = urllib.request.Request(url, headers=headers)
    attachments = []
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'href=["\'](/boardDownload\.es\?[^"\']*)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
            for href, name in matches:
                clean_name = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', name)).strip()
                attachments.append((clean_name, f"https://www.mohw.go.kr{href.replace('&amp;', '&')}"))
    except Exception as e:
        print(f"Error getting attachments for list_no={list_no}: {e}")
    return attachments

if __name__ == '__main__':
    targets = [
        ('0021', '사회복지시설 관리안내'),
        ('0021', '사회복지관'),
        ('0021', '장애인복지 사업안내'),
        ('0019', '노인보건복지'),
        ('0019', '노인맞춤돌봄'),
        ('0019', '아동분야'),
        ('0019', '다함께돌봄'),
        ('0019', '지역아동센터'),
        ('0019', '정신건강사업안내'),
        ('0019', '자활사업안내'),
        ('0019', '노숙인'),
        ('0021', '인건비 가이드라인')
    ]
    for bid, kw in targets:
        print(f"\n--- Searching [{kw}] in bid={bid} ---")
        res = search_mohw(bid, kw)
        for title, lno, link in res[:3]:
            print(f"  [{lno}] {title}")
            atts = get_mohw_attachment_url(bid, lno)
            for aname, alink in atts:
                print(f"       -> Attach: {aname} | {alink}")
