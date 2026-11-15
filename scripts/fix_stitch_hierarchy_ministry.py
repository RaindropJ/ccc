with open('stitch_welfare_hierarchy.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_s = 'overflow-x-auto whitespace-nowrap scrollbar-none" id="ministryGroupTabs">'
new_s = 'flex-wrap gap-2" id="ministryGroupTabs">'

text = text.replace(old_s, new_s)
text = text.replace('전체 부처 (12대 분야 · 90개 단위)', '전체 부처 (12대 분야 · 167개 단위)')
text = text.replace('보건복지부 (7대 분야 · 55개)', '보건복지부 (7대 분야 · 112개)')
text = text.replace('여성가족부 (2대 분야 · 15개)', '여성가족부 (2대 분야 · 28개)')
text = text.replace('교육부 (1대 분야 · 4개)', '교육부 (1대 분야 · 8개)')
text = text.replace('고용노동부·복지부공동 (1대 분야 · 5개)', '고용노동부·복지부공동 (1대 분야 · 10개)')
text = text.replace('제3섹터·공동모금회 (1대 분야 · 4개)', '제3섹터·공동모금회 (1대 분야 · 9개)')

with open('stitch_welfare_hierarchy.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated stitch_welfare_hierarchy.html successfully!")
