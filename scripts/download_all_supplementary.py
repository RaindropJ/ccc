import os
import urllib.request
import urllib.parse
import http.cookiejar
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_archive = r"docs\지침서_공식_아카이브"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def download_file(url, target_path, headers=None, post_data=None, opener=None):
    if os.path.exists(target_path):
        size = os.path.getsize(target_path)
        if size > 1000:
            print(f"[ALREADY EXISTS] {target_path} ({size:,} bytes)")
            return True

    print(f"[DOWNLOADING] -> {target_path}")
    req_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    if headers:
        req_headers.update(headers)

    req = urllib.request.Request(url, data=post_data, headers=req_headers)
    call_open = opener.open if opener else lambda r: urllib.request.urlopen(r, context=ctx, timeout=60)

    try:
        with call_open(req) as resp:
            with open(target_path, "wb") as f:
                while chunk := resp.read(65536):
                    f.write(chunk)
        size = os.path.getsize(target_path)
        print(f"[SUCCESS] {target_path} ({size:,} bytes)")
        return True
    except Exception as e:
        print(f"[ERROR] Failed downloading {target_path}: {e}")
        if os.path.exists(target_path):
            os.remove(target_path)
        return False

# 1. 여성가족부
mogef_dir = os.path.join(base_archive, "02_성평등가족부_여가부", "[출처_여성가족부_공식누리집]")
ensure_dir(mogef_dir)

def download_mogef(page_url, bbid, bbtSn, atfileSn, atfileSeq, target_filename):
    target_path = os.path.join(mogef_dir, target_filename)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        print(f"[ALREADY EXISTS] {target_path}")
        return

    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), urllib.request.HTTPSHandler(context=ctx))
    req = urllib.request.Request(page_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    with opener.open(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')

    m = re.search(r'varForm\.action\s*=\s*"([^"]+)"', html)
    action = m.group(1) if m else "/plc/down.do"
    down_url = urllib.parse.urljoin("https://www.mogef.go.kr", action)

    post_data = urllib.parse.urlencode({
        'bbid': bbid,
        'bbtSn': bbtSn,
        'atfileSn': atfileSn,
        'atfileSeq': atfileSeq
    }).encode('utf-8')

    download_file(
        down_url,
        target_path,
        headers={
            'Referer': page_url,
            'Origin': 'https://www.mogef.go.kr'
        },
        post_data=post_data,
        opener=opener
    )

print("=== 1. 여성가족부 지침 다운로드 ===")
download_mogef(
    "https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?mid=plc502&bbtSn=704833",
    "plc502", "704833", "705985", "1",
    "01_청소년사업안내_1권_활동참여_2024.pdf"
)
download_mogef(
    "https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?mid=plc502&bbtSn=704833",
    "plc502", "704833", "705985", "2",
    "01_청소년사업안내_2권_복지보호_쉼터자립지원관_2024.pdf"
)
download_mogef(
    "https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?mid=plc503&bbtSn=704978",
    "plc503", "704978", "705981", "2",
    "02_한부모가족지원사업안내_2024.pdf"
)
download_mogef(
    "https://www.mogef.go.kr/mp/pcd/mp_pcd_s001d.do?mid=plc504&bbtSn=704402",
    "plc504", "704402", "705979", "3",
    "03_여성아동권익증진사업_운영지침_폭력피해자보호시설_2024.pdf"
)

# 2. 보건복지부 (기부식품 푸드뱅크 & 드림스타트)
mohw_dir = os.path.join(base_archive, "01_보건복지부", "[출처_보건복지부_공식누리집]")
ensure_dir(mohw_dir)

print("\n=== 2. 보건복지부 기부식품 & 드림스타트 다운로드 ===")
download_file(
    "https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=1488613&seq=1",
    os.path.join(mohw_dir, "13_기부식품등_제공사업안내_푸드뱅크_2026.pdf"),
    headers={'Referer': 'https://www.mohw.go.kr/board.es?mid=a10411010100&bid=0019&act=view&list_no=1488613'}
)
download_file(
    "https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=1488613&seq=3",
    os.path.join(mohw_dir, "13_기부식품등_제공사업안내_푸드뱅크_2026.hwpx"),
    headers={'Referer': 'https://www.mohw.go.kr/board.es?mid=a10411010100&bid=0019&act=view&list_no=1488613'}
)
download_file(
    "https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=374813&seq=1",
    os.path.join(mohw_dir, "07_드림스타트_사업안내_아동통합사례관리_2023.pdf"),
    headers={'Referer': 'https://www.mohw.go.kr/board.es?mid=a10411010100&bid=0019&act=view&list_no=374813'}
)

# 3. 통일부 (남북하나재단 하나센터)
mou_dir = os.path.join(base_archive, "09_통일부_하나재단", "[출처_남북하나재단_통일부]")
ensure_dir(mou_dir)

print("\n=== 3. 통일부 남북하나재단 하나센터 업무매뉴얼 다운로드 ===")
download_file(
    "https://koreahana.or.kr/fileDirectDownload.do?uniqueKey=d02a73d44f0bca6ed63f16922f51a0f7&filename=&downname=202503260137291573.pdf",
    os.path.join(mou_dir, "01_북한이탈주민_지역적응센터_하나센터_업무매뉴얼_2025.pdf"),
    headers={'Referer': 'https://koreahana.or.kr/home/kor/promotionData/information/researchData/index5.do?menuPos=130'}
)

# 4. 국가보훈부 (보훈요양원 의료복지 시행지침)
mpva_dir = os.path.join(base_archive, "10_국가보훈부_보훈공단", "[출처_국가보훈부_공식누리집]")
ensure_dir(mpva_dir)

print("\n=== 4. 국가보훈부 보훈업무시행지침(의료복지·보훈요양원) 다운로드 ===")
download_file(
    "https://www.mpva.go.kr/mpva/downloadBbsFile.do?atchmnflNo=162851",
    os.path.join(mpva_dir, "01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.hwp"),
    headers={'Referer': 'https://www.mpva.go.kr/mpva/selectBbsNttView.do?key=165&bbsNo=41&nttNo=269666'}
)

# 5. 국무조정실 (120대 국정과제집 주요성과 보고서)
korea_dir = os.path.join(base_archive, "11_국무조정실_정부기획", "[출처_국무조정실_대한민국정책브리핑]")
ensure_dir(korea_dir)

print("\n=== 5. 국무조정실 120대 국정과제집 주요성과 다운로드 ===")
download_file(
    "https://www.korea.kr/common/download.do?tblKey=EDN&fileId=197728890",
    os.path.join(korea_dir, "01_120대_국정과제_주요성과_약자복지_통합돌봄_사회서비스혁신_2024.pdf"),
    headers={'Referer': 'https://www.korea.kr/archive/expDocView.do?docId=40914'}
)

print("\n=== 모든 다운로드 작업 완료 ===")
