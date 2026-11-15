import json
import subprocess
import re

def run_gdrive(args):
    cmd = ['gdrive'] + args
    res = subprocess.run(cmd, capture_output=True, shell=True)
    out = res.stdout.decode('utf-8', errors='replace')
    return out

with open('drive_folders_map.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

non_pdf_files = []

def scan_folder(folder_id, folder_path):
    out = run_gdrive(['readonly', 'ls', folder_id, '--max', '100'])
    lines = out.strip().splitlines()
    if len(lines) < 3:
        return
    for line in lines[2:]:
        parts = re.split(r'\s{2,}', line.strip())
        if len(parts) >= 3:
            fid = parts[0]
            name = parts[1]
            ftype = parts[2]
            size = parts[3] if len(parts) > 3 else ''
            if ftype != 'folder':
                if ftype != 'application/pdf' and not name.lower().endswith('.md') and not name.lower().endswith('.docx'):
                    non_pdf_files.append({
                        'id': fid,
                        'name': name,
                        'type': ftype,
                        'size': size,
                        'folder_path': folder_path,
                        'folder_id': folder_id
                    })

for top_name, top_info in data['folders'].items():
    scan_folder(top_info['id'], top_name)
    for sub_name, sub_info in top_info.get('subfolders', {}).items():
        sub_path = f"{top_name}/{sub_name}"
        scan_folder(sub_info['id'], sub_path)
        for ss_name, ss_info in sub_info.get('subfolders', {}).items():
            ss_path = f"{top_name}/{sub_name}/{ss_name}"
            scan_folder(ss_info['id'], ss_path)

print(f"Total non-PDF guideline files found in Google Drive: {len(non_pdf_files)}")
for f in non_pdf_files:
    print(f"  [{f['folder_path']}] {f['name']} ({f['type']}, {f['size']}) -> ID: {f['id']}")

with open('drive_non_pdf_to_delete.json', 'w', encoding='utf-8') as out_f:
    json.dump(non_pdf_files, out_f, ensure_ascii=False, indent=2)
