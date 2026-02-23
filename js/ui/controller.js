import { EventBus } from "../core/eventBus.js";
import { State } from "../core/state.js";
import { startGame } from "../engine/gameEngine.js";
import { startTimer, stopTimer } from "../engine/timerEngine.js";

/* DOM Elements */
const landing = document.getElementById("landing");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");

const turnIndicator = document.getElementById("turnIndicator");
const questionText = document.getElementById("questionText");
const timerBar = document.getElementById("timerBar");

/* ================= START GAME ================= */

startBtn.onclick = () => {
startGame(2);
};

/* ================= EVENT LISTENERS ================= */

/* Game started */
EventBus.on("game:start", () => {
landing.classList.add("hidden");
game.classList.remove("hidden");
});

/* Round loaded */
EventBus.on("round:loaded", ({ question, round, player }) => {
questionText.innerText = question.clue;
turnIndicator.innerText = `Player ${player + 1} • Round ${round}`;
nextBtn.classList.add("hidden");

```
timerBar.style.width = "100%";

startTimer();
```

});

/* Timer update */
EventBus.on("timer:update", remaining => {
const percent = (remaining / 15000) * 100;
timerBar.style.width = percent + "%";
});

/* Timeout */
EventBus.on("timer:timeout", () => {
questionText.innerText = "TIME'S UP!";
nextBtn.classList.remove("hidden");
});

/* Answer selected */
EventBus.on("answer:selected", () => {
stopTimer();
nextBtn.classList.remove("hidden");
});

/* Round end */
EventBus.on("round:end", () => {
nextBtn.classList.remove("hidden");
});

/* Game Over */
EventBus.on("game:over", ({ scores }) => {
questionText.innerText = "GAME OVER";

```
let winner = scores.indexOf(Math.max(...scores)) + 1;

turnIndicator.innerText = `Winner: Player ${winner}`;
nextBtn.classList.add("hidden");
```

});

/* ================= NEXT ROUND ================= */

nextBtn.onclick = () => {
EventBus.emit("round:next");
};
