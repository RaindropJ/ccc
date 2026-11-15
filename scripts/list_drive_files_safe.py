import subprocess
import json
import re

def run_gdrive(args):
    cmd = ['gdrive'] + args
    res = subprocess.run(cmd, capture_output=True, shell=True)
    out = res.stdout.decode('cp949', errors='replace')
    err = res.stderr.decode('cp949', errors='replace')
    return out, err

def parse_ls(out):
    lines = out.strip().splitlines()
    if len(lines) < 3:
        return []
    # Skip header
    items = []
    for line in lines[2:]:
        # id name type size
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

def scan_drive():
    root_id = "1Xj329hrtcrfgiY0atJYiCHY7pG6KVrlh"
    print(f"Scanning Google Drive root: {root_id}")
    out, _ = run_gdrive(['readonly', 'ls', root_id])
    root_items = parse_ls(out)
    
    tree = {}
    for item in root_items:
        print(f"Root item: {item['name']} ({item['type']}, {item['id']})")
        if item['type'] == 'folder':
            sub_out, _ = run_gdrive(['readonly', 'ls', item['id']])
            sub_items = parse_ls(sub_out)
            tree[item['name']] = {
                'id': item['id'],
                'items': sub_items,
                'subfolders': {}
            }
            for sitem in sub_items:
                if sitem['type'] == 'folder':
                    subsub_out, _ = run_gdrive(['readonly', 'ls', sitem['id']])
                    subsub_items = parse_ls(subsub_out)
                    tree[item['name']]['subfolders'][sitem['name']] = {
                        'id': sitem['id'],
                        'items': subsub_items,
                        'subsubfolders': {}
                    }
                    for ssitem in subsub_items:
                        if ssitem['type'] == 'folder':
                            ss_out, _ = run_gdrive(['readonly', 'ls', ssitem['id']])
                            ss_items = parse_ls(ss_out)
                            tree[item['name']]['subfolders'][sitem['name']]['subsubfolders'][ssitem['name']] = {
                                'id': ssitem['id'],
                                'items': ss_items
                            }

    with open('drive_tree_cache.json', 'w', encoding='utf-8') as f:
        json.dump(tree, f, ensure_ascii=False, indent=2)
    print("Drive scan complete! Saved to drive_tree_cache.json")

if __name__ == '__main__':
    scan_drive()
