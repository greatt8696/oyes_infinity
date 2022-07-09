import Phaser from "phaser";
import Player from "../characters/Player";
import EventEmitter from "../EventEmitter";

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
  }
  create() {
    this.add
      .image(this.config.width / 2, this.config.height / 2, "background")
      .setOrigin(0.5);
    this.score = 0;
    this.player = this.createPlayer();
    this.initCamera(this.player);
    // this.createGameEvents();
  }
  update() {
    // console.log(this.player);
  }

  createPlayer() {
    // return new Player(this, start.x, start.y);
    return new Player(this, this.config.width / 2, this.config.height / 2);
  }

  initCamera(followObj) {
    // set camera center
    this.cameras.main.startFollow(followObj); // 카메라를 플레이어에 고정시킴
    this.cameras.main.shake(500, 0.01, 0.01); // 카메라 흔드는 효과
    this.cameras.main.setFollowOffset(-180, -100); // 정중앙 설정
  }
  // createGameEvents() {
  //   EventEmitter.on("PLAYER_LOOSE", () => {
  //     console.log("Helko!");
  //     this.scene.restart({ gameStatus: "PLAYER_LOOSE" });
  //   });
  // }
}

export default PlayScene;
