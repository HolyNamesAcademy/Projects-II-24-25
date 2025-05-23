import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';
import { GameProgress } from '../types';

export class CharacterSelection extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    backgroundAnimation: Phaser.GameObjects.Sprite;
    msg_text: Phaser.GameObjects.Text;
    characterName: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Image;
    leftButton: Phaser.GameObjects.Text;
    rightButton: Phaser.GameObjects.Text;

    characters: Phaser.GameObjects.Image[][];
    characterNames: string[];
    characterKeys: string[][];
    currentCharacter: number = 0;
    gameProgress: GameProgress;
    currentStyle: number = 0;

    upButton: Phaser.GameObjects.Text;
    downButton: Phaser.GameObjects.Text;

    constructor() {
        super('CharacterSelection');
    }

    init(data: GameProgress) {
        this.gameProgress = data;
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x1a1a1a);

        // Loads the dungeon background
        this.background = this.add.image(512, 384, 'titleBackground');
        this.background.scale = 2;
        this.backgroundAnimation = this.add.sprite(0, 0, 'titleBackground').setVisible(false).play('titleBackground');

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
                this.displayCharacter(4, 0);
            }
            else
                this.displayCharacter(this.currentCharacter - 1, 0);
        });
        // ScrollCharacters code right
        makeButton(this, '>', 35, 625, 400, () => {
            if (this.currentCharacter == this.characters.length - 1) {
                this.displayCharacter(0, 0);
            }
            else
                this.displayCharacter(1 + this.currentCharacter, 0);
        });
        // ScrollCharacters code up
        this.upButton = makeButton(this, '^', 35, 513, 230, () => {
            if (this.currentStyle == this.characters[this.currentCharacter].length - 1) {
                this.displayCharacter(this.currentCharacter, 0);
            }
            else
                this.displayCharacter(this.currentCharacter, this.currentStyle + 1);
        });
        this.downButton = makeButton(this, 'v', 35, 513, 650, () => {
            if (this.currentStyle == 0) {
                this.displayCharacter(this.currentCharacter, this.characters[this.currentCharacter].length - 1);
            }
            else
                this.displayCharacter(this.currentCharacter, this.currentStyle - 1);
        });
        makeButton(this, 'Start', 35, 924, 700, () => {
            this.gameProgress.character = this.characterKeys[this.currentCharacter][this.currentStyle];
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MainLevel', this.gameProgress);
            });
        });

        this.characters = [
            [this.makeCharacter('addison'), this.makeCharacter('addison', 13), this.makeCharacter('addison', 26), this.makeCharacter('addison', 39), this.makeCharacter('addison', 52)],
            [this.makeCharacter('allie')],
            [this.makeCharacter('clare')],
            [this.makeCharacter('finley'), this.makeCharacter('finley', 15), this.makeCharacter('finley', 30), this.makeCharacter('finley', 45), this.makeCharacter('finley', 60)],
            [this.makeCharacter('lucy')],
        ];
        this.characterNames = [
            'Addison',
            'Allie',
            'Clare',
            'Finley',
            'Lucy',
        ];
        this.characterKeys = [
            ['addison', 'pinkAddison', 'darkRedAddison', 'cottonCandyAddison', 'wigAddison'],
            ['allie'],
            ['clare'],
            ['finley', 'blockFinley', 'beanieFinley', 'capFinley', 'baldFinley'],
            ['lucy'],
        ];
        this.displayCharacter(0);
    }

    makeCharacter(name: string, frame: number = 0) {
        const character = this.add.sprite(435, 400, name, frame);
        character.setScale(10);
        character.setSize(16, 32);
        character.setOrigin(0.5);
        character.setVisible(false);
        return character;
    }

    displayCharacter(index: number, style = 0) {
        console.log('hiding', this.currentCharacter, style);
        console.log('showing', index, style);
        this.characters[this.currentCharacter][this.currentStyle].setVisible(false);
        this.characters[index][style].setVisible(true);

        this.characterName.setText(this.characterNames[index]);

        this.currentCharacter = index;
        this.currentStyle = style;

        if (this.characters[index].length > 1) {
            this.upButton.setVisible(true);
            this.downButton.setVisible(true);
        }
        else {
            this.upButton.setVisible(false);
            this.downButton.setVisible(false);
        }
    }

    update() {
        this.background.setFrame(this.backgroundAnimation.frame.name);
    }
}
