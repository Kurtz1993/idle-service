"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const types_1 = require("../types");
class IdleService {
    constructor() {
        this.userState = new types_1.UserState();
        this.isRunning = false;
        this.options = new types_1.IdleOptions();
        this.timedOut$ = new rxjs_1.Subject();
        this.subscriptions = [];
        this.eventEmitter$ = new rxjs_1.Subject();
        /**
         * Resets the service.
         */
        this.reset = this.start;
        this.rebuildObservables(this.options.listenFor, this.options.timeToIdle);
    }
    /**
     * Configures the service with the given parameters.
     * @param options New options to configure the service. You can just pass the needed keys.
     */
    configure(options) {
        this.options = Object.assign({}, this.options, options);
        this.rebuildObservables(this.options.listenFor, this.options.timeToIdle);
    }
    /**
     * Starts watching user activity.
     */
    start() {
        if (this.isRunning) {
            this.stop();
        }
        this.isRunning = true;
        this.subscriptions.push(this.userIsActive$.subscribe(() => this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserIsActive))), this.userInactivityTimer$.subscribe(val => {
            this.userState.userInactivityTime = val + 1;
        }), this.idleTimer$.subscribe(() => {
            this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserIsIdle));
            this.startTimeoutCountdown();
        }));
    }
    /**
     * Stops the service from running.
     * Service can be restarted by calling the start() method.
     * @param timedOut Specifies if the service was stopped because of the user being timedout.
     */
    stop(timedOut = false) {
        this.userState.isIdle = false;
        this.isRunning = false;
        this.userState.hasTimedout = timedOut;
        this.timedOut$.next();
        this.unsubscribeAll();
    }
    /**
     * Starts the timeout countdown.
     * If the user performs a valid action, the countdown stops.
     */
    startTimeoutCountdown() {
        this.userState.isIdle = true;
        let countdown = this.options.timeToTimeout;
        rxjs_1.interval(1000)
            .pipe(operators_1.takeUntil(this.interruptions$))
            .subscribe(() => {
            countdown--;
            this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.TimeoutWarning, countdown));
            if (countdown == 0) {
                this.stop(true);
                this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserHasTimedOut));
            }
        }, null, () => {
            if (this.userState.isIdle) {
                this.userState.isIdle = false;
                this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserIsBack));
            }
            if (!this.options.autoResume) {
                this.unsubscribeAll();
            }
        });
    }
    /**
     * Listens to a particular idle service event.
     * @param eventType Event to listen to.
     * @param action What the event listener should do when the event is triggered.
     */
    on(eventType, action) {
        return this.eventEmitter$
            .pipe(operators_1.filter(event => event.eventType === eventType), operators_1.map(event => event.value))
            .subscribe(action);
    }
    /**
     * Builds the needed observables for the service.
     * This includes timers and event listeners.
     * @param events A pace-separated list of events to listen.
     * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
     */
    rebuildObservables(events, timeToIdle) {
        const htmlElm = document.querySelector("html");
        const observables = events.split(" ").map(ev => rxjs_1.fromEvent(htmlElm, ev).pipe(operators_1.throttleTime(500)));
        this.userIsActive$ = rxjs_1.merge(...observables);
        this.interruptions$ = rxjs_1.merge(this.userIsActive$, this.timedOut$);
        this.idleTimer$ = rxjs_1.timer(timeToIdle * 1000).pipe(operators_1.takeUntil(this.userIsActive$), operators_1.repeat());
        this.userInactivityTimer$ = rxjs_1.interval(1000).pipe(operators_1.takeUntil(this.interruptions$), operators_1.repeat());
    }
    /**
     * Removes all the current observable subscriptions.
     */
    unsubscribeAll() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
exports.IdleService = IdleService;
//# sourceMappingURL=idle.service.js.map