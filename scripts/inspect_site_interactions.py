import re
import os

def check_file(path):
    if not os.path.exists(path):
        return
    with open(path, encoding='utf-8') as f:
        content = f.read()
    print(f"=== {path} ({len(content):,} bytes) ===")
    
    # Check dummy links or placeholders
    placeholders = re.findall(r'(https?://[^\s"\'<>]+(?:placeholder|dummy|example|test|welfare-archive)[^\s"\'<>]*)', content, re.I)
    if placeholders:
        print("  [!] Placeholder URLs found:")
        for p in set(placeholders):
            print("     ", p)
            
    # Check javascript:void(0) or href="#" without onclick
    empty_anchors = re.findall(r'<a\s+[^>]*href=["\'](?:#|javascript:void\(0\);?)["\'][^>]*>', content)
    no_click = [a for a in empty_anchors if 'onclick' not in a.lower()]
    if no_click:
        print(f"  [!] Found {len(no_click)} empty anchors without onclick:")
        for a in no_click[:5]:
            print("     ", a[:80])
            
    # Check buttons without onclick or type="submit" in forms
    buttons = re.findall(r'<button\s+[^>]*>', content)
    inert_buttons = [b for b in buttons if 'onclick' not in b.lower() and 'id=' not in b.lower() and 'type="submit"' not in b.lower()]
    if inert_buttons:
        print(f"  [!] Found {len(inert_buttons)} buttons without onclick or id:")
        for b in inert_buttons[:5]:
            print("     ", b[:80])

check_file('index.html')
check_file('src/js/app.js')
check_file('src/js/hierarchy.js')
check_file('src/js/archive.js')
check_file('src/data/guidelines-archive-db.js')
check_file('src/data/welfare-hierarchy-db.js')
