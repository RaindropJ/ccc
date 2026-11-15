# -*- coding: utf-8 -*-
import re

def update_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = 0
    for old, new in replacements:
        if old in content:
            c = content.count(old)
            content = content.replace(old, new)
            count += c
            print(f"  [{path}] Replaced '{old}' -> '{new}' ({c} times)")
        else:
            print(f"  [{path}] NOT FOUND: '{old}'")
            
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[{path}] Total replacements: {count}")

# 1. index.html
update_file('index.html', [
    ('bg-emerald-100 text-emerald-800 font-bold font-num text-[10px]">90</span>', 'bg-emerald-100 text-emerald-800 font-bold font-num text-[10px]">167</span>'),
    ('bg-emerald-600 text-white text-[10px] font-num">90</span>', 'bg-emerald-600 text-white text-[10px] font-num">167</span>'),
    ('bg-emerald-100 text-emerald-800 font-bold font-num">90건</span>', 'bg-emerald-100 text-emerald-800 font-bold font-num">167건</span>'),
    ('12대 분야 90개 법정 단위 서비스', '12대 분야 167개 법정 단위 서비스'),
    ('text-[10px] bg-emerald-100 text-emerald-700 rounded-full font-bold">90</span>', 'text-[10px] bg-emerald-100 text-emerald-700 rounded-full font-bold">167</span>')
])

# 2. src/js/hierarchy.js
update_file('src/js/hierarchy.js', [
    ('90개 법정단위서비스 전수 매트릭스', '167개 법정단위서비스 전수 매트릭스'),
    ('12대 분야 90개 법정단위서비스 위계 매트릭스', '12대 분야 167개 법정단위서비스 위계 매트릭스'),
    ('<span class="font-headline-lg text-headline-lg font-extrabold text-primary">90</span>', '<span class="font-headline-lg text-headline-lg font-extrabold text-primary">167</span>'),
    ('전체 12개 실천분야 / 90개 법정단위서비스 수록', '전체 12개 실천분야 / 167개 법정단위서비스 수록'),
    ('<span>전체 부처 (12대 분야 · 90개 단위)</span>', '<span>전체 부처 (12대 분야 · 167개 단위)</span>'),
    ('90개 단위서비스 스마트 카드 뷰', '167개 단위서비스 스마트 카드 뷰'),
    ('총 90개 전수', '총 167개 전수'),
    ('전국 90개 법정단위서비스', '전국 167개 법정단위서비스')
])

# 3. stitch_welfare_hierarchy.html
update_file('stitch_welfare_hierarchy.html', [
    ('3단계 위계 도감(90)', '3단계 위계 도감(167)'),
    ('3단계 위계 도감 (90개)', '3단계 위계 도감 (167개)'),
    ('12대 분야 90개 법정단위서비스 위계 매트릭스', '12대 분야 167개 법정단위서비스 위계 매트릭스'),
    ('전체 12개 실천분야 / 90개 법정단위서비스 수록', '전체 12개 실천분야 / 167개 법정단위서비스 수록'),
    ('>90</span>', '>167</span>'),
    ('90개_법정단위서비스_위계매트릭스.csv', '167개_법정단위서비스_위계매트릭스.csv')
])

# 4. stitch_guidelines_archive.html
update_file('stitch_guidelines_archive.html', [
    ('3단계 위계 도감 90개 법정단위 서비스', '3단계 위계 도감 167개 법정단위 서비스'),
    ('3단계 위계 도감</span><span class="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">90</span>', '3단계 위계 도감</span><span class="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">167</span>'),
    ('3단계 위계도감 90개 단위서비스 실시간 상호연동 중', '3단계 위계도감 167개 단위서비스 실시간 상호연동 중'),
    ('3단계 위계 도감 90단위', '3단계 위계 도감 167단위'),
    ('3단계 위계도감 90단위 연동조회 SCREEN_9', '3단계 위계도감 167단위 연동조회 SCREEN_9')
])

# 5. stitch_portal_viewer.html
update_file('stitch_portal_viewer.html', [
    ('🌳 3단계 위계 도감 90', '🌳 3단계 위계 도감 167'),
    ('text-[10px] font-num">90</span>', 'text-[10px] font-num">167</span>')
])

print("Badge update script completed!")
