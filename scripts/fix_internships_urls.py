with open('src/data/internships-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

count = text.count('"url": "공공·행정"')
print(f"Occurrences before: {count}")

text = text.replace('"url": "공공·행정"', '"url": "https://job.alio.go.kr/recruit.do"')

with open('src/data/internships-db.js', 'w', encoding='utf-8') as f:
    f.write(text)

count_after = text.count('"url": "공공·행정"')
print(f"Occurrences after: {count_after}")
