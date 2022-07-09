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
};
