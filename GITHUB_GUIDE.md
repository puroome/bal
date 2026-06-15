# 🚀 GitHub에 올리는 방법 (초보자 가이드)

쌤을 위한 **Git & GitHub 완전 초보자용 가이드**입니다.

## 준비 사항

### 1. GitHub 계정 만들기
1. [github.com](https://github.com) 접속
2. **Sign up** 클릭
3. 이메일, 비밀번호 입력 & 가입

### 2. Git 설치
- **Windows**: [Git for Windows](https://git-scm.com/download/win) 다운로드 & 설치
- **Mac**: [Git for Mac](https://git-scm.com/download/mac) 다운로드 & 설치
- **Linux**: `sudo apt install git`

### 3. Git 설정 (처음 1회만)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## GitHub에 올리기 (5분)

### Step 1: GitHub에서 저장소 생성

1. GitHub 로그인 후 우측 상단 **+** → **New repository**
2. 저장소 이름: `balance-game`
3. **Public** 선택 (공개 저장소)
4. **Create repository** 클릭

### Step 2: 로컬 폴더를 Git 저장소로 초기화

`balance-game` 폴더를 열고 **Command Prompt** 또는 **Terminal**에서:

```bash
cd /path/to/balance-game  # balance-game 폴더로 이동

git init                   # 폴더를 Git 저장소로 초기화
git add .                  # 모든 파일 추가
git commit -m "초기 커밋: 교육용 밸런스 게임"  # 첫 번째 버전 저장
```

### Step 3: 원격 저장소 연결

GitHub에서 생성한 저장소 페이지에서 **Code** 버튼을 클릭해서 HTTPS URL 복사.

그 다음:

```bash
git branch -M main         # main 브랜치로 이름 변경
git remote add origin https://github.com/[username]/balance-game.git
git push -u origin main    # GitHub에 업로드
```

✅ 완료! GitHub에 올라갔습니다!

---

## 이후 수정 사항 업로드

게임을 수정할 때마다:

```bash
git add .                  # 변경사항 추가
git commit -m "기능 설명"    # 변경사항 설명 (예: "난이도 색상 변경")
git push                   # GitHub에 업로드
```

---

## GitHub Pages로 배포 (무료 호스팅)

게임을 웹에서 바로 플레이하게 하려면:

### Step 1: 저장소 설정
1. GitHub 저장소 페이지 → **Settings**
2. 좌측 메뉴 → **Pages**
3. **Source** → **Deploy from a branch**
4. Branch → **main** 선택 → **Save**

### Step 2: 배포 URL 확인
잠깐 기다리면 (1-2분) 다음과 같은 URL이 표시됩니다:
```
https://[username].github.io/balance-game
```

### Step 3: README.md에 링크 추가
```markdown
## 🎮 지금 플레이하기

[여기서 게임을 플레이하세요!](https://[username].github.io/balance-game)
```

✅ 이제 학생들이 링크만 클릭하면 게임을 할 수 있습니다!

---

## 🔒 보안: API 키 보호

**중요**: API 키가 GitHub에 올라가면 안 됩니다!

### ✅ 이미 설정됨
- `.gitignore` 파일에 다음이 포함됨:
  ```
  config/credentials.json
  .env
  *.key
  ```

- `config/config.js`에는 예시만 있음:
  ```javascript
  const CONFIG = {
      API_KEY: 'YOUR_API_KEY_HERE',
  };
  ```

### 💡 API 키는 어디에?
1. **로컬에서만**: `config/config.js`에 직접 입력 (GitHub 올리기 전)
2. **배포 후**: 환경 변수 또는 사용자 입력으로 처리

---

## 자주 하는 실수 & 해결

### ❌ "error: remote origin already exists"
```bash
git remote remove origin  # 기존 연결 제거
git remote add origin https://github.com/[username]/balance-game.git
```

### ❌ "fatal: not a git repository"
```bash
git init  # 다시 초기화
```

### ❌ "Permission denied (publickey)"
```bash
# SSH 키가 필요합니다. HTTPS 사용을 권장:
git remote set-url origin https://github.com/[username]/balance-game.git
```

### ❌ "large files 경고"
```bash
# 문제 없음, 이 프로젝트는 파일이 작음
```

---

## 팁: 좋은 커밋 메시지 작성

```bash
# ❌ 안 좋은 예
git commit -m "수정"

# ✅ 좋은 예
git commit -m "선택지 버튼 호버 효과 추가"
git commit -m "난이도 색상 변경 (쉬움=초록색)"
git commit -m "모바일 반응형 CSS 수정"
git commit -m "Google Sheets API 에러 핸들링 개선"
```

**이점**: 나중에 프로젝트 진행 과정을 볼 수 있음

---

## GitHub에서 다시 다운로드

다른 컴퓨터에서:

```bash
git clone https://github.com/[username]/balance-game.git
cd balance-game
python -m http.server 8000
```

---

## 📚 추가 학습

- [GitHub 공식 튜토리얼](https://docs.github.com/ko)
- [Git 한국어 가이드](https://git-scm.com/book/ko/v2)
- YouTube: "Git 초보자 강좌" 검색

---

## 🎉 완료!

이제 쌤의 밸런스 게임이 GitHub에 공개되었습니다!

학생들과 공유하려면:
```
🔗 https://github.com/[username]/balance-game
🎮 https://[username].github.io/balance-game (게임 플레이)
```

행운을 빕니다! 🚀
