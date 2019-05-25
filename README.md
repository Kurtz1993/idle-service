# idle-service

## Description
Some applications may need to detect if a user is idle and perform certain actions when this happens like warning them about this inactivity or logging them out of the application.

## Installation
You can install the module via `npm install idle-service` or `yarn add idle-service`.

## API Reference


## Events
### Usage
```javascript
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
