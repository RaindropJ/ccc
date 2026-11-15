import glob

for fpath in glob.glob('*.html') + glob.glob('src/**/*.js', recursive=True):
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    
    # Check if 'archive' comes before 'hierarchy' in nav blocks
    idx_arch = content.find("showView('archive')")
    idx_hier = content.find("showView('hierarchy')")
    if idx_arch != -1 and idx_hier != -1:
        print(f"{fpath}: archive at {idx_arch}, hierarchy at {idx_hier} (archive_before_hierarchy={idx_arch < idx_hier})")
