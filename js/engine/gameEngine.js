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

```
EventBus.emit("game:start");
loadRound();
```

}

/*
Load next round
*/
export function loadRound() {
State.isLocked = false;

```
if (State.availableQuestions.length === 0) {
    State.availableQuestions = shuffle([...database]);
}

State.currentQuestion = State.availableQuestions.pop();

EventBus.emit("round:loaded", {
    question: State.currentQuestion,
    round: State.currentRound,
    player: State.currentPlayer
});
```

}

/*
Player selects an answer
*/
export function selectAnswer(term) {
if (State.isLocked) return;

```
State.isLocked = true;

const isCorrect =
    term === State.currentQuestion.term;

if (isCorrect) {
    State.scores[State.currentPlayer] += CONFIG.POINTS_CORRECT;
}

EventBus.emit("answer:selected", {
    correct: isCorrect,
    correctTerm: State.currentQuestion.term
});

setTimeout(endRound, 800);
```

}

/*
End current round
*/
function endRound() {
State.currentPlayer++;

```
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
loadRound();
```

}

/* ===============================
CONNECT TILE CLICK EVENT
================================ */

import { EventBus } from "../core/eventBus.js";

EventBus.on("tile:clicked", term => {
selectAnswer(term);
});
