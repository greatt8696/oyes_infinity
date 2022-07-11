import Phaser from "phaser";
import Projectile from "./Projectile";
import { getTimestamp } from "../utils/functions";
import { getWeaponType } from "./weapon/weaponType";

class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene, key) {
    super(scene.physics.world, scene);
    this.type = getWeaponType(key)
    this.createMultiple({
      frameQuantity: this.type.max,
      active: false,
      visible: false,
      key,
      classType: Projectile,
    });

    this.timeFromLastProjectile = null;
  }
  changeWeapon(key) {
    console.log(this.type, key);
    this.type = getWeaponType(key)
    const children = this.getChildren();
    children.splice(0, children.length);
    this.createMultiple({
      frameQuantity: this.type.max,
      active: false,
      visible: false,
      key,
      classType: this.type.sword,
    });
  }
  fireProjectile(initiator, anim, target) {
    const projectile = this.getFirstDead(false);

    if (!projectile) {
      return;
    }
    if (
      this.timeFromLastProjectile &&
      this.timeFromLastProjectile + projectile.cooldown > getTimestamp()
    ) {
      return;
    }

    const playerPosition = initiator.getCenter();
    let centerX;
    let centerY;

    const enemyPosition = target.getCenter();

    const angle = Phaser.Math.Angle.BetweenPoints(
      playerPosition,
      enemyPosition
    );

    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.setFlipX(false);
      centerX = playerPosition.x + 10;
      centerY = playerPosition.y;
    } else {
      projectile.setFlipX(true);
      centerX = playerPosition.x - 10;
      centerY = playerPosition.y;
    }

    projectile.fire(centerX, centerY, anim, angle);
    this.timeFromLastProjectile = getTimestamp();
  }
}

export default Projectiles;
