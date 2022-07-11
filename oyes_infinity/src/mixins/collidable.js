import Phaser from "phaser";

export default {
  addCollider(otherObject, callback, context) {
    this.scene.physics.add.collider(
      this,
      otherObject,
      callback,
      null,
      context || this
    );
    return this;
  },
  addOverlap(otherGameobject, callback, context) {
    this.scene.physics.add.overlap(this, otherGameobject, callback, null, context || this);
    return this;
  },
  prevHasHit: null,
  bodyPositionDifferenceX: 0,
  prevRay: null,
};
