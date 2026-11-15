import os
import json
import subprocess
import docx
from docx import Document
from docx.shared import Mm, Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_hyperlink(paragraph, url, text, color="1D4ED8", underline=True, font_size_pt=8.0):
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    hyperlink = parse_xml(f'<w:hyperlink {nsdecls("w", "r")} r:id="{r_id}"/>')
    new_run = parse_xml(f'<w:r {nsdecls("w")}><w:rPr/><w:t>{text}</w:t></w:r>')
    rPr = new_run.find(qn('w:rPr'))
    if color:
        c = parse_xml(f'<w:color {nsdecls("w")} w:fill="{color}"/>' if 'w:fill' in color else f'<w:color {nsdecls("w")} w:val="{color}"/>')
        rPr.append(c)
    if underline:
        u = parse_xml(f'<w:u {nsdecls("w")} w:val="single"/>')
        rPr.append(u)
    if font_size_pt:
        sz_val = int(font_size_pt * 2)
        sz = parse_xml(f'<w:sz {nsdecls("w")} w:val="{sz_val}"/>')
        rPr.append(sz)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)

def build_research_report():
    doc = Document()
    
    # 1. Page Geometry (Strict Korean Standard A4)
    sec = doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(20)
    sec.bottom_margin = Mm(20)
    sec.left_margin = Mm(20)
    sec.right_margin = Mm(20)
    
    normal_style = doc.styles['Normal']
    normal_style.font.name = '맑은 고딕'
    normal_style.font.size = Pt(9.5)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    
    # Header / Footer
    footer = sec.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f_run = f_p.add_run("Efficiency_DB 기반 실무 총람 | 대한민국 사회복지 현장의 이해")
    f_run.font.size = Pt(8.0)
    f_run.font.color.rgb = RGBColor(0x9C, 0xA3, 0xAF)

    # ----------------------------------------------------
    # COVER / TITLE PAGE
    # ----------------------------------------------------
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(40)
    r_pre = p_pre.add_run("정책·연구 실무 총람 보고서 (Policy & Practice Research Report)")
    r_pre.font.size = Pt(11)
    r_pre.font.bold = True
    r_pre.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)
    
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(20)
    r_title = p_title.add_run("[연구·실무 보고서]\n대한민국 사회복지 공식 지침서\n법정 시설 매칭 및 연례 갱신 총람")
    r_title.font.size = Pt(22)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(30)
    r_sub = p_sub.add_run(
        "– 15개 제외 행정잡음 배제 및 38종 정예 실무 DB(Efficiency_DB) 기반\n"
        "– 12대 실천 분야·법정 시설 매칭 체계 및 정부 부처별 연례 갱신 프로토콜"
    )
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)
    
    # Meta Box Table (Width: 170mm)
    table_meta = doc.add_table(rows=5, cols=2)
    table_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_meta.autofit = False
    col_w = [Mm(40), Mm(130)]
    for row in table_meta.rows:
        for idx, width in enumerate(col_w):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=80, bottom=80, left=100, right=100)
    set_table_borders(table_meta, color="E5E7EB")
    
    meta_info = [
        ("연구 발행 기관", "사회복지현장의이해 교육포털 연구사업단"),
        ("기준 데이터베이스", "Efficiency_DB (38종 정예 실천 지침서 / 347.46 MB)"),
        ("법적 근거 체계", "「사회복지사업법」 및 15개 개별 사회복지 법률"),
        ("배포 기준 일자", "2026년 최신판 (2026. 11. 기준)"),
        ("연구 총괄 책임", "사회복지 실습교육 지원팀 및 지침서 아카이브 위원회")
    ]
    for idx, (label, val) in enumerate(meta_info):
        c0 = table_meta.rows[idx].cells[0]
        c1 = table_meta.rows[idx].cells[1]
        set_cell_shading(c0, "F3F4F6")
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(label)
        r0.font.bold = True
        r0.font.size = Pt(9.0)
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.size = Pt(9.0)
        
    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 1: 서론 및 Efficiency_DB 선별 의의
    # ----------------------------------------------------
    h1 = doc.add_heading("제1장. 연구 배경 및 Efficiency_DB 선별 의의", level=1)
    h1.paragraph_format.space_before = Pt(15)
    h1.paragraph_format.space_after = Pt(10)
    
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "대한민국 사회복지 현장은 보건복지부, 성평등가족부, 교육부, 고용노동부 등 각 정부 부처가 매년 발행하는 "
        "공식 '사업안내' 및 '업무매뉴얼'에 근거하여 운영된다. 전국 수만 개소의 사회복지시설은 이 지침서에 따라 "
        "국고 및 지방보조금을 집행하고, 지자체의 지도·점검과 중앙평가(평가인증)를 받는다. "
        "따라서 사회복지 현장실습생이 작성하는 실습일지, 기관분석보고서, 프로그램 프로포절 역시 이 법정 지침서의 "
        "기능 및 단위서비스 위계 체계와 100% 일치해야 실무적 정합성을 인정받는다.\n\n"
        "그러나 기존 53종의 마스터 아카이브에는 단위 서비스 및 실천 내용이 없는 인건비 호봉표, 법인 설립허가 규칙, "
        "시설 안전점검표, 빈 서식집(첨부2), 기관 주소록 엑셀, 거시 국정과제 선언문 등 15종의 '행정·노무 잡음 파일'이 "
        "포함되어 있어, 학생들이 [대분류:기능] → [중분류:사업분야] → [소분류:단위서비스]의 숲과 나무를 파악하는 데 "
        "심각한 혼선을 초래하였다."
    )
    
    # Screening Summary Box
    doc.add_heading("1.1. 마스터 아카이브 vs Efficiency_DB 비교 및 정예화 실사", level=2)
    
    table_comp = doc.add_table(rows=3, cols=3)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_comp.autofit = False
    comp_w = [Mm(40), Mm(65), Mm(65)]
    for row in table_comp.rows:
        for idx, width in enumerate(comp_w):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=80, bottom=80, left=100, right=100)
    set_table_borders(table_comp, color="9CA3AF")
    
    # Header
    for idx, title in enumerate(["구분", "마스터 아카이브 (Cold Storage)", "Efficiency_DB (Active DB)"]):
        cell = table_comp.rows[0].cells[idx]
        set_cell_shading(cell, "1E3A8A")
        p = cell.paragraphs[0]
        r = p.add_run(title)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        r.font.size = Pt(9.0)
        
    comp_data = [
        ("파일 수 및 용량", "53종 / 450.95 MB (전수 수집)", "38종 / 347.46 MB (정예 핵심 실무)"),
        ("주요 구성 내용", "실무 본문 + 인건비표 + 법인규정 + 빈서식집", "12대 실천 분야별 법정 사업 본문 매뉴얼 100%")
    ]
    for row_idx, (c0_text, c1_text, c2_text) in enumerate(comp_data, 1):
        r = table_comp.rows[row_idx]
        set_cell_shading(r.cells[0], "F9FAFB")
        r.cells[0].paragraphs[0].add_run(c0_text).font.size = Pt(8.5)
        r.cells[1].paragraphs[0].add_run(c1_text).font.size = Pt(8.5)
        r.cells[2].paragraphs[0].add_run(c2_text).font.size = Pt(8.5)

    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_before = Pt(8)
    r_n = p_note.add_run("※ 제외된 15개 파일은 단순 인건비 봉급표, 법인 설립허가, 화재 점검, 빈 서식집 등 행정 규정이며, 실습·프로그램 위계 분석 작업의 효율을 위해 Active DB에서 과감히 분리함.")
    r_n.font.size = Pt(8.0)
    r_n.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 2: 12대 실천 분야 및 법정 시설 매칭 총람
    # ----------------------------------------------------
    h2 = doc.add_heading("제2장. 12대 실천 분야별 법정 시설 매칭 총람 (38종 전수 분석)", level=1)
    h2.paragraph_format.space_before = Pt(15)
    h2.paragraph_format.space_after = Pt(10)
    
    p2 = doc.add_paragraph()
    p2.paragraph_format.line_spacing = 1.25
    p2.add_run(
        "Efficiency_DB에 수록된 38종의 지침서는 대한민국 15대 법정 시설 및 실습 영역을 100% 포괄한다. "
        "학생들은 아래의 12대 실천 분야 매칭 총람을 통해 자신이 실습 중인 시설의 법적 근거와 3단계 위계 구조를 즉시 추적할 수 있다."
    )

    domains_detail = [
        {
            "num": "01",
            "name": "사회복지관 (이용시설 3대 기능 체계)",
            "law": "「사회복지사업법」 제34조의5, 시행규칙 제23조",
            "facility": "종합사회복지관 (가·나·다형)",
            "files": ["02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf", "01_사회복지관_ESG_실천가이드_한국사회복지관협회.pdf"],
            "hierarchy": [
                ("사례관리기능", "사례발굴, 초기상담/사정, 통합사례회의, 서비스연계 및 모니터링"),
                ("서비스제공기능", "가족기능강화, 지역사회보호(급식, 보건의료, 경제적지원, 일상생활, 정서서비스-말벗), 교육문화, 자활"),
                ("지역조직화기능", "복지네트워크구축(지역욕구조사, 대학생실습지도), 주민조직화, 자원개발 및 관리(후원/봉사)")
            ]
        },
        {
            "num": "02",
            "name": "노인복지 (돌봄·여가·요양·일자리)",
            "law": "「노인복지법」 제31조~제39조의19, 「노인장기요양보험법」",
            "facility": "노인복지관, 노인요양시설, 주야간보호기관, 시니어클럽(일자리지원기관), 보훈요양원",
            "files": ["03_노인보건복지사업안내_1권_2026.pdf", "03_노인보건복지사업안내_2권_2026.pdf", "03_노인일자리_사업안내_2026.pdf", "03_노인맞춤돌봄_첨부1.hwpx", "01_보훈요양원_지침_2026.hwp"],
            "hierarchy": [
                ("노인맞춤돌봄 (직접서비스)", "안전지원(방문·전화안부), 사회참여(자조모임), 생활교육(영양·스마트폰), 일상생활지원(외출동행, 가사)"),
                ("노인여가·요양 케어서비스", "신체기능유지, 인지재활, 간호·투약관리, 여가문화프로그램, 물리치료"),
                ("노인일자리 및 사회활동", "공익활동(스쿨존교통, 환경정화), 사회서비스형(보육·노인돌봄보조), 시장형사업단(카페, 제조판매)")
            ]
        },
        {
            "num": "03",
            "name": "장애인복지 (재활·활동지원·일자리)",
            "law": "「장애인복지법」 제58조, 「발달장애인법」, 「장애인고용촉진법」",
            "facility": "장애인복지관, 장애인직업재활시설(보호작업장), 장애인활동지원기관, 발달장애인지원센터",
            "files": ["05_장애인복지사업안내_첨부1.pdf", "05_장애인활동지원_사업안내_2026.pdf", "05_발달장애인_첨부1.pdf", "05_장애인일자리_2026.pdf", "01_장애인직업능력개발원_매뉴얼.pdf"],
            "hierarchy": [
                ("활동지원급여 (활동보조)", "신체활동지원(목욕, 식사도움, 체위변경), 가사활동지원(취사, 청소, 세탁), 사회활동지원(등하교, 외출동행)"),
                ("발달장애인 지원사업", "개인별지원계획 수립, 성인주간활동서비스(취미·체육), 청소년방과후활동서비스"),
                ("직업재활 및 일자리", "직업평가, 직무적응훈련, 일반형일자리, 복지일자리(도서관사서보조, 디앤디케어)")
            ]
        },
        {
            "num": "04",
            "name": "아동돌봄복지 (통합사례관리·지역아동·보호)",
            "law": "「아동복지법」 제52조, 제45조, 제48조",
            "facility": "드림스타트, 지역아동센터, 다함께돌봄센터, 아동양육시설, 아동보호전문기관",
            "files": ["07_드림스타트_사업안내_2026.pdf", "09_지역아동센터_지원사업안내_첨부1.pdf", "09_다함께돌봄센터_2025.pdf", "07_아동분야_1권_2026.pdf", "07_아동분야_2권_2026.pdf", "08_아동보호서비스_매뉴얼.hwpx"],
            "hierarchy": [
                ("드림스타트 4대 영역", "신체·건강(영양교육, 검진), 인지·언어(학습멘토링), 정서·행동(심리치료), 부모·가족(양육코칭)"),
                ("지역아동센터 5대 영역", "보호(급식, 일상생활, 5대안전교육), 교육(교과학습, 예체능), 문화(견학, 캠프), 정서, 지역사회연계"),
                ("다함께돌봄 & 양육시설", "상시·일시돌봄, 방과후프로그램, 아동양육 및 자립지원, 학대피해아동 현장조사 및 심리치료")
            ]
        },
        {
            "num": "05",
            "name": "영유아보육 (어린이집 표준보육체계)",
            "law": "「영유아보육법」 제10조",
            "facility": "국공립·사회복지법인·민간 어린이집, 육아종합지원센터",
            "files": ["09_보육사업안내_어린이집운영_본문_2026.pdf"],
            "hierarchy": [
                ("표준보육과정 운영", "0~2세 기본생활·신체·사회관계·의사소통, 3~5세 누리과정(놀이중심 보육체계)"),
                ("영유아 건강·안전 관리", "영유아 건강검진, 영양관리 및 식단표 운영, 안전공제회 가입 및 감염병 예방")
            ]
        },
        {
            "num": "06",
            "name": "가족복지 (가족센터·다문화·한부모)",
            "law": "「건강가정기본법」, 「다문화가족지원법」, 「한부모가족지원법」",
            "facility": "가족센터(건강가정·다문화통합센터), 한부모가족복지시설",
            "files": ["01_가족사업안내_1권_2026.pdf", "01_가족사업안내_2권_2026.pdf", "02_한부모가족지원사업안내_2026.pdf"],
            "hierarchy": [
                ("가족센터 4대 영역", "가족관계(부모교육, 가족상담), 가족돌봄(아이돌봄), 가족생활(다문화자녀성장), 지역공동체(공동육아나눔터)"),
                ("한부모가족 지원", "생활안정지원, 모·부자 자립지원, 아동양육비 지원, 심리·정서 치료 프로그램")
            ]
        },
        {
            "num": "07",
            "name": "청소년·여성권익 (활동·쉼터·피해자보호)",
            "law": "「청소년기본법」, 「청소년복지지원법」, 「가정폭력·성폭력방지법」",
            "facility": "청소년수련관/문화의집, 청소년상담복지센터, 청소년쉼터/자립지원관, 폭력피해자보호시설",
            "files": ["01_청소년사업안내_1권_2026.pdf", "01_청소년사업안내_2권_2026.pdf", "03_여성아동권익증진_2026.pdf"],
            "hierarchy": [
                ("청소년 활동 및 상담", "청소년수련활동 인증프로그램, 청소년동아리, 1388 위기청소년 통합상담"),
                ("가출청소년 보호·자립", "일시·단기·중장기 청소년쉼터 숙식제공, 학업지원, 청소년자립지원관 취업훈련"),
                ("여성폭력피해자 보호", "피해자 긴급피난처 운영, 법률·의료 연계, 심리상담치료, 주거지원 및 취업알선")
            ]
        },
        {
            "num": "08",
            "name": "정신건강·자살예방 (지역사회 정신건강)",
            "law": "「정신건강복지법」 제15조, 「자살예방법」",
            "facility": "기초·광역 정신건강복지센터, 자살예방센터, 정신재활시설",
            "files": ["11_정신건강사업안내_첨부2.pdf", "11_자살예방사업안내_2026.pdf"],
            "hierarchy": [
                ("중증정신질환자 관리", "조기발견 및 등록, 사례관리(가정방문, 투약관리), 주간재활프로그램, 사회복귀훈련"),
                ("자살예방 및 위기개입", "24시간 위기상담전화(109) 연계, 자살고위험군 사후관리, 생명지킴이(게이트키퍼) 양성교육")
            ]
        },
        {
            "num": "09",
            "name": "자활·고용지원 (탈빈곤 자립훈련)",
            "law": "「국민기초생활보장법」 제15조~제18조, 「구직자취업촉진법」",
            "facility": "지역자활센터, 고용복지플러스센터",
            "files": ["04_자활사업안내_2026.pdf", "01_국민취업지원제도_업무매뉴얼_2026.pdf"],
            "hierarchy": [
                ("자활사례관리 & 게이트웨이", "개인별 자활지원계획(IAP) 수립, 직업적성검사, 기초역량강화 교육"),
                ("자활근로사업단 운영", "시장진입형(수익창출), 사회서비스형(복지도우미, 간병), 청년자립도전, 자활기업 창업연계"),
                ("국민취업지원제도 (Ⅰ·Ⅱ유형)", "구직촉진수당 지급, 직업훈련(내일배움카드) 연계, 집중취업알선")
            ]
        },
        {
            "num": "10",
            "name": "학교사회복지 (교육복지우선지원사업)",
            "law": "「초·중등교육법」 제28조, 교육부 교육복지우선지원사업 관리지침",
            "facility": "초·중·고등학교 교육복지실, 시·도교육청 교육복지지원센터",
            "files": ["01_교육복지우선지원사업_운영매뉴얼_학교사회복지.pdf"],
            "hierarchy": [
                ("학교사회복지 5대 영역", "학습영역(기초학력보충), 문화영역(진로체험, 동아리), 심리·정서영역(개별상담, 멘토링)"),
                ("복지지원 및 연계", "의료비·생계비 긴급지원, 가정-학교-지역사회 통합네트워크 구축")
            ]
        },
        {
            "num": "11",
            "name": "지역보호·긴급돌봄 (노숙인·푸드뱅크·긴급복지·통합돌봄)",
            "law": "「노숙인복지법」, 「식품등기부활성화법」, 「긴급복지지원법」, 「사회서비스원법」, 「북한이탈주민법」",
            "facility": "노숙인종합지원센터, 푸드뱅크/마켓, 시도사회서비스원 종합재가센터, 하나센터",
            "files": ["12_노숙인_복지_2026.pdf", "13_푸드뱅크_2026.pdf", "15_사회서비스원_표준지침.pdf", "15_통합돌봄_매뉴얼.pdf", "16_긴급복지지원_2026.pdf", "01_하나센터_매뉴얼_2025.pdf"],
            "hierarchy": [
                ("푸드뱅크 & 노숙인지원", "기부식품 모집·검수·배분, 희망마켓 운영, 노숙인 현장거리상담, 응급구호, 무료급식"),
                ("긴급복지 & 통합돌봄", "위기가구 긴급생계·의료비 지원, 사회서비스원 긴급틈새돌봄, 퇴원환자 재가케어"),
                ("북한이탈주민 정착지원", "하나센터 초기집중교육, 취업지원, 생활상담, 지역주민 교류행사")
            ]
        },
        {
            "num": "12",
            "name": "배분모금·국제개발협력 (모금회 프로포절 & KOICA)",
            "law": "「사회복지공동모금회법」, 「한국국제협력단법」",
            "facility": "사회복지공동모금회(사랑의열매), KOICA 시민사회협력사업 수행 NGO",
            "files": ["01_사회복지공동모금회_2026_배분사업지침.pdf", "01_KOICA_시민사회협력프로그램_공모안내서_2027.pdf"],
            "hierarchy": [
                ("공동모금회 배분사업", "신청사업(자유주제 복지프로그램), 기획사업(중점테마형), 긴급지원사업"),
                ("프로포절 성과평가 체계", "사업필요성(욕구조사), SMART 목표설정, 투입-산출-성과 지표 측정, 예산편성 기준"),
                ("국제개발협력 시민사회협력", "개도국 빈곤퇴치, 교육·보건 인프라 구축, 주민소득증대 사업 프로젝트 기획")
            ]
        }
    ]

    for d in domains_detail:
        hd = doc.add_heading(f"{d['num']}. {d['name']}", level=2)
        hd.paragraph_format.space_before = Pt(12)
        hd.paragraph_format.space_after = Pt(4)
        
        p_info = doc.add_paragraph()
        p_info.paragraph_format.line_spacing = 1.15
        p_info.paragraph_format.space_after = Pt(4)
        r_law = p_info.add_run(f"• 법적 근거: {d['law']}\n• 소관 시설: {d['facility']}\n• 수록 지침서 ({len(d['files'])}종): {', '.join(d['files'])}")
        r_law.font.size = Pt(8.5)
        r_law.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        
        # Sub-table (Width: 170mm)
        t_sub = doc.add_table(rows=len(d['hierarchy']) + 1, cols=2)
        t_sub.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_sub.autofit = False
        t_w = [Mm(45), Mm(125)]
        for r_idx, row in enumerate(t_sub.rows):
            for c_idx, width in enumerate(t_w):
                row.cells[c_idx].width = width
                set_cell_margins(row.cells[c_idx], top=60, bottom=60, left=80, right=80)
        set_table_borders(t_sub, color="D1D5DB")
        
        # Header
        t_sub.rows[0].cells[0].paragraphs[0].add_run("대분류 (법정 기능 / 사업)").font.bold = True
        t_sub.rows[0].cells[0].paragraphs[0].runs[0].font.size = Pt(8.0)
        t_sub.rows[0].cells[0].paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_shading(t_sub.rows[0].cells[0], "374151")
        
        t_sub.rows[0].cells[1].paragraphs[0].add_run("중분류 및 소분류 (사업분야, 단위 서비스, 프로그램 내용)").font.bold = True
        t_sub.rows[0].cells[1].paragraphs[0].runs[0].font.size = Pt(8.0)
        t_sub.rows[0].cells[1].paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_shading(t_sub.rows[0].cells[1], "374151")
        
        for h_idx, (cat_major, cat_sub) in enumerate(d['hierarchy'], 1):
            c0 = t_sub.rows[h_idx].cells[0]
            c1 = t_sub.rows[h_idx].cells[1]
            set_cell_shading(c0, "F9FAFB")
            p0 = c0.paragraphs[0]
            r0 = p0.add_run(cat_major)
            r0.font.bold = True
            r0.font.size = Pt(8.0)
            p1 = c1.paragraphs[0]
            r1 = p1.add_run(cat_sub)
            r1.font.size = Pt(8.0)
            
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(6)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 3: 연례 갱신(Annual Update) 메커니즘
    # ----------------------------------------------------
    h3 = doc.add_heading("제3장. 정부 부처별 지침서 연례 갱신(Annual Revision) 프로토콜", level=1)
    h3.paragraph_format.space_before = Pt(15)
    h3.paragraph_format.space_after = Pt(10)
    
    p3 = doc.add_paragraph()
    p3.paragraph_format.line_spacing = 1.25
    p3.add_run(
        "사회복지 공식 지침서는 매년 예산안 확정 및 법령 개정에 맞추어 연례 개정된다. "
        "정확하고 신뢰성 있는 현장 교육 포털을 유지하기 위해서는 정부 부처별 갱신 주기를 파악하고 적시에 갱신해야 한다."
    )
    
    table_cal = doc.add_table(rows=6, cols=4)
    table_cal.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_cal.autofit = False
    cal_w = [Mm(30), Mm(35), Mm(55), Mm(50)]
    for row in table_cal.rows:
        for idx, width in enumerate(cal_w):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=70, bottom=70, left=80, right=80)
    set_table_borders(table_cal, color="9CA3AF")
    
    for idx, th in enumerate(["발행 주체", "주요 갱신 시기", "갱신 대상 핵심 지침서", "공식 배포 채널"]):
        cell = table_cal.rows[0].cells[idx]
        set_cell_shading(cell, "1E3A8A")
        r = cell.paragraphs[0].add_run(th)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        r.font.size = Pt(8.5)
        
    cal_data = [
        ("보건복지부", "매년 1월 중순 ~ 2월 말", "사회복지관, 노인맞춤돌봄, 장애인활동지원, 드림스타트 등", "mohw.go.kr (법령-지침)"),
        ("성평등가족부", "매년 1월 말 ~ 3월 초", "가족사업안내(1·2권), 청소년사업, 한부모, 여성권익", "mogef.go.kr (정책자료)"),
        ("교육부", "매년 2월 말 (학기 개시 전)", "보육사업안내, 교육복지우선지원사업 매뉴얼", "moe.go.kr & eduser.kedi.re.kr"),
        ("고용노동부 / 공단", "매년 1월 초 ~ 2월", "국민취업지원제도, 장애인직업능력개발원 매뉴얼", "moel.go.kr & kead.or.kr"),
        ("공동모금회 / KOICA", "매년 7~8월 (차년도 공모)", "공동모금회 배분지침, KOICA 시민사회협력 공모안내서", "proposal.chest.or.kr & koica.go.kr")
    ]
    for row_idx, r_items in enumerate(cal_data, 1):
        row = table_cal.rows[row_idx]
        for col_idx, text in enumerate(r_items):
            c = row.cells[col_idx]
            if col_idx == 0:
                set_cell_shading(c, "F9FAFB")
                c.paragraphs[0].add_run(text).font.bold = True
            else:
                c.paragraphs[0].add_run(text)
            c.paragraphs[0].runs[0].font.size = Pt(8.0)

    doc.add_page_break()

    # ----------------------------------------------------
    # CHAPTER 4: 결론 및 학생 실무 적용 가이드
    # ----------------------------------------------------
    h4 = doc.add_heading("제4장. 학생 현장실습 및 실무 적용 가이드", level=1)
    h4.paragraph_format.space_before = Pt(15)
    h4.paragraph_format.space_after = Pt(10)
    
    p4 = doc.add_paragraph()
    p4.paragraph_format.line_spacing = 1.25
    p4.add_run(
        "Efficiency_DB의 38종 핵심 지침서는 학생들이 사회복지 현장에서 수행하는 모든 과제와 직결된다.\n\n"
        "1. 실습일지(Field Journal) 작성 시의 역추적(Traceability)\n"
        "   학생이 현장에서 '어르신 댁 방문 말벗 및 안부확인'을 수행했을 때, 단순한 일상 봉사활동으로 기록하지 않고 "
        "   [사회복지관] > [서비스제공기능] > [지역사회보호] > [정서서비스]의 공식 법정 명칭을 기재하도록 지도한다. "
        "   이를 통해 학생은 자신의 미시적 활동이 대한민국 사회보장제도의 어떤 법적 기능과 맞닿아 있는지 명확히 인식하게 된다.\n\n"
        "2. 프로그램 프로포절(Proposal) 기획 시의 공인 근거 확보\n"
        "   사회복지공동모금회 배분사업지침 및 분야별 지침서의 표준 성과지표를 활용하여, 문제 정의, 산출(Output) 및 "
        "   성과(Outcome) 목표, 투입 예산 항목을 작성함으로써 학계와 현장 모두에서 통용되는 전문 프로포절을 완성할 수 있다.\n\n"
        "3. 기관분석보고서 작성 시의 정확성\n"
        "   기관의 설립 법령, 종사자 배치 기준, 필수 구비 시설 기준을 지침서 원문에서 인용함으로써 주관적 기술을 배제하고 "
        "   객관적 공문서에 기반한 심층 기관 분석이 가능해진다."
    )

    p_fin = doc.add_paragraph()
    p_fin.paragraph_format.space_before = Pt(25)
    p_fin.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fin = p_fin.add_run("[이상 보고서 완료 / 사회복지현장의이해 연구사업단]")
    r_fin.font.bold = True
    r_fin.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

    out_path = "docs/01_사회복지_공식지침서_법정시설매칭_및_연례갱신_총람.docx"
    doc.save(out_path)
    print(f"Generated docx successfully: {out_path} ({os.path.getsize(out_path)} bytes)")
    return out_path

if __name__ == '__main__':
    build_research_report()
