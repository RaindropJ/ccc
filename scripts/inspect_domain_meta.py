with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const DOMAIN_META =')
if idx != -1:
    print(text[idx:idx+1500])
