import subprocess
import json
import re

def run_gdrive(args):
    cmd = ['gdrive'] + args
    res = subprocess.run(cmd, capture_output=True, shell=True)
    out = res.stdout.decode('utf-8', errors='replace')
    err = res.stderr.decode('utf-8', errors='replace')
    return out, err

def parse_ls(out):
    lines = out.strip().splitlines()
    if len(lines) < 3:
        return []
    items = []
    for line in lines[2:]:
        parts = re.split(r'\s{2,}', line.strip())
        if len(parts) >= 3:
            item_id = parts[0]
            name = parts[1]
            itype = parts[2]
            size = parts[3] if len(parts) > 3 else ""
            items.append({
                'id': item_id,
                'name': name,
                'type': itype,
                'size': size
            })
    return items

def build_mapping():
    root_id = "1Xj329hrtcrfgiY0atJYiCHY7pG6KVrlh"
    out, _ = run_gdrive(['readonly', 'ls', root_id])
    root_items = parse_ls(out)
    
    mapping = {
        'root_id': root_id,
        'folders': {}
    }
    
    for r_item in root_items:
        if r_item['type'] == 'folder':
            top_name = r_item['name']
            top_id = r_item['id']
            mapping['folders'][top_name] = {
                'id': top_id,
                'subfolders': {}
            }
            sub_out, _ = run_gdrive(['readonly', 'ls', top_id])
            for s_item in parse_ls(sub_out):
                if s_item['type'] == 'folder':
                    s_name = s_item['name']
                    s_id = s_item['id']
                    mapping['folders'][top_name]['subfolders'][s_name] = {
                        'id': s_id,
                        'subfolders': {}
                    }
                    ss_out, _ = run_gdrive(['readonly', 'ls', s_id])
                    for ss_item in parse_ls(ss_out):
                        if ss_item['type'] == 'folder':
                            ss_name = ss_item['name']
                            ss_id = ss_item['id']
                            mapping['folders'][top_name]['subfolders'][s_name]['subfolders'][ss_name] = {
                                'id': ss_id
                            }

    with open('drive_folders_map.json', 'w', encoding='utf-8') as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)
    print("Folder mapping saved to drive_folders_map.json")

if __name__ == '__main__':
    build_mapping()
