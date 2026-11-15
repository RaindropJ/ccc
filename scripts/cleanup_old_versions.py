import os
import shutil

root = "docs/지침서_공식_아카이브"

# List of obsolete / superseded files to delete
files_to_delete = [
    # 1. 드림스타트 2023 -> 2026 존재
    "01_보건복지부/[출처_보건복지부_공식누리집]/07_드림스타트_사업안내_아동통합사례관리_2023.pdf",
    # 2. 자활사업안내 2025 -> 2026 존재
    "01_보건복지부/[출처_한국자활복지개발원_KDISS]/04_자활사업안내_2025_최종.pdf",
    # 3. 청소년사업안내 1권 2024 -> 2026 존재
    "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_청소년사업안내_1권_활동참여_2024.pdf",
    # 4. 청소년사업안내 2권 2024 -> 2026 존재
    "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_청소년사업안내_2권_복지보호_쉼터자립지원관_2024.pdf",
    # 5. 한부모가족지원 2024 -> 2026 존재
    "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/02_한부모가족지원사업안내_2024.pdf",
    # 6. 여성아동권익증진 2024 -> 2026 존재
    "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/03_여성아동권익증진사업_운영지침_폭력피해자보호시설_2024.pdf",
    # 7. 보육사업안내 2024 (복지부) -> 2026 (교육부 본문, 부록) 존재
    "01_보건복지부/[출처_보건복지부_공식누리집]/09_보육사업안내_어린이집운영_2024.pdf",
    # 8. 노숙인 2024 (서사협) -> 2026 (복지부 공식누리집) 존재
    "01_보건복지부/[출처_서울시사회복지사협회_자료실]/12_노숙인_등의_복지사업안내_2024_2024년_노숙인_등의_복지사업안내.pdf",
    # 9. 다함께돌봄 2023 (서사협) -> 2025 (복지부 공식누리집) 존재
    "01_보건복지부/[출처_서울시사회복지사협회_자료실]/09_다함께돌봄사업안내_2023_2023_다함께돌봄_사업안내.pdf",
    # 10. 아동분야사업안내 1권 2023 (서사협) -> 2025 1권 (복지부 공식) 존재
    "01_보건복지부/[출처_서울시사회복지사협회_자료실]/07_아동분야사업안내_2023_2023_아동분야_사업안내_[1권]_(최종).pdf",
    # 11. 아동분야사업안내 2권 2023 (서사협) -> 2025 2권 (복지부 공식) 존재
    "01_보건복지부/[출처_서울시사회복지사협회_자료실]/07_아동분야사업안내_2023_2023_아동분야_사업안내_[2권]_(최종).pdf",
    # 12. 가족센터 사업안내 1권 2025 -> 2026 가족사업안내 1권 (여가부 본부) 존재
    "02_성평등가족부_여가부/[출처_한국건강가정진흥원_패밀리넷]/01_가족센터_사업안내_1권_2025.pdf",
    # 13. 가족센터 사업안내 2권 2025 -> 2026 가족사업안내 2권 (여가부 본부) 존재
    "02_성평등가족부_여가부/[출처_한국건강가정진흥원_패밀리넷]/01_가족센터_사업안내_2권_2025.pdf",
    # 14. 장애인복지사업안내 2025 1권 -> 2026 사업안내 2권(556p 최신정본) 존재
    "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인복지사업안내_1권_지역사회재활_2025.hwp",
    # 15. 푸드뱅크 2026 hwpx -> 2026 57.7MB 완전체 PDF 존재
    "01_보건복지부/[출처_보건복지부_공식누리집]/13_기부식품등_제공사업안내_푸드뱅크_2026.hwpx",
    # 16. 사회복지시설 관리안내 2026 hwpx -> 사용자 제공 2026 PDF 정본으로 대체
    "01_보건복지부/[출처_보건복지부_공식누리집]/01_사회복지시설_관리안내_공통_2026.hwpx",
    # 17. 서사협의 사회복지시설 관리안내 중복 PDF 정리 (복지부 공식누리집 정본 1개로 단일화)
    "01_보건복지부/[출처_서울시사회복지사협회_자료실]/01_사회복지시설_관리안내_공통_2026.pdf"
]

print("=== Executing Cleanup ===")
deleted_count = 0
deleted_bytes = 0

for rel in files_to_delete:
    p = os.path.join(root, rel.replace('/', os.sep))
    if os.path.exists(p):
        sz = os.path.getsize(p)
        os.remove(p)
        deleted_count += 1
        deleted_bytes += sz
        print(f"DELETED: {sz:10,d} bytes | {rel}")
    else:
        print(f"ALREADY REMOVED OR NOT FOUND: {rel}")

# Replace MOHW facility management guide with user-uploaded official PDF
user_pdf = "C:/Users/ks011/.gemini/antigravity/brain/3acc3efa-6733-44cb-9b64-bea73592d3fb/.user_uploaded/media_1794667334195_32196b68.pdf"
target_pdf = os.path.join(root, "01_보건복지부", "[출처_보건복지부_공식누리집]", "01_사회복지시설_관리안내_공통_2026.pdf")
if os.path.exists(user_pdf):
    shutil.copy2(user_pdf, target_pdf)
    print(f"COPIED user official PDF -> {target_pdf} ({os.path.getsize(target_pdf):,d} bytes)")

# Remove empty directories if any
for dirpath, dirnames, filenames in os.walk(root, topdown=False):
    if not dirnames and not filenames:
        os.rmdir(dirpath)
        print(f"REMOVED EMPTY DIR: {dirpath}")

print(f"\nCleanup finished! Deleted {deleted_count} files ({deleted_bytes / (1024*1024):.2f} MB).")
