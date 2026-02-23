
export const EventBus = {

```
events: {},

/*
  Subscribe to event
*/
on(eventName, handler) {
    if (!this.events[eventName]) {
        this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
},

/*
  Emit event
*/
emit(eventName, payload) {
    const handlers = this.events[eventName];
    if (!handlers) return;

    handlers.forEach(handler => handler(payload));
},

/*
  Remove event listener
*/
off(eventName, handler) {
    const handlers = this.events[eventName];
    if (!handlers) return;

    this.events[eventName] =
        handlers.filter(h => h !== handler);
}
```

};
