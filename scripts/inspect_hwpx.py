import zipfile
import os

path = r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_발달장애인지원센터_사업안내_2026_첨부2.hwpx"
print("File size:", os.path.getsize(path))

try:
    with zipfile.ZipFile(path, 'r') as z:
        print("Valid ZIP archive! Namelist count:", len(z.namelist()))
        for name in z.namelist()[:10]:
            print(" ", name)
except Exception as e:
    print("Not a valid zip:", e)
