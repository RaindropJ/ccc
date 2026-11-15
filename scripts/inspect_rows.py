import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

trs = re.findall(r'<tr class="hover:bg-surface-container-low/70 transition-colors">.*?</tr>', text, re.DOTALL)
print(f"Total rows found: {len(trs)}")
for i in [0, 1, 10]:
    if i < len(trs):
        print(f"\n=================== ROW {i+1} ===================")
        print(trs[i])
