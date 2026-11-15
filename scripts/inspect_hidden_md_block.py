# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('<div class="hidden md:block space-y-6">')
print(html[pos:pos+2500])
