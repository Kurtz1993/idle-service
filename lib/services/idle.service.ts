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

import { IdleOptions, IdleState, IdleEvents, IdleServiceEvent } from "../types";

export class IdleService {
  private options = new IdleOptions();
  private idleState = new IdleState();
  private userIsActive$: Observable<{}>;
  private interruptions$: Observable<{}>;
  private idleTimer$: Observable<number>;
  private userInactivityTimer$: Observable<number>;
  private timedOut$ = new Subject<null>();
  private subscriptions: SubscriptionLike[] = [];
  private eventEmitter$ = new Subject<IdleServiceEvent>();

  constructor() {
    this.options.timeToIdle = 10;
    this.options.timeToTimeout = 5;
    this.rebuildObservables(this.options.listenFor, this.options.timeToIdle);
  }

  /**
   * Starts watching user activity.
   */
  start(): void {
    if (this.idleState.isServiceRunning) {
      this.timeout();
    }

    this.idleState.isServiceRunning = true;

    this.subscriptions.push(
      this.userIsActive$.subscribe(() =>
        this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserIsActive))
      ),
      this.userInactivityTimer$.subscribe(val => {
        this.idleState.userInactivityTime = val + 1;
      }),
      this.idleTimer$.subscribe(() => {
        this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserIsIdle));
        this.startTimeoutCountdown();
      })
    );
  }

  /**
   * Forces a user timeout, stopping all the timers and the service itself.
   * Service can be restarted by calling the start() method.
   */
  timeout(): void {
    this.idleState.isIdle = false;
    this.idleState.isServiceRunning = false;
    this.idleState.hasTimedout = true;
    this.timedOut$.next();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Starts the timeout countdown.
   * If the user performs a valid action, the countdown stops.
   */

  startTimeoutCountdown(): void {
    this.idleState.isIdle = true;
    let countdown = this.options.timeToTimeout;
    interval(1000)
      .pipe(takeUntil(this.interruptions$))
      .subscribe(
        () => {
          countdown--;
          this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.TimeoutWarning, countdown));

          if (countdown == 0) {
            this.timeout();
            this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserHasTimedOut));
          }
        },
        null,
        () => {
          if (this.idleState.isIdle) {
            this.idleState.isIdle = false;
            this.eventEmitter$.next(new IdleServiceEvent(IdleEvents.UserIsBack));
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
}
