"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdleServiceEvent {
    /**
     * Creates a new idle service event.
     * @param eventType Name of the event.
     * @param value Any value to pass as part of the event.
     */
    constructor(eventType, value) {
        this.eventType = eventType;
        this.value = value;
    }
}
exports.IdleServiceEvent = IdleServiceEvent;
var IdleEvents;
(function (IdleEvents) {
    IdleEvents[IdleEvents["UserIsActive"] = 0] = "UserIsActive";
    IdleEvents[IdleEvents["UserIsIdle"] = 1] = "UserIsIdle";
    IdleEvents[IdleEvents["UserIsBack"] = 2] = "UserIsBack";
    IdleEvents[IdleEvents["TimeoutWarning"] = 3] = "TimeoutWarning";
    IdleEvents[IdleEvents["UserHasTimedOut"] = 4] = "UserHasTimedOut";
})(IdleEvents = exports.IdleEvents || (exports.IdleEvents = {}));
//# sourceMappingURL=idle.event.js.map