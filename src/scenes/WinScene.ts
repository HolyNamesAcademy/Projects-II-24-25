import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';

export class WinScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    MenuButton: Phaser.GameObjects.Text;

    constructor() {
        super('WinScene');
    }

    create() {
        window.localStorage.setItem('stage', '1');
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x1a1a1a);

        // this.background = this.add.image(512, 384, 'background');

        this.msg_text = this.add.text(512, 384, 'You Won!', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
        });
        this.msg_text.setOrigin(0.5);

        makeButton(this, 'Main Menu', 35, 150, 700, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MainMenu');
                localStorage.removeItem('gameProgress');
            });
        });
    }
}
