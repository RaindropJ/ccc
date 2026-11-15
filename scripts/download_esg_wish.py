import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://wish.welfare.seoul.kr/swflmsfront/common/downFile.do?hashid=n5zHnglpO7H16ZICse7m24enK42HFU1C&fgno=211314'
save_path = os.path.join('docs', '지침서_공식_아카이브', '08_사회공헌센터_ESG_사회적경제', '[출처_한국사회복지관협회_WISH]', '01_사회복지관_ESG_실천가이드_한국사회복지관협회.pdf')

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://wish.welfare.seoul.kr/swflmsfront/board/boardr.do?bmno=10015&opno=10007&bno=102034'})
with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
    data = resp.read()
    with open(save_path, 'wb') as f:
        f.write(data)
    print(f'ESG guide downloaded: {len(data)/(1024*1024):.2f} MB, Header: {data[:10]}')
