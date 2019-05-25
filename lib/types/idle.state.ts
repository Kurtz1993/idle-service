export class UserState {
  /**
   * Represents the current state of the user.
   * @param isIdle Specifies if the user is idle.
   * @param hasTimedout Specifies if the user has timed out.
   * @param userInactivityTime Number of seconds the user has been inactive.
   */
  constructor(
    public isIdle = false,
    public hasTimedout = false,
    public userInactivityTime = 0
  ) {}
}
