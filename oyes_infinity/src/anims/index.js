export default anims => {
  anims.create({
    key: "cat",
    frames: anims.generateFrameNumbers("cat", { start: 0, end: 20 }),
    frameRate: 12,
    repeat: -1,
  });
  anims.create({
    key: "idle",
    frames: anims.generateFrameNumbers("player-1-idle", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1,
  });
  anims.create({
    key: "run",
    frames: anims.generateFrameNumbers("player-1-run", { start: 0, end: 5 }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: "back",
    frames: anims.generateFrameNumbers("player-1-back", { start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1,
  });
  anims.create({
    key: "hurt",
    frames: anims.generateFrameNumbers("player-1-hurt", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: 3,
  });
  anims.create({
    key: "death",
    frames: anims.generateFrameNumbers("player-1-death", { start: 0, end: 7 }),
    frameRate: 8,
    repeat: 0,
  });
  anims.create({
    key: "throw",
    frames: anims.generateFrameNumbers("player-1-throw", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: 0,
  });
};
