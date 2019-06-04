"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserState {
    /**
     * Represents the current state of the user.
     * @param isIdle Specifies if the user is idle.
     * @param hasTimedout Specifies if the user has timed out.
     * @param userInactivityTime Number of seconds the user has been inactive.
     */
    constructor(isIdle = false, hasTimedout = false, userInactivityTime = 0) {
        this.isIdle = isIdle;
        this.hasTimedout = hasTimedout;
        this.userInactivityTime = userInactivityTime;
    }
}
exports.UserState = UserState;
//# sourceMappingURL=idle.state.js.map