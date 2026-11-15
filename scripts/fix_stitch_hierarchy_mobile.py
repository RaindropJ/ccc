with open('stitch_welfare_hierarchy.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_mob = '<a href="#" data-path="official-guidelines" class="flex items-center justify-between p-space-sm rounded-lg bg-secondary/10 text-secondary font-bold"><span>공식 지침서 아카이브 (53종)</span><span class="material-symbols-outlined text-[16px]">auto_stories</span></a><a href="#" data-path="statutory-hierarchy" class="flex items-center justify-between p-space-sm rounded-lg bg-primary text-on-primary font-bold"><span>3단계 위계 도감 (90개)</span><span class="material-symbols-outlined text-[16px]">account_tree</span></a>'

new_mob = '<a href="#" data-path="statutory-hierarchy" class="flex items-center justify-between p-space-sm rounded-lg bg-primary text-on-primary font-bold"><span>3단계 위계 도감 (90개)</span><span class="material-symbols-outlined text-[16px]">account_tree</span></a><a href="#" data-path="official-guidelines" class="flex items-center justify-between p-space-sm rounded-lg bg-secondary/10 text-secondary font-bold"><span>공식 지침서 아카이브 (53종)</span><span class="material-symbols-outlined text-[16px]">auto_stories</span></a>'

if old_mob in text:
    text = text.replace(old_mob, new_mob)
    with open('stitch_welfare_hierarchy.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated stitch_welfare_hierarchy.html mobile drawer!')
else:
    print('old_mob not found')
