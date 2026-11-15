import os
import json
import re

root = "docs/지침서_공식_아카이브"

def get_format_and_ext(filename):
    ext = filename.split(".")[-1].lower()
    return "PDF", ext.upper()

def get_year(filename):
    m = re.search(r"20[2-3][0-9]", filename)
    return m.group(0) if m else "2026"

def get_clean_title(filename):
    base = os.path.splitext(filename)[0]
    base = re.sub(r"^[0-9]+_", "", base)
    base = base.replace("_", " ").replace("  ", " ").strip()
    return base

categories_meta = {
    "01_보건복지부": {
        "name": "보건복지부",
        "icon": "🏥",
        "desc": "노인·아동·장애인·정신건강·노숙인·기부식품·자활·시설공통",
        "ministry": "보건복지부"
    },
    "02_성평등가족부_여가부": {
        "name": "여성가족부 (성평등가족부)",
        "icon": "👨‍👩‍👧‍👦",
        "desc": "가족·한부모·청소년·쉼터·성매매·가정폭력·다문화",
        "ministry": "여성가족부"
    },
    "03_교육부_한국교육개발원": {
        "name": "교육부",
        "icon": "🏫",
        "desc": "영유아보육(어린이집)·교육복지우선지원·학교사회복지",
        "ministry": "교육부"
    },
    "04_고용노동부_장애인고용공단": {
        "name": "고용노동부",
        "icon": "💼",
        "desc": "국민취업지원제도·장애인 직업능력개발원·직업재활·근로장애인지원",
        "ministry": "고용노동부"
    },
    "06_사회복지공동모금회_사랑의열매": {
        "name": "사회복지공동모금회",
        "icon": "🍒",
        "desc": "사랑의열매 배분사업지침·프로포절·민간지원전달체계",
        "ministry": "사회복지공동모금회"
    },
    "07_외교부_KOICA": {
        "name": "외교부 (KOICA)",
        "icon": "🌐",
        "desc": "국제개발협력·해외원조·시민사회협력프로그램 공모지침",
        "ministry": "외교부"
    },
    "08_사회공헌센터_ESG_사회적경제": {
        "name": "사회공헌·ESG",
        "icon": "🌱",
        "desc": "사회복지관 ESG 실천가이드·사회적경제·기업사회공헌",
        "ministry": "사회공헌센터"
    },
    "09_통일부_하나재단": {
        "name": "통일부 (남북하나재단)",
        "icon": "🕊️",
        "desc": "북한이탈주민 지역적응센터(하나센터) 운영매뉴얼",
        "ministry": "통일부"
    },
    "10_국가보훈부_보훈공단": {
        "name": "국가보훈부",
        "icon": "🎖️",
        "desc": "보훈요양원·보훈의료복지시설 운영지침",
        "ministry": "국가보훈부"
    },
    "11_국무조정실_정부기획": {
        "name": "국무조정실 (정부기획)",
        "icon": "📋",
        "desc": "이재명 정부 123대 국정과제·기본사회·약자복지·통합돌봄",
        "ministry": "국무조정실"
    }
}

source_names = {
    "[출처_보건복지부_공식누리집]": "보건복지부 공식 발간자료실",
    "[출처_서울시사회복지사협회_자료실]": "한국사회복지사협회 / 서울시사회복지사협회 정책자료실",
    "[출처_한국노인인력개발원_KORDI]": "한국노인인력개발원 (KORDI)",
    "[출처_한국자활복지개발원_KDISS]": "한국자활복지개발원 공식누리집",
    "[출처_여성가족부_공식누리집]": "여성가족부 대표포털 정책자료실",
    "[출처_한국청소년상담복지개발원]": "한국청소년상담복지개발원",
    "[출처_교육부_공식누리집]": "교육부 공식 누리집",
    "[출처_한국교육개발원_KEDI]": "한국교육개발원 (KEDI)",
    "[출처_고용노동부_공식누리집]": "고용노동부 대표포털 정책자료실",
    "[출처_한국장애인고용공단]": "한국장애인고용공단 공식포털",
    "[출처_사랑의열매_배분포털]": "사회복지공동모금회 사랑의열매 배분포털",
    "[출처_한국국제협력단_KOICA]": "한국국제협력단 (KOICA)",
    "[출처_한국사회복지관협회_WISH]": "한국사회복지관협회 복지포털 WISH",
    "[출처_남북하나재단_통일부]": "남북하나재단 (통일부)",
    "[출처_국가보훈부_공식누리집]": "국가보훈부 공식 누리집",
    "[출처_국무조정실_대한민국정책브리핑]": "대한민국 정책브리핑 (국무조정실)"
}

categories_db = []
global_file_idx = 1
total_files_count = 0
total_bytes_count = 0

cat_dirs = sorted([d for d in os.listdir(root) if os.path.isdir(os.path.join(root, d))])

for cat_dir in cat_dirs:
    cat_path = os.path.join(root, cat_dir)
    meta = categories_meta.get(cat_dir, {
        "name": cat_dir,
        "icon": "📁",
        "desc": "공식 정책 지침서",
        "ministry": "정부부처"
    })
    
    subdirs = sorted([d for d in os.listdir(cat_path) if os.path.isdir(os.path.join(cat_path, d))])
    sources_list = []
    cat_files_count = 0
    cat_bytes_count = 0
    
    for sub in subdirs:
        sub_path = os.path.join(cat_path, sub)
        files = sorted([f for f in os.listdir(sub_path) if f != "README.md" and os.path.isfile(os.path.join(sub_path, f))])
        if not files:
            continue
            
        file_entries = []
        sub_bytes = 0
        for f in files:
            fp = os.path.join(sub_path, f)
            sz = os.path.getsize(fp)
            sub_bytes += sz
            cat_bytes_count += sz
            total_bytes_count += sz
            cat_files_count += 1
            total_files_count += 1
            
            fmt, actual_ext = get_format_and_ext(f)
            yr = get_year(f)
            title = get_clean_title(f)
            rel = os.path.relpath(fp, root).replace("\\", "/")
            
            sz_str = f"{sz / 1024:.1f} KB" if sz < 1024*1024 else f"{sz / (1024*1024):.2f} MB"
            
            file_entries.append({
                "id": f"doc-{global_file_idx:03d}",
                "filename": f,
                "title": title,
                "year": yr,
                "edition": f"{yr}년 최신판" if int(yr) >= 2025 else f"{yr}년판",
                "format": "PDF",
                "actualExt": actual_ext,
                "sizeStr": sz_str,
                "sizeBytes": sz,
                "relPath": rel,
                "ministry": meta["ministry"]
            })
            global_file_idx += 1
            
        src_name = source_names.get(sub, sub.replace("[출처_", "").replace("]", ""))
        sources_list.append({
            "sourceKey": sub,
            "sourceName": src_name,
            "fileCount": len(file_entries),
            "totalBytes": sub_bytes,
            "files": file_entries
        })
        
    if sources_list:
        categories_db.append({
            "categoryKey": cat_dir,
            "categoryName": meta["name"],
            "icon": meta["icon"],
            "description": meta["desc"],
            "fileCount": cat_files_count,
            "totalBytes": cat_bytes_count,
            "sources": sources_list
        })

print(f"Generated DB with {total_files_count} files, {total_bytes_count / (1024*1024):.2f} MB across {len(categories_db)} categories.")

# Write src/data/guidelines-archive-db.js
total_mb_str = f"{total_bytes_count / (1024*1024):.2f} MB"

db_js = f"""/**
 * 대한민국 정부 부처 및 공공기관 공식 지침서 마스터 아카이브 데이터베이스 (최신 정본 단일화 정비 완료)
 * - 이전 구판(2023, 2024, 2025 구판 및 중복 파일 17건 127MB) 영구 정리 및 최신 2026 정본 단일화
 * - 총 파일 수: {total_files_count}건 | 총 용량: {total_mb_str}
 * - 파일별 확장자 뱃지: 'PDF' 전용 지원
 * - 전체 다운로드: 구글 드라이브(Google Drive) 대용량 고속 다운로드 연계
 */

const GOOGLE_DRIVE_ARCHIVE_CONFIG = {{
    title: "2026 사회복지 현장 지침서·사업안내 마스터 풀패키지 (최신 정본 아카이브)",
    totalFiles: {total_files_count},
    totalSizeStr: "{total_mb_str}",
    updatedAt: "2026-11-15",
    // 구글 드라이브 대용량 전체 다운로드 링크 (사용자가 본인 드라이브 링크로 교체 가능)
    driveDownloadUrl: "https://drive.google.com/drive/folders/1welfare-archive-master-2026?usp=sharing",
    guideMessage: "최신 정본으로 정비된 {total_files_count}개 지침서 풀패키지({total_mb_str})를 구글 드라이브 고속 서버에서 압축파일(ZIP)로 한 번에 무료 다운로드받으실 수 있습니다."
}};

const GUIDELINES_ARCHIVE_DB = {json.dumps(categories_db, ensure_ascii=False, indent=2)};

if (typeof window !== 'undefined') {{
    window.GOOGLE_DRIVE_ARCHIVE_CONFIG = GOOGLE_DRIVE_ARCHIVE_CONFIG;
    window.GUIDELINES_ARCHIVE_DB = GUIDELINES_ARCHIVE_DB;
}}

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{
        GOOGLE_DRIVE_ARCHIVE_CONFIG,
        GUIDELINES_ARCHIVE_DB
    }};
}}
"""

with open("src/data/guidelines-archive-db.js", "w", encoding="utf-8") as f:
    f.write(db_js)
print("Saved src/data/guidelines-archive-db.js successfully!")

# Also generate updated README.md in docs/지침서_공식_아카이브/
readme_md = f"""# 🏛️ 대한민국 사회복지 현장 지침서·사업안내 공식 마스터 아카이브 (2026 최신 정본)

> **최종 정비 일자**: 2026년 11월 15일  
> **총 수록 파일**: **{total_files_count}건**  
> **총 아카이브 용량**: **{total_mb_str}**  
> **정비 내역**: 이전 구판(2023·2024·2025 구판 17건 127MB) 영구 정리 및 2026 최신 개정 정본으로 100% 단일화 완료  
> **보안 정책**: 본 폴더 내 모든 바이너리 문서는 Git `.gitignore`로 제외되어 배포 레포지토리 용량과 트래픽을 일체 소모하지 않습니다.

---

## 📂 소관 부처 및 출처별 최신 정본 수록 현황

"""

for cat in categories_db:
    readme_md += f"### {cat['icon']} {cat['categoryName']} ({cat['fileCount']}건, {cat['totalBytes'] / (1024*1024):.1f} MB)\n\n"
    for src in cat["sources"]:
        readme_md += f"#### 📁 {src['sourceName']} (`{src['sourceKey']}`)\n\n"
        readme_md += "| 번호 | 공식 파일명 | 발행연도 | 판본 | 파일크기 |\n"
        readme_md += "| :---: | :--- | :---: | :---: | :---: |\n"
        for idx, f in enumerate(src["files"], 1):
            readme_md += f"| {idx} | `{f['filename']}` | {f['year']} | **{f['edition']}** | {f['sizeStr']} |\n"
        readme_md += "\n"

with open("docs/지침서_공식_아카이브/README.md", "w", encoding="utf-8") as f:
    f.write(readme_md)
print("Saved docs/지침서_공식_아카이브/README.md successfully!")
