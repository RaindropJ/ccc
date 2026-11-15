from test_loaders import load_taxonomy, load_hierarchy, load_archive

fields = load_taxonomy()
print(f"Taxonomy fields: {len(fields)}")
print(f"Sample field keys: {list(fields[0].keys())}")

domains, nodes = load_hierarchy()
print(f"Hierarchy domains: {len(domains)}, nodes: {len(nodes)}")
print(f"Sample node keys: {list(nodes[0].keys())}")

files = load_archive()
print(f"Archive files: {len(files)}")
print(f"Sample file keys: {list(files[0].keys())}")
