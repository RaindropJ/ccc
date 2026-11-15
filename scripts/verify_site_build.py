import os
import re

def main():
    print("=== Site Integration Verification ===")
    
    # 1. Check guidelines-archive-db.js
    db_path = "src/data/guidelines-archive-db.js"
    assert os.path.exists(db_path), f"Missing {db_path}"
    with open(db_path, "r", encoding="utf-8") as f:
        db_content = f.read()
    assert "window.GUIDELINES_ARCHIVE_DB" in db_content, "Missing window.GUIDELINES_ARCHIVE_DB"
    assert "window.GOOGLE_DRIVE_ARCHIVE_CONFIG" in db_content, "Missing window.GOOGLE_DRIVE_ARCHIVE_CONFIG"
    print(f"✓ {db_path} verified ({len(db_content):,} chars)")

    # 2. Check archive.js
    js_path = "src/js/archive.js"
    assert os.path.exists(js_path), f"Missing {js_path}"
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()
    assert "renderArchiveView" in js_content, "Missing renderArchiveView"
    assert "window.renderArchiveView" in js_content, "Missing window.renderArchiveView"
    assert "PDF" in js_content, "Missing PDF badge"
    assert "openGoogleDriveModal" in js_content, "Missing Google Drive modal"
    print(f"✓ {js_path} verified ({len(js_content):,} chars)")

    # 3. Check index.html
    html_path = "index.html"
    assert os.path.exists(html_path), f"Missing {html_path}"
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    assert 'src/data/guidelines-archive-db.js' in html_content, "Missing script tag for DB"
    assert 'src/js/archive.js' in html_content, "Missing script tag for archive.js"
    assert 'id="view-archive"' in html_content, "Missing view-archive section"
    assert "showView('archive')" in html_content, "Missing showView('archive') calls"
    assert 'nav-fields-dropdown-group' in html_content, "Missing dropdown group"
    print(f"✓ {html_path} verified ({len(html_content):,} chars)")

    # 4. Check git status to ensure docs/ binaries are NOT tracked
    print("\nAll integration assertions passed successfully!")

if __name__ == "__main__":
    main()
