import Phaser from 'phaser';

// PlayScene이 시작하기 전 이미지로드 Scene

class PreloadScene extends Phaser.Scene {
  constructor() {
    //Scene이 갖춰야할 기본 셋팅 (Phaser.Scene 부모요소 셋팅)
    super('PreloadScene');
  }

  //Scene 선언후 constructor 다음 시작하는 함수
  preload() {
    // this.load.image('background', 'assets/background.png');
    this.load.image('forestBG', 'assets/forestBG.png');
    this.load.image('desertBG', 'assets/desertBG.png');
    this.load.image('player_character', 'assets/player_1/Pink_Monster.png');
    this.load.image('NormalSword', 'assets/normal_atk.png');
    this.load.image('FireSword', 'assets/crt_atk.png');

    this.load.spritesheet(
      'player-1-idle',
      'assets/player_1/Pink_Monster_Idle_4.png',
      {
        frameWidth: 32,
        frameHeight: 32,
        spacing: 32,
      }
    );
    this.load.spritesheet('cat', 'assets/cat.png', {
      frameWidth: 188,
      frameHeight: 188,
      // spacing: 188,
    });

    this.load.spritesheet(
      'player-1-run',
      'assets/player_1/Pink_Monster_Run_6.png',
      {
        frameWidth: 32,
        frameHeight: 32,
        spacing: 32,
      }
    );

    this.load.spritesheet(
      'player-1-throw',
      'assets/player_1/Pink_Monster_Throw_4.png',
      {
        frameWidth: 32,
        frameHeight: 32,
        spacing: 32,
      }
    );

    this.load.spritesheet(
      'player-1-back',
      'assets/player_1/Pink_Monster_Climb_4.png',
      {
        frameWidth: 32,
        frameHeight: 32,
        spacing: 32,
      }
    );
  }

  // preload 다음 실행되는 함수
  create() {
    //모든 이미지가 preload() 함수에서 로드된후 PlayScene 시작 (중요)
    this.scene.start('PlayScene');
  }
}

export default PreloadScene;
