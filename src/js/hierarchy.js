/**
 * 대한민국 사회복지 현장 나침반: 3단계 위계 도감 (167개 법정단위서비스 전수 매트릭스)
 * Google Stitch Material Design 3 리디자인 반영 컨트롤러
 */

(function () {
    let currentMinistryGroup = 'all';
    let currentDomainFilter = 'all';
    let currentSearchKeyword = '';
    let currentFacilityFilter = null;
    let currentParentCategory = null;

    const FACILITY_MAPPING_RULES = {
    "노인주거복지시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "양로시설",
            "노인복지주택",
            "노인복지시설"
        ],
        "level1": [
            "노인주거복지",
            "노인의료 및 주거복지"
        ]
    },
    "양로시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "양로시설",
            "노인복지시설"
        ],
        "level1": [
            "노인주거복지"
        ]
    },
    "노인공동생활가정": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "양로시설",
            "노인복지시설"
        ],
        "level1": [
            "노인주거복지"
        ]
    },
    "노인복지주택": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인복지주택"
        ],
        "level1": [
            "노인주거복지"
        ]
    },
    "노인의료복지시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설",
            "노인복지시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "노인요양시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "노인요양공동생활가정": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "학대피해노인전용쉼터": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "학대피해노인전용쉼터"
        ],
        "level1": [
            "노인권익보호"
        ]
    },
    "재가노인복지시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "재가·돌봄지원"
        ]
    },
    "방문요양": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "재가·돌봄지원"
        ]
    },
    "주야간보호": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "재가·돌봄지원"
        ]
    },
    "단기보호": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "재가·돌봄지원"
        ]
    },
    "노인여가복지시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인복지관",
            "경로당",
            "노인교실"
        ],
        "level1": [
            "노인 여가 및 사회활동 지원"
        ]
    },
    "노인복지관": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인복지관"
        ],
        "level1": [
            "노인 여가 및 사회활동 지원"
        ]
    },
    "경로당": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "경로당"
        ],
        "level1": [
            "노인 여가 및 사회활동 지원"
        ]
    },
    "노인교실": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인교실"
        ],
        "level1": [
            "노인 여가 및 사회활동 지원"
        ]
    },
    "노인보호전문기관": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인보호전문기관"
        ],
        "level1": [
            "노인권익보호"
        ]
    },
    "노인일자리지원기관": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인일자리지원기관(시니어클럽)",
            "시니어클럽"
        ],
        "level1": [
            "노인사회활동"
        ]
    },
    "시니어클럽": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인일자리지원기관(시니어클럽)",
            "시니어클럽"
        ],
        "level1": [
            "노인사회활동"
        ]
    },
    "지자체 통합지원 전담조직 · 읍면동 통합창구": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구 긴급복지지원 전담부서",
            "시·군·구청 복지정책과"
        ],
        "level1": [
            "의료·요양통합돌봄",
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    },
    "재택의료 · 퇴원환자 전환돌봄 · 일상생활돌봄 연계 거점기관": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·도 사회서비스원(종합재가센터)",
            "보건소"
        ],
        "level1": [
            "의료·요양통합돌봄",
            "공공돌봄지원"
        ]
    },
    "복합노인복지시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인복지관",
            "노인요양시설",
            "양로시설"
        ],
        "level1": [
            "노인 여가 및 사회활동 지원",
            "노인주거복지"
        ]
    },
    "아동양육시설": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "아동양육시설"
        ],
        "level1": [
            "보호대상아동 시설양육 및 그룹홈"
        ]
    },
    "아동일시보호시설": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "아동일시보호시설"
        ],
        "level1": [
            "보호대상아동 시설양육 및 그룹홈",
            "아동보호체계"
        ]
    },
    "아동보호치료시설": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "아동양육시설",
            "학대피해아동쉼터"
        ],
        "level1": [
            "보호대상아동 시설양육 및 그룹홈",
            "아동보호체계"
        ]
    },
    "자립지원시설": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "자립지원전담기관"
        ],
        "level1": [
            "가정위탁 및 자립준비청년 지원"
        ]
    },
    "공동생활가정": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "공동생활가정"
        ],
        "level1": [
            "보호대상아동 시설양육 및 그룹홈",
            "그룹홈보호"
        ]
    },
    "그룹홈": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "공동생활가정"
        ],
        "level1": [
            "보호대상아동 시설양육 및 그룹홈",
            "그룹홈보호"
        ]
    },
    "학대피해아동쉼터": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "학대피해아동쉼터"
        ],
        "level1": [
            "아동보호체계",
            "아동학대 예방 및 아동권리보호"
        ]
    },
    "아동상담소": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "드림스타트",
            "아동보호전문기관"
        ],
        "level1": [
            "취약계층 아동통합사례관리 (드림스타트)",
            "아동학대 예방 및 아동권리보호"
        ]
    },
    "아동전용시설": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "지역아동센터",
            "다함께돌봄센터"
        ],
        "level1": [
            "방과 후 온종일 마을돌봄",
            "지역아동센터"
        ]
    },
    "지역아동센터": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "지역아동센터"
        ],
        "level1": [
            "방과 후 온종일 마을돌봄",
            "지역아동센터"
        ]
    },
    "다함께돌봄센터": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "다함께돌봄센터"
        ],
        "level1": [
            "방과 후 온종일 마을돌봄",
            "다함께돌봄"
        ]
    },
    "아동보호전문기관": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "아동보호전문기관"
        ],
        "level1": [
            "아동학대 예방 및 아동권리보호"
        ]
    },
    "가정위탁지원센터": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "가정위탁지원센터"
        ],
        "level1": [
            "가정위탁 및 자립준비청년 지원",
            "가정위탁지원"
        ]
    },
    "자립지원전담기관": {
        "domainId": "04_아동돌봄복지",
        "facilityTypes": [
            "자립지원전담기관"
        ],
        "level1": [
            "가정위탁 및 자립준비청년 지원"
        ]
    },
    "장애유형별 거주시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "중증장애인 거주시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애영유아 거주시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애인단기거주시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인주간이용시설",
            "장애인복지시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애인공동생활가정": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인자립생활지원센터(IL센터)",
            "장애인복지시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "피해장애인쉼터": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "피해장애인쉼터",
            "장애인권익옹호기관"
        ],
        "level1": [
            "장애인 인권 및 권익옹호"
        ]
    },
    "피해장애아동쉼터": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "피해장애인쉼터",
            "장애인권익옹호기관"
        ],
        "level1": [
            "장애인 인권 및 권익옹호"
        ]
    },
    "장애인지역사회재활시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지관",
            "장애인주간이용시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애인복지관": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지관"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "주간이용시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인주간이용시설"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애인직업재활시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인직업재활시설(보호작업장·근로사업장)"
        ],
        "level1": [
            "장애인 직업재활 및 일자리지원"
        ]
    },
    "보호작업장": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인직업재활시설(보호작업장·근로사업장)"
        ],
        "level1": [
            "장애인 직업재활 및 일자리지원"
        ]
    },
    "근로사업장": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인직업재활시설(보호작업장·근로사업장)"
        ],
        "level1": [
            "장애인 직업재활 및 일자리지원"
        ]
    },
    "장애인의료재활시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지관"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애인생산품판매시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인직업재활시설(보호작업장·근로사업장)"
        ],
        "level1": [
            "장애인 직업재활 및 일자리지원"
        ]
    },
    "지역보조기기센터": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인자립생활지원센터(IL센터)"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "발달장애인지원센터": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "발달장애인지원센터"
        ],
        "level1": [
            "발달장애인 맞춤형 평생지원"
        ]
    },
    "장애인자립생활지원센터": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인자립생활지원센터(IL센터)"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "IL센터": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인자립생활지원센터(IL센터)"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "장애인활동지원기관": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인활동지원기관"
        ],
        "level1": [
            "장애인활동지원 및 돌봄안전망"
        ]
    },
    "장애인권익옹호기관": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인권익옹호기관"
        ],
        "level1": [
            "장애인 인권 및 권익옹호"
        ]
    },
    "정신건강복지센터": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "기초·광역 정신건강복지센터",
            "정신건강복지센터"
        ],
        "level1": [
            "지역사회 정신건강증진 및 사례관리"
        ]
    },
    "정신재활시설": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "정신재활시설",
            "정신재활시설(주간재활·공동생활가정·직업재활)"
        ],
        "level1": [
            "중독관리 및 정신재활시설 운영",
            "정신재활지원"
        ]
    },
    "정신요양시설": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "정신재활시설"
        ],
        "level1": [
            "정신재활지원"
        ]
    },
    "정신의료기관": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "정신건강복지센터"
        ],
        "level1": [
            "지역사회 정신건강증진 및 사례관리",
            "정신응급대응"
        ]
    },
    "중독관리통합지원센터": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "중독관리통합지원센터"
        ],
        "level1": [
            "중독관리 및 정신재활시설 운영"
        ]
    },
    "자살예방센터": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "자살예방센터"
        ],
        "level1": [
            "자살예방 및 생명존중문화 조성",
            "자살예방체계"
        ]
    },
    "노숙인일시보호시설": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "노숙인일시보호시설",
            "노숙인일시보호시설 및 자활·재활쉼터"
        ],
        "level1": [
            "노숙인 복지 및 자립지원"
        ]
    },
    "노숙인자활시설": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "노숙인일시보호시설 및 자활·재활쉼터"
        ],
        "level1": [
            "노숙인 복지 및 자립지원"
        ]
    },
    "노숙인재활시설": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "노숙인일시보호시설 및 자활·재활쉼터"
        ],
        "level1": [
            "노숙인 복지 및 자립지원"
        ]
    },
    "노숙인요양시설": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "노숙인종합지원센터"
        ],
        "level1": [
            "노숙인 복지 및 자립지원"
        ]
    },
    "노숙인종합지원센터": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "노숙인종합지원센터"
        ],
        "level1": [
            "노숙인 복지 및 자립지원"
        ]
    },
    "노숙인급식시설": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "푸드뱅크·푸드마켓",
            "기초·광역 푸드뱅크 및 푸드마켓"
        ],
        "level1": [
            "지역 물적나눔 및 식품지원"
        ]
    },
    "노숙인진료시설": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "노숙인종합지원센터"
        ],
        "level1": [
            "노숙인 복지 및 자립지원"
        ]
    },
    "쪽방상담소": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "쪽방상담소"
        ],
        "level1": [
            "취약주거민보호"
        ]
    },
    "어린이집": {
        "domainId": "05_영유아보육",
        "facilityTypes": [
            "어린이집",
            "국공립어린이집"
        ],
        "level1": [
            "표준보육과정 및 누리과정 운영",
            "취약보육 및 맞춤형 보육서비스"
        ]
    },
    "국공립어린이집": {
        "domainId": "05_영유아보육",
        "facilityTypes": [
            "국공립어린이집"
        ],
        "level1": [
            "표준보육과정 및 누리과정 운영"
        ]
    },
    "육아종합지원센터": {
        "domainId": "05_영유아보육",
        "facilityTypes": [
            "육아종합지원센터"
        ],
        "level1": [
            "지역사회 육아지원 (육아종합지원센터)",
            "보육품질관리"
        ]
    },
    "가족센터": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "가족센터"
        ],
        "level1": [
            "보편적 가족지원 (가족센터)",
            "다문화가족 특화지원"
        ]
    },
    "공동육아나눔터": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "공동육아나눔터"
        ],
        "level1": [
            "보편적 가족지원 (가족센터)"
        ]
    },
    "한부모가족복지시설": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "한부모가족복지시설(출산·양육·일시지원시설)"
        ],
        "level1": [
            "한부모가족 복지 및 자립지원"
        ]
    },
    "출산지원시설": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "한부모가족복지시설(출산·양육·일시지원시설)"
        ],
        "level1": [
            "한부모가족 복지 및 자립지원"
        ]
    },
    "양육지원시설": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "한부모가족복지시설(출산·양육·일시지원시설)"
        ],
        "level1": [
            "한부모가족 복지 및 자립지원"
        ]
    },
    "생활지원시설": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "한부모가족복지시설(출산·양육·일시지원시설)"
        ],
        "level1": [
            "한부모가족 복지 및 자립지원"
        ]
    },
    "한부모가족복지상담소": {
        "domainId": "06_가족복지",
        "facilityTypes": [
            "한부모가족복지상담소"
        ],
        "level1": [
            "한부모가족 복지 및 자립지원"
        ]
    },
    "청소년쉼터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년쉼터(일시·단기·중장기)"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "청소년자립지원관": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "학교밖청소년지원센터(꿈드림)"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "청소년치료재활센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년상담복지센터"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "청소년회복지원시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "청소년상담복지센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년상담복지센터"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "학교밖청소년지원센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "학교밖청소년지원센터(꿈드림)"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "꿈드림": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "학교밖청소년지원센터(꿈드림)"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "청소년수련시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년수련관",
            "청소년방과후아카데미"
        ],
        "level1": [
            "청소년 활동 및 역량개발"
        ]
    },
    "청소년수련관": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년수련관"
        ],
        "level1": [
            "청소년 활동 및 역량개발"
        ]
    },
    "청소년방과후아카데미": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년방과후아카데미"
        ],
        "level1": [
            "청소년 활동 및 역량개발"
        ]
    },
    "성폭력상담소": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "성폭력상담소",
            "가정·성폭력피해상담소"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "가정폭력상담소": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "가정·성폭력피해상담소"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "성매매피해상담소": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "성매매피해상담소"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "여성긴급전화 1366": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "여성긴급전화1366"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "가정폭력피해자보호시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "가정폭력피해자보호시설",
            "폭력피해자보호시설"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "스토킹피해자보호시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "폭력피해자보호시설",
            "여성긴급전화1366"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "디지털성범죄피해자지원센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "성폭력상담소",
            "여성긴급전화1366"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "폭력피해이주여성보호시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "폭력피해이주여성보호시설"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "일반지원시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "성매매피해상담소"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "청소년지원시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년쉼터(일시·단기·중장기)"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "외국인지원시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "폭력피해이주여성보호시설"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "자립지원공동생활시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "가정폭력피해자보호시설"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "자활지원센터": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "지역자활센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "지역자활센터": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "지역자활센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "광역자활센터": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "광역자활센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "고용복지플러스센터": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "고용복지플러스센터",
            "고용복지플러스센터(국민취업지원 위탁기관)"
        ],
        "level1": [
            "취업취약계층 고용안전망 (국민취업지원제도)"
        ]
    },
    "한국장애인고용공단": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "직업능력개발원",
            "장애인직업재활시설(보호작업장·근로사업장)"
        ],
        "level1": [
            "장애인 직업재활 및 일자리지원"
        ]
    },
    "근로복지공단": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "고용복지플러스센터"
        ],
        "level1": [
            "취업취약계층 고용안전망 (국민취업지원제도)"
        ]
    },
    "사회적기업": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "광역자활센터",
            "지역자활센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "초·중·고교": {
        "domainId": "10_학교사회복지",
        "facilityTypes": [
            "초·중·고등학교",
            "교육복지우선지원사업 초·중·고등학교"
        ],
        "level1": [
            "학생맞춤형 통합지원 및 사례관리"
        ]
    },
    "교육복지실": {
        "domainId": "10_학교사회복지",
        "facilityTypes": [
            "교육복지우선지원사업 초·중·고등학교"
        ],
        "level1": [
            "학생맞춤형 통합지원 및 사례관리"
        ]
    },
    "학교사회복지실": {
        "domainId": "10_학교사회복지",
        "facilityTypes": [
            "초·중·고등학교"
        ],
        "level1": [
            "학생맞춤형 통합지원 및 사례관리"
        ]
    },
    "Wee센터": {
        "domainId": "10_학교사회복지",
        "facilityTypes": [
            "초·중·고등학교"
        ],
        "level1": [
            "학생맞춤형 통합지원 및 사례관리"
        ]
    },
    "학생맞춤통합지원센터": {
        "domainId": "10_학교사회복지",
        "facilityTypes": [
            "초·중·고등학교"
        ],
        "level1": [
            "학생맞춤형 통합지원 및 사례관리"
        ]
    },
    "행정복지센터": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구 긴급복지지원 전담부서",
            "시·군·구청 복지정책과"
        ],
        "level1": [
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    },
    "희망복지지원단": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구청 복지정책과"
        ],
        "level1": [
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    },
    "지역사회보장협의체": {
        "domainId": "01_사회복지관",
        "facilityTypes": [
            "종합사회복지관"
        ],
        "level1": [
            "지역조직화기능"
        ]
    },
    "사회서비스원": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·도 사회서비스원",
            "시·도 사회서비스원(종합재가센터)"
        ],
        "level1": [
            "공공돌봄지원",
            "의료·요양통합돌봄"
        ]
    },
    "푸드뱅크": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "푸드뱅크·푸드마켓",
            "기초·광역 푸드뱅크 및 푸드마켓"
        ],
        "level1": [
            "지역 물적나눔 및 식품지원"
        ]
    },
    "푸드마켓": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "푸드뱅크·푸드마켓",
            "기초·광역 푸드뱅크 및 푸드마켓"
        ],
        "level1": [
            "지역 물적나눔 및 식품지원"
        ]
    },
    "하나센터": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "하나센터",
            "북한이탈주민지역적응센터(하나센터)"
        ],
        "level1": [
            "북한이탈주민 지역사회 적응지원 (하나센터)"
        ]
    },
    "사회복지공동모금회": {
        "domainId": "12_배분모금국제",
        "facilityTypes": [
            "사회복지공동모금회",
            "사회복지공동모금회(중앙회 및 17개 지회)"
        ],
        "level1": [
            "민간자원 배분 및 복지공모 (사랑의열매)"
        ]
    },
    "사랑의열매": {
        "domainId": "12_배분모금국제",
        "facilityTypes": [
            "사회복지공동모금회"
        ],
        "level1": [
            "민간자원 배분 및 복지공모 (사랑의열매)"
        ]
    },
    "국제구호": {
        "domainId": "12_배분모금국제",
        "facilityTypes": [
            "국제개발협력NGO",
            "KOICA 시민사회협력 수행 NGO/재단"
        ],
        "level1": [
            "국제개발협력 및 글로벌 시민사회 (KOICA)"
        ]
    },
    "KOICA": {
        "domainId": "12_배분모금국제",
        "facilityTypes": [
            "KOICA 시민사회협력 수행 NGO/재단"
        ],
        "level1": [
            "국제개발협력 및 글로벌 시민사회 (KOICA)"
        ]
    },
    "NGO": {
        "domainId": "12_배분모금국제",
        "facilityTypes": [
            "국제개발협력NGO"
        ],
        "level1": [
            "국제개발협력 및 글로벌 시민사회 (KOICA)"
        ]
    },
    "종합사회복지관": {
        "domainId": "01_사회복지관",
        "facilityTypes": [
            "종합사회복지관"
        ],
        "level1": [
            "사례관리기능",
            "서비스제공기능",
            "지역조직화기능"
        ]
    },
    "사회복지관": {
        "domainId": "01_사회복지관",
        "facilityTypes": [
            "종합사회복지관"
        ],
        "level1": [
            "사례관리기능",
            "서비스제공기능",
            "지역조직화기능"
        ]
    },
    "요양병원 · 호스피스 입원형 기관": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설",
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "노인의료 및 주거복지",
            "재가·돌봄지원"
        ]
    },
    "요양병원": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "호스피스": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "상급종합병원 · 종합병원 사회사업팀": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·도 사회서비스원(종합재가센터)",
            "보건소"
        ],
        "level1": [
            "의료·요양통합돌봄",
            "공공돌봄지원"
        ]
    },
    "종합병원 사회사업팀": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·도 사회서비스원(종합재가센터)",
            "보건소"
        ],
        "level1": [
            "의료·요양통합돌봄"
        ]
    },
    "재활병원 · 공공의료원 공공보건의료사업실": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·도 사회서비스원(종합재가센터)",
            "보건소"
        ],
        "level1": [
            "의료·요양통합돌봄"
        ]
    },
    "공공보건의료사업실": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·도 사회서비스원(종합재가센터)",
            "보건소"
        ],
        "level1": [
            "의료·요양통합돌봄"
        ]
    },
    "결핵·한센시설": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설",
            "양로시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "국립소록도병원": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "노인의료 및 주거복지"
        ]
    },
    "산재요양시설": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인직업재활시설(보호작업장·근로사업장)",
            "장애인복지관"
        ],
        "level1": [
            "장애인 직업재활 및 일자리지원"
        ]
    },
    "입원형 산재지정기관": {
        "domainId": "03_장애인복지",
        "facilityTypes": [
            "장애인복지관"
        ],
        "level1": [
            "장애인지역사회재활 및 자립생활"
        ]
    },
    "근로복지공단 산재병원 의료사회사업실 · 직업복귀지원센터": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "고용복지플러스센터"
        ],
        "level1": [
            "취업취약계층 고용안전망 (국민취업지원제도)"
        ]
    },
    "보훈요양원": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "보훈의료복지",
            "노인의료 및 주거복지"
        ]
    },
    "보훈복지타운": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인복지주택",
            "양로시설"
        ],
        "level1": [
            "보훈의료복지",
            "노인주거복지"
        ]
    },
    "주거형": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인복지주택",
            "양로시설"
        ],
        "level1": [
            "노인주거복지"
        ]
    },
    "한국보훈복지의료공단 중앙보훈병원 및 권역별 보훈병원 사회사업팀": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "노인요양시설"
        ],
        "level1": [
            "보훈의료복지"
        ]
    },
    "보훈재가복지센터": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "보훈의료복지",
            "재가·돌봄지원"
        ]
    },
    "보훈섬김이": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "재가·돌봄지원"
        ]
    },
    "보훈복지사 방문 돌봄": {
        "domainId": "02_노인복지",
        "facilityTypes": [
            "재가노인복지시설(주야간보호·방문요양)"
        ],
        "level1": [
            "재가·돌봄지원"
        ]
    },
    "교정시설": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설",
            "청소년쉼터(일시·단기·중장기)"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "교도소": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "구치소 사회복귀과": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "소년원": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "치료감호소": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "정신건강복지센터",
            "정신재활시설"
        ],
        "level1": [
            "정신재활지원",
            "지역사회 정신건강증진 및 사례관리"
        ]
    },
    "국립법무병원": {
        "domainId": "08_정신건강자살예방",
        "facilityTypes": [
            "정신건강복지센터"
        ],
        "level1": [
            "정신재활지원"
        ]
    },
    "전국 준법지원센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설",
            "청소년상담복지센터"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "보호관찰소": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "청소년회복지원시설",
            "청소년상담복지센터"
        ],
        "level1": [
            "위기청소년 안전망 및 보호"
        ]
    },
    "한국법무보호복지공단": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "지역자활센터",
            "고용복지플러스센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "출소자 갱생보호": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "지역자활센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "출소자 갱생보호·주거·취업지원": {
        "domainId": "09_자활고용지원",
        "facilityTypes": [
            "지역자활센터"
        ],
        "level1": [
            "자활지원 및 역량강화 (지역자활센터)"
        ]
    },
    "범죄피해자지원센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "여성긴급전화1366",
            "가정·성폭력피해상담소"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "스마일센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "여성긴급전화1366",
            "폭력피해자보호시설"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "해바라기센터": {
        "domainId": "07_청소년여성권익",
        "facilityTypes": [
            "성폭력상담소",
            "여성긴급전화1366"
        ],
        "level1": [
            "여성폭력피해자 긴급보호 및 권익증진"
        ]
    },
    "읍면동 행정복지센터": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구 긴급복지지원 전담부서",
            "시·군·구청 복지정책과"
        ],
        "level1": [
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    },
    "맞춤형복지팀": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구청 복지정책과"
        ],
        "level1": [
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    },
    "사회복지전담공무원": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구 긴급복지지원 전담부서"
        ],
        "level1": [
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    },
    "시·군·구 희망복지지원단": {
        "domainId": "11_지역보호긴급돌봄",
        "facilityTypes": [
            "시·군·구청 복지정책과"
        ],
        "level1": [
            "긴급위기지원 및 복합돌봄 (공공안전망)"
        ]
    }
};

    function matchHierarchyNodesForFacility(facilityTerm, parentCat, allNodes) {
        if (!facilityTerm) return allNodes;
        const term = String(facilityTerm).trim();
        let clean = term.replace(/^[•\s]+/, '').replace(/\s*\(.*?\)\s*/g, '').trim();
        clean = clean.replace(/(등|포함|연계|제공사업장)\s*$/g, '').trim();

        // 1. Direct rule match
        const rule = FACILITY_MAPPING_RULES[clean] || FACILITY_MAPPING_RULES[term];
        if (rule) {
            const did = rule.domainId;
            const ftypes = rule.facilityTypes || [];
            const l1s = rule.level1 || [];
            const matched = allNodes.filter(n => n.domainId === did && (ftypes.includes(n.facilityType) || l1s.some(l => (n.level1 || '').includes(l))));
            if (matched.length > 0) return matched;
        }

        // 2. Exact or substring match on facilityType
        let m = allNodes.filter(n => (n.facilityType && (n.facilityType.includes(clean) || clean.includes(n.facilityType))));
        if (m.length > 0) return m;

        // 3. Match on level1, level2, or level3
        m = allNodes.filter(n => (n.level1 && n.level1.includes(clean)) || (n.level2 && n.level2.includes(clean)) || (n.level3 && n.level3.includes(clean)));
        if (m.length > 0) return m;

        // 4. Token match
        const tokens = clean.split(/[\s·/]+/).filter(t => t.length >= 2 && !['시설', '지원', '복지', '기관', '센터'].includes(t));
        if (tokens.length > 0) {
            m = allNodes.filter(n => tokens.some(t => (n.facilityType && n.facilityType.includes(t)) || (n.level1 && n.level1.includes(t)) || (n.level2 && n.level2.includes(t)) || (n.level3 && n.level3.includes(t))));
            if (m.length > 0) return m;
        }

        // 5. Parent category fallback
        if (parentCat && parentCat !== facilityTerm) {
            return matchHierarchyNodesForFacility(parentCat, null, allNodes);
        }

        return allNodes;
    }

    function renderFacilityFilterBanner(facilityName, parentCategory, matchedNodes) {
        const bannerEl = document.getElementById('facilityFilterBannerContainer');
        if (!bannerEl) return;
        if (!facilityName) {
            bannerEl.innerHTML = '';
            bannerEl.classList.add('hidden');
            return;
        }
        const count = (matchedNodes || []).length;
        const l1Set = new Set((matchedNodes || []).map(n => n.level1));
        const l2Set = new Set((matchedNodes || []).map(n => n.level2));

        bannerEl.classList.remove('hidden');
        bannerEl.innerHTML = `
            <div id="facility-filter-banner" class="mb-6 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-300/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-fadeIn">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">🏛️</div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider">시설 맞춤 기능·사업 위계</span>
                            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-200">단위서비스 ${count}개</span>
                            <span class="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold border border-teal-200">대분류(기능) ${l1Set.size}개 · 중분류(사업) ${l2Set.size}개</span>
                            ${parentCategory ? `<span class="text-[11px] text-slate-500 font-medium">소속 범주: ${escapeHtml(parentCategory)}</span>` : ''}
                        </div>
                        <h3 class="text-base font-black text-slate-900 mt-1">
                            <span class="text-emerald-700 font-black">${escapeHtml(facilityName)}</span>의 법정 기능(대분류) 및 사업(중분류) 체계도
                        </h3>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button type="button" onclick="window.clearFacilityFilter()" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition cursor-pointer">
                        <span>✕</span><span>전체 위계 보기</span>
                    </button>
                    <button type="button" onclick="showView('fields')" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs transition cursor-pointer">
                        <span>🏛️</span><span>시설도감으로 복귀</span>
                    </button>
                </div>
            </div>
        `;
    }

    window.clearFacilityFilter = function() {
        currentFacilityFilter = null;
        currentParentCategory = null;
        currentDomainFilter = 'all';
        currentMinistryGroup = 'all';
        currentSearchKeyword = '';
        const searchInput = document.getElementById('matrixSearchInput') || document.getElementById('hierarchySearchInput');
        if (searchInput) searchInput.value = '';
        window.location.hash = '#hierarchy';
        applyFilters();
    };

    const DOMAIN_MAP = {
        '01_사회복지관': { key: 'community', icon: 'corporate_fare', short: '종합사회복지관', facilityId: 'law-welfare-center', badge: '3대 핵심기능 (22)', legal: '<span>「사회복지사업법」 제34조의5</span><span>동법 시행규칙 제21조의2</span><span class="text-secondary font-bold">보건복지부 사업안내 제2권</span>' },
        '02_노인복지': { key: 'elder', icon: 'elderly', short: '노인복지·맞춤돌봄', facilityId: 'law-elderly', badge: '맞춤돌봄·여가 (20)', legal: '<span>「노인복지법」 제27조의2·제36조</span><span>「노인장기요양보험법」</span><span class="text-secondary font-bold">노인맞춤돌봄 사업안내</span>' },
        '03_장애인복지': { key: 'disabled', icon: 'accessible_forward', short: '장애인자립·재활', facilityId: 'law-disability', badge: '자립·활동지원 (19)', legal: '<span>「장애인복지법」 제58조·제59조의9</span><span>「발달장애인법」 제33조</span><span class="text-secondary font-bold">장애인복지시설 사업안내</span>' },
        '04_아동돌봄복지': { key: 'child', icon: 'child_care', short: '아동보호·돌봄', facilityId: 'law-child', badge: '학대보호·돌봄 (16)', legal: '<span>「아동복지법」 제37조·제45조</span><span>「아동학대처벌법」 제11조</span><span class="text-secondary font-bold">아동분야 사업안내 1~2권</span>' },
        '05_영유아보육': { key: 'infant', icon: 'child_friendly', short: '영유아·보육지원', facilityId: 'law-childcare', badge: '표준보육·누리 (10)', legal: '<span>「영유아보육법」 제10조·제24조</span><span>유보통합 표준보육과정</span><span class="text-secondary font-bold">보육사업안내</span>' },
        '08_정신건강자살예방': { key: 'mental', icon: 'psychology', short: '정신건강·자살예방', facilityId: 'law-mental', badge: '정신의료재활 (12)', legal: '<span>「정신건강복지법」 제15조</span><span>「자살예방법」 제12조</span><span class="text-secondary font-bold">국가정신건강사업안내</span>' },
        '11_지역보호긴급돌봄': { key: 'crisis', icon: 'shield_person', short: '긴급복지·위기개입', facilityId: 'law-homeless', badge: '신속개입망 (13)', legal: '<span>「긴급복지지원법」 제5조·제8조</span><span>「사회서비스원법」 제10조</span><span class="text-secondary font-bold">긴급지원사업안내</span>' },
        
        // Section II
        '06_가족복지': { key: 'family', icon: 'diversity_1', short: '가족·다문화', facilityId: 'law-family-center', badge: '통합가족 (13)', legal: '<span>「건강가정기본법」 제35조</span><span>「다문화가족지원법」 제12조</span><span class="text-secondary font-bold">여성가족부 가족사업안내</span>' },
        '07_청소년여성권익': { key: 'youth', icon: 'backpack', short: '청소년·여성권익', facilityId: 'law-youth', badge: '상담·보호쉼터 (15)', legal: '<span>「청소년기본법」 제18조</span><span>「가정폭력방지법」 제5조</span><span class="text-secondary font-bold">여성가족부 청소년사업안내</span>' },
        '10_학교사회복지': { key: 'school', icon: 'school', short: '학교사회복지', facilityId: 'law-school', badge: '교육복지우선 (8)', legal: '<span>「초·중등교육법」 제54조</span><span>교육복지우선지원사업 훈령</span><span class="text-secondary font-bold">교육부 운영매뉴얼</span>' },
        '09_자활고용지원': { key: 'selfhelp', icon: 'work_history', short: '자활·일자리', facilityId: 'law-selfreliance', badge: '고용·복지 (10)', legal: '<span>「국민기초생활보장법」 제15조</span><span>구직자 취업촉진법 제6조</span><span class="text-secondary font-bold">고용노동부·복지부 사업안내</span>' },
        '12_배분모금국제': { key: 'donation', icon: 'volunteer_activism', short: '모금·나눔배분', facilityId: 'law-welfare-center', badge: '나눔배분·ODA (9)', legal: '<span>「사회복지공동모금회법」 제20조</span><span>「한국국제협력단법」 제7조</span><span class="text-secondary font-bold">공동모금회 배분사업지침</span>' }
    };

    const SECTION_1_KEYS = ['01_사회복지관', '02_노인복지', '03_장애인복지', '04_아동돌봄복지', '05_영유아보육', '08_정신건강자살예방', '11_지역보호긴급돌봄'];
    const SECTION_2_KEYS = ['06_가족복지', '07_청소년여성권익', '10_학교사회복지', '09_자활고용지원', '12_배분모금국제'];

    function getDB() {
        return {
            nodes: (typeof window !== 'undefined' && window.WELFARE_HIERARCHY_NODES) ? window.WELFARE_HIERARCHY_NODES : []
        };
    }

    window.renderHierarchyView = function (options = {}) {
        const container = document.getElementById('view-hierarchy');
        if (!container) return;

        container.innerHTML = buildHierarchyHTML();
        bindEvents();

        // 1. 도메인 필터 요청 처리 (options.domainKey 또는 options.domainId)
        if (options.domainKey) {
            const btn = document.querySelector(`.domain-tab-btn[onclick*="'${options.domainKey}'"]`);
            if (btn && typeof window.selectDomainFilter === 'function') {
                window.selectDomainFilter(options.domainKey, btn);
            }
        }

        // 1-1. 특정 시설 맞춤 기능·사업 필터링 요청 처리 (options.facility)
        if (options.facility) {
            currentFacilityFilter = options.facility;
            currentParentCategory = options.parentCategory || null;
            currentDomainFilter = 'all';
            currentMinistryGroup = 'all';
            currentSearchKeyword = '';
            const searchInput = document.getElementById('matrixSearchInput') || document.getElementById('hierarchySearchInput');
            if (searchInput) searchInput.value = '';
            applyFilters();
            setTimeout(() => {
                const banner = document.getElementById('facilityFilterBannerContainer');
                if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // 2. 검색 키워드 필터 요청 처리 (options.search)
        if (options.search) {
            const searchInput = document.getElementById('matrixSearchInput') || document.getElementById('hierarchySearchInput');
            if (searchInput) {
                searchInput.value = options.search;
                currentSearchKeyword = options.search.toLowerCase();
                currentDomainFilter = 'all';
                currentMinistryGroup = 'all';
                applyFilters();
            }
        }

        // 3. 특정 노드 하이라이트 및 스크롤 요청 처리 (options.targetNodeId)
        if (options.targetNodeId) {
            setTimeout(() => {
                highlightAndScrollNode(options.targetNodeId);
            }, 200);
        }
    };

    function buildHierarchyHTML() {
        const { nodes } = getDB();
        const sec1Nodes = nodes.filter(n => SECTION_1_KEYS.includes(n.domainId));
        const sec2Nodes = nodes.filter(n => SECTION_2_KEYS.includes(n.domainId));

        return `
            <div class="flex flex-col w-full animate-fadeIn font-body-md text-on-surface pb-16">
                <!-- Top Statutory Context Banner & Page Metadata -->
                <section class="w-full bg-surface-container-low py-space-md border-b border-surface-container">
                    <div class="max-w-7xl mx-auto px-margin flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                        <div class="flex flex-wrap items-center gap-space-sm">
                            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm">
                                <span class="material-symbols-outlined text-[18px]">account_tree</span>
                            </span>
                            <div class="flex items-center gap-space-xs font-label-md text-label-md">
                                <span class="text-primary font-bold">국가법정기준</span>
                                <span class="text-outline-variant">/</span>
                                <span class="text-on-surface-variant">사회복지사업법 제34조의5 및 각 개별법령</span>
                                <span class="text-outline-variant">/</span>
                                <span class="text-on-surface font-semibold">12대 분야 167개 법정단위서비스 위계 매트릭스</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-space-sm font-legal-code text-legal-code">
                            <a class="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-bold border border-primary/20 hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" onclick="showView('archive'); return false;" title="지침서 아카이브 53종 화면 바로가기">
                                <span class="material-symbols-outlined text-[14px] text-secondary">auto_stories</span>
                                <span>공식 지침서 53종 연계 가동중</span>
                                <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </a>
                            <span class="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface text-secondary font-bold shadow-sm">
                                <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>2026년 정부 고시 표준체계 완결본
                            </span>
                            <span class="text-on-surface-variant">코드: MHW-2026-STAT-90</span>
                        </div>
                    </div>
                </section>

                <!-- Administrative Header & Directive Notice -->
                <section class="max-w-7xl mx-auto px-margin pt-space-lg w-full">
                    <div id="facilityFilterBannerContainer" class="hidden mb-6"></div>
                    <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                            <div class="flex flex-col gap-space-xs">
                                <div class="flex items-center gap-space-sm">
                                    <span class="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">Statutory Matrix v2.4</span>
                                    <span class="text-on-surface-variant font-label-sm text-label-sm">보건복지부 · 여성가족부 · 교육부 소관 38종 업무처리지침 연계</span>
                                </div>
                                <h1 class="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">사회복지 3단계 위계 도감 (167개 법정단위서비스 전수 매트릭스)</h1>
                                <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    기관명의 반복 나열을 배제하고, <strong class="text-on-surface font-semibold">[실천분야] → [대분류(법정기능)] → [중분류(사업체계)] → [소분류(단위서비스/실천내용)]</strong>의 공공 행정 계층 구조로 체계화한 대한민국 표준 복지행정 분류표입니다.
                                </p>
                            </div>
                            <div class="flex flex-wrap items-center gap-space-sm shrink-0">
                                <button type="button" class="inline-flex items-center gap-space-xs h-[38px] px-space-md rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold shadow-sm cursor-pointer" onclick="window.print()">
                                    <span class="material-symbols-outlined text-[18px]">print</span>
                                    <span>표 인쇄 / PDF</span>
                                </button>
                                <button type="button" class="inline-flex items-center gap-space-xs h-[38px] px-space-md rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold shadow-sm cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[18px]">table_view</span>
                                    <span>Excel (.csv) 저장</span>
                                </button>
                                <a class="inline-flex items-center gap-space-xs h-[38px] px-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label-md text-label-md font-semibold shadow-sm ring-2 ring-primary/20 group cursor-pointer" onclick="showView('archive'); return false;" title="지침서 아카이브(SCREEN_2)로 즉시 전환">
                                    <span class="material-symbols-outlined text-[18px]">menu_book</span>
                                    <span>지침서 53종 연계 아카이브</span>
                                    <span class="px-1.5 py-0.5 rounded text-[11px] bg-secondary text-on-secondary font-bold ml-0.5">SCREEN_2 직결</span>
                                    <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </div>

                        <!-- 4대 요약 지표 카드 -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs border-t border-surface-container-low">
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">총 법정단위 서비스</span>
                                    <span class="material-symbols-outlined text-primary text-[20px]">dataset</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-primary">167</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">개 단위</span>
                                </div>
                                <span class="font-legal-code text-legal-code text-secondary font-semibold">● 12개 실천분야 전수 등재</span>
                            </div>
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">소관 정부부처</span>
                                    <span class="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-primary">6</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">개 부처·기구</span>
                                </div>
                                <span class="font-legal-code text-legal-code text-on-surface-variant">복지부·여가부·교육부 등</span>
                            </div>
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">법정 실천분야</span>
                                    <span class="material-symbols-outlined text-secondary text-[20px]">view_comfy</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-secondary">12</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">대 핵심영역</span>
                                </div>
                                <span class="font-legal-code text-legal-code text-on-surface-variant">보건복지 7 + 범부처 5</span>
                            </div>
                            <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-xs shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">위계도감 데이터 패키지</span>
                                    <span class="material-symbols-outlined text-primary text-[20px]">download_for_offline</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="font-headline-lg text-headline-lg font-extrabold text-primary">2026</span>
                                    <span class="font-label-md text-label-md text-on-surface-variant font-semibold">정례개정판</span>
                                </div>
                                <a class="font-legal-code text-legal-code text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[14px]">download</span>
                                    <span>원클릭 CSV 내려받기</span>
                                </a>
                            </div>
                        </div>

                        <!-- 안내문 박스 -->
                        <div class="bg-surface-container-low rounded-lg p-space-md flex items-start gap-space-md">
                            <span class="material-symbols-outlined text-primary text-[24px] mt-0.5 shrink-0">info</span>
                            <div class="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                                <div class="font-headline-sm text-headline-sm text-on-surface font-bold">■ 법정 표준 행정 지침 고시 기준 안내</div>
                                <p class="leading-normal">
                                    1. 본 위계 매트릭스는 <span class="text-primary font-semibold">「사회복지사업법 시행규칙」 제21조의2</span>(사회복지관의 사업 등), <span class="text-primary font-semibold">「노인복지법」</span>, <span class="text-primary font-semibold">「장애인복지법」</span> 등 소관 법령 및 2026년도 보건복지부 공식 사업안내 지침을 기준으로 전수 정리되었습니다.
                                </p>
                                <p class="leading-normal">
                                    2. 종전의 불필요한 시설 단어 중복을 완전히 제거하고, 상위 기능에 하위 서비스를 종속시키는 계층형 그리드(Rowspan Grouping)를 적용하여 실습생, 수련생, 종사자의 서비스 포트폴리오 산출과 사업계획서 작성을 즉각 지원합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Live Filters & Standard Domain Selector Strip -->
                <section class="max-w-7xl mx-auto px-margin pt-space-lg w-full">
                    <div class="flex flex-col gap-space-md">
                        <!-- Search & Realtime Counts Bar -->
                        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
                            <div class="relative flex-1 max-w-xl">
                                <span class="absolute left-space-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
                                <input 
                                    type="text" 
                                    id="matrixSearchInput" type="search" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="실천분야, 법정기능, 세부사업명, 단위서비스 키워드 검색" 
                                    class="w-full h-10 pl-11 pr-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface focus:shadow-inner" 
                                    placeholder="실천분야, 법정기능, 세부사업명, 단위서비스 키워드 검색 (예: Intake, 주간보호, 사례관리, 돌봄)"
                                />
                            </div>
                            <div class="flex items-center gap-space-sm font-legal-code text-legal-code text-on-surface-variant">
                                <span class="px-space-sm py-1 rounded bg-surface-container font-bold text-primary" id="displayCountTag">
                                    전체 12개 실천분야 / 167개 법정단위서비스 수록
                                </span>
                                <span class="hidden sm:inline text-outline-variant">|</span>
                                <button type="button" class="text-secondary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer" onclick="window.resetHierarchyFilters()">
                                    <span class="material-symbols-outlined text-[14px]">refresh</span> 초기화
                                </button>
                            </div>
                        </div>

                        <!-- 2단 부처 및 분야 탭 -->
                        <div class="w-full bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
                            <div class="flex flex-col md:flex-row md:items-center justify-between pb-space-xs border-b border-surface-container gap-space-xs">
                                <div class="flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
                                    <span class="material-symbols-outlined text-[20px]">account_balance</span>
                                    <span>소관 중앙부처 및 주관 주체별 12대 실천분야 필터</span>
                                </div>
                                <div class="flex items-center gap-space-sm font-legal-code text-legal-code text-on-surface-variant">
                                    <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary"></span>부처별 일괄 조회</span>
                                    <span>•</span>
                                    <span id="currentActiveFilterName">단위 실천분야 단독 필터링 지원</span>
                                </div>
                            </div>

                            <!-- 부처 탭 (오른쪽 잘림 방지: flex-wrap 자연스러운 줄바꿈) -->
                            <div class="flex flex-wrap items-center gap-2 pb-space-xs border-b border-surface-container-low" id="ministryGroupTabs">
                                <button type="button" class="ministry-btn active px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all bg-primary text-on-primary shadow-sm flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('all', this)">
                                    <span class="material-symbols-outlined text-[16px]">apps</span>
                                    <span>전체 부처 (12대 분야 · 167개 단위)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mohw', this)">
                                    <span class="material-symbols-outlined text-[16px]">health_and_safety</span>
                                    <span>보건복지부 (7대 분야 · 112개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('mogef', this)">
                                    <span class="material-symbols-outlined text-[16px]">family_restroom</span>
                                    <span>여성가족부 (2대 분야 · 28개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moe', this)">
                                    <span class="material-symbols-outlined text-[16px]">school</span>
                                    <span>교육부 (1대 분야 · 8개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('moel', this)">
                                    <span class="material-symbols-outlined text-[16px]">work</span>
                                    <span>고용노동부·복지부공동 (1대 분야 · 10개)</span>
                                </button>
                                <button type="button" class="ministry-btn px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" onclick="window.selectMinistryGroup('civic', this)">
                                    <span class="material-symbols-outlined text-[16px]">volunteer_activism</span>
                                    <span>제3섹터·공동모금회 (1대 분야 · 9개)</span>
                                </button>
                            </div>

                            <!-- 세부 분야 버튼 그룹 -->
                            <div class="flex flex-col gap-space-sm" id="ministryGroupContainer">
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="mohw">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-primary text-on-primary font-legal-code text-legal-code font-bold">보건복지부</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">7개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn active px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-bold bg-primary text-on-primary transition-all shadow-sm cursor-pointer" onclick="window.selectDomainFilter('all', this)">보건복지부 전체</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('community', this)">🏢 종합사회복지관 (22)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('elder', this)">👴 노인복지·맞춤돌봄 (20)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('disabled', this)">♿ 장애인자립·재활 (19)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('child', this)">🧒 아동보호·돌봄 (16)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('infant', this)">🍼 영유아·보육지원 (10)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('mental', this)">🧠 정신건강·자살예방 (12)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('crisis', this)">🛡️ 긴급복지·위기개입 (13)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="mogef">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-secondary text-on-secondary font-legal-code text-legal-code font-bold">여성가족부</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">2개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('family', this)">🏠 가족·다문화 (13)</button>
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('youth', this)">🎒 청소년·여성권익 (15)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="moe">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-legal-code text-legal-code font-bold">교육부</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">1개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('school', this)">🏫 학교사회복지 (8)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="moel">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-tertiary text-on-tertiary font-legal-code text-legal-code font-bold">고용·복지</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">1개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('selfhelp', this)">💼 자활·일자리 (10)</button>
                                    </div>
                                </div>
                                <div class="ministry-subgroup flex flex-col md:flex-row md:items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low transition-colors" data-ministry="civic">
                                    <div class="flex items-center gap-space-xs shrink-0 w-[140px]">
                                        <span class="px-space-xs py-0.5 rounded bg-surface-variant text-on-surface font-legal-code text-legal-code font-bold">제3섹터</span>
                                        <span class="font-legal-code text-legal-code text-on-surface-variant font-medium">1개 분야</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-1.5 flex-1">
                                        <button type="button" class="domain-tab-btn px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer" onclick="window.selectDomainFilter('donation', this)">🤝 모금·나눔배분 (9)</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Core Table Matrix Section (Clean Administrative Rowspan Architecture) -->
                <section class="max-w-7xl mx-auto px-margin pt-space-md pb-space-xl w-full flex flex-col gap-space-xl">
                    <!-- 모바일 스마트 카드 뷰 (md:hidden) -->
                    <div class="block md:hidden w-full flex flex-col gap-space-sm mb-space-xs">
                        <div class="p-space-sm rounded-xl bg-primary text-on-primary shadow-sm flex items-center justify-between">
                            <div class="flex items-center gap-space-xs">
                                <span class="material-symbols-outlined text-[20px]">phone_android</span>
                                <div class="flex flex-col">
                                    <span class="font-label-sm text-label-sm font-bold">모바일 최적화 위계 탐색 모드</span>
                                    <span class="font-legal-code text-legal-code text-on-primary-container">167개 단위서비스 스마트 카드 뷰</span>
                                </div>
                            </div>
                            <a class="px-space-sm py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center gap-0.5 cursor-pointer" onclick="showView('archive'); return false;">
                                <span>지침서 53종</span>
                                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </a>
                        </div>
                        <div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
                            <span>※ 터치하여 세부 사업내용과 매핑 서식을 확인하세요</span>
                            <span class="text-primary font-bold">총 167개 전수</span>
                        </div>
                    </div>

                    <!-- 모바일 카드 목록 컨테이너 -->
                    <div class="block md:hidden flex flex-col gap-space-sm w-full" id="mobileCardsContainer">
                        ${renderMobileCards(nodes)}
                    </div>

                    <!-- 데스크톱 섹션 Ⅰ: 보건복지부 소관 7개 실천분야 -->
                    <div class="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-surface-container hidden md:block" id="section1Container">
                        <div class="px-space-lg py-space-md bg-surface-container-high flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container">
                            <div class="flex flex-wrap items-center gap-space-sm">
                                <span class="px-space-sm py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold">섹션 Ⅰ</span>
                                <h2 class="font-headline-sm text-headline-sm text-primary font-extrabold">중앙 정부부처 핵심 법정단위 서비스 (보건복지부 소관 7개 실천분야)</h2>
                                <span class="px-space-xs py-0.5 rounded bg-surface font-semibold text-secondary font-legal-code text-legal-code font-num">${sec1Nodes.length}개 단위서비스 직결</span>
                            </div>
                            <div class="flex items-center gap-space-xs">
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.print()">
                                    <span class="material-symbols-outlined text-[16px]">print</span>
                                    <span>인쇄</span>
                                </button>
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[16px]">download</span>
                                    <span>CSV</span>
                                </button>
                            </div>
                        </div>
                        <div class="overflow-x-auto w-full">
                            <table class="w-full text-left border-collapse table-fixed min-w-[1080px]" id="hierarchicalMatrixTable">
                                <caption class="sr-only">사회복지 3단계 위계 도감 (중앙정부부처 핵심 법정단위 서비스)</caption>
                                <colgroup>
                                    <col class="w-[18%]">
                                    <col class="w-[18%]">
                                    <col class="w-[20%]">
                                    <col class="w-[28%]">
                                    <col class="w-[16%]">
                                </colgroup>
                                <thead>
                                    <tr class="bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider">
                                        <th class="py-space-md px-space-md font-bold" scope="col">1단계: 실천분야 및 법적근거</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">2단계: 대분류 (기능)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">3단계: 중분류 (사업분야)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">소분류 (사업 및 세부내용)</th>
                                        <th class="py-space-md px-space-md font-bold text-center" scope="col">공식지침서 / 법정서식</th>
                                    </tr>
                                </thead>
                                <tbody class="font-body-md text-body-md divide-y divide-surface-container">
                                    ${renderDesktopTableRows(sec1Nodes, SECTION_1_KEYS)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 데스크톱 섹션 Ⅱ: 범부처 및 공공기관 5개 실천분야 -->
                    <div class="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-surface-container hidden md:block" id="section2Container">
                        <div class="px-space-lg py-space-md bg-surface-container-high flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container">
                            <div class="flex flex-wrap items-center gap-space-sm">
                                <span class="px-space-sm py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">섹션 Ⅱ</span>
                                <h2 class="font-headline-sm text-headline-sm text-primary font-extrabold">범부처 및 특화·전문 실천단위 서비스 (여성가족부·고용노동부·교육부·제3섹터 5개 실천분야)</h2>
                                <span class="px-space-xs py-0.5 rounded bg-surface font-semibold text-secondary font-legal-code text-legal-code font-num">${sec2Nodes.length}개 단위서비스 직결</span>
                            </div>
                            <div class="flex items-center gap-space-xs">
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.print()">
                                    <span class="material-symbols-outlined text-[16px]">print</span>
                                    <span>인쇄</span>
                                </button>
                                <button type="button" class="inline-flex items-center gap-0.5 px-space-sm py-1 rounded bg-surface text-on-surface hover:bg-surface-container transition-colors font-label-sm text-label-sm font-semibold cursor-pointer" onclick="window.exportHierarchyCSV()">
                                    <span class="material-symbols-outlined text-[16px]">download</span>
                                    <span>CSV</span>
                                </button>
                            </div>
                        </div>
                        <div class="overflow-x-auto w-full">
                            <table class="w-full text-left border-collapse table-fixed min-w-[1080px]" id="hierarchicalMatrixTable2">
                                <caption class="sr-only">사회복지 3단계 위계 도감 (범부처 및 특화·전문 실천단위 서비스)</caption>
                                <colgroup>
                                    <col class="w-[18%]">
                                    <col class="w-[18%]">
                                    <col class="w-[20%]">
                                    <col class="w-[28%]">
                                    <col class="w-[16%]">
                                </colgroup>
                                <thead>
                                    <tr class="bg-tertiary text-on-tertiary font-label-md text-label-md uppercase tracking-wider">
                                        <th class="py-space-md px-space-md font-bold" scope="col">1단계: 실천분야 및 소관부처</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">2단계: 대분류 (기능)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">3단계: 중분류 (사업분야)</th>
                                        <th class="py-space-md px-space-md font-bold" scope="col">소분류 (사업 및 세부내용)</th>
                                        <th class="py-space-md px-space-md font-bold text-center" scope="col">공식지침서 / 법정서식</th>
                                    </tr>
                                </thead>
                                <tbody class="font-body-md text-body-md divide-y divide-surface-container">
                                    ${renderDesktopTableRows(sec2Nodes, SECTION_2_KEYS)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 하단 패키지 배너 -->
                    <div class="bg-surface-container-low rounded-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg border border-surface-container">
                        <div class="flex items-center gap-space-md">
                            <div class="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-[28px]">library_books</span>
                            </div>
                            <div class="flex flex-col gap-0.5">
                                <span class="font-headline-sm text-headline-sm font-bold text-primary">3단계 위계도감 및 업무처리지침 일체 패키지</span>
                                <p class="font-body-sm text-body-sm text-on-surface-variant">2026년 기준 전국 167개 법정단위서비스 분류체계와 연결된 지침서 53종 연계표(PDF·CSV·JSON)를 일괄 다운로드할 수 있습니다.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-space-sm shrink-0">
                            <button type="button" class="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-highest text-primary hover:bg-surface-container font-label-md text-label-md font-bold transition-colors shadow-sm cursor-pointer" onclick="window.print()">
                                <span class="material-symbols-outlined text-[18px]">print</span>
                                <span>인쇄용 출력</span>
                            </button>
                            <button type="button" class="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold transition-colors shadow-sm ring-2 ring-primary/20 cursor-pointer" onclick="window.exportHierarchyCSV()">
                                <span class="material-symbols-outlined text-[18px]">download</span>
                                <span>일괄 데이터 다운로드</span>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- 비교 및 행정 규격 안내 카드 3종 -->
                <section class="max-w-7xl mx-auto px-margin pb-space-xl w-full">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                            <div class="flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
                                <span class="material-symbols-outlined text-[20px]">gavel</span>
                                <span>법정 근거 연계성</span>
                            </div>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">
                                단순 민간 실천명칭이 아닌 시행규칙 및 고시에 명시된 공식 [법정기능/대분류] 기준을 엄격 준수하여 평가 인증 지표와 100% 일치합니다.
                            </p>
                        </div>
                        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                            <div class="flex items-center gap-space-xs font-label-md text-label-md text-secondary font-bold">
                                <span class="material-symbols-outlined text-[20px]">view_column</span>
                                <span>Rowspan 행 병합 가독성</span>
                            </div>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">
                                기관명이 매 행 반복되어 발생하는 시각적 피로를 방지하고, 상위 분류 1개 셀에 복수의 단위서비스를 종속 정렬하여 행정 위계를 직관화했습니다.
                            </p>
                        </div>
                        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                            <div class="flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
                                <span class="material-symbols-outlined text-[20px]">folder_special</span>
                                <span>서식 및 실무 지침 매핑</span>
                            </div>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">
                                각 소분류 행마다 주관 부처의 공식 업무매뉴얼 페이지 및 사용 법정 서식 번호를 직결 표기하여 실습생과 실무자의 행정 편의를 극대화했습니다.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- 모바일 하단 플로팅 바 (block md:hidden) -->
                <div class="block md:hidden fixed bottom-3 left-3 right-3 z-40 bg-surface/95 backdrop-blur-md rounded-xl p-space-sm shadow-lg border border-primary/20">
                    <div class="flex items-center justify-between gap-space-xs">
                        <div class="flex items-center gap-space-xs flex-1">
                            <div class="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-[18px]">menu_book</span>
                            </div>
                            <div class="flex flex-col leading-tight">
                                <span class="font-label-sm text-label-sm font-bold text-primary">53종 지침서 연계</span>
                                <span class="font-legal-code text-legal-code text-on-surface-variant">SCREEN_2 즉시 이동</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-space-xs shrink-0">
                            <button type="button" onclick="window.exportHierarchyCSV()" class="px-space-sm py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-0.5 cursor-pointer">
                                <span class="material-symbols-outlined text-[16px]">download</span>
                                <span>CSV</span>
                            </button>
                            <a class="px-space-sm py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-0.5 shadow-sm cursor-pointer" onclick="showView('archive'); return false;">
                                <span>아카이브</span>
                                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Rowspan 셀 병합 계산 엔진 (데스크톱)
     */
    function renderDesktopTableRows(nodes, domainKeys) {
        let html = '';

        domainKeys.forEach(domainId => {
            const domainNodes = nodes.filter(n => n.domainId === domainId);
            if (domainNodes.length === 0) return;

            const domainMeta = DOMAIN_MAP[domainId] || { key: 'misc', icon: 'corporate_fare', short: domainId, badge: `${domainNodes.length}단위`, legal: '' };
            const domainRowspan = domainNodes.length;

            // Group by level1
            const level1Groups = {};
            domainNodes.forEach(n => {
                if (!level1Groups[n.level1]) level1Groups[n.level1] = [];
                level1Groups[n.level1].push(n);
            });

            let isFirstRowOfDomain = true;

            Object.keys(level1Groups).forEach(l1Key => {
                const l1Nodes = level1Groups[l1Key];
                const level1Rowspan = l1Nodes.length;
                let isFirstRowOfL1 = true;

                // Group by level2 (중분류 Rowspan 병합)
                const level2Groups = {};
                const level2Order = [];
                l1Nodes.forEach(n => {
                    if (!level2Groups[n.level2]) {
                        level2Groups[n.level2] = [];
                        level2Order.push(n.level2);
                    }
                    level2Groups[n.level2].push(n);
                });

                level2Order.forEach(l2Key => {
                    const l2Nodes = level2Groups[l2Key];
                    const level2Rowspan = l2Nodes.length;
                    let isFirstRowOfL2 = true;

                    l2Nodes.forEach(node => {
                        const rowId = `hierarchy-node-${node.id}`;
                        const searchKeywords = `${domainMeta.short} ${node.level1} ${node.level2} ${node.level3} ${(node.details || []).join(' ')} ${(node.guidelineRef && node.guidelineRef.file) || ''}`.toLowerCase();

                        html += `<tr id="${rowId}" class="domain-row group hover:bg-surface-container-low transition-colors" data-domain="${domainMeta.key}" data-keywords="${searchKeywords}">`;

                        // 1열: 실천분야 및 법적근거 (Rowspan)
                        if (isFirstRowOfDomain) {
                            html += `
                                <td class="align-top p-space-md bg-surface-container-lowest font-headline-sm text-headline-sm text-primary font-bold border-r border-outline-variant/30" rowspan="${domainRowspan}">
                                    <div class="sticky top-36 flex flex-col gap-space-xs">
                                        <div class="inline-flex items-center gap-space-xs text-primary">
                                            <span class="material-symbols-outlined text-[22px]">${domainMeta.icon}</span>
                                            <span>${domainMeta.short}</span>
                                        </div>
                                        <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm w-fit font-bold font-num">
                                            ${domainMeta.badge}
                                        </span>
                                        <div class="font-legal-code text-legal-code text-on-surface-variant flex flex-col gap-0.5 mt-space-xs">
                                            ${domainMeta.legal}
                                        </div>
                                        <!-- 3대 영역 순환 딥링크 바 -->
                                        <div class="mt-2.5 pt-2 border-t border-outline-variant/20 flex flex-col gap-1">
                                            <button type="button" onclick="window.jumpToFacility('${domainMeta.facilityId || 'law-welfare-center'}')"
                                               class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-900 border border-amber-200/80 text-[11px] font-bold transition shadow-2xs group cursor-pointer"
                                               title="${domainMeta.short} 법정시설 규정 도감으로 직결">
                                                <span class="material-symbols-outlined text-[13px] text-amber-700 group-hover:text-white">account_balance</span>
                                                <span>법정시설 도감 ➔</span>
                                            </button>
                                            <button type="button" onclick="showView(\'archive\', { search: \'${domainMeta.short}\' })" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface-variant text-[11px] font-bold transition shadow-2xs group cursor-pointer" title="${domainMeta.short} 관련 공식 정본 지침서로 이동">
                                                <span class="material-symbols-outlined text-[13px] text-secondary group-hover:text-on-secondary">menu_book</span>
                                                <span>관련 지침서 총람 ➔</span>
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            `;
                            isFirstRowOfDomain = false;
                        }

                        // 2열: 2단계 대분류 (기능) (Rowspan)
                        if (isFirstRowOfL1) {
                            html += `
                                <td class="align-top p-space-md bg-surface-container-low font-headline-sm text-headline-sm text-on-surface font-bold border-r border-outline-variant/30" rowspan="${level1Rowspan}">
                                    <div class="flex flex-col gap-space-xs">
                                        <span class="text-primary font-extrabold flex items-center gap-1">
                                            <span class="w-2 h-2 rounded-full bg-primary"></span>
                                            ${node.level1}
                                        </span>
                                        <button type="button"
                                                onclick="window.jumpToFacilityByTerm('${escapeHtml(node.facilityType || '')}'); return false;"
                                                class="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded bg-surface hover:bg-emerald-100 hover:text-emerald-800 text-on-surface-variant text-[11px] font-semibold transition cursor-pointer text-left w-fit border border-outline-variant/30"
                                                title="'${escapeHtml(node.facilityType || '')}'의 법정 시설도감 행으로 이동">
                                            <span>🏛️</span>
                                            <span>${escapeHtml(node.facilityType || '법정 실천기준')}</span>
                                        </button>
                                    </div>
                                </td>
                            `;
                            isFirstRowOfL1 = false;
                        }

                        // 3열: 3단계 중분류 (사업분야) (Rowspan 계층 병합)
                        if (isFirstRowOfL2) {
                            html += `
                                <td class="align-top p-space-md font-label-md text-label-md text-on-surface font-semibold bg-surface-container-lowest border-r border-outline-variant/30" rowspan="${level2Rowspan}">
                                    <div class="flex flex-col gap-1.5">
                                        <span class="text-on-surface font-bold text-[14px] leading-snug">${node.level2}</span>
                                        ${level2Rowspan > 1 ? `<span class="inline-flex items-center gap-1 w-fit text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold font-num"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>${level2Rowspan}개 세부사업</span>` : ''}
                                    </div>
                                </td>
                            `;
                            isFirstRowOfL2 = false;
                        }

                        // 4열: 소분류 (사업 및 세부내용)
                        const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];
                        html += `
                            <td class="align-top p-space-md text-on-surface font-body-sm text-body-sm leading-relaxed bg-surface-container-lowest border-r border-outline-variant/30">
                                <div class="font-bold text-on-surface mb-1">${node.level3}</div>
                                <ul class="space-y-1">
                                    ${bullets.map(b => `
                                        <li class="flex items-start gap-1.5">
                                            <span class="text-primary mt-1 text-[10px]">●</span>
                                            <span>${b}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </td>
                        `;

                        // 5열: 공식지침서 / 법정서식
                        const gRef = node.guidelineRef || { file: '공식 업무안내', chapter: '사업안내', page: '', archiveId: 'doc-004' };
                        const cleanFile = gRef.file.replace(/\.(pdf|hwp|hwpx|xlsx)$/i, '').replace(/^[0-9]+_/, '');
                        const shortFile = cleanFile.length > 18 ? cleanFile.slice(0, 18) + '…' : cleanFile;
                        const cleanChapter = (gRef.chapter || '').split('(')[0].replace(/^[ⅠⅡⅢⅣ0-9\.\-\s]+/, '').trim();
                        const formText = cleanChapter ? cleanChapter.slice(0, 16) : '법정서식 수록';

                        html += `
                            <td class="align-top p-space-md text-center bg-surface-container-lowest">
                                <div class="flex flex-col items-center gap-1 font-legal-code text-legal-code text-on-surface-variant relative group/gpopover">
                                    <span class="font-bold text-on-surface" title="${gRef.file}">${shortFile}</span>
                                    <span class="px-space-xs py-0.5 rounded bg-surface-container text-primary font-medium">${formText}</span>
                                    <span class="font-num text-[11px]">${gRef.page || ''}</span>
                                    <button
                                        type="button"
                                        onclick="window.jumpToArchive('${gRef.archiveId || 'doc-004'}')"
                                        class="mt-1 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
                                        title="${gRef.file} 원문 아카이브 열람"
                                    >
                                        <span>지침서 열람</span>
                                        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>

                                    <!-- 지침서 인터랙티브 미니 팝오버 프리뷰 -->
                                    <div class="hidden group-hover/gpopover:flex flex-col text-left absolute z-40 bottom-full mb-1.5 right-0 w-64 p-3 rounded-xl bg-surface-container-highest/95 backdrop-blur-md text-on-surface shadow-lg border border-outline-variant/30 text-xs pointer-events-none animate-fadeIn">
                                        <div class="flex items-center gap-1 text-primary font-bold mb-1">
                                            <span class="material-symbols-outlined text-[15px]">menu_book</span>
                                            <span class="truncate">${cleanFile}</span>
                                        </div>
                                        <div class="text-[11px] text-on-surface-variant space-y-0.5">
                                            <p><span class="font-semibold text-on-surface">근거 챕터:</span> ${gRef.chapter || '총칙'}</p>
                                            <p><span class="font-semibold text-on-surface">해당 면수:</span> ${gRef.page || '상세 규정'}</p>
                                            <p class="text-secondary font-medium pt-1">클릭 시 53종 공식 아카이브 해당 지침서로 직결 이동</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        `;
                        html += `</tr>`;
                    });
                });
            });
        });

        return html;
    }

    /**
     * 모바일 스마트 카드 렌더러
     */
    function renderMobileCards(nodes) {
        return nodes.map(node => {
            const domainMeta = DOMAIN_MAP[node.domainId] || { key: 'misc', icon: 'corporate_fare', short: node.domainId };
            const ministryName = SECTION_1_KEYS.includes(node.domainId) ? '보건복지부' : '관계부처';
            const bullets = (node.details && node.details.length > 0) ? node.details : [node.summary || ''];
            const gRef = node.guidelineRef || { file: '공식 업무안내', page: '', archiveId: 'doc-004' };

            return `
                <div id="mobile-card-${node.id}" class="bg-surface-container-lowest border border-surface-container rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm" data-domain="${domainMeta.key}">
                    <div class="flex items-center justify-between border-b border-surface-container pb-space-xs">
                        <div class="flex items-center gap-space-xs">
                            <span class="material-symbols-outlined text-primary text-[20px]">${domainMeta.icon}</span>
                            <span class="font-headline-sm text-headline-sm font-bold text-primary">${domainMeta.short}</span>
                        </div>
                        <span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
                            ${ministryName}
                        </span>
                    </div>
                    <div class="flex flex-col gap-space-xs">
                        <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                            <div class="flex items-center justify-between flex-wrap gap-1">
                                <span class="font-label-md text-label-md font-bold text-primary flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    ${node.level1} ➔ ${node.level2}
                                </span>
                                ${node.facilityType ? `
                                    <button type="button"
                                            onclick="window.jumpToFacilityByTerm('${escapeHtml(node.facilityType)}'); return false;"
                                            class="px-2 py-0.5 rounded bg-surface-container hover:bg-emerald-100 text-on-surface-variant hover:text-emerald-800 text-[10px] font-bold border border-outline-variant/30 transition cursor-pointer"
                                            title="'${escapeHtml(node.facilityType)}' 시설도감 행으로 이동">
                                        🏛️ ${escapeHtml(node.facilityType)}
                                    </button>
                                ` : ''}
                            </div>
                            <div class="bg-surface-container-lowest p-space-xs rounded border border-surface-container flex flex-col gap-1">
                                <span class="font-label-sm text-label-sm font-bold text-on-surface">${node.level3}</span>
                                <div class="font-body-sm text-body-sm text-on-surface-variant space-y-0.5">
                                    ${bullets.map(b => `<div>• ${b}</div>`).join('')}
                                </div>
                                <div class="flex items-center justify-between pt-1 border-t border-surface-container-low">
                                    <span class="font-legal-code text-legal-code text-secondary font-semibold font-num">
                                        지침 ${gRef.page || ''}
                                    </span>
                                    <button 
                                        type="button" 
                                        onclick="window.jumpToArchive('${gRef.archiveId || 'doc-004'}')" 
                                        class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-legal-code text-legal-code font-bold flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <span>지침서</span>
                                        <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function bindEvents() {
        const input = document.getElementById('matrixSearchInput');
        if (input) {
            input.addEventListener('keyup', filterMatrixTable);
        }
    }

    // 필터링 인터랙션 로직
    window.selectDomainFilter = function (domainKey, buttonElement) {
        currentDomainFilter = domainKey;
        const buttons = document.querySelectorAll('.domain-tab-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-on-primary', 'font-bold', 'shadow-sm');
            btn.classList.add('bg-surface-container', 'text-on-surface-variant', 'font-medium');
        });
        if (buttonElement) {
            buttonElement.classList.add('bg-primary', 'text-on-primary', 'font-bold', 'shadow-sm');
            buttonElement.classList.remove('bg-surface-container', 'text-on-surface-variant', 'font-medium');
        }

        applyFilters();
    };

    window.selectMinistryGroup = function (minKey, buttonElement) {
        currentMinistryGroup = minKey;
        const minButtons = document.querySelectorAll('.ministry-btn');
        minButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
            btn.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        if (buttonElement) {
            buttonElement.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
            buttonElement.classList.remove('bg-surface-container', 'text-on-surface-variant');
        }

        const subgroups = document.querySelectorAll('.ministry-subgroup');
        subgroups.forEach(sg => {
            const sgMin = sg.getAttribute('data-ministry');
            if (minKey === 'all' || sgMin === minKey) {
                sg.style.display = '';
            } else {
                sg.style.display = 'none';
            }
        });

        applyFilters();
    };

    function filterMatrixTable() {
        currentSearchKeyword = (document.getElementById('matrixSearchInput')?.value || '').toLowerCase().trim();
        applyFilters();
    }

    function applyFilters() {
        const allNodes = getDB().nodes;
        let baseNodes = allNodes;

        if (currentFacilityFilter) {
            baseNodes = matchHierarchyNodesForFacility(currentFacilityFilter, currentParentCategory, allNodes);
            renderFacilityFilterBanner(currentFacilityFilter, currentParentCategory, baseNodes);
        } else {
            renderFacilityFilterBanner(null);
        }

        const matchNode = (node) => {
            const domainMeta = DOMAIN_MAP[node.domainId] || { key: 'misc', short: node.domainId };
            const d = domainMeta.key;

            // Ministry match
            let minMatch = true;
            if (currentMinistryGroup === 'mohw') {
                minMatch = ['community', 'elder', 'disabled', 'child', 'infant', 'mental', 'crisis'].includes(d);
            } else if (currentMinistryGroup === 'mogef') {
                minMatch = ['family', 'youth'].includes(d);
            } else if (currentMinistryGroup === 'moe') {
                minMatch = ['school'].includes(d);
            } else if (currentMinistryGroup === 'moel') {
                minMatch = ['selfhelp'].includes(d);
            } else if (currentMinistryGroup === 'civic') {
                minMatch = ['donation'].includes(d);
            }

            // Domain match
            let domMatch = (currentDomainFilter === 'all') || (d === currentDomainFilter);

            // Search keyword match
            const k = `${domainMeta.short} ${node.level1} ${node.level2} ${node.level3} ${(node.details || []).join(' ')} ${(node.guidelineRef && node.guidelineRef.file) || ''}`.toLowerCase();
            let kwMatch = !currentSearchKeyword || k.includes(currentSearchKeyword);

            return minMatch && domMatch && kwMatch;
        };

        const filteredNodes = baseNodes.filter(matchNode);

        // Re-render Section 1 table
        const tbody1 = document.querySelector('#hierarchicalMatrixTable tbody');
        if (tbody1) {
            tbody1.innerHTML = renderDesktopTableRows(filteredNodes, SECTION_1_KEYS);
        }

        // Re-render Section 2 table
        const tbody2 = document.querySelector('#hierarchicalMatrixTable2 tbody');
        if (tbody2) {
            tbody2.innerHTML = renderDesktopTableRows(filteredNodes, SECTION_2_KEYS);
        }

        // Re-render mobile cards
        const mobContainer = document.getElementById('mobileCardsContainer');
        if (mobContainer) {
            mobContainer.innerHTML = renderMobileCards(filteredNodes);
        }

        const sec1Card = document.getElementById('section1Container');
        const sec2Card = document.getElementById('section2Container');
        const sec1HasVisible = filteredNodes.some(n => SECTION_1_KEYS.includes(n.domainId));
        const sec2HasVisible = filteredNodes.some(n => SECTION_2_KEYS.includes(n.domainId));

        if (sec1Card) sec1Card.style.display = sec1HasVisible ? '' : 'none';
        if (sec2Card) sec2Card.style.display = sec2HasVisible ? '' : 'none';

        // Update tag
        const tag = document.getElementById('displayCountTag');
        if (tag) {
            if (currentSearchKeyword) {
                tag.textContent = `검색 결과: ${filteredNodes.length}개 단위서비스 일치`;
            } else if (currentDomainFilter !== 'all' || currentMinistryGroup !== 'all') {
                tag.textContent = `필터링 표시 중 (${filteredNodes.length}개 단위서비스)`;
            } else {
                tag.textContent = `전체 12개 실천분야 / ${allNodes.length}개 법정단위서비스 수록`;
            }
        }
    }

    window.resetHierarchyFilters = function () {
        const input = document.getElementById('matrixSearchInput');
        if (input) input.value = '';
        currentSearchKeyword = '';
        currentDomainFilter = 'all';
        currentMinistryGroup = 'all';

        const firstTab = document.querySelector('.domain-tab-btn');
        if (firstTab) window.selectDomainFilter('all', firstTab);

        const firstMinTab = document.querySelector('.ministry-btn');
        if (firstMinTab) window.selectMinistryGroup('all', firstMinTab);
    };

    // 지침서 아카이브로 점프
    window.jumpToArchive = function (archiveId) {
        if (typeof window.showView === 'function') {
            window.showView('archive', { highlightId: archiveId });
        }
    };

    // 특정 노드 하이라이트 및 스크롤
    function highlightAndScrollNode(nodeId) {
        const { nodes } = getDB();
        const targetNode = nodes.find(n => n.id === nodeId);
        if (targetNode) {
            const domainMeta = DOMAIN_MAP[targetNode.domainId];
            if (currentDomainFilter !== 'all' && domainMeta && domainMeta.key !== currentDomainFilter) {
                currentDomainFilter = 'all';
                currentMinistryGroup = 'all';
                applyFilters();
            }
        }

        setTimeout(() => {
            const desktopTr = document.getElementById(`hierarchy-node-${nodeId}`);
            if (desktopTr) {
                desktopTr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                desktopTr.classList.add('ring-4', 'ring-emerald-500', 'bg-emerald-100', 'transition-all', 'duration-500');
                setTimeout(() => {
                    desktopTr.classList.remove('ring-4', 'ring-emerald-500', 'bg-emerald-100');
                }, 2500);
                return;
            }

            const mobileCard = document.getElementById(`mobile-card-${nodeId}`);
            if (mobileCard) {
                mobileCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                mobileCard.classList.add('ring-4', 'ring-emerald-500', 'bg-emerald-100', 'transition-all', 'duration-500');
                setTimeout(() => {
                    mobileCard.classList.remove('ring-4', 'ring-emerald-500', 'bg-emerald-100');
                }, 2500);
            }
        }, 150);
    }

    // CSV 내보내기
    window.exportHierarchyCSV = function () {
        const { nodes } = getDB();
        let csvContent = "\uFEFF1단계_실천분야,2단계_대분류_법정기능,3단계_중분류_사업체계,소분류_단위서비스실천내용,공식지침서_법정서식,지침서페이지\n";

        nodes.forEach(n => {
            const bullets = (n.details || []).join(' / ');
            const gRef = n.guidelineRef || { file: '', page: '' };
            const row = [
                `"${n.domainId}"`,
                `"${n.level1}"`,
                `"${n.level2}"`,
                `"${n.level3}"`,
                `"${bullets.replace(/"/g, '""')}"`,
                `"${gRef.file.replace(/"/g, '""')}"`,
                `"${gRef.page}"`
            ];
            csvContent += row.join(',') + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `대한민국_사회복지_90개_법정단위서비스_위계매트릭스_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

})();
