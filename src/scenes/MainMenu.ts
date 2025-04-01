import { Scene, GameObjects } from 'phaser';
import makeButton from '../utils/makeButton';
import { GameProgress } from '../types';

export class MainMenu extends Scene {
    background: Phaser.GameObjects.TileSprite;
    backgroundAnimation: Phaser.GameObjects.Sprite;
    gameTitle: GameObjects.Text;
    title: GameObjects.Text;
    restart: GameObjects.Text;
    continue: GameObjects.Text;
    characters: GameObjects.Text;
    authors: GameObjects.Text;

    defaultGameProgress: GameProgress = {
        coordinates: { x: 500, y: 100 },
        scrollPosition: 384,
        skills: { doubleJump: false, climb: false },
        character: 'addison',
        inventory: { finalKey: false },
        keys: {
            winKey: false,
            door2Key: false,
            trapdoor1Key: false,
        },
    };

    constructor() {
        super('MainMenu');
    }

    create() {
        // Loads the dungeon background

        this.background = this.add.tileSprite(512, 384, 512, 384, 'titleBackground');
        this.background.scale = 2;
        this.backgroundAnimation = this.add.sprite(0, 0, 'titleBackground').setVisible(false).play('titleBackground');

        // Loads the title with the medieval font
        this.gameTitle = this.add.text(512, 160, 'Tall Boulder\nDungeon', {
            fontFamily: 'MedievalSharp', fontSize: 70, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center',
        }).setOrigin(0.5);

        makeButton(this, 'Start', 35, 512, 400, () => {
            this.startGame();
        });

        makeButton(this, 'Resume', 35, 512, 450, () => {
            const gameProgress = localStorage.getItem('gameProgress');
            console.log(gameProgress);
            if (gameProgress != null) {
                this.startGame(JSON.parse(gameProgress));
            }
            else {
                this.startGame();
            }
        });

        // Loads the names of the authors at botton of the screen
        this.authors = this.add.text(512, 700, '\nAllie Staiger       Addison Theis       Clare Kanazawa        Finley McMurtrie       Lucy Martenstein', {
            fontFamily: 'MedievalSharp', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
        }).setOrigin(0.5);
    }

    startGame(progress: GameProgress | null = null) {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            if (progress === null) {
                this.scene.start('CharacterSelection', this.defaultGameProgress);
            }
            else {
                this.scene.start('Game', progress);
            }
        });
    }

    update() {
        this.background.setFrame(this.backgroundAnimation.frame.name);
    }
}
