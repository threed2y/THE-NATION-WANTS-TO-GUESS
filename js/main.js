/*
Main Application Entry Point
Initializes all modules
*/

/* Core Systems */
import "js/core/eventBus.js";
import "js/core/state.js";
import "js/core/config.js";

/* Data */
import "js/data/database.js";

/* Engines */
import "js/engine/gameEngine.js";
import "js/engine/timerengine.js";

/* UI Modules */
import "js/ui/board.js";
import "js/ui/controller.js";

/*
No additional code needed.
Importing modules initializes event listeners automatically.
*/

console.log("Nation Wants to Guess — App Initialized");
