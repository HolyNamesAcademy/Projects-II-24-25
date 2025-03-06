import { Scene } from 'phaser';

export class StageThree extends Scene {
    parent: Phaser.GameObjects.Zone;
    width: number;
    height: number;

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    numbers: Phaser.Physics.Arcade.StaticGroup;

    constructor(key: string = 'StageThree', parent: Phaser.GameObjects.Zone, width: number, height: number) {
        super(key);
        this.parent = parent;
        this.width = width;
        this.height = height;
    }

    create() {
        window.localStorage.setItem('stage', '3');
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.camera.setViewport(this.parent.x - this.width / 2, this.parent.y - this.height / 2, this.width, this.height);

        this.numbers.create(100, 200, 'Numbers', 0);
    }
}
