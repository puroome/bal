// ============================================
// 설정 파일 - config.js
// ============================================

const CONFIG = {
    // Google Sheets ID (구글시트 URL에서 추출)
    SPREADSHEET_ID: '1Y2dqBgXPsiaicWc9hw7MFfHV4mRWWBVtk0-l041bnHI',

    // Google Cloud API 키 (읽기 권한)
    API_KEY: 'AIzaSyACWvmyWIGMFCsETA4voj9tTBqku338NYM',

    // Google Apps Script 웹훅 URL (선택 결과 저장)
    WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbyYg7Frc_JjuiJuUfBejL_Ckz2G-HQb-MKtBSWZW9xiKcT_R-1xI3jEtQorJkTL_u-m/exec',

    // Firebase Realtime Database URL (선택 결과 저장/조회)
    FIREBASE_DB_URL: 'https://balance-game-bf19e-default-rtdb.asia-southeast1.firebasedatabase.app',

    // 게임 설정
    GAME: {
        // 한 번에 보여줄 질문 수 (0이면 전체)
        MAX_QUESTIONS: 0,
        
        // 질문 순서 무작위화
        RANDOMIZE_QUESTIONS: false,
        
        // 난이도별 색상
        DIFFICULTY_COLORS: {
            '쉬움': '#4CAF50',
            '보통': '#2196F3',
            '어려움': '#FF9800'
        }
    }
};
