import subprocess
import os
import sys

uploads = [
    {
        'local_path': os.path.abspath(r"Efficiency_DB\02_노인복지\01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.pdf"),
        'parent_id': '112tP2jeR4YGDHD32X0AAeLnTwymiUEvG',
        'desc': 'Efficiency_DB/02_노인복지/01_보훈업무...pdf'
    },
    {
        'local_path': os.path.abspath(r"Efficiency_DB\02_노인복지\03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf"),
        'parent_id': '112tP2jeR4YGDHD32X0AAeLnTwymiUEvG',
        'desc': 'Efficiency_DB/02_노인복지/03_노인맞춤돌봄...pdf'
    },
    {
        'local_path': os.path.abspath(r"Efficiency_DB\04_아동돌봄복지\08_아동보호서비스_업무매뉴얼_2026.pdf"),
        'parent_id': '1SJr0S81C7AO_KuhDcwqK5XY_FHcY5G-P',
        'desc': 'Efficiency_DB/04_아동돌봄복지/08_아동보호...pdf'
    },
    {
        'local_path': os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\00_사회복지시설_종사자_인건비가이드라인_2026.pdf"),
        'parent_id': '1fu_iTaVrt2VFIo3Q81h2gm3EwQuVBDD_',
        'desc': '지침서_공식_아카이브/01_보건복지부/00_인건비가이드라인...pdf'
    },
    {
        'local_path': os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf"),
        'parent_id': '1fu_iTaVrt2VFIo3Q81h2gm3EwQuVBDD_',
        'desc': '지침서_공식_아카이브/01_보건복지부/03_노인맞춤돌봄...pdf'
    },
    {
        'local_path': os.path.abspath(r"docs\지침서_공식_아카이브\01_보건복지부\[출처_보건복지부_공식누리집]\08_아동보호서비스_업무매뉴얼_2026.pdf"),
        'parent_id': '1fu_iTaVrt2VFIo3Q81h2gm3EwQuVBDD_',
        'desc': '지침서_공식_아카이브/01_보건복지부/08_아동보호...pdf'
    }
]

deletions = [
    # Efficiency_DB/02_노인복지
    {'id': '1GlZfXgnJzfJadftqqjm6nmmTurDis3kw', 'name': '01_보훈업무_시행지침_2권...hwp'},
    {'id': '1408wuuVlDCQ4gTjz_BfHIr79tla_GLJX', 'name': '03_노인맞춤돌봄서비스...hwpx'},
    # Efficiency_DB/04_아동돌봄복지
    {'id': '1d_SMiTY89kGCXRDitkG4uNvtMaHzIy-H', 'name': '08_아동보호서비스_업무매뉴얼...hwpx'},
    # 지침서_공식_아카이브/01_보건복지부/[출처_보건복지부_공식누리집]
    {'id': '1MSIu5_uuPXCrzsrVzl9WiI6IMyONyhpM', 'name': '00_사회복지시설_종사자_인건비가이드라인...hwpx'},
    {'id': '1x309IfwFyUh6l1pSdPfUGw-IYWXQi1a1', 'name': '03_노인맞춤돌봄서비스_사업안내...hwpx'},
    {'id': '1bZPtydoD9hb0_8kQeEUGIqJj0KLccB5Q', 'name': '05_발달장애인지원센터_사업안내...hwpx'},
    {'id': '1FFV4_B59kRoDj0ES65wAPwbJtXtWJJ6X', 'name': '05_장애인복지사업안내_2026_첨부2.hwp'},
    {'id': '1HjwRCa9I1VfRaZ7_E_56K1z6ACyHdXYZ', 'name': '08_아동보호서비스_업무매뉴얼...hwpx'},
    {'id': '1xHRhyEoDIiHS5xzMI5g3Hv2EiMa11PLE', 'name': '09_지역아동센터_지원사업안내...hwpx'},
    {'id': '1BMxajmVIV63dUsED49l-spM5EMXbTsgv', 'name': '11_정신건강사업안내_2026_첨부1.hwp'}
]

def execute_sync():
    print("=== STEP 1: UPLOADING NEWLY CONVERTED PDFS ===", flush=True)
    for idx, up in enumerate(uploads, 1):
        path = up['local_path']
        pid = up['parent_id']
        desc = up['desc']
        if not os.path.exists(path):
            print(f"[{idx}/{len(uploads)}] File missing locally: {path}", flush=True)
            continue
        size = os.path.getsize(path)
        print(f"[{idx}/{len(uploads)}] Uploading {desc} ({size:,} bytes) -> Parent {pid}...", flush=True)
        cmd = ['gdrive', 'mutate', 'upload', path, '--parent', pid]
        res = subprocess.run(cmd, capture_output=True, shell=True)
        out = res.stdout.decode('utf-8', errors='replace').strip()
        err = res.stderr.decode('utf-8', errors='replace').strip()
        print(f"  Result: {out} {err}", flush=True)

    print("\n=== STEP 2: TRASHING NON-PDF FILES ON GOOGLE DRIVE ===", flush=True)
    for idx, d in enumerate(deletions, 1):
        fid = d['id']
        name = d['name']
        print(f"[{idx}/{len(deletions)}] Trashing: {name} (ID: {fid})...", flush=True)
        cmd = ['gdrive', 'mutate', 'trash', fid]
        res = subprocess.run(cmd, capture_output=True, shell=True)
        out = res.stdout.decode('utf-8', errors='replace').strip()
        err = res.stderr.decode('utf-8', errors='replace').strip()
        print(f"  Result: {out} {err}", flush=True)

    print("\n=== SYNC COMPLETE ===", flush=True)

if __name__ == '__main__':
    execute_sync()
