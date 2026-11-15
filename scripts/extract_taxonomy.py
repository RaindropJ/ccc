import re

with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by objects inside WELFARE_FIELDS
field_chunks = text.split('{')
fields = []

current_id = None
current_name = None
current_fac = None

# Let's use a simpler regex or line by line state machine
lines = text.split('\n')
field_data = []
curr = {}
in_facilities = False
fac_type = None

for line in lines:
    line_s = line.strip()
    id_m = re.match(r"id:\s*['\"](\w+)['\"],", line_s)
    if id_m:
        if 'id' in curr and 'name' in curr:
            field_data.append(curr)
        curr = {'id': id_m.group(1), 'facilities': {'living': [], 'using': [], 'extended': []}}
        in_facilities = False
        continue
    
    name_m = re.match(r"name:\s*['\"]([^'\"]+)['\"],", line_s)
    if name_m and 'name' not in curr:
        curr['name'] = name_m.group(1)
        continue
        
    if 'facilities:' in line_s:
        in_facilities = True
        continue
        
    if in_facilities:
        for ftype in ['living', 'using', 'extended']:
            if line_s.startswith(f"{ftype}:"):
                # extract array
                arr_m = re.search(r"\[(.*)\]", line_s)
                if arr_m:
                    items = [x.strip().strip("'\"") for x in arr_m.group(1).split(',') if x.strip()]
                    curr['facilities'][ftype] = items
        if line_s.startswith('},') or line_s.startswith('}'):
            in_facilities = False

if 'id' in curr and 'name' in curr:
    field_data.append(curr)

print(f"Total fields found: {len(field_data)}")
for i, f in enumerate(field_data, 1):
    print(f"\n{i}. [{f['id']}] {f['name']}")
    for k, v in f['facilities'].items():
        print(f"   - {k}: {v}")
