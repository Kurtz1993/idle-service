"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserState = /** @class */ (function () {
    /**
     * Represents the current state of the user.
     * @param isIdle Specifies if the user is idle.
     * @param hasTimedout Specifies if the user has timed out.
     * @param userInactivityTime Number of seconds the user has been inactive.
     */
    function UserState(isIdle, hasTimedout, userInactivityTime) {
        if (isIdle === void 0) { isIdle = false; }
        if (hasTimedout === void 0) { hasTimedout = false; }
        if (userInactivityTime === void 0) { userInactivityTime = 0; }
        this.isIdle = isIdle;
        this.hasTimedout = hasTimedout;
        this.userInactivityTime = userInactivityTime;
    }
    return UserState;
}());
exports.UserState = UserState;
//# sourceMappingURL=idle.state.js.map