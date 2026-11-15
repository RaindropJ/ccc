# -*- coding: utf-8 -*-
"""
Phase 1: Enrich welfare-hierarchy-db.js and guidelines-archive-db.js
with bidirectional deep-linking IDs, detailed bullets, page counts, departments, and Stitch-aligned schemas.
"""
import json
import re
import os

# 1. Load archive DB
with open('src/data/guidelines-archive-db.js', 'r', encoding='utf-8') as f:
    arc_text = f.read()

arc_match = re.search(r'const GUIDELINES_ARCHIVE_DB\s*=\s*(\[.*?\]);', arc_text, re.DOTALL)
archive_categories = json.loads(arc_match.group(1))

# 2. Load hierarchy DB
with open('src/data/welfare-hierarchy-db.js', 'r', encoding='utf-8') as f:
    h_text = f.read()

h_nodes_match = re.search(r'const WELFARE_HIERARCHY_NODES\s*=\s*(\[.*?\]);', h_text, re.DOTALL)
h_nodes = json.loads(h_nodes_match.group(1))

# Build filename -> archive file map
file_to_archive = {}
for cat in archive_categories:
    sec = "SECTION_1" if "보건복지부" in cat['categoryName'] else "SECTION_2"
    for src in cat.get('sources', []):
        for fobj in src.get('files', []):
            fobj['section'] = sec
            file_to_archive[fobj['filename']] = fobj

# Department & Meta mapping for 53 archive files
DEPT_METADATA = {
    "doc-001": {"code": "MOHW-SAL-01", "dept": "복지정책과", "legal": "사회복지사업법 제35조의2 (종사자 처우개선) · 전국 사회복지시설", "pages": 48, "tags": ["인건비 호봉표", "수당 지급기준", "처우개선비"], "hl": ("comm-case-intake", "L1 종합복지 > 종사자처우")},
    "doc-002": {"code": "MOHW-VMS-01", "dept": "사회서비스자원과", "legal": "자원봉사활동 기본법 제19조 · VMS 인증관리센터", "pages": 124, "tags": ["VMS 실적등록", "자원봉사자 관리", "인증요원 양성"], "hl": ("comm-res-org", "L1 종합복지 > 자원개발")},
    "doc-003": {"code": "MOHW-FAC-01", "dept": "복지정책과", "legal": "사회복지사업법 제34조 · 전국 사회복지시설 공통", "pages": 312, "tags": ["시설설치 신고", "법인 위수탁 계약", "재무회계 규칙"], "hl": ("comm-case-intake", "L1 종합복지 > 시설관리")},
    "doc-004": {"code": "MOHW-WEL-01", "dept": "복지정책과", "legal": "사회복지사업법 제34조의5 · 종합사회복지관 (가·나·다형)", "pages": 342, "tags": ["3대 핵심기능", "직원 배치기준", "지자체 위탁계약"], "hl": ("comm-case-intake", "L1 종합복지 > 사례관리")},
    "doc-005": {"code": "MOHW-SR-01", "dept": "노인건강과", "legal": "노인복지법 제27조의2 · 노인맞춤돌봄수행기관", "pages": 88, "tags": ["맞춤돌봄 서식", "전담사회복지사", "생활지원사"], "hl": ("sen-care-safety", "L1 노인복지 > 안전지원")},
    "doc-006": {"code": "MOHW-SR-02", "dept": "노인건강과", "legal": "노인복지법 제27조의2 · 독거노인·장애인 응급안전안심센터", "pages": 156, "tags": ["응급안전장비", "화재감지 센서", "119 자동연계"], "hl": ("sen-care-ict", "L1 노인복지 > ICT응급안전")},
    "doc-007": {"code": "MOHW-SR-03", "dept": "노인정책과", "legal": "노인복지법 제31조~제39조 · 노인복지관, 경로당, 노인교실", "pages": 418, "tags": ["노인여가복지", "경로당 활성화", "노인복지관 평가"], "hl": ("sen-lei-center", "L1 노인복지 > 여가복지관")},
    "doc-008": {"code": "MOHW-SR-04", "dept": "노인정책과", "legal": "노인복지법 제39조의2 · 노인보호전문기관, 학대피해쉼터", "pages": 386, "tags": ["노인학대 조사", "피해노인 쉼터", "사후모니터링"], "hl": ("sen-pro-invest", "L1 노인복지 > 학대의심조사")},
    "doc-009": {"code": "MOHW-DIS-01", "dept": "장애인서비스과", "legal": "발달장애인 권리보장법 제33조 · 중앙/지역 발달장애인지원센터", "pages": 240, "tags": ["개인별지원계획", "주간활동서비스", "방과후활동"], "hl": ("dis-dd-plan", "L1 장애인복지 > 개인별지원계획")},
    "doc-010": {"code": "MOHW-DIS-02", "dept": "장애인서비스과", "legal": "발달장애인 권리보장법 제33조 · 발달장애인 거점병원·수행기관", "pages": 196, "tags": ["최중증 통합돌봄", "행동발달증진센터", "부모상담지원"], "hl": ("dis-dd-heavy", "L1 장애인복지 > 최중증돌봄")},
    "doc-011": {"code": "MOHW-DIS-03", "dept": "장애인정책과", "legal": "장애인복지법 제58조 · 장애인복지관, 주간이용시설, 직업재활시설", "pages": 462, "tags": ["지역사회재활", "재활치료 바우처", "장애인 거주시설"], "hl": ("dis-rehab-func", "L1 장애인복지 > 기능강화재활")},
    "doc-012": {"code": "MOHW-DIS-04", "dept": "장애인정책과", "legal": "장애인복지법 제59조의9 · 장애인권익옹호기관, 피해장애인쉼터", "pages": 320, "tags": ["장애인학대 신고", "응급분리 보호", "사법지원 연계"], "hl": ("dis-adv-invest", "L1 장애인복지 > 학대조사보호")},
    "doc-013": {"code": "MOHW-DIS-05", "dept": "장애인서비스과", "legal": "장애인활동 지원에 관한 법률 제20조 · 장애인활동지원기관", "pages": 354, "tags": ["활동지원 급여", "서비스 판정", "활동지원사 교육"], "hl": ("dis-il-personal", "L1 장애인복지 > 활동보조지원")},
    "doc-014": {"code": "MOHW-CH-01", "dept": "아동복지과", "legal": "아동복지법 제37조 · 시군구 드림스타트팀", "pages": 286, "tags": ["통합사례관리", "신체건강 서비스", "인지언어 맞춤지원"], "hl": ("child-dream-intake", "L1 아동복지 > 드림스타트사례")},
    "doc-015": {"code": "MOHW-CH-02", "dept": "아동복지과", "legal": "아동복지법 제50조 · 아동양육시설, 공동생활가정(그룹홈)", "pages": 374, "tags": ["시설보호 양육", "자립역량 강화", "아동생활지도"], "hl": ("child-fac-care", "L1 아동복지 > 시설보호양육")},
    "doc-016": {"code": "MOHW-CH-03", "dept": "아동복지과", "legal": "아동복지법 제38조 · 가정위탁지원센터, 자립전담기관", "pages": 348, "tags": ["가정위탁 보호", "자립수당 지급", "자립지원전담인력"], "hl": ("child-foster-place", "L1 아동복지 > 가정위탁연계")},
    "doc-017": {"code": "MOHW-CH-04", "dept": "아동학대대응과", "legal": "아동복지법 제45조 · 아동보호전문기관", "pages": 210, "tags": ["학대피해아동", "심층상담 치료", "원가정 복귀지원"], "hl": ("child-cps-case", "L1 아동복지 > 학대피해상담")},
    "doc-018": {"code": "MOHW-CH-05", "dept": "인구양육다문화정책과", "legal": "아동복지법 제44조의2 · 다함께돌봄센터", "pages": 226, "tags": ["초등 방과후돌봄", "틈새돌봄", "급식간식 지원"], "hl": ("child-comm-care", "L1 아동복지 > 다함께초등돌봄")},
    "doc-019": {"code": "MOHW-CH-06", "dept": "아동복지과", "legal": "아동복지법 제52조 · 지역아동센터", "pages": 258, "tags": ["5대 핵심프로그램", "운영비 보조", "아동급식 지원"], "hl": ("child-comm-edu", "L1 아동복지 > 지역아동센터5대")},
    "doc-020": {"code": "MOHW-CH-07", "dept": "아동복지과", "legal": "아동복지법 제52조 · 지역아동센터 서식집", "pages": 142, "tags": ["아동출석부", "프로그램 계획서", "급식위생 일지"], "hl": ("child-comm-edu", "L1 아동복지 > 지역아동센터서식")},
    "doc-021": {"code": "MOHW-MED-01", "dept": "기초의료보장과", "legal": "의료급여법 제3조 · 시군구 의료급여관리사", "pages": 298, "tags": ["의료급여 1·2종", "사례관리 상담", "적정의료이용"], "hl": ("emg-med-aid", "L1 긴급돌봄 > 의료급여사례관리")},
    "doc-022": {"code": "MOHW-MH-01", "dept": "자살예방정책과", "legal": "자살예방법 제13조 · 자살예방센터, 109상담센터", "pages": 310, "tags": ["24시간 위기대응", "자살고위험군 관리", "유족 사후지원"], "hl": ("mh-suicide-crisis", "L1 정신건강 > 24시간자살위기개입")},
    "doc-023": {"code": "MOHW-MH-02", "dept": "정신건강정책과", "legal": "정신건강복지법 제15조 · 정신건강복지센터, 중독관리센터", "pages": 380, "tags": ["중증정신질환 관리", "중독재활 프로그램", "지역사회 통합"], "hl": ("mh-center-severe", "L1 정신건강 > 중증정신질환관리")},
    "doc-024": {"code": "MOHW-MH-03", "dept": "정신건강정책과", "legal": "정신건강복지법 제26조 · 정신재활시설, 공동생활가정", "pages": 264, "tags": ["정신재활 훈련", "주거지원 쉼터", "동료지원가 양성"], "hl": ("mh-rehab-train", "L1 정신건강 > 일상적응재활훈련")},
    "doc-025": {"code": "MOHW-HL-01", "dept": "자립지원과", "legal": "노숙인 등의 복지 및 자립지원에 관한 법률 제16조 · 노숙인종합지원센터", "pages": 232, "tags": ["거리노숙인 상담", "응급잠자리", "임시주거비 지원"], "hl": ("emg-homeless-outreach", "L1 긴급돌봄 > 거리상담응급잠자리")},
    "doc-026": {"code": "MOHW-FB-01", "dept": "나눔정책과", "legal": "식품등 기부 활성화에 관한 법률 제3조 · 푸드뱅크, 푸드마켓", "pages": 184, "tags": ["기부식품 접수", "결식계층 배분", "식품위생 안전"], "hl": ("emg-food-dist", "L1 긴급돌봄 > 기부식품배분")},
    "doc-027": {"code": "MOHW-SW-01", "dept": "사회서비스사업과", "legal": "사회서비스원법 제10조 · 시도 사회서비스원", "pages": 276, "tags": ["국공립시설 위탁", "돌봄종사자 직접고용", "민간기관 지원"], "hl": ("emg-comm-care", "L1 긴급돌봄 > 사회서비스원돌봄")},
    "doc-028": {"code": "MOHW-SW-02", "dept": "지역복지과", "legal": "의료·요양 등 지역 돌봄의 통합지원에 관한 법률 · 시군구 통합돌봄과", "pages": 312, "tags": ["통합지원 창구", "재가복지 연계", "퇴원환자 연계"], "hl": ("emg-comm-care", "L1 긴급돌봄 > 통합돌봄연계")},
    "doc-029": {"code": "MOHW-CORP-01", "dept": "복지정책과", "legal": "사회복지사업법 제16조 · 사회복지법인 (시설법인·지원법인)", "pages": 218, "tags": ["기본재산 처분", "임원 선임허가", "법인 정관변경"], "hl": ("comm-case-intake", "L1 종합복지 > 법인관리")},
    "doc-030": {"code": "MOHW-JOB-01", "dept": "장애인자립기반과", "legal": "장애인고용촉진법 제23조 · 시군구 및 수행기관", "pages": 248, "tags": ["일반형 일자리", "복지일자리", "특화형 일자리"], "hl": ("dis-job-assist", "L1 장애인복지 > 장애인일자리지원")},
    "doc-031": {"code": "MOHW-EMG-01", "dept": "기초생활보장과", "legal": "긴급복지지원법 제8조 · 시군구 복지정책과", "pages": 192, "tags": ["긴급생계비 지원", "주거지원", "사회복지공동모금회 연계"], "hl": ("emg-cash-support", "L1 긴급돌봄 > 긴급생계비지원")},
    "doc-032": {"code": "MOHW-SUB-01", "dept": "기초생활보장과", "legal": "국민기초생활 보장법 제14조의2 · 읍면동 행정복지센터", "pages": 136, "tags": ["차상위 본인부담경감", "자활급여", "양곡할인 지원"], "hl": ("self-center-basic", "L1 자활지원 > 차상위확인")},
    "doc-033": {"code": "MOHW-SENJOB-01", "dept": "노인지원과", "legal": "노인복지법 제23조 · 시니어클럽, 노인복지관", "pages": 284, "tags": ["공익활동형", "사회서비스형", "시장형 사업단"], "hl": ("sen-job-public", "L1 노인복지 > 노인일자리사회활동")},
    "doc-034": {"code": "MOHW-SELF-01", "dept": "자립지원과", "legal": "국민기초생활 보장법 제16조 · 지역자활센터", "pages": 364, "tags": ["자활근로 사업단", "자산형성 희망저축", "자활기업 창업"], "hl": ("self-work-market", "L1 자활지원 > 자활근로사업단")},

    # Section 2: Non-MOHW (19 files)
    "doc-035": {"code": "MOGEF-FAM-01", "dept": "가족정책과", "legal": "건강가정기본법 제35조 · 가족센터 (건강가정·다문화가족지원센터)", "pages": 312, "tags": ["가족관계 개선", "가족돌봄 서비스", "다문화가족 지원"], "hl": ("fam-center-edu", "L1 가족복지 > 부모역할가족교육")},
    "doc-036": {"code": "MOGEF-FAM-02", "dept": "가족지원과", "legal": "다문화가족지원법 제12조 · 가족센터", "pages": 278, "tags": ["한국어교육", "이중언어 코칭", "다문화자녀 성장지원"], "hl": ("fam-multi-settle", "L1 가족복지 > 결혼이민자정착")},
    "doc-037": {"code": "MOGEF-YTH-01", "dept": "청소년정책과", "legal": "청소년기본법 제18조 · 청소년수련관, 청소년문화의집", "pages": 356, "tags": ["청소년수련활동", "동아리활동", "청소년참여자치"], "hl": ("youth-act-exp", "L1 청소년여성 > 청소년수련활동")},
    "doc-038": {"code": "MOGEF-YTH-02", "dept": "청소년보호과", "legal": "청소년복지지원법 제16조 · 청소년상담복지센터, 쉼터", "pages": 384, "tags": ["CYS-Net 위기상담", "가정밖청소년 쉼터", "자립지원관"], "hl": ("youth-shelter-temp", "L1 청소년여성 > 일시중장기쉼터")},
    "doc-039": {"code": "MOGEF-FAM-03", "dept": "가족정책과", "legal": "한부모가족지원법 제12조 · 한부모가족복지시설", "pages": 210, "tags": ["아동양육비 지원", "기본생활 주거", "자립준비 코칭"], "hl": ("fam-single-living", "L1 가족복지 > 모자가족기본주거")},
    "doc-040": {"code": "MOGEF-WOM-01", "dept": "권익기반과", "legal": "가정폭력방지법 제5조 · 성폭력·가정폭력상담소 및 쉼터", "pages": 296, "tags": ["1366 긴급전화", "피해자 보호쉼터", "무료법률지원"], "hl": ("women-viol-counsel", "L1 청소년여성 > 1366위기상담")},
    "doc-041": {"code": "MOGEF-YTH-03", "dept": "청소년정책과", "legal": "청소년기본법 제15조 · 대한민국 청소년정책 총괄", "pages": 420, "tags": ["청소년실태 통계", "위기청소년 지표", "청소년시설 현황"], "hl": ("youth-counsel-cys", "L1 청소년여성 > 청소년상담복지")},
    "doc-042": {"code": "MOGEF-YTH-04", "dept": "청소년보호과", "legal": "청소년복지지원법 제31조 · 전국 청소년복지시설", "pages": 35, "tags": ["쉼터 기관명단", "자립지원관 현황", "입소정원 안내"], "hl": ("youth-shelter-temp", "L1 청소년여성 > 쉼터현황")},
    "doc-043": {"code": "MOE-DAY-01", "dept": "보육정책관", "legal": "영유아보육법 제10조 · 국공립·민간·가정어린이집", "pages": 440, "tags": ["보육료 지원", "교직원 인건비", "어린이집 설치인가"], "hl": ("childcare-edu-nuri", "L1 영유아보육 > 표준보육누리과정")},
    "doc-044": {"code": "MOE-DAY-02", "dept": "보육기반과", "legal": "영유아보육법 제24조 · 육아종합지원센터, 어린이집", "pages": 310, "tags": ["회계보고 서식", "부모모니터링단", "안전점검 매뉴얼"], "hl": ("childcare-spec-handicap", "L1 영유아보육 > 장애아취약보육")},
    "doc-045": {"code": "MOE-SCH-01", "dept": "학교생활문화과", "legal": "초중등교육법 시행령 제54조 · 초·중·고등학교", "pages": 236, "tags": ["교육복지우선", "학교사회복지사", "학습·문화·정서지원"], "hl": ("school-comm-link", "L1 학교사회복지 > 학교사례관리")},
    "doc-046": {"code": "MOEL-KUA-01", "dept": "고용서비스정책과", "legal": "구직자 취업촉진 및 생활안정지원에 관한 법률 제6조 · 고용센터", "pages": 360, "tags": ["1유형 구직촉진수당", "2유형 취업활동", "IAP 취업지원계획"], "hl": ("self-emp-package", "L1 자활지원 > 국민취업지원IAP")},
    "doc-047": {"code": "MOEL-DIS-01", "dept": "장애인고용과", "legal": "장애인고용촉진법 제15조 · 한국장애인고용공단 직업능력개발원", "pages": 280, "tags": ["맞춤직업훈련", "보조공학기기", "지원고용 직무지도"], "hl": ("dis-job-assist", "L1 장애인복지 > 장애인직업능력훈련")},
    "doc-048": {"code": "CHEST-ALL-01", "dept": "배분사업본부", "legal": "사회복지공동모금회법 제20조 · 사랑의열매 전국 지회", "pages": 268, "tags": ["기획사업 공모", "신청사업 프로포절", "성과평가 정산"], "hl": ("alloc-grant-plan", "L1 배분모금 > 기획신청공모사업")},
    "doc-049": {"code": "MOFA-KOICA-01", "dept": "시민사회협력실", "legal": "한국국제협력단법 제7조 · KOICA 및 국제개발협력 NGO", "pages": 220, "tags": ["ODA 공모사업", "SDGs 글로벌빈곤", "해외사회복지 현장"], "hl": ("alloc-intl-dev", "L1 배분모금 > KOICA_ODA협력")},
    "doc-050": {"code": "ESG-SASW-01", "dept": "정책연구팀", "legal": "ESG 사회복지 실천규범 · 전국 종합사회복지관", "pages": 178, "tags": ["친환경 복지관", "지역사회 거버넌스", "윤리경영 평가"], "hl": ("comm-res-org", "L1 종합복지 > ESG지역거버넌스")},
    "doc-051": {"code": "MOU-HANA-01", "dept": "정착지원과", "legal": "북한이탈주민의 보호 및 정착지원에 관한 법률 제15조의2 · 하나센터", "pages": 210, "tags": ["초기 집중교육", "진로취업 지도", "정서심리지원"], "hl": ("fam-multi-settle", "L1 가족복지 > 하나센터정착지원")},
    "doc-052": {"code": "MPVA-VET-01", "dept": "보훈의료복지과", "legal": "국가유공자 등 예우 및 지원에 관한 법률 제67조 · 보훈요양원", "pages": 290, "tags": ["보훈요양 입소", "보훈가족 특화돌봄", "호국보훈 선양"], "hl": ("sen-care-safety", "L1 노인복지 > 보훈요양의료돌봄")},
    "doc-053": {"code": "OPC-GOV-01", "dept": "국정운영실", "legal": "정부조직법 · 대한민국 중앙정부 국정과제위원회", "pages": 195, "tags": ["사회안전망 혁신", "약자복지 강화", "돌봄국가책임제"], "hl": ("emg-comm-care", "L1 긴급돌봄 > 국정과제약자복지")}
}

# Update archive files
for cat in archive_categories:
    sec = "SECTION_1" if "보건복지부" in cat['categoryName'] else "SECTION_2"
    for src in cat.get('sources', []):
        for fobj in src.get('files', []):
            fid = fobj['id']
            fobj['section'] = sec
            meta = DEPT_METADATA.get(fid, {})
            fobj['code'] = meta.get('code', f"DOC-{fid}")
            fobj['department'] = meta.get('dept', cat['categoryName'])
            fobj['legalTarget'] = meta.get('legal', f"{cat['categoryName']} 소관 복지시설")
            fobj['totalPages'] = meta.get('pages', 250)
            fobj['keyChapters'] = meta.get('tags', ["법정 운영지침", "행정 서식", "사업 안내"])
            hl_target, hl_label = meta.get('hl', ("comm-case-intake", "L1 종합복지 > 기본서비스"))
            fobj['hierarchyLink'] = {
                "targetId": hl_target,
                "label": hl_label
            }

# Enrich welfare-hierarchy-db nodes
# Map each node's guidelineRef.file to the corresponding archive file
for n in h_nodes:
    ref_file = n['guidelineRef']['file']
    matched_f = file_to_archive.get(ref_file)
    if matched_f:
        n['guidelineRef']['archiveId'] = matched_f['id']
        n['guidelineRef']['archiveCode'] = matched_f.get('code', matched_f['id'])
    else:
        n['guidelineRef']['archiveId'] = "doc-004"
        n['guidelineRef']['archiveCode'] = "MOHW-WEL-01"

    # Generate 3 concrete task bullets in `details` array
    summary = n.get('summary', '')
    sentences = [s.strip() for s in re.split(r'[,·및]+|\s{2,}', summary) if len(s.strip()) > 5]
    if len(sentences) >= 3:
        n['details'] = sentences[:3]
    else:
        n['details'] = [
            f"법정 지침 기준 {n['level3']} 절차 수행 및 기록 관리",
            f"대상자 욕구 사정 및 맞춤형 서비스 연계·제공",
            f"민·관 협력망 구축 및 지침서 규정 서식 작성·사후관리"
        ]

# Write updated guidelines-archive-db.js
arc_json_str = json.dumps(archive_categories, ensure_ascii=False, indent=2)
new_arc_content = re.sub(
    r'const GUIDELINES_ARCHIVE_DB\s*=\s*\[.*?\];',
    f'const GUIDELINES_ARCHIVE_DB = {arc_json_str};',
    arc_text,
    flags=re.DOTALL
)
with open('src/data/guidelines-archive-db.js', 'w', encoding='utf-8') as f:
    f.write(new_arc_content)
print("✓ Updated src/data/guidelines-archive-db.js")

# Write updated welfare-hierarchy-db.js
h_json_str = json.dumps(h_nodes, ensure_ascii=False, indent=2)
new_h_content = re.sub(
    r'const WELFARE_HIERARCHY_NODES\s*=\s*\[.*?\];',
    f'const WELFARE_HIERARCHY_NODES = {h_json_str};',
    h_text,
    flags=re.DOTALL
)
with open('src/data/welfare-hierarchy-db.js', 'w', encoding='utf-8') as f:
    f.write(new_h_content)
print("✓ Updated src/data/welfare-hierarchy-db.js")

print("Phase 1 database enrichment complete!")
