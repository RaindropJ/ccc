import glob
import re

for html_file in glob.glob('*.html'):
    with open(html_file, encoding='utf-8') as f:
        content = f.read()
    
    matches = []
    # search for sub-nav-tabs or dropdown
    if 'sub-nav-tabs' in content:
        matches.append('sub-nav-tabs found')
    if 'nav-dropdown-quick' in content:
        matches.append('nav-dropdown-quick found')
    if 'mobile-subnav-menu' in content:
        matches.append('mobile-subnav-menu found')
        
    print(f"{html_file}: {matches}")
