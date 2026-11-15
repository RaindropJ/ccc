with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('family')
if idx != -1:
    print(text[idx:idx+2000])
