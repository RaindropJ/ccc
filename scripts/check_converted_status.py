import os
import glob
import fitz

targets = [
    'Efficiency_DB',
    'docs/Efficiency_DB',
    'docs/지침서_공식_아카이브'
]

print("=== CHECKING ALL 14 FILES ===")
total_hwp = []
for t in targets:
    if os.path.exists(t):
        for root, dirs, files in os.walk(t):
            for f in files:
                if f.lower().endswith(('.hwp', '.hwpx')):
                    src = os.path.normpath(os.path.join(root, f))
                    pdf = os.path.splitext(src)[0] + '.pdf'
                    has_pdf = os.path.exists(pdf) and os.path.getsize(pdf) > 0
                    pages = 0
                    if has_pdf:
                        try:
                            doc = fitz.open(pdf)
                            pages = len(doc)
                            doc.close()
                        except:
                            has_pdf = False
                    total_hwp.append((src, pdf, has_pdf, pages))

for src, pdf, has_pdf, pages in total_hwp:
    status = f"DONE ({pages} pages, {os.path.getsize(pdf):,} bytes)" if has_pdf else "PENDING"
    print(f"[{status}] {src}")
