import Phaser from 'phaser';
// import anims from '../mixins/anims';
import collidable from '../mixins/collidable';
// import initAnimations from '../anims/index';

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
  }
  init() {
    // this.frameMax = 0;
    this.hp = 100; //enemy hp
    this.speed = 80; //enemy 스피드
    this.hasBeenHit = false; //
    this.body.setSize(188, 188);
    //Scene의 입력 키보드 선언
    // initAnimations(this.scene.anims);
    this.setOrigin(0.5).setScale(0.3);

    this.frameLimit = 50;
    this.frameCount = 0;
    this.play('cat');
  }

  initEvents() {
    // 코어 playScene의 프레임마다 update가 호출되면 자동으로 enemy의 update를 호출함
    this.scene.events.on('update', this.update, this);
  }

  handleAttacks() {
    this.projectiles.fireProjectile(this, 'cat');
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
      EventEmitter.emit('PLAYER_LOOSE');
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
}

export default Enemy;
