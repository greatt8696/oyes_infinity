import Phaser from "phaser";
// import anims from '../mixins/anims';
import collidable from "../mixins/collidable";
// import initAnimations from '../anims/index';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  //scene : 플레이어를 호출한 scene, x, y: 캐릭터 생성지점
  constructor(scene, x, y) {
    //부모 요소 셋팅
    super(scene, x, y, "cat");
    // 호출한 scene에 enemy sprite 객체를 추가함.
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene = scene;

    /*  Mixins (재사용 함수 및 요소)
        자주 사용하지만 enemy 오브젝트(클래스)에 
        하나씩 넣어 주어야할 때 */
    // Object.assign(this, anims);
    Object.assign(this, collidable);

    this.init();
    this.initEvents(this);
  }
  init() {
    // this.frameMax = 0;
    this.hp = 30; //enemy hp
    this.speed = 15; //enemy 스피드
    this.hasBeenHit = false; //
    this.body.setSize(188, 188);
    //Scene의 입력 키보드 선언
    // initAnimations(this.scene.anims);
    this.setOrigin(0.5).setScale(0.3);

    this.frameLimit = 50;
    this.frameCount = 0;
    this.play("cat");
  }

  initEvents() {
    // 코어 playScene의 프레임마다 update가 호출되면 자동으로 enemy의 update를 호출함
    this.scene.events.on("update", this.update, this);
  }

  handleAttacks() {
    this.projectiles.fireProjectile(this, "cat");
  }

  // Enemy is source of the damage for the player
  deliversHit() {}

  takesHit(source) {
    source.deliversHit(this);
    this.hp -= source.damage;

    if (this.hp <= 0) {
      this.setVelocity(0, 0);
      this.damageAnim.stop()
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);
      this.setRespawn();
      this.play("cat");
    } else {
      this.damageAnim = this.playDamageTween();
      this.play("cat");
    }

    this.scene.time.delayedCall(300, ()=>{
      this.damageAnim.stop()
      this.play("cat");
    })
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      tint: 0xff0000,
    });
  }

  update() {
    // console.log(this.getCenter());
    // 플레이어의 좌표를 받아옴
    this.frameCount++;

    if (this.frameCount > this.frameLimit) {
      const playerPosition = this.scene.player.getCenter();

      // 적의 좌표를 받아옴
      const enemyPosition = this.getCenter();

      // 적과 플레이어의 각도계산
      const angle = Phaser.Math.Angle.BetweenPoints(
        enemyPosition,
        playerPosition
      );
      // 각도에따라 100의 속도로
      this.scene.physics.velocityFromRotation(
        angle,
        this.speed,
        this.body.velocity
      );

      // 플레이어 위치가 적의 오른쪽에 있을경우 오른쪽으로 이미지 방향 전환
      this.setFlipX(enemyPosition.x < playerPosition.x ? true : false);
      this.frameCount = 0;
    }
  }
  setRespawn() {
    this.init();
    this.clearTint();
    // 리스폰위치 변수 선언
    let x;
    let y;

    // 상하좌우 고르게 몬스터를 생성하기 위해
    // selectXY : X축 Y축 랜덤선택
    const selectXY = Phaser.Math.Between(0, 1) < 0.5 ? true : false;

    // selectSide : X축이면 왼쪽=0 오른쪽=width      Y축이면 위쪽=0 아래쪽=height 랜덤선택
    const selectSide = Phaser.Math.Between(0, 1) < 0.5 ? true : false;

    if (selectXY) {
      y = Phaser.Math.Between(0, this.scene.config.height);
      x = selectSide
        ? Phaser.Math.Between(0, -500)
        : Phaser.Math.Between(
            this.scene.config.width + 0,
            this.scene.config.width + 500
          );
    } else {
      x = Phaser.Math.Between(0, this.scene.config.width);
      y = selectSide
        ? Phaser.Math.Between(0, -500)
        : Phaser.Math.Between(
            this.scene.config.height + 0,
            this.scene.config.height + 500
          );
    }
    this.body.x = x;
    this.body.y = y;
  }
}

export default Enemy;
