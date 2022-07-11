import Phaser from 'phaser';
// import anims from '../mixins/anims';
import collidable from '../mixins/collidable';
// import initAnimations from '../anims/index';
import HpBar from '../hud/HpBar';
class Enemy extends Phaser.Physics.Arcade.Sprite {
  //scene : 플레이어를 호출한 scene, x, y: 캐릭터 생성지점
  constructor(scene, x, y) {
    //부모 요소 셋팅
    super(scene, x, y, 'cat');
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
    this.initOnce();
  }
  init() {
    // this.frameMax = 0;
    this.hp = 80; //enemy hp
    this.speed = 15; //enemy 스피드
    this.hasBeenHit = false; //
    //Scene의 입력 키보드 선언
    // initAnimations(this.scene.anims);
    this.frameLimit = 50;
    this.frameCount = 0;
    if (this.hpBar) {
      this.hpBar.redraw(
        this.body.x,
        this.body.y + this.body.height,
        1,
        this.hp
      );
    }
    this.activateEnemy(true);
  }

  initOnce() {
    this.body.setSize(188, 188);
    this.setOrigin(0.5).setScale(0.3);
    this.hpBar = new HpBar(this.scene, this.body.x, this.body.y, 2, this.hp);
    this.play('cat');
  }

  handleHasBeenHit() {
    this.hasBeenHit = true; //
    this.body.velocity;
    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false; //
    });
  }

  initEvents() {
    // 코어 playScene의 프레임마다 update가 호출되면 자동으로 enemy의 update를 호출함
    this.scene.events.on('update', this.update, this);
  }

  handleAttacks() {
    this.projectiles.fireProjectile(this, 'cat');
  }

  // Enemy is source of the damage for the player
  deliversHit() {}

  takesHit(source) {
    if (this.hasBeenHit) return;
    source.deliversHit(this);
    this.hp -= source.damage;
    this.hpBar.decrease(this.hp);

    if (this.hp <= 0) {
      this.activateEnemy(false);
      this.setVelocity(0, 0);
      this.clearTint();
      this.damageAnim.stop();
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);
      this.setRespawn();
    } else {
      this.handleHasBeenHit();
      this.damageAnim = this.playDamageTween();
      this.scene.time.delayedCall(300, () => {
        // this.setAlpha(1);
        this.clearTint();
        this.damageAnim.stop();
      });
    }
  }

  playDamageTween() {
    // return this.scene.tweens.add({
    //   targets: this,
    // });
    return this.scene.tweens.add({
      targets: this,
      duration: 25,
      repeat: -1,
      yoyo: true,
      // alpha: 0,
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

    // console.log('몹 위치', this.body.x, this.body.y);

    this.hpBar.redraw(
      this.body.x,
      this.body.y + this.body.height,
      1,
      this.hp,
      this.scene.player
    );
  }
  setRespawn() {
    this.init();
    // this.clearTint();

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

    this.body.checkCollision.none = false;
    this.setCollideWorldBounds(true);
  }

  activateEnemy(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }
}

export default Enemy;
