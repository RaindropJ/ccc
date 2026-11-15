# -*- coding: utf-8 -*-
import json
import re
import sys
sys.path.append('scripts')
from exact_option_a_data import EXACT_OPTION_A_MAP

DB_PATH = 'src/data/welfare-hierarchy-db.js'

with open(DB_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Match domains and nodes
m_doms = re.search(r'const WELFARE_HIERARCHY_DOMAINS\s*=\s*(\[.*?\]);', content, re.DOTALL)
m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', content, re.DOTALL)

if not m_doms or not m_nodes:
    print("Error: Could not find DOMAINS or NODES in welfare-hierarchy-db.js")
    sys.exit(1)

domains = json.loads(m_doms.group(1))
nodes = json.loads(m_nodes.group(1))

print(f"Loaded {len(domains)} domains, {len(nodes)} nodes.")

updated_count = 0
for n in nodes:
    nid = n['id']
    if nid in EXACT_OPTION_A_MAP:
        n['details'] = EXACT_OPTION_A_MAP[nid]
        updated_count += 1

print(f"Updated {updated_count} nodes with Option A perfected 3-bullet points.")

# Build new JS content
new_doms_json = json.dumps(domains, ensure_ascii=False, indent=2)
new_nodes_json = json.dumps(nodes, ensure_ascii=False, indent=2)

new_content = f"""/**
 * 대한민국 사회복지 현장 12대 실천 분야 3단계 위계 데이터베이스 (Official Active DB)
 * - 위계: [대분류(법정기능/대사업)] -> [중분류(사업분야/프로그램)] -> [소분류(단위서비스/사업내용)]
 * - 원천 데이터: Efficiency_DB (38종 핵심 지침서 2026/2027 공식 최신본)
 * - 규칙 준수: GEMINI.md '3단계 위계 데이터 구축 집중 원칙' 반영 (위계 및 지침서 출처 중심)
 * - 옵션 A: 실무 완결형 3대 단위과업 개조식 정제 완료 (전체 167개 노드 전수)
 */

const WELFARE_HIERARCHY_DOMAINS = {new_doms_json};

const WELFARE_HIERARCHY_NODES = {new_nodes_json};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ WELFARE_HIERARCHY_DOMAINS, WELFARE_HIERARCHY_NODES }};
}}
"""

with open(DB_PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully wrote updated DB to {DB_PATH}")
