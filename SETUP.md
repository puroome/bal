# 🎮 교육용 밸런스 게임 - 설치 가이드

## 📋 빠른 체크리스트

- [ ] Google Cloud 프로젝트 생성 & API 활성화
- [ ] 구글시트 준비 (ID 확인)
- [ ] `config/config.js` 설정
- [ ] 로컬 서버에서 테스트
- [ ] GitHub에 업로드

---

## 1️⃣ Google Cloud 설정 (5분)

### Step 1: 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com) 이동
2. **새 프로젝트** 클릭
3. 프로젝트 이름: `balance-game` (또는 자유)
4. **만들기** 클릭

### Step 2: Google Sheets API 활성화
1. 상단 검색: `Google Sheets API` 검색
2. **Google Sheets API** 클릭
3. **활성화** 클릭

### Step 3: API 키 생성
1. 좌측 메뉴: **사용자 인증 정보**
2. **사용자 인증 정보 만들기** → **API 키**
3. 생성된 키 **복사**

---

## 2️⃣ 구글시트 준비 (2분)

### Step 1: 새 시트 생성
1. [Google Sheets](https://sheets.google.com) 이동
2. **새 스프레드시트** 클릭
3. 이름: `밸런스 게임 데이터`

### Step 2: 헤더 작성
첫 번째 시트를 `Questions` 이름으로 변경, 다음을 A1 행에 입력:

```
question_id | question | option_a | option_b | category | difficulty
```

### Step 3: 샘플 데이터 추가 (A2부터)

| question_id | question | option_a | option_b | category | difficulty |
|---|---|---|---|---|---|
| q_001 | 당신의 선호 계절은? | 봄 | 가을 | 일반 | 쉬움 |
| q_002 | 과학 중 가장 흥미로운 분야는? | 물리학 | 생물학 | 과학 | 보통 |
| q_003 | 좋아하는 문학 장르는? | 소설 | 시 | 문학 | 어려움 |

### Step 4: 시트 ID 확인
주소창 URL에서 이 부분을 복사:
```
https://docs.google.com/spreadsheets/d/[이 부분]/edit
```

---

## 3️⃣ config.js 설정 (1분)

`config/config.js` 파일을 편집하세요:

```javascript
const CONFIG = {
    // 1단계에서 복사한 API 키
    API_KEY: 'YOUR_API_KEY_HERE',  // ← 여기에 붙여넣기
    
    // 2단계에서 확인한 시트 ID
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',  // ← 여기에 붙여넣기
    
    GAME: {
        MAX_QUESTIONS: 0,  // 0 = 전체
        RANDOMIZE_QUESTIONS: true
    }
};
```

---

## 4️⃣ 로컬 테스트

### 방법 1: Python 서버 (권장)
```bash
# balance-game 폴더에서
python -m http.server 8000
```

### 방법 2: Node.js http-server
```bash
npx http-server
```

### 방법 3: Live Server (VS Code 확장)
- VS Code에서 `index.html`을 우클릭
- **Open with Live Server**

✅ `http://localhost:8000` 접속 → 게임 시작!

---

## 5️⃣ 데이터 저장 (선택사항)

### 옵션 A: 읽기만 (기본)
- 게임 진행 ✅
- 결과 저장 ❌ (콘솔에만 표시)

### 옵션 B: 읽기 + 쓰기 (권장)

**Google Apps Script 웹훅 사용:**

1. [Google Apps Script](https://script.google.com) 이동
2. **새 프로젝트** 만들기
3. `docs/appscript-webhook.gs` 코드 복사 & 붙여넣기
4. `SPREADSHEET_ID` 수정
5. **배포** → **새 배포** → **웹 앱**
   - 실행: "자신의 계정"
   - 액세스: "모든 사용자"
6. 배포 URL 복사
7. `config/config.js`에 추가:
   ```javascript
   CONFIG.WEBHOOK_URL = '배포된 URL';
   ```

---

## 6️⃣ GitHub에 업로드

```bash
git init
git add .
git commit -m "초기 커밋: 교육용 밸런스 게임"
git branch -M main
git remote add origin https://github.com/[username]/balance-game.git
git push -u origin main
```

---

## 🎯 체크: 모든 기능 작동하나요?

### ✅ 확인 목록

- [ ] 게임 시작 화면 보이는가
- [ ] 이름 입력 후 게임 시작 가능한가
- [ ] 선택지 A/B 클릭 가능한가
- [ ] 진행도바가 움직이는가
- [ ] 모든 질문이 표시되는가
- [ ] 결과 화면에 통계가 나오는가
- [ ] (옵션) 구글시트에 결과가 기록되는가

---

## 🐛 문제 해결

### 질문이 로드되지 않음
```
→ 콘솔(F12) 확인
→ API 키 유효한지 확인
→ 시트 ID가 맞는지 확인
→ 시트가 공개 상태인지 확인
```

### 결과가 저장되지 않음
```
→ Google Apps Script 배포 확인
→ WEBHOOK_URL이 설정되었는지 확인
→ 네트워크 탭에서 요청 확인
```

### 스타일이 이상함
```
→ 캐시 삭제 (Ctrl+Shift+Delete)
→ 시크릿 창에서 다시 열기
```

---

## 📚 추가 커스터마이징

### 카테고리별 게임 분류
```javascript
// script.js의 updateCategoryFilter() 활용
```

### 난이도별 색상 변경
```javascript
// style.css의 .difficulty-* 클래스 수정
```

### 게임 진행 속도 조정
```javascript
// script.js 라인 ~261
setTimeout(() => { ... }, 600);  // ← 시간(ms) 조정
```

---

## 🚀 배포 옵션

### GitHub Pages (무료)
```bash
# 저장소 Settings → Pages
# Branch: main 선택
# https://[username].github.io/balance-game
```

### Vercel (추천, 무료)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

---

## 📞 질문?

- 콘솔(F12 > Console)에서 에러 메시지 확인
- Google Cloud Console에서 API 할당량 확인
- GitHub Issues에서 문의하기

---

**행운을 빕니다! 🎉**
