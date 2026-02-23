import { State } from "../core/state.js";
import { CONFIG } from "../core/config.js";
import { EventBus } from "../core/eventBus.js";
import { shuffle } from "../utils/shuffle.js";
import { database } from "../data/database.js";

/*
Start a new game
*/
export function startGame(players = 2) {
    State.totalPlayers = players;
    State.currentPlayer = 0;
    State.currentRound = 1;
    State.scores = Array(players).fill(0);
    State.availableQuestions = shuffle([...database]);

    EventBus.emit("game:start");
    loadRound();
}

/*
Load next round
*/
export function loadRound() {
    State.isLocked = false;

    if (State.availableQuestions.length === 0) {
        State.availableQuestions = shuffle([...database]);
    }

    State.currentQuestion = State.availableQuestions.pop();

    EventBus.emit("round:loaded", {
        question: State.currentQuestion,
        round: State.currentRound,
        player: State.currentPlayer
    });
}

/*
Player selects an answer
*/
export function selectAnswer(term) {
    if (State.isLocked) return;

    State.isLocked = true;

    const isCorrect = term === State.currentQuestion.term;

    if (isCorrect) {
        State.scores[State.currentPlayer] += CONFIG.POINTS_CORRECT;
    }

    EventBus.emit("answer:selected", {
        correct: isCorrect,
        correctTerm: State.currentQuestion.term
    });

    setTimeout(endRound, 800);
}

/*
End current round
*/
function endRound() {
    State.currentPlayer++;

    if (State.currentPlayer >= State.totalPlayers) {
        State.currentPlayer = 0;
        State.currentRound++;
    }

    if (State.currentRound > CONFIG.TOTAL_ROUNDS) {
        EventBus.emit("game:over", {
            scores: State.scores
        });
        return;
    }

    EventBus.emit("round:end");
    // Removed loadRound() here so the game pauses and waits for the "NEXT ROUND" button click
}

/* ===============================
CONNECT TILE CLICK EVENT
================================ */

// Removed the duplicate EventBus import from here

EventBus.on("tile:clicked", term => {
    selectAnswer(term);
});

/* Listen for next round button */
EventBus.on("round:next", () => {
    loadRound();
});

/* ===============================
CONNECT TIMEOUT EVENT
================================ */

// Added this listener so the game correctly advances when time runs out
EventBus.on("timer:timeout", () => {
    if (State.isLocked) return;
    State.isLocked = true;
    setTimeout(endRound, 800);
});
