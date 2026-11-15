with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('window.selectMinistryGroup(\'moe\'')
if idx != -1:
    print(text[idx:idx+1500])
