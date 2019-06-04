import { Subscription } from "rxjs";
import { IdleOptions, UserState, IdleEvents } from "../types";
export declare class IdleService {
    userState: UserState;
    private isRunning;
    private options;
    private userIsActive$;
    private interruptions$;
    private idleTimer$;
    private userInactivityTimer$;
    private timedOut$;
    private subscriptions;
    private eventEmitter$;
    constructor();
    /**
     * Configures the service with the given parameters.
     * @param options New options to configure the service. You can just pass the needed keys.
     */
    configure(options: Partial<IdleOptions>): void;
    /**
     * Starts watching user activity.
     */
    start(): void;
    /**
     * Stops the service from running.
     * Service can be restarted by calling the start() method.
     * @param timedOut Specifies if the service was stopped because of the user being timedout.
     */
    stop(timedOut?: boolean): void;
    /**
     * Resets the service.
     */
    reset: () => void;
    /**
     * Starts the timeout countdown.
     * If the user performs a valid action, the countdown stops.
     */
    startTimeoutCountdown(): void;
    /**
     * Listens to a particular idle service event.
     * @param eventType Event to listen to.
     * @param action What the event listener should do when the event is triggered.
     */
    on(eventType: IdleEvents, action: (value: any) => void): Subscription;
    /**
     * Builds the needed observables for the service.
     * This includes timers and event listeners.
     * @param events A pace-separated list of events to listen.
     * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
     */
    private rebuildObservables;
    /**
     * Removes all the current observable subscriptions.
     */
    private unsubscribeAll;
}
