import { Scene } from 'phaser';

export class CharacterSelection extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Image ;

    constructor ()
    {
        super('CharacterSelection');
    }

    create ()
    {
        this.camera = this.cameras.main;
        
        //Loads the dungeon background
        this.background = this.add.image(512, 384, 'titleBackground');
        this.background.scale = 2;

        this.msg_text = this.add.text(512, 160, 'Choose Your\nCharacter', {
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


        this.player = this.add.sprite(500, 400, 'addison');
        this.player.setScale(5);
        this.player.setSize(16, 32);

        this.msg_text = this.add.text(512, 600, 'Addison', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);
    }
}
