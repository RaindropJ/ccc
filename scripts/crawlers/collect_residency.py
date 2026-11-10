"""
collect_residency.py
전국 284개 전문사회복지사 공인 수련기관(정신건강 142 / 의료 98 / 학교 44) 수련생 모집공고 수집 및 검증 모듈
"""
import sys
import os
import json
from datetime import datetime

def collect_residency_postings():
    print("[2/5] Collecting Residency (수련생) Postings across 284 Certified Centers...")
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'residency-284-db.js')
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return []

    with open(db_path, 'r', encoding='utf-8') as f:
        c = f.read()
        s = c.find('[')
        e = c.rfind(']') + 1
        centers = json.loads(c[s:e])

    # Validate active deadlines
    today = datetime.now()
    active_postings = []
    
    for item in centers:
        # Check deadline
        dl_str = item.get('deadline')
        is_active = True
        if dl_str:
            try:
                dl_date = datetime.strptime(dl_str, "%Y-%m-%d")
                if dl_date < today:
                    is_active = False
            except Exception:
                pass
        
        if is_active:
            active_postings.append(item)

    print(f"Verified {len(active_postings)} active residency postings out of {len(centers)} total centers.")
    return active_postings

if __name__ == '__main__':
    res = collect_residency_postings()
    print(f"Residency collector finished. Total active: {len(res)}")
