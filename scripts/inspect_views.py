# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

views = re.findall(r'id=["\']view-([^"\']+)["\']', html)
print('Views in index.html:', views)

data_views = re.findall(r'data-view=["\']([^"\']+)["\']', html)
print('data-view buttons:', sorted(set(data_views)))

nav_items = re.findall(r'<a[^>]+href=["\']#([^"\']+)["\'][^>]*>(.*?)</a>', html)
print('\nNav items with hash links:')
for href, label in nav_items[:20]:
    clean_label = re.sub(r'<[^>]+>', '', label).strip()
    if clean_label:
        print(f'  #{href} -> {clean_label}')
