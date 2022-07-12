import Phaser from "phaser";
import EffectManager from "../../effects/EffectManager";
import Projectile from "../Projectile";

class FireSword extends Projectile {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    // 투사체가 playScene에 보일수 있도록 등록
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //투사체 속도
    this.speed = 900;

    //투사체의 최대거리
    this.maxDistance = 2500;

    //현재 투사체가 이동한거리
    this.traveledDistance = 0;

    // 대미지
    this.damage = 50;

    //쿨타임
    this.cooldown = 0;

    // 추후 추가
    this.effectManager = new EffectManager(this.scene);

    // 투사체의 크기
    this.setSize(50, 50);

    this.setCollideWorldBounds(false);

    this.center = this.scene.player.body;

    

    this.initEvents();
  }

  // 프레임마다 업데이트되는 대신 호출되는함수
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // 투사체의 이동거리를 누적하여 더함
    const moveDistance = Math.sqrt(
      this.body.deltaAbsX() ** 2 + this.body.deltaAbsY() ** 2
    );
    this.traveledDistance += moveDistance;

    // 현재이동거리가 최대거리를 넘지 않았지 확인
    if (this.isOutOfRange()) {
      //이동거리를 넘으면 맵좌표 x:-1000, y:-1000로 이동시킴
      this.activateProjectile(false);
      this.body.reset(0, 0);
      this.traveledDistance = 0;
    }
  }

  initEvents() {
    // 코어 playScene의 프레임마다 update가 호출되면 자동으로 enemy의 update를 호출함
    this.scene.events.on("update", this.update, this);
  }
  update() {}

  fire(x, y, anim, angle) {
    this.body.reset(x, y);
    this.activateProjectile(true);
    this.scene.physics.velocityFromRotation(
      angle,
      this.speed,
      this.body.velocity
    );

    // anim && this.play(anim, true);
  }

  deliversHit(target) {
    this.activateProjectile(false);
    this.traveledDistance = 0;
    this.body.reset(0, 0);
    // this.effectManager.playEffectOn('ctr_atk', target, impactPosition);
  }

  activateProjectile(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }

  isOutOfRange() {
    return this.traveledDistance && this.traveledDistance >= this.maxDistance;
  }
}

export default FireSword;
