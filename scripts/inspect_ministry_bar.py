with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('selectMinistryGroup(\'all\'')
if idx != -1:
    print(text[idx-500:idx+1500])
