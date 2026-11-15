import json
import os
import fitz

db_path = 'src/data/guidelines-archive-db.js'
with open(db_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Parse JSON
start_marker = 'const GUIDELINES_ARCHIVE_DB = '
end_marker = ';\n\nif (typeof window'

idx_start = text.find(start_marker) + len(start_marker)
idx_end = text.find(end_marker)

header = text[:idx_start]
footer = text[idx_end:]
data = json.loads(text[idx_start:idx_end])

replacements = {
    '00_사회복지시설_종사자_인건비가이드라인_2026.hwpx': '00_사회복지시설_종사자_인건비가이드라인_2026.pdf',
    '03_노인맞춤돌봄서비스_사업안내_2026_첨부1.hwpx': '03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf',
    '05_발달장애인지원센터_사업안내_2026_첨부2.hwpx': '05_발달장애인지원센터_사업안내_2026_첨부1.pdf',
    '05_장애인복지사업안내_2026_첨부2.hwp': '05_장애인복지사업안내_2026_첨부1.pdf',
    '08_아동보호서비스_업무매뉴얼_2026.hwpx': '08_아동보호서비스_업무매뉴얼_2026.pdf',
    '09_지역아동센터_지원사업안내_2026_첨부2.hwpx': '09_지역아동센터_지원사업안내_2026_첨부1.pdf',
    '11_정신건강사업안내_2026_첨부1.hwp': '11_정신건강사업안내_2026_첨부2.pdf',
    '01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.hwp': '01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.pdf'
}

updated_count = 0
for cat in data:
    for src in cat.get('sources', []):
        for f in src.get('files', []):
            fn = f.get('filename')
            if fn in replacements:
                new_fn = replacements[fn]
                f['filename'] = new_fn
                f['actualExt'] = 'PDF'
                f['format'] = 'PDF'
                # check if relPath needs update
                if 'relPath' in f and fn in f['relPath']:
                    f['relPath'] = f['relPath'].replace(fn, new_fn)
                # check local file size and pages
                local_candidates = [
                    os.path.join('docs', '지침서_공식_아카이브', f.get('relPath', '')),
                    os.path.join('Efficiency_DB', f.get('relPath', '')),
                    os.path.join('docs', '지침서_공식_아카이브', cat.get('categoryKey', ''), src.get('sourceKey', ''), new_fn),
                    os.path.join('Efficiency_DB', '02_노인복지', new_fn),
                    os.path.join('Efficiency_DB', '04_아동돌봄복지', new_fn)
                ]
                for cand in local_candidates:
                    if os.path.exists(cand):
                        size_b = os.path.getsize(cand)
                        f['sizeBytes'] = size_b
                        if size_b >= 1024 * 1024:
                            f['sizeStr'] = f"{size_b / (1024*1024):.1f} MB"
                        else:
                            f['sizeStr'] = f"{size_b / 1024:.1f} KB"
                        try:
                            doc = fitz.open(cand)
                            f['totalPages'] = len(doc)
                            doc.close()
                        except:
                            pass
                        break
                updated_count += 1
                print(f"Updated {fn} -> {new_fn} ({f.get('totalPages')} pages, {f.get('sizeStr')})")

new_content = header + json.dumps(data, ensure_ascii=False, indent=2) + footer
with open(db_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated {updated_count} entries in guidelines-archive-db.js!")
