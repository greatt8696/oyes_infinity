import Phaser from "phaser";
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";
import initAnimations from"../anims/index"

class Player extends Phaser.Physics.Arcade.Sprite {
  //scene : 플레이어를 호출한 scene, x, y: 캐릭터 생성지점
  constructor(scene, x, y) {
    //부모 요소 셋팅
    super(scene, x, y, "cat");
    // 호출한 scene에 player sprite 객체를 추가함.
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    /*  Mixins (재사용 함수 및 요소)
        자주 사용하지만 player 오브젝트(클래스)에 
        하나씩 넣어 주어야할 때 */
    Object.assign(this, anims);
    Object.assign(this, collidable);

    this.init();
    this.initEvents(this);
  }
  init() {
    this.hp = 100; //플레이어 hp
    this.speed = 150; //플레이어 스피드
    this.hasBeenHit = false; //
    this.body.setSize(188, 188);
    // this.body.setGravityY(this.gravity);

    //Scene의 입력 키보드 선언
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.setOrigin(0.5);
    initAnimations(this.scene.anims)
    this.play("cat")
  }

  initEvents() {
    this.scene.events.on("update", this.update, this);
  }

  handleAttacks() {
    this.projectiles.fireProjectile(this, "cat");
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }
  takesHit(source) {
    if (this.hasBeenHit) {
      return;
    }

    this.health -= source.damage || source.properties.damage || 0;
    if (this.health <= 0) {
      EventEmitter.emit("PLAYER_LOOSE");
      return;
    }

    this.hasBeenHit = true;
    this.bounceOff(source);
    const hitAnim = this.playDamageTween();
    this.hp.decrease(this.health);

    source.deliversHit && source.deliversHit(this);

    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    });
  }

  update() {
    const { left, right, up, down } = this.cursors;
    if (left.isDown) {
      console.log("left");
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-this.speed);
      this.setFlipX(false);
    } else if (right.isDown) {
      console.log("right");
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityX(this.speed);
      this.setFlipX(true);
    } else {
      this.setVelocityX(0);
    }
    if (up.isDown) {
      console.log("up");
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityY(-this.speed);
    } else if (down.isDown) {
      console.log("down");
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityY(this.speed);
    } else {
      this.setVelocityY(0);
    }
  }
}

export default Player;
