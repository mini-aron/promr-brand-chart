# Promr Brand Chart (PROPF)

법인 실적·처방사진 업로드 및 제약사 **정산** 확인을 위한 웹 앱입니다.

## 기술 스택

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Emotion** (CSS-in-JS)
- **@tanstack/react-table** (테이블)
- **Recharts** (차트)
- **Axios** (HTTP)
- **xlsx** (엑셀 파싱)
- **Storybook** (컴포넌트 개발/문서화)

## 사용자 유형

- **법인**: 실적·처방 업로드, 계약관리, 법인 실적 조회, 필터링 요청.
- **제약사**: 병의원/수수료 기준정보 관리, 정산확인, 법인별 정산·계약 조회, 거래선 관리.

## 페이지 구성

| 경로 | 설명 | 노출 대상 |
|------|------|-----------|
| `/` | 루트 (로그인 시 `/home`, 비로그인 시 `/promotion` 리다이렉트) | 전체 |
| `/login` | 로그인 | 전체 |
| `/promotion` | 프로모션/랜딩 | 비로그인 |
| `/home` | 대시보드 홈 | 로그인 전체 |
| `/upload` | 실적 등록 (업로드 메인) | 법인 |
| `/upload/sales` | 실적 업로드 (엑셀) | 법인 |
| `/upload/prescription` | 처방사진 업로드 | 법인 |
| `/upload/notice` | 업로드 공지 | 법인 |
| `/dealer-manage` | 계약관리 | 법인 |
| `/aggregate` | 법인 실적 조회 / 정산확인 | 법인·제약사 |
| `/settlement` | 법인별 정산확인 | 제약사 |
| `/hospitals` | 병의원 관리 | 제약사 |
| `/fees` | 수수료관리 | 제약사 |
| `/filter-request` | 필터링 요청 | 법인 |
| `/filter-approval` | 거래선 관리 | 제약사 |
| `/dealer-view` | 법인별 계약 조회 | 제약사 |

**사이드바** 왼쪽에서 화면별 메뉴가 보이며, 하단에서 **법인 / 제약사**를 선택하면 메뉴 구성이 바뀝니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5000` 접속.

```bash
# 프로덕션 빌드 및 실행
npm run build
npm start

# Storybook (컴포넌트 개발)
npm run storybook
# → http://localhost:6006
```

## 엑셀 실적 업로드 (법인)

- `.xlsx`, `.xls` 지원
- **엑셀 양식**·**품목**·**거래처** 다운로드 버튼으로 업로드용 시트/파일 제공
- 시트 첫 행을 헤더로 인식하며, 아래 컬럼명(또는 유사명)을 찾습니다.
  - 병원: `병원`, `병의원`, `병원명`, `hospital`
  - 제품: `제품`, `품목`, `제품명`, `product`
  - 수량: `수량`, `quantity`, `qty`
  - 금액: `금액`, `매출`, `amount`, `sales`
- 병의원(또는 전체)과 월 선택 후 파일을 드래그 또는 선택해 미리보기 후 "실적 등록하기"로 저장

## 정산 화면 (제약사)

- 거래처(병의원) 단위로 한 행씩 표시
- 컬럼: No., 상태, 정산월, 처방월, 거래처코드, 거래처명, 사업자번호, 주소, 금액, **원내** 품목수/처방액, **원외** 품목수/처방액 (제약사는 원내 0, 원외만 집계)
- 하단 **합계** 행 제공, 법인·병의원·품목 검색 필터

## 데이터

현재는 메모리 상태로만 동작하며, 새로고침 시 목 데이터로 초기화됩니다. 백엔드 연동 시 `src/context/AppContext.tsx` 및 관련 mock 데이터를 API 호출로 교체하면 됩니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 (포트 5000) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run storybook` | Storybook 개발 서버 (포트 6006) |
| `npm run build-storybook` | Storybook 정적 빌드 |
