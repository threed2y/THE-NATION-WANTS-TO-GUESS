/*
Main Application Entry Point
Initializes all modules
*/

/* Core Systems */
import "./core/eventBus.js";
import "./core/state.js";
import "./core/config.js";

/* Data */
import "./data/database.js";

/* Engines */
import "./engine/gameEngine.js";
import "./engine/timerEngine.js";

/* UI Modules */
import "./ui/board.js";
import "./ui/controller.js";

/*
No additional code needed.
Importing modules initializes event listeners automatically.
*/

console.log("Nation Wants to Guess — App Initialized");
