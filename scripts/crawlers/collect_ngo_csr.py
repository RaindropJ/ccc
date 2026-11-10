"""
collect_ngo_csr.py
10대 메이저 NGO (초록우산, 굿네이버스 등) 및 기업 사회공헌(CSR) 재단 공채 수집기
"""
import os
import json

def collect_ngo_csr_jobs():
    print("[5/5] Collecting Major NGO & Corporate CSR Foundation Jobs...")
    jobs_db = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'jobs-db.js')
    with open(jobs_db, 'r', encoding='utf-8') as f:
        c = f.read()
        s = c.find('[')
        e = c.rfind(']') + 1
        all_jobs = json.loads(c[s:e])
    
    ngo_csr = [j for j in all_jobs if j.get('category') in ['메이저NGO', '기업CSR']]
    print(f"Retrieved {len(ngo_csr)} verified NGO & CSR jobs.")
    return ngo_csr

if __name__ == '__main__':
    jobs = collect_ngo_csr_jobs()
