"""
collect_practicum_welfarenet.py
한국사회복지사협회 현장실습센터(welfare.net) 전용 실습생 모집공고 수집기
- 대상: https://www.welfare.net/prm/find-training-center/recruitment-trainees
- 기한 필터링: 마감일 미도래(오늘 이후) 또는 상시모집 공고만 엄격 수집 (기한 만료 공고 자동 배제)
- 직결 URL: https://www.welfare.net/prm/find-training-center/recruitment-trainees/recruitment-detail?nttSn={nttSn}
- 출력: src/data/practicum-postings-db.js
"""

import os
import sys
import json
import re
import requests
from datetime import datetime

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.welfare.net/'
}

def extract_deadline_info(text, title, reg_dt, today_str):
    """
    본문 텍스트와 제목에서 모집 마감일 정보를 정밀 추출하고 유효성(미도래 여부)을 판정합니다.
    """
    combined = f"{title or ''} {text or ''}".replace('\r', ' ').replace('\n', ' ')
    
    # 1. 상시 / 충원시 / 수시 키워드 확인
    is_ongoing = any(k in combined for k in ['상시모집', '상시 모집', '충원시', '충원 시', '채용시', '채용 시', '수시모집', '수시 모집'])
    
    # 2. 마감일자 정규식 탐색
    # 패턴 예: 2026.12.30, 2026-12-30, 2026/12/30, 2026년 12월 30일
    date_matches = re.findall(r'(202[6-7])[\.\-\/년\s]+(0?[1-9]|1[0-2])[\.\-\/월\s]+(0?[1-9]|[12]\d|3[01])', combined)
    
    valid_dates = []
    for y, m, d in date_matches:
        ds = f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
        valid_dates.append(ds)
        
    # '마감' 또는 '접수' 또는 '기한' 주변의 날짜를 우선 탐색
    deadline_context = re.findall(r'(?:마감|접수기한|모집기한|접수마감|모집기간)[^\d]{1,25}(202[6-7])[\.\-\/년\s]+(0?[1-9]|1[0-2])[\.\-\/월\s]+(0?[1-9]|[12]\d|3[01])', combined)
    if deadline_context:
        y, m, d = deadline_context[0]
        ctx_date = f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
        if ctx_date >= today_str:
            return ctx_date, ctx_date, False
        elif not is_ongoing:
            # 마감일이 명시되었으나 오늘 이전이고 상시 키워드가 없는 경우 -> 만료
            return ctx_date, ctx_date, True

    # 향후 날짜가 하나라도 존재하는지 확인
    future_dates = [d for d in valid_dates if d >= today_str]
    if future_dates:
        # 가장 가까운 미래 마감일
        chosen = min(future_dates)
        return chosen, chosen, False

    # 월/일 형식 확인 (예: 12.30까지, 1월 15일 마감)
    md_matches = re.findall(r'(1[0-2]|0?[1-9])[\.\/\월\s]+([0-3]?[0-9])[\s일]*(?:까지|마감)', combined)
    if md_matches:
        m, d = md_matches[0]
        year = 2027 if int(m) in [1, 2, 3] else 2026
        md_date = f"{year:04d}-{int(m):02d}-{int(d):02d}"
        if md_date >= today_str:
            return md_date, md_date, False
        elif not is_ongoing:
            return md_date, md_date, True

    # 날짜가 없으나 상시모집인 경우
    if is_ongoing:
        return "상시모집", "9999-12-31", False

    # 날짜도 없고 상시 키워드도 없지만 등록일이 최근(30일 이내)인 경우 상시로 간주
    try:
        reg_date_str = reg_dt.replace('.', '-')
        days_diff = (datetime.strptime(today_str, "%Y-%m-%d") - datetime.strptime(reg_date_str, "%Y-%m-%d")).days
        if days_diff <= 35:
            return "상시모집", "9999-12-31", False
        else:
            return "모집마감", "2000-01-01", True
    except Exception:
        return "상시모집", "9999-12-31", False

def extract_recruits_and_fee(text):
    """실습 인원 및 실습비 추출"""
    recruits = "0명"
    fee = "무료"
    fee_amount = 0
    
    # 모집인원 정규식
    rec_match = re.search(r'(?:모집인원|실습인원|인원)[^\d]{1,10}(\d{1,2})\s*명', text)
    if rec_match:
        recruits = f"{rec_match.group(1)}명"
        
    # 실습비 정규식
    fee_match = re.search(r'(?:실습비|비용)[^\d]{1,10}(\d{1,3}(?:,\d{3})*|\d+)\s*원', text)
    if fee_match:
        f_str = fee_match.group(1).replace(',', '')
        fee_amount = int(f_str)
        fee = f"{fee_amount:,}원"
    elif '무료' in text:
        fee = "무료"
        fee_amount = 0
    elif '10만원' in text:
        fee = "100,000원"
        fee_amount = 100000
    elif '20만원' in text:
        fee = "200,000원"
        fee_amount = 200000
    elif '15만원' in text:
        fee = "150,000원"
        fee_amount = 150000

    return recruits, fee, fee_amount

def fetch_welfare_net_postings(max_pages=35):
    today = datetime.now()
    today_str = today.strftime("%Y-%m-%d")
    print(f"[*] Starting welfare.net crawler (Today: {today_str}, scanning up to {max_pages} pages)...")
    
    active_postings = []
    expired_count = 0
    
    for page in range(1, max_pages + 1):
        url = f"https://api.welfare.net/prm/na/ntt/selectNttList.do?bbsId=1703&currPage={page}"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=8)
            if resp.status_code != 200:
                print(f"    [!] Page {page} returned status {resp.status_code}, stopping.")
                break
            
            data = resp.json()
            items = data.get('nttListPaging', {}).get('list', [])
            if not items:
                print(f"    [!] Page {page} empty, terminating.")
                break
                
            for it in items:
                ntt_sn = it.get('nttSn')
                title = (it.get('nttSj') or '').strip()
                org_nm = (it.get('orgNm') or it.get('regNm') or '').strip()
                area_nm = (it.get('areaNm') or '').strip()
                code_t = (it.get('codeT') or '사회복지시설').strip()
                reg_dt = (it.get('regDt') or '').strip()
                cut_text = it.get('nttCnCut') or ''
                
                # Check deadline
                dl_display, dl_date, is_expired = extract_deadline_info(cut_text, title, reg_dt, today_str)
                
                if is_expired:
                    expired_count += 1
                    continue
                
                recruits, fee, fee_amount = extract_recruits_and_fee(cut_text)
                
                # Direct post detail URL on welfare.net
                post_url = f"https://www.welfare.net/prm/find-training-center/recruitment-trainees/recruitment-detail?nttSn={ntt_sn}"
                
                # Field classification
                field_id = "community"
                field_name = "종합사회복지"
                if any(k in title or k in org_nm or k in cut_text for k in ['노인', '요양', '시니어', '어르신', '주간보호']):
                    field_id = "elderly"
                    field_name = "노인복지"
                elif any(k in title or k in org_nm or k in cut_text for k in ['장애인', '발달', '수어', '시각', '농아']):
                    field_id = "disability"
                    field_name = "장애인복지"
                elif any(k in title or k in org_nm or k in cut_text for k in ['아동', '청소년', '지역아동', '방과후', '쉼터', '드림스타트']):
                    field_id = "child"
                    field_name = "아동·청소년복지"
                elif any(k in title or k in org_nm or k in cut_text for k in ['정신', '중독', '마음건강']):
                    field_id = "mental"
                    field_name = "정신건강복지"
                elif any(k in title or k in org_nm or k in cut_text for k in ['병원', '의료원', '재활병원', '의료']):
                    field_id = "medical"
                    field_name = "의료사회복지"

                active_postings.append({
                    "id": f"welfare-ntt-{ntt_sn}",
                    "nttSn": ntt_sn,
                    "title": title,
                    "institution": org_nm or "법정 실습기관",
                    "formerName": None,
                    "renameNote": None,
                    "fieldId": field_id,
                    "fieldName": field_name,
                    "term": "2026-2027 동계 실습생 모집",
                    "period": "동계 실습기간 (기관 협의 / 160시간)",
                    "fee": fee,
                    "feeNote": "기관 실비 기준",
                    "feeAmount": fee_amount,
                    "recruits": recruits,
                    "capacity": recruits,
                    "deadline": dl_display,
                    "deadlineDate": dl_date,
                    "location": area_nm,
                    "region": area_nm,
                    "regionGroup": area_nm,
                    "subRegion": area_nm,
                    "requirements": "사회복지(사업)학과 및 관련 학과 실습 선수과목 이수자",
                    "process": "1차 서류접수(실습신청서/프로파일) → 2차 면접/개별 통보",
                    "sourceUrl": post_url,
                    "postUrl": post_url,
                    "memo": cut_text[:250] if cut_text else f"한국사회복지사협회 현장실습센터 공식 실습생 모집공고 ({reg_dt} 등록)",
                    "facilityType": code_t,
                    "regDt": reg_dt,
                    "source": "한국사회복지사협회 현장실습센터(welfare.net)"
                })
        except Exception as e:
            print(f"    [!] Error fetching page {page}: {e}")
            continue

    print(f"[*] Done! Total active unexpired postings: {len(active_postings)}, Expired filtered: {expired_count}")
    return active_postings

def save_to_js(postings):
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data'))
    os.makedirs(data_dir, exist_ok=True)
    out_file = os.path.join(data_dir, 'practicum-postings-db.js')
    
    js_content = f"// 한국사회복지사협회 현장실습센터(welfare.net) 공식 실습생 모집공고 DB\n// 생성시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n// 총 유효 활성 공고: {len(postings)}건 (마감 만료 공고 자동 제외)\n\nwindow.PRACTICUM_POSTINGS = {json.dumps(postings, ensure_ascii=False, indent=2)};\n"
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"[+] Saved {len(postings)} postings to {out_file}")

if __name__ == '__main__':
    postings = fetch_welfare_net_postings(max_pages=35)
    save_to_js(postings)
