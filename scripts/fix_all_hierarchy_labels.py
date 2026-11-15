# -*- coding: utf-8 -*-

# 1. Update index.html home hero
with open('index.html', 'r', encoding='utf-8') as f:
    text_index = f.read()

text_index = text_index.replace('<span>🌳 3단계 위계 도감 (90)</span>', '<span>🌳 3단계 위계 도감 (167)</span>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text_index)
print("Updated index.html hero button count!")


# 2. Update src/js/hierarchy.js
with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text_h = f.read()

replacements = [
    # Top department filter tabs
    ('<span>보건복지부 (7대 분야 · 62개)</span>', '<span>보건복지부 (7대 분야 · 112개)</span>'),
    ('<span>관계부처 (5개 분야 · 28개)</span>', '<span>관계부처 (5개 분야 · 55개)</span>'),
    ('<span>여성가족부 (2개 분야)</span>', '<span>여성가족부 (2개 분야 · 28개)</span>'),
    
    # Category filter buttons
    ('🏢 종합사회복지관 (16)', '🏢 종합사회복지관 (22)'),
    ('👴 노인복지·맞춤돌봄 (11)', '👴 노인복지·맞춤돌봄 (20)'),
    ('♿ 장애인자립·재활 (10)', '♿ 장애인자립·재활 (19)'),
    ('🧒 아동보호·돌봄 (8)', '🧒 아동보호·돌봄 (16)'),
    ('🍼 영유아·보육지원 (5)', '🍼 영유아·보육지원 (10)'),
    ('🧠 정신건강·자살예방 (6)', '🧠 정신건강·자살예방 (12)'),
    ('🛡️ 긴급복지·위기개입 (6)', '🛡️ 긴급복지·위기개입 (13)'),
    ('🏠 가족·다문화 (7)', '🏠 가족·다문화 (13)'),
    ('🎒 청소년·여성권익 (8)', '🎒 청소년·여성권익 (15)'),
    ('🏫 학교사회복지 (4)', '🏫 학교사회복지 (8)'),
    ('💼 자활·일자리 (5)', '💼 자활·일자리 (10)'),
    ('❤️ 모금·나눔배분 (4)', '❤️ 모금·나눔배분 (9)'),
    
    # DOMAIN_META badges
    ("badge: '3대기능 (16)'", "badge: '3대기능 (22)'"),
    ("badge: '통합돌봄 (11)'", "badge: '통합돌봄 (20)'"),
    ("badge: '자립재활 (10)'", "badge: '자립재활 (19)'"),
    ("badge: '통합보호 (8)'", "badge: '통합보호 (16)'"),
    ("badge: '영유아돌봄 (5)'", "badge: '영유아돌봄 (10)'"),
    ("badge: '정신위기대응 (6)'", "badge: '정신위기대응 (12)'"),
    ("badge: '긴급돌봄 (6)'", "badge: '긴급돌봄 (13)'"),
    ("badge: '통합가족 (7)'", "badge: '통합가족 (13)'"),
    ("badge: '상담·보호쉼터 (8)'", "badge: '상담·보호쉼터 (15)'"),
    ("badge: '교육복지우선 (4)'", "badge: '교육복지우선 (8)'"),
    ("badge: '고용·복지 (5)'", "badge: '고용·복지 (10)'"),
    ("badge: '나눔배분·ODA (4)'", "badge: '나눔배분·ODA (9)'")
]

for old, new in replacements:
    if old in text_h:
        text_h = text_h.replace(old, new)
        print(f"  Replaced: {old} -> {new}")
    else:
        print(f"  Not found: {old}")

with open('src/js/hierarchy.js', 'w', encoding='utf-8') as f:
    f.write(text_h)
print("Updated src/js/hierarchy.js counts!")
