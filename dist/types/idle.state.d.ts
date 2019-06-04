export declare class UserState {
    isIdle: boolean;
    hasTimedout: boolean;
    userInactivityTime: number;
    /**
     * Represents the current state of the user.
     * @param isIdle Specifies if the user is idle.
     * @param hasTimedout Specifies if the user has timed out.
     * @param userInactivityTime Number of seconds the user has been inactive.
     */
    constructor(isIdle?: boolean, hasTimedout?: boolean, userInactivityTime?: number);
}
