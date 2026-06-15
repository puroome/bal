// ============================================
// 게임 상태 관리
// ============================================

const gameState = {
    userName: '',
    currentQuestionIndex: 0,
    questions: [],
    choices: [], // {questionId, choice, question, timestamp}
    categoryFilter: '',
    isPlaying: false
};

// ============================================
// DOM 요소 참조
// ============================================

const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen')
};

const controls = {
    startBtn: document.getElementById('startBtn'),
    quitBtn: document.getElementById('quitBtn'),
    restartBtn: document.getElementById('restartBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    userNameInput: document.getElementById('userName'),
    categoryFilter: document.getElementById('categoryFilter')
};

const gameElements = {
    questionText: document.getElementById('questionText'),
    choiceA: document.getElementById('choiceA'),
    choiceB: document.getElementById('choiceB'),
    choiceAText: document.getElementById('choiceAText'),
    choiceBText: document.getElementById('choiceBText'),
    progressBar: document.getElementById('progressBar'),
    questionCount: document.getElementById('questionCount'),
    totalCount: document.getElementById('totalCount'),
    categoryTag: document.getElementById('categoryTag'),
    difficultyTag: document.getElementById('difficultyTag')
};

const resultElements = {
    playerName: document.getElementById('playerName'),
    statA: document.getElementById('statA'),
    statB: document.getElementById('statB'),
    statTotal: document.getElementById('statTotal'),
    chartContent: document.getElementById('chartContent')
};

// ============================================
// 초기화
// ============================================

async function initGame() {
    try {
        showLoading(true);
        
        // Google Sheets API 초기화
        await SheetsAPI.init();
        
        // 질문 로드
        const questions = await SheetsAPI.loadQuestions();
        gameState.questions = questions;
        
        // 카테고리 필터 업데이트
        updateCategoryFilter(questions);
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        showLoading(false);
    } catch (error) {
        console.error('초기화 실패:', error);
        showError('게임을 불러올 수 없습니다. 콘솔을 확인하세요.');
    }
}

function setupEventListeners() {
    controls.startBtn.addEventListener('click', startGame);
    controls.quitBtn.addEventListener('click', quitGame);
    controls.restartBtn.addEventListener('click', () => {
        resetGame();
        showScreen('start');
    });
    controls.downloadBtn.addEventListener('click', downloadResults);
    
    gameElements.choiceA.addEventListener('click', () => selectChoice('A'));
    gameElements.choiceB.addEventListener('click', () => selectChoice('B'));
    
    // Enter 키로 게임 시작
    controls.userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGame();
    });
}

// ============================================
// 카테고리 필터 설정
// ============================================

function updateCategoryFilter(questions) {
    const categories = [...new Set(questions.map(q => q.category))].filter(Boolean);
    const select = controls.categoryFilter;
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        gameState.categoryFilter = e.target.value;
    });
}

// ============================================
// 게임 시작
// ============================================

function startGame() {
    const userName = controls.userNameInput.value.trim();
    
    if (!userName) {
        showError('이름을 입력해주세요!');
        return;
    }

    if (gameState.questions.length === 0) {
        showError('불러올 수 있는 질문이 없습니다.');
        return;
    }

    gameState.userName = userName;
    gameState.choices = [];
    gameState.currentQuestionIndex = 0;
    gameState.isPlaying = true;

    // 필터링 적용
    let filteredQuestions = gameState.questions;
    if (gameState.categoryFilter) {
        filteredQuestions = gameState.questions.filter(
            q => q.category === gameState.categoryFilter
        );
    }

    if (filteredQuestions.length === 0) {
        showError('선택한 카테고리에 질문이 없습니다.');
        return;
    }

    // 질문 순서 무작위화 (선택사항)
    gameState.questions = filteredQuestions.sort(() => Math.random() - 0.5);

    showScreen('game');
    loadNextQuestion();
}

// ============================================
// 질문 로드
// ============================================

function loadNextQuestion() {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
        return;
    }

    const question = gameState.questions[gameState.currentQuestionIndex];

    // 질문 텍스트
    gameElements.questionText.textContent = question.question;

    // 선택지
    gameElements.choiceAText.textContent = question.option_a;
    gameElements.choiceBText.textContent = question.option_b;

    // 메타데이터
    updateQuestionMeta(question);

    // 진행도 업데이트
    const progress = ((gameState.currentQuestionIndex) / gameState.questions.length) * 100;
    gameElements.progressBar.style.width = progress + '%';
    gameElements.questionCount.textContent = gameState.currentQuestionIndex + 1;
    gameElements.totalCount.textContent = gameState.questions.length;

    // 선택 버튼 초기화
    gameElements.choiceA.classList.remove('selected');
    gameElements.choiceB.classList.remove('selected');
    gameElements.choiceA.disabled = false;
    gameElements.choiceB.disabled = false;
}

function updateQuestionMeta(question) {
    // 카테고리 태그
    gameElements.categoryTag.textContent = question.category || '미분류';
    gameElements.categoryTag.className = 'tag tag-category';

    // 난이도 태그
    const diffText = question.difficulty || '보통';
    gameElements.difficultyTag.textContent = diffText;
    gameElements.difficultyTag.className = `tag tag-difficulty difficulty-${diffText}`;
}

// ============================================
// 선택 처리
// ============================================

async function selectChoice(choice) {
    const question = gameState.questions[gameState.currentQuestionIndex];

    // UI 피드백
    const button = choice === 'A' ? gameElements.choiceA : gameElements.choiceB;
    button.classList.add('selected');
    gameElements.choiceA.disabled = true;
    gameElements.choiceB.disabled = true;

    // 선택 기록
    gameState.choices.push({
        questionId: question.question_id,
        choice: choice,
        question: question.question,
        category: question.category,
        timestamp: new Date().toLocaleString('ko-KR')
    });

    // 구글시트에 저장
    try {
        await SheetsAPI.saveChoice(
            question.question_id,
            choice,
            gameState.userName
        );
    } catch (error) {
        console.warn('선택 저장 실패:', error);
        // 게임은 계속 진행
    }

    // 다음 질문으로 (0.6초 후)
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadNextQuestion();
    }, 600);
}

// ============================================
// 게임 종료
// ============================================

function endGame() {
    gameState.isPlaying = false;
    calculateResults();
    showScreen('result');
}

function calculateResults() {
    const countA = gameState.choices.filter(c => c.choice === 'A').length;
    const countB = gameState.choices.filter(c => c.choice === 'B').length;
    const total = gameState.choices.length;

    resultElements.playerName.textContent = gameState.userName;
    resultElements.statA.textContent = countA;
    resultElements.statB.textContent = countB;
    resultElements.statTotal.textContent = total;

    // 카테고리별 분석
    displayCategoryAnalysis();
}

function displayCategoryAnalysis() {
    const categoryData = {};

    gameState.choices.forEach(choice => {
        const category = choice.category || '미분류';
        if (!categoryData[category]) {
            categoryData[category] = { A: 0, B: 0 };
        }
        categoryData[category][choice.choice]++;
    });

    const chartHTML = Object.entries(categoryData)
        .map(([category, data]) => {
            const total = data.A + data.B;
            const percentA = ((data.A / total) * 100).toFixed(1);
            const percentB = ((data.B / total) * 100).toFixed(1);

            return `
                <div class="category-stat">
                    <h4>${category}</h4>
                    <div class="stat-bar">
                        <div class="bar-segment bar-a" style="width: ${percentA}%; title="A: ${data.A}개">
                            <span>${data.A}</span>
                        </div>
                        <div class="bar-segment bar-b" style="width: ${percentB}%;" title="B: ${data.B}개">
                            <span>${data.B}</span>
                        </div>
                    </div>
                    <div class="stat-text">A: ${percentA}% | B: ${percentB}%</div>
                </div>
            `;
        })
        .join('');

    resultElements.chartContent.innerHTML = chartHTML || '<p>분석 데이터가 없습니다.</p>';
}

// ============================================
// UI 관리
// ============================================

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showLoading(show) {
    document.getElementById('loadingSpinner').classList.toggle('hidden', !show);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

function closeError() {
    document.getElementById('errorMessage').classList.remove('show');
}

// ============================================
// 게임 나가기 / 재시작
// ============================================

function quitGame() {
    if (confirm('정말 나가시겠습니까? 진행 상황이 저장되지 않습니다.')) {
        resetGame();
        showScreen('start');
    }
}

function resetGame() {
    gameState.userName = '';
    gameState.currentQuestionIndex = 0;
    gameState.choices = [];
    gameState.isPlaying = false;
    controls.userNameInput.value = '';
    controls.userNameInput.focus();
}

// ============================================
// 결과 다운로드
// ============================================

function downloadResults() {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `balance_game_${gameState.userName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateCSV() {
    let csv = 'BOM,이름,질문,선택,카테고리,시간\n';
    csv += '\uFEFF'; // UTF-8 BOM

    gameState.choices.forEach((choice, index) => {
        csv += `${index + 1},"${gameState.userName}","${choice.question}","${choice.choice}","${choice.category}","${choice.timestamp}"\n`;
    });

    return csv;
}

// ============================================
// 페이지 로드 시 초기화
// ============================================

document.addEventListener('DOMContentLoaded', initGame);
