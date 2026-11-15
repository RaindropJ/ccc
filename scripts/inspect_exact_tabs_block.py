with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="ministryGroupTabs"')
end = text.find('</div>', text.find('</button>', idx + 800))
print(text[idx-50:end+10])
