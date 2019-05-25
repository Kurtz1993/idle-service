export class IdleState {
  /**
   * Represents the current state of the idle service.
   * @param isIdle Specifies if the user is idle.
   * @param hasTimedout Specifies if the user has timed out.
   * @param isServiceRunning Specifies if the service is running.
   * @param userInactivityTime Number of seconds the user has been inactive.
   */
  constructor(
    public isIdle = false,
    public hasTimedout = false,
    public isServiceRunning = true,
    public userInactivityTime = 0
  ) {}
}
