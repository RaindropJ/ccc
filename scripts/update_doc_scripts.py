with open('scripts/generate_doc1_research_report.py', 'r', encoding='utf-8') as f:
    t1 = f.read()
t1 = t1.replace('07_아동분야_1권_2025.pdf', '07_아동분야_1권_2026.pdf')
t1 = t1.replace('07_아동분야_2권_2025.pdf', '07_아동분야_2권_2026.pdf')
with open('scripts/generate_doc1_research_report.py', 'w', encoding='utf-8') as f:
    f.write(t1)

with open('scripts/generate_doc2_download_directory.py', 'r', encoding='utf-8') as f:
    t2 = f.read()
t2 = t2.replace('07_아동분야사업안내_1권_시설설치운영_2025.pdf', '07_아동분야사업안내_1권_시설설치운영_2026.pdf')
t2 = t2.replace('07_아동분야사업안내_2권_자립지원가정위탁_2025.pdf', '07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf')
t2 = t2.replace(
    '"07_아동분야사업안내_1권_시설설치운영_2026.pdf": ("보건복지부", "https://www.mohw.go.kr/board.es?mid=a10411010300&bid=0026"),',
    '"07_아동분야사업안내_1권_시설설치운영_2026.pdf": ("보건복지부", "https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no=1489787"),'
)
t2 = t2.replace(
    '"07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf": ("보건복지부", "https://www.mohw.go.kr/board.es?mid=a10411010300&bid=0026"),',
    '"07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf": ("보건복지부", "https://www.mohw.go.kr/board.es?mid=a10409020000&bid=0026&act=view&list_no=1489787"),'
)
with open('scripts/generate_doc2_download_directory.py', 'w', encoding='utf-8') as f:
    f.write(t2)

print("Doc generator scripts updated successfully!")
