export declare class IdleServiceEvent {
    eventType: IdleEvents;
    value?: any;
    /**
     * Creates a new idle service event.
     * @param eventType Name of the event.
     * @param value Any value to pass as part of the event.
     */
    constructor(eventType: IdleEvents, value?: any);
}
export declare enum IdleEvents {
    UserIsActive = 0,
    UserIsIdle = 1,
    UserIsBack = 2,
    TimeoutWarning = 3,
    UserHasTimedOut = 4
}
