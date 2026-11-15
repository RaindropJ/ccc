import re, json

with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract GUIDELINES_ARCHIVE_DB array
idx = text.find('const GUIDELINES_ARCHIVE_DB =')
if idx != -1:
    arr_str = text[idx + len('const GUIDELINES_ARCHIVE_DB ='):].strip()
    if arr_str.endswith(';'):
        arr_str = arr_str[:-1].strip()
    data = json.loads(arr_str)
    print("Parsed JSON successfully!")
    print(f"Total categories: {len(data)}")
    all_files = []
    sec1, sec2 = 0, 0
    for cat in data:
        for src in cat.get('sources', []):
            for file in src.get('files', []):
                all_files.append(file)
                if file.get('section') == 'SECTION_1':
                    sec1 += 1
                elif file.get('section') == 'SECTION_2':
                    sec2 += 1
    print(f"Total files: {len(all_files)}, Section 1: {sec1}, Section 2: {sec2}")
    print("First file:", all_files[0]['id'], all_files[0]['title'])
    print("Last file:", all_files[-1]['id'], all_files[-1]['title'])
