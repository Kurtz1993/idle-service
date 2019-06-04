"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdleOptions {
    /**
     * Specifies the options for the idle service.
     * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
     * @param timeToTimeout Inactive time in seconds needed for the user to be considered timed out *AFTER* the user has been considered idle.
     * @param autoResume Specifies if the service should auto resume itself after the user is considered idle.
     * @param listenFor DOM events to listen for the user to be considered active.
     */
    constructor(timeToIdle = 20 * 60, timeToTimeout = 30, autoResume = true, listenFor = "keydown mousewheel mousedown touchstart touchmove scroll") {
        this.timeToIdle = timeToIdle;
        this.timeToTimeout = timeToTimeout;
        this.autoResume = autoResume;
        this.listenFor = listenFor;
    }
}
exports.IdleOptions = IdleOptions;
//# sourceMappingURL=idle.options.js.map