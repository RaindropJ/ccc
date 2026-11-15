with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('domain-tab-btn')
if idx != -1:
    print(text[idx-200:idx+2000])
