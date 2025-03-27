import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.spritesheet('titleBackground', 'assets/Wall Start Screen.png', { frameWidth: 512, frameHeight: 384 });
    }

    create() {
        this.anims.create({
            key: 'titleBackground',
            frames: this.anims.generateFrameNumbers('titleBackground', { frames: [0, 1, 2, 3] }),
            frameRate: 1,
            repeat: -1,
        });
        this.scene.start('Preloader');
    }
}
