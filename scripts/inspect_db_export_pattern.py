# -*- coding: utf-8 -*-
with open('src/data/useful-sites-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('useful-sites-db.js first 15 lines:')
for l in text.split('\n')[:15]:
    print(' ', l)

print('useful-sites-db.js last 15 lines:')
for l in text.split('\n')[-15:]:
    print(' ', l)
