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
    categoryTag: document.getElementById('categoryTag')
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

    // 질문 순서: 설정이 켜져 있을 때만 무작위화, 아니면 시트 순서 유지
    if (CONFIG.GAME.RANDOMIZE_QUESTIONS) {
        gameState.questions = filteredQuestions.slice().sort(() => Math.random() - 0.5);
    } else {
        gameState.questions = filteredQuestions;
    }

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
}

// ============================================
// 선택 처리
// ============================================

function selectChoice(choice) {
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
        option_a: question.option_a,
        option_b: question.option_b,
        category: question.category,
        timestamp: new Date().toLocaleString('ko-KR')
    });

    // Firebase + 구글시트에 둘 다 저장 (기다리지 않고 백그라운드로 → 즉시 다음 문항)
    const ts = new Date().toISOString();
    saveChoiceToFirebase({
        name: gameState.userName,
        questionId: question.question_id,
        choice: choice,
        category: question.category || '',
        ts: ts
    });
    saveChoiceToSheet({
        userName: gameState.userName,
        questionId: question.question_id,
        choice: choice,
        timestamp: ts
    });

    // 다음 질문으로 (0.6초 후)
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadNextQuestion();
    }, 600);
}

// Firebase Realtime Database 에 선택 저장 (fire-and-forget)
function saveChoiceToFirebase(data) {
    if (!CONFIG.FIREBASE_DB_URL) return;
    const url = `${CONFIG.FIREBASE_DB_URL}/results.json`;
    // await 하지 않음: 네트워크 응답을 기다리지 않아 선택 반응이 즉시 일어남
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
    }).catch(err => console.warn('Firebase 저장 실패:', err));
}

// 구글시트(Apps Script 웹훅)에 선택 저장 (fire-and-forget, 백업용)
function saveChoiceToSheet(data) {
    if (!CONFIG.WEBHOOK_URL) return;
    // await 하지 않음: 시트 저장은 백그라운드로만 처리(느려도 화면 반응에 영향 없음)
    fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true
    }).catch(err => console.warn('시트 저장 실패:', err));
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
    resultElements.playerName.textContent = gameState.userName;
    
    // 선택 결과 표시
    displayChoices();
}

function displayChoices() {
    const choicesDisplay = document.getElementById('choicesDisplay');
    
    const choicesHTML = gameState.choices
        .map((choice, index) => `
            <div class="choice-result">
                <div class="question-num">문제 ${index + 1}</div>
                <div class="question-text">${choice.question}</div>
                <div class="answer-text">내 선택: <strong>${choice.choice === 'A' ? choice.option_a : choice.option_b}</strong></div>
            </div>
        `)
        .join('');
    
    choicesDisplay.innerHTML = choicesHTML || '<p>선택 결과가 없습니다.</p>';
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
// 페이지 로드 시 초기화
// ============================================

document.addEventListener('DOMContentLoaded', initGame);
