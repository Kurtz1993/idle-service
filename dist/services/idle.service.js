"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var types_1 = require("../types");
var IdleService = /** @class */ (function () {
    function IdleService() {
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
    IdleService.prototype.configure = function (options) {
        this.options = __assign({}, this.options, options);
        this.rebuildObservables(this.options.listenFor, this.options.timeToIdle);
    };
    /**
     * Starts watching user activity.
     */
    IdleService.prototype.start = function () {
        var _this = this;
        if (this.isRunning) {
            this.stop();
        }
        this.isRunning = true;
        this.subscriptions.push(this.userIsActive$.subscribe(function () {
            return _this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserIsActive));
        }), this.userInactivityTimer$.subscribe(function (val) {
            _this.userState.userInactivityTime = val + 1;
        }), this.idleTimer$.subscribe(function () {
            _this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserIsIdle));
            _this.startTimeoutCountdown();
        }));
    };
    /**
     * Stops the service from running.
     * Service can be restarted by calling the start() method.
     * @param timedOut Specifies if the service was stopped because of the user being timedout.
     */
    IdleService.prototype.stop = function (timedOut) {
        if (timedOut === void 0) { timedOut = false; }
        this.userState.isIdle = false;
        this.isRunning = false;
        this.userState.hasTimedout = timedOut;
        this.timedOut$.next();
        this.unsubscribeAll();
    };
    /**
     * Starts the timeout countdown.
     * If the user performs a valid action, the countdown stops.
     */
    IdleService.prototype.startTimeoutCountdown = function () {
        var _this = this;
        this.userState.isIdle = true;
        var countdown = this.options.timeToTimeout;
        rxjs_1.interval(1000)
            .pipe(operators_1.takeUntil(this.interruptions$))
            .subscribe(function () {
            countdown--;
            _this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.TimeoutWarning, countdown));
            if (countdown == 0) {
                _this.stop(true);
                _this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserHasTimedOut));
            }
        }, null, function () {
            if (_this.userState.isIdle) {
                _this.userState.isIdle = false;
                _this.eventEmitter$.next(new types_1.IdleServiceEvent(types_1.IdleEvents.UserIsBack));
            }
            if (!_this.options.autoResume) {
                _this.unsubscribeAll();
            }
        });
    };
    /**
     * Listens to a particular idle service event.
     * @param eventType Event to listen to.
     * @param action What the event listener should do when the event is triggered.
     */
    IdleService.prototype.on = function (eventType, action) {
        return this.eventEmitter$
            .pipe(operators_1.filter(function (event) { return event.eventType === eventType; }), operators_1.map(function (event) { return event.value; }))
            .subscribe(action);
    };
    /**
     * Builds the needed observables for the service.
     * This includes timers and event listeners.
     * @param events A pace-separated list of events to listen.
     * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
     */
    IdleService.prototype.rebuildObservables = function (events, timeToIdle) {
        var htmlElm = document.querySelector("html");
        var observables = events.split(" ").map(function (ev) { return rxjs_1.fromEvent(htmlElm, ev).pipe(operators_1.throttleTime(500)); });
        this.userIsActive$ = rxjs_1.merge.apply(void 0, observables);
        this.interruptions$ = rxjs_1.merge(this.userIsActive$, this.timedOut$);
        this.idleTimer$ = rxjs_1.timer(timeToIdle * 1000).pipe(operators_1.takeUntil(this.userIsActive$), operators_1.repeat());
        this.userInactivityTimer$ = rxjs_1.interval(1000).pipe(operators_1.takeUntil(this.interruptions$), operators_1.repeat());
    };
    /**
     * Removes all the current observable subscriptions.
     */
    IdleService.prototype.unsubscribeAll = function () {
        this.subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    return IdleService;
}());
exports.IdleService = IdleService;
//# sourceMappingURL=idle.service.js.map