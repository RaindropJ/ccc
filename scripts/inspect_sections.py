import re

with open('stitch_guidelines_archive.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the sections
# 1. Authority bar
auth_bar = re.search(r'<!-- Top Ministry Authority Status Bar -->.*?<!-- Primary Sub-Navigation', text, re.DOTALL)
if auth_bar:
    print("Authority bar found, length:", len(auth_bar.group(0)))

# 2. Sub-navigation
subnav = re.search(r'<!-- Primary Sub-Navigation.*?<!-- Operational Filter', text, re.DOTALL)
if subnav:
    print("Subnav found, length:", len(subnav.group(0)))

# 3. Filter section
filt = re.search(r'<!-- Operational Filter.*?<!-- Table 1', text, re.DOTALL)
if filt:
    print("Filter section found, length:", len(filt.group(0)))

# 4. Table 1
t1 = re.search(r'<!-- Table 1.*?<!-- Table 2', text, re.DOTALL)
if t1:
    print("Table 1 found, length:", len(t1.group(0)))

# 5. Table 2
t2 = re.search(r'<!-- Table 2.*?<!-- Mobile Card View', text, re.DOTALL)
if t2:
    print("Table 2 found, length:", len(t2.group(0)))

# 6. Mobile cards
mob = re.search(r'<!-- Mobile Card View.*?</main>', text, re.DOTALL)
if mob:
    print("Mobile section found, length:", len(mob.group(0)))
