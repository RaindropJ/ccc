import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's see the 4 cards
cards_start = text.find('grid grid-cols-1 md:grid-cols-4')
if cards_start != -1:
    cards_end = text.find('<!-- Filter Bar and Search Component -->', cards_start)
    if cards_end == -1:
        cards_end = cards_start + 4000
    print("=== 4 CARDS SECTION ===")
    print(text[cards_start:cards_end])

# Let's see the filter bar
filter_start = text.find('<!-- Filter Bar and Search Component -->')
if filter_start != -1:
    tbl_start = text.find('<table')
    print("\n=== FILTER BAR & SEARCH ===")
    print(text[filter_start:tbl_start])
