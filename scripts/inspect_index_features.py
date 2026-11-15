import re

with open('index.html', encoding='utf-8') as f:
    text = f.read()

views = re.findall(r'id=["\'](view-[^"\']+)["\']', text)
print("Views:", set(views))

nav_links = re.findall(r'href=["\']#(view-[^"\']+|[^"\']+)["\']', text)
print("Hash links:", set(nav_links[:20]))

onclicks = re.findall(r'onclick=["\']([^"\']+)["\']', text)
print(f"Total onclicks: {len(onclicks)}")

functions = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', text)
print(f"Total JS functions defined: {len(functions)}")
print("Sample functions:", functions[:20])

# Check for downloads or links
links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', text)
print(f"Total links: {len(links)}")
file_links = [l for l in links if any(ext in l.lower() for ext in ['.pdf', '.hwp', '.hwpx', '.zip', '.xlsx', '.docx'])]
print(f"File links: {len(file_links)}")
for fl in file_links[:10]:
    print("  File link:", fl)
