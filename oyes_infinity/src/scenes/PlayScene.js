import Phaser from 'phaser';
import Player from '../characters/Player';
import EventEmitter from '../EventEmitter';
import Enemy from '../characters/Enemy';
import Enemies from '../groups/Enemies';
import collidable from '../mixins/collidable';

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = config;
  }
  create() {
    this.add.image(this.config.width / 2, this.config.height / 2, 'background');
    // .setOrigin(0.5);
    this.score = 0;
    this.player = this.createPlayer();
    this.enemies = this.createEnemies();
    this.initCamera(this.player);
    this.physics.collide(this.enemies);

    this.enemies.addOverlap(this.player.projectiles, this.onHit);
    // this.createGameEvents();
  }
  update() {
    // console.log(this.enemies);
  }

  createPlayer() {
    // return new Player(this, start.x, start.y);
    return new Player(this, this.config.width / 2, this.config.height / 2);
  }

  initCamera(followObj) {
    // set camera center
    this.cameras.main.startFollow(followObj); // 카메라를 플레이어에 고정시킴
    this.cameras.main.shake(500, 0.01, 0.01); // 카메라 흔드는 효과
    // this.cameras.main.setFollowOffset(-180, -100); // 정중앙 설정
  }

  createEnemies() {
    // Enemy를 담을 Phaser Group 을 선언한다. 아직 비어있음
    const enemies = new Enemies(this);

    // 몬스터의 소환
    const monster_Num = 360;
    for (let idx = 0; idx < monster_Num; idx++) {
      // 리스폰위치 변수 선언
      let x;
      let y;

      // 상하좌우 고르게 몬스터를 생성하기 위해
      // selectXY : X축 Y축 랜덤선택
      const selectXY = Phaser.Math.Between(0, 1) < 0.5 ? true : false;

      // selectSide : X축이면 왼쪽=0 오른쪽=width      Y축이면 위쪽=0 아래쪽=height 랜덤선택
      const selectSide = Phaser.Math.Between(0, 1) < 0.5 ? true : false;

      if (selectXY) {
        y = Phaser.Math.Between(0, this.config.height);
        x = selectSide
          ? Phaser.Math.Between(0, -500)
          : Phaser.Math.Between(this.config.width + 0, this.config.width + 500);
      } else {
        x = Phaser.Math.Between(0, this.config.width);
        y = selectSide
          ? Phaser.Math.Between(0, -500)
          : Phaser.Math.Between(
              this.config.height + 0,
              this.config.height + 500
            );
      }

      enemies.add(new Enemy(this, x, y));
    }
    // enemies.getChildren().forEach((enemy) => {
    //   enemies.addCollider(enemy);
    // });

    return enemies;
  }

  // createGameEvents() {
  //   EventEmitter.on("PLAYER_LOOSE", () => {
  //     console.log("Helko!");
  //     this.scene.restart({ gameStatus: "PLAYER_LOOSE" });
  //   });
  // }
}

export default PlayScene;
