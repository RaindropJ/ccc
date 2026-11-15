import json

with open('drive_folders_map.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Root:", data['root_id'])
for top_name, top_info in data['folders'].items():
    print(f"\n[{top_name}] (ID: {top_info['id']})")
    for sub_name, sub_info in top_info.get('subfolders', {}).items():
        subsubs = sub_info.get('subfolders', {})
        if subsubs:
            print(f"  Folder: {sub_name} (ID: {sub_info['id']})")
            for ss_name, ss_info in subsubs.items():
                print(f"    Sub-folder: {ss_name} (ID: {ss_info['id']})")
        else:
            print(f"  Folder: {sub_name} (ID: {sub_info['id']})")
