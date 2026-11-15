import json
import json5
import re
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_spreadsheet():
    # -------------------------------------------------------------
    # 1. DATA EXTRACTION
    # -------------------------------------------------------------
    
    # 1-1. Load welfare-taxonomy.js
    with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
        tax_text = f.read()
    m_fields = re.search(r'export const WELFARE_FIELDS\s*=\s*(\[\s*\{.*?\}\s*\]);', tax_text, re.DOTALL)
    tax_fields = json5.loads(m_fields.group(1))
    tax_by_name = {f['name'].split('·')[0].strip(): f for f in tax_fields}
    
    # 1-2. Load welfare-hierarchy-db.js
    with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
        hier_text = f.read()
    m_doms = re.search(r'const WELFARE_HIERARCHY_DOMAINS\s*=\s*(\[.*?\]);', hier_text, re.DOTALL)
    m_nodes = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', hier_text, re.DOTALL)
    hierarchy_domains = json.loads(m_doms.group(1))
    hierarchy_nodes = json.loads(m_nodes.group(1))
    
    # 1-3. Load DOMAIN_MAP from src/js/hierarchy.js for legal and ministry
    with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
        js_text = f.read()
    # Manual metadata mapping for 12 domains
    domain_meta = {
        '01_사회복지관': {'ministry': '보건복지부', 'legal': '「사회복지사업법」 제34조의5, 동법 시행규칙 제21조의2', 'badge': '보건복지부'},
        '02_노인복지': {'ministry': '보건복지부', 'legal': '「노인복지법」 제27조의2·제36조, 「노인장기요양보험법」', 'badge': '보건복지부'},
        '03_장애인복지': {'ministry': '보건복지부', 'legal': '「장애인복지법」 제58조·제59조의9, 「발달장애인법」 제33조', 'badge': '보건복지부'},
        '04_아동돌봄복지': {'ministry': '보건복지부·교육부', 'legal': '「아동복지법」 제37조·제45조, 「아동학대처벌법」 제11조', 'badge': '보건복지부·교육부'},
        '05_영유아보육': {'ministry': '교육부·보건복지부', 'legal': '「영유아보육법」 제10조·제24조, 유보통합 표준보육과정', 'badge': '교육부·보건복지부'},
        '06_가족복지': {'ministry': '여성가족부', 'legal': '「건강가정기본법」 제35조, 「다문화가족지원법」 제12조', 'badge': '여성가족부'},
        '07_청소년여성권익': {'ministry': '여성가족부', 'legal': '「청소년기본법」 제18조, 「가정폭력방지법」 제5조', 'badge': '여성가족부'},
        '08_정신건강자살예방': {'ministry': '보건복지부', 'legal': '「정신건강복지법」 제15조, 「자살예방법」 제12조', 'badge': '보건복지부'},
        '09_자활고용지원': {'ministry': '고용노동부·보건복지부', 'legal': '「국민기초생활보장법」 제15조, 「구직자 취업촉진법」 제6조', 'badge': '고용노동부·보건복지부'},
        '10_학교사회복지': {'ministry': '교육부', 'legal': '「초·중등교육법」 제54조, 교육복지우선지원사업 훈령', 'badge': '교육부'},
        '11_지역보호긴급돌봄': {'ministry': '보건복지부', 'legal': '「긴급복지지원법」 제5조·제8조, 「사회서비스원법」 제10조', 'badge': '보건복지부'},
        '12_배분모금국제': {'ministry': '제3섹터·보건복지부·외교부', 'legal': '「사회복지공동모금회법」 제20조, 「한국국제협력단법」 제7조', 'badge': '제3섹터·공동모금회'}
    }
    
    # 1-4. Load guidelines-archive-db.js
    with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
        arc_text = f.read()
    m_db = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', arc_text, re.DOTALL)
    archive_categories = json.loads(m_db.group(1))
    archive_files = []
    for cat in archive_categories:
        for src in cat.get('sources', []):
            for f in src.get('files', []):
                archive_files.append(f)
                
    print(f"Loaded: Domains={len(hierarchy_domains)}, HierarchyNodes={len(hierarchy_nodes)}, ArchiveFiles={len(archive_files)}")

    # -------------------------------------------------------------
    # 2. WORKBOOK INITIALIZATION & STYLES
    # -------------------------------------------------------------
    wb = openpyxl.Workbook()
    
    # Styles
    font_header = Font(name='맑은 고딕', size=11, bold=True, color='FFFFFF')
    font_body = Font(name='맑은 고딕', size=10)
    font_bold = Font(name='맑은 고딕', size=10, bold=True)
    font_num = Font(name='Calibri', size=10)
    
    border_thin = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )
    
    align_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    align_left = Alignment(horizontal='left', vertical='top', wrap_text=True)
    align_header = Alignment(horizontal='center', vertical='center', wrap_text=True)
    
    fill_zebra_even = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
    fill_zebra_odd = PatternFill(start_color='F8FAFC', end_color='F8FAFC', fill_type='solid')

    # -------------------------------------------------------------
    # 3. SHEET 1: 12대 분야·시설 도감
    # -------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "12대 분야·시설 도감"
    ws1.views.sheetView[0].showGridLines = True
    
    fill_head_1 = PatternFill(start_color='1E3A8A', end_color='1E3A8A', fill_type='solid') # Navy
    
    headers_1 = [
        "연번", "분야 코드", "12대 실천 분야명", "소관 정부부처", "핵심 근거 법령",
        "법정 관할 시설군 (생활시설 / 이용시설 / 공공조직)", "분야 개요 및 기능 설명",
        "사회복지사 주요 실무 직무", "현장실습 과업 및 권장 팁", "취업처 및 필수 자격요건"
    ]
    
    ws1.append(headers_1)
    ws1.row_dimensions[1].height = 28
    for col_idx in range(1, len(headers_1) + 1):
        cell = ws1.cell(row=1, column=col_idx)
        cell.font = font_header
        cell.fill = fill_head_1
        cell.alignment = align_header
        cell.border = border_thin
        
    for idx, d in enumerate(hierarchy_domains, 1):
        d_id = d['id']
        meta = domain_meta.get(d_id, {})
        # Find matching tax field if any
        short_key = d['name'].split('·')[0].split('(')[0].strip()
        matched_tax = None
        for tf in tax_fields:
            if short_key in tf['name'] or tf['name'].split('·')[0].strip() in d['name']:
                matched_tax = tf
                break
                
        facilities_str = "\n".join([f"● {ft}" for ft in d.get('facilityTypes', [])])
        if matched_tax and matched_tax.get('facilities'):
            fac_dict = matched_tax['facilities']
            lines = []
            if fac_dict.get('living'):
                lines.append("[생활시설] " + ", ".join(fac_dict['living']))
            if fac_dict.get('using'):
                lines.append("[이용시설] " + ", ".join(fac_dict['using']))
            if fac_dict.get('extended'):
                lines.append("[확장/공공] " + ", ".join(fac_dict['extended']))
            if lines:
                facilities_str = "\n\n".join(lines)
                
        roles_str = ""
        if matched_tax and matched_tax.get('roles'):
            roles_str = "\n".join([f"• {r}" for r in matched_tax['roles']])
        else:
            roles_str = "• 법정 고유기능 및 세부 단위서비스 수행\n• 민관협력 및 통합사례관리 네트워크"
            
        practicum_str = ""
        if matched_tax and matched_tax.get('practicum'):
            p = matched_tax['practicum']
            practicum_str = f"진입도: {p.get('availability', '활발')}\n추천: {p.get('recommendedFor', '')}\n실습과업:\n" + "\n".join(p.get('dailyTasks', [])) + f"\n\n팁: {p.get('tips', '')}"
        else:
            practicum_str = "연중 동·하계 실습 운영 / 해당 지침서 기반 단위서비스 기획 및 사례관리 집중 지도"
            
        career_str = ""
        if matched_tax and matched_tax.get('career'):
            c = matched_tax['career']
            career_str = f"주요취업처: {', '.join(c.get('workplaces', []))}\n자격요건: {c.get('qualifications', '')}\n보수체계: {c.get('compensation', '')}"
        else:
            career_str = "해당 법정 사회복지시설 및 전담기관 채용 / 사회복지사 1·2급"

        row_vals = [
            idx,
            d_id,
            d['name'],
            meta.get('ministry', '보건복지부'),
            meta.get('legal', ''),
            facilities_str,
            d.get('description', ''),
            roles_str,
            practicum_str,
            career_str
        ]
        ws1.append(row_vals)
        r_num = idx + 1
        ws1.row_dimensions[r_num].height = 110
        fill_curr = fill_zebra_even if idx % 2 == 0 else fill_zebra_odd
        for c_idx in range(1, len(row_vals) + 1):
            cell = ws1.cell(row=r_num, column=c_idx)
            cell.font = font_body
            cell.fill = fill_curr
            cell.border = border_thin
            if c_idx in [1, 2, 4]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left
                
    ws1.freeze_panes = 'A2'
    ws1.auto_filter.ref = f"A1:{get_column_letter(len(headers_1))}{len(hierarchy_domains) + 1}"

    # -------------------------------------------------------------
    # 4. SHEET 2: 3단계 위계 도감 (167)
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="3단계 위계 도감 (167)")
    ws2.views.sheetView[0].showGridLines = True
    fill_head_2 = PatternFill(start_color='065F46', end_color='065F46', fill_type='solid') # Deep Emerald
    
    headers_2 = [
        "연번", "실천분야 ID", "1단계: 실천분야", "소관 부처", "관련 근거법령",
        "대표 시설유형", "2단계: 대분류 (기능/대사업)", "3단계: 중분류 (사업분야)",
        "소분류: 법정단위서비스명", "핵심 사업내용 및 실무개입 요약",
        "원천 지침서 파일명 (Efficiency_DB)", "지침서 수록 챕터", "수록 페이지", "아카이브 연계코드"
    ]
    
    ws2.append(headers_2)
    ws2.row_dimensions[1].height = 28
    for col_idx in range(1, len(headers_2) + 1):
        cell = ws2.cell(row=1, column=col_idx)
        cell.font = font_header
        cell.fill = fill_head_2
        cell.alignment = align_header
        cell.border = border_thin

    domain_name_map = {d['id']: d['name'] for d in hierarchy_domains}

    for idx, node in enumerate(hierarchy_nodes, 1):
        d_id = node.get('domainId', '')
        d_name = domain_name_map.get(d_id, d_id)
        meta = domain_meta.get(d_id, {})
        
        details_list = node.get('details', [])
        if details_list:
            details_str = "\n".join([f"• {x}" for x in details_list])
        else:
            details_str = node.get('summary', '')
            
        gref = node.get('guidelineRef', {})
        
        row_vals = [
            idx,
            d_id,
            d_name,
            meta.get('ministry', '보건복지부'),
            meta.get('legal', ''),
            node.get('facilityType', '법정시설'),
            node.get('level1', ''),
            node.get('level2', ''),
            node.get('level3', ''),
            details_str,
            gref.get('file', ''),
            gref.get('chapter', ''),
            gref.get('page', ''),
            gref.get('archiveCode', '')
        ]
        ws2.append(row_vals)
        r_num = idx + 1
        ws2.row_dimensions[r_num].height = 55
        fill_curr = fill_zebra_even if idx % 2 == 0 else fill_zebra_odd
        for c_idx in range(1, len(row_vals) + 1):
            cell = ws2.cell(row=r_num, column=c_idx)
            cell.font = font_body
            cell.fill = fill_curr
            cell.border = border_thin
            if c_idx in [1, 2, 4, 13, 14]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left
                
    ws2.freeze_panes = 'A2'
    ws2.auto_filter.ref = f"A1:{get_column_letter(len(headers_2))}{len(hierarchy_nodes) + 1}"

    # -------------------------------------------------------------
    # 5. SHEET 3: 공식 지침서 아카이브 (53)
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="공식 지침서 아카이브 (53)")
    ws3.views.sheetView[0].showGridLines = True
    fill_head_3 = PatternFill(start_color='1D4ED8', end_color='1D4ED8', fill_type='solid') # Vivid Blue
    
    headers_3 = [
        "연번", "문서 ID", "관리 코드", "지침서 공식 명칭", "소관 정부부처", "소관 부서",
        "발행 연도", "적용 대상 법령 및 관할 시설", "총 페이지", "포맷", "파일 용량",
        "아카이브 상대경로", "주요 수록 챕터 및 핵심서식"
    ]
    
    ws3.append(headers_3)
    ws3.row_dimensions[1].height = 28
    for col_idx in range(1, len(headers_3) + 1):
        cell = ws3.cell(row=1, column=col_idx)
        cell.font = font_header
        cell.fill = fill_head_3
        cell.alignment = align_header
        cell.border = border_thin
        
    for idx, f in enumerate(archive_files, 1):
        chapters_str = ", ".join(f.get('keyChapters', [])) if f.get('keyChapters') else ''
        row_vals = [
            idx,
            f.get('id', ''),
            f.get('code', ''),
            f.get('title', ''),
            f.get('ministry', ''),
            f.get('department', ''),
            f.get('year', '2026'),
            f.get('legalTarget', ''),
            f.get('totalPages', ''),
            f.get('format', 'PDF'),
            f.get('sizeStr', ''),
            f.get('relPath', ''),
            chapters_str
        ]
        ws3.append(row_vals)
        r_num = idx + 1
        ws3.row_dimensions[r_num].height = 40
        fill_curr = fill_zebra_even if idx % 2 == 0 else fill_zebra_odd
        for c_idx in range(1, len(row_vals) + 1):
            cell = ws3.cell(row=r_num, column=c_idx)
            cell.font = font_body
            cell.fill = fill_curr
            cell.border = border_thin
            if c_idx in [1, 2, 3, 5, 7, 9, 10, 11]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left
                
    ws3.freeze_panes = 'A2'
    ws3.auto_filter.ref = f"A1:{get_column_letter(len(headers_3))}{len(archive_files) + 1}"

    # -------------------------------------------------------------
    # 6. AUTO-FIT COLUMN WIDTHS
    # -------------------------------------------------------------
    for ws in [ws1, ws2, ws3]:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val = str(cell.value or '')
                lines = val.split('\n')
                line_lens = [len(l.encode('euc-kr', errors='ignore')) for l in lines]
                cur_max = max(line_lens) if line_lens else 0
                if cur_max > max_len:
                    max_len = cur_max
            # width heuristic
            ws.column_dimensions[col_letter].width = max(min(max_len + 3, 55), 11)
            
    # Specific adjustments for readability
    # Sheet 1
    ws1.column_dimensions['A'].width = 8
    ws1.column_dimensions['B'].width = 16
    ws1.column_dimensions['C'].width = 24
    ws1.column_dimensions['D'].width = 20
    ws1.column_dimensions['E'].width = 30
    ws1.column_dimensions['F'].width = 45
    ws1.column_dimensions['G'].width = 50
    ws1.column_dimensions['H'].width = 45
    ws1.column_dimensions['I'].width = 50
    ws1.column_dimensions['J'].width = 50

    # Sheet 2
    ws2.column_dimensions['A'].width = 8
    ws2.column_dimensions['B'].width = 16
    ws2.column_dimensions['C'].width = 22
    ws2.column_dimensions['D'].width = 18
    ws2.column_dimensions['E'].width = 26
    ws2.column_dimensions['F'].width = 22
    ws2.column_dimensions['G'].width = 25
    ws2.column_dimensions['H'].width = 25
    ws2.column_dimensions['I'].width = 32
    ws2.column_dimensions['J'].width = 55
    ws2.column_dimensions['K'].width = 40
    ws2.column_dimensions['L'].width = 25
    ws2.column_dimensions['M'].width = 12
    ws2.column_dimensions['N'].width = 16

    # Sheet 3
    ws3.column_dimensions['A'].width = 8
    ws3.column_dimensions['B'].width = 12
    ws3.column_dimensions['C'].width = 16
    ws3.column_dimensions['D'].width = 45
    ws3.column_dimensions['E'].width = 15
    ws3.column_dimensions['F'].width = 18
    ws3.column_dimensions['G'].width = 12
    ws3.column_dimensions['H'].width = 40
    ws3.column_dimensions['I'].width = 12
    ws3.column_dimensions['J'].width = 10
    ws3.column_dimensions['K'].width = 14
    ws3.column_dimensions['L'].width = 50
    ws3.column_dimensions['M'].width = 45

    output_filename = "2026_대한민국_사회복지_현장실무_3대_통합데이터북.xlsx"
    wb.save(output_filename)
    print(f"Workbook saved successfully as '{output_filename}'!")
    return output_filename

if __name__ == '__main__':
    build_spreadsheet()
