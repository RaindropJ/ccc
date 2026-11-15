with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<a[^>]*>(?:(?!</a>).)*?(?:공식 지침서|3단계 위계).*?</a>', text, re.DOTALL)
print(f"Found {len(matches)} matches in stitch_guidelines_archive.html:")
for m in matches:
    clean = re.sub(r'<[^>]+>', ' ', m)
    print(' ', ' '.join(clean.split()))
