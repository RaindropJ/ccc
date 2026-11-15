with open('src/js/app.js', 'r', encoding='utf-8') as f:
    text_app = f.read()

idx = text_app.find("viewId === 'archive'")
if idx != -1:
    print("=== app.js around 'archive' ===")
    print(text_app[idx - 50 : idx + 350])

with open('index.html', 'r', encoding='utf-8') as f:
    text_index = f.read()

idx = text_index.find("viewId === 'archive'")
if idx != -1:
    print("=== index.html around 'archive' ===")
    print(text_index[idx - 50 : idx + 350])
