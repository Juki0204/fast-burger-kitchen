import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  timeBar!: Phaser.GameObjects.Rectangle;
  maxTime!: number;
  currentTime!: number;
  score!: number;

  fillingsList = [
    { "num": 1, "ja": "たまねぎ", "en": "onion", "price": 10 },
    { "num": 2, "ja": "チーズ", "en": "cheese", "price": 20 },
    { "num": 3, "ja": "レタス", "en": "lettuce", "price": 10 },
    { "num": 4, "ja": "ピクルス", "en": "pickles", "price": 5 },
    { "num": 5, "ja": "トマト", "en": "tomato", "price": 30 },
    { "num": 6, "ja": "パティ", "en": "patty", "price": 100 },
    { "num": 7, "ja": "バンズ(上)", "en": "topBuns", "price": 30 },
    { "num": 8, "ja": "バンズ(下)", "en": "bottomBuns", "price": 30 },
  ];

  answerList: number[][] = [];
  resultArray: { num: number; ja: string; en: string; count: number; price: number; }[] = [];

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {

  }

  create() {
    this.cameras.main.setRoundPixels(true);

    let gameWidth = this.cameras.main.width;
    let gameHeight = this.cameras.main.height;
    let noworder = false;
    let nowBurgerCreate = false;
    this.score = 0;

    // console.log(gameWidth);
    // console.log(gameHeight);

    this.cameras.main.fadeIn(500);

    //////////////////////// UI関係 //////////////////////////
    this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0x959097).setOrigin(0.5, 0.5);
    this.add.image(gameWidth / 2, 0, 'bg').setOrigin(0.5, 0);

    //一時停止ボタン
    const pauseBtn = this.add.image(gameWidth - 10, 10, 'pauseBtn').setOrigin(1, 0);
    pauseBtn.setInteractive();
    pauseBtn.on('pointerdown', () => {
      this.scene.pause();
      this.scene.launch('PauseScene');
    });

    //制限時間ゲージ
    this.add.image(12, 16, 'timeBg').setOrigin(0, 0);
    this.timeBar = this.add.rectangle(14, 18, 236, 26, 0x30D42D).setOrigin(0, 0);
    this.add.image(12, 16, 'timeBorder').setOrigin(0, 0);
    this.add.image(28, 31, 'clock');

    //制限時間
    this.maxTime = 30;
    this.currentTime = this.maxTime;

    //スコア
    const scoreTxt = this.add.text(12, 50, `SCORE: ${this.score}`, { fontFamily: 'sans serif', fontSize: 18, fontStyle: 'bold', color: "white" }).setOrigin(0, 0);

    // this.time.addEvent({
    //   delay: 1000,
    //   loop: true,
    //   callback: () => {
    //     this.currentTime--;
    //     this.updateTimeBar();
    //   },
    //   callbackScope: this,
    // });

    //操作ボタン
    const btnWidth = (gameWidth - 24) / 3;
    const btnHeight = btnWidth * 0.737705;
    const altBtnWidth = (gameWidth - 20) / 2;
    const altBtnHeight = altBtnWidth * 0.2702703;
    const containerHeight = (btnHeight * 2) + altBtnHeight + 8;

    let btnContainer = this.add.container(0, gameHeight - containerHeight - 8);

    const onionBtn = this.add.image((gameWidth / 2) - (btnWidth / 2) - 4, 0, 'btn1').setDisplaySize(btnWidth, btnHeight).setOrigin(1, 0);
    const cheeseBtn = this.add.image(gameWidth / 2, 0, 'btn2').setDisplaySize(btnWidth, btnHeight).setOrigin(0.5, 0);
    const lettuceBtn = this.add.image((gameWidth / 2) + (btnWidth / 2) + 4, 0, 'btn3').setDisplaySize(btnWidth, btnHeight).setOrigin(0, 0);
    const picklesBtn = this.add.image((gameWidth / 2) - (btnWidth / 2) - 4, btnHeight + 4, 'btn4').setDisplaySize(btnWidth, btnHeight).setOrigin(1, 0);
    const tomatoBtn = this.add.image(gameWidth / 2, btnHeight + 4, 'btn5').setDisplaySize(btnWidth, btnHeight).setOrigin(0.5, 0);
    const pattyBtn = this.add.image((gameWidth / 2) + (btnWidth / 2) + 4, btnHeight + 4, 'btn6').setDisplaySize(btnWidth, btnHeight).setOrigin(0, 0);
    const topBunsBtn = this.add.image((gameWidth / 2) - 2, (btnHeight * 2) + 8, 'btn7').setDisplaySize(altBtnWidth, altBtnHeight).setOrigin(1, 0);
    const bottomBunsBtn = this.add.image((gameWidth / 2) + 2, (btnHeight * 2) + 8, 'btn8').setDisplaySize(altBtnWidth, altBtnHeight).setOrigin(0, 0);
    btnContainer.add([onionBtn, lettuceBtn, picklesBtn, tomatoBtn, cheeseBtn, pattyBtn, topBunsBtn, bottomBunsBtn]);

    const btnList = [
      { btn: onionBtn, arg: 'onion', collideSize: 20 },
      { btn: cheeseBtn, arg: 'cheese', collideSize: 20 },
      { btn: lettuceBtn, arg: 'lettuce', collideSize: 20 },
      { btn: picklesBtn, arg: 'pickles', collideSize: 10 },
      { btn: tomatoBtn, arg: 'tomato', collideSize: 28 },
      { btn: pattyBtn, arg: 'patty', collideSize: 40 },
      { btn: topBunsBtn, arg: 'topBuns', collideSize: 30 },
      { btn: bottomBunsBtn, arg: 'bottomBuns', collideSize: 35 },
    ];

    //////////////////////// ゲーム処理 //////////////////////////

    console.log(Phaser.VERSION);
    //ゲームスタート！
    const startOverlay = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0).setOrigin(0, 0).setInteractive(false).setDepth(50);
    const startImage = this.add.image(gameWidth / 2, - 100, 'start').setOrigin(0.5, 0.5).setDepth(50);

    this.tweens.add({
      targets: startImage,
      y: gameHeight / 2,
      duration: 800,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.time.delayedCall(1800, () => {
          this.tweens.add({
            targets: startImage,
            y: -500,
            duration: 500,
            ease: 'Cubic.easeIn',
            onComplete: () => {
              startImage.destroy();
              startOverlay.destroy();
              //新しい注文の生成
              if (noworder === false) {
                orderGenerator();
                noworder = true;
              }

              this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                  this.currentTime--;
                  this.updateTimeBar();
                },
                callbackScope: this,
              });
            },
          });
        });
      },
    });

    //バーガー作成エリア
    const burgerGround = this.physics.add.staticBody(0, (gameHeight - containerHeight) - 50, gameWidth, 5);

    console.log(btnContainer);

    let burgerGroup = this.physics.add.group();
    let burgerContainer = this.add.container(gameWidth / 2, gameHeight / 2).setDepth(10);

    //バーガーに物理エンジンの制御を加える
    this.physics.add.collider(burgerGroup, burgerGroup, (objectA, objectB) => {
      const objA = objectA as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      const objB = objectB as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

      //衝突判定時に下のオブジェクトにめり込まないようにする処理
      if (objA.body && objB.body) {
        objA.body.setImmovable(true);
        objA.body.setVelocity(0, 0);
        objA.body.setAcceleration(0);
        objA.body.setAllowGravity(false);
      }
    });

    this.physics.add.collider(burgerGroup, burgerGround);

    let success = this.add.image(gameWidth / 2, (gameHeight - containerHeight) - 30, 'success').setDisplaySize(114, 62.4).setOrigin(0.5, 1).setDepth(10).setAlpha(0);
    let answer: number[] = [];
    let burgerCount: number = 0;
    let successTween: any;

    btnList.forEach(burgerBtn => {
      burgerBtn.btn.setInteractive();
      burgerBtn.btn.on('pointerdown', () => {
        burgerCount++;
        console.log(`${burgerBtn.arg} ボタンが押されました`);
        const addObj = this.addBurger(burgerBtn.arg, burgerBtn.collideSize, burgerCount);
        // addObj.setInteractive();
        burgerGroup.add(addObj);
        burgerContainer.add(addObj);

        //完成ガイド生成
        if (nowBurgerCreate === false && burgerCount > 4) {
          successTween = this.tweens.add({
            targets: success,
            alpha: { from: 1, to: 0 },
            x: success.x - 50,
            duration: 1500,
            delay: 300,
            ease: 'Cubic.easeIn',
            repeat: -1,
          });
          nowBurgerCreate = true;
        }

        //正誤判定用の配列を生成
        const targetNum: number | undefined = this.fillingsList.find(item => item.en === burgerBtn.arg)?.num;
        if (targetNum !== undefined) {
          answer.unshift(targetNum);
        }
      });
    });

    //////////////////////////////// バーガー注文処理 ///////////////////////////////
    const quizList = [
      { "name": "ハンバーガー", "question": [1, 4, 6], "price": 400 },
      { "name": "チーズバーガー", "question": [2, 4, 6], "price": 500 },
      { "name": "フレッシュバーガー", "question": [3, 4, 5, 6], "price": 600 },
      { "name": "ダブルバーガー", "question": [1, 3, 4, 6, 6], "price": 700 },
      { "name": "デラックスバーガー", "question": [2, 2, 3, 5, 6, 6], "price": 1000 },
    ];

    let quiz: { name: string, question: number[], price: number };

    //注文の作成
    let orderContainer = this.add.container(12, 100);
    const orderGenerator = () => {
      //バーガーをランダムピック
      const num: number = Math.floor(Math.random() * quizList.length);
      //当該バーガーのオブジェクト生成
      quiz = {
        "name": quizList[num].name,
        "question": [7], //上バンズは先頭固定
        "price": quizList[num].price,
      };
      console.log(quiz);
      //具材をランダムに入れ替える
      const currentQuiz: number[] = quizList[num].question.slice();
      console.log(currentQuiz);
      for (let i = currentQuiz.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentQuiz[i], currentQuiz[j]] = [currentQuiz[j], currentQuiz[i]];
      }
      while (currentQuiz.length > 0) {
        const item: number | undefined = currentQuiz.pop();
        if (item !== undefined) {
          quiz.question.push(item);
        }
      }
      //下バンズも最後尾固定
      quiz.question.push(8);

      //注文の作成
      const orderBg = this.add.graphics();
      orderBg.fillStyle(0xFFFF8C, 1);
      orderBg.fillRoundedRect(0, 0, 220, (quiz.question.length + 2) * 28, 5);
      orderContainer.add(orderBg);
      const orderBurger = this.add.text(110, 8, `《${quiz.name}》`, { fontSize: 18, fontStyle: "bold", color: "black", padding: { top: 5, bottom: 5 } }).setOrigin(0.5, 0);
      orderContainer.add(orderBurger);

      for (let i = 0; i < quiz.question.length; i++) {
        const originalWidth = this.textures.get(this.fillingsList[quiz.question[i] - 1].en).getSourceImage().width;
        const originalHeight = this.textures.get(this.fillingsList[quiz.question[i] - 1].en).getSourceImage().height;

        const newWidth = 28;
        const aspectRatio = originalHeight / originalWidth;
        const newHeight = newWidth * aspectRatio;

        const orderImg = this.add.image(16, (i * 28) + 40, this.fillingsList[quiz.question[i] - 1].en).setOrigin(0, 0).setDisplaySize(newWidth, newHeight);
        const orderTxt = this.add.text(48, (i * 28) + 36, this.fillingsList[quiz.question[i] - 1].ja, { fontSize: 16, fontStyle: "bold", color: "black", padding: { top: 5, bottom: 5 } }).setOrigin(0, 0).setColor("black");
        const border = this.add.rectangle(16, (i * 28) + 58, 188, 2, 0xEFEC78).setOrigin(0, 0);
        orderContainer.add([orderImg, orderTxt, border]);
      }

      console.log(orderContainer);
    }

    //作成したバーガーの正誤判定
    function checkAnswer(arrA: number[], arrB: number[]) {
      if (JSON.stringify(arrA) === JSON.stringify(arrB)) {
        return "perfect";
      } else if (arrA.every(element => {
        return arrB.filter(e => e === element).length >= arrA.filter(e => e === element).length;
      })
      ) {
        return "good";
      } else {
        return "bad";
      }
    }


    ///////////////////////////////// バーガー提供の処理 ///////////////////////////////
    burgerContainer.setSize(gameWidth, gameHeight / 3);
    burgerContainer.setInteractive();

    let startX: number;
    let isDrugging = false;
    let judgeTxt: any;

    burgerContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (burgerCount > 4) {
        startX = pointer.x;
        isDrugging = true;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {

      if (isDrugging && burgerCount > 4) {
        burgerContainer.x += pointer.x - startX;
        startX = pointer.x;
      }
    });

    this.input.on('pointerup', () => {
      if (isDrugging && burgerCount > 4) {
        isDrugging = false;

        if (burgerContainer.x < (gameWidth / 2) - 50) {
          this.tweens.add({
            targets: burgerContainer,
            x: -200,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
              //正誤判定
              const quesionArr = quiz.question;
              const answerArr = answer;
              console.log(`問題:${quesionArr}`);
              console.log(`回答:${answerArr}`);
              console.log(checkAnswer(quesionArr, answerArr));
              judgeTxt = this.add.image(gameWidth / 2, gameHeight / 2, checkAnswer(quesionArr, answerArr)).setOrigin(0.5, 0.5);
              this.score += this.scoreCalc(quiz.price, checkAnswer(quesionArr, answerArr), answer);
              scoreTxt.setText(`SCORE: ${this.score}`);
              const txtColor = this.scoreCalc(quiz.price, checkAnswer(quesionArr, answerArr), answer) > 0 ? "white" : "red";
              const scoreSign = this.scoreCalc(quiz.price, checkAnswer(quesionArr, answerArr), answer) > 0 ? "+" : "";
              const scoreAddTxt = this.add.text(scoreTxt.displayWidth + 30, 50, `${scoreSign}${this.scoreCalc(quiz.price, checkAnswer(quesionArr, answerArr), answer)}`, { fontFamily: "sans serif", fontSize: 18, fontStyle: "bold", color: txtColor }).setOrigin(0, 0);
              this.tweens.add({
                targets: scoreAddTxt,
                alpha: 0,
                duration: 800,
                onComplete: () => {
                  scoreAddTxt.destroy();
                }
              });

              //クリーンナップ処理
              successTween.stop();
              success.x = gameWidth / 2;
              success.setAlpha(0);
              burgerGroup.clear(true, true);
              burgerContainer.removeAll(true);
              quiz = { "name": "", "question": [], "price": 0 };
              btnContainer.each((child: Phaser.GameObjects.GameObject) => {
                if (child instanceof Phaser.GameObjects.Image) {
                  child.disableInteractive();
                }
              });

              // 正誤タイムボーナス追加
              if (checkAnswer(quesionArr, answerArr) === 'perfect') {
                this.currentTime += 2;
                const plusTxt = this.add.text(236, 31, '+2s', { fontFamily: "sans serif", fontStyle: "bold", color: "white" }).setOrigin(1, 0.5);
                this.tweens.add({
                  targets: plusTxt,
                  alpha: 0,
                  duration: 800,
                  onComplete: () => {
                    plusTxt.destroy();
                  }
                });
              } else if (checkAnswer(quesionArr, answerArr) === 'bad') {
                this.currentTime -= 1;
                const minusTxt = this.add.text(236, 31, '-1s', { fontFamily: "sans serif", fontStyle: "bold", color: "red" }).setOrigin(1, 0.5);
                this.tweens.add({
                  targets: minusTxt,
                  alpha: 0,
                  duration: 800,
                  onComplete: () => {
                    minusTxt.destroy();
                  }
                });
              }

              // クリーンナップ処理＋次waveへの進行
              setTimeout(() => {
                orderContainer.removeAll(true);
                orderGenerator();
                burgerContainer.x = gameWidth / 2;
                judgeTxt.destroy();
                judgeTxt = null;
                burgerCount = 0;
                nowBurgerCreate = false;
                answer = [];
                btnContainer.each((child: Phaser.GameObjects.GameObject) => {
                  if (child instanceof Phaser.GameObjects.Image) {
                    child.setInteractive();
                  }
                });
              }, 600);
            }
          });
        } else {
          this.tweens.add({
            targets: burgerContainer,
            x: gameWidth / 2,
            duration: 500,
            ease: 'Power2',
          });
        }
      }
    });




    //////////////////////// デバッグ用 /////////////////////////
    // this.physics.world.createDebugGraphic();
    // this.physics.world.defaults.debugShowBody = true; // 当たり判定の可視化
    // this.physics.world.defaults.debugShowVelocity = true; // 速度を可視化


    // デバッグ可視化を有効化（必要に応じて設定をカスタマイズ）
    // this.physics.world.drawDebug = true;

  }

  update() {
  }

  //タイムゲージ関連の処理
  updateTimeBar() {
    let ratio = this.currentTime / this.maxTime;

    //タイムゲージの減算
    this.timeBar.width = 236 * ratio;

    //ゲージの色変化　残り50％で黄色、残り20％で赤色
    if (ratio <= 0.5 && ratio > 0.2) {
      this.timeBar.fillColor = 0xeecc00;
    } else if (ratio <= 0.2) {
      this.timeBar.fillColor = 0xee0000;
    }

    //タイムオーバーの処理
    if (this.currentTime <= 0) {
      this.time.removeAllEvents();
      this.resultCalc(this.answerList);

      const finishOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0).setOrigin(0, 0).setInteractive(false).setDepth(50);
      const finishImage = this.add.image(this.cameras.main.width / 2, -100, 'finish').setOrigin(0.5, 0.5).setDepth(50);

      this.tweens.add({
        targets: finishImage,
        y: this.cameras.main.height / 2,
        duration: 600,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.time.delayedCall(3000, () => {
            this.scene.pause();
            this.scene.launch('ResultScene', { score: this.score });
          });
        }
      });
    }
  }

  //バーガーの具を追加する処理
  addBurger(this: MainScene, name: string, collideSize: number, count: number) {
    const object = this.physics.add.image(0, 0 - (count * 30), name).setScale(0.65, 0.65).setMass(0.1);
    object.body.setSize(object.width, collideSize).setOffset(0, object.height - collideSize);
    if (name == 'cheese') {
      object.body.setOffset(0, object.height - 45);
    }
    if (name == 'lettuce') {
      object.body.setOffset(0, object.height - 35);
    }
    return object;
  }

  scoreCalc(price: number, judge: string, answer: number[]) {
    let burgerPrice: number = 0;
    let totalFillingPrice: number = 0;

    if (judge === 'perfect') {
      burgerPrice = price * 1.2;
    } else if (judge === 'bad') {
      burgerPrice = price * 0.5;
    } else {
      burgerPrice = price;
    }

    answer.forEach(num => {
      const fillingPrice = this.fillingsList.find(e => e.num === num)?.price
      if (fillingPrice) {
        totalFillingPrice += fillingPrice;
      }
    });

    return burgerPrice - totalFillingPrice;
  }

  //リザルト用配列生成
  resultCalc(array: number[][]) {
    const count: Record<number, number> = {};
    array.forEach((arr: number[]) => {
      arr.forEach((n: number) => {
        count[n] = count[n] ? count[n] + 1 : 1;
      });
    });

    for (let i = 1; i <= 8; i++) {
      if (count[i]) {
        const filling = this.fillingsList.find(e => e.num === i);
        if (filling) {
          this.resultArray.push({
            "num": i,
            "ja": filling.ja,
            "en": filling.en,
            "count": count[i],
            "price": count[i] * filling.price,
          });
        }
      }
    }
  };
}

export default MainScene;