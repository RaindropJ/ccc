import json
import re
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# 1. Load 12대 분야 데이터 (welfare-taxonomy.js)
def load_taxonomy():
    with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
        text = f.read()
    
    # parse WELFARE_FIELDS
    match = re.search(r'export const WELFARE_FIELDS\s*=\s*(\[.*?\]);', text, re.DOTALL)
    if not match:
        raise ValueError("Could not parse WELFARE_FIELDS")
    fields = json.loads(match.group(1))
    return fields

# 2. Load 3단계 위계 도감 데이터 (welfare-hierarchy-db.js)
def load_hierarchy():
    with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
        text = f.read()
    
    m_domains = re.search(r'const WELFARE_HIERARCHY_DOMAINS\s*=\s*(\[.*?\]);', text, re.DOTALL)
    m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', text, re.DOTALL)
    
    domains = json.loads(m_domains.group(1))
    nodes = json.loads(m_nodes.group(1))
    return domains, nodes

# 3. Load 공식 지침서 아카이브 데이터 (guidelines-archive-db.js)
def load_archive():
    with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
        text = f.read()
    
    m_db = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', text, re.DOTALL)
    categories = json.loads(m_db.group(1))
    
    all_files = []
    for cat in categories:
        for src in cat.get('sources', []):
            for f in src.get('files', []):
                all_files.append(f)
    return all_files

print("Loader functions defined successfully")
