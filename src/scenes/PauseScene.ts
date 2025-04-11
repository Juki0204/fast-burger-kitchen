import Phaser from "phaser";
import MainScene from "./MainScene";

class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  preload() { }

  create() {
    this.cameras.main.setRoundPixels(true);

    const selectSE = this.sound.add('selectSE', { loop: false, volume: 0.5 });
    const mainScene = this.scene.get('MainScene') as MainScene;

    const pauseBg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setDepth(10).setAlpha(0);
    const resumeBtn = this.add.image(this.cameras.main.width / 2, (this.cameras.main.height / 2) - 160, 'resumeBtn').setOrigin(0.5, 0.5).setDepth(10).setAlpha(0);
    const restartBtn = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'restartBtn').setOrigin(0.5, 0.5).setDepth(10).setAlpha(0);
    const backToTitleBtn = this.add.image(this.cameras.main.width / 2, (this.cameras.main.height / 2) + 160, 'backToTitleBtn').setOrigin(0.5, 0.5).setDepth(10).setAlpha(0);

    this.tweens.add({
      targets: [pauseBg],
      alpha: 0.8,
      duration: 500,
    })

    this.tweens.add({
      targets: [resumeBtn, restartBtn, backToTitleBtn],
      alpha: 1,
      duration: 500,
      onComplete: () => {
        resumeBtn.setInteractive();
        restartBtn.setInteractive();
        backToTitleBtn.setInteractive();

        resumeBtn.on('pointerdown', () => {
          selectSE.play();
          this.scene.stop();
          this.scene.resume('MainScene');
        });

        restartBtn.on('pointerdown', () => {
          selectSE.play();
          this.scene.stop();
          this.scene.start('MainScene');
          mainScene.bgm.stop();
        });

        backToTitleBtn.on('pointerdown', () => {
          selectSE.play();
          this.scene.stop();
          this.scene.stop('MainScene');
          this.scene.start('TitleScene');
          mainScene.bgm.stop();
        });
      }
    });
  }
}

export default PauseScene;