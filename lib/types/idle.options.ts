export class IdleOptions {
  /**
   * Specifies the options for the idle service.
   * @param timeToIdle Inactive time in seconds that the user needs to be considered idle.
   * @param timeToTimeout Inactive time in seconds needed for the user to be considered timed out *AFTER* the user has been considered idle.
   * @param autoResume Specifies if the service should auto resume itself after the user is considered idle.
   * @param listenFor DOM events to listen for the user to be considered active.
   */
  constructor(
    public timeToIdle = 20 * 60,
    public timeToTimeout = 30,
    public autoResume = true,
    public listenFor = "keydown mousewheel mousedown touchstart touchmove scroll"
  ) {}
}
