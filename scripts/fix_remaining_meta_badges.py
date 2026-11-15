with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    ("badge: '3대 핵심기능 (16)'", "badge: '3대 핵심기능 (22)'"),
    ("badge: '맞춤돌봄·여가 (11)'", "badge: '맞춤돌봄·여가 (20)'"),
    ("badge: '자립·활동지원 (10)'", "badge: '자립·활동지원 (19)'"),
    ("badge: '학대보호·돌봄 (8)'", "badge: '학대보호·돌봄 (16)'"),
    ("badge: '표준보육·누리 (5)'", "badge: '표준보육·누리 (10)'"),
    ("badge: '정신의료재활 (6)'", "badge: '정신의료재활 (12)'"),
    ("badge: '신속개입망 (6)'", "badge: '신속개입망 (13)'"),
    ("🤝 모금·나눔배분 (4)", "🤝 모금·나눔배분 (9)")
]

for old, new in replacements:
    if old in text:
        text = text.replace(old, new)
        print(f"Replaced: {old} -> {new}")
    else:
        print(f"Not found: {old}")

with open('src/js/hierarchy.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Finished updating DOMAIN_META badges in src/js/hierarchy.js!")
