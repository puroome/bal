// ============================================
// Google Sheets API 래퍼
// ============================================

const SheetsAPI = {
    // Google API 로드
    async init() {
        return new Promise((resolve, reject) => {
            // gapi 라이브러리 로드
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = async () => {
                try {
                    gapi.load('client', async () => {
                        await gapi.client.init({
                            apiKey: CONFIG.API_KEY,
                            discoveryDocs: [
                                'https://sheets.googleapis.com/$discovery/rest?version=v4'
                            ]
                        });
                        resolve();
                    });
                } catch (error) {
                    reject(error);
                }
            };
            script.onerror = () => reject(new Error('Google API 로드 실패'));
            document.head.appendChild(script);
        });
    },

    // 질문 로드
    async loadQuestions() {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: 'Questions!A2:F1000' // 헤더 제외
            });

            const rows = response.result.values || [];

            return rows
                .filter(row => row.length > 0 && row[0]) // 빈 행 제외
                .map((row, index) => ({
                    question_id: row[0] || `q_${index}`,
                    question: row[1] || '',
                    option_a: row[2] || '',
                    option_b: row[3] || '',
                    category: row[4] || '',
                    difficulty: row[5] || '보통'
                }))
                .filter(q => q.question && q.option_a && q.option_b); // 필수 필드 확인
        } catch (error) {
            console.error('질문 로드 실패:', error);
            throw new Error('질문을 불러올 수 없습니다.');
        }
    },

    // 선택 저장
    async saveChoice(questionId, choice, userName) {
        try {
            // "Results" 시트 존재 확인 및 생성
            await this.ensureResultsSheet();

            const now = new Date().toLocaleString('ko-KR');
            const values = [[now, questionId, choice, userName]];

            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: 'Results!A:D',
                valueInputOption: 'RAW',
                resource: { values }
            });

            console.log(`선택 저장: ${questionId} -> ${choice}`);
        } catch (error) {
            console.error('선택 저장 실패:', error);
            // 에러가 발생해도 게임은 계속 진행
        }
    },

    // Results 시트 자동 생성
    async ensureResultsSheet() {
        try {
            const spreadsheet = await gapi.client.sheets.spreadsheets.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID
            });

            const sheetNames = spreadsheet.result.sheets.map(sheet => sheet.properties.title);

            if (!sheetNames.includes('Results')) {
                // Results 시트 생성
                await gapi.client.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: CONFIG.SPREADSHEET_ID,
                    resource: {
                        requests: [
                            {
                                addSheet: {
                                    properties: {
                                        title: 'Results'
                                    }
                                }
                            }
                        ]
                    }
                });

                // 헤더 추가
                await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: CONFIG.SPREADSHEET_ID,
                    range: 'Results!A1:D1',
                    valueInputOption: 'RAW',
                    resource: {
                        values: [['시간', '질문ID', '선택', '사용자']]
                    }
                });

                console.log('Results 시트 생성됨');
            }
        } catch (error) {
            console.error('Results 시트 확인 실패:', error);
        }
    },

    // 모든 결과 조회 (관리자용)
    async loadAllResults() {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: 'Results!A2:D1000'
            });

            return response.result.values || [];
        } catch (error) {
            console.error('결과 조회 실패:', error);
            return [];
        }
    }
};

// ============================================
// 대체: fetch 기반 공개 시트 읽기 (API 키 불필요)
// ============================================

const SheetsAPIPublic = {
    // 공개 시트에서 데이터 읽기
    async loadQuestionsPublic() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/Questions!A2:F1000?key=${CONFIG.API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.values) {
                throw new Error('데이터 없음');
            }

            return data.values
                .filter(row => row.length > 0 && row[0])
                .map((row, index) => ({
                    question_id: row[0] || `q_${index}`,
                    question: row[1] || '',
                    option_a: row[2] || '',
                    option_b: row[3] || '',
                    category: row[4] || '',
                    difficulty: row[5] || '보통'
                }))
                .filter(q => q.question && q.option_a && q.option_b);
        } catch (error) {
            console.error('공개 시트 로드 실패:', error);
            throw error;
        }
    },

    // 선택 저장 (Apps Script 웹훅 사용)
    async saveChoiceViaWebhook(questionId, choice, userName) {
        try {
            // 이 부분은 Google Apps Script 웹훅이 필요합니다.
            // Apps Script 배포 URL을 CONFIG.WEBHOOK_URL에 설정하세요.
            const response = await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify({
                    questionId,
                    choice,
                    userName,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('웹훅 실패');
            }

            console.log('웹훅으로 선택 저장됨');
        } catch (error) {
            console.error('웹훅 저장 실패:', error);
        }
    }
};
