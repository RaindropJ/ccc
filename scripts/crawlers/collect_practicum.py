"""
collect_practicum.py
보건복지부 / 한국사회복지사협회 현장실습센터(welfare.net) 공식 실습생 모집공고 수집 및 연동 모듈
"""
import sys
import os

sys.path.append(os.path.dirname(__file__))
from collect_practicum_welfarenet import fetch_welfare_net_postings, save_to_js

def collect_practicum_postings(certified_institutions=None):
    print("[1/5] Collecting Welfare.net Official Practicum Recruitment Postings...")
    postings = fetch_welfare_net_postings(max_pages=35)
    save_to_js(postings)
    print(f"Collected and verified {len(postings)} active seasonal practicum postings from welfare.net.")
    return postings

if __name__ == '__main__':
    res = collect_practicum_postings()
    print(f"Success! {len(res)} postings retrieved from welfare.net.")
