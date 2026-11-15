with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="view-archive"')
main_idx = text.rfind('<main', 0, idx)
print(text[main_idx : main_idx + 200])
