# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function showView(viewId) {')
end_pos = text.find('window.scrollTo({ top: 0, behavior: \'smooth\' });', pos)
print(text[pos:end_pos+60])
