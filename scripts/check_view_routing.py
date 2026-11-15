with open('src/js/app.js', 'r', encoding='utf-8') as f:
    text_app = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    text_index = f.read()

print("app.js renderArchiveView occurrences:")
for line in text_app.splitlines():
    if 'renderArchiveView' in line or "'archive'" in line:
        print("  [app.js]", line.strip())

print("\nindex.html renderArchiveView occurrences:")
for line in text_index.splitlines():
    if 'renderArchiveView' in line or "'archive'" in line:
        print("  [index.html]", line.strip())
