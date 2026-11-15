with open('index.html', encoding='utf-8') as f:
    text = f.read()

# 1. Look for sub-nav-tabs
pos = text.find('id="sub-nav-tabs"')
if pos != -1:
    print("=== sub-nav-tabs ===")
    print(text[pos:pos+1500])

# 2. Look for quick dropdown
pos2 = text.find('id="nav-dropdown-quick"')
if pos2 != -1:
    print("=== nav-dropdown-quick ===")
    print(text[pos2:pos2+1000])

# 3. Look for mobile-subnav-menu
pos3 = text.find('id="mobile-subnav-menu"')
if pos3 != -1:
    print("=== mobile-subnav-menu ===")
    print(text[pos3:pos3+1000])
