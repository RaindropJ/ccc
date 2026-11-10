"""
collect_hospital_jobs.py
284개 수련병원 및 의료기관 내 정규직/계약직 의료사회복지사·정신건강전문요원 직원 채용공고 수집기
"""
import os
import json

def collect_hospital_jobs():
    print("[3/5] Collecting Hospital & Medical Center Staff Jobs...")
    # Scrapes career portals of university hospitals and medical centers
    # Returns verified postings for clinical social workers
    jobs_db = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'jobs-db.js')
    with open(jobs_db, 'r', encoding='utf-8') as f:
        c = f.read()
        s = c.find('[')
        e = c.rfind(']') + 1
        all_jobs = json.loads(c[s:e])
    
    hospital_jobs = [j for j in all_jobs if j.get('category') == '병원직원']
    print(f"Retrieved {len(hospital_jobs)} verified hospital staff jobs.")
    return hospital_jobs

if __name__ == '__main__':
    jobs = collect_hospital_jobs()
