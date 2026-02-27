# Promr Brand Chart - 애플리케이션 구조

## 전체 시스템 구조

```mermaid
graph TB
    App[App.tsx<br/>라우팅 & AppProvider]
    
    App --> Layout[Layout.tsx<br/>사이드바 + 메인 콘텐츠]
    
    Layout --> Corp[법인 사용자]
    Layout --> Pharma[제약사 사용자]
    
    Corp --> CorpHome[HomePage<br/>대시보드]
    Corp --> CorpUpload[실적 등록]
    Corp --> CorpDealer[계약관리]
    Corp --> CorpAggregate[정산확인]
    Corp --> CorpFilter[필터링 승인요청]
    
    Pharma --> PharmaHome[HomePage<br/>대시보드]
    Pharma --> Master[기준정보 관리]
    Pharma --> PharmaAggregate[정산확인]
    Pharma --> PharmaSettlement[법인별 정산확인]
    Pharma --> PharmaFilter[법인별 필터링 승인요청]
    Pharma --> PharmaDealer[법인별 계약 조회]
    
    CorpUpload --> Sales[SalesUploadPage<br/>실적 업로드]
    CorpUpload --> Prescription[PrescriptionUploadPage<br/>처방사진 업로드]
    
    Master --> Account[AccountManagePage<br/>거래처관리]
    Master --> Hospital[HospitalManagePage<br/>병의원 관리]
    Master --> Fee[FeeManagePage<br/>수수료관리]
    
    style Corp fill:#e3f2fd
    style Pharma fill:#f3e5f5
    style CorpHome fill:#bbdefb
    style PharmaHome fill:#ce93d8
```

## 사용자 역할별 페이지 접근 권한

```mermaid
graph LR
    subgraph 법인Corporation
        C1[대시보드]
        C2[실적 업로드<br/>- 실적 엑셀<br/>- 처방사진]
        C3[계약관리<br/>딜러 추가/삭제]
        C4[정산확인]
        C5[필터링 승인요청]
    end
    
    subgraph 제약사Pharma
        P1[대시보드]
        P2[기준정보 관리<br/>- 거래처<br/>- 병의원<br/>- 수수료]
        P3[정산확인]
        P4[법인별 정산확인]
        P5[필터링 승인요청<br/>승인/반려]
        P6[법인별 계약 조회<br/>읽기 전용]
    end
    
    style 법인Corporation fill:#e3f2fd
    style 제약사Pharma fill:#f3e5f5
```

## 데이터 모델 관계

```mermaid
erDiagram
    Corporation ||--o{ Dealer : has
    Corporation ||--o{ SalesRow : reports
    Corporation ||--o{ PrescriptionUpload : uploads
    Corporation ||--o{ FilterRequest : requests
    
    Hospital ||--o{ SalesRow : receives
    Hospital }o--|| Corporation : "assigned to"
    
    FilterRequest }o--|| Hospital : "for"
    FilterRequest }o--|| Corporation : "from"
    
    ProductFee ||--o{ SalesRow : "applies to"
    
    Corporation {
        string id PK
        string name
        string contact
        boolean isPromr
    }
    
    Hospital {
        string id PK
        string name
        string businessNumber
        string accountCode
        string corporationId FK
    }
    
    Dealer {
        string id PK
        string corporationId FK
        string salespersonName
        string phone
        string email
        string reportCertUrl
        string contractUrl
        string businessLicenseUrl
    }
    
    SalesRow {
        string id PK
        string corporationId FK
        string hospitalId FK
        string productName
        string productCode
        number quantity
        number amount
        string settlementMonth
    }
    
    FilterRequest {
        string id PK
        string corporationId FK
        string hospitalId FK
        string status
        string requestedAt
    }
```

## 상태 관리 (AppContext)

```mermaid
graph TB
    subgraph AppContext
        State[전역 상태]
        Actions[액션]
    end
    
    State --> UserRole[userRole<br/>corporation | pharma]
    State --> CurrentCorp[currentCorporationId]
    State --> Corps[corporations 배열]
    State --> Hospitals[hospitals 배열]
    State --> Sales[salesRows 배열]
    State --> Prescriptions[prescriptionUploads 배열]
    State --> Filters[filterRequests 배열]
    State --> Dealers[dealers 배열]
    
    Actions --> SetRole[setUserRole]
    Actions --> SetCorp[setCurrentCorporationId]
    Actions --> AddSales[addSalesRows]
    Actions --> AddPrescription[addPrescriptionUpload]
    Actions --> AddHospital[addHospital]
    Actions --> UpdateFilter[updateFilterRequestStatus]
    Actions --> AddFilter[addFilterRequest]
    Actions --> AddDealer[addDealer]
    Actions --> DeleteDealer[deleteDealer]
    
    style State fill:#fff3e0
    style Actions fill:#e1f5fe
```

## 주요 기능 흐름

### 1. 실적 업로드 (법인)

```mermaid
sequenceDiagram
    actor User as 법인 사용자
    participant Page as SalesUploadPage
    participant Context as AppContext
    participant Data as salesRows State
    
    User->>Page: 엑셀 파일 드래그 & 드롭
    Page->>Page: parseExcelToSalesRows()
    Page->>Page: 미리보기 표시
    User->>Page: 수량/제품명 수정
    User->>Page: 업로드 버튼 클릭
    Page->>Context: addSalesRows(rows)
    Context->>Data: 실적 추가
    Data-->>Page: 상태 업데이트
    Page-->>User: 성공 메시지
```

### 2. 딜러 관리 (법인)

```mermaid
sequenceDiagram
    actor User as 법인 사용자
    participant Page as DealerManagePage
    participant Context as AppContext
    participant Data as dealers State
    
    User->>Page: 딜러 추가 버튼
    Page->>Page: 모달 표시
    User->>Page: 정보 입력 + 파일 업로드
    User->>Page: 추가 버튼
    Page->>Context: addDealer(dealer)
    Context->>Data: 딜러 추가
    Data-->>Page: 상태 업데이트
    Page-->>User: 테이블에 표시
    
    User->>Page: 삭제 버튼
    Page->>Page: 확인 모달 표시
    User->>Page: 삭제 확인
    Page->>Context: deleteDealer(dealerId)
    Context->>Data: 딜러 삭제
    Data-->>Page: 상태 업데이트
```

### 3. 필터링 승인 (제약사)

```mermaid
sequenceDiagram
    actor Corp as 법인 사용자
    participant FilterReq as FilterRequestPage
    participant Context as AppContext
    actor Pharma as 제약사 사용자
    participant Approval as FilterApprovalPage
    
    Corp->>FilterReq: 병의원 선택
    Corp->>FilterReq: 승인 요청
    FilterReq->>Context: addFilterRequest()
    Context->>Context: filterRequests 추가<br/>status: pending
    
    Pharma->>Approval: 요청 목록 조회
    Approval->>Context: filterRequests 조회
    Context-->>Approval: pending 상태 표시
    Pharma->>Approval: 승인 또는 반려
    Approval->>Context: updateFilterRequestStatus(id, status)
    Context->>Context: 상태 업데이트<br/>approved | rejected
```

## 라우팅 구조

```mermaid
graph TB
    Root[/ - HomePage]
    
    Root --> Upload[/upload/*]
    Root --> Dealer[/dealer-*]
    Root --> Management[기준정보 관리]
    Root --> Settlement[정산 관련]
    Root --> Filter[필터링]
    
    Upload --> UploadSales[/upload/sales<br/>실적 업로드]
    Upload --> UploadPrescription[/upload/prescription<br/>처방사진 업로드]
    
    Dealer --> DealerManage[/dealer-manage<br/>계약관리 법인]
    Dealer --> DealerView[/dealer-view<br/>계약 조회 제약사]
    
    Management --> Accounts[/accounts<br/>거래처관리]
    Management --> Hospitals[/hospitals<br/>병의원 관리]
    Management --> Fees[/fees<br/>수수료관리]
    
    Settlement --> Aggregate[/aggregate<br/>정산확인]
    Settlement --> SettlementCorp[/settlement<br/>법인별 정산확인]
    
    Filter --> FilterRequest[/filter-request<br/>필터링 요청 법인]
    Filter --> FilterApproval[/filter-approval<br/>필터링 승인 제약사]
    
    style Root fill:#fff9c4
    style Upload fill:#e3f2fd
    style Dealer fill:#f3e5f5
    style Management fill:#e8f5e9
    style Settlement fill:#fce4ec
    style Filter fill:#fff3e0
```

## 컴포넌트 계층 구조

```mermaid
graph TB
    App[App.tsx]
    App --> Provider[AppProvider]
    App --> ThemeProvider[ThemeProvider]
    App --> Router[React Router]
    
    Router --> Layout[Layout]
    
    Layout --> Sidebar[Sidebar<br/>역할별 메뉴]
    Layout --> Main[Main Content<br/>Outlet]
    
    Main --> Pages[Pages]
    
    Pages --> Home[HomePage<br/>통계 + 차트]
    Pages --> Sales[SalesUploadPage<br/>드래그앤드롭 + 테이블]
    Pages --> Prescription[PrescriptionUploadPage<br/>이미지 업로드]
    Pages --> DealerM[DealerManagePage<br/>테이블 + 모달]
    Pages --> DealerV[DealerViewPage<br/>좌측 리스트 + 우측 테이블]
    Pages --> Account[AccountManagePage<br/>검색 + 테이블]
    Pages --> Hospital[HospitalManagePage<br/>검색 + 추가 모달]
    Pages --> Fee[FeeManagePage<br/>테이블 편집]
    Pages --> Aggregate[AggregatePage<br/>필터 + 테이블]
    Pages --> SettlementC[SettlementByCorpPage<br/>좌측 리스트 + 우측 테이블]
    Pages --> FilterR[FilterRequestPage<br/>선택 + 요청]
    Pages --> FilterA[FilterApprovalPage<br/>좌측 리스트 + 우측 상세]
    
    style App fill:#ffccbc
    style Provider fill:#c8e6c9
    style ThemeProvider fill:#b3e5fc
    style Layout fill:#fff9c4
    style Pages fill:#f8bbd0
```

## 테마 시스템

```mermaid
graph LR
    Theme[ThemeContext]
    Theme --> Light[Light Mode]
    Theme --> Dark[Dark Mode]
    
    Light --> Colors1[colors<br/>background: #f8fafc<br/>surface: #ffffff<br/>primary: #3b82f6]
    Dark --> Colors2[colors<br/>background: #0f172a<br/>surface: #1e293b<br/>primary: #60a5fa]
    
    Theme --> Toggle[toggleTheme 함수]
    Toggle --> LocalStorage[localStorage 저장]
    
    style Light fill:#fff9c4
    style Dark fill:#37474f,color:#fff
```

## 파일 구조

```
src/
├── components/
│   └── Layout.tsx          # 사이드바 + 메인 레이아웃
├── pages/
│   ├── HomePage.tsx        # 대시보드 (통계 + 차트)
│   ├── SalesUploadPage.tsx
│   ├── PrescriptionUploadPage.tsx
│   ├── DealerManagePage.tsx    # 법인: 딜러 관리
│   ├── DealerViewPage.tsx      # 제약사: 딜러 조회
│   ├── AccountManagePage.tsx
│   ├── HospitalManagePage.tsx
│   ├── FeeManagePage.tsx
│   ├── AggregatePage.tsx
│   ├── SettlementByCorpPage.tsx
│   ├── FilterRequestPage.tsx   # 법인: 필터링 요청
│   └── FilterApprovalPage.tsx  # 제약사: 필터링 승인
├── context/
│   ├── AppContext.tsx      # 전역 상태 관리
│   └── ThemeContext.tsx    # 테마 관리
├── types/
│   └── index.ts            # 타입 정의
├── store/
│   └── mockData.ts         # 목 데이터
├── theme.ts                # 테마 설정
└── App.tsx                 # 라우팅 설정
```
