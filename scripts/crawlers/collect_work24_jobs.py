import urllib.request
import re
import json
import time
from datetime import datetime
from bs4 import BeautifulSoup

def clean_text(s):
    if not s:
        return ""
    return " ".join(s.split())

def parse_region(address):
    if not address:
        return "전국", "전체"
    parts = address.strip().split()
    if not parts:
        return "전국", "전체"
    
    first = parts[0]
    region = "기타"
    if "서울" in first: region = "서울"
    elif "경기" in first: region = "경기"
    elif "인천" in first: region = "인천"
    elif "부산" in first: region = "부산"
    elif "대구" in first: region = "대구"
    elif "대전" in first: region = "대전"
    elif "광주" in first: region = "광주"
    elif "울산" in first: region = "울산"
    elif "세종" in first: region = "세종"
    elif "강원" in first: region = "강원"
    elif "충청북" in first or "충북" in first: region = "충북"
    elif "충청남" in first or "충남" in first: region = "충남"
    elif "전라북" in first or "전북" in first: region = "전북"
    elif "전라남" in first or "전남" in first: region = "전남"
    elif "경상북" in first or "경북" in first: region = "경북"
    elif "경상남" in first or "경남" in first: region = "경남"
    elif "제주" in first: region = "제주"
    else: region = first[:2]
    
    sub = parts[1] if len(parts) > 1 else "전체"
    return region, sub

def parse_work24_page(page_no, result_cnt=50, query_mode="occupation"):
    if query_mode == "occupation":
        url = (
            f"https://m.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do?"
            f"occupation=231100%2C231101%2C231102%2C231103%2C232900%2C232904%2C013500&"
            f"keyword=%EC%82%AC%ED%9A%8C%EB%B3%B5%EC%A7%80&"
            f"resultCnt={result_cnt}&"
            f"currentPageNo={page_no}&"
            f"pageIndex={page_no}&"
            f"sortField=DATE&sortOrderBy=DESC"
        )
    else:
        # Title keyword mode ('사회복지사' 제목 검색 풀 1,920건)
        url = (
            f"https://m.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do?"
            f"srcKeyword=%EC%82%AC%ED%9A%8C%EB%B3%B5%EC%A7%80%EC%82%AC&"
            f"keywordWantedTitle=Y&"
            f"resultCnt={result_cnt}&"
            f"currentPageNo={page_no}&"
            f"pageIndex={page_no}&"
            f"sortField=DATE&sortOrderBy=DESC"
        )
        
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    })
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[Work24-{query_mode}] Page {page_no} fetch error: {e}")
        return []

    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find('table', id='contentArea')
    if not table:
        return []
    
    tbody = table.find('tbody')
    rows = tbody.find_all('tr') if tbody else table.find_all('tr')
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_date = datetime.strptime(today_str, "%Y-%m-%d")
    
    postings = []
    
    for tr in rows:
        tds = tr.find_all('td')
        if len(tds) < 3:
            continue
        
        # 1. Company Name & Job Title & URL
        chk = tds[0].find('input', class_='vtalm3')
        auth_no = ""
        if chk and chk.get('value'):
            tokens = chk['value'].split('|')
            if tokens:
                auth_no = tokens[0]
                
        cp_elem = tds[0].find('a', class_='cp_name')
        company = clean_text(cp_elem.get_text()) if cp_elem else "사회복지시설"
        
        title_elem = tds[0].find('a', href=re.compile(r'empDetailAuthView\.do'))
        title = clean_text(title_elem.get_text()) if title_elem else ""
        if not title:
            continue
            
        if auth_no:
            url = f"https://m.work24.go.kr/wk/a/b/1500/empDetailAuthView.do?wantedAuthNo={auth_no}&infoTypeCd=VALIDATION&infoTypeGroup=tb_workinfoworknet"
        elif title_elem and 'href' in title_elem.attrs:
            url = f"https://m.work24.go.kr{title_elem['href']}"
        else:
            url = "https://m.work24.go.kr"
            
        # 2. Details in TD 2
        salary = "가이드라인 준수"
        career_edu = "경력무관"
        work_time = "주5일"
        location_raw = "전국"
        
        for li in tds[1].find_all('li'):
            classes = li.get('class', [])
            txt = clean_text(li.get_text())
            if 'dollar' in classes:
                salary = txt
            elif 'member' in classes:
                career_edu = txt
            elif 'time' in classes:
                work_time = txt
            elif 'site' in classes:
                location_raw = txt
                
        region, sub_region = parse_region(location_raw)
        
        # 3. Deadline in TD 3
        dl_match = re.search(r'var\s+date\s*=\s*[\'\"]([0-9]{4}-[0-9]{2}-[0-9]{2})[\'\"]', tds[2].prettify())
        deadline = dl_match.group(1) if dl_match else "채용시까지"
        
        # Check expired
        dday = "접수중"
        if deadline != "채용시까지" and re.match(r'^\d{4}-\d{2}-\d{2}$', deadline):
            if deadline < today_str:
                # Expired! Drop it!
                continue
            try:
                dl_dt = datetime.strptime(deadline, "%Y-%m-%d")
                diff = (dl_dt - today_date).days
                if diff == 0:
                    dday = "D-Day"
                elif diff > 0:
                    dday = f"D-{diff}"
                else:
                    continue
            except:
                pass
                
        # Employment Type
        emp_type = "정규직"
        if "계약직" in title or "대체" in title or "단시간" in title or "계약직" in career_edu:
            emp_type = "계약직"
        elif "인턴" in title or "청년인턴" in title:
            emp_type = "청년인턴"
        elif "파트" in title or "시간제" in title:
            emp_type = "계약직"
            
        # Category
        category = "복지시설"
        if "병원" in company or "의료" in company or "재활병원" in company or "요양병원" in company:
            category = "병원직원"
        elif "재단" in company or "월드비전" in company or "굿네이버스" in company or "초록우산" in company:
            category = "메이저NGO"
        elif emp_type == "청년인턴":
            category = "청년인턴"
            
        job_id = f"work24-{auth_no}" if auth_no else f"work24-{len(postings)+1:04d}"
        
        postings.append({
            "id": job_id,
            "wantedAuthNo": auth_no,
            "company": company,
            "institution": company,
            "title": title,
            "role": "사회복지사",
            "fieldId": "social_work",
            "fieldName": "사회복지",
            "track": emp_type,
            "category": category,
            "employmentType": emp_type,
            "contractPeriod": work_time,
            "deadline": deadline,
            "dday": dday,
            "location": location_raw,
            "region": region,
            "regionGroup": region,
            "subRegion": sub_region,
            "salary": salary,
            "salaryType": "고용24공시",
            "career": career_edu,
            "edu": career_edu,
            "tags": [emp_type, region, "고용24공식"],
            "memo": f"고용24(워크넷) 공식 채용정보. 근무조건: {work_time}, 지원자격: {career_edu}",
            "url": url,
            "sourcePlatform": "고용24 (Work24)",
            "source": "work24",
            "verified": True
        })
        
    return postings

def run_work24_collection(target_count=3500, max_pages=75):
    print(f"[Work24] Starting FULL collection (target: up to {target_count} items, max_pages: {max_pages})...")
    all_jobs = []
    seen_ids = set()
    
    # 1. First Pass: Occupation Code 8종 (3,290건 풀 전수 탐색)
    print("\n--- [Step 1] Crawling Work24 Occupation Pool (8 Social Work Codes) ---")
    consecutive_empty = 0
    for page in range(1, max_pages + 1):
        jobs = parse_work24_page(page, result_cnt=50, query_mode="occupation")
        if not jobs:
            consecutive_empty += 1
            if consecutive_empty >= 2:
                print(f"[Work24-Occupation] Reached end of results at page {page}.")
                break
            continue
        consecutive_empty = 0
        new_cnt = 0
        for j in jobs:
            key = j['wantedAuthNo'] or (j['title'] + j['company'])
            if key not in seen_ids:
                seen_ids.add(key)
                all_jobs.append(j)
                new_cnt += 1
                
        print(f"[Step 1: Page {page:02d}] Fetched {len(jobs)} -> Added {new_cnt} unique active. (Total: {len(all_jobs)})")
        if len(all_jobs) >= target_count:
            break
        time.sleep(0.15)

    # 2. Second Pass: Title Keyword '사회복지사' (1,920건 추가 보완)
    print("\n--- [Step 2] Crawling Work24 Title Keyword Pool ('사회복지사') ---")
    consecutive_empty = 0
    for page in range(1, 45):
        jobs = parse_work24_page(page, result_cnt=50, query_mode="keyword")
        if not jobs:
            consecutive_empty += 1
            if consecutive_empty >= 2:
                print(f"[Work24-Keyword] Reached end of results at page {page}.")
                break
            continue
        consecutive_empty = 0
        new_cnt = 0
        for j in jobs:
            key = j['wantedAuthNo'] or (j['title'] + j['company'])
            if key not in seen_ids:
                seen_ids.add(key)
                all_jobs.append(j)
                new_cnt += 1
                
        if new_cnt > 0:
            print(f"[Step 2: Page {page:02d}] Fetched {len(jobs)} -> Added {new_cnt} NEW unique active! (Total: {len(all_jobs)})")
        if len(all_jobs) >= target_count:
            break
        time.sleep(0.15)
        
    print(f"\n=======================================================")
    print(f"[Work24] FULL Collection Complete! Total valid active jobs: {len(all_jobs)}")
    print(f"=======================================================\n")
    return all_jobs

if __name__ == "__main__":
    jobs = run_work24_collection(target_count=3500, max_pages=75)
    out_path = "src/data/work24-jobs-db.js"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("// 고용24 (Work24) 실시간 사회복지 채용공고 공식 DB (전수 수집 풀)\n")
        f.write(f"// 수집 시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"// 총 유효 공고 수: {len(jobs)}건 (마감일 경과 공고 자동 배제)\n\n")
        f.write("window.WORK24_JOB_POSTINGS = ")
        json.dump(jobs, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"[Work24] Successfully saved {len(jobs)} items to {out_path}")
