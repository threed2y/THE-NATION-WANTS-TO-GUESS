import { database } from './data.js';

(function() {
    "use strict";

    const GameState = {
        numPlayers: 2,
        currentPlayer: 0,
        scores: [0, 0],
        currentRound: 1,
        totalRounds: 5,
        currentTarget: null,
        isInputLocked: false,
        availableTerms: [],
        timeLeft: 15,
        timerInterval: null
    };

    // DOM Elements
    const DOM = {
        board: document.getElementById('game-board'),
        questionText: document.getElementById('question-text'),
        nextBtn: document.getElementById('next-btn'),
        scoreboard: document.getElementById('multiplayer-scoreboard'),
        turnIndicator: document.getElementById('turn-indicator'),
        timerBar: document.getElementById('timer-bar'),
        timerText: document.getElementById('timer-text'),
        questionBox: document.getElementById('question-box'),
        breakingBadge: document.getElementById('breaking-badge'),
        landingScreen: document.getElementById('landing-screen'),
        gameScreen: document.getElementById('game-screen'),
        startBtn: document.getElementById('start-btn'),
        btn1p: document.getElementById('btn-1p'),
        btn2p: document.getElementById('btn-2p'),
        btn3p: document.getElementById('btn-3p'),
        quitBtn: document.getElementById('quit-btn'),
        quitModal: document.getElementById('quit-modal'),
        modalConfirmBtn: document.getElementById('modal-confirm-btn'),
        modalCancelBtn: document.getElementById('modal-cancel-btn')
    };

    const THEME = {
        text: ['text-red-500', 'text-blue-500', 'text-green-500'],
        bg: ['bg-red-600', 'bg-blue-600', 'bg-green-600'],
        border: ['border-red-600', 'border-blue-600', 'border-green-600']
    };

    // Secure Math.random shuffle (Fisher-Yates)
    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Sanitize text to prevent XSS
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const startGame = () => {
        GameState.scores = Array(GameState.numPlayers).fill(0);
        GameState.currentPlayer = 0;
        GameState.currentRound = 1;
        GameState.availableTerms = shuffle(database);
        
        updateScoreboard();
        loadRound();
    };

    const loadRound = () => {
        GameState.isInputLocked = false;
        DOM.nextBtn.classList.remove('scale-100', 'opacity-100');
        DOM.nextBtn.classList.add('scale-0', 'opacity-0');
        DOM.board.classList.remove('opacity-50', 'pointer-events-none');

        const cp = GameState.currentPlayer;
        const isSolo = GameState.numPlayers === 1;
        DOM.turnIndicator.innerText = isSolo 
            ? `SOLO DEBATE (Round ${GameState.currentRound}/${GameState.totalRounds})`
            : `PLAYER ${cp + 1}'S TURN (Round ${GameState.currentRound}/${GameState.totalRounds})`;
        DOM.turnIndicator.className = `text-xl md:text-3xl font-black uppercase tracking-widest mb-4 drop-shadow-md transition-colors duration-300 ${THEME.text[cp]}`;
        
        DOM.questionBox.className = `w-full bg-[#111] border-l-8 p-4 md:p-6 mb-6 shadow-2xl relative overflow-hidden ${THEME.border[cp]}`;
        DOM.breakingBadge.className = `absolute -top-3 left-4 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mt-4 ${THEME.bg[cp]}`;
        DOM.timerText.className = `absolute top-4 right-4 font-mono font-black text-2xl md:text-4xl ${THEME.text[cp]}`;

        GameState.currentTarget = GameState.availableTerms.pop();
        DOM.questionText.innerHTML = `&quot;${escapeHTML(GameState.currentTarget.clue)}&quot;`;

        // Distractors logic: Exclude current target, pick 8
        let distractors = database.filter(item => item.term !== GameState.currentTarget.term);
        distractors = shuffle(distractors).slice(0, 8);
        
        let gridItems = shuffle([GameState.currentTarget, ...distractors]);
        renderGrid(gridItems);
        startTimer();
    };

    const startTimer = () => {
        clearInterval(GameState.timerInterval);
        GameState.timeLeft = 15;
        DOM.timerText.innerText = `${GameState.timeLeft}s`;
        DOM.timerBar.style.width = '100%';
        DOM.timerBar.className = `h-full transition-all duration-1000 ease-linear ${THEME.bg[GameState.currentPlayer]}`;

        // Force layout recalculation
        void DOM.timerBar.offsetWidth; 

        GameState.timerInterval = setInterval(() => {
            GameState.timeLeft--;
            DOM.timerText.innerText = `${GameState.timeLeft}s`;
            DOM.timerBar.style.width = `${(GameState.timeLeft / 15) * 100}%`;

            if (GameState.timeLeft <= 0) {
                clearInterval(GameState.timerInterval);
                handleTimeout();
            }
        }, 1000);
    };

    const handleTimeout = () => {
        if (GameState.isInputLocked) return;
        GameState.isInputLocked = true;
        DOM.questionText.innerHTML = `TIME'S UP! <span class="text-gray-500">The nation has moved on.</span>`;
        DOM.board.classList.add('opacity-50', 'pointer-events-none');
        endTurn();
    };

    const renderGrid = (items) => {
        DOM.board.innerHTML = '';
        // Use DocumentFragment for performant DOM injection
        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            let borderClasses = "border-brand";
            if ((index + 1) % 3 !== 0) borderClasses += " border-r-[1px]";
            if (index < 6) borderClasses += " border-b-[1px]";

            const isCorrect = item.term === GameState.currentTarget.term;
            const escapedTerm = escapeHTML(item.term);

            const card = document.createElement('div');
            card.className = `relative w-full aspect-[4/3] md:aspect-video perspective-1000 cursor-pointer group card-container tile ${borderClasses}`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.dataset.correct = isCorrect;
            
            card.innerHTML = `
                <div class="w-full h-full absolute top-0 left-0 transform-style-3d shadow-lg card-inner pointer-events-none">
                    <div class="absolute w-full h-full backface-hidden flex items-center justify-center p-2 md:p-6 bg-black group-hover:bg-brand/20 transition-colors pointer-events-none">
                        <h2 class="text-xs md:text-xl lg:text-2xl font-black text-center uppercase tracking-widest text-white leading-tight">
                            ${escapedTerm}
                        </h2>
                    </div>
                    <div class="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4 border-4 border-black status-back pointer-events-none">
                        <h2 class="text-sm md:text-2xl lg:text-3xl font-black text-center uppercase tracking-widest text-white drop-shadow-md"></h2>
                    </div>
                </div>
            `;

            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            fragment.appendChild(card);
        });
        
        DOM.board.appendChild(fragment);
    };

    // Event Delegation for Tile Clicks
    DOM.board.addEventListener('click', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile || GameState.isInputLocked || tile.classList.contains('is-flipped')) return;

        clearInterval(GameState.timerInterval);
        GameState.isInputLocked = true;
        tile.classList.add('is-flipped');

        const isCorrect = tile.dataset.correct === 'true';
        const backFace = tile.querySelector('.status-back');
        const backText = tile.querySelector('.status-back h2');

        if (isCorrect) {
            backFace.classList.add('bg-green-600');
            backText.innerText = "TRUTH BOMBED!";
            GameState.scores[GameState.currentPlayer] += 10;
        } else {
            backFace.classList.add('bg-alert');
            backText.innerText = "FAKE NEWS!";
        }
        
        DOM.board.classList.add('opacity-80');
        endTurn();
    });

    const endTurn = () => {
        updateScoreboard();

        if (GameState.currentRound >= GameState.totalRounds && GameState.currentPlayer === GameState.numPlayers - 1) {
            DOM.nextBtn.innerText = "VIEW FINAL ELECTION RESULTS";
            DOM.nextBtn.classList.remove('bg-alert', 'hover:bg-red-700');
            DOM.nextBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            DOM.nextBtn.onclick = showGameOver;
        } else {
            DOM.nextBtn.innerText = GameState.numPlayers === 1 ? "NEXT STORY ➔" : "NEXT PLAYER ➔";
            DOM.nextBtn.onclick = () => {
                GameState.currentPlayer++;
                if (GameState.currentPlayer >= GameState.numPlayers) {
                    GameState.currentPlayer = 0;
                    GameState.currentRound++;
                }
                loadRound();
            };
        }
        
        DOM.nextBtn.classList.remove('scale-0', 'opacity-0');
        DOM.nextBtn.classList.add('scale-100', 'opacity-100');
    };

    const updateScoreboard = () => {
        DOM.scoreboard.innerHTML = '';
        const isSolo = GameState.numPlayers === 1;
        for (let i = 0; i < GameState.numPlayers; i++) {
            const isActive = (i === GameState.currentPlayer) ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'opacity-40 scale-90';
            const label = isSolo ? 'SCORE' : `P${i + 1}`;
            DOM.scoreboard.innerHTML += `
                <div class="transition-all duration-300 ${isActive} ${THEME.text[i]} flex flex-col items-center">
                    <span>${label}</span>
                    <span class="text-2xl md:text-3xl">${GameState.scores[i] || 0}</span>
                </div>
            `;
        }
    };

    const showGameOver = () => {
        const maxScore = Math.max(...GameState.scores);
        const winners = [];
        for (let i = 0; i < GameState.numPlayers; i++) {
            if (GameState.scores[i] === maxScore) winners.push(`PLAYER ${i + 1}`);
        }
        
        let winnerText = "";
        if (GameState.numPlayers === 1) {
            winnerText = `DEBATE SURVIVED!<br><span class="text-2xl mt-2 text-white block">Final Score: ${GameState.scores[0]}</span>`;
        } else {
            winnerText = winners.length > 1 ? `HUNG PARLIAMENT!<br><span class="text-2xl mt-2 text-white block">TIE BETWEEN ${winners.join(' & ')}</span>` : `${winners[0]} WINS THE MANDATE!`;
        }

        DOM.questionText.innerHTML = `DEBATE CONCLUDED.`;
        
        let finalScoresHtml = '';
        if (GameState.numPlayers > 1) {
            for (let i = 0; i < GameState.numPlayers; i++) {
                finalScoresHtml += `<div class="text-xl md:text-2xl ${THEME.text[i]} font-bold mb-4">Player ${i + 1}: ${GameState.scores[i]} points</div>`;
            }
        }

        DOM.board.innerHTML = `
            <div class="col-span-3 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-[#111] h-full">
                <h2 class="text-4xl md:text-5xl font-black mb-8 text-yellow-400 drop-shadow-md">${winnerText}</h2>
                ${GameState.numPlayers > 1 ? `<div class="mb-8 p-6 border-2 border-gray-700 rounded-lg w-full max-w-sm bg-black/50">${finalScoresHtml}</div>` : ''}
                <button id="reset-game-btn" class="px-8 py-3 bg-brand hover:bg-blue-600 text-white font-black rounded uppercase tracking-widest transition-all">
                    New Debate Session
                </button>
            </div>
        `;
        
        document.getElementById('reset-game-btn').addEventListener('click', resetToLanding);
        DOM.board.classList.remove('opacity-50', 'opacity-80', 'pointer-events-none');
        DOM.nextBtn.classList.add('scale-0', 'opacity-0');
        DOM.turnIndicator.innerText = "FINAL RESULTS";
        DOM.turnIndicator.className = "text-xl md:text-3xl font-black text-white uppercase tracking-widest mb-4";
        clearInterval(GameState.timerInterval);
    };

    const resetToLanding = () => {
        clearInterval(GameState.timerInterval);
        DOM.gameScreen.classList.add('hidden');
        DOM.gameScreen.classList.remove('flex');
        DOM.landingScreen.classList.remove('hidden');
        DOM.nextBtn.classList.add('bg-alert', 'hover:bg-red-700');
        DOM.nextBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    };

    // Setup Listeners
    const setupListeners = () => {
        const setMode = (mode) => {
            GameState.numPlayers = mode;
            const baseClass = "px-4 md:px-8 py-3 border-2 font-black rounded uppercase tracking-widest transition-all ";
            
            DOM.btn1p.className = baseClass + (mode === 1 ? "bg-purple-600 text-white border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]" : "border-gray-600 text-gray-400 hover:border-purple-600 hover:text-purple-400 bg-transparent");
            DOM.btn2p.className = baseClass + (mode === 2 ? "bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400 bg-transparent");
            DOM.btn3p.className = baseClass + (mode === 3 ? "bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "border-gray-600 text-gray-400 hover:border-blue-600 hover:text-blue-400 bg-transparent");
        };

        DOM.btn1p.addEventListener('click', () => setMode(1));
        DOM.btn2p.addEventListener('click', () => setMode(2));
        DOM.btn3p.addEventListener('click', () => setMode(3));

        DOM.startBtn.addEventListener('click', () => {
            DOM.landingScreen.classList.add('hidden');
            DOM.gameScreen.classList.remove('hidden');
            DOM.gameScreen.classList.add('flex');
            startGame();
        });

        DOM.quitBtn.addEventListener('click', () => {
            DOM.quitModal.classList.remove('hidden');
            DOM.quitModal.classList.add('flex');
        });

        DOM.modalCancelBtn.addEventListener('click', () => {
            DOM.quitModal.classList.add('hidden');
            DOM.quitModal.classList.remove('flex');
        });

        DOM.modalConfirmBtn.addEventListener('click', () => {
            DOM.quitModal.classList.add('hidden');
            DOM.quitModal.classList.remove('flex');
            resetToLanding();
        });
    };

    // Initialize
    setupListeners();
    
})(); // End IIFE
