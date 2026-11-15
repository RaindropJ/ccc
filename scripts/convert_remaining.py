import os
import time
from pyhwpx import Hwp
import fitz

targets = [
    r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\05_장애인복지사업안내_2026_첨부2.hwp",
    r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\09_지역아동센터_지원사업안내_2026_첨부2.hwpx",
    r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\11_정신건강사업안내_2026_첨부1.hwp",
]

print("Initializing Hwp for remaining files...", flush=True)
hwp = Hwp(visible=False)

for src_rel in targets:
    src = os.path.abspath(src_rel)
    dst = os.path.splitext(src)[0] + '.pdf'
    print(f"\nProcessing: {src_rel} ({os.path.getsize(src):,} bytes)", flush=True)
    t0 = time.time()
    try:
        hwp.open(src, arg="forceopen:true;versionwarning:false;suspendpassword:true")
        hwp.save_as(dst, "PDF")
        if os.path.exists(dst) and os.path.getsize(dst) > 0:
            doc = fitz.open(dst)
            pages = len(doc)
            doc.close()
            print(f"  -> SUCCESS: Created {os.path.basename(dst)} ({pages} pages, {os.path.getsize(dst):,} bytes) in {time.time()-t0:.2f}s", flush=True)
        else:
            print("  -> FAILED: Output file empty", flush=True)
    except Exception as e:
        print(f"  -> ERROR: {e}", flush=True)

hwp.quit()
print("\nDone.", flush=True)
