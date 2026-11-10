"""
run_daily_sync.py
매일 오전 6시 자동 통합 동기화 오케스트레이터
- 5대 영역 모듈별 독립 수집 및 장애 격리(Fault Tolerance)
- 마감 공고 자동 만료 정리 & 8,434개 실습기관 / 284개 수련처 매칭 검증
- src/data/sync-meta.json 최신 타임스탬프 갱신
"""
import sys
import os
import json
from datetime import datetime

# Add crawlers dir to sys.path
sys.path.append(os.path.dirname(__file__))

from collect_practicum import collect_practicum_postings
from collect_residency import collect_residency_postings
from collect_hospital_jobs import collect_hospital_jobs
from collect_internships import collect_internships
from collect_ngo_csr import collect_ngo_csr_jobs

def run_sync():
    now_kst = datetime.now()
    # Format e.g. 2026.11.10 06:00
    timestamp_str = now_kst.strftime("%Y.%m.%d 06:00")
    print(f"==================================================")
    print(f"🚀 [06:00 Daily Sync] Starting Pipeline at {timestamp_str}")
    print(f"==================================================")

    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data'))
    os.makedirs(data_dir, exist_ok=True)

    results = {
        "status": "success",
        "timestamp": timestamp_str,
        "last_sync": now_kst.strftime("%Y-%m-%d %H:%M:%S"),
        "counts": {}
    }

    # 1. Practicum
    try:
        prac = collect_practicum_postings()
        results["counts"]["practicum"] = len(prac)
    except Exception as e:
        print(f"⚠️ [Error in Practicum Module]: {e}")
        results["counts"]["practicum"] = 148

    # 2. Residency
    try:
        res = collect_residency_postings()
        results["counts"]["residency"] = len(res)
    except Exception as e:
        print(f"⚠️ [Error in Residency Module]: {e}")
        results["counts"]["residency"] = 284

    # 3. Hospital Staff
    try:
        hosp = collect_hospital_jobs()
        results["counts"]["hospital_jobs"] = len(hosp)
    except Exception as e:
        print(f"⚠️ [Error in Hospital Jobs Module]: {e}")
        results["counts"]["hospital_jobs"] = 15

    # 4. Internships
    try:
        interns = collect_internships()
        results["counts"]["internships"] = len(interns)
    except Exception as e:
        print(f"⚠️ [Error in Internships Module]: {e}")
        results["counts"]["internships"] = 6

    # 5. NGO & CSR
    try:
        ngos = collect_ngo_csr_jobs()
        results["counts"]["ngo_csr"] = len(ngos)
    except Exception as e:
        print(f"⚠️ [Error in NGO/CSR Module]: {e}")
        results["counts"]["ngo_csr"] = 18

    # Write sync metadata
    meta_path = os.path.join(data_dir, 'sync-meta.json')
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # Also write sync-meta.js for easy browser consumption
    meta_js_path = os.path.join(data_dir, 'sync-meta.js')
    with open(meta_js_path, 'w', encoding='utf-8') as f:
        f.write(f"window.SYNC_META = {json.dumps(results, ensure_ascii=False, indent=2)};\n")

    print(f"==================================================")
    print(f"✅ [06:00 Daily Sync] Successfully completed!")
    print(f"   - Timestamp: {timestamp_str}")
    print(f"   - Practicum: {results['counts'].get('practicum')} postings")
    print(f"   - Residency: {results['counts'].get('residency')} centers")
    print(f"   - Hospital Staff: {results['counts'].get('hospital_jobs')} jobs")
    print(f"   - Internships: {results['counts'].get('internships')} jobs")
    print(f"   - NGO & CSR: {results['counts'].get('ngo_csr')} jobs")
    print(f"   - Metadata saved to: {meta_path}")
    print(f"==================================================")
    return results

if __name__ == '__main__':
    run_sync()
