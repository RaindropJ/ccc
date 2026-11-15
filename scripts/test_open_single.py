import time
import os
import sys
from pyhwpx import Hwp

src = os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_발달장애인지원센터_사업안내_2026_첨부2.hwpx")
print(f"Testing OPEN on: {src} ({os.path.getsize(src):,} bytes)", flush=True)

hwp = Hwp(visible=False)
t0 = time.time()
res = hwp.open(src, arg="forceopen:true;versionwarning:false;suspendpassword:true")
print(f"hwp.open result: {res} in {time.time()-t0:.2f}s", flush=True)

hwp.quit()
print("Done.", flush=True)
