import Phaser from 'phaser';
import Projectile from './Projectile';
import { getTimestamp } from '../utils/functions';

class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene, key) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 25,
      active: false,
      visible: false,
      key,
      classType: Projectile,
    });

    this.timeFromLastProjectile = null;
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
