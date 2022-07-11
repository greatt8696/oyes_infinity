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
    this.setSize(300, 300);
  }

  // 프레임마다 업데이트되는 대신 호출되는함수
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // 투사체의 이동거리를 누적하여 더함
    this.traveledDistance += this.body.deltaAbsX();

    // 현재이동거리가 최대거리를 넘지 않았지 확인
    if (this.isOutOfRange()) {
      this.body;
      //이동거리를 넘으면 맵좌표 x:-1000, y:-1000로 이동시킴
      this.body.reset(-1000, -1000);
      this.activateProjectile(false);
      this.traveledDistance = 0;
    }
  }

  fire(x, y, anim, angle) {
    console.log("firesword fire@@", this.children);
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
    this.body.reset(this.x - 2000, this.y - 2000);
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
