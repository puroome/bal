# 📂 파일별 상세 설명

모든 파일이 무엇인지, 무엇을 하는지 알아봅시다.

## 🎮 게임 파일 (3개)

### 1. **index.html** (게임 UI)
- **역할**: 게임의 화면 구조 (버튼, 텍스트 입력창, 진행도바 등)
- **수정**: 초기 하나 수정 가능
  ```html
  <h1>⚖️ 교육용 밸런스 게임</h1>  <!-- 여기 제목 변경 가능 -->
  ```
- **건드리면 안 됨**: 나머지 HTML 태그들
- **크기**: ~5KB

### 2. **script.js** (게임 로직)
- **역할**: 게임의 모든 동작
  - 질문 로드
  - 선택 처리
  - 결과 계산
  - 데이터 저장
- **수정**: 고급 사용자만 (함수 이해 필요)
- **건드리면 안 됨**: 핵심 로직
- **크기**: ~12KB

### 3. **style.css** (디자인)
- **역할**: 게임의 색상, 폰트, 레이아웃
- **수정**: 색상 & 폰트는 자유
  ```css
  .btn-primary {
      background-color: #6366F1;  /* 색상 변경 가능 */
  }
  
  body {
      font-family: 'Arial', sans-serif;  /* 폰트 변경 가능 */
  }
  ```
- **건드리면 안 됨**: 레이아웃 구조
- **크기**: ~11KB

---

## ⚙️ 설정 파일 (1개)

### **config/config.js** (🌟 가장 중요!)
- **역할**: Google Sheets API 설정
- **내용**:
  ```javascript
  const CONFIG = {
      API_KEY: 'YOUR_API_KEY_HERE',           // ← 1단계: API 키
      SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',  // ← 2단계: 시트 ID
      GAME: {
          MAX_QUESTIONS: 0,           // 0 = 전체 문제
          RANDOMIZE_QUESTIONS: true   // true = 순서 무작위
      }
  };
  ```
- **수정**: 반드시 2개 값을 본인 것으로 바꿔야 함
- **건드리면 안 됨**: GAME 섹션 (선택사항)
- **크기**: ~2KB

---

## 🔌 유틸리티 파일 (1개)

### **utils/sheetsAPI.js** (Google Sheets 통신)
- **역할**: Google Sheets API와 통신하는 함수들
  ```javascript
  SheetsAPI.loadQuestions()  // 질문 로드
  SheetsAPI.saveChoice()     // 선택 저장
  ```
- **수정**: 하면 안 됨 (API 이해 필요)
- **용도**: script.js에서 사용됨
- **크기**: ~4KB

---

## 📖 가이드 문서 (4개)

### 1. **README.md** (프로젝트 소개)
- **역할**: GitHub에 표시되는 메인 설명서
- **내용**:
  - 프로젝트 개요
  - 주요 기능
  - 설정 방법
  - 배포 방법
- **읽을 대상**: GitHub 방문자
- **크기**: ~7KB

### 2. **SETUP.md** (상세 설정 가이드)
- **역할**: 단계별 설치 & 설정 방법
- **내용**:
  - Google Cloud 프로젝트 생성
  - 구글시트 준비
  - config.js 설정
  - 로컬 테스트
  - 데이터 저장 (선택사항)
- **읽을 대상**: 첫 설정하는 사람
- **크기**: ~8KB

### 3. **GITHUB_GUIDE.md** (GitHub 초보자용)
- **역할**: Git & GitHub 사용법
- **내용**:
  - GitHub 계정 만들기
  - Git 설치
  - 저장소 생성 & 업로드
  - GitHub Pages 배포
  - 문제 해결
- **읽을 대상**: GitHub 처음 사용하는 사람
- **크기**: ~7KB

### 4. **QUICKSTART.txt** (빠른 참조)
- **역할**: 빠른 체크리스트
- **내용**: 10분 안에 해야 할 일
- **읽을 대상**: 급할 때
- **크기**: ~2KB

---

## 📋 설정 & 보안 파일 (2개)

### **.gitignore** (보안)
```
# 이 파일들은 GitHub에 올리지 않음 (중요!)
config/credentials.json  # API 키
.env                     # 환경 변수
*.key, *.pem            # 암호화 키
```
- **역할**: GitHub에 올릴 때 제외할 파일 지정
- **수정**: 하면 안 됨
- **중요성**: 🚨 API 키 유출 방지
- **크기**: ~1KB

---

## 📊 Google Apps Script (선택사항)

### **docs/appscript-webhook.gs**
- **역할**: Google Sheets에 데이터 저장하는 서버
- **언제 필요?**
  - 기본: 게임만 하고 결과는 저장 안 함
  - 이 파일: 게임 결과를 구글시트에 자동 저장하고 싶을 때
- **사용 방법**:
  1. [Google Apps Script](https://script.google.com) 이동
  2. 이 파일의 코드 복사 & 붙여넣기
  3. 배포 후 URL을 config.js에 추가
- **건드리면 안 됨**: 코드 자체
- **크기**: ~5KB

---

## 📊 전체 파일 구조

```
balance-game/
│
├─ 🎮 게임 파일 (핵심)
│  ├── index.html      (UI)
│  ├── script.js       (로직)
│  └── style.css       (디자인)
│
├─ ⚙️ 설정 파일
│  └── config/
│      └── config.js   (⭐ 반드시 수정!)
│
├─ 🔌 유틸리티
│  └── utils/
│      └── sheetsAPI.js
│
├─ 📖 가이드
│  ├── README.md
│  ├── SETUP.md
│  ├── GITHUB_GUIDE.md
│  ├── QUICKSTART.txt
│  └── FILES_EXPLANATION.md (이 파일)
│
├─ 🔒 보안
│  └── .gitignore
│
└─ 📊 선택사항
   └── docs/
       └── appscript-webhook.gs
```

---

## 🎯 어떤 파일을 수정해야 할까?

### 1️⃣ **반드시 수정**
- ✅ **config/config.js**: API 키, 시트 ID 입력

### 2️⃣ **선택적 수정** (원할 때)
- ✅ **style.css**: 색상, 폰트 변경
- ✅ **index.html**: 게임 제목, 문구 변경

### 3️⃣ **건드리면 안 됨**
- ❌ **script.js**: 게임 로직
- ❌ **sheetsAPI.js**: API 통신
- ❌ **.gitignore**: 보안 설정
- ❌ 모든 마크다운 파일

---

## 📏 파일 크기 요약

| 파일 | 크기 | 중요도 |
|------|------|--------|
| index.html | 5KB | 🔴 |
| script.js | 12KB | 🔴 |
| style.css | 11KB | 🔴 |
| config.js | 2KB | 🔴🔴🔴 |
| sheetsAPI.js | 4KB | 🔴 |
| README.md | 7KB | 💚 |
| SETUP.md | 8KB | 💚 |
| GITHUB_GUIDE.md | 7KB | 💚 |
| appscript-webhook.gs | 5KB | 💙 (선택) |
| 기타 | 3KB | 💙 |
| **합계** | **~60KB** | |

🔴: 핵심 파일 / 💚: 가이드 / 💙: 선택사항

---

## 🎓 학습 순서

**1. README.md** 읽기 (5분)
  → 전체 개요 파악

**2. QUICKSTART.txt** 읽기 (2분)
  → 체크리스트로 준비 상황 확인

**3. SETUP.md** 읽기 & 따라하기 (20분)
  → 단계별로 설정

**4. config.js** 수정 (2분)
  → API 키 & 시트 ID 입력

**5. 로컬 테스트** (5분)
  → 게임 작동 확인

**6. GitHub 배포** (GITHUB_GUIDE.md 참고)

---

## 💡 팁

- **처음이면**: README.md → SETUP.md → config.js 수정
- **급하면**: QUICKSTART.txt 먼저 읽기
- **GitHub 처음**: GITHUB_GUIDE.md 정독 필수
- **색상 변경**: style.css의 `:root` 섹션 수정
- **질문 추가**: 구글시트만 수정 (코드 수정 불필요)

---

**모든 파일이 정해진 역할을 하고 있습니다. 각 파일의 목적을 알면 프로젝트를 쉽게 관리할 수 있습니다!** 🎉
