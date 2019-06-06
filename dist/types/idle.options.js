"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdleOptions = /** @class */ (function () {
    /**
     * Specifies the options for the idle service.
     * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
     * @param timeToTimeout Inactive time in seconds needed for the user to be considered timed out *AFTER* the user has been considered idle.
     * @param autoResume Specifies if the service should auto resume itself after the user is considered idle.
     * @param listenFor DOM events to listen for the user to be considered active.
     */
    function IdleOptions(timeToIdle, timeToTimeout, autoResume, listenFor) {
        if (timeToIdle === void 0) { timeToIdle = 20 * 60; }
        if (timeToTimeout === void 0) { timeToTimeout = 30; }
        if (autoResume === void 0) { autoResume = true; }
        if (listenFor === void 0) { listenFor = "keydown mousewheel mousedown touchstart touchmove scroll"; }
        this.timeToIdle = timeToIdle;
        this.timeToTimeout = timeToTimeout;
        this.autoResume = autoResume;
        this.listenFor = listenFor;
    }
    return IdleOptions;
}());
exports.IdleOptions = IdleOptions;
//# sourceMappingURL=idle.options.js.map