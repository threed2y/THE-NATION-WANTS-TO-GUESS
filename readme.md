# THE NATION WANTS TO GUESS 🎤📊

> *"The Nation Wants To Know — and the Nation Wants To Guess!"*

A high-octane, satirical **data science trivia game** inspired by the aggressive energy of prime-time Indian news debates. Decode snarky investigative clues about statistics, machine learning, programming, and AI — before the clock runs out.

**[▶ Play Live](https://threed2y.github.io/THE-NATION-WANTS-TO-GUESS/)**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Gameplay](#gameplay)
- [Question Categories](#question-categories)
- [File Structure](#file-structure)
- [Technical Stack](#technical-stack)
- [Running Locally](#running-locally)
- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [License](#license)

---

## Overview

**The Nation Wants To Guess** is a browser-based quiz game built as a single, self-contained HTML file. No backend, no dependencies to install, no build step. Open it in a browser and the debate begins.

The game supports two modes — a solo race-against-the-clock experience and a competitive multiplayer pass-the-device format for up to six players. Questions are drawn from a bank of 65 hand-crafted clues across five data science disciplines, each written in the satirical voice of a panellist who has definitely read the brief.

---

## Features

### 🎯 Solo Mission
- Race against a configurable countdown timer
- Three one-use lifelines per session: **50/50**, **+10 seconds**, and a **Letter Hint**
- End-of-game grade ranking: **S / A / B / C / F** based on accuracy
- Live progress bar tracking questions completed

### ⚔️ Debate Night (Multiplayer)
- 2 to 6 players in a pass-the-device format
- Per-player score chips update in real time
- Full-screen round transition announcements between turns
- Final podium with rankings, scores, and correct-answer counts

### ⏱ Configurable Timer
Choose your pressure level before the game starts:

| Option | Time |
|--------|------|
| Speed Round | 5s |
| Fast | 8s |
| Standard | 10s |
| Relaxed | 15s / 20s |
| Chill | 30s |
| No Pressure | ∞ |

The timer ring animates from **green → yellow → red** as time runs low.

### 📋 Configurable Rounds
Select 3, 5, 7, 10, 15, or 20 rounds per session. Questions are randomly sampled from the full question bank each game.

### 🔥 Streak System
Consecutive correct answers trigger an animated streak badge and a celebratory sound cue. Streaks of 3+ reward the player with an escalating fire emoji display.

### 🎵 Audio Engine
Real-time sound synthesis using the Web Audio API — no external audio files required. Distinct tones for correct answers, wrong answers, timeouts, and streak milestones.

### 📺 Breaking News Ticker
A seamless, JS-driven scrolling news ticker runs across the top of the screen at all times, delivering satirical data science headlines in the style of a 24-hour news channel.

---

## Gameplay

### Setup
1. Select **Solo Mission** or **Debate Night**
2. Enter player name(s)
3. Set your preferred timer duration and number of rounds
4. Hit **START INVESTIGATION**

### In the Game
- Read the snarky investigative clue in the **Clue Box**
- Select the correct data science term from the four answer tiles
- In multiplayer, pass the device to the next player after each round

### Scoring
| Event | Points |
|-------|--------|
| Correct answer | **+10** |
| Wrong answer | 0 |
| Timeout | 0 |

### Tile States
| State | Meaning |
|-------|---------|
| 🟢 Green | Correct answer selected |
| 🔴 Red | Wrong answer selected |
| 🟩 Outlined green | Correct answer revealed (on wrong/timeout) |

---

## Question Categories

The 65-question bank spans five categories:

| Category | Topics Covered |
|----------|----------------|
| **ML** | Overfitting, Random Forest, Gradient Descent, Neural Networks, SVM, Dropout, Ensemble Learning, and more |
| **Stats** | p-value, Confidence Intervals, Normal Distribution, Central Limit Theorem, Bayes Theorem, A/B Testing, and more |
| **Data Eng** | ETL, Data Lake, Data Warehouse, Apache Kafka, Apache Spark, Data Lineage, CDC, and more |
| **Code** | Recursion, Big O Notation, APIs, SQL, Git, Pandas, Docker, Lambda Functions, and more |
| **AI** | Transformers, Attention Mechanism, Embeddings, RAG, Hallucination, Prompt Engineering, GANs, and more |

Each question includes a primary clue and a pool of contextually relevant distractors, so the answer choices are always plausible.

---

## File Structure

```
THE-NATION-WANTS-TO-GUESS/
├── index.html          # Entire application — UI, styles, logic, question bank
├── readme.md           # This file
└── fahhhhh.mp3         # Legacy audio asset (superseded by Web Audio API engine)
```

The entire game lives in `index.html`. Styles, JavaScript, the question database, and the audio engine are all inlined — making it trivially portable. Drop the file anywhere and it runs.

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styles | CSS3 — custom properties, glassmorphism, CSS animations |
| Logic | Vanilla JavaScript (ES6+), Event-driven architecture |
| Audio | Web Audio API — oscillator-based sound synthesis |
| Fonts | [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) · [Syne](https://fonts.google.com/specimen/Syne) · [DM Mono](https://fonts.google.com/specimen/DM+Mono) via Google Fonts |

No frameworks. No build tools. No runtime dependencies.

---

## Running Locally

Clone the repository and open the file directly in any modern browser:

```bash
git clone https://github.com/threed2y/THE-NATION-WANTS-TO-GUESS.git
cd THE-NATION-WANTS-TO-GUESS
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Alternatively, serve it with any static file server to avoid browser restrictions on local file access:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

---

## Configuration

All game settings are exposed in the UI before each session. For developers who want to modify defaults or extend the question bank, the relevant constants are at the top of the `<script>` block in `index.html`:

```js
// Question bank — add objects to this array to expand the game
const QUESTIONS = [ ... ];

// Ticker headlines — add strings to this array
const TICKER_ITEMS = [ ... ];
```

Each question object follows this schema:

```js
{
  term:        "Overfitting",           // The correct answer
  clue:        "Your model aced...",    // The snarky investigative clue
  category:    "ML",                    // ML | Stats | Data Eng | Code | AI
  distractors: ["RegularisationX", ...] // At least 3 plausible wrong answers
}
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` `2` `3` `4` | Select answer tile 1–4 |
| `Enter` | Advance to next round (when available) |

---

## License

Distributed under the **MIT License**. See `LICENSE` for details.

---

> **Disclaimer:** This is a parody project for entertainment and educational purposes within the data science community. Any resemblance to real news anchors, political commentary, or actual investigative journalism is purely for comedic effect. The p-value of this disclaimer being necessary is < 0.05.
