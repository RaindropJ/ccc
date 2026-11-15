with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="view-hierarchy"')
if idx != -1:
    print('Found view-hierarchy at:', idx)
    print(text[idx - 50 : idx + 200])
