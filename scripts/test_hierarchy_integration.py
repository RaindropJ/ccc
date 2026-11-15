# -*- coding: utf-8 -*-
"""
사회복지 3단계 위계 도감 (숲에서 나무로) 전수 통합 검증 스크립트
"""
import os
import re
import json

def test_all():
    print("=== Testing Welfare Hierarchy Integration ===")

    # 1. DB verification
    db_path = os.path.join("src", "data", "welfare-hierarchy-db.js")
    assert os.path.exists(db_path), "welfare-hierarchy-db.js must exist"
    with open(db_path, "r", encoding="utf-8") as f:
        db_content = f.read()

    m_dom = re.search(r'const WELFARE_HIERARCHY_DOMAINS = (\[[\s\S]*?\]);\n', db_content)
    assert m_dom, "WELFARE_HIERARCHY_DOMAINS must be present"
    doms = json.loads(m_dom.group(1))
    assert len(doms) == 12, f"Expected 12 domains, got {len(doms)}"
    print(f"✓ 12 Domains verified")

    m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES = (\[[\s\S]*?\]);\n', db_content)
    assert m_nodes, "WELFARE_HIERARCHY_NODES must be present"
    nodes = json.loads(m_nodes.group(1))
    assert len(nodes) == 90, f"Expected 90 nodes, got {len(nodes)}"
    print(f"✓ 90 Nodes verified")

    # Check guideline file existence
    eff_dir = "Efficiency_DB"
    missing = []
    for node in nodes:
        d = node["domainId"]
        f = node["guidelineRef"]["file"]
        full = os.path.join(eff_dir, d, f)
        if not os.path.exists(full):
            missing.append(f"{d}/{f}")
    assert len(missing) == 0, f"Missing files in Efficiency_DB: {missing}"
    print(f"✓ All 90 guideline references match files in Efficiency_DB")

    # 2. Controller JS verification
    js_path = os.path.join("src", "js", "hierarchy.js")
    assert os.path.exists(js_path), "hierarchy.js must exist"
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()
    assert "renderHierarchyView" in js_content, "renderHierarchyView must be defined"
    assert "handleHierarchySearch" in js_content, "handleHierarchySearch must be defined"
    assert "toggleHierarchyL1" in js_content, "toggleHierarchyL1 must be defined"
    print(f"✓ hierarchy.js controller verified")

    # 3. index.html verification
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    assert 'src/data/welfare-hierarchy-db.js' in html, "Script welfare-hierarchy-db.js must be in index.html"
    assert 'src/js/hierarchy.js' in html, "Script hierarchy.js must be in index.html"
    assert 'id="view-hierarchy"' in html, "view-hierarchy section must be in index.html"
    assert "showView('hierarchy')" in html, "showView('hierarchy') must be present in index.html"
    print(f"✓ index.html integration verified")

    # 4. app.js routing verification
    with open(os.path.join("src", "js", "app.js"), "r", encoding="utf-8") as f:
        app_js = f.read()
    assert "viewId === 'hierarchy'" in app_js, "app.js must handle 'hierarchy' in showView"
    print(f"✓ app.js routing verified")

    print("\nAll Hierarchy Integration tests passed 100%!")

if __name__ == "__main__":
    test_all()
