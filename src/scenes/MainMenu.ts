import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    gameTitle: GameObjects.Text;
    title: GameObjects.Text;
    restart: GameObjects.Text;
    continue: GameObjects.Text;
    characters: GameObjects.Text;
    authors: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //Loads the dungeon background
        this.background = this.add.image(512, 300, 'titleBackground');
        this.background.scale = 3;

        //Loads the title with the medieval font
        this.gameTitle = this.add.text(512, 160, 'Tall Boulder Dungeon',{
            fontFamily:'MedievalSharp', fontSize: 70, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5);

        //Loads the start button
        this.restart = this.add.text(512, 400, 'Start', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff', 
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.restart.setInteractive();

        //Loads the resume button
        this.continue = this.add.text(512, 450, 'Resume', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff', 
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.continue.setInteractive();

        //Loads the choose character button
        this.characters = this.add.text(512,500, 'Select Character', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff', 
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.characters.setInteractive();

        //Loads the names of the authors at botton of the screen
        this.authors = this.add.text(512, 700, '\nAllie Staiger       Addison Theis       Clare Kanazawa        Finley McMurtrie       Lucy Martenstein', {
            fontFamily: 'MedievalSharp', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //enlarges the "start" button when the user hovers over it
        this.restart.on('pointerover', () =>{
            this.restart.setScale(1.15);
            this.restart.setColor('#edd35f');
        });
        //Reverts the color and size of start button back to normal if pointer moves away
        this.restart.on('pointerout', () => {
            this.restart.setScale(1);
            this.restart.setColor('#ffffff');
        });
        //Fades the screen to black and advances to the next scene if start button is clicked
        this.restart.on('pointerdown', () =>{
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                window.localStorage.removeItem('stage');
                this.scene.start('StageOne');
            });
        });
        
        //enlarges the "resume" button when the user hovers over it
        this.continue.on('pointerover', () =>{
            this.continue.setScale(1.15);
            this.continue.setColor('#edd35f');
        });
        //Reverts the color and size of the resume button back to normal if pointer moves away
        this.continue.on('pointerout', () =>{
            this.continue.setScale(1);
            this.continue.setColor('#ffffff');
        });
        //Fades the screen to black and advances where the user left off if resume button is clicked
        this.continue.on('pointerdown', () =>{
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                const stage = window.localStorage.getItem('stage');
                if(stage === '1')
                {
                    this.scene.start('StageOne');
                }
                else if(stage === '2')
                {
                    this.scene.start('StageTwo');
                }
                else if(stage === '3')
                {
                    this.scene.start('StageThree');
                }
            });
        });

        //enlarges the "character" button when the user hovers over it
        this.characters.on('pointerover', () =>{
            this.characters.setScale(1.15);
            this.characters.setColor('#edd35f');
        });
        //Reverts the color and size of the character button back to normal if pointer moves away
        this.characters.on('pointerout', () =>{
            this.characters.setScale(1);
            this.characters.setColor('#ffffff');
        });
        //Fades the screen to black and advances to character selection page if character button is clicked
        this.characters.on('pointerdown', () =>{
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CharacterSelection');
            })
        });
    }
}
