import json

with open('drive_tree_cache.json', 'r', encoding='utf-8') as f:
    tree = json.load(f)

for top_name, top_data in tree.items():
    print(f"\n==================== {top_name} ({top_data['id']}) ====================")
    for sub_name, sub_data in top_data.get('subfolders', {}).items():
        items_count = len(sub_data.get('items', []))
        subsub = list(sub_data.get('subsubfolders', {}).keys())
        print(f"  Folder: {sub_name} (ID: {sub_data['id']}) -> {items_count} items, subfolders: {subsub}")
        for it in sub_data.get('items', []):
            if not it['name'].lower().endswith('.pdf'):
                print(f"    [NON-PDF] {it['name']} ({it['type']}, {it['size']}) ID: {it['id']}")
            else:
                print(f"    [PDF] {it['name']} ({it['size']})")
        for ss_name, ss_data in sub_data.get('subsubfolders', {}).items():
            print(f"    Sub-subfolder: {ss_name} (ID: {ss_data['id']}) -> {len(ss_data.get('items', []))} items")
            for sit in ss_data.get('items', []):
                if not sit['name'].lower().endswith('.pdf'):
                    print(f"      [NON-PDF] {sit['name']} ({sit['type']}, {sit['size']}) ID: {sit['id']}")
                else:
                    print(f"      [PDF] {sit['name']} ({sit['size']})")
