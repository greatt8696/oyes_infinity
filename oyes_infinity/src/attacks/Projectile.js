import Phaser from "phaser";
import EffectManager from "../effects/EffectManager";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 1500;
    this.traveledDistance = 0;

    this.damage = 10;
    this.cooldown = 0;

    this.effectManager = new EffectManager(this.scene);
    this.body.setSize(120, 120);
    this.setBodySize(120, 120);
    // this.play('crt_atk');
    this.setScale(0.5);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.traveledDistance += this.body.deltaAbsX();

    if (this.isOutOfRange()) {
      this.body.reset(-1000, -1000);
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
    if (this.isOutOfRange()) {
      this.activateProjectile(false);
      this.traveledDistance = 0;
      const impactPosition = { x: this.x, y: this.y };
      this.body.reset(-2000, -2000);
      // this.effectManager.playEffectOn('ctr_atk', target, impactPosition);
    }
  }

  activateProjectile(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }

  isOutOfRange() {
    return this.traveledDistance && this.traveledDistance >= this.maxDistance;
  }
}

export default Projectile;
