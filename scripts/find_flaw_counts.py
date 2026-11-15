import re

def search_text(path, patterns):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f"=== {path} ===")
    for p in patterns:
        matches = [l.strip() for l in text.splitlines() if p in l]
        print(f" Pattern '{p}': {len(matches)} matches")
        for m in matches[:5]:
            print("  ", m[:100])

search_text('index.html', ['3단계 위계 도감 (90)', '종합사회복지관 (16)', '노인복지·맞춤돌봄 (11)', '7대 분야 · 62개'])
search_text('src/js/hierarchy.js', ['종합사회복지관 (16)', '노인복지·맞춤돌봄 (11)', '7대 분야 · 62개', '3단계 위계 도감 (90)'])
