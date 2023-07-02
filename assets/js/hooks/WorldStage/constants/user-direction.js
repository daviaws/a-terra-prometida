/**
 * @typedef {"up" | "left" | "down" | "right"} UserDirectionType
 */

export default class UserDirection {
  /**
   * The user is facing up.
   *
   * @type {UserDirectionType}
   */
  static UP = "up"

  /**
   * The user is facing left.
   *
   * @type {UserDirectionType}
   */
  static LEFT = "left"

  /**
   * The user is facing down.
   *
   * @type {UserDirectionType}
   */
  static DOWN = "down"

  /**
   * The user is facing right.
   *
   * @type {UserDirectionType}
   */
  static RIGHT = "right"
}
