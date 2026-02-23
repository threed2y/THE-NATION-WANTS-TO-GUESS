import { EventBus } from "../core/eventBus.js";
import { State } from "../core/state.js";
import { CONFIG } from "../core/config.js"; // Added missing import
import { startGame } from "../engine/gameEngine.js";
import { startTimer, stopTimer } from "../engine/timerengine.js"; // Fixed lowercase 'e'

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
    landing.classList.remove("flex");
    game.classList.remove("hidden");
    game.classList.add("flex");
});

/* Round loaded */
EventBus.on("round:loaded", ({ question, round, player }) => {
    questionText.innerText = question.clue;
    turnIndicator.innerText = `Player ${player + 1} • Round ${round}`;
    nextBtn.classList.add("hidden");

    // Reset timer visuals
    timerBar.style.width = "100%";
    timerBar.className = "h-full w-full rounded-full transition-all duration-100 ease-linear bg-green-500";

    startTimer();
});

/* Timer update */
EventBus.on("timer:update", remaining => {
    // Fixed hardcoded 15000 using CONFIG
    const percent = (remaining / CONFIG.ROUND_TIME_MS) * 100;
    timerBar.style.width = percent + "%";

    // Dynamic color shifting
    if (percent < 25) {
        timerBar.className = "h-full w-full rounded-full transition-all duration-100 ease-linear bg-red-600";
    } else if (percent < 50) {
        timerBar.className = "h-full w-full rounded-full transition-all duration-100 ease-linear bg-yellow-500";
    }
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

    let winner = scores.indexOf(Math.max(...scores)) + 1;
    turnIndicator.innerText = `Winner: Player ${winner} (Score: ${Math.max(...scores)})`;
    nextBtn.classList.add("hidden");
});

/* ================= NEXT ROUND ================= */

nextBtn.onclick = () => {
    EventBus.emit("round:next");
};
