import re

with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
    text = f.read()

ranges = [
    (17, 68), (68, 118), (118, 167), (167, 217), 
    (217, 266), (266, 315), (315, 364), (364, 414), 
    (414, 464), (464, 513), (513, 562), (562, 615)
]

lines = text.split('\n')
for start, end in ranges:
    chunk = '\n'.join(lines[start:end])
    name = re.search(r"name:\s*['\"]([^'\"]+)['\"]", chunk)
    fid = re.search(r"id:\s*['\"]([^'\"]+)['\"]", chunk)
    fac_match = re.search(r"facilities:\s*\{([^}]+)\}", chunk, re.DOTALL)
    fname = name.group(1) if name else 'Unknown'
    field_id = fid.group(1) if fid else 'Unknown'
    print(f"\n==============================================")
    print(f"[{field_id}] {fname}")
    if fac_match:
        for fline in fac_match.group(1).strip().split('\n'):
            fline = fline.strip()
            if fline.startswith(('living:', 'using:', 'extended:')):
                print(" ", fline)
