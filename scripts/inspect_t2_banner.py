with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

t2_idx = text.find('<!-- Table 2: 범부처 및 특화·전문 실천지침서 -->')
banner_idx = text.find('<!-- Bottom Official Bulk Package Banner Section -->')
print("Table 2 start:", t2_idx)
print("Banner start:", banner_idx)

if t2_idx != -1 and banner_idx != -1:
    print("\n--- TABLE 2 HEADER ---")
    print(text[t2_idx : t2_idx + 1500])

if banner_idx != -1:
    print("\n--- BOTTOM BANNER & END OF MAIN ---")
    print(text[banner_idx : banner_idx + 2500])
