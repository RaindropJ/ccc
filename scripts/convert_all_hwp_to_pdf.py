import os
import sys
import shutil
import fitz # PyMuPDF
from pyhwpx import Hwp

def convert_files():
    targets = [
        os.path.abspath('Efficiency_DB'),
        os.path.abspath('docs/Efficiency_DB'),
        os.path.abspath('docs/지침서_공식_아카이브')
    ]

    hwp_files = []
    for t in targets:
        if os.path.exists(t):
            for root, dirs, files in os.walk(t):
                for f in files:
                    if f.lower().endswith(('.hwp', '.hwpx')):
                        src = os.path.normpath(os.path.join(root, f))
                        dst = os.path.splitext(src)[0] + '.pdf'
                        hwp_files.append((src, dst))

    print(f"Total files to process: {len(hwp_files)}")
    
    # Initialize Hwp once
    print("Starting Hancom Hwp engine...")
    hwp = Hwp(visible=False)
    print("Hancom Hwp engine ready.")

    converted_count = 0
    errors = []

    for idx, (src, dst) in enumerate(hwp_files, 1):
        print(f"\n[{idx}/{len(hwp_files)}] Converting: {src}")
        try:
            # If dst already exists and is non-zero, verify it
            if os.path.exists(dst) and os.path.getsize(dst) > 1000:
                try:
                    doc = fitz.open(dst)
                    page_count = len(doc)
                    doc.close()
                    if page_count > 0:
                        print(f"  -> Already exists and valid ({page_count} pages). Skipping re-conversion.")
                        converted_count += 1
                        continue
                except Exception:
                    pass

            # Open and save as PDF
            hwp.open(src)
            hwp.save_as(dst, "PDF")
            
            # Verify with PyMuPDF
            if os.path.exists(dst) and os.path.getsize(dst) > 0:
                doc = fitz.open(dst)
                page_count = len(doc)
                doc.close()
                print(f"  -> SUCCESS: Created {dst} ({page_count} pages, {os.path.getsize(dst):,} bytes)")
                converted_count += 1
            else:
                raise Exception("Output file was not generated or is empty.")

        except Exception as e:
            print(f"  -> ERROR converting {src}: {e}")
            errors.append((src, str(e)))

    hwp.quit()
    print("\n================ CONVERSION SUMMARY ================")
    print(f"Total: {len(hwp_files)}, Successful: {converted_count}, Errors: {len(errors)}")
    if errors:
        for s, err in errors:
            print(f"FAILED: {s} -> {err}")

if __name__ == '__main__':
    convert_files()
