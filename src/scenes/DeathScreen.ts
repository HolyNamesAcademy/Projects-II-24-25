import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';
import { GameProgress } from '../types';

// Map of character names to sprite names
const characterToSpriteSheet: Record<string, string> = {
    addison: 'addison',
    pinkAddison: 'addison',
    darkRedAddison: 'addison',
    cottonCandyAddison: 'addison',
    wigAddison: 'addison',
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

        // In case they get to this screen without a character
        // (e.g. if they die in the main menu) (this should not happen)
        if (data.character) {
            // Push the new death to the array
            this.deaths.push(data.character);
        }

        // Filter out any null or undefined values from the deaths array
        this.deaths = this.deaths.filter(death => death !== null && death !== undefined);

        // Store the updated deaths in localStorage
        localStorage.setItem('deaths', JSON.stringify(this.deaths));

        // Reset the game progress, so they have to restart from main menu
        localStorage.removeItem('gameProgress');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x1a1a1a);

        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'deathBackground').scale = 2;

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
        const startX = 100;

        const spacingY = 96;
        const spacingX = 204;

        const maxTall = 8;
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
            if (death.toLowerCase().includes('addison')) {
                console.log('Addison sprite detected', death);
                y = y - 72; // Adjust for Addison's sprite being on the bottom;
            }
            const sprite = this.add.sprite(
                startX + countX * spacingX,
                y,
                spriteName,
            );
            sprite.anims.play(`${death}-death`);
            sprite.setScale(6); // Adjust scale as needed

            countY++;
        });
    }
}
