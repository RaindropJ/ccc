with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('selectDomainFilter(\'donation\'')
if idx != -1:
    print(text[idx-50:idx+200])
