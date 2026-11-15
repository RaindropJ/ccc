with open('index.html', encoding='utf-8') as f:
    text = f.read()

# 1. sub-nav-tabs
import re
m1 = re.search(r'(<div[^>]*id="sub-nav-tabs"[^>]*>)(.*?)(</div>\s*</div>\s*</div>)', text, re.DOTALL)
if m1:
    print("Found sub-nav-tabs block:")
    print(m1.group(0)[:1500])

# 2. dropdown
m2 = re.search(r'(<div[^>]*id="nav-dropdown-quick"[^>]*>)(.*?)(</div>\s*</div>\s*</div>)', text, re.DOTALL)
if m2:
    print("\nFound dropdown block:")
    print(m2.group(0)[:1200])

# 3. mobile menu
m3 = re.search(r'(<div[^>]*id="mobile-subnav-menu"[^>]*>)(.*?)(</div>)', text, re.DOTALL)
if m3:
    print("\nFound mobile-subnav-menu block:")
    print(m3.group(0)[:1200])
