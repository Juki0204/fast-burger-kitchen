import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import TitleScene from "./scenes/TitleScene";
import PauseScene from "./scenes/PauseScene";
import ResultScene from "./scenes/ResultScene";

let game;
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, //レンダリング形式（WEBGL, CANVAS, AUTO）
  width: Math.min(window.innerWidth, 480), //レンダリングサイズ
  height: Math.min(window.innerHeight, 844), //レンダリングサイズ
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: 'app', //任意の要素にレンダリングする場合の要素指定
  physics: { //物理演算
    default: 'arcade', //使用する物理エンジンの指定
    arcade: { //詳細設定
      gravity: { x: 0, y: 1000 },
      debug: false
    },
  },
  render: {
    pixelArt: false,
    antialias: false,
    antialiasGL: false,
  },
  input: {
    keyboard: true,
  },
  scene: [ //シーンの設定、1つの場合は[]でなくてよい
    TitleScene,
    MainScene,
    PauseScene,
    ResultScene,
  ]
}

game = new Phaser.Game(config);