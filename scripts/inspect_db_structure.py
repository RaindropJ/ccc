with open('src/data/welfare-hierarchy-db.js', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i, l in enumerate(lines):
    if 'const ' in l or 'function ' in l or 'window.' in l:
        print(f"Line {i+1}: {l.strip()}")
