with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines[:100]):
    if '01_사회복지관' in line or 'badge:' in line:
        print(f"Line {i+1}: {line.strip()}")
