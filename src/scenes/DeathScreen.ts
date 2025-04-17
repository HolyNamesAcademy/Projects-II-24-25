import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';
import { GameProgress } from '../types';

// Map of character names to sprite names
const characterToSpriteSheet: Record<string, string> = {
    addison: 'addison',
    allie: 'allie',
    finley: 'finley',
    blockFinley: 'finley',
    beanieFinley: 'finley',
    capFinley: 'finley',
    baldFinley: 'finley',
    clare: 'clare',
    lucy: 'lucy',
};

export class DeathScreen extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    MenuButton: Phaser.GameObjects.Text;

    deaths: string[];

    constructor() {
        super('DeathScreen');
    }

    init(data: GameProgress) {
        // Read the current deaths from localStorage
        const existingDeaths = localStorage.getItem('deaths');
        this.deaths = existingDeaths ? JSON.parse(existingDeaths) : [];

        console.log('Deaths:', this.deaths);
        console.log('Character:', data.character);

        // Push the new death to the array
        this.deaths.push(data.character);

        // Store the updated deaths in localStorage
        localStorage.setItem('deaths', JSON.stringify(this.deaths));

        // Reset the game progress, so they have to restart from main menu
        localStorage.removeItem('gameProgress');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#5B7C99');

        this.msg_text = this.add.text(512, 384, 'You Died!', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
        });
        this.msg_text.setOrigin(0.5);

        makeButton(this, 'Main Menu', 35, 890, 700, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MainMenu');
            });
        });

        this.makeBodies();
    }

    makeBodies() {
        const startY = 750;
        const startX = 80;

        const spacingY = 64;
        const spacingX = 136;

        const maxTall = 12;
        let countX = -1;
        let countY = 0;

        this.deaths.forEach((death, index) => {
            if (index % maxTall === 0) {
                countX++;
                countY = 0;
            }
            // Retrieve sprite information for the character
            const spriteName = characterToSpriteSheet[death];
            if (!spriteName) {
                console.error(`No sprite found for character: ${death}`);
                return;
            }
            let y = startY - countY * spacingY;
            if (death === 'addison') {
                y = y - 48; // Adjust for Addison's sprite being on the bottom;
            }
            const sprite = this.add.sprite(
                startX + countX * spacingX,
                y,
                spriteName,
            );
            sprite.anims.play(`${death}-death`);
            sprite.setScale(4); // Adjust scale as needed

            countY++;
        });
    }
}
