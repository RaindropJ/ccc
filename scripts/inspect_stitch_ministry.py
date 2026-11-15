with open('stitch_welfare_hierarchy.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="ministryGroupTabs"')
if idx != -1:
    print(text[idx-50:idx+600])
