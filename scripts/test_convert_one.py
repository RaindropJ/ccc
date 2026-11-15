import time
import os
from pyhwpx import Hwp

src = os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_발달장애인지원센터_사업안내_2026_첨부2.hwpx")
dst = os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_발달장애인지원센터_사업안내_2026_첨부2.pdf")

print("Initializing Hwp...")
t0 = time.time()
hwp = Hwp(visible=False)
print(f"Hwp initialized in {time.time()-t0:.2f}s")

print(f"Opening {src} (Size: {os.path.getsize(src):,} bytes)...")
t1 = time.time()
hwp.open(src)
print(f"Opened in {time.time()-t1:.2f}s")

print("Saving as PDF...")
t2 = time.time()
hwp.save_as(dst, "PDF")
print(f"Saved in {time.time()-t2:.2f}s")

hwp.quit()
print(f"Total time: {time.time()-t0:.2f}s")
if os.path.exists(dst):
    print(f"Output PDF size: {os.path.getsize(dst):,} bytes")
else:
    print("PDF output missing!")
