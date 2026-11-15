import os
import zipfile

root = "docs/지침서_공식_아카이브"
zip_path = "docs/2026_사회복지_공식지침서_마스터_풀패키지.zip"

print(f"Creating ZIP package at: {zip_path}")
total_files = 0
total_uncompressed = 0

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for dirpath, dirnames, filenames in os.walk(root):
        for f in filenames:
            if f.endswith('.zip'): continue
            p = os.path.join(dirpath, f)
            arcname = os.path.relpath(p, root)
            zf.write(p, arcname)
            total_files += 1
            total_uncompressed += os.path.getsize(p)

zip_size = os.path.getsize(zip_path)
print(f"ZIP package created successfully!")
print(f"Total files packaged: {total_files} files")
print(f"Uncompressed size: {total_uncompressed / (1024*1024):.2f} MB")
print(f"Compressed ZIP size: {zip_size / (1024*1024):.2f} MB")
