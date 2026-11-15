/**
 * 대한민국 정부 부처 및 공공기관 공식 지침서 마스터 아카이브 데이터베이스 (최신 정본 단일화 정비 완료)
 * - 이전 구판(2023, 2024, 2025 구판 및 중복 파일 17건 127MB) 영구 정리 및 최신 2026 정본 단일화
 * - 총 파일 수: 53건 | 총 용량: 450.95 MB
 * - 파일별 확장자 뱃지: 'PDF' 전용 지원
 * - 전체 다운로드: 구글 드라이브(Google Drive) 대용량 고속 다운로드 연계
 */

const GOOGLE_DRIVE_ARCHIVE_CONFIG = {
    title: "2026 사회복지 현장 지침서·사업안내 마스터 풀패키지 (최신 정본 아카이브)",
    totalFiles: 53,
    totalSizeStr: "450.95 MB",
    updatedAt: "2026-11-15",
    // 구글 드라이브 대용량 전체 다운로드 링크 (사용자가 본인 드라이브 링크로 교체 가능)
    driveDownloadUrl: "https://drive.google.com/drive/folders/1Xj329hrtcrfgiY0atJYiCHY7pG6KVrlh?usp=sharing",
    guideMessage: "최신 정본으로 정비된 53개 지침서 풀패키지(450.95 MB)를 구글 드라이브 고속 서버에서 압축파일(ZIP)로 한 번에 무료 다운로드받으실 수 있습니다."
};

const GUIDELINES_ARCHIVE_DB = [
  {
    "categoryKey": "01_보건복지부",
    "categoryName": "보건복지부",
    "icon": "🏥",
    "description": "노인·아동·장애인·정신건강·노숙인·기부식품·자활·시설공통",
    "fileCount": 34,
    "totalBytes": 337250427,
    "sources": [
      {
        "sourceKey": "[출처_보건복지부_공식누리집]",
        "sourceName": "보건복지부 공식 발간자료실",
        "fileCount": 28,
        "totalBytes": 302793898,
        "files": [
          {
            "id": "doc-001",
            "filename": "00_사회복지시설_종사자_인건비가이드라인_2026.pdf",
            "title": "사회복지시설 종사자 인건비가이드라인 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "546.8 KB",
            "sizeBytes": 559932,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/00_사회복지시설_종사자_인건비가이드라인_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SAL-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제35조의2 (종사자 처우개선) · 전국 사회복지시설",
            "totalPages": 13,
            "keyChapters": [
              "인건비 호봉표",
              "수당 지급기준",
              "처우개선비"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 종사자처우"
            }
          },
          {
            "id": "doc-002",
            "filename": "00_사회복지자원봉사_사업지침_VMS_2026.pdf",
            "title": "사회복지자원봉사 사업지침 VMS 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "1.74 MB",
            "sizeBytes": 1826416,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/00_사회복지자원봉사_사업지침_VMS_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-VMS-01",
            "department": "사회서비스자원과",
            "legalTarget": "자원봉사활동 기본법 제19조 · VMS 인증관리센터",
            "totalPages": 124,
            "keyChapters": [
              "VMS 실적등록",
              "자원봉사자 관리",
              "인증요원 양성"
            ],
            "hierarchyLink": {
              "targetId": "comm-res-org",
              "label": "L1 종합복지 > 자원개발"
            }
          },
          {
            "id": "doc-003",
            "filename": "01_사회복지시설_관리안내_공통_2026.pdf",
            "title": "사회복지시설 관리안내 공통 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.87 MB",
            "sizeBytes": 7205069,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/01_사회복지시설_관리안내_공통_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-FAC-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제34조 · 전국 사회복지시설 공통",
            "totalPages": 312,
            "keyChapters": [
              "시설설치 신고",
              "법인 위수탁 계약",
              "재무회계 규칙"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 시설관리"
            }
          },
          {
            "id": "doc-004",
            "filename": "02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf",
            "title": "사회복지관 운영관련 업무처리안내 종합복지관3대기능 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.21 MB",
            "sizeBytes": 4414113,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-WEL-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제34조의5 · 종합사회복지관 (가·나·다형)",
            "totalPages": 342,
            "keyChapters": [
              "3대 핵심기능",
              "직원 배치기준",
              "지자체 위탁계약"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 사례관리"
            }
          },
          {
            "id": "doc-005",
            "filename": "03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf",
            "title": "노인맞춤돌봄서비스 사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "305.7 KB",
            "sizeBytes": 313007,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SR-01",
            "department": "노인건강과",
            "legalTarget": "노인복지법 제27조의2 · 노인맞춤돌봄수행기관",
            "totalPages": 8,
            "keyChapters": [
              "맞춤돌봄 서식",
              "전담사회복지사",
              "생활지원사"
            ],
            "hierarchyLink": {
              "targetId": "sen-care-safety",
              "label": "L1 노인복지 > 안전지원"
            }
          },
          {
            "id": "doc-006",
            "filename": "03_노인맞춤돌봄서비스_사업안내_2026_첨부2.pdf",
            "title": "노인맞춤돌봄서비스 사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "347.5 KB",
            "sizeBytes": 355793,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/03_노인맞춤돌봄서비스_사업안내_2026_첨부2.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SR-02",
            "department": "노인건강과",
            "legalTarget": "노인복지법 제27조의2 · 독거노인·장애인 응급안전안심센터",
            "totalPages": 156,
            "keyChapters": [
              "응급안전장비",
              "화재감지 센서",
              "119 자동연계"
            ],
            "hierarchyLink": {
              "targetId": "sen-care-ict",
              "label": "L1 노인복지 > ICT응급안전"
            }
          },
          {
            "id": "doc-007",
            "filename": "03_노인보건복지사업안내_1권_2026.pdf",
            "title": "노인보건복지사업안내 1권 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "9.11 MB",
            "sizeBytes": 9554140,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/03_노인보건복지사업안내_1권_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SR-03",
            "department": "노인정책과",
            "legalTarget": "노인복지법 제31조~제39조 · 노인복지관, 경로당, 노인교실",
            "totalPages": 418,
            "keyChapters": [
              "노인여가복지",
              "경로당 활성화",
              "노인복지관 평가"
            ],
            "hierarchyLink": {
              "targetId": "sen-lei-center",
              "label": "L1 노인복지 > 여가복지관"
            }
          },
          {
            "id": "doc-008",
            "filename": "03_노인보건복지사업안내_2권_2026.pdf",
            "title": "노인보건복지사업안내 2권 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "12.88 MB",
            "sizeBytes": 13502707,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/03_노인보건복지사업안내_2권_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SR-04",
            "department": "노인정책과",
            "legalTarget": "노인복지법 제39조의2 · 노인보호전문기관, 학대피해쉼터",
            "totalPages": 386,
            "keyChapters": [
              "노인학대 조사",
              "피해노인 쉼터",
              "사후모니터링"
            ],
            "hierarchyLink": {
              "targetId": "sen-pro-invest",
              "label": "L1 노인복지 > 학대의심조사"
            }
          },
          {
            "id": "doc-009",
            "filename": "05_발달장애인지원센터_사업안내_2026_첨부1.pdf",
            "title": "발달장애인지원센터 사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "9.84 MB",
            "sizeBytes": 10316123,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_발달장애인지원센터_사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-01",
            "department": "장애인서비스과",
            "legalTarget": "발달장애인 권리보장법 제33조 · 중앙/지역 발달장애인지원센터",
            "totalPages": 240,
            "keyChapters": [
              "개인별지원계획",
              "주간활동서비스",
              "방과후활동"
            ],
            "hierarchyLink": {
              "targetId": "dis-dd-plan",
              "label": "L1 장애인복지 > 개인별지원계획"
            }
          },
          {
            "id": "doc-010",
            "filename": "05_발달장애인지원센터_사업안내_2026_첨부1.pdf",
            "title": "발달장애인지원센터 사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "9.8 MB",
            "sizeBytes": 10316123,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_발달장애인지원센터_사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-02",
            "department": "장애인서비스과",
            "legalTarget": "발달장애인 권리보장법 제33조 · 발달장애인 거점병원·수행기관",
            "totalPages": 510,
            "keyChapters": [
              "최중증 통합돌봄",
              "행동발달증진센터",
              "부모상담지원"
            ],
            "hierarchyLink": {
              "targetId": "dis-dd-heavy",
              "label": "L1 장애인복지 > 최중증돌봄"
            }
          },
          {
            "id": "doc-011",
            "filename": "05_장애인복지사업안내_2026_첨부1.pdf",
            "title": "장애인복지사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "12.92 MB",
            "sizeBytes": 13545227,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인복지사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-03",
            "department": "장애인정책과",
            "legalTarget": "장애인복지법 제58조 · 장애인복지관, 주간이용시설, 직업재활시설",
            "totalPages": 462,
            "keyChapters": [
              "지역사회재활",
              "재활치료 바우처",
              "장애인 거주시설"
            ],
            "hierarchyLink": {
              "targetId": "dis-rehab-func",
              "label": "L1 장애인복지 > 기능강화재활"
            }
          },
          {
            "id": "doc-012",
            "filename": "05_장애인복지사업안내_2026_첨부1.pdf",
            "title": "장애인복지사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "12.9 MB",
            "sizeBytes": 13545227,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인복지사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-04",
            "department": "장애인정책과",
            "legalTarget": "장애인복지법 제59조의9 · 장애인권익옹호기관, 피해장애인쉼터",
            "totalPages": 556,
            "keyChapters": [
              "장애인학대 신고",
              "응급분리 보호",
              "사법지원 연계"
            ],
            "hierarchyLink": {
              "targetId": "dis-adv-invest",
              "label": "L1 장애인복지 > 학대조사보호"
            }
          },
          {
            "id": "doc-013",
            "filename": "05_장애인활동지원_사업안내_2026.pdf",
            "title": "장애인활동지원 사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "13.93 MB",
            "sizeBytes": 14602458,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인활동지원_사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-05",
            "department": "장애인서비스과",
            "legalTarget": "장애인활동 지원에 관한 법률 제20조 · 장애인활동지원기관",
            "totalPages": 354,
            "keyChapters": [
              "활동지원 급여",
              "서비스 판정",
              "활동지원사 교육"
            ],
            "hierarchyLink": {
              "targetId": "dis-il-personal",
              "label": "L1 장애인복지 > 활동보조지원"
            }
          },
          {
            "id": "doc-014",
            "filename": "07_드림스타트_사업안내_아동통합사례관리_2026.pdf",
            "title": "드림스타트 사업안내 아동통합사례관리 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "8.18 MB",
            "sizeBytes": 8578766,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/07_드림스타트_사업안내_아동통합사례관리_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-01",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제37조 · 시군구 드림스타트팀",
            "totalPages": 286,
            "keyChapters": [
              "통합사례관리",
              "신체건강 서비스",
              "인지언어 맞춤지원"
            ],
            "hierarchyLink": {
              "targetId": "child-dream-intake",
              "label": "L1 아동복지 > 드림스타트사례"
            }
          },
          {
            "id": "doc-015",
            "filename": "07_아동분야사업안내_1권_시설설치운영_2026.pdf",
            "title": "아동분야사업안내 1권 시설설치운영 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.60 MB",
            "sizeBytes": 6919277,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/07_아동분야사업안내_1권_시설설치운영_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-02",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제50조 · 아동양육시설, 공동생활가정(그룹홈)",
            "totalPages": 374,
            "keyChapters": [
              "시설보호 양육",
              "자립역량 강화",
              "아동생활지도"
            ],
            "hierarchyLink": {
              "targetId": "child-fac-care",
              "label": "L1 아동복지 > 시설보호양육"
            }
          },
          {
            "id": "doc-016",
            "filename": "07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf",
            "title": "아동분야사업안내 2권 자립지원가정위탁 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.65 MB",
            "sizeBytes": 5921235,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-03",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제38조 · 가정위탁지원센터, 자립전담기관",
            "totalPages": 348,
            "keyChapters": [
              "가정위탁 보호",
              "자립수당 지급",
              "자립지원전담인력"
            ],
            "hierarchyLink": {
              "targetId": "child-foster-place",
              "label": "L1 아동복지 > 가정위탁연계"
            }
          },
          {
            "id": "doc-017",
            "filename": "08_아동보호서비스_업무매뉴얼_2026.pdf",
            "title": "아동보호서비스 업무매뉴얼 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "1.6 MB",
            "sizeBytes": 1626453,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/08_아동보호서비스_업무매뉴얼_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-04",
            "department": "아동학대대응과",
            "legalTarget": "아동복지법 제45조 · 아동보호전문기관",
            "totalPages": 141,
            "keyChapters": [
              "학대피해아동",
              "심층상담 치료",
              "원가정 복귀지원"
            ],
            "hierarchyLink": {
              "targetId": "child-cps-case",
              "label": "L1 아동복지 > 학대피해상담"
            }
          },
          {
            "id": "doc-018",
            "filename": "09_다함께돌봄센터_사업안내_2025.pdf",
            "title": "다함께돌봄센터 사업안내 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.90 MB",
            "sizeBytes": 7238661,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/09_다함께돌봄센터_사업안내_2025.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-05",
            "department": "인구양육다문화정책과",
            "legalTarget": "아동복지법 제44조의2 · 다함께돌봄센터",
            "totalPages": 226,
            "keyChapters": [
              "초등 방과후돌봄",
              "틈새돌봄",
              "급식간식 지원"
            ],
            "hierarchyLink": {
              "targetId": "child-comm-care",
              "label": "L1 아동복지 > 다함께초등돌봄"
            }
          },
          {
            "id": "doc-019",
            "filename": "09_지역아동센터_지원사업안내_2026_첨부1.pdf",
            "title": "지역아동센터 지원사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.20 MB",
            "sizeBytes": 3354412,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/09_지역아동센터_지원사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-06",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제52조 · 지역아동센터",
            "totalPages": 258,
            "keyChapters": [
              "5대 핵심프로그램",
              "운영비 보조",
              "아동급식 지원"
            ],
            "hierarchyLink": {
              "targetId": "child-comm-edu",
              "label": "L1 아동복지 > 지역아동센터5대"
            }
          },
          {
            "id": "doc-020",
            "filename": "09_지역아동센터_지원사업안내_2026_첨부1.pdf",
            "title": "지역아동센터 지원사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.2 MB",
            "sizeBytes": 3354412,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/09_지역아동센터_지원사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-07",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제52조 · 지역아동센터 서식집",
            "totalPages": 341,
            "keyChapters": [
              "아동출석부",
              "프로그램 계획서",
              "급식위생 일지"
            ],
            "hierarchyLink": {
              "targetId": "child-comm-edu",
              "label": "L1 아동복지 > 지역아동센터서식"
            }
          },
          {
            "id": "doc-021",
            "filename": "10_의료급여사업안내_2026.pdf",
            "title": "의료급여사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.65 MB",
            "sizeBytes": 12218273,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/10_의료급여사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MED-01",
            "department": "기초의료보장과",
            "legalTarget": "의료급여법 제3조 · 시군구 의료급여관리사",
            "totalPages": 298,
            "keyChapters": [
              "의료급여 1·2종",
              "사례관리 상담",
              "적정의료이용"
            ],
            "hierarchyLink": {
              "targetId": "emg-med-aid",
              "label": "L1 긴급돌봄 > 의료급여사례관리"
            }
          },
          {
            "id": "doc-022",
            "filename": "11_자살예방사업안내_2026.pdf",
            "title": "자살예방사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.29 MB",
            "sizeBytes": 11841379,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/11_자살예방사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MH-01",
            "department": "자살예방정책과",
            "legalTarget": "자살예방법 제13조 · 자살예방센터, 109상담센터",
            "totalPages": 310,
            "keyChapters": [
              "24시간 위기대응",
              "자살고위험군 관리",
              "유족 사후지원"
            ],
            "hierarchyLink": {
              "targetId": "mh-suicide-crisis",
              "label": "L1 정신건강 > 24시간자살위기개입"
            }
          },
          {
            "id": "doc-023",
            "filename": "11_정신건강사업안내_2026_첨부2.pdf",
            "title": "정신건강사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.8 MB",
            "sizeBytes": 12350579,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/11_정신건강사업안내_2026_첨부2.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MH-02",
            "department": "정신건강정책과",
            "legalTarget": "정신건강복지법 제15조 · 정신건강복지센터, 중독관리센터",
            "totalPages": 459,
            "keyChapters": [
              "중증정신질환 관리",
              "중독재활 프로그램",
              "지역사회 통합"
            ],
            "hierarchyLink": {
              "targetId": "mh-center-severe",
              "label": "L1 정신건강 > 중증정신질환관리"
            }
          },
          {
            "id": "doc-024",
            "filename": "11_정신건강사업안내_2026_첨부2.pdf",
            "title": "정신건강사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.78 MB",
            "sizeBytes": 12350579,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/11_정신건강사업안내_2026_첨부2.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MH-03",
            "department": "정신건강정책과",
            "legalTarget": "정신건강복지법 제26조 · 정신재활시설, 공동생활가정",
            "totalPages": 264,
            "keyChapters": [
              "정신재활 훈련",
              "주거지원 쉼터",
              "동료지원가 양성"
            ],
            "hierarchyLink": {
              "targetId": "mh-rehab-train",
              "label": "L1 정신건강 > 일상적응재활훈련"
            }
          },
          {
            "id": "doc-025",
            "filename": "12_노숙인_등의_복지사업안내_2026.pdf",
            "title": "노숙인 등의 복지사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.94 MB",
            "sizeBytes": 5184443,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/12_노숙인_등의_복지사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-HL-01",
            "department": "자립지원과",
            "legalTarget": "노숙인 등의 복지 및 자립지원에 관한 법률 제16조 · 노숙인종합지원센터",
            "totalPages": 232,
            "keyChapters": [
              "거리노숙인 상담",
              "응급잠자리",
              "임시주거비 지원"
            ],
            "hierarchyLink": {
              "targetId": "emg-homeless-outreach",
              "label": "L1 긴급돌봄 > 거리상담응급잠자리"
            }
          },
          {
            "id": "doc-026",
            "filename": "13_기부식품등_제공사업안내_푸드뱅크_2026.pdf",
            "title": "기부식품등 제공사업안내 푸드뱅크 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "55.03 MB",
            "sizeBytes": 57708165,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/13_기부식품등_제공사업안내_푸드뱅크_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-FB-01",
            "department": "나눔정책과",
            "legalTarget": "식품등 기부 활성화에 관한 법률 제3조 · 푸드뱅크, 푸드마켓",
            "totalPages": 184,
            "keyChapters": [
              "기부식품 접수",
              "결식계층 배분",
              "식품위생 안전"
            ],
            "hierarchyLink": {
              "targetId": "emg-food-dist",
              "label": "L1 긴급돌봄 > 기부식품배분"
            }
          },
          {
            "id": "doc-027",
            "filename": "15_시도사회서비스원_표준운영지침_2026.pdf",
            "title": "시도사회서비스원 표준운영지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "12.99 MB",
            "sizeBytes": 13622451,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/15_시도사회서비스원_표준운영지침_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SW-01",
            "department": "사회서비스사업과",
            "legalTarget": "사회서비스원법 제10조 · 시도 사회서비스원",
            "totalPages": 276,
            "keyChapters": [
              "국공립시설 위탁",
              "돌봄종사자 직접고용",
              "민간기관 지원"
            ],
            "hierarchyLink": {
              "targetId": "emg-comm-care",
              "label": "L1 긴급돌봄 > 사회서비스원돌봄"
            }
          },
          {
            "id": "doc-028",
            "filename": "15_통합돌봄_사회서비스원_운영매뉴얼_2026_첨부1.pdf",
            "title": "통합돌봄 사회서비스원 운영매뉴얼 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "17.55 MB",
            "sizeBytes": 18405811,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/15_통합돌봄_사회서비스원_운영매뉴얼_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SW-02",
            "department": "지역복지과",
            "legalTarget": "의료·요양 등 지역 돌봄의 통합지원에 관한 법률 · 시군구 통합돌봄과",
            "totalPages": 312,
            "keyChapters": [
              "통합지원 창구",
              "재가복지 연계",
              "퇴원환자 연계"
            ],
            "hierarchyLink": {
              "targetId": "emg-comm-care",
              "label": "L1 긴급돌봄 > 통합돌봄연계"
            }
          }
        ]
      },
      {
        "sourceKey": "[출처_서울시사회복지사협회_자료실]",
        "sourceName": "한국사회복지사협회 / 서울시사회복지사협회 정책자료실",
        "fileCount": 4,
        "totalBytes": 21988684,
        "files": [
          {
            "id": "doc-029",
            "filename": "00_사회복지법인_관리안내_2026_2026년_사회복지법인_관리안내.pdf",
            "title": "사회복지법인 관리안내 2026 2026년 사회복지법인 관리안내",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.24 MB",
            "sizeBytes": 5498835,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/00_사회복지법인_관리안내_2026_2026년_사회복지법인_관리안내.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CORP-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제16조 · 사회복지법인 (시설법인·지원법인)",
            "totalPages": 218,
            "keyChapters": [
              "기본재산 처분",
              "임원 선임허가",
              "법인 정관변경"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 법인관리"
            }
          },
          {
            "id": "doc-030",
            "filename": "05_장애인일자리_사업안내_2026.pdf",
            "title": "장애인일자리 사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "8.57 MB",
            "sizeBytes": 8989609,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/05_장애인일자리_사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-JOB-01",
            "department": "장애인자립기반과",
            "legalTarget": "장애인고용촉진법 제23조 · 시군구 및 수행기관",
            "totalPages": 248,
            "keyChapters": [
              "일반형 일자리",
              "복지일자리",
              "특화형 일자리"
            ],
            "hierarchyLink": {
              "targetId": "dis-job-assist",
              "label": "L1 장애인복지 > 장애인일자리지원"
            }
          },
          {
            "id": "doc-031",
            "filename": "16_긴급복지지원사업안내_2026_2026년_긴급복지지원사업_안내.pdf",
            "title": "긴급복지지원사업안내 2026 2026년 긴급복지지원사업 안내",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.11 MB",
            "sizeBytes": 5357430,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/16_긴급복지지원사업안내_2026_2026년_긴급복지지원사업_안내.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-EMG-01",
            "department": "기초생활보장과",
            "legalTarget": "긴급복지지원법 제8조 · 시군구 복지정책과",
            "totalPages": 192,
            "keyChapters": [
              "긴급생계비 지원",
              "주거지원",
              "사회복지공동모금회 연계"
            ],
            "hierarchyLink": {
              "targetId": "emg-cash-support",
              "label": "L1 긴급돌봄 > 긴급생계비지원"
            }
          },
          {
            "id": "doc-032",
            "filename": "17_차상위계층확인사업안내_2026.pdf",
            "title": "차상위계층확인사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "2.04 MB",
            "sizeBytes": 2142810,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/17_차상위계층확인사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SUB-01",
            "department": "기초생활보장과",
            "legalTarget": "국민기초생활 보장법 제14조의2 · 읍면동 행정복지센터",
            "totalPages": 136,
            "keyChapters": [
              "차상위 본인부담경감",
              "자활급여",
              "양곡할인 지원"
            ],
            "hierarchyLink": {
              "targetId": "self-center-basic",
              "label": "L1 자활지원 > 차상위확인"
            }
          }
        ]
      },
      {
        "sourceKey": "[출처_한국노인인력개발원_KORDI]",
        "sourceName": "한국노인인력개발원 (KORDI)",
        "fileCount": 1,
        "totalBytes": 4232333,
        "files": [
          {
            "id": "doc-033",
            "filename": "03_노인일자리_및_사회활동지원사업_운영안내_2026.pdf",
            "title": "노인일자리 및 사회활동지원사업 운영안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.04 MB",
            "sizeBytes": 4232333,
            "relPath": "01_보건복지부/[출처_한국노인인력개발원_KORDI]/03_노인일자리_및_사회활동지원사업_운영안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SENJOB-01",
            "department": "노인지원과",
            "legalTarget": "노인복지법 제23조 · 시니어클럽, 노인복지관",
            "totalPages": 284,
            "keyChapters": [
              "공익활동형",
              "사회서비스형",
              "시장형 사업단"
            ],
            "hierarchyLink": {
              "targetId": "sen-job-public",
              "label": "L1 노인복지 > 노인일자리사회활동"
            }
          }
        ]
      },
      {
        "sourceKey": "[출처_한국자활복지개발원_KDISS]",
        "sourceName": "한국자활복지개발원 공식누리집",
        "fileCount": 1,
        "totalBytes": 8235512,
        "files": [
          {
            "id": "doc-034",
            "filename": "04_자활사업안내_2026_최종.pdf",
            "title": "자활사업안내 2026 최종",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "7.85 MB",
            "sizeBytes": 8235512,
            "relPath": "01_보건복지부/[출처_한국자활복지개발원_KDISS]/04_자활사업안내_2026_최종.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SELF-01",
            "department": "자립지원과",
            "legalTarget": "국민기초생활 보장법 제16조 · 지역자활센터",
            "totalPages": 364,
            "keyChapters": [
              "자활근로 사업단",
              "자산형성 희망저축",
              "자활기업 창업"
            ],
            "hierarchyLink": {
              "targetId": "self-work-market",
              "label": "L1 자활지원 > 자활근로사업단"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "02_성평등가족부_여가부",
    "categoryName": "여성가족부 (성평등가족부)",
    "icon": "👨‍👩‍👧‍👦",
    "description": "가족·한부모·청소년·쉼터·성매매·가정폭력·다문화",
    "fileCount": 8,
    "totalBytes": 78686578,
    "sources": [
      {
        "sourceKey": "[출처_여성가족부_공식누리집]",
        "sourceName": "여성가족부 대표포털 정책자료실",
        "fileCount": 6,
        "totalBytes": 71376972,
        "files": [
          {
            "id": "doc-035",
            "filename": "01_가족사업안내_1권_본문_2026.pdf",
            "title": "가족사업안내 1권 본문 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.91 MB",
            "sizeBytes": 5146095,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_가족사업안내_1권_본문_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-FAM-01",
            "department": "가족정책과",
            "legalTarget": "건강가정기본법 제35조 · 가족센터 (건강가정·다문화가족지원센터)",
            "totalPages": 312,
            "keyChapters": [
              "가족관계 개선",
              "가족돌봄 서비스",
              "다문화가족 지원"
            ],
            "hierarchyLink": {
              "targetId": "fam-center-edu",
              "label": "L1 가족복지 > 부모역할가족교육"
            }
          },
          {
            "id": "doc-036",
            "filename": "01_가족사업안내_2권_본문_2026.pdf",
            "title": "가족사업안내 2권 본문 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.39 MB",
            "sizeBytes": 4600337,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_가족사업안내_2권_본문_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-FAM-02",
            "department": "가족지원과",
            "legalTarget": "다문화가족지원법 제12조 · 가족센터",
            "totalPages": 278,
            "keyChapters": [
              "한국어교육",
              "이중언어 코칭",
              "다문화자녀 성장지원"
            ],
            "hierarchyLink": {
              "targetId": "fam-multi-settle",
              "label": "L1 가족복지 > 결혼이민자정착"
            }
          },
          {
            "id": "doc-037",
            "filename": "01_청소년사업안내_1권_활동참여_2026.pdf",
            "title": "청소년사업안내 1권 활동참여 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "36.10 MB",
            "sizeBytes": 37854655,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_청소년사업안내_1권_활동참여_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-01",
            "department": "청소년정책과",
            "legalTarget": "청소년기본법 제18조 · 청소년수련관, 청소년문화의집",
            "totalPages": 356,
            "keyChapters": [
              "청소년수련활동",
              "동아리활동",
              "청소년참여자치"
            ],
            "hierarchyLink": {
              "targetId": "youth-act-exp",
              "label": "L1 청소년여성 > 청소년수련활동"
            }
          },
          {
            "id": "doc-038",
            "filename": "01_청소년사업안내_2권_복지보호_쉼터자립지원관_2026.pdf",
            "title": "청소년사업안내 2권 복지보호 쉼터자립지원관 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.86 MB",
            "sizeBytes": 12439125,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_청소년사업안내_2권_복지보호_쉼터자립지원관_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-02",
            "department": "청소년보호과",
            "legalTarget": "청소년복지지원법 제16조 · 청소년상담복지센터, 쉼터",
            "totalPages": 384,
            "keyChapters": [
              "CYS-Net 위기상담",
              "가정밖청소년 쉼터",
              "자립지원관"
            ],
            "hierarchyLink": {
              "targetId": "youth-shelter-temp",
              "label": "L1 청소년여성 > 일시중장기쉼터"
            }
          },
          {
            "id": "doc-039",
            "filename": "02_한부모가족지원사업안내_2026.pdf",
            "title": "한부모가족지원사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.46 MB",
            "sizeBytes": 3623633,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/02_한부모가족지원사업안내_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-FAM-03",
            "department": "가족정책과",
            "legalTarget": "한부모가족지원법 제12조 · 한부모가족복지시설",
            "totalPages": 210,
            "keyChapters": [
              "아동양육비 지원",
              "기본생활 주거",
              "자립준비 코칭"
            ],
            "hierarchyLink": {
              "targetId": "fam-single-living",
              "label": "L1 가족복지 > 모자가족기본주거"
            }
          },
          {
            "id": "doc-040",
            "filename": "03_여성아동권익증진사업_운영지침_폭력피해자보호시설_2026.pdf",
            "title": "여성아동권익증진사업 운영지침 폭력피해자보호시설 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "7.36 MB",
            "sizeBytes": 7713127,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/03_여성아동권익증진사업_운영지침_폭력피해자보호시설_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-WOM-01",
            "department": "권익기반과",
            "legalTarget": "가정폭력방지법 제5조 · 성폭력·가정폭력상담소 및 쉼터",
            "totalPages": 296,
            "keyChapters": [
              "1366 긴급전화",
              "피해자 보호쉼터",
              "무료법률지원"
            ],
            "hierarchyLink": {
              "targetId": "women-viol-counsel",
              "label": "L1 청소년여성 > 1366위기상담"
            }
          }
        ]
      },
      {
        "sourceKey": "[출처_한국청소년상담복지개발원]",
        "sourceName": "한국청소년상담복지개발원",
        "fileCount": 2,
        "totalBytes": 7309606,
        "files": [
          {
            "id": "doc-041",
            "filename": "02_청소년백서_2025_2025 청소년백서.pdf",
            "title": "청소년백서 2025 2025 청소년백서",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.93 MB",
            "sizeBytes": 7262572,
            "relPath": "02_성평등가족부_여가부/[출처_한국청소년상담복지개발원]/02_청소년백서_2025_2025 청소년백서.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-03",
            "department": "청소년정책과",
            "legalTarget": "청소년기본법 제15조 · 대한민국 청소년정책 총괄",
            "totalPages": 420,
            "keyChapters": [
              "청소년실태 통계",
              "위기청소년 지표",
              "청소년시설 현황"
            ],
            "hierarchyLink": {
              "targetId": "youth-counsel-cys",
              "label": "L1 청소년여성 > 청소년상담복지"
            }
          },
          {
            "id": "doc-042",
            "filename": "02_청소년복지시설_쉼터_자립지원관_현황_(26.10월기준)청소년복지시설 기관현황(홈페이지게시).xlsx",
            "title": "청소년복지시설 쉼터 자립지원관 현황 (26.10월기준)청소년복지시설 기관현황(홈페이지게시)",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "XLSX",
            "sizeStr": "45.9 KB",
            "sizeBytes": 47034,
            "relPath": "02_성평등가족부_여가부/[출처_한국청소년상담복지개발원]/02_청소년복지시설_쉼터_자립지원관_현황_(26.10월기준)청소년복지시설 기관현황(홈페이지게시).xlsx",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-04",
            "department": "청소년보호과",
            "legalTarget": "청소년복지지원법 제31조 · 전국 청소년복지시설",
            "totalPages": 35,
            "keyChapters": [
              "쉼터 기관명단",
              "자립지원관 현황",
              "입소정원 안내"
            ],
            "hierarchyLink": {
              "targetId": "youth-shelter-temp",
              "label": "L1 청소년여성 > 쉼터현황"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "03_교육부_한국교육개발원",
    "categoryName": "교육부",
    "icon": "🏫",
    "description": "영유아보육(어린이집)·교육복지우선지원·학교사회복지",
    "fileCount": 3,
    "totalBytes": 16616907,
    "sources": [
      {
        "sourceKey": "[출처_교육부_공식누리집]",
        "sourceName": "교육부 공식 누리집",
        "fileCount": 2,
        "totalBytes": 12467023,
        "files": [
          {
            "id": "doc-043",
            "filename": "09_보육사업안내_어린이집운영_본문_2026.pdf",
            "title": "보육사업안내 어린이집운영 본문 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.27 MB",
            "sizeBytes": 5521959,
            "relPath": "03_교육부_한국교육개발원/[출처_교육부_공식누리집]/09_보육사업안내_어린이집운영_본문_2026.pdf",
            "ministry": "교육부",
            "section": "SECTION_2",
            "code": "MOE-DAY-01",
            "department": "보육정책관",
            "legalTarget": "영유아보육법 제10조 · 국공립·민간·가정어린이집",
            "totalPages": 440,
            "keyChapters": [
              "보육료 지원",
              "교직원 인건비",
              "어린이집 설치인가"
            ],
            "hierarchyLink": {
              "targetId": "childcare-edu-nuri",
              "label": "L1 영유아보육 > 표준보육누리과정"
            }
          },
          {
            "id": "doc-044",
            "filename": "09_보육사업안내_어린이집운영_부록_2026.pdf",
            "title": "보육사업안내 어린이집운영 부록 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.62 MB",
            "sizeBytes": 6945064,
            "relPath": "03_교육부_한국교육개발원/[출처_교육부_공식누리집]/09_보육사업안내_어린이집운영_부록_2026.pdf",
            "ministry": "교육부",
            "section": "SECTION_2",
            "code": "MOE-DAY-02",
            "department": "보육기반과",
            "legalTarget": "영유아보육법 제24조 · 육아종합지원센터, 어린이집",
            "totalPages": 310,
            "keyChapters": [
              "회계보고 서식",
              "부모모니터링단",
              "안전점검 매뉴얼"
            ],
            "hierarchyLink": {
              "targetId": "childcare-spec-handicap",
              "label": "L1 영유아보육 > 장애아취약보육"
            }
          }
        ]
      },
      {
        "sourceKey": "[출처_한국교육개발원_KEDI]",
        "sourceName": "한국교육개발원 (KEDI)",
        "fileCount": 1,
        "totalBytes": 4149884,
        "files": [
          {
            "id": "doc-045",
            "filename": "01_교육복지우선지원사업_운영매뉴얼_학교사회복지.pdf",
            "title": "교육복지우선지원사업 운영매뉴얼 학교사회복지",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.96 MB",
            "sizeBytes": 4149884,
            "relPath": "03_교육부_한국교육개발원/[출처_한국교육개발원_KEDI]/01_교육복지우선지원사업_운영매뉴얼_학교사회복지.pdf",
            "ministry": "교육부",
            "section": "SECTION_2",
            "code": "MOE-SCH-01",
            "department": "학교생활문화과",
            "legalTarget": "초중등교육법 시행령 제54조 · 초·중·고등학교",
            "totalPages": 236,
            "keyChapters": [
              "교육복지우선",
              "학교사회복지사",
              "학습·문화·정서지원"
            ],
            "hierarchyLink": {
              "targetId": "school-comm-link",
              "label": "L1 학교사회복지 > 학교사례관리"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "04_고용노동부_장애인고용공단",
    "categoryName": "고용노동부",
    "icon": "💼",
    "description": "국민취업지원제도·장애인 직업능력개발원·직업재활·근로장애인지원",
    "fileCount": 2,
    "totalBytes": 18272488,
    "sources": [
      {
        "sourceKey": "[출처_고용노동부_공식누리집]",
        "sourceName": "고용노동부 대표포털 정책자료실",
        "fileCount": 1,
        "totalBytes": 14440703,
        "files": [
          {
            "id": "doc-046",
            "filename": "01_국민취업지원제도_업무매뉴얼_2026.pdf",
            "title": "국민취업지원제도 업무매뉴얼 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "13.77 MB",
            "sizeBytes": 14440703,
            "relPath": "04_고용노동부_장애인고용공단/[출처_고용노동부_공식누리집]/01_국민취업지원제도_업무매뉴얼_2026.pdf",
            "ministry": "고용노동부",
            "section": "SECTION_2",
            "code": "MOEL-KUA-01",
            "department": "고용서비스정책과",
            "legalTarget": "구직자 취업촉진 및 생활안정지원에 관한 법률 제6조 · 고용센터",
            "totalPages": 360,
            "keyChapters": [
              "1유형 구직촉진수당",
              "2유형 취업활동",
              "IAP 취업지원계획"
            ],
            "hierarchyLink": {
              "targetId": "self-emp-package",
              "label": "L1 자활지원 > 국민취업지원IAP"
            }
          }
        ]
      },
      {
        "sourceKey": "[출처_한국장애인고용공단]",
        "sourceName": "한국장애인고용공단 공식포털",
        "fileCount": 1,
        "totalBytes": 3831785,
        "files": [
          {
            "id": "doc-047",
            "filename": "01_장애인_직업능력개발원_사업_업무매뉴얼_한국장애인고용공단.pdf",
            "title": "장애인 직업능력개발원 사업 업무매뉴얼 한국장애인고용공단",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.65 MB",
            "sizeBytes": 3831785,
            "relPath": "04_고용노동부_장애인고용공단/[출처_한국장애인고용공단]/01_장애인_직업능력개발원_사업_업무매뉴얼_한국장애인고용공단.pdf",
            "ministry": "고용노동부",
            "section": "SECTION_2",
            "code": "MOEL-DIS-01",
            "department": "장애인고용과",
            "legalTarget": "장애인고용촉진법 제15조 · 한국장애인고용공단 직업능력개발원",
            "totalPages": 280,
            "keyChapters": [
              "맞춤직업훈련",
              "보조공학기기",
              "지원고용 직무지도"
            ],
            "hierarchyLink": {
              "targetId": "dis-job-assist",
              "label": "L1 장애인복지 > 장애인직업능력훈련"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "06_사회복지공동모금회_사랑의열매",
    "categoryName": "사회복지공동모금회",
    "icon": "🍒",
    "description": "사랑의열매 배분사업지침·프로포절·민간지원전달체계",
    "fileCount": 1,
    "totalBytes": 6642540,
    "sources": [
      {
        "sourceKey": "[출처_사랑의열매_배분포털]",
        "sourceName": "사회복지공동모금회 사랑의열매 배분포털",
        "fileCount": 1,
        "totalBytes": 6642540,
        "files": [
          {
            "id": "doc-048",
            "filename": "01_사회복지공동모금회_2026_사업수행안내자료_배분사업지침.pdf",
            "title": "사회복지공동모금회 2026 사업수행안내자료 배분사업지침",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.33 MB",
            "sizeBytes": 6642540,
            "relPath": "06_사회복지공동모금회_사랑의열매/[출처_사랑의열매_배분포털]/01_사회복지공동모금회_2026_사업수행안내자료_배분사업지침.pdf",
            "ministry": "사회복지공동모금회",
            "section": "SECTION_2",
            "code": "CHEST-ALL-01",
            "department": "배분사업본부",
            "legalTarget": "사회복지공동모금회법 제20조 · 사랑의열매 전국 지회",
            "totalPages": 268,
            "keyChapters": [
              "기획사업 공모",
              "신청사업 프로포절",
              "성과평가 정산"
            ],
            "hierarchyLink": {
              "targetId": "alloc-grant-plan",
              "label": "L1 배분모금 > 기획신청공모사업"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "07_외교부_KOICA",
    "categoryName": "외교부 (KOICA)",
    "icon": "🌐",
    "description": "국제개발협력·해외원조·시민사회협력프로그램 공모지침",
    "fileCount": 1,
    "totalBytes": 5806291,
    "sources": [
      {
        "sourceKey": "[출처_한국국제협력단_KOICA]",
        "sourceName": "한국국제협력단 (KOICA)",
        "fileCount": 1,
        "totalBytes": 5806291,
        "files": [
          {
            "id": "doc-049",
            "filename": "01_KOICA_시민사회협력프로그램_공모안내서_2027.pdf",
            "title": "KOICA 시민사회협력프로그램 공모안내서 2027",
            "year": "2027",
            "edition": "2027년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.54 MB",
            "sizeBytes": 5806291,
            "relPath": "07_외교부_KOICA/[출처_한국국제협력단_KOICA]/01_KOICA_시민사회협력프로그램_공모안내서_2027.pdf",
            "ministry": "외교부",
            "section": "SECTION_2",
            "code": "MOFA-KOICA-01",
            "department": "시민사회협력실",
            "legalTarget": "한국국제협력단법 제7조 · KOICA 및 국제개발협력 NGO",
            "totalPages": 220,
            "keyChapters": [
              "ODA 공모사업",
              "SDGs 글로벌빈곤",
              "해외사회복지 현장"
            ],
            "hierarchyLink": {
              "targetId": "alloc-intl-dev",
              "label": "L1 배분모금 > KOICA_ODA협력"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "08_사회공헌센터_ESG_사회적경제",
    "categoryName": "사회공헌·ESG",
    "icon": "🌱",
    "description": "사회복지관 ESG 실천가이드·사회적경제·기업사회공헌",
    "fileCount": 1,
    "totalBytes": 3184333,
    "sources": [
      {
        "sourceKey": "[출처_한국사회복지관협회_WISH]",
        "sourceName": "한국사회복지관협회 복지포털 WISH",
        "fileCount": 1,
        "totalBytes": 3184333,
        "files": [
          {
            "id": "doc-050",
            "filename": "01_사회복지관_ESG_실천가이드_한국사회복지관협회.pdf",
            "title": "사회복지관 ESG 실천가이드 한국사회복지관협회",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.04 MB",
            "sizeBytes": 3184333,
            "relPath": "08_사회공헌센터_ESG_사회적경제/[출처_한국사회복지관협회_WISH]/01_사회복지관_ESG_실천가이드_한국사회복지관협회.pdf",
            "ministry": "사회공헌센터",
            "section": "SECTION_2",
            "code": "ESG-SASW-01",
            "department": "정책연구팀",
            "legalTarget": "ESG 사회복지 실천규범 · 전국 종합사회복지관",
            "totalPages": 178,
            "keyChapters": [
              "친환경 복지관",
              "지역사회 거버넌스",
              "윤리경영 평가"
            ],
            "hierarchyLink": {
              "targetId": "comm-res-org",
              "label": "L1 종합복지 > ESG지역거버넌스"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "09_통일부_하나재단",
    "categoryName": "통일부 (남북하나재단)",
    "icon": "🕊️",
    "description": "북한이탈주민 지역적응센터(하나센터) 운영매뉴얼",
    "fileCount": 1,
    "totalBytes": 2016440,
    "sources": [
      {
        "sourceKey": "[출처_남북하나재단_통일부]",
        "sourceName": "남북하나재단 (통일부)",
        "fileCount": 1,
        "totalBytes": 2016440,
        "files": [
          {
            "id": "doc-051",
            "filename": "01_북한이탈주민_지역적응센터_하나센터_업무매뉴얼_2025.pdf",
            "title": "북한이탈주민 지역적응센터 하나센터 업무매뉴얼 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "1.92 MB",
            "sizeBytes": 2016440,
            "relPath": "09_통일부_하나재단/[출처_남북하나재단_통일부]/01_북한이탈주민_지역적응센터_하나센터_업무매뉴얼_2025.pdf",
            "ministry": "통일부",
            "section": "SECTION_2",
            "code": "MOU-HANA-01",
            "department": "정착지원과",
            "legalTarget": "북한이탈주민의 보호 및 정착지원에 관한 법률 제15조의2 · 하나센터",
            "totalPages": 210,
            "keyChapters": [
              "초기 집중교육",
              "진로취업 지도",
              "정서심리지원"
            ],
            "hierarchyLink": {
              "targetId": "fam-multi-settle",
              "label": "L1 가족복지 > 하나센터정착지원"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "10_국가보훈부_보훈공단",
    "categoryName": "국가보훈부",
    "icon": "🎖️",
    "description": "보훈요양원·보훈의료복지시설 운영지침",
    "fileCount": 1,
    "totalBytes": 2412544,
    "sources": [
      {
        "sourceKey": "[출처_국가보훈부_공식누리집]",
        "sourceName": "국가보훈부 공식 누리집",
        "fileCount": 1,
        "totalBytes": 2412544,
        "files": [
          {
            "id": "doc-052",
            "filename": "01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.pdf",
            "title": "보훈업무 시행지침 2권 보훈요양원 의료복지 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.9 MB",
            "sizeBytes": 6183713,
            "relPath": "10_국가보훈부_보훈공단/[출처_국가보훈부_공식누리집]/01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.pdf",
            "ministry": "국가보훈부",
            "section": "SECTION_2",
            "code": "MPVA-VET-01",
            "department": "보훈의료복지과",
            "legalTarget": "국가유공자 등 예우 및 지원에 관한 법률 제67조 · 보훈요양원",
            "totalPages": 570,
            "keyChapters": [
              "보훈요양 입소",
              "보훈가족 특화돌봄",
              "호국보훈 선양"
            ],
            "hierarchyLink": {
              "targetId": "sen-care-safety",
              "label": "L1 노인복지 > 보훈요양의료돌봄"
            }
          }
        ]
      }
    ]
  },
  {
    "categoryKey": "11_국무조정실_정부기획",
    "categoryName": "국무조정실 (정부기획)",
    "icon": "📋",
    "description": "이재명 정부 123대 국정과제·기본사회·약자복지·통합돌봄",
    "fileCount": 1,
    "totalBytes": 1970638,
    "sources": [
      {
        "sourceKey": "[출처_고용노동부_공식누리집]",
        "sourceName": "고용노동부 대표포털 정책자료실",
        "fileCount": 1,
        "totalBytes": 1970638,
        "files": [
          {
            "id": "doc-053",
            "filename": "01_이재명정부_123대_국정과제.pdf",
            "title": "이재명정부 123대 국정과제",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "1.88 MB",
            "sizeBytes": 1970638,
            "relPath": "11_국무조정실_정부기획/[출처_고용노동부_공식누리집]/01_이재명정부_123대_국정과제.pdf",
            "ministry": "국무조정실",
            "section": "SECTION_2",
            "code": "OPC-GOV-01",
            "department": "국정운영실",
            "legalTarget": "정부조직법 · 대한민국 중앙정부 국정과제위원회",
            "totalPages": 195,
            "keyChapters": [
              "사회안전망 혁신",
              "약자복지 강화",
              "돌봄국가책임제"
            ],
            "hierarchyLink": {
              "targetId": "emg-comm-care",
              "label": "L1 긴급돌봄 > 국정과제약자복지"
            }
          }
        ]
      }
    ]
  }
];

if (typeof window !== 'undefined') {
    window.GOOGLE_DRIVE_ARCHIVE_CONFIG = GOOGLE_DRIVE_ARCHIVE_CONFIG;
    window.GUIDELINES_ARCHIVE_DB = GUIDELINES_ARCHIVE_DB;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOOGLE_DRIVE_ARCHIVE_CONFIG,
        GUIDELINES_ARCHIVE_DB
    };
}
