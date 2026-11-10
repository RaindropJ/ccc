// 기본 사회복지 및 공익 시사 뉴스 브리핑 큐레이션 데이터 (12대 분야 연계 & 학부생 수업·실습·면접 포인트 포함)

/**
 * 2026 복지 이슈 핵심 해시태그 아카이브 칩 정의 (2학년 학생을 위한 1초 필터링 키워드)
 */
export const NEWS_HASHTAGS = [
    { tag: '전체', label: '#전체보기', color: 'camping-green' },
    { tag: '돌봄통합', label: '#돌봄통합지원법(2026시행)', color: 'amber' },
    { tag: '유보통합', label: '#유보통합(어린이집교육부)', color: 'blue' },
    { tag: '청년고립', label: '#고립은둔청년지원', color: 'indigo' },
    { tag: '인건비가이드라인', label: '#2026인건비가이드라인', color: 'emerald' },
    { tag: '사회서비스원', label: '#사회서비스원·공공돌봄', color: 'teal' },
    { tag: '정신건강', label: '#정신건강복지법·응급', color: 'purple' },
    { tag: '개인예산제', label: '#장애인개인예산제', color: 'rose' },
    { tag: '학생맞춤통합', label: '#학생맞춤통합·학교복지', color: 'cyan' },
    { tag: 'ESG사회공헌', label: '#ESG사회공헌·임팩트', color: 'slate' }
];

export const defaultWelfareNews = [
    // --- 정책/제도 & 노인·통합돌봄 ---
    {
        id: 'news-def-1',
        category: '정책/제도',
        fieldIds: ['community-selfreliance', 'elderly', 'disability'],
        hashtags: ['인건비가이드라인', '돌봄통합'],
        source: '보건복지부',
        title: '2026년 사회복지시설 종사자 인건비 가이드라인 개정(5급 1호봉 2,232,300원) 및 단일임금제 추진',
        date: '2026-11-01',
        url: 'https://www.mohw.go.kr',
        studyTip: '실습·취업 준비 시 「보건복지부 가이드라인」 vs 지자체 단일임금제(서울형 등) 차이를 비교해보면 취업처별 처우 파악에 유리합니다.',
        summary: '복지시설 종사자 기본급 인상률(3.5%) 반영 및 가족수당·처우개선 체계 정비. 2026년 기준 5급 1호봉 월 기본급 2,232,300원 및 명절휴가비 120% 기준을 바탕으로 수도권·지자체별 단일임금제 적용 현황 점검.'
    },
    {
        id: 'news-def-2',
        category: '정책/제도',
        fieldIds: ['disability'],
        hashtags: ['개인예산제'],
        source: '에이블뉴스',
        title: '장애인 개인예산제 전국 본사업 로드맵 분석: 서비스 코디네이터로서의 복지사 역할',
        date: '2026-10-25',
        url: 'https://www.ablenews.co.kr',
        studyTip: '면접 단골 질문: "공급자 중심 서비스에서 당사자 주도 개인예산제로 전환될 때 사회복지사의 역할 변화는?"',
        summary: '공급자 중심에서 당사자 주도형 맞춤 예산 바우처로의 패러다임 전환. 사회복지사는 단순 배분자가 아닌 자기결정권 지지자이자 개인별 유연 복지플랜(ISP) 코디네이터로서의 전문 역량이 요구됨.'
    },
    {
        id: 'news-def-3',
        category: '정책/제도',
        fieldIds: ['elderly', 'medical', 'community-selfreliance'],
        hashtags: ['돌봄통합'],
        source: '참여연대 복지동향',
        title: '2026년 「돌봄통합지원법」 전면 시행과 지자체 통합지원 거버넌스 구축',
        date: '2026-10-12',
        url: 'https://www.peoplepower21.org/welfare',
        studyTip: '2026년 3월 시행된 「의료·요양 등 지역 돌봄의 통합지원에 관한 법률」은 노인·의료·지역사회 분야 실습과 면접의 최우선 키워드입니다.',
        summary: '지역사회 계속 거주(Aging in Place)를 지원하는 통합돌봄법 시행에 따른 민관 거버넌스 재편. 읍면동·복지관-보건소-의료기관-건강보험공단 간 통합사례관리와 전환돌봄 연계 가속화.'
    },

    // --- 복지관/현장 & 아동·가족·청소년 ---
    {
        id: 'news-def-4',
        category: '복지관/현장',
        fieldIds: ['community-selfreliance', 'elderly'],
        hashtags: ['돌봄통합'],
        source: '한국사회복지관협회',
        title: '지역사회 스마트 복지관 선도모델 구축: 디지털 취약계층 밀착 돌봄 및 AI 안부확인',
        date: '2026-10-28',
        url: 'https://www.kaswc.or.kr',
        studyTip: '복지관 프로포절(사업계획서) 작성 과제 시 AI 돌봄 기술과 대면 사례관리를 어떻게 결합할지 참고 사례로 활용하기 좋습니다.',
        summary: '종합사회복지관을 중심으로 독거노인·고립가구 대상 AI 안부전화 및 스마트 플러그 시스템 구축 확대. 단순 기기 보급을 넘어 사례관리자의 전문적 밀착 상담과 연계하는 스마트 휴먼서비스 모델 발표.'
    },
    {
        id: 'news-def-5',
        category: '복지관/현장',
        fieldIds: ['community-selfreliance', 'child', 'youth', 'family-gender'],
        hashtags: ['인건비가이드라인'],
        source: '서울시사회복지사협회',
        title: '사회복지현장 안전보장 및 인권보호 매뉴얼 개정: 악성민원 대응과 소진(Burnout) 예방',
        date: '2026-10-10',
        url: 'https://www.sasw.or.kr',
        studyTip: '실습·면접 시 "종사자 인권과 안전, 윤리적 딜레마 상황에서 자기보호와 클라이언트 권익을 어떻게 조율할까?"를 함께 고민해보세요.',
        summary: '사회복지사의 안전하고 존엄한 근무환경 조성을 위한 안전요원 배치 기준 및 심리상담 바우처 지원 강화. 현장 실무자의 감정노동 치유와 직무 만족도 제고를 위한 힐링 연수 프로그램 확대.'
    },
    {
        id: 'news-def-6',
        category: '복지관/현장',
        fieldIds: ['community-selfreliance', 'elderly'],
        hashtags: ['청년고립', '돌봄통합'],
        source: '웰페어뉴스',
        title: '고독사 예방 및 사회적 고립가구 발굴을 위한 복지등기우편 및 주민조직 네트워크 성과',
        date: '2026-09-29',
        url: 'https://www.welfarenews.net',
        studyTip: '종합사회복지관의 3대 기능(사례관리·서비스제공·지역조직화) 중 지역조직화의 현대적 적용 사례로 정리해두세요.',
        summary: '우체국 집배원, 한국전력 검침원과 연계한 복지사각지대 발굴 체계 고도화. 지역 주민으로 구성된 이웃살피미 조직과 복지관 사례관리팀의 신속 개입 프로세스 성공 요인 분석.'
    },
    {
        id: 'news-def-20',
        category: '정책/제도',
        fieldIds: ['family-gender', 'youth', 'child'],
        hashtags: ['청년고립'],
        source: '성평등가족부·복지넷',
        title: '성평등가족부 개편과 지자체 「가족센터」 통합서비스, 학교 밖·위기청소년 자립지원 확대',
        date: '2026-10-20',
        url: 'https://www.bokji.net',
        studyTip: '법령 체계 이해 시 건강가정지원센터·다문화가족지원센터 → 가족센터 통합과 청소년쉼터/자립지원관·꿈드림 역할을 구분해 두세요.',
        summary: '성평등가족부 체제에서 보편적 가족서비스(가족센터)와 1인가구·다문화·한부모 지원 연계 강화. 아동·청소년 자립준비청년 및 가정 밖 청소년 대상 주거·일경험 자립 패키지 확대.'
    },
    {
        id: 'news-def-21',
        category: '정책/제도',
        fieldIds: ['child', 'school'],
        hashtags: ['유보통합', '학생맞춤통합'],
        source: '복지넷·교육부',
        title: '어린이집(영유아보육법) 교육부 유보통합 이관과 초·중·고 「학생맞춤통합지원」 현장 안착',
        date: '2026-10-14',
        url: 'https://www.bokji.net',
        studyTip: '교육복지·학교사회복지 진로 희망자는 단위학교 내 교육복지실·Wee센터·지역 복지관 간 다학제 연계 구조를 반드시 확인하세요.',
        summary: '유보통합 정책에 따라 영유아보육 소관 부처가 교육부로 일원화되고, 초·중·고교에서는 위기학생 조기 발굴과 지역 복지자원을 잇는 학생맞춤통합지원 체계가 본격 가동됨.'
    },

    // --- 정신건강 ---
    {
        id: 'news-def-7',
        category: '정신건강',
        fieldIds: ['mental-health'],
        hashtags: ['정신건강'],
        source: '마인드포스트',
        title: '정신건강복지법 개정 논의: 사법입원제 도입 쟁점과 당사자 절차보조인 제도의 현장 안착',
        date: '2026-10-30',
        url: 'https://www.mindpost.or.kr',
        studyTip: '정신건강사회복지사 수련 면접 핵심 이슈: 당사자 인권(비자의 입원 최소화)과 치료 접근권 간의 윤리적 균형!',
        summary: '중증 정신질환자 입원 절차의 사법적 판단 도입 여부를 둘러싼 인권과 치료 접근권 쟁점 분석. 당사자의 권익을 대변하는 절차보조인 및 동료지원가(Peer Support) 법적 지위 보장 필요성 대두.'
    },
    {
        id: 'news-def-8',
        category: '정신건강',
        fieldIds: ['mental-health', 'public-justice'],
        hashtags: ['정신건강'],
        source: '한국정신건강사회복지사협회',
        title: '24시간 정신응급 위기개입센터 전국 확충과 정신건강사회복지사의 현장 출동 프로토콜',
        date: '2026-10-19',
        url: 'https://www.kamhsw.or.kr',
        studyTip: '정신건강복지센터와 경찰·소방 공조 체계, 정신재활시설·낮병원으로 이어지는 지역사회 회복 경로를 파악해 두세요.',
        summary: '경찰·소방과 공조하는 권역별 정신응급대응센터 24시간 당직 체계 가동. 급성기 위기 개입 후 정신재활시설 및 지역사회 낮병원 연계 등 다학제적 통합 지원 모델 성과 보고.'
    },
    {
        id: 'news-def-9',
        category: '정신건강',
        fieldIds: ['mental-health', 'youth'],
        hashtags: ['정신건강', '청년고립'],
        source: '마인드포스트',
        title: '청년 정신건강 조기중재 센터 ‘마인드링크’ 이용자 분석: 고립 청년의 심리사회적 회복 모델',
        date: '2026-10-05',
        url: 'https://www.mindpost.or.kr',
        studyTip: '전통적 정신병원 중심에서 청년 친화적 조기개입·커뮤니티 기반 예방 모델로의 변화를 실습 지원 동기에 녹여보세요.',
        summary: '초기 정신증 청년 대상 조기 개입이 학업 및 취업 복귀에 미치는 긍정적 효과 실증. 낙인(Stigma) 없는 카페형 청년 마음건강 공간과 비대면 텍스트 상담의 선제적 확장 추진.'
    },

    // --- 의료사회복지 ---
    {
        id: 'news-def-10',
        category: '의료',
        fieldIds: ['medical'],
        hashtags: ['돌봄통합'],
        source: '대한의료사회복지사협회',
        title: '의료사회복지사 법정자격 전문화 이후 병원 내 다학제 진료팀 및 환자권익 옹호 확대',
        date: '2026-11-02',
        url: 'https://www.kamsw.or.kr',
        studyTip: '의료사회복지사(1급 + 1년 수련) 준비생은 병원 내 다학제 팀(IPC)에서 사회복지사만이 가진 심리사회적 사정 강점을 정리해두세요.',
        summary: '상급종합병원 및 재활병원 내 의료사회복지사의 심리사회적 사정 수가 및 퇴원계획 상담 수가 제도화 진행 경과. 환자 자기결정권 지지와 사전연명의료의향서 상담 전문성 강화.'
    },
    {
        id: 'news-def-11',
        category: '의료',
        fieldIds: ['medical', 'elderly', 'community-selfreliance'],
        hashtags: ['돌봄통합'],
        source: '청년의사',
        title: '급성기 퇴원환자 지역사회 연계(환자 케어플랜) 본사업 전환: 병원-복지관 핫라인 구축',
        date: '2026-10-24',
        url: 'https://www.docdocdoc.co.kr',
        studyTip: '병원 사회사업팀과 지역 종합사회복지관·지자체 통합돌봄팀이 어떻게 연결되는지(전환돌봄) 흐름을 이해하면 실무 감각이 올라갑니다.',
        summary: '입원 환자가 퇴원 후 가정과 지역사회에 안착하도록 병원 공공의료사업단과 지역 복지관 간 케어플랜 연계. 재입원율 감소와 의료비 절감 등 사회복지적 개입 효과 입증.'
    },
    {
        id: 'news-def-12',
        category: '의료',
        fieldIds: ['medical'],
        hashtags: ['돌봄통합'],
        source: '대한의료사회복지사협회',
        title: '재난적 의료비 지원 확대와 취약계층 희귀난치 질환자 긴급 지원 거버넌스 점검',
        date: '2026-10-08',
        url: 'https://www.kamsw.or.kr',
        studyTip: '실습·면접 전 「재난적의료비 지원사업」과 「긴급복지 의료지원」의 지원 요건 차이를 간단히 정리해두면 매우 좋습니다.',
        summary: '고액 의료비로 인한 가계 파탄 방지를 위한 정부 재난적 의료비 지원 한도 및 지원 비율 상향. 병원 사회사업팀의 원스톱 신청 대행 및 외부 민간 복지재단 치료비 연계 기법 공유.'
    },

    // --- 사회·인권·노동 & 공공 ---
    {
        id: 'news-def-13',
        category: '사회',
        fieldIds: ['youth', 'community-selfreliance', 'public-justice'],
        hashtags: ['청년고립'],
        source: '프레시안',
        title: '청년 고립·은둔 실태와 국가 지원체계: ‘당사자 중심 관계 맺기와 단계별 사회복귀’',
        date: '2026-10-27',
        url: 'https://www.pressian.com',
        studyTip: '최근 지자체(서울·경기 청년미래센터 등)와 사회서비스원이 고립·은둔청년 전담 인력/인턴을 활발히 뽑고 있는 분야입니다.',
        summary: '고립·은둔 청년의 사회적 비용 절감과 자립을 위한 단계적 지원 로드맵. 비대면 커뮤니티부터 공동생활형 셰어하우스, 완만한 일경험 인턴십으로 이어지는 통합 프로그램 조명.'
    },
    {
        id: 'news-def-14',
        category: '사회',
        fieldIds: ['public-justice', 'elderly', 'disability'],
        hashtags: ['사회서비스원', '돌봄통합'],
        source: '참여연대 복지동향',
        title: '돌봄노동자 처우개선 및 시·도 사회서비스원 공공돌봄 인프라 확충 논의',
        date: '2026-10-16',
        url: 'https://www.peoplepower21.org/welfare',
        studyTip: '공공기관·사회서비스원 취업 준비 시 ‘사회서비스의 공공성’과 종사자 처우개선 쟁점을 반드시 숙지하세요.',
        summary: '초고령사회 진입에 따른 필수 돌봄노동의 저임금·불안정 노동 실태 분석. 지자체 사회서비스원의 공공성 강화와 표준근로계약, 긴급돌봄·대체인력 지원 역할 확대 촉구.'
    },
    {
        id: 'news-def-15',
        category: '사회',
        fieldIds: ['public-justice'],
        hashtags: ['인건비가이드라인'],
        source: '프레시안',
        title: '플랫폼·특수고용직 노동자의 산재보험 및 전국민 고용보험 적용 사각지대 해소 방안',
        date: '2026-10-02',
        url: 'https://www.pressian.com',
        studyTip: '근로복지공단·국민연금공단·건강보험공단 등 사회보장 공공기관 공채 면접에서 자주 다뤄지는 사회보험 사각지대 이슈입니다.',
        summary: '배달라이더, 가사관리사, 프리랜서 등 신종 노무제공자의 사회안전망 포괄 현황. 전통적 임금근로자 중심 사회보험 체계에서 일하는 사람 모두를 위한 보편적 사회보장으로의 전환 쟁점.'
    },

    // --- NGO/국제구호 ---
    {
        id: 'news-def-16',
        category: 'NGO/국제구호',
        fieldIds: ['ngo'],
        hashtags: ['ESG사회공헌'],
        source: 'KCOC (국제개발협력민간협의회)',
        title: '국제구호 NGO의 현지 중심화(Localization)와 기후위기 대응 인도적 지원 동향',
        date: '2026-10-22',
        url: 'https://www.ngokcoc.or.kr',
        studyTip: 'KOICA YP나 NGO 인턴 면접에서는 "선혜적 원조가 아닌 현지 파트너십(Localization)" 관점을 강조하는 것이 핵심입니다.',
        summary: '글로벌 재난 및 기후 난민 증가에 따른 현지 파트너십 강화 전략 발표. 기부금 투명성 제고를 위한 디지털 후원 관리 솔루션 도입과 청년 국제개발협력 실무자(YP·인턴) 양성 추진.'
    },
    {
        id: 'news-def-17',
        category: 'NGO/국제구호',
        fieldIds: ['ngo', 'csr-foundation'],
        hashtags: ['ESG사회공헌'],
        source: 'KCOC',
        title: '비영리 모금(Fundraising) 투명성과 공익법인 공시 제도 개편에 따른 신뢰도 제고',
        date: '2026-10-11',
        url: 'https://www.ngokcoc.or.kr',
        studyTip: 'NGO·재단 취업 전 지원하려는 기관의 투명성을 「한국가이드스타」와 국세청 공익법인 공시에서 직접 찾아보는 습관을 들이세요.',
        summary: '국세청 홈택스 결산서류 공시 시스템 개편과 NPO 회계기준 가이드라인 공유. 기부자 신뢰를 확보하기 위한 임팩트 리포트 발간과 현장 성과 측정(SROI) 기법 확산.'
    },

    // --- 기업CSR/사회공헌 ---
    {
        id: 'news-def-18',
        category: '기업CSR/사회공헌',
        fieldIds: ['csr-foundation', 'community-selfreliance'],
        hashtags: ['ESG사회공헌'],
        source: '한국사회복지협의회',
        title: '2026 지역사회공헌인정제(Corporate-Community Partnership) 확대 및 ESG 연계',
        date: '2026-10-18',
        url: 'https://www.bokji.net',
        studyTip: '기업 CSR팀 지원자는 기업-복지관 간 장기 파트너십 우수사례를 지역사회공헌인정제 지표로 살펴보면 도움이 됩니다.',
        summary: '기업의 사회공헌 활동이 단순 일회성 후원을 넘어 복지 사각지대 발굴과 청년 자립지원 등 구체적 사회적 가치(Social Impact) 창출 중심으로 진화. 복지관-기업 간 전략적 협력 활성화.'
    },
    {
        id: 'news-def-19',
        category: '기업CSR/사회공헌',
        fieldIds: ['csr-foundation', 'ngo'],
        hashtags: ['ESG사회공헌'],
        source: '한국사회복지협의회',
        title: '기업-소셜벤처-복지재단의 컬렉티브 임팩트(Collective Impact) 모델과 성과 창출',
        date: '2026-09-25',
        url: 'https://www.bokji.net',
        studyTip: '임팩트커리어(루트임팩트) 등에서 소셜벤처·공익재단 인턴을 노린다면 컬렉티브 임팩트와 SROI 개념을 꼭 익혀두세요.',
        summary: '단일 기관의 한계를 극복하기 위해 민간 기업의 자본과 소셜벤처의 기술력, 복지재단의 현장 네트워크가 결합한 사회문제 해결 프로젝트 우수 모델 벤치마킹 분석.'
    }
];

export const DEFAULT_EDITORIAL_ARTICLES = defaultWelfareNews;
