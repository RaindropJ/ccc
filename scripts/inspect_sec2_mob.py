import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Section 2 header
sec2_start = text.find('섹션 Ⅱ: 범부처 및 특화·전문 실천지침서')
if sec2_start != -1:
    print("=== SECTION 2 HEADER & START ===")
    print(text[sec2_start - 300 : sec2_start + 1500])

# Mobile section
mob_start = text.find('md:hidden')
if mob_start != -1:
    print("\n=== MOBILE CARDS SECTION ===")
    print(text[mob_start - 50 : mob_start + 2000])
