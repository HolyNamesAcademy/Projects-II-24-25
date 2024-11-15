import { Scene } from 'phaser';

export class CharacterSelection extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;

    constructor ()
    {
        super('CharacterSelection');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.msg_text = this.add.text(512, 384, 'CharacterSelection', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);

        //BackButton code
        this.backButton = this.add.text(100, 700, 'Return', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.backButton.setInteractive();
        this.backButton.on('pointerover', () =>{
            this.backButton.setScale(1.15);
            this.backButton.setColor('#edd35f');
        });
        this.backButton.on('pointerout', () => {
            this.backButton.setScale(1);
            this.backButton.setColor('#ffffff');
        });
        this.backButton.on('pointerdown', () =>{
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MainMenu');
            });
        }); //End of BackButton code
    }
}
