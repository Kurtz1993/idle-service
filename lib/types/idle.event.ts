export class IdleServiceEvent {
  /**
   * Creates a new idle service event.
   * @param eventType Name of the event.
   * @param value Any value to pass as part of the event.
   */
  constructor(public eventType: IdleEvents, public value?: any) {}
}

export enum IdleEvents {
  UserIsIdle,
  UserIsBack,
  TimeoutWarning,
  UserHasTimedOut,
}
