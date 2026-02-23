import { State } from "../core/state.js";
import { CONFIG } from "../core/config.js";
import { EventBus } from "../core/eventBus.js";

/*
Start the round timer
*/
export function startTimer() {
stopTimer();

```
State.roundStartTime = Date.now();

State.timerId = setInterval(() => {
    const elapsed = Date.now() - State.roundStartTime;
    const remaining = Math.max(0, CONFIG.ROUND_TIME_MS - elapsed);

    EventBus.emit("timer:update", remaining);

    if (remaining <= 0) {
        stopTimer();
        EventBus.emit("timer:timeout");
    }

}, 100);
```

}

/*
Stop timer safely
*/
export function stopTimer() {
if (State.timerId) {
clearInterval(State.timerId);
State.timerId = null;
}
}
