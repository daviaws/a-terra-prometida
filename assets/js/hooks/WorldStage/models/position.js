export default class Position {
  /**
   * Location on the x-axis.
   *
   * @type {number}
   */
  x

  /**
   * Location on the y-axis.
   *
   * @type {number}
   */
  y

  /**
   * Create a new Position instance.
   *
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   *
   * @return {Position}
   */
  constructor({x, y}) {
    this.x = x
    this.y = y
  }
}
