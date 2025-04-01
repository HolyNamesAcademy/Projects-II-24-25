import { SharedGameCode } from './SharedGameCode';
import makeButton from '../utils/makeButton';
import { Layout } from '../types';
import { StageThree } from './StageThree';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 300 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 1150, y: 0 },
        { type: 'door', x: 200, y: 0, key: 'winKey' },
        { type: 'vine', x: 700, y: 0 },
        { type: 'vine', x: 700, y: 0, verticalOffset: 24 },

        { type: 'platform', x: 350, y: 400 },
        { type: 'platform', x: 900, y: 0 },
        { type: 'spikes', x: 930, y: 0 }, // used to be x:920
        { type: 'vine', x: 200, y: 0 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 },

        { type: 'platform', x: 550, y: 400 },
        { type: 'platform', x: 200, y: 0 },
        { type: 'platform', x: 700, y: 0 },
        { type: 'door', x: 150, y: 0, key: 'winKey' },
        { type: 'keyPedestal', x: 600, y: 0 },
    ],
};

export class Game extends SharedGameCode {
    puzzle1: boolean = false;
    winState: boolean = false;
    possessesKey: boolean = false;

    scrollSpeed: number = 4;
    doubleJump: boolean = false;

    constructor() {
        super('Game');
        this.layout = layout;
    }

    create() {
        super.create();

        makeButton(this, 'Win Addison', 35, 150, 650, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('WinScene');
            });
        });

        makeButton(this, 'Kill Addison', 35, 150, 700, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('DeathScreen');
            });
        });

        this.pedestals.forEach((pedestal) => {
            pedestal.on('pointerdown', () => {
                if (this.scene.get('puzzle1') == null) {
                    this.createWindow(512, 300, 600, 400, 'puzzle1');
                    this.scene.get('puzzle1').events.once('passBoolean', (value: boolean) => {
                        this.winState = value;
                        this.gameProgress.keys.winKey = true;
                        console.log(this.winState);
                        if (this.winState) {
                            this.generateBasicKey();
                        }
                    });
                }
                else {
                    this.scene.remove('puzzle1');
                }
            });
        });

        this.physics.add.overlap(this.player, this.basicKey, () => {
            // this.basicKey.setVisible(false);
            // console.log('hiding key');
            this.basicKey.play('key-left');
            this.gameProgress.inventory.finalKey = true;
            this.possessesKey = true;
        });
    }

    createWindow(x: number, y: number, width: number, height: number, id: string) {
        console.log('creating window');
        const uniqueIdentifier = id;

        const zone = this.add.zone(x, y, width, height).setInteractive();
        const scene = new StageThree(uniqueIdentifier, zone, width, height);
        this.scene.add(uniqueIdentifier, scene, true);
    }

    generateBasicKey() {
        this.basicKey = this.physics.add.staticSprite(512, 100, 'basicKey', 0).setScale(5).refreshBody();
        this.basicKey.x = this.player.x + 100;
        this.basicKey.y = this.player.y + 25;
        this.nonCollisionItems.add(this.basicKey);
    }

    update() {
        super.update();

        const onVine = this.getOnVine();

        if (onVine) {
            // They can press left or right to move, but still show the climbing animation.
            if (this.cursors?.left.isDown) {
                this.updateKeyPosition(this.basicKey, 0, 150);
            }
            else if (this.cursors?.right.isDown) {
                this.updateKeyPosition(this.basicKey, 0, 150);
            }
            else {
                this.updateKeyPosition(this.basicKey, 0, 150);
            }
        }
    }

    moveLeft() {
        super.moveLeft();

        if (this.winState) {
            if (this.basicKey.anims.currentAnim?.key != 'key-left') {
                this.basicKey.play('key-left');
            }
            this.updateKeyPosition(this.basicKey, 125, 25);
        }
    }

    moveRight() {
        super.moveRight();

        if (this.winState) {
            if (this.basicKey.anims.currentAnim?.key != 'key-right') {
                this.basicKey.play('key-right');
            }
            this.updateKeyPosition(this.basicKey, -125, 25);
        }
    }

    updateKeyPosition(
        key: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
        x: number,
        y: number) {
        if (!key) {
            return;
        };
        key.x = this.player.x + x;
        key.y = this.player.y + y;
    }
}
