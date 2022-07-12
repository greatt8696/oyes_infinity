import Phaser from "phaser";
import Projectile from "./Projectile";
import { getTimestamp } from "../utils/functions";
import { getWeaponType } from "./weapon/weaponType";

class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene, key) {
    super(scene.physics.world, scene);
    this.type = getWeaponType(key);
    this.createMultiple({
      frameQuantity: this.type.max,
      active: false,
      visible: false,
      setXY: { x: -5000, y: -5000 },
      key,
      classType: Projectile,
    });
    this.timeFromLastProjectile = null;
    // this.getChildren((child) => {
    //   child.reset(-5000, -5000);
    // });
  }

  changeWeapon(key) {
    console.log(this.type, key);
    this.type = getWeaponType(key);
    this.clear(false, true);
    this.createMultiple({
      frameQuantity: this.type.max,
      active: false,
      setXY: { x: -5000, y: -5000 },
      visible: false,
      key,
      classType: this.type.sword,
    });

    if (key === "FireSword") {
      this.circle = new Phaser.Geom.Circle(
        this.scene.player.x,
        this.scene.player.y,
        220
      );

      Phaser.Actions.PlaceOnCircle(this.getChildren(), this.circle);
      this.scene.add.container(
        this.scene.player.x,
        this.scene.player.y,
        this.getChildren()
      );
    }
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
