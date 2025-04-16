import Phaser from "phaser";

class TitleScene extends Phaser.Scene {

  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {

    // アセット読み込み時のローディング画面作成
    const progressBarBg = this.add.graphics().setDepth(50);
    progressBarBg.fillStyle(0xffffff, 1);
    progressBarBg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    const fontFamily = '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif';

    const progressBar = this.add.graphics().setDepth(50);
    const loadingTxt = this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 2) - 30, 'ロード中...', { fontFamily: fontFamily, fontStyle: 'bold', fontSize: 20, color: '#333333', padding: { x: 0, y: 3 } }).setOrigin(0.5, 0.5).setDepth(50);
    const percentTxt = this.add.text(this.cameras.main.width / 2, (this.cameras.main.height / 2) + 30, '0%', { fontFamily: fontFamily, fontStyle: 'bold', fontSize: 20, color: '#333333' }).setOrigin(0.5, 0.5).setDepth(50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();

      progressBar.fillStyle(0x333333, 1);
      progressBar.fillRoundedRect(100, this.cameras.main.height / 2, (this.cameras.main.width - 200) * value, 10, 3);

      percentTxt.setText(Math.floor(value * 100) + '%');
    });

    this.load.image('bg', './images/background.png');
    this.load.image('titleBg', './images/title_bg.png');
    this.load.image('playBtn', './images/play.png');
    this.load.image('helpBtn', './images/help.png');
    this.load.image('helpManual', './images/help_manual.png');
    this.load.image('logo', './images/title_logo.png');
    this.load.image('closeBtn', './images/close_btn.png');

    this.load.image('timeBg', './images/time_bg.png');
    this.load.image('timeBorder', './images/time_border.png');
    this.load.image('clock', './images/clock.png');
    this.load.image('pauseBtn', './images/pause_btn.png');
    this.load.image('success', './images/success.png');
    this.load.image('resumeBtn', './images/resume.png');
    this.load.image('restartBtn', './images/restart.png');
    this.load.image('backToTitleBtn', './images/backtotitle.png');
    this.load.image('oneMoreBtn', './images/onemore.png');

    this.load.image('btn1', './images/main_btn1.png');
    this.load.image('btn2', './images/main_btn2.png');
    this.load.image('btn3', './images/main_btn3.png');
    this.load.image('btn4', './images/main_btn4.png');
    this.load.image('btn5', './images/main_btn5.png');
    this.load.image('btn6', './images/main_btn6.png');
    this.load.image('btn7', './images/main_btn7.png');
    this.load.image('btn8', './images/main_btn8.png');

    this.load.image('topBuns', './images/top_buns.png');
    this.load.image('bottomBuns', './images/bottom_buns.png');
    this.load.image('onion', './images/onion.png');
    this.load.image('lettuce', './images/lettuce.png');
    this.load.image('pickles', './images/pickles.png');
    this.load.image('tomato', './images/tomato.png');
    this.load.image('cheese', './images/cheese.png');
    this.load.image('patty', './images/patty.png');

    this.load.image('start', './images/start.png');
    this.load.image('finish', './images/finish.png');
    this.load.image('perfect', './images/perfect.png');
    this.load.image('good', './images/good.png');
    this.load.image('bad', './images/bad.png');

    this.load.audio('titleBGM', './sounds/title_bgm.mp3');
    this.load.audio('mainBGM', './sounds/main_bgm.mp3');
    this.load.audio('selectSE', './sounds/select_se.mp3');
    this.load.audio('fillingSE', './sounds/filling_se.mp3');
    this.load.audio('slideSE', './sounds/slide_se.mp3');
    this.load.audio('perfectSE', './sounds/perfect_se.mp3');
    this.load.audio('goodSE', './sounds/good_se.mp3');
    this.load.audio('startSE', './sounds/start_se.mp3');
    this.load.audio('finishSE', './sounds/finish_se.mp3');

    // ロード完了後にタイトル画面を生成
    this.load.on('complete', () => {
      this.cameras.main.setRoundPixels(true);

      // if (this.scale.isFullscreen) {
      //   console.log('既にフルスクリーンです');
      // } else {
      //   this.scale.startFullscreen();
      //   console.log('フルスクリーンモードへ移行');
      // }

      const selectSE = this.sound.add('selectSE', { loop: false, volume: 0.5 })
      const bgm = this.sound.add('titleBGM', { loop: true, volume: 0.3 });
      bgm.play();

      this.add.image(this.cameras.main.width / 2, 0, 'titleBg').setOrigin(0.5, 0);
      const logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'logo').setOrigin(0.5, 1);
      const logoWidth = this.cameras.main.width - 20;
      const logoHeight = logoWidth * 0.865;
      logo.setDisplaySize(logoWidth, logoHeight);

      const highScore = localStorage.getItem("highScore");
      let highScoreTxt: string = "";
      console.log(highScore);

      if (highScore) {
        highScoreTxt = `ハイスコア:${parseInt(highScore).toLocaleString()}円`;
      }
      this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 14, highScoreTxt, { fontFamily: fontFamily, fontSize: `24px`, fontStyle: "bold", color: '#333333' }).setOrigin(0.5, 1).setDepth(10);
      const highScoreArea = this.add.graphics();
      highScoreArea.fillStyle(0xFFFFFF, 0.8);
      highScoreArea.fillRoundedRect(8, this.cameras.main.height - 48, this.cameras.main.width - 16, 40, 6);
      const playBtn = this.add.image(this.cameras.main.width / 2, (this.cameras.main.height / 2) + 20, 'playBtn').setOrigin(0.5, 0);
      const helpBtn = this.add.image(this.cameras.main.width / 2, (this.cameras.main.height / 2) + 160, 'helpBtn').setOrigin(0.5, 0);
      playBtn.setInteractive();
      helpBtn.setInteractive();

      this.tweens.add({
        targets: [progressBarBg, progressBar, loadingTxt, percentTxt],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          progressBarBg.destroy();
          progressBar.destroy();
          loadingTxt.destroy();
          percentTxt.destroy();
        }
      });

      helpBtn.on('pointerdown', () => {
        selectSE.play();
        playBtn.removeInteractive();
        helpBtn.removeInteractive();

        const helpBg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setDepth(10).setAlpha(0);
        const helpManual = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'helpManual').setOrigin(0.5, 0.5).setDepth(10).setAlpha(0);
        const manualWidth = this.cameras.main.width - 40;
        const manualHeight = manualWidth * 1.202;
        helpManual.setDisplaySize(manualWidth, manualHeight);
        const closeBtn = this.add.image(this.cameras.main.width - 10, 10, 'closeBtn').setOrigin(1, 0).setDepth(10).setAlpha(0);

        this.tweens.add({
          targets: [helpBg],
          alpha: 0.8,
          duration: 500,
        })

        this.tweens.add({
          targets: [helpManual, closeBtn],
          alpha: 1,
          duration: 500,
          onComplete: () => {
            closeBtn.setInteractive();
            closeBtn.on('pointerdown', () => {
              selectSE.play();
              this.tweens.add({
                targets: [helpBg, helpManual, closeBtn],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                  helpBg.destroy();
                  helpManual.destroy();
                  closeBtn.destroy();

                  playBtn.setInteractive();
                  helpBtn.setInteractive();
                }
              });
            })
          }
        });
      });

      playBtn.on('pointerdown', () => {
        selectSE.play();
        this.cameras.main.fadeOut(1000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MainScene');
          bgm.stop();
        });
      });
    });

  }

  create() {
    // const pixelRatio = window.devicePixelRatio || 1;
    // const canvas = this.sys.game.canvas;

    // console.log(pixelRatio);
    // console.log(this.game.config.width);
    // console.log(this.game.config.height);
    // canvas.width = Math.floor(this.game.config.width as number * pixelRatio);
    // canvas.height = Math.floor(this.game.config.height as number * pixelRatio);

    // canvas.style.width = `${canvas.width / pixelRatio}px`;
    // canvas.style.height = `${canvas.height / pixelRatio}px`;

    // // const ctx = this.sys.game.context as CanvasRenderingContext2D;
    // // if (ctx) {
    // //   ctx.scale(pixelRatio, pixelRatio);
    // // } else {
    // //   console.error('canvas rendering context is not available')
    // // }

    // const ctx = canvas.getContext('2d'); // CanvasRenderingContext2Dを取得
    // if (ctx) {
    //   ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0); // スケールを設定
    // };


    // this.cameras.main.setZoom(1);
  }

  update() {

  }
}

export default TitleScene;