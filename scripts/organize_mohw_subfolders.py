import os
import shutil

mohw_dir = os.path.join("docs", "지침서_공식_아카이브", "01_보건복지부")
mohw_official_dir = os.path.join(mohw_dir, "[출처_보건복지부_공식누리집]")
sasw_dir = os.path.join(mohw_dir, "[출처_서울시사회복지사협회_자료실]")

os.makedirs(mohw_official_dir, exist_ok=True)
os.makedirs(sasw_dir, exist_ok=True)

sasw_files = [
    "00_사회복지법인_관리안내_2026_2026년_사회복지법인_관리안내.pdf",
    "01_사회복지시설_관리안내_공통_2026.pdf",
    "07_아동분야사업안내_2023_2023_아동분야_사업안내_[1권]_(최종).pdf",
    "07_아동분야사업안내_2023_2023_아동분야_사업안내_[2권]_(최종).pdf",
    "09_다함께돌봄사업안내_2023_2023_다함께돌봄_사업안내.pdf",
    "12_노숙인_등의_복지사업안내_2024_2024년_노숙인_등의_복지사업안내.pdf",
    "16_긴급복지지원사업안내_2026_2026년_긴급복지지원사업_안내.pdf"
]

for item in os.listdir(mohw_dir):
    p = os.path.join(mohw_dir, item)
    if os.path.isdir(p):
        continue
    if item in sasw_files:
        dest = os.path.join(sasw_dir, item)
        shutil.move(p, dest)
        print(f"[SASW] Moved: {item}")
    else:
        dest = os.path.join(mohw_official_dir, item)
        shutil.move(p, dest)
        print(f"[MOHW] Moved: {item}")

print("\n--- Organization Complete ---")
print("MOHW Official:", len(os.listdir(mohw_official_dir)), "files")
print("SASW Backup:", len(os.listdir(sasw_dir)), "files")
