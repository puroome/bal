# 🎮 교육용 밸런스 게임

> 구글시트로 동적으로 관리되는 선택지 비교 게임 - GitHub + Google Sheets API

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat&logo=html5&logoColor=white)

## 📌 개요

- **웹 기반**: HTML5, CSS3, Vanilla JS (프레임워크 불필요)
- **실시간 데이터 관리**: Google Sheets API로 질문 동적 로드 & 결과 저장
- **교육용 최적화**: 한국 고등학생 맞춤형 (난이도, 카테고리 분류)
- **완전 무료**: Google Sheets, GitHub, 구글 Cloud API(무료 티어) 활용
- **반응형 디자인**: 모바일 ~ 데스크톱 완벽 대응

## 🚀 빠른 시작 (3단계)

### 1️⃣ Google Cloud API 키 발급
```bash
# https://console.cloud.google.com
# 1. Google Sheets API 활성화
# 2. API 키 생성 & 복사
```

### 2️⃣ 구글시트 만들기
```bash
# https://sheets.google.com
# 1. 새 시트 생성
# 2. "Questions" 시트에 데이터 입력
#    - question_id | question | option_a | option_b | category | difficulty
# 3. 시트 ID 확인 (URL에서 추출)
```

### 3️⃣ config.js 설정 & 실행
```javascript
// config/config.js
const CONFIG = {
    API_KEY: 'YOUR_API_KEY',  // 1단계 API 키
    SPREADSHEET_ID: 'YOUR_SHEET_ID'  // 2단계 시트 ID
};
```

```bash
python -m http.server 8000
# http://localhost:8000 접속!
```

**📖 자세한 설정 가이드**: [SETUP.md](./SETUP.md)

## 📁 프로젝트 구조

```
balance-game/
├── index.html           # 메인 페이지
├── script.js            # 게임 로직 (700+ 줄)
├── style.css            # 반응형 스타일
├── config/
│   └── config.js        # Google Sheets API 설정
├── utils/
│   └── sheetsAPI.js     # API 래퍼 함수
├── docs/
│   └── appscript-webhook.gs  # Google Apps Script (선택)
├── SETUP.md             # 상세 설정 가이드
└── .gitignore           # 보안 (API 키 제외)
```

## 🎮 게임 플레이 흐름

```
시작 화면
  ↓
이름 입력 & 카테고리 선택
  ↓
게임 시작 (질문 로드)
  ↓
선택지 A vs B 비교
  ↓
선택 (구글시트에 자동 저장)
  ↓
다음 질문...
  ↓
결과 화면
  ├─ 선택지 A/B 비율
  ├─ 카테고리별 분석
  └─ CSV 다운로드
```

## 🎯 주요 기능

| 기능 | 상태 |
|------|------|
| 구글시트에서 질문 자동 로드 | ✅ |
| 카테고리/난이도 필터링 | ✅ |
| 선택 결과 실시간 저장 | ✅ (WebHook) |
| 통계 분석 (그래프) | ✅ |
| CSV 다운로드 | ✅ |
| 반응형 디자인 | ✅ |
| 다크모드 대응 | ✅ |
| 카테고리별 색상 분류 | ✅ |

## 🛠 커스터마이징

### 난이도별 색상 변경
```css
/* style.css */
.difficulty-쉬움 {
    background-color: rgba(16, 185, 129, 0.1);
}
```

### 게임 속도 조정
```javascript
// script.js (라인 ~261)
setTimeout(() => { 
    gameState.currentQuestionIndex++;
    loadNextQuestion();
}, 600);  // ← 밀리초(ms) 조정
```

### 새로운 질문 추가
```
구글시트 "Questions" 시트 → A행 추가
자동으로 게임에 반영됨!
```

## 💾 데이터 관리

### 읽기만 (기본)
- 게임 플레이: ✅
- 결과 저장: ❌

### 읽기 + 쓰기 (권장)
Google Apps Script 웹훅 사용:
1. `docs/appscript-webhook.gs` 코드 복사
2. [Google Apps Script](https://script.google.com)에 붙여넣기
3. 배포 후 URL을 `config.js`에 추가

**상세 가이드**: [SETUP.md > 5️⃣ 데이터 저장](./SETUP.md#5️⃣-데이터-저장-선택사항)

## 🌐 배포

### GitHub Pages (무료, 추천)
```bash
git push origin main
# 저장소 Settings → Pages → main 선택
# https://[username].github.io/balance-game
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## 📊 구글시트 데이터 형식

**Questions 시트 (필수)**

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| question_id | question | option_a | option_b | category | difficulty |
| q_001 | 좋아하는 계절? | 봄 | 가을 | 일반 | 쉬움 |
| q_002 | 과학 분야? | 물리학 | 생물학 | 과학 | 보통 |

**Results 시트 (자동 생성)**

| A | B | C | D |
|---|---|---|---|
| 시간 | 질문ID | 선택 | 사용자 |

## 🐛 문제 해결

### 질문이 로드되지 않음
```
❌ API 키가 잘못됨
❌ 시트 ID가 틀림
❌ 시트가 비공개 상태

✅ F12 > Console에서 에러 메시지 확인
✅ Google Cloud Console에서 API 활성화 확인
✅ 시트 공유 설정 확인 (링크 공유 또는 서비스 계정 추가)
```

### 결과가 저장되지 않음
```
❌ Google Apps Script 배포 안 함
❌ WEBHOOK_URL이 설정되지 않음

✅ docs/appscript-webhook.gs 배포 확인
✅ config.js에 URL 추가 확인
✅ 네트워크 탭에서 POST 요청 확인
```

### 스타일이 이상함
```bash
# 캐시 삭제
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)

# 또는 시크릿 창에서 다시 열기
```

## 📚 학습 자료

- [Google Sheets API 문서](https://developers.google.com/sheets/api)
- [Google Apps Script 가이드](https://developers.google.com/apps-script)
- [Vanilla JS 최적화](https://developer.mozilla.org/ko/docs/Web/JavaScript)

## 🎓 교육적 활용

### 고등학교 수업
- **국어**: 선택지 해석 능력 평가
- **과학**: 개념별 선호도 조사
- **역사**: 역사적 사건 이해도 측정
- **진로**: 적성 진단용 설문

### 학생 피드백 수집
- 카테고리별 성향 분석
- 난이도별 정답률 통계
- 개별 학생 선택 패턴 추적

## 🔒 보안

✅ **API 키 보호**
- `.gitignore`에 `config/credentials.json` 포함
- GitHub에는 절대 API 키 업로드 금지

✅ **시트 공유 설정**
- 읽기 전용: "뷰어" 권한
- 쓰기 필요: 서비스 계정 추가 (이메일)

## 📝 라이센스

MIT License - 자유롭게 수정 및 배포 가능

## 👨‍💻 기여

버그 리포트, 기능 요청, Pull Request 환영합니다!

## 📞 문의

- GitHub Issues: 버그 리포트 및 기능 요청
- Discussions: 일반 질문 및 토론

---

**쌤께서 만든 교육용 게임입니다! 🎉**

학생들이 즐겁게 참여할 수 있는 선택 게임으로 수업을 더 재미있게 만들어보세요.
