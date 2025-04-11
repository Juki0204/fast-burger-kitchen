import Phaser from "phaser";
import MainScene from "./MainScene";

class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  preload() { }

  create(data: any) {
    this.cameras.main.setRoundPixels(true);

    const selectSE = this.sound.add('selectSE', { loop: false, volume: 0.5 });
    const mainScene = this.scene.get('MainScene') as MainScene;

    const resultBg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setDepth(10).setAlpha(0);
    const oneMoreBtn = this.add.image((this.cameras.main.width / 2) - 10, this.cameras.main.height - 100, 'oneMoreBtn').setOrigin(1, 1).setScale(0.6).setDepth(10).setAlpha(0);
    const backToTitleBtn = this.add.image((this.cameras.main.width / 2) + 10, this.cameras.main.height - 100, 'backToTitleBtn').setOrigin(0, 1).setScale(0.6).setDepth(10).setAlpha(0);

    //ハイスコア
    const resultScore = data.score;
    const highScore = localStorage.getItem("highScore");
    let highScoreTxt: string = "";
    console.log(highScore);

    if (highScore) {
      if (highScore < resultScore) {
        localStorage.setItem("highScore", resultScore);
        highScoreTxt = "ハイスコア更新！";
      } else {
        highScoreTxt = `ハイスコア:${parseInt(highScore).toLocaleString()}円`;
      }
    } else {
      localStorage.setItem("highScore", resultScore);
      highScoreTxt = "ハイスコア更新！";
    }

    this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 2) - 50, '今回のスコア', { fontFamily: 'sans serif', fontSize: 24, fontStyle: 'bold', color: 'white', padding: { x: 0, y: 5 } }).setOrigin(0.5, 0.5).setDepth(10);
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `${parseInt(resultScore).toLocaleString()}円`, { fontFamily: 'sans serif', fontSize: 40, fontStyle: 'bold', color: 'white', padding: { x: 0, y: 5 } }).setOrigin(0.5, 0.5).setDepth(10);
    this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 2) + 40, highScoreTxt, { fontFamily: 'sans serif', fontSize: 20, fontStyle: 'bold', color: 'white', padding: { x: 0, y: 5 } }).setOrigin(0.5, 0.5).setDepth(10);

    this.tweens.add({
      targets: [resultBg],
      alpha: 0.8,
      duration: 500,
    });

    this.tweens.add({
      targets: [oneMoreBtn, backToTitleBtn],
      alpha: 1,
      duration: 500,
      onComplete: () => {
        oneMoreBtn.setInteractive();
        backToTitleBtn.setInteractive();

        oneMoreBtn.on('pointerdown', () => {
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

export default ResultScene;