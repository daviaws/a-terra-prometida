import Phaser from "phaser"
import GridEngine from "grid-engine"
import PreloaderScene from "./scenes/preloader-scene"
import MainScene from "./scenes/main-scene"

/**
 * WorldStage hook, which is responsible for the show.
 *
 * @type {import("phoenix_live_view").ViewHook}
 */
const WorldStage = {
  /**
   * The game instance.
   *
   * @type {Phaser.Game}
   * @private
   */
  _game: null,

  /**
   * Initializes the hook.
   *
   * @returns {void}
   */
  mounted() {
    const width = this.el.offsetWidth
    const height = this.el.offsetHeight
    const userId = this.el.dataset.userId

    const preloaderScene = new PreloaderScene({
      name: "preload",
      nextScene: "main",
    })

    const onReady = () => {
      this.pushEvent("ready", {})

      this.handleEvent("user_join", ({user}) => {
        console.log("Joined User", user)
        mainScene.createPlayer(user)
      })

      this.handleEvent("user_leave", ({user_id}) => {
        console.log("Leaved User", user_id)
        mainScene.removePlayer(user_id)
      })

      this.handleEvent("change_direction", ({user_id, direction}) => {
        console.info("User", user_id, "change the direction", direction)
        mainScene.changePlayerDirection(user_id, direction)
      })

      this.handleEvent("change_coordinate", ({user_id, ...coordinate}) => {
        console.info("User", user_id, "change the coordinate")
        mainScene.changePlayerPosition(user_id, coordinate)
      })
    }

    const mainScene = new MainScene({
      name: "main",
      liveSocket: this,
      userId: userId,
      onCreated: () => onReady(),
      onChangeDirection: (direction) => {
        console.info("Change my direction")
        this.pushEvent("change_my_direction", {direction})
      },
      onChangeCoordinate: (coordinate) => {
        console.info("Change my coordinate")
        this.pushEvent("change_my_coordinate", coordinate)
      },
    })

    this.handleEvent("users", ({users}) => {
      console.log("Users", users)

      for (const user of users) {
        const player = mainScene.createPlayer(user)
        if (user.id == userId) {
          mainScene.setupCamera(player)
        }
      }
    })

    this._game = new Phaser.Game({
      title: "PromisedLand",
      type: Phaser.AUTO,
      banner: false,
      parent: this.el,
      width: width,
      height: height,
      fps: 30,
      render: {
        antialias: false,
      },
      pixelArt: true,
      plugins: {
        scene: [
          {
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ],
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [preloaderScene, mainScene],
      backgroundColor: "#111111",
      input: {
        mouse: {
          preventDefaultWheel: false,
        },
        touch: {
          capture: false,
        },
      },
    })

    window.addEventListener("resize", () => {
      this._game.scale.resize(window.innerWidth, window.innerHeight)
    })
  },

  /**
   * Cleans all resources.
   *
   * @returns {void}
   */
  destroyed() {
    this._game.destroy()
  },
}

export default WorldStage
