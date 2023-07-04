import createHtmlElement from "../../../utils/create-html-element"
import UserStatus from "../constants/user-status"

const STATUS_COLORS = {
  [UserStatus.ONLINE]: "bg-green-500",
  [UserStatus.DO_NOT_DISTURB]: "bg-red-500",
  [UserStatus.BUSY]: "bg-yellow-500",
}

/**
 * Shows a element over the player sprite
 */
export default class Tooltip {
  /**
   * @param {boolean} [debug=false]
   */
  constructor(debug = false) {
    this.debugEnabled = debug
    this._createElements()
    this.updateStatus(UserStatus.ONLINE)
  }

  /**
   * @type {boolean}
   */
  debugEnabled

  /**
   * @type {HTMLElement}
   */
  container

  /**
   * @type {HTMLElement}
   * @private
   */
  _statusElement

  /**
   * @type {HTMLElement}
   * @private
   */
  _nameElement

  /**
   * @type {HTMLElement}
   * @private
   */
  _debugElement

  /**
   * Create the tooltip elements
   *
   * @returns {void}
   * @private
   */
  _createElements() {
    this._statusElement = createHtmlElement("div", {
      className: "h-2 w-2 rounded-full",
    })

    this._nameElement = createHtmlElement("div", {
      className: "text-white text-xs font-semibold",
    })

    this._debugElement = createHtmlElement("div", {
      className: "text-white text-xs",
    })

    this.container = createHtmlElement("div", {
      className: "absolute z-10 origin-[0%_0%] select-none",
      children: [
        createHtmlElement("div", {
          className: "absolute flex flex-col items-center justify-center -translate-x-1/2 bottom-3/4 w-80",
          children: [
            createHtmlElement("div", {
              className: "bg-slate-900/75 py-1 px-2 rounded-full w-88 flex items-center justify-center gap-2",
              children: [this._statusElement, this._nameElement],
            }),
            this._debugElement,
          ],
        }),
      ],
    })
  }

  /**
   * Update the tooltip status
   *
   * @param {import("../constants/user-status").UserStatusType} status
   * @returns {void}
   */
  updateStatus(status) {
    this._statusElement.classList.remove(Object.values(STATUS_COLORS))
    const statusClass = STATUS_COLORS[status]

    if (statusClass) {
      this._statusElement.classList.add(statusClass)
    }
  }

  /**
   * Update the tooltip user name
   *
   * @param {string} name
   * @returns {void}
   */
  updateName(name) {
    this._nameElement.replaceChildren(document.createTextNode(name))
  }

  /**
   * Update the tooltip user coordinate
   *
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  updatePosition(x, y) {
    this.container.style.left = `${x}px`
    this.container.style.top = `${y}px`
  }

  /**
   * Update the tooltip debug text
   *
   * @param {string} text
   * @returns {void}
   */
  updateDebugText(text) {
    if (!this.debugEnabled) {
      return
    }
    this._debugElement.replaceChildren(document.createTextNode(text))
  }

  /**
   * Destroy all elements from the DOM.
   *
   * @returns {void}
   */
  destroy() {
    this.container.remove()
  }
}
