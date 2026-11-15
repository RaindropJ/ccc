with open('src/data/welfare-hierarchy-db.js', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(185, 230):
    print(lines[i], end='')
