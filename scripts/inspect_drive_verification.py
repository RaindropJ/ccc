import subprocess
import re

folders = {
    'Efficiency_DB/02_노인복지': '112tP2jeR4YGDHD32X0AAeLnTwymiUEvG',
    'Efficiency_DB/04_아동돌봄복지': '1SJr0S81C7AO_KuhDcwqK5XY_FHcY5G-P',
    '지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]': '1fu_iTaVrt2VFIo3Q81h2gm3EwQuVBDD_'
}

print("=== FINAL GOOGLE DRIVE VERIFICATION ===")
for name, fid in folders.items():
    print(f"\n[{name}] (ID: {fid})")
    cmd = ['gdrive', 'readonly', 'ls', fid, '--max', '50']
    res = subprocess.run(cmd, capture_output=True, shell=True)
    out = res.stdout.decode('utf-8', errors='replace')
    non_pdf = 0
    pdf_count = 0
    for line in out.splitlines()[2:]:
        parts = re.split(r'\s{2,}', line.strip())
        if len(parts) >= 3:
            fid_item, fname, ftype = parts[0], parts[1], parts[2]
            size = parts[3] if len(parts) > 3 else ''
            if ftype == 'application/pdf':
                pdf_count += 1
                print(f"  [OK: PDF] {fname} ({size})")
            elif ftype != 'folder':
                non_pdf += 1
                print(f"  [WARN: NON-PDF] {fname} ({ftype})")
    print(f"  -> Total PDFs: {pdf_count}, Non-PDFs: {non_pdf}")
