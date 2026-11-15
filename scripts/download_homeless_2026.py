import urllib.request
import re
import os

url = 'http://homeless-seoul.or.kr/pages/page_62.php?act_module=board_board_2&act_type=read&sn=6391&page=1'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    matches = re.findall(r'href=["\'](/pages/download\.php\?[^"\']*)["\']', html)
    print('Homeless 2026 links:', matches)
    for m in matches:
        down_url = 'http://homeless-seoul.or.kr' + m
        save_path = os.path.join('docs', '지침서_공식_아카이브', '01_보건복지부', '[출처_보건복지부_공식누리집]', '12_노숙인_등의_복지사업안내_2026.pdf')
        req2 = urllib.request.Request(down_url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': url})
        with urllib.request.urlopen(req2, timeout=60) as resp2:
            data = resp2.read()
            if len(data) > 1024*1024:
                with open(save_path, 'wb') as f:
                    f.write(data)
                print(f'2026 Homeless guidelines downloaded: {len(data)/(1024*1024):.2f} MB, Header: {data[:10]}')
                break
