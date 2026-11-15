import time
import os
import sys
from pyhwpx import Hwp

src = os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_발달장애인지원센터_사업안내_2026_첨부2.hwpx")
dst = os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_발달장애인지원센터_사업안내_2026_첨부2.pdf")

print("Initializing Hwp...", flush=True)
hwp = Hwp(visible=False)

print(f"Opening: {src}", flush=True)
t0 = time.time()
hwp.open(src, arg="forceopen:true;versionwarning:false;suspendpassword:true")
print(f"Opened in {time.time()-t0:.2f}s", flush=True)

print(f"Saving as PDF to: {dst}", flush=True)
t1 = time.time()
hwp.save_as(dst, "PDF")
print(f"Saved in {time.time()-t1:.2f}s", flush=True)

hwp.quit()
print(f"File created: {os.path.exists(dst)}, size: {os.path.getsize(dst):,} bytes", flush=True)
