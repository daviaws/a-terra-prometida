/**
 * @typedef {"online" | "do_not_disturb" | "busy"} UserStatusType
 */

export default class UserStatus {
  /**
   * The user is online.
   *
   * @type {UserStatusType}
   */
  static ONLINE = "online"

  /**
   * The user is online but does not want to be disturbed.
   *
   * @type {UserStatusType}
   */
  static DO_NOT_DISTURB = "do_not_disturb"

  /**
   * The user is busy.
   *
   * @type {UserStatusType}
   */
  static BUSY = "busy"
}
