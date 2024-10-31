import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    gameTitle: GameObjects.Text;
    title: GameObjects.Text;
    restart: GameObjects.Text;
    continue: GameObjects.Text;
    authors: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 300, 'background');
        this.background.scale = 3;

        //this.logo = this.add.image(512, 300, 'logo');

        this.gameTitle = this.add.text(512, 160, 'Tall Boulder Dungeon',{
            fontFamily:'MedievalSharp', fontSize: 70, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5);
/*
        this.title = this.add.text(512, 400, 'Main Menu', {
            fontFamily: 'MedievalSharp', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
*/
        this.restart = this.add.text(512, 400, 'Restart', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff', 
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.restart.setInteractive();

        this.continue = this.add.text(512, 450, 'Continue Previous', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff', 
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.continue.setInteractive();

        this.authors = this.add.text(512, 700, '\nAllie Staiger       Addison Theis       Clare Kanazawa        Finley McMurtrie       Lucy Martenstein', {
            fontFamily: 'MedievalSharp', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //enlarges the "start" button when the user hovers over it
        this.restart.on('pointerover', () =>{
            this.restart.setScale(1.5);
        });
        this.restart.on('pointerout', () => {
            this.restart.setScale(1);
        });
        
        //enlarges the "continue previous" button when the user hovers over it
        this.continue.on('pointerover', () =>{
            this.continue.setScale(1.5);
        });
        this.continue.on('pointerout', () =>{
            this.continue.setScale(1);
        });
    }
}
