import os
import pymupdf

def check_pdf(label, path, keywords):
    print(f"\n==========================================")
    print(f"=== [{label}] ===")
    print(f"Path: {path}")
    if not os.path.exists(path):
        print("FILE NOT FOUND!")
        return
    doc = pymupdf.open(path)
    print(f"Total Pages: {len(doc)}")
    
    # 1. Check TOC
    toc = doc.get_toc()
    if toc:
        print(f"TOC Outline entries ({len(toc)} items):")
        for item in toc[:12]:
            print(f"  Level {item[0]}: {item[1]} (Page {item[2]})")
            
    # 2. Search for keywords in the first 40 pages
    found = False
    for p in range(min(40, len(doc))):
        txt = doc[p].get_text()
        for kw in keywords:
            if kw in txt:
                print(f"\n>>> Found keyword '{kw}' on Page {p+1}:")
                lines = [l.strip() for l in txt.split('\n') if l.strip()]
                # Print 15 relevant lines
                printed = 0
                for line in lines:
                    if any(k in line for k in keywords) or any(t in line for t in ['서비스', '사업', '기능', '프로그램', '영역', '1.', '2.', '가.', '나.']):
                        print(f"    {line}")
                        printed += 1
                        if printed >= 12:
                            break
                found = True
                break
        if found:
            break

check_pdf(
    "장애인활동지원",
    r"docs/지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_장애인활동지원_사업안내_2026.pdf",
    ["활동보조", "신체활동지원", "가사활동지원", "사회활동지원", "급여의 종류"]
)

check_pdf(
    "아동 드림스타트",
    r"docs/지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\07_드림스타트_사업안내_아동통합사례관리_2026.pdf",
    ["신체·건강", "인지·언어", "정서·행동", "가족·지원", "맞춤형서비스", "필수서비스"]
)

check_pdf(
    "지역아동센터",
    r"docs/지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\09_지역아동센터_지원사업안내_2026_첨부1.pdf",
    ["기본프로그램", "특화프로그램", "5대 영역", "보호", "교육", "문화", "정서지원"]
)

check_pdf(
    "가족센터 (건강가정·다문화)",
    r"docs/지침서_공식_아카이브\02_성평등가족부_여가부\[출처_여성가족부_공식누리집]\01_가족사업안내_1권_본문_2026.pdf",
    ["가족관계", "가족돌봄", "가족생활", "가족과 함께하는 지역공동체", "통합서비스"]
)

check_pdf(
    "지역자활센터",
    r"docs/지침서_공식_아카이브\01_보건복지부\[출처_한국자활복지개발원_KDISS]\04_자활사업안내_2026_최종.pdf",
    ["자활근로", "시장진입형", "사회서비스형", "근로유지형", "청년자립도전", "자활기업"]
)
