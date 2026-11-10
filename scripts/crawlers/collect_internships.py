"""
collect_internships.py
4대 사회보험 공단 및 주요 공공기관 사회복지/요양/산재 청년인턴십 수집기
"""
import os
import json

def collect_internships():
    print("[4/5] Collecting Public Agency & Welfare Internships...")
    jobs_db = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'jobs-db.js')
    with open(jobs_db, 'r', encoding='utf-8') as f:
        c = f.read()
        s = c.find('[')
        e = c.rfind(']') + 1
        all_jobs = json.loads(c[s:e])
    
    intern_jobs = [j for j in all_jobs if j.get('category') == '청년인턴']
    print(f"Retrieved {len(intern_jobs)} verified public agency internships.")
    return intern_jobs

if __name__ == '__main__':
    jobs = collect_internships()
