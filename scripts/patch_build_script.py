# -*- coding: utf-8 -*-
with open("scripts/build_welfare_hierarchy_db.py", "r", encoding="utf-8") as f:
    code = f.read()

# Replace generate_js function to use standard const and window export
old_gen = """def generate_js():
    lines = []
    lines.append("/**")
    lines.append(" * 대한민국 사회복지 현장 12대 실천 분야 3단계 위계 데이터베이스 (Official Active DB)")
    lines.append(" * - 위계: [대분류(법정기능/대사업)] -> [중분류(사업분야/프로그램)] -> [소분류(단위서비스/사업내용)]")
    lines.append(" * - 원천 데이터: Efficiency_DB (38종 핵심 지침서 2026/2027 공식 최신본)")
    lines.append(" * - 규칙 준수: GEMINI.md '3단계 위계 데이터 구축 집중 원칙' 반영 (위계 및 지침서 출처 중심)")
    lines.append(" */\\n")
    
    # Export DOMAINS
    lines.append("export const WELFARE_HIERARCHY_DOMAINS = " + json.dumps(DOMAINS, ensure_ascii=False, indent=2) + ";\\n")
    
    # Export NODES
    lines.append("export const WELFARE_HIERARCHY_NODES = " + json.dumps(NODES, ensure_ascii=False, indent=2) + ";\\n")"""

new_gen = """def generate_js():
    lines = []
    lines.append("/**")
    lines.append(" * 대한민국 사회복지 현장 12대 실천 분야 3단계 위계 데이터베이스 (Official Active DB)")
    lines.append(" * - 위계: [대분류(법정기능/대사업)] -> [중분류(사업분야/프로그램)] -> [소분류(단위서비스/사업내용)]")
    lines.append(" * - 원천 데이터: Efficiency_DB (38종 핵심 지침서 2026/2027 공식 최신본)")
    lines.append(" * - 규칙 준수: GEMINI.md '3단계 위계 데이터 구축 집중 원칙' 반영 (위계 및 지침서 출처 중심)")
    lines.append(" */\\n")
    
    lines.append("const WELFARE_HIERARCHY_DOMAINS = " + json.dumps(DOMAINS, ensure_ascii=False, indent=2) + ";\\n")
    lines.append("const WELFARE_HIERARCHY_NODES = " + json.dumps(NODES, ensure_ascii=False, indent=2) + ";\\n")"""

if old_gen in code:
    code = code.replace(old_gen, new_gen)
    # Also update export function to regular function and add window/module exports at bottom
    code = code.replace("export function getHierarchyByDomain", "function getHierarchyByDomain")
    code = code.replace("export function getHierarchyTree", "function getHierarchyTree")
    code = code.replace("export function getFullHierarchyTreeMap", "function getFullHierarchyTreeMap")
    code = code.replace("export function searchHierarchyNodes", "function searchHierarchyNodes")
    code = code.replace("export function getHierarchyStats", "function getHierarchyStats")
    
    # Add window/module exports
    tail_block = """
if (typeof window !== 'undefined') {
    window.WELFARE_HIERARCHY_DOMAINS = WELFARE_HIERARCHY_DOMAINS;
    window.WELFARE_HIERARCHY_NODES = WELFARE_HIERARCHY_NODES;
    window.getHierarchyByDomain = getHierarchyByDomain;
    window.getHierarchyTree = getHierarchyTree;
    window.getFullHierarchyTreeMap = getFullHierarchyTreeMap;
    window.searchHierarchyNodes = searchHierarchyNodes;
    window.getHierarchyStats = getHierarchyStats;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WELFARE_HIERARCHY_DOMAINS,
        WELFARE_HIERARCHY_NODES,
        getHierarchyByDomain,
        getHierarchyTree,
        getFullHierarchyTreeMap,
        searchHierarchyNodes,
        getHierarchyStats
    };
}
"""
    code = code.replace('  };\n}\n""")', f'  }};\n}}\n{tail_block}""")')

    with open("scripts/build_welfare_hierarchy_db.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated build script successfully")
else:
    print("Could not find old_gen block")
