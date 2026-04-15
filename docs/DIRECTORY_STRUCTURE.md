# 디렉터리 구조 요약

에이전트·온보딩용 스냅샷. 빌드 산출물(`.next/`), 의존성(`node_modules/`), 정적 스토리북(`storybook-static/`) 등은 제외한다.

## 프로젝트 한 줄

- **Next.js 14 (App Router)** + **React 18** + **TypeScript**, 상태 **Zustand**, 데이터 **TanStack Query**, 스타일 **Vanilla Extract**(`*.css.ts`) 등.
- **경로 별칭:** `@/*` → `src/*` (`tsconfig.json`).

## 루트

| 경로 | 역할 |
|------|------|
| `app/` | 라우팅·레이아웃·`page.tsx`만 (비즈니스 로직은 주로 `src/features`) |
| `src/` | 기능·공유 UI·API·스토어·타입·유틸 |
| `public/` | 정적 자산 (`favicon.svg`, `logo.svg`, `maps/`, MSW `mockServiceWorker.js`, `demo/` 등) |
| `docs/` | 내부 문서 |
| `.cursor/rules/` | Cursor 규칙 (예: 커밋 컨벤션) |
| `next.config.mjs`, `package.json`, `tsconfig.json` | Next/빌드/TS 설정 |

## `app/` (URL 구조)

- **루트:** `page.tsx`, `layout.tsx`, `globals.css`, `error.tsx`, `not-found.tsx`
- **인증·랜딩:** `login/`, `signup/`, `promotion/`
- **`(dashboard)/`** — 역할별 대시보드 그룹
  - `home/` — 공통 홈
  - **`admin/`** — `corp-manage`, `hospitals`, `notices`(+ `[id]`, `new`, `edit`), `pharma-manage`, `user-manage`, `layout.tsx`
  - **`corporation/`** — `aggregate`, `dealer-manage`, `filter-request`, `home`, `upload`(+ `notice`, `prescription`, `sales`), `layout.tsx`
  - **`pharma/`** — `absorption`(하위 `calculation`, `pharmacy-mapping`, `pharmacy-settings`), `aggregate`, `contract-management`(하위 `manage`, `request`, `review`, `view`, `corporation-dealers`), `corp-manage`, `dealer-view`, `fees`, `filter-approval`, `home`, `hospitals`, `my-page`, `notices`, `settlement`, `settlement-by-region`, `layout.tsx`

## `src/` (애플리케이션 코드)

| 경로 | 역할 |
|------|------|
| `features/{domain}/` | 도메인별 화면·훅·(선택) `api/`, `lib/` — 예: `notice`, `auth`, `home`, `contract`, `settlement`, `fee`, `dealer`, `hospital`, `corporation`, `admin`, `filter`, `upload`, `absorption`, `pharma-dashboard` |
| `shared/components/` | 재사용 UI — `ui/`, `layout/`, `providers/`(ProtectedRoute, MSW 등), `metadata/` |
| `api/` | `axios.ts`, `axiosBare.ts`, `interceptors.ts`, `queryClient.ts`, `queryKey.ts`, `services/` |
| `store/` | 전역 클라이언트 상태 (예: `appStore`, `themeStore`, `demoPlayStore`, `mockData`) |
| `entities/` | 도메인 타입 re-export 등 (점진 확장) |
| `types/` | 공통 타입·`services/` 타입·`hooks/` 등 |
| `hooks/` | 공통 훅 |
| `utils/` | 포맷, 쿠키, 스토리지 등 |
| `lib/` | 공용 라이브러리 래퍼 등 |
| `mocks/` | MSW 브라우저·핸들러 |
| `content/` | 약관·동의 문구 등 정적 콘텐츠 |
| `style/` | 공통 스타일 토큰·페이지 스타일 |
| `theme/`, `theme.ts`, `index.css` | 테마·글로벌 스타일 진입 |
| `components/` | feature/shared로 아직 안 묶인 소수 컴포넌트 (예: 카카오맵, 테마 인젝터, 데모 리하이드) |

## Import 규칙 (요약)

- 화면/기능: `@/features/{domain}/...`
- 공유 UI: `@/shared/components/ui|layout|providers/...`
- HTTP: `@/api/services/...` 또는 `@/features/.../api/...` (내부에서 `@/api/axios` 사용)

## 관련 문서

- 레이어 역할·RSC/에러 바운더리·import 상세: [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md)

*갱신: 저장소 구조 스냅샷 기준*

