import { PlayerData } from "../../App";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { fxs } from "../consts";
import { W } from "../main";

const DEFAULT_HP = 100;

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameText: Phaser.GameObjects.Text;

  player1: Phaser.Physics.Arcade.Sprite;
  player2: Phaser.Physics.Arcade.Sprite;

  hpText = {
    p1: Phaser.GameObjects.Text.prototype,
    p2: Phaser.GameObjects.Text.prototype
  }

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd: Phaser.Types.Input.Keyboard.CursorKeys;
  ready: boolean = false;

  constructor() {
    super("Game");
  }

  create() {
    EventBus.emit("current-scene-ready", this);
  }

  setup() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    const group = this.physics.add.staticGroup();
    // ground
    group.create(400, 588, "ground");

    // player1 body
    const p1Data = this.data.get('p1') as PlayerData
    this.player1 = this.physics.add.sprite(100, 500, `avatar_pj${p1Data.avatar + 1}`);
    this.player1.setData('key', 'p1')
    this.player1.setDisplaySize(100, 100);
    this.player1.setBounce(0.2);
    this.player1.setCollideWorldBounds(true);
    this.physics.add.collider(this.player1, group);

    // player2 body
    const p2Data = this.data.get('p2') as PlayerData
    this.player2 = this.physics.add.sprite(400, 500, `avatar_pj${p2Data.avatar + 1}`);
    this.player2.setData('key', 'p2')
    this.player2.setDisplaySize(100, 100);
    this.player2.setBounce(0.2);
    this.player2.setCollideWorldBounds(true);
    this.physics.add.collider(this.player2, group);

    // setTimeout(() => {
    //   this.sound.play(`frase_pj${fxs.indexOf(p2Data.fx) + 1}`)
    // }, 5000)

    // controller
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = this.input.keyboard!.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'right': Phaser.Input.Keyboard.KeyCodes.D 
    }) as typeof this.wasd;

    this.ready = true;

    this.hpText = {
      p1: this.add.text(10, 10, this.getHP(this.player1), {
        font: "32px",
        color: '#ffffff'
      }),
      p2: this.add.text(W - 70, 10, this.getHP(this.player2), {
        font: "32px",
        color: '#ffffff'
      })
    }
  }

  getHP(player: Phaser.Physics.Arcade.Sprite) {
    return player.getData('hp') || DEFAULT_HP
  }

  update() {
    if (!this.ready) {
      return;
    }
    
    const p1 = this.player1;
    const p2 = this.player2;

    const p1Data = this.data.get('p1') as PlayerData
    const p2Data = this.data.get('p2') as PlayerData
    
    p2.setVelocityX(0)
    if (this.cursors.right.isDown){
      p2.setVelocityX(150)
    } else if (this.cursors.left.isDown){
      p2.setVelocityX(-150)
    }

    // if (p2.body?.touching.down && !p2.getData('played_voice')) {
    //   p2.setData('played_voice', true)
    //   this.sound.play(`frase_pj${fxs.indexOf(p2Data.fx) + 1}`)
    // }

    // if (p1.body?.touching.down && !p1.getData('played_voice')) {
    //   p1.setData('played_voice', true)
    //   this.sound.play(`frase_pj${fxs.indexOf(p1Data.fx) + 1}`)
    // }
    
    if (this.cursors.up.isDown && p2.body?.touching.down){
      p2.setVelocityY(-300)
    }
    
    p1.setVelocityX(0)
    if (this.wasd.right.isDown){
      p1.setVelocityX(150)
    } else if (this.wasd.left.isDown){
      p1.setVelocityX(-150)
    }
    
    if (this.wasd.up.isDown && p1.body?.touching.down){
      p1.setVelocityY(-300)
    }

    this.physics.overlap(p1, p2, () => {
      const p1v = Math.abs(p1.body?.velocity.x || 0)
      const p2v = Math.abs(p2.body?.velocity.x || 0)

      if (p1v > p2v) {
        p1.setVelocityX(0)
        p2.setVelocityX(3000)
        this.damagePlayer(p2)
        this.playAttackSound(p1Data.fx)
      }
      if (p2v > p1v) {
        p1.setVelocityX(-3000)
        p2.setVelocityX(0)
        this.damagePlayer(p1)
        this.playAttackSound(p2Data.fx)
      }
    });
  }

  playAttackSound(fx: string) {
    this.sound.play(`sfx_ataque${fxs.indexOf(fx) + 1}`)
  }

  damagePlayer(player: Phaser.Physics.Arcade.Sprite) {
    const hpDiff = Math.round(Math.random() * 10)
    const hp = this.getHP(player) - hpDiff;
    player.setData('hp', hp);
    this.updateHPText(player);
    if (hp <= 0) {
      this.game.cache.text.add('winner', player.getData('key') === 'p1' ? 'Player 2' : 'Player 1');
      requestIdleCallback(() => {
        this.changeScene();
      })
    }

    player.setTint(0xff0000);
    setTimeout(() => {
      player.clearTint();
    }, 1000);
  }

  updateHPText(player: Phaser.Physics.Arcade.Sprite) {
    const key = player.getData('key') as 'p1' | 'p2'
    const text = this.hpText[key]
    text.setText(this.getHP(player))
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

