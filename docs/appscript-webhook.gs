// ============================================
// Google Apps Script - 데이터 저장 웹훅
// ============================================

// 이 파일을 Google Apps Script 편집기에 복사하여 사용하세요.
// https://script.google.com 에서 새 프로젝트 생성 후 이 코드를 붙여넣으세요.

// ============================================
// 설정
// ============================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // 당신의 시트 ID

// ============================================
// GET 요청: 질문 조회
// ============================================

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getQuestions') {
    return getQuestions();
  }

  return HtmlService.createHtmlOutput('잘못된 요청입니다.');
}

// ============================================
// POST 요청: 선택 저장
// ============================================

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);

    saveChoice(
      params.questionId,
      params.choice,
      params.userName,
      params.timestamp
    );

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: '저장되었습니다.' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// 질문 조회
// ============================================

function getQuestions() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName('Questions');

  if (!sheet) {
    return HtmlService.createHtmlOutput(
      JSON.stringify({ error: 'Questions 시트를 찾을 수 없습니다.' })
    );
  }

  const data = sheet.getRange('A2:F1000').getValues();

  const questions = data
    .filter(row => row[0] && row[1] && row[2] && row[3]) // 필수 필드 확인
    .map(row => ({
      question_id: row[0],
      question: row[1],
      option_a: row[2],
      option_b: row[3],
      category: row[4] || '',
      difficulty: row[5] || '보통'
    }));

  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// 선택 저장
// ============================================

function saveChoice(questionId, choice, userName, timestamp) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let resultsSheet = spreadsheet.getSheetByName('Results');

  // Results 시트가 없으면 생성
  if (!resultsSheet) {
    resultsSheet = spreadsheet.insertSheet('Results');
    resultsSheet.appendRow(['시간', '질문ID', '선택', '사용자']);
  }

  // 데이터 추가
  resultsSheet.appendRow([
    timestamp || new Date().toLocaleString('ko-KR'),
    questionId,
    choice,
    userName
  ]);
}

// ============================================
// 모든 결과 조회 (관리자용)
// ============================================

function getAllResults() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName('Results');

  if (!sheet) {
    return [];
  }

  return sheet.getRange('A2:D' + sheet.getLastRow()).getValues();
}

// ============================================
// 통계 생성 (관리자용)
// ============================================

function generateStatistics() {
  const results = getAllResults();
  const stats = {
    totalChoices: results.length,
    choiceA: 0,
    choiceB: 0,
    byCategory: {},
    byUser: {}
  };

  results.forEach(row => {
    const [timestamp, questionId, choice, userName] = row;

    // 선택지 통계
    if (choice === 'A') stats.choiceA++;
    if (choice === 'B') stats.choiceB++;

    // 사용자별 통계
    if (!stats.byUser[userName]) {
      stats.byUser[userName] = { A: 0, B: 0 };
    }
    stats.byUser[userName][choice]++;
  });

  return stats;
}

// ============================================
// 배포 가이드
// ============================================

/*
1. apps.google.com/script 에서 새 프로젝트 생성

2. 위의 코드를 Code.gs 파일에 복사

3. SPREADSHEET_ID를 당신의 시트 ID로 변경

4. "배포" → "새 배포" 클릭
   - 유형: "웹 앱"
   - 실행: "내 계정"
   - 액세스: "모든 사용자"

5. 배포된 URL 복사 (예: https://script.google.com/macros/d/.../ussedPlease)

6. config.js에 설정:
   CONFIG.WEBHOOK_URL = '위의 URL'

7. 게임에서 자동으로 데이터가 저장됩니다!

*/
