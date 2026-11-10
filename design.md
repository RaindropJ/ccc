# 사회복지 현장 나침반 (Social Welfare Field Compass) Design System & UI Specification

> **프로젝트 개요**: 대학생 및 사회복지사 지망생을 위한 2026 현행 12대 분야별 법령 도감 · 실습처 DB · 전문수련처(정신/의료/학교) · 인턴 및 취업처 75선 · 시사 브리핑 통합 에디토리얼 포털
> **제작 및 운영**: 정다운 (연락처: 010-5328-6117 | 이메일: ddauny00@gmail.com)
> **학술 및 교육 지도**: 백석대학교 사회복지학부 천덕희 교수님
> **디자인 철학**: 전문 공공성(Editorial Reliability) + 절제된 미니멀리즘(No Emoji Noise) + 명확한 정보 위계(High Contrast Accessibility)

---

## 1. 브랜드 아이덴티티 & 헤더 락업 (Brand Identity)

### 1.1 브랜드 심볼 & 네이밍 규격
- **메인 심볼**: 🧭 기하학적 나침반 심볼 (블루/인디고 그라디언트 스퀘어 라운드 아이콘, `36×36px`, `rounded-xl`, `shadow-sm shadow-blue-500/30`)
- **타이틀 워딩**: `현장 나침반` (Bold 900, 16~18px, `tracking-tight`, `#0F172A`)
- **인사이트 뱃지**: `INSIGHTS` (Uppercase, 10px, Black 900, `px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20`)
- **서브 카피**: `대학생 사회복지 실습·취업 네비게이터` (Medium 500, 11px, `#64748B`)
- **원칙**: 헤더 영역 및 서브 탭에서 로고 락업의 2중/3중 중복 노출을 전면 금지하며, 최상단 글로벌 바에 단 1회 고정합니다.

---

## 2. 컬러 팔레트 & 토큰 (Color Tokens)

본 시스템은 시인성과 전문성을 위해 **고대비 슬레이트/화이트 바탕에 신뢰감을 주는 인터내셔널 블루(International Blue)**를 액센트로 사용합니다.

| 분류 | 토큰명 | Hex Code / Tailwind | 용도 및 의미 |
| :--- | :--- | :--- | :--- |
| **Canvas** | `bg-canvas` | `#F8FAFC` (`slate-50`) | 배경 기본색, 눈의 피로도를 낮추는 미세 소프트 그레이 |
| **Card / Surface** | `bg-surface` | `#FFFFFF` (`white`) | 모든 대시보드 카드, 테이블, 서랍 배경 |
| **Primary Text** | `text-primary` | `#0F172A` (`slate-900`) | 고대비 헤드라인 및 본문 텍스트 (시인성 확보) |
| **Secondary Text**| `text-secondary`| `#475569` (`slate-600`) | 카드 메타 정보, 부가 설명, 라벨 |
| **Muted Text** | `text-muted` | `#94A3B8` (`slate-400`) | 비활성 요소, 플레이스홀더, 구분 기호 |
| **Brand Primary** | `primary-blue` | `#2563EB` (`blue-600`) | 액티브 탭, 주요 CTA 버튼, 핵심 링크 |
| **Brand Hover** | `primary-hover` | `#1D4ED8` (`blue-700`) | 버튼 호버 상태 |
| **Subtle Blue** | `blue-surface` | `#EFF6FF` (`blue-50`) | 액티브 탭 배경, 강조 박스, 뱃지 배경 |
| **Accent Amber** | `accent-amber` | `#D97706` (`amber-600`) | 내 준비함 뱃지, 실무·면접 포인트 하이라이트 |
| **Accent Amber Light** | `amber-subtle` | `#FFFBEB` (`amber-50`) | '내 준비함' 서랍, 개인 메모 박스 배경 |
| **Border Soft** | `border-subtle` | `rgba(226, 232, 240, 0.8)` | 카드 및 테이블 구분선 (`slate-200`) |

---

## 3. 타이포그래피 (Typography)

- **영문 / 숫자 폰트**: `Plus Jakarta Sans` (글로벌 감각의 기하학적 산세리프)
- **한글 본문 폰트**: `Noto Sans KR` (가독성과 자간 밸런스가 뛰어난 국가 표준 본문체)
- **CSS 스택**: `font-family: "Plus Jakarta Sans", "Noto Sans KR", -apple-system, sans-serif;`

### 타입 스케일 (Hierarchy)
1. **페이지 대제목 (H1)**: `text-2xl sm:text-4xl font-black tracking-tight text-slate-900`
2. **섹션 / 카드 타이틀 (H2, H3)**: `text-base sm:text-lg font-extrabold text-slate-900 leading-snug`
3. **본문 (Body)**: `text-xs sm:text-sm text-slate-600 leading-relaxed`
4. **라벨 / 뱃지 (Caps/Badge)**: `text-[10px] ~ text-[11px] font-bold tracking-wide`

---

## 4. 내비게이션 & 5대 뷰 아키텍처 (Information Architecture)

```text
[글로벌 헤더: 로고 + 5대 메뉴 탭 + 내 준비함 카운터(6)]
├── 1. 12대 분야와 법령 (도감 매트릭스 테이블 + 25개 법령 원문 직행 + 찜하기)
├── 2. 실습처 탐색 (148건 실시간 공고 + 8,434개 기관 DB + 퀵 필터)
├── 3. 수련처 탐색 (284곳 수련기관 + 정신/의료/학교 3대 전문분야 요강)
├── 4. 인턴·취업처 (75선 엄선 공고 + SASW 실시간 연동 + 4대 필수정보)
├── 5. 복지 뉴스·브리핑 (21건 시사 이슈 + 면접 대비 포인트 박스)
└── [슬라이드 오버 서랍: 내 준비함] (공고 3 · 시사 2 · 법령 1 + 체크리스트 + 메모 + 텍스트 복사)
```

### 4.1 상단 내비게이션 메뉴 규격
- **이모지 전면 배제**: 텍스트와 전용 카운트 뱃지로만 구성하여 비주얼 노이즈 제거.
- **카운트 뱃지 표기 원칙**:
  - `실습처 탐색 [148]`
  - `수련처 탐색 [284곳]`
  - `인턴·취업처 [75]`
  - `복지 뉴스·브리핑 [21]`
  - `⭐ 내 준비함 [6]` (앰버 옐로우 강조 뱃지)

---

## 5. 핵심 컴포넌트 설계 가이드라인 (Components)

### 5.1 공고 카드 (실습처 / 수련처 / 취업처 공통 규격)
사용자 혼선을 방지하기 위해 3개 탐색 탭의 카드는 **동일한 그리드와 폰트 크기**를 유지합니다.

```html
<div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition">
  <!-- 1. 헤더: 분류 뱃지 & D-Day 마감일 -->
  <div class="flex items-center justify-between mb-3">
    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">실습처</span>
    <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">D-7</span>
  </div>

  <!-- 2. 기관명 & 공고 제목 -->
  <div class="text-xs text-slate-400 font-bold mb-1">기관명</div>
  <h3 class="text-base font-extrabold text-slate-900 mb-3 leading-snug">모집 공고명</h3>

  <!-- 3. 필수 4대 정보 압축 박스 -->
  <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-4">
    <div class="flex justify-between"><span>모집인원:</span><strong class="text-slate-900">0명</strong></div>
    <div class="flex justify-between"><span>원서마감:</span><strong class="text-slate-900">YYYY.MM.DD HH:mm</strong></div>
    <div class="flex justify-between"><span>실습비/처우:</span><strong class="text-slate-900">금액 또는 규정</strong></div>
    <div class="pt-1 border-t border-slate-200/60 truncate">주소: 기관 주소 / 전화번호</div>
  </div>

  <!-- 4. 하단 액션 버튼 (통일) -->
  <div class="flex items-center gap-2">
    <button class="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition">공고 원문 ↗</button>
    <button class="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200 hover:bg-amber-100 transition">⭐ 찜하기</button>
  </div>
</div>
```

### 5.2 법령 매트릭스 테이블 (12대 분야와 법령)
- **소관부처 셀**: rowspan 병합, `bg-blue-50/30 text-blue-700 font-bold text-center`
- **시설 구분**: 🏠 생활시설 (거주형) vs 🏢 이용시설 · 전담기관 명확한 2열 분리
- **액션 셀**: 국가법령정보센터 원문 링크(`「법령명」 ↗`) + 개별 `⭐ 찜하기` 버튼

### 5.3 뉴스 카드 & 실무 포인트 박스
- **포인트 박스**: `bg-amber-50/80 border border-amber-200 text-amber-900` 스타일을 사용하여 면접 및 현장 실무 팁을 별도 블록으로 강조.
- **액션 버튼**: 공식 원문 ↗ + ⭐ 스크랩 (활성화 시 ⭐ 저장완료 앰버 솔리드 버튼으로 전환)

### 5.4 내 준비함 (마이 워크스페이스 서랍)
- **위치**: 우측 고정 슬라이드 오버 드로어 (`w-full max-w-md bg-white shadow-2xl`)
- **4대 탭 구성**: `💼 찜한 공고` | `📰 시사 스크랩` | `📜 찜한 법령` | `📋 법정 체크리스트`
- **실무 메모 기능**: 각 보관 항목마다 작성된 개인 메모를 인라인으로 확인 및 수정.
- **내보내기 기능**: 단일 `📋 내보내기 / 텍스트 복사` 버튼으로 클립보드에 정돈된 텍스트 즉시 추출.

### 5.5 하단 푸터 (Footer)
- **법적 고지**: 보건복지부 및 행정안전부 법령정보센터 기준 데이터 감수 고지.
- **공식 문의처 필수 표기**:
  - 제작 및 운영: 정다운 (010-5328-6117, ddauny00@gmail.com)
  - 학술 및 교육 지도: 백석대학교 사회복지학부 천덕희 교수님

---

## 6. 반응형 브레이크포인트 (Responsive Breakpoints)
- **Desktop (≥ 1024px)**: 7xl 고정 컨테이너(`max-w-7xl mx-auto`), 3열 그리드 카드 배치, 상단 5대 탭 전체 노출.
- **Tablet (768px ~ 1023px)**: 2열 그리드 카드 배치.
- **Mobile (< 768px, 기준 폭 390px)**:
  - 1열 그리드 카드 배치.
  - 상단 메뉴는 우측 햄버거(☰) 드롭다운으로 접힘 처리.
  - 헤더 2중 노출 배제 및 폰트 크기 최적화(`text-xs` ~ `text-sm`).
  - 터치 타겟 최소 높이 44px 확보.
