import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(400, 84, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const winner = this.game.cache.text.get('winner');
        this.add.text(400, 175, `Winner: ${winner}`, {
            fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);

        this.add.text(400, 275, 'Back to menu', {
            fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 1,
            align: 'center',
            backgroundColor: '#000000',
            padding: { left: 12, right: 12, top: 8, bottom: 8 },
        })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                window.location.reload();
            }, this);

        this.add.text(400, 350, 'Play again', {
            fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 1,
            align: 'center',
            backgroundColor: '#000000',
            padding: { left: 12, right: 12, top: 8, bottom: 8 },
        })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Game');
            }, this);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
