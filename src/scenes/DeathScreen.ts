import { Scene } from 'phaser';

export class DeathScreen extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    MenuButton : Phaser.GameObjects.Text;

    constructor ()
    {
        super('DeathScreen');
    }

    create ()
    {
        window.localStorage.setItem('stage', '1');
        window.localStorage.setItem('deathCount', '1');
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.msg_text = this.add.text(512, 384, 'You Died!', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });

        this.MenuButton = this.add.text(150, 700, 'Main Menu', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.MenuButton.setInteractive();
        this.MenuButton.on('pointerover', () =>{
            this.MenuButton.setScale(1.15);
            this.MenuButton.setColor('#edd35f');
        });
        this.MenuButton.on('pointerout', () => {
            this.MenuButton.setScale(1);
            this.MenuButton.setColor('#ffffff');
        });
        this.MenuButton.on('pointerdown', () =>{
            window.localStorage.removeItem('stage');
            //window.localStorage.setItem('deathCount');
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MainMenu');
            });
        });
    }
}
