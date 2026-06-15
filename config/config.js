// ============================================
// 설정 파일 - config.js
// ============================================

const CONFIG = {
    // Google Sheets ID (공개 시트의 URL에서 추출)
    // 예: https://docs.google.com/spreadsheets/d/[이 부분]/edit
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',

    // Google Cloud API 키 (읽기만 필요한 경우)
    // https://console.cloud.google.com 에서 생성
    API_KEY: 'AIzaSyAvDwxZD3jWf0ydox6NGP4nzWBDKJ46aRk',

    // Google OAuth 2.0 클라이언트 ID (쓰기가 필요한 경우)
    // CLIENT_ID: 'YOUR_CLIENT_ID_HERE',

    // Google Apps Script 웹훅 URL (대안: 공개 시트에서만 읽고 앱스크립트로 저장)
    // WEBHOOK_URL: 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent?action=saveChoice',

    // 게임 설정
    GAME: {
        // 한 번에 보여줄 질문 수 (0이면 전체)
        MAX_QUESTIONS: 0,
        
        // 질문 순서 무작위화
        RANDOMIZE_QUESTIONS: true,
        
        // 난이도별 색상
        DIFFICULTY_COLORS: {
            '쉬움': '#4CAF50',
            '보통': '#2196F3',
            '어려움': '#FF9800'
        }
    }
};

// ============================================
// 설정 가이드
// ============================================

/*
1. Google Cloud Console 설정:
   - https://console.cloud.google.com 이동
   - 새 프로젝트 생성
   - "Google Sheets API" 활성화
   - API 키 생성 및 복사

2. Google Sheets 준비:
   - 새 시트 생성 또는 기존 시트 사용
   - 첫 번째 시트 이름을 "Questions"로 변경
   - 시트 URL에서 ID 추출: https://docs.google.com/spreadsheets/d/[ID]/edit
   - 시트 ID를 SPREADSHEET_ID에 설정

3. 헤더 행 (A1:F1):
   A1: question_id
   B1: question
   C1: option_a
   D1: option_b
   E1: category
   F1: difficulty

4. 샘플 데이터:
   A2: q_001 | B2: 좋아하는 계절은? | C2: 봄 | D2: 가을 | E2: 일반 | F2: 쉬움

5. 시트 공유:
   - 읽기만 필요: 링크 공유 설정에서 "제한 없음" → "뷰어"
   - 쓰기도 필요: 서비스 계정 이메일 추가
   
   서비스 계정 쓰기 설정:
   - https://console.cloud.google.com/iam-admin/serviceaccounts
   - 서비스 계정 생성
   - JSON 키 다운로드
   - JSON의 "client_email"을 시트에 "수정자"로 공유

*/
