with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="view-archive"')
if idx != -1:
    print('Found view-archive at:', idx)
    print(text[idx - 50 : idx + 300])
else:
    print('Not found')
