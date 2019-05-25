# idle-service

## Description
Some applications may need to detect if a user is idle and perform certain actions when this happens like warning them about this inactivity or logging them out of the application.

## Installation
You can install the module via `npm install idle-service` or `yarn add idle-service`.

## API Reference
```typescript
class IdleService {
    userState: UserState;
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
```

```typescript
class IdleOptions {
    /**
     * Inactive time in seconds that the user needs to be considered idle.
     */
    timeToIdle: number;
    /**
     * Inactive time in seconds needed for the user to be considered timed out *AFTER* the user has been considered idle.
     */
    timeToTimeout: number;
    /**
     * Specifies if the service should auto resume itself after the user is considered idle.
     */
    autoResume: boolean;
    /**
     * DOM events to listen for the user to be considered active.
     */
    listenFor: string;
}
```

```typescript
class UserState {
    /**
     * Specifies if the user is idle.
     */
    isIdle: boolean;
    /**
     * Specifies if the user has timed out.
     */
    hasTimedout: boolean;
    /**
     * Number of seconds the user has been inactive.
     */
    userInactivityTime: number;
}
```

## Events
These are the events available within the IdleService:

```typescript
enum IdleEvents {
    UserIsActive
    UserIsIdle
    UserIsBack
    TimeoutWarning
    UserHasTimedOut
}
```
### Usage
```typescript
import idleService, { IdleEvents } from 'idle-service';

service.on(IdleEvents.UserIsBack, () => {
  console.log("User is back!");
});

service.on(IdleEvents.UserHasTimedOut, () => {
  console.log("User has timed out!");
});

service.on(IdleEvents.TimeoutWarning, countdown => {
  console.log(`User has ${countdown} seconds to come back!`);
});

service.on(IdleEvents.UserIsIdle, () => {
  console.log("User has become idle!");
});

service.on(IdleEvents.UserIsActive, () => {
  console.log("User is active");
});

```
