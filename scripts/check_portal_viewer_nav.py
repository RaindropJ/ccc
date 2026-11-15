with open('stitch_portal_viewer.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<button[^>]*>(?:(?!</button>).)*?(?:공식 지침서|3단계 위계|분야·시설 도감).*?</button>', text, re.DOTALL)
print(f"Buttons in portal viewer: {len(matches)}")
for m in matches:
    clean = re.sub(r'<[^>]+>', ' ', m)
    print(' ', ' '.join(clean.split()))

anchors = re.findall(r'<a[^>]*>(?:(?!</a>).)*?(?:공식 지침서|3단계 위계|분야·시설 도감).*?</a>', text, re.DOTALL)
print(f"Anchors in portal viewer: {len(anchors)}")
for a in anchors:
    clean = re.sub(r'<[^>]+>', ' ', a)
    print(' ', ' '.join(clean.split()))
