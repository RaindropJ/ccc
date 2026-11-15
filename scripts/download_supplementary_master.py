import os
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOADS = [
    # 1. 자활 (한국자활복지개발원)
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_한국자활복지개발원_KDISS]',
        'filename': '04_자활사업안내_2026_최종.pdf',
        'url': 'https://www.kdissw.or.kr/boardDownload.es?bid=0009&list_no=11814&seq=2',
        'desc': '2026년 자활사업안내(게이트웨이, 자활근로, 자활기업, 사례관리)'
    },
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_한국자활복지개발원_KDISS]',
        'filename': '04_자활사업안내_2025_최종.pdf',
        'url': 'https://www.kdissw.or.kr/boardDownload.es?bid=0009&list_no=7998&seq=3',
        'desc': '2025년 자활사업안내 상세통권'
    },
    # 2. 보건복지부 공식누리집 (아동, 다함께돌봄, 보육/어린이집, 장애인활동지원)
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]',
        'filename': '07_아동분야사업안내_1권_시설설치운영_2025.pdf',
        'url': 'https://www.mohw.go.kr/boardDownload.es?bid=0026&list_no=1485220&seq=1',
        'desc': '2025년 아동분야 사업안내 1권(양육시설, 일시보호, 그룹홈)'
    },
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]',
        'filename': '07_아동분야사업안내_2권_자립지원가정위탁_2025.pdf',
        'url': 'https://www.mohw.go.kr/boardDownload.es?bid=0026&list_no=1485220&seq=2',
        'desc': '2025년 아동분야 사업안내 2권(아동자립지원, 가정위탁, 입양)'
    },
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]',
        'filename': '09_다함께돌봄센터_사업안내_2025.pdf',
        'url': 'https://www.mohw.go.kr/boardDownload.es?bid=0026&list_no=1484744&seq=2',
        'desc': '2025년 다함께돌봄센터 사업안내(초등돌봄 설치운영 및 특별프로그램)'
    },
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]',
        'filename': '09_보육사업안내_어린이집운영_2024.pdf',
        'url': 'https://www.mohw.go.kr/boardDownload.es?bid=0026&list_no=1479574&seq=1',
        'desc': '2024년 보육사업안내(어린이집 설치·운영·보육교직원 관리)'
    },
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]',
        'filename': '05_장애인활동지원_사업안내_2026.pdf',
        'url': 'https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=1490675&seq=2',
        'desc': '2026년 장애인활동지원 사업안내(활동지원기관 운영, 급여단가)'
    },
    # 3. 서울시사회복지사협회 자료실 (노인일자리, 장애인일자리)
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_서울시사회복지사협회_자료실]',
        'filename': '03_노인일자리_및_사회활동지원사업_운영안내_2024.pdf',
        'url': 'https://sasw.or.kr/index.php?module=file&act=procFileDownload&file_srl=722890&sid=f880ea2d5ecf77cedf2a5a2f55b7a7f4',
        'desc': '2024년 노인일자리 및 사회활동 지원사업 운영안내(시니어클럽 실무)'
    },
    {
        'folder': r'docs/지침서_공식_아카이브/01_보건복지부/[출처_서울시사회복지사협회_자료실]',
        'filename': '05_장애인일자리_사업안내_2026.pdf',
        'url': 'https://sasw.or.kr/index.php?module=file&act=procFileDownload&file_srl=919381&sid=5c6ef288ba71b500e03d72e5a429bc5c',
        'desc': '2026년 장애인일자리 사업안내(일반형, 복지일자리, 특화형)'
    },
    # 4. 외교부 산하 한국국제협력단 KOICA
    {
        'folder': r'docs/지침서_공식_아카이브/07_외교부_KOICA/[출처_한국국제협력단_KOICA]',
        'filename': '01_KOICA_시민사회협력프로그램_공모안내서_2027.pdf',
        'url': 'https://www.koica.go.kr/bbs/koica_kr/291/353173/download.do',
        'desc': '2027년도 KOICA 시민사회협력프로그램 공모안내서(NGO 민관협력 실무편람)'
    }
]

def main():
    print("=== [지침서 사각지대 해소 마스터 다운로드 시작] ===")
    success_count = 0
    total_downloaded_bytes = 0

    for item in DOWNLOADS:
        folder = item['folder']
        filename = item['filename']
        url = item['url']
        desc = item['desc']
        
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, filename)
        
        print(f"\n[다운로드 중] {filename}...")
        print(f"  출처 폴더: {folder}")
        print(f"  URL: {url}")
        
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                data = resp.read()
                size_mb = len(data) / (1024 * 1024)
                
                # Check header
                if data[:4] == b'%PDF':
                    with open(filepath, 'wb') as f:
                        f.write(data)
                    print(f"  [성공] 크기: {size_mb:.2f} MB | 정상 PDF 헤더 확인")
                    success_count += 1
                    total_downloaded_bytes += len(data)
                else:
                    print(f"  [경고] 유효하지 않은 파일 헤더: {data[:20]}")
        except Exception as e:
            print(f"  [실패] 오류 발생: {e}")

    print("\n" + "="*50)
    print(f"다운로드 완료: 총 {success_count}/{len(DOWNLOADS)} 개 파일 성공")
    print(f"추가 용량: {total_downloaded_bytes / (1024 * 1024):.2f} MB")

if __name__ == '__main__':
    main()
