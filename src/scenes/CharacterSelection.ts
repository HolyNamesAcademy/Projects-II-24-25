import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';

export class CharacterSelection extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    characterName: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Image;
    leftButton: Phaser.GameObjects.Text;
    rightButton: Phaser.GameObjects.Text;

    characters: Phaser.GameObjects.Image[];
    characterNames: string[];
    currentCharacter: number = 0;

    constructor() {
        super('CharacterSelection');
    }

    create() {
        this.camera = this.cameras.main;

        // Loads the dungeon background
        this.background = this.add.image(512, 384, 'titleBackground');
        this.background.scale = 2;

        this.msg_text = this.add.text(512, 160, 'Choose Your\nCharacter', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
        });
        this.msg_text.setOrigin(0.5);

        // BackButton code
        makeButton(this, 'Return', 35, 100, 700, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MainMenu');
            });
        });

        this.characterName = this.add.text(512, 600, 'Addison', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
        });
        this.characterName.setOrigin(0.5);

        // ScrollCharacters code left
        makeButton(this, '<', 35, 400, 400, () => {
            if (this.currentCharacter == 0) {
                this.displayCharacter(4);
            }
            else
                this.displayCharacter(this.currentCharacter - 1);
        });
        // ScrollCharacters code right
        makeButton(this, '>', 35, 625, 400, () => {
            if (this.currentCharacter == this.characters.length - 1) {
                this.displayCharacter(0);
            }
            else
                this.displayCharacter(1 + this.currentCharacter);
        });

        this.characters = [
            this.makeCharacter('addison'),
            this.makeCharacter('allie'),
            this.makeCharacter('clare'),
            this.makeCharacter('finley'),
            this.makeCharacter('lucy'),
        ];
        this.characterNames = [
            'Addison',
            'Allie',
            'Clare',
            'Finley',
            'Lucy',
        ];
        this.displayCharacter(0);
    }

    makeCharacter(name: string) {
        const character = this.add.sprite(435, 400, name);
        character.setScale(10);
        character.setSize(16, 32);
        character.setOrigin(0.5);
        character.setVisible(false);
        return character;
    }

    displayCharacter(index: number) {
        this.characters[this.currentCharacter].setVisible(false);
        this.characters[index].setVisible(true);

        this.characterName.setText(this.characterNames[index]);

        this.currentCharacter = index;
    }
}
