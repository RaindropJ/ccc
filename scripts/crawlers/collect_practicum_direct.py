#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국사회복지사협회(welfare.net) 미등록 법정기관 자체 웹사이트 공고 탐색 및 DB 동기화 스크립트
1. welfare.net에 이미 등록된 기관 목록을 제외한 미등록 기관 선별
2. 수도권 및 주요 복지기관 공식 홈페이지 2026 동계 실습 공고 유무 스크리닝
3. 발굴된 공고를 src/data/practicum-direct-db.js에 적재
"""

import os
import json
import re
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WELFARE_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'practicum-postings-db.js')
DIRECT_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'practicum-direct-db.js')

def normalize_name(name):
    if not name:
        return ""
    # 법인명 및 괄호 제거
    cleaned = re.sub(r'\(.*?\)|\[.*?\]|【.*?】|<.*?>', '', name)
    cleaned = re.sub(r'(사회복지법인|사단법인|재단법인|학교법인|의료법인|종교법인)', '', cleaned)
    return re.sub(r'\s+', '', cleaned).strip().lower()

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
    
    # direct DB 확인
    if os.path.exists(DIRECT_DB_PATH):
        with open(DIRECT_DB_PATH, 'r', encoding='utf-8') as f:
            text = f.read()
        idx = text.find('window.PRACTICUM_DIRECT_POSTINGS = ')
        if idx != -1:
            direct_data = json.loads(text[idx + len('window.PRACTICUM_DIRECT_POSTINGS = '):].rstrip(';\n '))
            print(f"[*] Total direct institution postings: {len(direct_data)}")
            
            # 중복 매칭 분석
            overlaps = []
            distincts = []
            for item in direct_data:
                norm = normalize_name(item.get('institution', ''))
                if norm in welfare_names:
                    overlaps.append(item.get('institution'))
                else:
                    distincts.append(item.get('institution'))
            print(f"[+] Overlapping institutions (will be merged with dual links): {len(overlaps)} ({overlaps})")
            print(f"[+] Distinct direct institution postings: {len(distincts)}")

if __name__ == '__main__':
    main()
