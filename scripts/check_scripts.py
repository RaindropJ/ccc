import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script[^>]*src="([^"]+)"', text)
for s in scripts:
    print('Script:', s)
