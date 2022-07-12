import Phaser from "phaser";
import EffectManager from "../effects/EffectManager";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 900;
    this.traveledDistance = 0;

    this.damage = 30;
    this.cooldown = 0;

    this.effectManager = new EffectManager(this.scene);
    this.setBodySize(0,0)
    // this.play('crt_atk');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    const moveDistance = Math.sqrt(
      this.body.deltaAbsX() ** 2 + this.body.deltaAbsY() ** 2
    );

    this.traveledDistance += moveDistance;

    if (this.isOutOfRange()) {
      this.body.reset(this.scene.player.x, this.scene.player.y);
      this.activateProjectile(false);
      this.traveledDistance = 0;
    }
  }

  fire(x, y, anim, angle) {
    this.activateProjectile(true);
    this.body.reset(x, y);
    this.scene.physics.velocityFromRotation(
      angle,
      this.speed,
      this.body.velocity
    );

    // anim && this.play(anim, true);
  }

  deliversHit(target) {
    // console.log("deliversHit");
    if (this.isOutOfRange()) {
      this.activateProjectile(false);
      this.traveledDistance = 0;
      const impactPosition = { x: this.x, y: this.y };
      this.body.reset(0,0);
      console.log(this.body.x, this.body.y);
      // this.effectManager.playEffectOn('ctr_atk', target, impactPosition);
    }
    // this.activateProjectile(false);
    // this.traveledDistance = 0;
    // const impactPosition = { x: this.x, y: this.y };
    // this.body.reset(0,0);
    // console.log(this.body.x, this.body.y);
  }

  activateProjectile(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
    this.setBodySize(0,0)
  }

  isOutOfRange() {
    return this.traveledDistance && this.traveledDistance >= this.maxDistance;
  }
}

export default Projectile;
