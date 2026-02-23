import { EventBus } from "../core/eventBus.js";
import { shuffle } from "../utils/shuffle.js";
import { database } from "../data/database.js";

const board = document.getElementById("board");

/*
Render a new round board
*/
EventBus.on("round:loaded", ({ question }) => {
renderBoard(question);
});

/*
Show correct/wrong feedback
*/
EventBus.on("answer:selected", ({ correct, correctTerm }) => {
revealAnswer(correctTerm);
});

/*
Create board tiles
*/
function renderBoard(question) {
board.innerHTML = "";

```
const distractors = shuffle(
    database.filter(q => q.term !== question.term)
).slice(0, 8);

const options = shuffle([question, ...distractors]);

options.forEach(item => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerText = item.term;

    tile.onclick = () => {
        EventBus.emit("tile:clicked", item.term);
    };

    board.appendChild(tile);
});
```

}

/*
Reveal correct/wrong tiles
*/
function revealAnswer(correctTerm) {
const tiles = board.querySelectorAll(".tile");

```
tiles.forEach(tile => {
    if (tile.innerText === correctTerm) {
        tile.classList.add("correct");
    } else {
        tile.classList.add("wrong");
    }

    tile.style.pointerEvents = "none";
});
```

}
