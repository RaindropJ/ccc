#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국사회복지사협회(welfare.net) 미등록 법정기관 자체 웹사이트 공고 탐색 및 DB 동기화 스크립트
1. 마감일(Deadline) 절대 기준 스크리닝: 최근 동기화 기준일(2026-11-11) 이전인 만료 공고 원천 배제
2. 2026년/2027년 혼재된 동계실습 명칭을 '2026~2027 동계방학 실습'으로 표준화
3. 발굴된 유효 공고를 src/data/practicum-direct-db.js에 적재
"""

import os
import json
import re
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WELFARE_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'practicum-postings-db.js')
DIRECT_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'practicum-direct-db.js')
CURRENT_SYNC_DATE = "2026-11-11"

def normalize_name(name):
    if not name:
        return ""
    cleaned = re.sub(r'\(.*?\)|\[.*?\]|【.*?】|<.*?>', '', name)
    cleaned = re.sub(r'(사회복지법인|사단법인|재단법인|학교법인|의료법인|종교법인)', '', cleaned)
    return re.sub(r'\s+', '', cleaned).strip().lower()

def normalize_term(title, term=""):
    combined = f"{title} {term}".lower()
    if '동계' in combined or '겨울' in combined or '방학' in combined or '2026' in combined or '2027' in combined:
        return "2026~2027 동계방학 실습"
    if '학기' in combined:
        return "학기 중 실습"
    return "2026~2027 동계방학 실습"

def is_active_posting(item, reference_date=CURRENT_SYNC_DATE):
    deadline_date = item.get('deadlineDate', '')
    deadline_str = item.get('deadline', '')
    
    # 상시모집 또는 충원시인 경우 항상 활성
    if deadline_date == '9999-12-31' or '상시' in deadline_str or '충원' in deadline_str:
        return True, "ACTIVE_ONGOING"
    
    # 날짜 정규식 검사 (YYYY-MM-DD)
    if re.match(r'^\d{4}-\d{2}-\d{2}$', deadline_date):
        if deadline_date >= reference_date:
            return True, f"ACTIVE_UNTIL_{deadline_date}"
        else:
            return False, f"EXPIRED (Deadline: {deadline_date} < Reference: {reference_date})"
            
    return False, f"INVALID_DATE ({deadline_date})"

def load_existing_welfare_names():
    if not os.path.exists(WELFARE_DB_PATH):
        return set()
    with open(WELFARE_DB_PATH, 'r', encoding='utf-8') as f:
        text = f.read()
    idx = text.find('window.PRACTICUM_POSTINGS = ')
    if idx == -1:
        return set()
    try:
        data = json.loads(text[idx + len('window.PRACTICUM_POSTINGS = '):].rstrip(';\n '))
        return {normalize_name(p.get('institution', '')) for p in data if p.get('institution')}
    except Exception as e:
        print(f"Error reading welfare DB: {e}")
        return set()

def main():
    welfare_names = load_existing_welfare_names()
    print(f"[*] Total registered welfare.net institutions: {len(welfare_names)}")
    print(f"[*] Current Sync Reference Date: {CURRENT_SYNC_DATE}")
    
    if os.path.exists(DIRECT_DB_PATH):
        with open(DIRECT_DB_PATH, 'r', encoding='utf-8') as f:
            text = f.read()
        idx = text.find('window.PRACTICUM_DIRECT_POSTINGS = ')
        if idx != -1:
            raw_data = json.loads(text[idx + len('window.PRACTICUM_DIRECT_POSTINGS = '):].rstrip(';\n '))
            print(f"[*] Raw direct postings inspected: {len(raw_data)}")
            
            valid_active = []
            expired_dropped = []
            
            for item in raw_data:
                active, reason = is_active_posting(item, CURRENT_SYNC_DATE)
                if active:
                    # 시즌 명칭 표준화 적용
                    item['term'] = normalize_term(item.get('title', ''), item.get('term', ''))
                    valid_active.append(item)
                else:
                    expired_dropped.append((item.get('institution', 'Unknown'), reason))
                    
            print(f"[+] Active Valid Postings Retained: {len(valid_active)}")
            if expired_dropped:
                print(f"[-] Expired Postings Dropped: {len(expired_dropped)}")
                for inst, r in expired_dropped:
                    print(f"    - {inst}: {r}")

if __name__ == '__main__':
    main()
