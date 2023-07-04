import Position from "./position"

export default class User {
  /**
   * The user's ID.
   *
   * @type {string}
   */
  id

  /**
   * The username defined by the user.
   *
   * @type {string}
   */
  username

  /**
   * The name defined by the user.
   *
   * @type {string}
   */
  name

  /**
   * The status defined by the user.
   *
   * @type {import("../constants/user-status").UserStatusType}
   */
  status

  /**
   * The direction the user is facing.
   *
   * @type {import("../constants/user-direction").UserDirectionType}
   */
  direction

  /**
   * Where the user is on the map.
   *
   * @type {Position}
   */
  position

  /**
   * Create a new User instance.
   *
   * @param {object} param0
   * @param {string} param0.id
   * @param {string} param0.username
   * @param {string} param0.name
   * @param {string} param0.status
   * @param {number} param0.direction
   * @param {object} param0.position
   * @param {number} param0.position.x
   * @param {number} param0.position.y
   *
   * @returns {User}
   */
  constructor({id, username, name, status, direction, position}) {
    this.id = id
    this.username = username
    this.name = name
    this.status = status
    this.direction = direction
    this.position = new Position(position)
  }
}
