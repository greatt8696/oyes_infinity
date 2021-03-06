import Phaser from "phaser";
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";
import initAnimations from "../anims/index";
import Projectiles from "../attacks/Projectiles";
import HpBar from "../hud/HpBar";
import { getWeaponType } from "../attacks/weapon/weaponType";

class Player extends Phaser.Physics.Arcade.Sprite {
  //scene : 플레이어를 호출한 scene, x, y: 캐릭터 생성지점
  constructor(scene, x, y) {
    //부모 요소 셋팅
    super(scene, x, y, "cat");
    this.scene = scene;
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
    this.speed = 250; //플레이어 스피드
    this.hasBeenHit = false; //
    this.playerPosition = this.body;
    this.body.setSize(188, 188);
    this.weapon = "NormalSword"; //
    this.isChange = false;
    //Scene의 입력 키보드 선언
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    initAnimations(this.scene.anims);
    this.setOrigin(0.5).setScale(0.5);
    this.hpBar = new HpBar(
      this.scene,
      this.playerPosition.x,
      this.playerPosition.y,
      2.5,
      this.hp
    );

    this.projectiles = new Projectiles(this.scene, `${this.weapon}`);
    this.play("cat");
    setInterval(() => {
      this.handleAttacks();
    }, 100);
  }

  initEvents() {
    this.scene.events.on("update", this.update, this);
  }

  handleAttacks() {
    const enemies = this.scene.enemies.getChildren();
    const randEnemy = Phaser.Math.RND.pick(enemies);
    this.projectiles.fireProjectile(this, `${this.weapon}`, randEnemy);
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xff0000,
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
      this.clearTint();
      hitAnim.stop();
    });
  }

  onHit(entity, source) {
    entity.takesHit(source);
  }

  update() {
    const { left, right, up, down, space } = this.cursors;
    if (space.isDown) {
      if (!this.isChange) {
        this.isChange = true;
        this.weapon =
          this.weapon === "NormalSword" ? "FireSword" : "NormalSword";
        this.projectiles.changeWeapon(this.weapon);
        setTimeout(() => (this.isChange = false), 1000);
      }
    }
    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-this.speed);
      this.scene.text.x += -this.speed * 0.01665;
      this.setFlipX(false);
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityX(this.speed);
      this.scene.text.x += this.speed * 0.01665;
      this.setFlipX(true);
    } else {
      this.setVelocityX(0);
    }
    if (up.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityY(-this.speed);
      this.scene.text.y += -this.speed * 0.01665;
    } else if (down.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityY(this.speed);
      this.scene.text.y += this.speed * 0.01665;
    } else {
      this.setVelocityY(0);
    }

    this.hpBar.redraw(this.body.x, this.body.y + this.body.height, 1, this.hp);
  }
}

export default Player;
