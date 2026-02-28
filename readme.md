# THE NATION WANTS TO GUESS 🎤📊

**"The Nation Wants To Guess"** is a high-octane, multiplayer data science trivia game. Inspired by the intense energy of prime-time news debates, this web application challenges players to decode snarky, "investigative" clues about statistics, machine learning, and programming before the clock runs out.

---

## 🚀 Key Features

* **Snarky Data Science Trivia:** Over 50+ hand-crafted clues that poke fun at industry tropes (e.g., "Machine Learning: A bunch of IF statements wearing a trench coat").
* **Multiplayer Mode:** Supports 2 to 6 players in a "pass-the-device" format.
* **High-Stakes Gameplay:** * **5 Rounds** per game.
* **10-Second Timer** per round to keep the pressure high.
* **Scoring:** +10 points for every correct "investigation".


* **Immersive News UI:** Features a "Cyber-News" aesthetic with high-contrast reds, glassmorphism effects, and dynamic "Breaking News" animations.
* **Audio Engine:** Built-in synthesis for "Correct," "Wrong," and "Timeout" sound effects to enhance the debate atmosphere.

---

## 🛠️ Technical Stack

* **Frontend:** HTML5, CSS3 (Tailwind CSS).
* **Fonts:** 'Syne' for bold headings and 'DM Mono' for that technical, data-driven feel.
* **Logic:** Pure Vanilla JavaScript using an **Event Bus (Pub/Sub)** architecture for clean state management.
* **Audio:** Web Audio API for real-time sound generation without external assets.

---

## 🎮 How to Play

1. **Setup:** Enter the number of participants (2–6) and provide player names.
2. **The Debate:** On your turn, read the snarky clue in the "Clue Box".
3. **The Guess:** Select the correct term from the grid of tiles.
* **Correct:** The tile pops green, and you gain 10 points.
* **Wrong/Timeout:** The correct answer is revealed, and the turn passes.


4. **Victory:** After 5 rounds, the "Nation" declares a winner based on the highest score.

---

## 📂 File Structure

* `index.html`: Contains the entire application (UI, Styles, and Logic) in a single, portable file.
* **Styles:** Custom Tailwind configuration and CSS animations.
* **Database:** A local array of data science terms and humorous definitions.
* **Sound Engine:** Base64 encoded audio and Web Audio API oscillators.



---

## ⚖️ License

Distributed under the MIT License.

**Disclaimer:** *This is a parody project intended for entertainment and educational purposes within the data science community. Any resemblance to real news anchors is purely for comedic effect.*

---
