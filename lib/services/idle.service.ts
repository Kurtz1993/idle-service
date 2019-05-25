import {
  Observable,
  Subject,
  SubscriptionLike,
  fromEvent,
  merge,
  interval,
  timer,
  Subscription,
} from "rxjs";
import {
  throttleTime,
  takeUntil,
  takeWhile,
  repeat,
  repeatWhen,
  filter,
  map,
} from "rxjs/operators";

import { IdleOptions, UserState, IdleEvents, IdleServiceEvent } from "../types";

export class IdleService {
  userState = new UserState();
  private isRunning = false;
  private options = new IdleOptions();
  private userIsActive$: Observable<{}>;
  private interruptions$: Observable<{}>;
  private idleTimer$: Observable<number>;
  private userInactivityTimer$: Observable<number>;
  private timedOut$ = new Subject<null>();
  private subscriptions: SubscriptionLike[] = [];
  private eventEmitter$ = new Subject<IdleServiceEvent>();

  constructor() {
    this.rebuildObservables(this.options.listenFor, this.options.timeToIdle);
  }

  /**
   * Configures the service with the given parameters.
   * @param options New options to configure the service. You can just pass the needed keys.
   */
  configure(options: Partial<IdleOptions>): void {
    this.options = { ...this.options, ...options };
    this.rebuildObservables(this.options.listenFor, this.options.timeToIdle);
  }

  /**
   * Starts watching user activity.
   */
  start(): void {
    if (this.isRunning) {
      this.stop();
    }

    this.isRunning = true;

    this.subscriptions.push(
      this.userIsActive$.subscribe(() =>
        this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserIsActive))
      ),
      this.userInactivityTimer$.subscribe(val => {
        this.userState.userInactivityTime = val + 1;
      }),
      this.idleTimer$.subscribe(() => {
        this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserIsIdle));
        this.startTimeoutCountdown();
      })
    );
  }

  /**
   * Stops the service from running.
   * Service can be restarted by calling the start() method.
   * @param timedOut Specifies if the service was stopped because of the user being timedout.
   */
  stop(timedOut = false): void {
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

  startTimeoutCountdown(): void {
    this.userState.isIdle = true;
    let countdown = this.options.timeToTimeout;
    interval(1000)
      .pipe(takeUntil(this.interruptions$))
      .subscribe(
        () => {
          countdown--;
          this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.TimeoutWarning, countdown));

          if (countdown == 0) {
            this.stop(true);
            this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserHasTimedOut));
          }
        },
        null,
        () => {
          if (this.userState.isIdle) {
            this.userState.isIdle = false;
            this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserIsBack));
          }

          if (!this.options.autoResume) {
            this.unsubscribeAll();
          }
        }
      );
  }

  /**
   * Listens to a particular idle service event.
   * @param eventType Event to listen to.
   * @param action What the event listener should do when the event is triggered.
   */
  on(eventType: IdleEvents, action: (value) => void): Subscription {
    return this.eventEmitter$
      .pipe(
        filter(event => event.eventType === eventType),
        map(event => event.value)
      )
      .subscribe(action);
  }

  /**
   * Builds the needed observables for the service.
   * This includes timers and event listeners.
   * @param events A pace-separated list of events to listen.
   * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
   */
  private rebuildObservables(events: string, timeToIdle: number): void {
    const htmlElm = document.querySelector("html");
    const observables = events.split(" ").map(ev => fromEvent(htmlElm, ev).pipe(throttleTime(500)));

    this.userIsActive$ = merge(...observables);
    this.interruptions$ = merge(this.userIsActive$, this.timedOut$);
    this.idleTimer$ = timer(timeToIdle * 1000).pipe(
      takeUntil(this.userIsActive$),
      repeat()
    );
    this.userInactivityTimer$ = interval(1000).pipe(
      takeUntil(this.interruptions$),
      repeat()
    );
  }

  /**
   * Removes all the current observable subscriptions.
   */
  private unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
