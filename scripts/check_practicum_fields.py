import re

with open('index.html', encoding='utf-8') as f:
    text = f.read()

# Find options in prac-facility-select
select = re.search(r'<select[^>]*id="prac-facility-select"[^>]*>(.*?)</select>', text, re.DOTALL)
if select:
    options = re.findall(r'<option[^>]*value="([^"]+)"', select.group(1))
    print("prac-facility-select options:", options)

# Find how practicum items are filtered in renderPracticumCards
idx = text.find('function renderPracticumCards')
if idx != -1:
    print(text[idx+500:idx+2000])
