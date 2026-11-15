# -*- coding: utf-8 -*-
import json

with open('scripts/first_90_nodes.json', 'r', encoding='utf-8') as f:
    first_90 = json.load(f)

with open('scripts/first_90_id_map.py', 'w', encoding='utf-8') as out:
    out.write("# -*- coding: utf-8 -*-\n\nFIRST_90_NODES_DATA = [\n")
    for idx, n in enumerate(first_90):
        out.write(f"    ({idx+1}, '{n['id']}', '{n['domainId']}', '{n['level3']}', '{n.get('summary', '')}'),\n")
    out.write("]\n")

print("Created scripts/first_90_id_map.py successfully")
