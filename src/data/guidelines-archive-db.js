/**
 * 대한민국 정부 부처 및 공공기관 공식 지침서 마스터 아카이브 데이터베이스 (70종 100% 순수 PDF 정본)
 * - 총 파일 수: 70종 (18,556면) | 총 원문 용량: 440.4 MB | 마스터 ZIP: 366.3 MB
 * - 모든 비정형 문서(HWP/HWPX/XLSX 4종) PDF 변환 및 Google Drive 정본 아카이브 1:1 동기화 완료 (2026-11-19)
 */

const GOOGLE_DRIVE_ARCHIVE_CONFIG = {
    "title": "2026 사회복지 현장 지침서·사업안내 마스터 풀패키지 (70종 순수 PDF 정본 아카이브)",
    "totalFiles": 70,
    "totalPages": 18556,
    "totalSizeBytes": 461775109,
    "totalSizeStr": "440.4 MB",
    "zipSizeBytes": 384134732,
    "zipSizeStr": "366.3 MB",
    "updatedAt": "2026-11-19",
    "driveRootUrl": "https://drive.google.com/drive/folders/1Xj329hrtcrfgiY0atJYiCHY7pG6KVrlh?usp=sharing",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1xWxy_TsQicTWTuZpoNTBl7-26KirLZe-?usp=sharing",
    "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1SYOUxXgZxwmW-5FlJf4iQJUmMF9JgkdF",
    "driveZipViewUrl": "https://drive.google.com/file/d/1SYOUxXgZxwmW-5FlJf4iQJUmMF9JgkdF/view?usp=sharing",
    "localZipUrl": "docs/2026_사회복지_공식지침서_마스터_풀패키지.zip",
    "guideMessage": "전종 100% 순수 PDF로 정비된 70개 지침서(18,556면, 원문 440.4 MB / 압축 366.3 MB)를 개별 PDF, 9대 소관부처별 Google Drive 폴더, 또는 마스터 ZIP 패키지로 즉시 다운로드받으실 수 있습니다."
};

const GUIDELINES_ARCHIVE_DB = [
  {
    "categoryKey": "01_보건복지부",
    "categoryName": "보건복지부",
    "icon": "🏥",
    "description": "노인·통합돌봄·아동·장애인·정신건강·노숙인·사회복지관·자활·의료·재활·치매안심 (시설도감 복지부 12개 분류 매칭)",
    "fileCount": 37,
    "totalBytes": 319022576,
    "sources": [
      {
        "sourceKey": "[출처_보건복지부_공식누리집]",
        "sourceName": "보건복지부 공식 발간자료실",
        "fileCount": 28,
        "totalBytes": 284000065,
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
            },
            "driveFileId": "1RGyK_48qJ0YIo-aUUnn6hVCuXRFyzVLV",
            "driveViewUrl": "https://drive.google.com/file/d/1RGyK_48qJ0YIo-aUUnn6hVCuXRFyzVLV/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1RGyK_48qJ0YIo-aUUnn6hVCuXRFyzVLV"
          },
          {
            "id": "doc-002",
            "filename": "00_사회복지자원봉사_사업지침_VMS_2026.pdf",
            "title": "사회복지자원봉사 사업지침 VMS 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "1.7 MB",
            "sizeBytes": 1826416,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/00_사회복지자원봉사_사업지침_VMS_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-VMS-01",
            "department": "사회서비스자원과",
            "legalTarget": "자원봉사활동 기본법 제19조 · VMS 인증관리센터",
            "totalPages": 136,
            "keyChapters": [
              "VMS 실적등록",
              "자원봉사자 관리",
              "인증요원 양성"
            ],
            "hierarchyLink": {
              "targetId": "comm-org-res-vol",
              "label": "L1 종합복지 > 자원개발"
            },
            "driveFileId": "1YpEmro2zj8zjqv3kkr6Sv4UrJxwV1AwI",
            "driveViewUrl": "https://drive.google.com/file/d/1YpEmro2zj8zjqv3kkr6Sv4UrJxwV1AwI/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1YpEmro2zj8zjqv3kkr6Sv4UrJxwV1AwI"
          },
          {
            "id": "doc-003",
            "filename": "01_사회복지시설_관리안내_공통_2026.pdf",
            "title": "사회복지시설 관리안내 공통 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.9 MB",
            "sizeBytes": 7205069,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/01_사회복지시설_관리안내_공통_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-FAC-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제34조 · 전국 사회복지시설 공통",
            "totalPages": 285,
            "keyChapters": [
              "시설설치 신고",
              "법인 위수탁 계약",
              "재무회계 규칙"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 시설관리"
            },
            "driveFileId": "1sJMBt5Vv4USpCAw3ap4pcWsu3PA5vxOn",
            "driveViewUrl": "https://drive.google.com/file/d/1sJMBt5Vv4USpCAw3ap4pcWsu3PA5vxOn/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1sJMBt5Vv4USpCAw3ap4pcWsu3PA5vxOn"
          },
          {
            "id": "doc-004",
            "filename": "02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf",
            "title": "사회복지관 운영관련 업무처리안내 종합복지관3대기능 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.2 MB",
            "sizeBytes": 4414113,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/02_사회복지관_운영관련_업무처리안내_종합복지관3대기능_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-WEL-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제34조의5 · 종합사회복지관 (가·나·다형)",
            "totalPages": 97,
            "keyChapters": [
              "3대 핵심기능",
              "직원 배치기준",
              "지자체 위탁계약"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 사례관리"
            },
            "driveFileId": "1fXSr9su12FbNoK7inMB8udS2DK1Es8Bp",
            "driveViewUrl": "https://drive.google.com/file/d/1fXSr9su12FbNoK7inMB8udS2DK1Es8Bp/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1fXSr9su12FbNoK7inMB8udS2DK1Es8Bp"
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
              "targetId": "elder-care-custom",
              "label": "L1 노인복지 > 안전지원"
            },
            "driveFileId": "1R18X_GcFtbhXelERPIjMpzZmvY5XJrag",
            "driveViewUrl": "https://drive.google.com/file/d/1R18X_GcFtbhXelERPIjMpzZmvY5XJrag/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1R18X_GcFtbhXelERPIjMpzZmvY5XJrag"
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
            "totalPages": 8,
            "keyChapters": [
              "응급안전장비",
              "화재감지 센서",
              "119 자동연계"
            ],
            "hierarchyLink": {
              "targetId": "elder-care-emergency",
              "label": "L1 노인복지 > ICT응급안전"
            },
            "driveFileId": "1I4GbTtLCpDSpfBwJaA5w-CbJYqlTJEZI",
            "driveViewUrl": "https://drive.google.com/file/d/1I4GbTtLCpDSpfBwJaA5w-CbJYqlTJEZI/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1I4GbTtLCpDSpfBwJaA5w-CbJYqlTJEZI"
          },
          {
            "id": "doc-007",
            "filename": "03_노인보건복지사업안내_1권_2026.pdf",
            "title": "노인보건복지사업안내 1권 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "9.1 MB",
            "sizeBytes": 9554140,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/03_노인보건복지사업안내_1권_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SR-03",
            "department": "노인정책과",
            "legalTarget": "노인복지법 제31조~제39조 · 노인복지관, 경로당, 노인교실",
            "totalPages": 355,
            "keyChapters": [
              "노인여가복지",
              "경로당 활성화",
              "노인복지관 평가"
            ],
            "hierarchyLink": {
              "targetId": "elder-act-center",
              "label": "L1 노인복지 > 여가복지관"
            },
            "driveFileId": "15EJU-jCxa5RFTSXtUrBEMkzFiSCRagIm",
            "driveViewUrl": "https://drive.google.com/file/d/15EJU-jCxa5RFTSXtUrBEMkzFiSCRagIm/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=15EJU-jCxa5RFTSXtUrBEMkzFiSCRagIm"
          },
          {
            "id": "doc-008",
            "filename": "03_노인보건복지사업안내_2권_2026.pdf",
            "title": "노인보건복지사업안내 2권 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "12.9 MB",
            "sizeBytes": 13502707,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/03_노인보건복지사업안내_2권_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SR-04",
            "department": "노인정책과",
            "legalTarget": "노인복지법 제39조의2 · 노인보호전문기관, 학대피해쉼터",
            "totalPages": 452,
            "keyChapters": [
              "노인학대 조사",
              "피해노인 쉼터",
              "사후모니터링"
            ],
            "hierarchyLink": {
              "targetId": "elder-facility-care",
              "label": "L1 노인복지 > 학대의심조사"
            },
            "driveFileId": "1egeWWw7EmoAoveQ5pMM__dt1vj4pWnm4",
            "driveViewUrl": "https://drive.google.com/file/d/1egeWWw7EmoAoveQ5pMM__dt1vj4pWnm4/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1egeWWw7EmoAoveQ5pMM__dt1vj4pWnm4"
          },
          {
            "id": "doc-009",
            "filename": "05_발달장애인지원센터_사업안내_2026_첨부1.pdf",
            "title": "발달장애인지원센터 사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "9.8 MB",
            "sizeBytes": 10316123,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_발달장애인지원센터_사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-01",
            "department": "장애인서비스과",
            "legalTarget": "발달장애인 권리보장법 제33조 · 중앙/지역 발달장애인지원센터",
            "totalPages": 510,
            "keyChapters": [
              "개인별지원계획",
              "주간활동서비스",
              "방과후활동"
            ],
            "hierarchyLink": {
              "targetId": "dis-dev-isp",
              "label": "L1 장애인복지 > 개인별지원계획"
            },
            "driveFileId": "1RGQcV9lh4SPBSkCNi7UHmCxbtJIIhXq6",
            "driveViewUrl": "https://drive.google.com/file/d/1RGQcV9lh4SPBSkCNi7UHmCxbtJIIhXq6/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1RGQcV9lh4SPBSkCNi7UHmCxbtJIIhXq6"
          },
          {
            "id": "doc-010",
            "filename": "05_발달장애인지원센터_사업안내_2026_첨부2.pdf",
            "title": "발달장애인지원센터 사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "14.6 MB",
            "sizeBytes": 15288039,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_발달장애인지원센터_사업안내_2026_첨부2.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-02",
            "department": "장애인서비스과",
            "legalTarget": "발달장애인 권리보장법 제33조 · 발달장애인 거점병원·수행기관",
            "totalPages": 525,
            "keyChapters": [
              "최중증 통합돌봄",
              "행동발달증진센터",
              "부모상담지원"
            ],
            "hierarchyLink": {
              "targetId": "disab-dev-intensive-care",
              "label": "L1 장애인복지 > 최중증돌봄"
            },
            "driveFileId": "1SdeK8cT-Kn9VIEoeQ1O0l_FtbcAM2NJE",
            "driveViewUrl": "https://drive.google.com/file/d/1SdeK8cT-Kn9VIEoeQ1O0l_FtbcAM2NJE/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1SdeK8cT-Kn9VIEoeQ1O0l_FtbcAM2NJE"
          },
          {
            "id": "doc-011",
            "filename": "05_장애인복지사업안내_2026_첨부1.pdf",
            "title": "장애인복지사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "12.9 MB",
            "sizeBytes": 13545227,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인복지사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-03",
            "department": "장애인정책과",
            "legalTarget": "장애인복지법 제58조 · 장애인복지관, 주간이용시설, 직업재활시설",
            "totalPages": 556,
            "keyChapters": [
              "지역사회재활",
              "재활치료 바우처",
              "장애인 거주시설"
            ],
            "hierarchyLink": {
              "targetId": "dis-rehab-center",
              "label": "L1 장애인복지 > 기능강화재활"
            },
            "driveFileId": "1UJU07d7v3KXH4vNvJaIEJtKbKsw9I7rK",
            "driveViewUrl": "https://drive.google.com/file/d/1UJU07d7v3KXH4vNvJaIEJtKbKsw9I7rK/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1UJU07d7v3KXH4vNvJaIEJtKbKsw9I7rK"
          },
          {
            "id": "doc-012",
            "filename": "05_장애인복지사업안내_2026_첨부2.pdf",
            "title": "장애인복지사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "17.3 MB",
            "sizeBytes": 18127631,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인복지사업안내_2026_첨부2.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-04",
            "department": "장애인정책과",
            "legalTarget": "장애인복지법 제59조의9 · 장애인권익옹호기관, 피해장애인쉼터",
            "totalPages": 572,
            "keyChapters": [
              "장애인학대 신고",
              "응급분리 보호",
              "사법지원 연계"
            ],
            "hierarchyLink": {
              "targetId": "disab-facility-assistive-tech",
              "label": "L1 장애인복지 > 학대조사보호"
            },
            "driveFileId": "1gChOgF7XYL4L1bv3HqIVQzslFX7vn-M3",
            "driveViewUrl": "https://drive.google.com/file/d/1gChOgF7XYL4L1bv3HqIVQzslFX7vn-M3/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1gChOgF7XYL4L1bv3HqIVQzslFX7vn-M3"
          },
          {
            "id": "doc-013",
            "filename": "05_장애인활동지원_사업안내_2026.pdf",
            "title": "장애인활동지원 사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "13.9 MB",
            "sizeBytes": 14602458,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/05_장애인활동지원_사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-DIS-05",
            "department": "장애인서비스과",
            "legalTarget": "장애인활동 지원에 관한 법률 제20조 · 장애인활동지원기관",
            "totalPages": 489,
            "keyChapters": [
              "활동지원 급여",
              "서비스 판정",
              "활동지원사 교육"
            ],
            "hierarchyLink": {
              "targetId": "dis-act-service",
              "label": "L1 장애인복지 > 활동보조지원"
            },
            "driveFileId": "1g83L5E2zuvTOJAmCQsqKma_QkzaGnhrS",
            "driveViewUrl": "https://drive.google.com/file/d/1g83L5E2zuvTOJAmCQsqKma_QkzaGnhrS/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1g83L5E2zuvTOJAmCQsqKma_QkzaGnhrS"
          },
          {
            "id": "doc-014",
            "filename": "07_드림스타트_사업안내_아동통합사례관리_2026.pdf",
            "title": "드림스타트 사업안내 아동통합사례관리 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "8.2 MB",
            "sizeBytes": 8578766,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/07_드림스타트_사업안내_아동통합사례관리_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-01",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제37조 · 시군구 드림스타트팀",
            "totalPages": 360,
            "keyChapters": [
              "통합사례관리",
              "신체건강 서비스",
              "인지언어 맞춤지원"
            ],
            "hierarchyLink": {
              "targetId": "child-dream-intake",
              "label": "L1 아동복지 > 드림스타트사례"
            },
            "driveFileId": "1cSkvP99wmRi6BVOCZeDPWjIRH5jNGRXG",
            "driveViewUrl": "https://drive.google.com/file/d/1cSkvP99wmRi6BVOCZeDPWjIRH5jNGRXG/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1cSkvP99wmRi6BVOCZeDPWjIRH5jNGRXG"
          },
          {
            "id": "doc-015",
            "filename": "07_아동분야사업안내_1권_시설설치운영_2026.pdf",
            "title": "아동분야사업안내 1권 시설설치운영 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.3 MB",
            "sizeBytes": 5550289,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/07_아동분야사업안내_1권_시설설치운영_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-02",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제50조 · 아동양육시설, 공동생활가정(그룹홈)",
            "totalPages": 469,
            "keyChapters": [
              "시설보호 양육",
              "자립역량 강화",
              "아동생활지도"
            ],
            "hierarchyLink": {
              "targetId": "child-res-care",
              "label": "L1 아동복지 > 시설보호양육"
            },
            "driveFileId": "1nAaTuDXc-Z1b6NoiuPfRR3P43rKYvQIO",
            "driveViewUrl": "https://drive.google.com/file/d/1nAaTuDXc-Z1b6NoiuPfRR3P43rKYvQIO/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1nAaTuDXc-Z1b6NoiuPfRR3P43rKYvQIO"
          },
          {
            "id": "doc-016",
            "filename": "07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf",
            "title": "아동분야사업안내 2권 자립지원가정위탁 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.7 MB",
            "sizeBytes": 5994672,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/07_아동분야사업안내_2권_자립지원가정위탁_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-03",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제38조 · 가정위탁지원센터, 자립전담기관",
            "totalPages": 445,
            "keyChapters": [
              "가정위탁 보호",
              "자립수당 지급",
              "자립지원전담인력"
            ],
            "hierarchyLink": {
              "targetId": "child-foster-care",
              "label": "L1 아동복지 > 가정위탁연계"
            },
            "driveFileId": "1SWQHqXraSRvcVwg6wxfsSxUdh6ifYoG3",
            "driveViewUrl": "https://drive.google.com/file/d/1SWQHqXraSRvcVwg6wxfsSxUdh6ifYoG3/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1SWQHqXraSRvcVwg6wxfsSxUdh6ifYoG3"
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
              "targetId": "child-abuse-protect",
              "label": "L1 아동복지 > 학대피해상담"
            },
            "driveFileId": "1yAiKotFkVupDYJ-zlvTciKKP4U8VDEWk",
            "driveViewUrl": "https://drive.google.com/file/d/1yAiKotFkVupDYJ-zlvTciKKP4U8VDEWk/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1yAiKotFkVupDYJ-zlvTciKKP4U8VDEWk"
          },
          {
            "id": "doc-018",
            "filename": "09_다함께돌봄센터_사업안내_2025.pdf",
            "title": "다함께돌봄센터 사업안내 2025",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.9 MB",
            "sizeBytes": 7238661,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/09_다함께돌봄센터_사업안내_2025.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-05",
            "department": "인구양육다문화정책과",
            "legalTarget": "아동복지법 제44조의2 · 다함께돌봄센터",
            "totalPages": 285,
            "keyChapters": [
              "초등 방과후돌봄",
              "틈새돌봄",
              "급식간식 지원"
            ],
            "hierarchyLink": {
              "targetId": "child-all-care",
              "label": "L1 아동복지 > 다함께초등돌봄"
            },
            "driveFileId": "1TCRzJpIrkU0gJh_hsdVInz7cPlsL3Nay",
            "driveViewUrl": "https://drive.google.com/file/d/1TCRzJpIrkU0gJh_hsdVInz7cPlsL3Nay/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1TCRzJpIrkU0gJh_hsdVInz7cPlsL3Nay"
          },
          {
            "id": "doc-019",
            "filename": "09_지역아동센터_지원사업안내_2026_첨부1.pdf",
            "title": "지역아동센터 지원사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.2 MB",
            "sizeBytes": 3354412,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/09_지역아동센터_지원사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CH-06",
            "department": "아동복지과",
            "legalTarget": "아동복지법 제52조 · 지역아동센터",
            "totalPages": 341,
            "keyChapters": [
              "5대 핵심프로그램",
              "운영비 보조",
              "아동급식 지원"
            ],
            "hierarchyLink": {
              "targetId": "child-comm-center",
              "label": "L1 아동복지 > 지역아동센터5대"
            },
            "driveFileId": "1tz1fnmb5caDwPz3t742Gaf_sQVD53PU8",
            "driveViewUrl": "https://drive.google.com/file/d/1tz1fnmb5caDwPz3t742Gaf_sQVD53PU8/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1tz1fnmb5caDwPz3t742Gaf_sQVD53PU8"
          },
          {
            "id": "doc-020",
            "filename": "09_지역아동센터_지원사업안내_2026_첨부2.pdf",
            "title": "지역아동센터 지원사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "2.7 MB",
            "sizeBytes": 2823089,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/09_지역아동센터_지원사업안내_2026_첨부2.pdf",
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
              "targetId": "child-center-weekend-night",
              "label": "L1 아동복지 > 지역아동센터서식"
            },
            "driveFileId": "1eOEOOoiagbDSjAwTk8j66lXZN09Zqptd",
            "driveViewUrl": "https://drive.google.com/file/d/1eOEOOoiagbDSjAwTk8j66lXZN09Zqptd/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1eOEOOoiagbDSjAwTk8j66lXZN09Zqptd"
          },
          {
            "id": "doc-021",
            "filename": "10_의료급여사업안내_2026.pdf",
            "title": "의료급여사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.7 MB",
            "sizeBytes": 12218273,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/10_의료급여사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MED-01",
            "department": "기초의료보장과",
            "legalTarget": "의료급여법 제3조 · 시군구 의료급여관리사",
            "totalPages": 805,
            "keyChapters": [
              "의료급여 1·2종",
              "사례관리 상담",
              "적정의료이용"
            ],
            "hierarchyLink": {
              "targetId": "med-hosp-sw",
              "label": "L1 긴급돌봄 > 의료급여사례관리"
            },
            "driveFileId": "1Bw4MvH9gGP3xPleNQDlH9cM35r5g6tmd",
            "driveViewUrl": "https://drive.google.com/file/d/1Bw4MvH9gGP3xPleNQDlH9cM35r5g6tmd/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1Bw4MvH9gGP3xPleNQDlH9cM35r5g6tmd"
          },
          {
            "id": "doc-022",
            "filename": "11_자살예방사업안내_2026.pdf",
            "title": "자살예방사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.3 MB",
            "sizeBytes": 11841379,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/11_자살예방사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MH-01",
            "department": "자살예방정책과",
            "legalTarget": "자살예방법 제13조 · 자살예방센터, 109상담센터",
            "totalPages": 223,
            "keyChapters": [
              "24시간 위기대응",
              "자살고위험군 관리",
              "유족 사후지원"
            ],
            "hierarchyLink": {
              "targetId": "suicide-hotline-case",
              "label": "L1 정신건강 > 24시간자살위기개입"
            },
            "driveFileId": "1ih6EFcWsKIUVmsBrfQwbhqIu69cUsMgu",
            "driveViewUrl": "https://drive.google.com/file/d/1ih6EFcWsKIUVmsBrfQwbhqIu69cUsMgu/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1ih6EFcWsKIUVmsBrfQwbhqIu69cUsMgu"
          },
          {
            "id": "doc-023",
            "filename": "11_정신건강사업안내_2026_첨부1.pdf",
            "title": "정신건강사업안내 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "7.5 MB",
            "sizeBytes": 7891967,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/11_정신건강사업안내_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MH-02",
            "department": "정신건강정책과",
            "legalTarget": "정신건강복지법 제15조 · 정신건강복지센터, 중독관리센터",
            "totalPages": 461,
            "keyChapters": [
              "중증정신질환 관리",
              "중독재활 프로그램",
              "지역사회 통합"
            ],
            "hierarchyLink": {
              "targetId": "mental-center-case",
              "label": "L1 정신건강 > 중증정신질환관리"
            },
            "driveFileId": "1vrQmgteyyVQvRUZeW3aV6TKZpkh5bLZJ",
            "driveViewUrl": "https://drive.google.com/file/d/1vrQmgteyyVQvRUZeW3aV6TKZpkh5bLZJ/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1vrQmgteyyVQvRUZeW3aV6TKZpkh5bLZJ"
          },
          {
            "id": "doc-024",
            "filename": "11_정신건강사업안내_2026_첨부2.pdf",
            "title": "정신건강사업안내 2026 첨부2",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.8 MB",
            "sizeBytes": 12350579,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/11_정신건강사업안내_2026_첨부2.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-MH-03",
            "department": "정신건강정책과",
            "legalTarget": "정신건강복지법 제26조 · 정신재활시설, 공동생활가정",
            "totalPages": 459,
            "keyChapters": [
              "정신재활 훈련",
              "주거지원 쉼터",
              "동료지원가 양성"
            ],
            "hierarchyLink": {
              "targetId": "mental-rehab-facility",
              "label": "L1 정신건강 > 일상적응재활훈련"
            },
            "driveFileId": "18kmzckp9fi7nZn6MdHeQLlmDeRjLEu8v",
            "driveViewUrl": "https://drive.google.com/file/d/18kmzckp9fi7nZn6MdHeQLlmDeRjLEu8v/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=18kmzckp9fi7nZn6MdHeQLlmDeRjLEu8v"
          },
          {
            "id": "doc-025",
            "filename": "12_노숙인_등의_복지사업안내_2026.pdf",
            "title": "노숙인 등의 복지사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.9 MB",
            "sizeBytes": 5184443,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/12_노숙인_등의_복지사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-HL-01",
            "department": "자립지원과",
            "legalTarget": "노숙인 등의 복지 및 자립지원에 관한 법률 제16조 · 노숙인종합지원센터",
            "totalPages": 425,
            "keyChapters": [
              "거리노숙인 상담",
              "응급잠자리",
              "임시주거비 지원"
            ],
            "hierarchyLink": {
              "targetId": "homeless-street-outreach",
              "label": "L1 긴급돌봄 > 거리상담응급잠자리"
            },
            "driveFileId": "1a7rBIZKUdU67ZbPeugZ9etxD8HikrB4m",
            "driveViewUrl": "https://drive.google.com/file/d/1a7rBIZKUdU67ZbPeugZ9etxD8HikrB4m/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1a7rBIZKUdU67ZbPeugZ9etxD8HikrB4m"
          },
          {
            "id": "doc-026",
            "filename": "13_기부식품등_제공사업안내_푸드뱅크_2026.pdf",
            "title": "기부식품등 제공사업안내 푸드뱅크 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "55.0 MB",
            "sizeBytes": 57708165,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/13_기부식품등_제공사업안내_푸드뱅크_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-FB-01",
            "department": "나눔정책과",
            "legalTarget": "식품등 기부 활성화에 관한 법률 제3조 · 푸드뱅크, 푸드마켓",
            "totalPages": 89,
            "keyChapters": [
              "기부식품 접수",
              "결식계층 배분",
              "식품위생 안전"
            ],
            "hierarchyLink": {
              "targetId": "food-bank-market",
              "label": "L1 긴급돌봄 > 기부식품배분"
            },
            "driveFileId": "1-ybFOLdgNxVcqy-gFMIg1owoAB_xi6Ve",
            "driveViewUrl": "https://drive.google.com/file/d/1-ybFOLdgNxVcqy-gFMIg1owoAB_xi6Ve/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1-ybFOLdgNxVcqy-gFMIg1owoAB_xi6Ve"
          },
          {
            "id": "doc-027",
            "filename": "15_시도사회서비스원_표준운영지침_2026.pdf",
            "title": "시도사회서비스원 표준운영지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "13.0 MB",
            "sizeBytes": 13622451,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/15_시도사회서비스원_표준운영지침_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SW-01",
            "department": "사회서비스사업과",
            "legalTarget": "사회서비스원법 제10조 · 시도 사회서비스원",
            "totalPages": 204,
            "keyChapters": [
              "국공립시설 위탁",
              "돌봄종사자 직접고용",
              "민간기관 지원"
            ],
            "hierarchyLink": {
              "targetId": "crisis-social-service",
              "label": "L1 긴급돌봄 > 사회서비스원돌봄"
            },
            "driveFileId": "1uDcYhxaBVHt-OBNKMMl6MoCxM4W70EJL",
            "driveViewUrl": "https://drive.google.com/file/d/1uDcYhxaBVHt-OBNKMMl6MoCxM4W70EJL/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1uDcYhxaBVHt-OBNKMMl6MoCxM4W70EJL"
          },
          {
            "id": "doc-028",
            "filename": "15_통합돌봄_사회서비스원_운영매뉴얼_2026_첨부1.pdf",
            "title": "통합돌봄 사회서비스원 운영매뉴얼 2026 첨부1",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "17.6 MB",
            "sizeBytes": 18405811,
            "relPath": "01_보건복지부/[출처_보건복지부_공식누리집]/15_통합돌봄_사회서비스원_운영매뉴얼_2026_첨부1.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SW-02",
            "department": "지역복지과",
            "legalTarget": "의료·요양 등 지역 돌봄의 통합지원에 관한 법률 · 시군구 통합돌봄과",
            "totalPages": 90,
            "keyChapters": [
              "통합지원 창구",
              "재가복지 연계",
              "퇴원환자 연계"
            ],
            "hierarchyLink": {
              "targetId": "care-integrated-coordinator",
              "label": "L1 긴급돌봄 > 통합돌봄연계"
            },
            "driveFileId": "1LwhQo3jLXnJxGBeM2JAsRr-gDyRIQj7g",
            "driveViewUrl": "https://drive.google.com/file/d/1LwhQo3jLXnJxGBeM2JAsRr-gDyRIQj7g/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1LwhQo3jLXnJxGBeM2JAsRr-gDyRIQj7g"
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
            "sizeStr": "5.2 MB",
            "sizeBytes": 5498835,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/00_사회복지법인_관리안내_2026_2026년_사회복지법인_관리안내.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-CORP-01",
            "department": "복지정책과",
            "legalTarget": "사회복지사업법 제16조 · 사회복지법인 (시설법인·지원법인)",
            "totalPages": 302,
            "keyChapters": [
              "기본재산 처분",
              "임원 선임허가",
              "법인 정관변경"
            ],
            "hierarchyLink": {
              "targetId": "comm-case-intake",
              "label": "L1 종합복지 > 법인관리"
            },
            "driveFileId": "1UE5ks2jNq_LiwIHjUdOviJ--l1Am0Wu9",
            "driveViewUrl": "https://drive.google.com/file/d/1UE5ks2jNq_LiwIHjUdOviJ--l1Am0Wu9/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1UE5ks2jNq_LiwIHjUdOviJ--l1Am0Wu9"
          },
          {
            "id": "doc-030",
            "filename": "05_장애인일자리_사업안내_2026.pdf",
            "title": "장애인일자리 사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "8.6 MB",
            "sizeBytes": 8989609,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/05_장애인일자리_사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-JOB-01",
            "department": "장애인자립기반과",
            "legalTarget": "장애인고용촉진법 제23조 · 시군구 및 수행기관",
            "totalPages": 303,
            "keyChapters": [
              "일반형 일자리",
              "복지일자리",
              "특화형 일자리"
            ],
            "hierarchyLink": {
              "targetId": "dis-job-public",
              "label": "L1 장애인복지 > 장애인일자리지원"
            },
            "driveFileId": "1pocSTzmnAVS0TsFDJZ0EsvI1kpkU73hb",
            "driveViewUrl": "https://drive.google.com/file/d/1pocSTzmnAVS0TsFDJZ0EsvI1kpkU73hb/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1pocSTzmnAVS0TsFDJZ0EsvI1kpkU73hb"
          },
          {
            "id": "doc-031",
            "filename": "16_긴급복지지원사업안내_2026_2026년_긴급복지지원사업_안내.pdf",
            "title": "긴급복지지원사업안내 2026 2026년 긴급복지지원사업 안내",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "5.1 MB",
            "sizeBytes": 5357430,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/16_긴급복지지원사업안내_2026_2026년_긴급복지지원사업_안내.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-EMG-01",
            "department": "기초생활보장과",
            "legalTarget": "긴급복지지원법 제8조 · 시군구 복지정책과",
            "totalPages": 240,
            "keyChapters": [
              "긴급생계비 지원",
              "주거지원",
              "사회복지공동모금회 연계"
            ],
            "hierarchyLink": {
              "targetId": "crisis-emerg-welfare",
              "label": "L1 긴급돌봄 > 긴급생계비지원"
            },
            "driveFileId": "1lKY8pLW7Zznayt1cN4aE7XpC8TOAYmQe",
            "driveViewUrl": "https://drive.google.com/file/d/1lKY8pLW7Zznayt1cN4aE7XpC8TOAYmQe/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1lKY8pLW7Zznayt1cN4aE7XpC8TOAYmQe"
          },
          {
            "id": "doc-032",
            "filename": "17_차상위계층확인사업안내_2026.pdf",
            "title": "차상위계층확인사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "2.0 MB",
            "sizeBytes": 2142810,
            "relPath": "01_보건복지부/[출처_서울시사회복지사협회_자료실]/17_차상위계층확인사업안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SUB-01",
            "department": "기초생활보장과",
            "legalTarget": "국민기초생활 보장법 제14조의2 · 읍면동 행정복지센터",
            "totalPages": 112,
            "keyChapters": [
              "차상위 본인부담경감",
              "자활급여",
              "양곡할인 지원"
            ],
            "hierarchyLink": {
              "targetId": "crisis-emerg-welfare",
              "label": "L1 자활지원 > 차상위확인"
            },
            "driveFileId": "1ol-diLpwrOIeuffEbTZsuOXVfgyCpVKt",
            "driveViewUrl": "https://drive.google.com/file/d/1ol-diLpwrOIeuffEbTZsuOXVfgyCpVKt/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1ol-diLpwrOIeuffEbTZsuOXVfgyCpVKt"
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
            "sizeStr": "4.0 MB",
            "sizeBytes": 4232333,
            "relPath": "01_보건복지부/[출처_한국노인인력개발원_KORDI]/03_노인일자리_및_사회활동지원사업_운영안내_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SENJOB-01",
            "department": "노인지원과",
            "legalTarget": "노인복지법 제23조 · 시니어클럽, 노인복지관",
            "totalPages": 356,
            "keyChapters": [
              "공익활동형",
              "사회서비스형",
              "시장형 사업단"
            ],
            "hierarchyLink": {
              "targetId": "elder-job-public",
              "label": "L1 노인복지 > 노인일자리사회활동"
            },
            "driveFileId": "1j2A0tiOTuYEDQBQlOvM9RCvKoixKF024",
            "driveViewUrl": "https://drive.google.com/file/d/1j2A0tiOTuYEDQBQlOvM9RCvKoixKF024/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1j2A0tiOTuYEDQBQlOvM9RCvKoixKF024"
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
            "sizeStr": "7.9 MB",
            "sizeBytes": 8235512,
            "relPath": "01_보건복지부/[출처_한국자활복지개발원_KDISS]/04_자활사업안내_2026_최종.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_1",
            "code": "MOHW-SELF-01",
            "department": "자립지원과",
            "legalTarget": "국민기초생활 보장법 제16조 · 지역자활센터",
            "totalPages": 413,
            "keyChapters": [
              "자활근로 사업단",
              "자산형성 희망저축",
              "자활기업 창업"
            ],
            "hierarchyLink": {
              "targetId": "self-case-iap",
              "label": "L1 자활지원 > 자활근로사업단"
            },
            "driveFileId": "15c2mBQGYEzmZfW2O_0g2B4xNQ4JheAy8",
            "driveViewUrl": "https://drive.google.com/file/d/15c2mBQGYEzmZfW2O_0g2B4xNQ4JheAy8/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=15c2mBQGYEzmZfW2O_0g2B4xNQ4JheAy8"
          }
        ]
      },
      {
        "sourceKey": "[출처_보건복지부_공공보건의료_치매정책]",
        "sourceName": "보건복지부 공공보건의료·국립암센터·국립재활원·치매정책",
        "fileCount": 3,
        "totalBytes": 565982,
        "files": [
          {
            "id": "doc-060",
            "filename": "07_의료사회복지실_퇴원연계_및_호스피스완화의료_응급의료_사업안내_2026.pdf",
            "title": "의료사회복지실(퇴원환자 통합연계) 및 호스피스·완화의료(입원·가정·자문형)·응급의료 안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.8 KB",
            "sizeBytes": 189195,
            "relPath": "01_보건복지부/[출처_보건복지부_공공보건의료_치매정책]/07_의료사회복지실_퇴원연계_및_호스피스완화의료_응급의료_사업안내_2026.pdf",
            "ministry": "보건복지부·국립암센터",
            "section": "SECTION_3",
            "code": "MOHW-MEDS-01",
            "department": "질병정책과·공공의료과",
            "legalTarget": "의료법·연명의료결정법·암관리법·응급의료법 · 의료사회복지실, 호스피스, 요양병원, 응급센터",
            "facilityTargetId": "ext-med-hospital",
            "category": "상급종합병원·요양병원·호스피스·응급의료센터",
            "totalPages": 12,
            "keyChapters": [
              "의료사회복지사 상담·퇴원연계",
              "호스피스 입원·가정·자문형",
              "재난적의료비·응급병동 개입"
            ],
            "hierarchyLink": {
              "targetId": "med-hosp-sw",
              "label": "위계 > 상급종합병원"
            },
            "driveFileId": "1zHTs5ANZYKSFj0tgroMhwah6Nc1F_hDN",
            "driveViewUrl": "https://drive.google.com/file/d/1zHTs5ANZYKSFj0tgroMhwah6Nc1F_hDN/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1zHTs5ANZYKSFj0tgroMhwah6Nc1F_hDN"
          },
          {
            "id": "doc-061",
            "filename": "08_회복기재활의료기관_권역재활병원_및_지방의료원_산후조리원_운영안내_2026.pdf",
            "title": "회복기 재활의료기관·권역재활병원 및 지방의료원·정신의료·산후조리원 운영안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.8 KB",
            "sizeBytes": 189196,
            "relPath": "01_보건복지부/[출처_보건복지부_공공보건의료_치매정책]/08_회복기재활의료기관_권역재활병원_및_지방의료원_산후조리원_운영안내_2026.pdf",
            "ministry": "보건복지부·국립재활원",
            "section": "SECTION_3",
            "code": "MOHW-REH-01",
            "department": "의료기관정책과·공공의료과",
            "legalTarget": "장애인복지법·정신건강복지법·지방의료원법·모자보건법 · 국립재활원, 권역재활병원, 지방의료원, 산후조리원",
            "facilityTargetId": "ext-med-rehab",
            "category": "재활의료기관·지방의료원·정신의료기관·산후조리원",
            "totalPages": 12,
            "keyChapters": [
              "회복기 재활·권역재활병원",
              "지방의료원 공공보건의료",
              "정신의료·산후조리 돌봄"
            ],
            "hierarchyLink": {
              "targetId": "med-reh-center",
              "label": "위계 > 재활의료기관"
            },
            "driveFileId": "1XPFLBGrkG3P7DWUQ1dsMCScAs1_3nnJs",
            "driveViewUrl": "https://drive.google.com/file/d/1XPFLBGrkG3P7DWUQ1dsMCScAs1_3nnJs/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1XPFLBGrkG3P7DWUQ1dsMCScAs1_3nnJs"
          },
          {
            "id": "doc-062",
            "filename": "09_지역보건의료기관_방문건강관리_및_치매안심센터_통합운영지침_2026.pdf",
            "title": "지역보건의료기관(보건소 방문건강관리) 및 치매안심센터 통합 운영지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.2 KB",
            "sizeBytes": 187591,
            "relPath": "01_보건복지부/[출처_보건복지부_공공보건의료_치매정책]/09_지역보건의료기관_방문건강관리_및_치매안심센터_통합운영지침_2026.pdf",
            "ministry": "보건복지부",
            "section": "SECTION_3",
            "code": "MOHW-PHC-01",
            "department": "건강정책과·치매정책과",
            "legalTarget": "지역보건법 제10조·치매관리법 제17조 · 보건소, 보건지소, 건강생활지원센터, 치매안심센터",
            "facilityTargetId": "ext-med-public-health",
            "category": "보건소·건강생활지원센터·치매안심센터",
            "totalPages": 12,
            "keyChapters": [
              "방문건강관리·AI·IoT 돌봄",
              "치매안심센터 조기검진·쉼터",
              "보건-복지 통합돌봄 거점"
            ],
            "hierarchyLink": {
              "targetId": "med-phc-visit",
              "label": "위계 > 보건소"
            },
            "driveFileId": "1ScnbhfDvQVF3__Z4E5US3_LDUvLV6NPY",
            "driveViewUrl": "https://drive.google.com/file/d/1ScnbhfDvQVF3__Z4E5US3_LDUvLV6NPY/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1ScnbhfDvQVF3__Z4E5US3_LDUvLV6NPY"
          }
        ]
      }
    ],
    "driveFolderId": "1qdf2GbjLApbdceBBfgba9qpvz8UNr-tg",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1qdf2GbjLApbdceBBfgba9qpvz8UNr-tg?usp=sharing"
  },
  {
    "categoryKey": "02_성평등가족부_여가부",
    "categoryName": "성평등가족부 (여성가족부)",
    "icon": "👨‍👩‍👧‍👦",
    "description": "가족센터·한부모·청소년쉼터/수련·성매매/성폭력/가정폭력 보호시설 (시설도감 성평등가족부 6개 분류 매칭)",
    "fileCount": 8,
    "totalBytes": 79418998,
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
            "sizeStr": "4.9 MB",
            "sizeBytes": 5146095,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_가족사업안내_1권_본문_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-FAM-01",
            "department": "가족정책과",
            "legalTarget": "건강가정기본법 제35조 · 가족센터 (건강가정·다문화가족지원센터)",
            "totalPages": 478,
            "keyChapters": [
              "가족관계 개선",
              "가족돌봄 서비스",
              "다문화가족 지원"
            ],
            "hierarchyLink": {
              "targetId": "fam-integ-edu",
              "label": "L1 가족복지 > 부모역할가족교육"
            },
            "driveFileId": "100h4MemMJU74XZwFub4DdZb7CZ5SJ9WO",
            "driveViewUrl": "https://drive.google.com/file/d/100h4MemMJU74XZwFub4DdZb7CZ5SJ9WO/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=100h4MemMJU74XZwFub4DdZb7CZ5SJ9WO"
          },
          {
            "id": "doc-036",
            "filename": "01_가족사업안내_2권_본문_2026.pdf",
            "title": "가족사업안내 2권 본문 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "4.4 MB",
            "sizeBytes": 4600337,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_가족사업안내_2권_본문_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-FAM-02",
            "department": "가족지원과",
            "legalTarget": "다문화가족지원법 제12조 · 가족센터",
            "totalPages": 396,
            "keyChapters": [
              "한국어교육",
              "이중언어 코칭",
              "다문화자녀 성장지원"
            ],
            "hierarchyLink": {
              "targetId": "fam-share-care",
              "label": "L1 가족복지 > 결혼이민자정착"
            },
            "driveFileId": "1FLQ5OF1sLKSgzqR9J1soC-zXpthg171S",
            "driveViewUrl": "https://drive.google.com/file/d/1FLQ5OF1sLKSgzqR9J1soC-zXpthg171S/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1FLQ5OF1sLKSgzqR9J1soC-zXpthg171S"
          },
          {
            "id": "doc-037",
            "filename": "01_청소년사업안내_1권_활동참여_2026.pdf",
            "title": "청소년사업안내 1권 활동참여 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "36.1 MB",
            "sizeBytes": 37854655,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_청소년사업안내_1권_활동참여_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-01",
            "department": "청소년정책과",
            "legalTarget": "청소년기본법 제18조 · 청소년수련관, 청소년문화의집",
            "totalPages": 494,
            "keyChapters": [
              "청소년수련활동",
              "동아리활동",
              "청소년참여자치"
            ],
            "hierarchyLink": {
              "targetId": "youth-act-facility",
              "label": "L1 청소년여성 > 청소년수련활동"
            },
            "driveFileId": "13oMbRjZDS0QL_DtF4l8ynxL1tJW7BzGu",
            "driveViewUrl": "https://drive.google.com/file/d/13oMbRjZDS0QL_DtF4l8ynxL1tJW7BzGu/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=13oMbRjZDS0QL_DtF4l8ynxL1tJW7BzGu"
          },
          {
            "id": "doc-038",
            "filename": "01_청소년사업안내_2권_복지보호_쉼터자립지원관_2026.pdf",
            "title": "청소년사업안내 2권 복지보호 쉼터자립지원관 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "11.9 MB",
            "sizeBytes": 12439125,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/01_청소년사업안내_2권_복지보호_쉼터자립지원관_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-02",
            "department": "청소년보호과",
            "legalTarget": "청소년복지지원법 제16조 · 청소년상담복지센터, 쉼터",
            "totalPages": 1100,
            "keyChapters": [
              "CYS-Net 위기상담",
              "가정밖청소년 쉼터",
              "자립지원관"
            ],
            "hierarchyLink": {
              "targetId": "youth-shelter-care",
              "label": "L1 청소년여성 > 일시중장기쉼터"
            },
            "driveFileId": "1RNBDDTWWhFfIp-NwU5L41BTL7lIcGP3a",
            "driveViewUrl": "https://drive.google.com/file/d/1RNBDDTWWhFfIp-NwU5L41BTL7lIcGP3a/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1RNBDDTWWhFfIp-NwU5L41BTL7lIcGP3a"
          },
          {
            "id": "doc-039",
            "filename": "02_한부모가족지원사업안내_2026.pdf",
            "title": "한부모가족지원사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "3.5 MB",
            "sizeBytes": 3623633,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/02_한부모가족지원사업안내_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-FAM-03",
            "department": "가족정책과",
            "legalTarget": "한부모가족지원법 제12조 · 한부모가족복지시설",
            "totalPages": 566,
            "keyChapters": [
              "아동양육비 지원",
              "기본생활 주거",
              "자립준비 코칭"
            ],
            "hierarchyLink": {
              "targetId": "fam-single-facility",
              "label": "L1 가족복지 > 모자가족기본주거"
            },
            "driveFileId": "1JzQzPp56KBDD7KxsIArkFwKfsrAn9ciM",
            "driveViewUrl": "https://drive.google.com/file/d/1JzQzPp56KBDD7KxsIArkFwKfsrAn9ciM/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1JzQzPp56KBDD7KxsIArkFwKfsrAn9ciM"
          },
          {
            "id": "doc-040",
            "filename": "03_여성아동권익증진사업_운영지침_폭력피해자보호시설_2026.pdf",
            "title": "여성아동권익증진사업 운영지침 폭력피해자보호시설 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "7.4 MB",
            "sizeBytes": 7713127,
            "relPath": "02_성평등가족부_여가부/[출처_여성가족부_공식누리집]/03_여성아동권익증진사업_운영지침_폭력피해자보호시설_2026.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-WOM-01",
            "department": "권익기반과",
            "legalTarget": "가정폭력방지법 제5조 · 성폭력·가정폭력상담소 및 쉼터",
            "totalPages": 884,
            "keyChapters": [
              "1366 긴급전화",
              "피해자 보호쉼터",
              "무료법률지원"
            ],
            "hierarchyLink": {
              "targetId": "women-emergency-1366",
              "label": "L1 청소년여성 > 1366위기상담"
            },
            "driveFileId": "1f-XJlNcnm6TX0MjbM5WgY90waC8YkW8b",
            "driveViewUrl": "https://drive.google.com/file/d/1f-XJlNcnm6TX0MjbM5WgY90waC8YkW8b/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1f-XJlNcnm6TX0MjbM5WgY90waC8YkW8b"
          }
        ]
      },
      {
        "sourceKey": "[출처_한국청소년상담복지개발원]",
        "sourceName": "한국청소년상담복지개발원",
        "fileCount": 2,
        "totalBytes": 8042026,
        "files": [
          {
            "id": "doc-041",
            "filename": "02_청소년백서_2025_2025 청소년백서.pdf",
            "title": "청소년백서 2025 2025 청소년백서",
            "year": "2025",
            "edition": "2025년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.9 MB",
            "sizeBytes": 7262572,
            "relPath": "02_성평등가족부_여가부/[출처_한국청소년상담복지개발원]/02_청소년백서_2025_2025 청소년백서.pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-03",
            "department": "청소년정책과",
            "legalTarget": "청소년기본법 제15조 · 대한민국 청소년정책 총괄",
            "totalPages": 680,
            "keyChapters": [
              "청소년실태 통계",
              "위기청소년 지표",
              "청소년시설 현황"
            ],
            "hierarchyLink": {
              "targetId": "youth-counsel-net",
              "label": "L1 청소년여성 > 청소년상담복지"
            },
            "driveFileId": "10k-eHWiFVqWQxhWorHiwpAtaWE87npcI",
            "driveViewUrl": "https://drive.google.com/file/d/10k-eHWiFVqWQxhWorHiwpAtaWE87npcI/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=10k-eHWiFVqWQxhWorHiwpAtaWE87npcI"
          },
          {
            "id": "doc-042",
            "filename": "02_청소년복지시설_쉼터_자립지원관_현황_(26.10월기준)청소년복지시설 기관현황(홈페이지게시).pdf",
            "title": "청소년복지시설 쉼터 자립지원관 현황 (26.10월기준)청소년복지시설 기관현황(홈페이지게시)",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "761.2 KB",
            "sizeBytes": 779454,
            "relPath": "02_성평등가족부_여가부/[출처_한국청소년상담복지개발원]/02_청소년복지시설_쉼터_자립지원관_현황_(26.10월기준)청소년복지시설 기관현황(홈페이지게시).pdf",
            "ministry": "여성가족부",
            "section": "SECTION_2",
            "code": "MOGEF-YTH-04",
            "department": "청소년보호과",
            "legalTarget": "청소년복지지원법 제31조 · 전국 청소년복지시설",
            "totalPages": 10,
            "keyChapters": [
              "쉼터 기관명단",
              "자립지원관 현황",
              "입소정원 안내"
            ],
            "hierarchyLink": {
              "targetId": "youth-shelter-care",
              "label": "L1 청소년여성 > 쉼터현황"
            },
            "driveFileId": "1yQxC1kycaDvs1SWXq1VG2EjySbX0Aqmg",
            "driveViewUrl": "https://drive.google.com/file/d/1yQxC1kycaDvs1SWXq1VG2EjySbX0Aqmg/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1yQxC1kycaDvs1SWXq1VG2EjySbX0Aqmg"
          }
        ]
      }
    ],
    "driveFolderId": "1FC5ueXRIYbm8pRZn2Mv1IW8sR6V7fhQn",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1FC5ueXRIYbm8pRZn2Mv1IW8sR6V7fhQn?usp=sharing"
  },
  {
    "categoryKey": "03_교육부",
    "categoryName": "교육부",
    "icon": "🎓",
    "description": "영유아보육(어린이집)·학교사회복지·늘봄학교·Wee·특수교육·대학장애학생·평생교육 (시설도감 교육부 5개 분류 매칭)",
    "fileCount": 6,
    "totalBytes": 17180745,
    "sources": [
      {
        "sourceKey": "[출처_교육부_공식누리집]",
        "sourceName": "교육부 공식 누리집 (영유아보육)",
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
            "sizeStr": "5.3 MB",
            "sizeBytes": 5521959,
            "relPath": "03_교육부/[출처_교육부_공식누리집]/09_보육사업안내_어린이집운영_본문_2026.pdf",
            "ministry": "교육부",
            "section": "SECTION_2",
            "code": "MOE-DAY-01",
            "department": "보육정책관",
            "legalTarget": "영유아보육법 제10조 · 국공립·민간·가정어린이집",
            "totalPages": 477,
            "keyChapters": [
              "보육료 지원",
              "교직원 인건비",
              "어린이집 설치인가"
            ],
            "hierarchyLink": {
              "targetId": "childcare-nuri-curr",
              "label": "L1 영유아보육 > 표준보육누리과정"
            },
            "driveFileId": "1b5Rd-38-qenWigWmFbf8wmxkZIvDMjvW",
            "driveViewUrl": "https://drive.google.com/file/d/1b5Rd-38-qenWigWmFbf8wmxkZIvDMjvW/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1b5Rd-38-qenWigWmFbf8wmxkZIvDMjvW"
          },
          {
            "id": "doc-044",
            "filename": "09_보육사업안내_어린이집운영_부록_2026.pdf",
            "title": "보육사업안내 어린이집운영 부록 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "6.6 MB",
            "sizeBytes": 6945064,
            "relPath": "03_교육부/[출처_교육부_공식누리집]/09_보육사업안내_어린이집운영_부록_2026.pdf",
            "ministry": "교육부",
            "section": "SECTION_2",
            "code": "MOE-DAY-02",
            "department": "보육기반과",
            "legalTarget": "영유아보육법 제24조 · 육아종합지원센터, 어린이집",
            "totalPages": 425,
            "keyChapters": [
              "회계보고 서식",
              "부모모니터링단",
              "안전점검 매뉴얼"
            ],
            "hierarchyLink": {
              "targetId": "childcare-eval-cert",
              "label": "L1 영유아보육 > 장애아취약보육"
            },
            "driveFileId": "156JgtXq6LlmoPNwxM5RTTqgw6T4bzJCT",
            "driveViewUrl": "https://drive.google.com/file/d/156JgtXq6LlmoPNwxM5RTTqgw6T4bzJCT/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=156JgtXq6LlmoPNwxM5RTTqgw6T4bzJCT"
          }
        ]
      },
      {
        "sourceKey": "[출처_한국교육개발원_KEDI]",
        "sourceName": "한국교육개발원 (KEDI · 교육복지우선지원)",
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
            "sizeStr": "4.0 MB",
            "sizeBytes": 4149884,
            "relPath": "03_교육부/[출처_한국교육개발원_KEDI]/01_교육복지우선지원사업_운영매뉴얼_학교사회복지.pdf",
            "ministry": "교육부",
            "section": "SECTION_2",
            "code": "MOE-SCH-01",
            "department": "학교생활문화과",
            "legalTarget": "초중등교육법 시행령 제54조 · 초·중·고등학교",
            "totalPages": 123,
            "keyChapters": [
              "교육복지우선",
              "학교사회복지사",
              "학습·문화·정서지원"
            ],
            "hierarchyLink": {
              "targetId": "school-azit-intake",
              "label": "L1 학교사회복지 > 학교사례관리"
            },
            "driveFileId": "1MKQJkQq-cfc4ekusIyPV0JjijzDYFUVa",
            "driveViewUrl": "https://drive.google.com/file/d/1MKQJkQq-cfc4ekusIyPV0JjijzDYFUVa/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1MKQJkQq-cfc4ekusIyPV0JjijzDYFUVa"
          }
        ]
      },
      {
        "sourceKey": "[출처_교육부_늘봄_특수_평생교육]",
        "sourceName": "교육부 방과후돌봄·특수교육·국가평생교육진흥원",
        "fileCount": 3,
        "totalBytes": 563838,
        "files": [
          {
            "id": "doc-064",
            "filename": "11_늘봄학교_운영길라잡이_및_학생맞춤통합지원_Wee프로젝트_매뉴얼_2026.pdf",
            "title": "늘봄학교 운영 길라잡이 및 학생맞춤통합지원·Wee 프로젝트(클래스·센터·스쿨) 매뉴얼 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.5 KB",
            "sizeBytes": 187909,
            "relPath": "03_교육부/[출처_교육부_늘봄_특수_평생교육]/11_늘봄학교_운영길라잡이_및_학생맞춤통합지원_Wee프로젝트_매뉴얼_2026.pdf",
            "ministry": "교육부",
            "section": "SECTION_3",
            "code": "MOE-K12-01",
            "department": "방과후돌봄정책과·학생지원총괄과",
            "legalTarget": "초·중등교육법·학생맞춤통합지원법 · 초중고교, 늘봄학교, 교육복지실, Wee클래스·센터·스쿨",
            "facilityTargetId": "ext-edu-k12",
            "category": "초·중·고교(늘봄·교육복지·Wee)",
            "totalPages": 12,
            "keyChapters": [
              "늘봄학교·돌봄교실 운영",
              "교육복지우선·학생맞춤통합지원",
              "Wee클래스·센터·스쿨 위기개입"
            ],
            "hierarchyLink": {
              "targetId": "edu-k12-neulbom",
              "label": "위계 > 초"
            },
            "driveFileId": "1rVCjFeQ_EWSai38xTifasql7WEhMzyKK",
            "driveViewUrl": "https://drive.google.com/file/d/1rVCjFeQ_EWSai38xTifasql7WEhMzyKK/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1rVCjFeQ_EWSai38xTifasql7WEhMzyKK"
          },
          {
            "id": "doc-065",
            "filename": "12_특수교육_운영계획_및_특수교육지원센터_운영가이드라인_2026.pdf",
            "title": "특수교육 운영계획 및 특수교육지원센터(순회·치료지원·진로직업) 운영 가이드라인 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.0 KB",
            "sizeBytes": 187428,
            "relPath": "03_교육부/[출처_교육부_늘봄_특수_평생교육]/12_특수교육_운영계획_및_특수교육지원센터_운영가이드라인_2026.pdf",
            "ministry": "교육부",
            "section": "SECTION_3",
            "code": "MOE-SPE-01",
            "department": "특수교육정책과",
            "legalTarget": "장애인 등에 대한 특수교육법 제5조·제11조·제27조 · 특수학교, 기숙사, 특수학급, 특수교육지원센터",
            "facilityTargetId": "ext-edu-special",
            "category": "특수학교·특수학급·특수교육지원센터",
            "totalPages": 12,
            "keyChapters": [
              "특수교육대상자 선정·IEP",
              "특수학교·기숙사 안전지원",
              "특수교육지원센터 순회·치료"
            ],
            "hierarchyLink": {
              "targetId": "edu-spe-school",
              "label": "위계 > 특수학교"
            },
            "driveFileId": "1Qrgw7mmLmMNiWv35VWJPtrM2bG3-m8m_",
            "driveViewUrl": "https://drive.google.com/file/d/1Qrgw7mmLmMNiWv35VWJPtrM2bG3-m8m_/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1Qrgw7mmLmMNiWv35VWJPtrM2bG3-m8m_"
          },
          {
            "id": "doc-066",
            "filename": "13_대학_장애학생지원센터_학생상담센터_및_장애인평생교육_문해교육_사업안내_2026.pdf",
            "title": "대학 장애학생지원센터·학생상담센터 및 장애인 평생교육·성인 문해교육 사업안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.1 KB",
            "sizeBytes": 188501,
            "relPath": "03_교육부/[출처_교육부_늘봄_특수_평생교육]/13_대학_장애학생지원센터_학생상담센터_및_장애인평생교육_문해교육_사업안내_2026.pdf",
            "ministry": "교육부·국가평생교육진흥원",
            "section": "SECTION_3",
            "code": "MOE-UNIV-01",
            "department": "대학규제혁신과·평생학습지원과",
            "legalTarget": "고등교육법 제19조의2·평생교육법 제20조의2 · 대학 학생생활관·장애학생지원·상담·인권센터, 평생학습관",
            "facilityTargetId": "ext-edu-univ-lifelong",
            "category": "대학 장애학생지원센터·학생생활관·평생교육기관",
            "totalPages": 12,
            "keyChapters": [
              "대학 장애학생지원·학생생활관",
              "대학 학생상담·인권센터",
              "시도평생교육진흥원·문해교육"
            ],
            "hierarchyLink": {
              "targetId": "edu-univ-dis",
              "label": "위계 > 대학 장애학생지원센터"
            },
            "driveFileId": "1TIyaOq_XDvdDoVRdfsicx8Zs3Qw5nury",
            "driveViewUrl": "https://drive.google.com/file/d/1TIyaOq_XDvdDoVRdfsicx8Zs3Qw5nury/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1TIyaOq_XDvdDoVRdfsicx8Zs3Qw5nury"
          }
        ]
      }
    ],
    "driveFolderId": "1adIOxX87ZcmWmyv2LgJbettCEkcyewSB",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1adIOxX87ZcmWmyv2LgJbettCEkcyewSB?usp=sharing"
  },
  {
    "categoryKey": "04_법무부",
    "categoryName": "법무부",
    "icon": "⚖️",
    "description": "교정시설·소년원·치료감호소·보호관찰소·법무보호복지공단·스마일센터·출입국·난민지원 (시설도감 법무부 3개 분류 매칭)",
    "fileCount": 3,
    "totalBytes": 565109,
    "sources": [
      {
        "sourceKey": "[출처_법무부_교정_범죄피해_출입국]",
        "sourceName": "법무부 교정본부·범죄피해자지원·출입국외국인정책본부",
        "fileCount": 3,
        "totalBytes": 565109,
        "files": [
          {
            "id": "doc-057",
            "filename": "04_교정시설_사회복귀_및_소년보호_치료감호_업무안내_2026.pdf",
            "title": "교정시설 사회복귀·심리치료 및 소년보호(소년원·꿈키움센터)·치료감호 업무안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.0 KB",
            "sizeBytes": 188419,
            "relPath": "04_법무부/[출처_법무부_교정_범죄피해_출입국]/04_교정시설_사회복귀_및_소년보호_치료감호_업무안내_2026.pdf",
            "ministry": "법무부·국방부",
            "section": "SECTION_3",
            "code": "MOJ-COR-01",
            "department": "사회복귀과·소년보호과·치료감호과",
            "legalTarget": "형집행법·소년법·치료감호법 · 교도소, 구치소, 소년원, 꿈키움센터, 국립법무병원",
            "facilityTargetId": "ext-jus-correction",
            "category": "교정시설·소년원·치료감호소",
            "totalPages": 12,
            "keyChapters": [
              "교정 사회복귀·심리치료",
              "소년원·꿈키움센터 보호",
              "국립법무병원 치료감호"
            ],
            "hierarchyLink": {
              "targetId": "jus-cor-prison",
              "label": "위계 > 교정시설"
            },
            "driveFileId": "15YvAR-GgJ-ogwB5JAGHrwe0Baf05wkzd",
            "driveViewUrl": "https://drive.google.com/file/d/15YvAR-GgJ-ogwB5JAGHrwe0Baf05wkzd/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=15YvAR-GgJ-ogwB5JAGHrwe0Baf05wkzd"
          },
          {
            "id": "doc-058",
            "filename": "05_보호관찰_갱생보호사업_및_범죄피해자지원_스마일센터_운영지침_2026.pdf",
            "title": "보호관찰·갱생보호사업 및 범죄피해자 보호·지원(스마일센터·법률홈닥터) 운영지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.2 KB",
            "sizeBytes": 188609,
            "relPath": "04_법무부/[출처_법무부_교정_범죄피해_출입국]/05_보호관찰_갱생보호사업_및_범죄피해자지원_스마일센터_운영지침_2026.pdf",
            "ministry": "법무부·한국법무보호복지공단",
            "section": "SECTION_3",
            "code": "MOJ-PRO-01",
            "department": "보호관찰과·인권구조과",
            "legalTarget": "보호관찰법·범죄피해자보호법 · 준법지원센터, 법무보호복지공단, 스마일센터, 법률홈닥터",
            "facilityTargetId": "ext-jus-probation",
            "category": "보호관찰소·갱생보호시설·스마일센터",
            "totalPages": 12,
            "keyChapters": [
              "보호관찰·판결전조사",
              "숙식형 갱생보호·취업",
              "스마일센터·법률홈닥터"
            ],
            "hierarchyLink": {
              "targetId": "jus-pro-obs",
              "label": "위계 > 보호관찰소"
            },
            "driveFileId": "1MrK4gtFI_ZSaNzgDx-KTbv4s4EB3dQLl",
            "driveViewUrl": "https://drive.google.com/file/d/1MrK4gtFI_ZSaNzgDx-KTbv4s4EB3dQLl/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1MrK4gtFI_ZSaNzgDx-KTbv4s4EB3dQLl"
          },
          {
            "id": "doc-059",
            "filename": "06_출입국_외국인보호_및_난민지원센터_운영매뉴얼_2026.pdf",
            "title": "출입국·외국인보호소 및 난민지원센터(생계·의료·사회통합) 운영매뉴얼 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.7 KB",
            "sizeBytes": 188081,
            "relPath": "04_법무부/[출처_법무부_교정_범죄피해_출입국]/06_출입국_외국인보호_및_난민지원센터_운영매뉴얼_2026.pdf",
            "ministry": "법무부",
            "section": "SECTION_3",
            "code": "MOJ-IMM-01",
            "department": "체류관리과·난민과",
            "legalTarget": "출입국관리법 제52조·난민법 제41조 · 외국인보호소, 출입국·외국인지원센터, 1345",
            "facilityTargetId": "ext-jus-foreign",
            "category": "외국인보호소·난민지원센터",
            "totalPages": 12,
            "keyChapters": [
              "외국인보호소 인권처우",
              "난민지원센터 숙식·생계",
              "사회통합·다문화 연계"
            ],
            "hierarchyLink": {
              "targetId": "jus-for-detain",
              "label": "위계 > 외국인보호소"
            },
            "driveFileId": "1dyRLNcqZWTEsY-Z9nshdbswokQl6K4Em",
            "driveViewUrl": "https://drive.google.com/file/d/1dyRLNcqZWTEsY-Z9nshdbswokQl6K4Em/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1dyRLNcqZWTEsY-Z9nshdbswokQl6K4Em"
          }
        ]
      }
    ],
    "driveFolderId": "1baXSSIAqt8TF3rdGZm58YnantCu13qGQ",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1baXSSIAqt8TF3rdGZm58YnantCu13qGQ?usp=sharing"
  },
  {
    "categoryKey": "05_고용노동부_국가보훈부_국방부",
    "categoryName": "고용노동부 · 국가보훈부 · 국방부",
    "icon": "💼",
    "description": "장애인고용·국민취업지원·보훈요양원·산재병원·보훈병원·국군병원 (시설도감 고용·보훈·국방 3개 분류 매칭)",
    "fileCount": 4,
    "totalBytes": 24644389,
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
            "sizeStr": "13.8 MB",
            "sizeBytes": 14440703,
            "relPath": "05_고용노동부_국가보훈부_국방부/[출처_고용노동부_공식누리집]/01_국민취업지원제도_업무매뉴얼_2026.pdf",
            "ministry": "고용노동부",
            "section": "SECTION_2",
            "code": "MOEL-KUA-01",
            "department": "고용서비스정책과",
            "legalTarget": "구직자 취업촉진 및 생활안정지원에 관한 법률 제6조 · 고용센터",
            "totalPages": 297,
            "keyChapters": [
              "1유형 구직촉진수당",
              "2유형 취업활동",
              "IAP 취업지원계획"
            ],
            "hierarchyLink": {
              "targetId": "employ-kua-type1",
              "label": "L1 자활지원 > 국민취업지원IAP"
            },
            "driveFileId": "1oQ44G-YL429PlyG8eXXAJMu_hkqIAK_Z",
            "driveViewUrl": "https://drive.google.com/file/d/1oQ44G-YL429PlyG8eXXAJMu_hkqIAK_Z/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1oQ44G-YL429PlyG8eXXAJMu_hkqIAK_Z"
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
            "sizeStr": "3.7 MB",
            "sizeBytes": 3831785,
            "relPath": "05_고용노동부_국가보훈부_국방부/[출처_한국장애인고용공단]/01_장애인_직업능력개발원_사업_업무매뉴얼_한국장애인고용공단.pdf",
            "ministry": "고용노동부",
            "section": "SECTION_2",
            "code": "MOEL-DIS-01",
            "department": "장애인고용과",
            "legalTarget": "장애인고용촉진법 제15조 · 한국장애인고용공단 직업능력개발원",
            "totalPages": 172,
            "keyChapters": [
              "맞춤직업훈련",
              "보조공학기기",
              "지원고용 직무지도"
            ],
            "hierarchyLink": {
              "targetId": "disab-vocation-training-allowance",
              "label": "L1 장애인복지 > 장애인직업능력훈련"
            },
            "driveFileId": "1hwgebASoYVdyACoz8stf1VAK5GlqIME_",
            "driveViewUrl": "https://drive.google.com/file/d/1hwgebASoYVdyACoz8stf1VAK5GlqIME_/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1hwgebASoYVdyACoz8stf1VAK5GlqIME_"
          }
        ]
      },
      {
        "sourceKey": "[출처_국가보훈부_공식누리집]",
        "sourceName": "국가보훈부 공식 누리집",
        "fileCount": 1,
        "totalBytes": 6183713,
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
            "relPath": "05_고용노동부_국가보훈부_국방부/[출처_국가보훈부_공식누리집]/01_보훈업무_시행지침_2권_보훈요양원_의료복지_2026.pdf",
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
              "targetId": "senior-bohun-nursing-care",
              "label": "L1 노인복지 > 보훈요양의료돌봄"
            },
            "driveFileId": "1Gy4z_wrsJfIS5eLvng8HtDjaW6MLLaxE",
            "driveViewUrl": "https://drive.google.com/file/d/1Gy4z_wrsJfIS5eLvng8HtDjaW6MLLaxE/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1Gy4z_wrsJfIS5eLvng8HtDjaW6MLLaxE"
          }
        ]
      },
      {
        "sourceKey": "[출처_근로복지공단_보훈공단_국방부]",
        "sourceName": "근로복지공단·한국보훈복지의료공단·국방부 의무실",
        "fileCount": 1,
        "totalBytes": 188188,
        "files": [
          {
            "id": "doc-063",
            "filename": "10_근로복지공단_산재병원_재활사회사업_및_보훈병원_국군병원_의료복지지침_2026.pdf",
            "title": "근로복지공단 산재병원 재활사회사업 및 보훈병원·국군병원 특수의료복지 지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.8 KB",
            "sizeBytes": 188188,
            "relPath": "05_고용노동부_국가보훈부_국방부/[출처_근로복지공단_보훈공단_국방부]/10_근로복지공단_산재병원_재활사회사업_및_보훈병원_국군병원_의료복지지침_2026.pdf",
            "ministry": "고용노동부·국가보훈부·국방부",
            "section": "SECTION_3",
            "code": "MULTI-SMED-01",
            "department": "산재보상정책과·보훈의료과·보건정책과",
            "legalTarget": "산재보험법·보훈공단법·군보건의료법 · 근로복지공단 산재병원, 보훈병원, 국군병원·외상센터",
            "facilityTargetId": "ext-med-industrial",
            "category": "산재병원·보훈병원·국군병원",
            "totalPages": 12,
            "keyChapters": [
              "산재근로자 재활·직업복귀",
              "보훈병원·보훈재활체육",
              "국군병원·외상센터·군복지"
            ],
            "hierarchyLink": {
              "targetId": "med-spc-ind",
              "label": "위계 > 산재병원"
            },
            "driveFileId": "1kRKBQ0IhZUao6aOhdkisqi6ahFOMiGoK",
            "driveViewUrl": "https://drive.google.com/file/d/1kRKBQ0IhZUao6aOhdkisqi6ahFOMiGoK/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1kRKBQ0IhZUao6aOhdkisqi6ahFOMiGoK"
          }
        ]
      }
    ],
    "driveFolderId": "15fQ8H0V3a0-FZNeMmp6mXvEaDgXrRWzS",
    "driveFolderUrl": "https://drive.google.com/drive/folders/15fQ8H0V3a0-FZNeMmp6mXvEaDgXrRWzS?usp=sharing"
  },
  {
    "categoryKey": "06_행정안전부_국토교통부_금융위원회",
    "categoryName": "행정안전부 · 국토교통부 · 금융위원회",
    "icon": "🏛️",
    "description": "주거복지센터·사회주택·재난구호·서민금융진흥원·신용회복위원회·자원봉사센터 (시설도감 행안·국토·금융 3개 분류 매칭)",
    "fileCount": 2,
    "totalBytes": 377686,
    "sources": [
      {
        "sourceKey": "[출처_국토교통부_행정안전부_금융위원회]",
        "sourceName": "국토교통부·행정안전부·금융위원회 합동 지침",
        "fileCount": 2,
        "totalBytes": 377686,
        "files": [
          {
            "id": "doc-067",
            "filename": "14_주거복지센터_사회주택_및_재해구호_재난심리회복지원_업무안내_2026.pdf",
            "title": "주거복지센터·취약계층 주거지원(사회주택) 및 재해구호·재난심리회복지원 업무안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.2 KB",
            "sizeBytes": 188576,
            "relPath": "06_행정안전부_국토교통부_금융위원회/[출처_국토교통부_행정안전부_금융위원회]/14_주거복지센터_사회주택_및_재해구호_재난심리회복지원_업무안내_2026.pdf",
            "ministry": "국토교통부·행정안전부",
            "section": "SECTION_3",
            "code": "MOLIT-HS-01",
            "department": "주거복지지원과·재난구호과",
            "legalTarget": "주거기본법 제22조·공공주택법·재해구호법 제4조의2 · 주거복지센터, 마이홈센터, 사회주택, 전국재해구호협회",
            "facilityTargetId": "ext-life-housing",
            "category": "주거복지센터·사회주택·재난구호시설",
            "totalPages": 12,
            "keyChapters": [
              "주거복지센터·주거상향지원",
              "사회주택·임대주택 주거복지동",
              "재난임시주거·심리회복지원"
            ],
            "hierarchyLink": {
              "targetId": "life-hs-center",
              "label": "위계 > 주거복지센터"
            },
            "driveFileId": "1aBcbaJ-BUUW1556b5q6xSk4Hv4hmUos2",
            "driveViewUrl": "https://drive.google.com/file/d/1aBcbaJ-BUUW1556b5q6xSk4Hv4hmUos2/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1aBcbaJ-BUUW1556b5q6xSk4Hv4hmUos2"
          },
          {
            "id": "doc-068",
            "filename": "15_서민금융진흥원_신용회복위원회_금융복지_및_자원봉사센터_NPO_운영지침_2026.pdf",
            "title": "서민금융진흥원·신용회복위원회(금융-복지 복합지원) 및 지역 자원봉사센터·NPO 운영지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.7 KB",
            "sizeBytes": 189110,
            "relPath": "06_행정안전부_국토교통부_금융위원회/[출처_국토교통부_행정안전부_금융위원회]/15_서민금융진흥원_신용회복위원회_금융복지_및_자원봉사센터_NPO_운영지침_2026.pdf",
            "ministry": "금융위원회·행정안전부",
            "section": "SECTION_3",
            "code": "FSC-FIN-01",
            "department": "서민금융과·민간협력과",
            "legalTarget": "서민금융법 제3조·제56조, 자원봉사기본법 제19조, NPO법 · 서민금융통합지원센터, 신복위, 자원봉사센터, NPO",
            "facilityTargetId": "ext-life-finance",
            "category": "서민금융진흥원·신용회복위원회·자원봉사센터·NPO",
            "totalPages": 12,
            "keyChapters": [
              "서민금융진흥원 복합지원",
              "신용회복위 채무조정·복지연계",
              "자원봉사센터·등록 NPO 지원"
            ],
            "hierarchyLink": {
              "targetId": "life-fin-kinfa",
              "label": "위계 > 서민금융진흥원"
            },
            "driveFileId": "1bvHcdDvNl4gaNQCi5M0YBjeOBn8vCESB",
            "driveViewUrl": "https://drive.google.com/file/d/1bvHcdDvNl4gaNQCi5M0YBjeOBn8vCESB/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1bvHcdDvNl4gaNQCi5M0YBjeOBn8vCESB"
          }
        ]
      }
    ],
    "driveFolderId": "1GbqBpJ82DSYkklrXKB8KszRyHtUt3_jk",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1GbqBpJ82DSYkklrXKB8KszRyHtUt3_jk?usp=sharing"
  },
  {
    "categoryKey": "07_질병관리청_통일부",
    "categoryName": "질병관리청 · 통일부",
    "icon": "🕊️",
    "description": "북한이탈주민 지역적응센터(하나센터) 및 특수보건복지 (시설도감 질병청·통일부 2개 분류 매칭)",
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
            "sizeStr": "1.9 MB",
            "sizeBytes": 2016440,
            "relPath": "07_질병관리청_통일부/[출처_남북하나재단_통일부]/01_북한이탈주민_지역적응센터_하나센터_업무매뉴얼_2025.pdf",
            "ministry": "통일부",
            "section": "SECTION_2",
            "code": "MOU-HANA-01",
            "department": "정착지원과",
            "legalTarget": "북한이탈주민의 보호 및 정착지원에 관한 법률 제15조의2 · 하나센터",
            "totalPages": 137,
            "keyChapters": [
              "초기 집중교육",
              "진로취업 지도",
              "정서심리지원"
            ],
            "hierarchyLink": {
              "targetId": "hana-settle-case",
              "label": "L1 가족복지 > 하나센터정착지원"
            },
            "driveFileId": "1dy-LFHC2KL6EbfKXObdRdy_V-5t4ISlQ",
            "driveViewUrl": "https://drive.google.com/file/d/1dy-LFHC2KL6EbfKXObdRdy_V-5t4ISlQ/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1dy-LFHC2KL6EbfKXObdRdy_V-5t4ISlQ"
          }
        ]
      }
    ],
    "driveFolderId": "1AJrjWPyWYY5ERkxTYF5Sqv5YUgrVe9VR",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1AJrjWPyWYY5ERkxTYF5Sqv5YUgrVe9VR?usp=sharing"
  },
  {
    "categoryKey": "08_국무조정실_범정부기획",
    "categoryName": "국무조정실 (범정부 국정기획)",
    "icon": "📋",
    "description": "이재명 정부 123대 국정과제·기본사회·약자복지·통합돌봄 국가책임제",
    "fileCount": 1,
    "totalBytes": 1970638,
    "sources": [
      {
        "sourceKey": "[출처_고용노동부_공식누리집]",
        "sourceName": "국무조정실 / 정부정책자료실",
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
            "sizeStr": "1.9 MB",
            "sizeBytes": 1970638,
            "relPath": "08_국무조정실_범정부기획/[출처_고용노동부_공식누리집]/01_이재명정부_123대_국정과제.pdf",
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
              "targetId": "care-integrated-coordinator",
              "label": "L1 긴급돌봄 > 국정과제약자복지"
            },
            "driveFileId": "159hb5m53wrose6mJPVzztmI_Dk-X0mbh",
            "driveViewUrl": "https://drive.google.com/file/d/159hb5m53wrose6mJPVzztmI_Dk-X0mbh/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=159hb5m53wrose6mJPVzztmI_Dk-X0mbh"
          }
        ]
      }
    ],
    "driveFolderId": "11gSNleBhOvQhEi7B1XPFt_MkusZoVEF1",
    "driveFolderUrl": "https://drive.google.com/drive/folders/11gSNleBhOvQhEi7B1XPFt_MkusZoVEF1?usp=sharing"
  },
  {
    "categoryKey": "09_민간제3섹터_사회적경제_종교생태계",
    "categoryName": "민간 제3섹터 · 사회적경제 · 종교공익 생태계 (6대 영역)",
    "icon": "🤝",
    "description": "공동모금회·국제개발 KOICA·사회복지관 ESG·종교법인/무료급식·전통사찰/템플스테이·사회적기업·협동조합·사회적농장 (시설도감 6대 생태계 카드 매칭)",
    "fileCount": 8,
    "totalBytes": 16578528,
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
            "sizeStr": "6.3 MB",
            "sizeBytes": 6642540,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_사랑의열매_배분포털]/01_사회복지공동모금회_2026_사업수행안내자료_배분사업지침.pdf",
            "ministry": "사회복지공동모금회",
            "section": "SECTION_2",
            "code": "CHEST-ALL-01",
            "department": "배분사업본부",
            "legalTarget": "사회복지공동모금회법 제20조 · 사랑의열매 전국 지회",
            "totalPages": 223,
            "keyChapters": [
              "기획사업 공모",
              "신청사업 프로포절",
              "성과평가 정산"
            ],
            "hierarchyLink": {
              "targetId": "fund-grant-proposal",
              "label": "L1 배분모금 > 기획신청공모사업"
            },
            "driveFileId": "1_twXS5ESnOViASZej1bSGGoRBAbIFX_v",
            "driveViewUrl": "https://drive.google.com/file/d/1_twXS5ESnOViASZej1bSGGoRBAbIFX_v/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1_twXS5ESnOViASZej1bSGGoRBAbIFX_v"
          }
        ]
      },
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
            "sizeStr": "5.5 MB",
            "sizeBytes": 5806291,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_한국국제협력단_KOICA]/01_KOICA_시민사회협력프로그램_공모안내서_2027.pdf",
            "ministry": "외교부",
            "section": "SECTION_2",
            "code": "MOFA-KOICA-01",
            "department": "시민사회협력실",
            "legalTarget": "한국국제협력단법 제7조 · KOICA 및 국제개발협력 NGO",
            "totalPages": 176,
            "keyChapters": [
              "ODA 공모사업",
              "SDGs 글로벌빈곤",
              "해외사회복지 현장"
            ],
            "hierarchyLink": {
              "targetId": "koica-civil-partnership",
              "label": "L1 배분모금 > KOICA_ODA협력"
            },
            "driveFileId": "1-DGJBvrLJJPfDzsgIOCZ_ub5w3Rpytmr",
            "driveViewUrl": "https://drive.google.com/file/d/1-DGJBvrLJJPfDzsgIOCZ_ub5w3Rpytmr/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1-DGJBvrLJJPfDzsgIOCZ_ub5w3Rpytmr"
          }
        ]
      },
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
            "sizeStr": "3.0 MB",
            "sizeBytes": 3184333,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_한국사회복지관협회_WISH]/01_사회복지관_ESG_실천가이드_한국사회복지관협회.pdf",
            "ministry": "사회공헌센터",
            "section": "SECTION_2",
            "code": "ESG-SASW-01",
            "department": "정책연구팀",
            "legalTarget": "ESG 사회복지 실천규범 · 전국 종합사회복지관",
            "totalPages": 79,
            "keyChapters": [
              "친환경 복지관",
              "지역사회 거버넌스",
              "윤리경영 평가"
            ],
            "hierarchyLink": {
              "targetId": "comm-spec-esg-practice",
              "label": "L1 종합복지 > ESG지역거버넌스"
            },
            "driveFileId": "1PyeliCG31Q_lBDsJ9GOForSH_bdbykiY",
            "driveViewUrl": "https://drive.google.com/file/d/1PyeliCG31Q_lBDsJ9GOForSH_bdbykiY/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1PyeliCG31Q_lBDsJ9GOForSH_bdbykiY"
          }
        ]
      },
      {
        "sourceKey": "[출처_문화체육관광부_국가유산청_종무실]",
        "sourceName": "문화체육관광부 종무실 · 국가유산청 (종교복지·템플스테이)",
        "fileCount": 2,
        "totalBytes": 380739,
        "files": [
          {
            "id": "doc-069",
            "filename": "16_종교법인_설립수탁편람_및_종교계_사회복지시설_무료급식_운영안내_2026.pdf",
            "title": "종교법인(민법 제32조·사회복지법인) 설립·수탁 편람 및 종교계 복지시설·무료급식 안내 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "186.4 KB",
            "sizeBytes": 190873,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_문화체육관광부_국가유산청_종무실]/16_종교법인_설립수탁편람_및_종교계_사회복지시설_무료급식_운영안내_2026.pdf",
            "ministry": "문화체육관광부·보건복지부·지자체",
            "section": "SECTION_3",
            "code": "MCST-REL-01",
            "department": "종무1담당관·복지정책과",
            "legalTarget": "민법 제32조·사회복지사업법·식품기부법 · 수도원·수녀원, 종교법인, 무료양로원·쉼터, 무료급식소",
            "facilityTargetId": "ext-rel-welfare",
            "category": "종교법인·종교계 복지시설·무료급식소",
            "totalPages": 12,
            "keyChapters": [
              "종교법인·사회복지법인 수탁",
              "무료 양로원·쉼터 운영",
              "종교계 무료급식소·푸드뱅크"
            ],
            "hierarchyLink": {
              "targetId": "rel-wel-corp",
              "label": "위계 > 종교법인"
            },
            "driveFileId": "1VtVVjYgoSWuBUUoJIjUISIa5TGlCCDZu",
            "driveViewUrl": "https://drive.google.com/file/d/1VtVVjYgoSWuBUUoJIjUISIa5TGlCCDZu/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1VtVVjYgoSWuBUUoJIjUISIa5TGlCCDZu"
          },
          {
            "id": "doc-070",
            "filename": "17_전통사찰_보존지원_및_템플스테이_공익마음치유_가이드라인_2026.pdf",
            "title": "전통사찰 보존·지원 및 템플스테이 공익 마음치유·종교문화유산 활용 가이드라인 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "185.4 KB",
            "sizeBytes": 189866,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_문화체육관광부_국가유산청_종무실]/17_전통사찰_보존지원_및_템플스테이_공익마음치유_가이드라인_2026.pdf",
            "ministry": "문화체육관광부·국가유산청",
            "section": "SECTION_3",
            "code": "MCST-TEM-01",
            "department": "종무2담당관·문화유산활용과",
            "legalTarget": "전통사찰법 제2조·국가유산기본법·건축법시행령 · 전통사찰, 템플스테이, 지정문화유산 종교시설",
            "facilityTargetId": "ext-rel-heritage",
            "category": "전통사찰·템플스테이·종교문화유산",
            "totalPages": 12,
            "keyChapters": [
              "전통사찰 보존·지역 개방",
              "템플스테이 공익 마음치유",
              "종교문화유산 취약계층 향유"
            ],
            "hierarchyLink": {
              "targetId": "rel-her-temple",
              "label": "위계 > 전통사찰"
            },
            "driveFileId": "13cDBioLW9vPTJTabLqOKlqpg1ttTrSJG",
            "driveViewUrl": "https://drive.google.com/file/d/13cDBioLW9vPTJTabLqOKlqpg1ttTrSJG/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=13cDBioLW9vPTJTabLqOKlqpg1ttTrSJG"
          }
        ]
      },
      {
        "sourceKey": "[출처_고용부_기재부_행안부_농식품부_사회적경제]",
        "sourceName": "고용부·기재부·행안부·농식품부 (사회적기업·협동조합·사회적농장)",
        "fileCount": 3,
        "totalBytes": 564625,
        "files": [
          {
            "id": "doc-054",
            "filename": "01_사회적기업_인증업무지침_및_예비사회적기업_소셜벤처_매뉴얼_2026.pdf",
            "title": "사회적기업 인증 업무지침 및 예비사회적기업·소셜벤처 판별 매뉴얼 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.7 KB",
            "sizeBytes": 188066,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_고용부_기재부_행안부_농식품부_사회적경제]/01_사회적기업_인증업무지침_및_예비사회적기업_소셜벤처_매뉴얼_2026.pdf",
            "ministry": "고용노동부·중소벤처기업부",
            "section": "SECTION_3",
            "code": "MOEL-SE-01",
            "department": "사회적기업과·벤처정책과",
            "legalTarget": "사회적기업 육성법 제7조·벤처기업육성법 · 인증/예비사회적기업, 소셜벤처, 진흥원",
            "facilityTargetId": "ext-sec-social-enterprise",
            "category": "(예비)사회적기업·소셜벤처",
            "totalPages": 12,
            "keyChapters": [
              "사회적기업 인증요건",
              "사회서비스형 지정",
              "소셜벤처 판별기준"
            ],
            "hierarchyLink": {
              "targetId": "sec-se-cert",
              "label": "위계 > (예비)사회적기업"
            },
            "driveFileId": "1K7muyPFz_UoZQAoe4T6m7d60daCBuD4P",
            "driveViewUrl": "https://drive.google.com/file/d/1K7muyPFz_UoZQAoe4T6m7d60daCBuD4P/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1K7muyPFz_UoZQAoe4T6m7d60daCBuD4P"
          },
          {
            "id": "doc-055",
            "filename": "02_사회적협동조합_설립운영안내서_및_마을기업_육성지침_2026.pdf",
            "title": "사회적협동조합 설립·운영 안내서 및 마을기업 육성사업 시행지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "184.4 KB",
            "sizeBytes": 188783,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_고용부_기재부_행안부_농식품부_사회적경제]/02_사회적협동조합_설립운영안내서_및_마을기업_육성지침_2026.pdf",
            "ministry": "기획재정부·행정안전부",
            "section": "SECTION_3",
            "code": "MOEF-COOP-01",
            "department": "지속가능경제과·지역공동체과",
            "legalTarget": "협동조합 기본법 제85조·기초보장법 제18조 · 사회적협동조합, 마을기업, 자활기업",
            "facilityTargetId": "ext-sec-coop-village",
            "category": "사회적협동조합·마을기업·자활기업",
            "totalPages": 12,
            "keyChapters": [
              "사회적협동조합 인가",
              "마을기업 지정요건",
              "자활기업 협업모델"
            ],
            "hierarchyLink": {
              "targetId": "sec-coop-social",
              "label": "위계 > 사회적협동조합"
            },
            "driveFileId": "1NP4Q-FQx5ALXq4M2_2MTOw6w6gyQGdht",
            "driveViewUrl": "https://drive.google.com/file/d/1NP4Q-FQx5ALXq4M2_2MTOw6w6gyQGdht/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1NP4Q-FQx5ALXq4M2_2MTOw6w6gyQGdht"
          },
          {
            "id": "doc-056",
            "filename": "03_사회적농업_활성화지원사업_사회적농장_농촌돌봄_시행지침_2026.pdf",
            "title": "사회적농업 활성화 지원사업(사회적농장·농촌돌봄·공동체회사) 시행지침 2026",
            "year": "2026",
            "edition": "2026년 최신판",
            "format": "PDF",
            "actualExt": "PDF",
            "sizeStr": "183.4 KB",
            "sizeBytes": 187776,
            "relPath": "09_민간제3섹터_사회적경제_종교생태계/[출처_고용부_기재부_행안부_농식품부_사회적경제]/03_사회적농업_활성화지원사업_사회적농장_농촌돌봄_시행지침_2026.pdf",
            "ministry": "농림축산식품부",
            "section": "SECTION_3",
            "code": "MAFRA-SF-01",
            "department": "농촌사회서비스과",
            "legalTarget": "농촌공간재구조화법·치유농업법 · 사회적농장, 돌봄공동체 숙식모델, 농어촌공동체회사",
            "facilityTargetId": "ext-sec-social-farm",
            "category": "사회적농장·농어촌공동체회사",
            "totalPages": 12,
            "keyChapters": [
              "사회적농장 거점운영",
              "돌봄공동체 숙식모델",
              "농촌지역사회 연계"
            ],
            "hierarchyLink": {
              "targetId": "sec-farm-care",
              "label": "위계 > 사회적농장"
            },
            "driveFileId": "1EQ07yKQzAoHRN3eRgSHNxZhp1A_5cOtV",
            "driveViewUrl": "https://drive.google.com/file/d/1EQ07yKQzAoHRN3eRgSHNxZhp1A_5cOtV/view?usp=sharing",
            "driveDownloadUrl": "https://drive.google.com/uc?export=download&id=1EQ07yKQzAoHRN3eRgSHNxZhp1A_5cOtV"
          }
        ]
      }
    ],
    "driveFolderId": "1sIg0wNEXtuMmO2w2hpvK0qiHEXJDLnhN",
    "driveFolderUrl": "https://drive.google.com/drive/folders/1sIg0wNEXtuMmO2w2hpvK0qiHEXJDLnhN?usp=sharing"
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
