import {GridEngine} from "grid-engine"
import User from "../models/user"
import Tooltip from "./tooltip"
import Position from "../models/position"

/**
 * @typedef {import('../constants/user-status').UserStatusType} UserStatusType
 * @typedef {import('../constants/user-direction').UserDirectionType} UserDirectionType
 *
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 * @property {UserDirectionType} direction
 */

/**
 * This class represents a Player in the stage, this holds all controls related to the player
 */
export default class Player {
  /**
   * Creates an instance of Player.
   *
   * This will create a new sprite and add it to the stage.
   *
   * @param {Phaser.Scene} scene
   * @param {User} user
   * @returns
   */
  constructor(scene, user, debug = false) {
    this.debugEnabled = debug
    this._scene = scene

    this.user = user

    this._tooltip = new Tooltip(debug)
    this._tooltip.updateStatus(user.status)

    this._scene.game.config.parent.appendChild(this._tooltip.container)

    if (scene.gridEngine.hasCharacter(this.user.id)) {
      return scene.gridEngine.getSprite(this.user.id)
    }

    this.sprite = scene.add.sprite(0, 0, "player")
    this.sprite.scale = 1.5

    this._tooltip.updateName(this.user.name)

    this.updateCoordinateText({
      x: user.position.x,
      y: user.position.y,
      direction: user.direction,
    })

    let debugBox
    if (this.debugEnabled) {
      debugBox = scene.add.graphics()
      debugBox.lineStyle(2, 0x00ff00)
      debugBox.strokeRect(0, 0, this.sprite.displayWidth, this.sprite.displayHeight)
    }

    this.container = scene.add.container(0, 0, this.debugEnabled ? [this.sprite, debugBox] : [this.sprite])

    scene.gridEngine.addCharacter({
      id: this.user.id,
      labels: [this.user.id, "player"],
      sprite: this.sprite,
      walkingAnimationMapping: 3,
      facingDirection: this.user.direction,
      startPosition: this.user.position,
      speed: 4,
      container: this.container,
    })
  }

  /**
   * @type {boolean}
   */
  debugEnabled

  /**
   * @type {User}
   */
  user

  /**
   * @type {Phaser.GameObjects.Sprite}
   */
  sprite

  /**
   * @type {Phaser.GameObjects.Container}
   */
  container

  /**
   * @type {Phaser.Scene & { gridEngine: GridEngine }}
   * @private
   */
  _scene

  /**
   * @type {Tooltip}
   * @private
   */
  _tooltip

  /**
   * Remove the player from the stage and clear all related elements
   *
   * @returns {void}
   */
  destroy() {
    this._scene.gridEngine.removeCharacter(this.user.id)
    this._tooltip.destroy()
    this.container.removeAll(true)
    this.container.destroy()
  }

  /**
   * Turn the player direction
   *
   * @param {UserDirectionType} direction
   * @returns {void}
   */
  turnTowards(direction) {
    this.user.direction = direction
    this._scene.gridEngine.turnTowards(this.user.id, direction)
    this.updateDirectionText(direction)
  }

  /**
   * Move the player to the given coordinate faced to the given direction
   *
   * @param {Coordinate} coordinate
   * @returns {void}
   */
  moveTo({x, y, direction}) {
    this.user.position = new Position({x, y})
    this.user.direction = direction

    this._scene.gridEngine.moveTo(this.user.id, {x, y})
    this._scene.gridEngine.turnTowards(this.user.id, direction)
    this.updateCoordinateText({x, y, direction})
  }

  /**
   * Update the current coordinate and direction for debug.
   *
   * @param {Coordinate} coordinate
   * @returns {void}
   */
  updateCoordinateText({x, y, direction}) {
    if (this.debugEnabled) {
      this._tooltip.updateDebugText(`(${x}, ${y})[${direction}]`)
    }
  }

  /**
   * Update the current coordinate and direction for debug.
   *
   * @param {UserDirectionType} direction
   * @returns {void}
   */
  updateDirectionText(direction) {
    this.updateCoordinateText({
      x: this.user.position.x,
      y: this.user.position.y,
      direction: direction,
    })
  }

  /**
   * Update the tooltip position on the screen.
   *
   * @returns {void}
   */
  updateTooltipPosition() {
    const spriteBounds = this.sprite.getBounds()
    const camera = this._scene.cameras.main

    const relativeX = spriteBounds.x - camera.scrollX + this.sprite.displayWidth / 2
    const relativeY = spriteBounds.y - camera.scrollY

    this._tooltip.updatePosition(relativeX, relativeY)
  }
}
