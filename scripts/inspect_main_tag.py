with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="view-archive"')
print(text[idx - 300 : idx + 350])
