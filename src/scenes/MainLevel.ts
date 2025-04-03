import { SharedGameCode } from './SharedGameCode';
import makeButton from '../utils/makeButton';
import { Layout } from '../types';
import { Puzzle } from './Puzzle';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 300 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 1150, y: 0 },
        { type: 'door', x: 200, y: 0, key: 'winKey', next: { scene: 'WinScene', coordinates: { x: 10, y: 30 }, scrollPosition: 10 } },
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
        { type: 'door', x: 150, y: 0, key: 'door2Key', next: { scene: 'StageTwo', coordinates: { x: 275, y: 316 }, scrollPosition: 260 } },
        { type: 'keyPedestal', x: 600, y: 0, key: 'door2Key' },
    ],
};

export class MainLevel extends SharedGameCode {
    basicKey: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;

    puzzle1: boolean = false;
    winState: boolean = false;
    possessesKey: boolean = false;

    scrollSpeed: number = 4;
    doubleJump: boolean = false;

    constructor() {
        super('MainLevel');
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
                this.killPlayer();
            });
        });

        this.pedestals.forEach(({
            key: key,
            object: pedestal,
        }) => {
            pedestal.on('pointerdown', () => {
                if (this.scene.get('puzzle1') == null) {
                    this.createWindow(512, 300, 600, 400, 'puzzle1');
                    this.scene.get('puzzle1').events.once('passBoolean', (value: boolean) => {
                        this.winState = value;
                        if (this.winState && key == 'winKey') {
                            this.gameProgress.keys.winKey = true;
                        }
                        else if (this.winState && key == 'door2Key') {
                            this.gameProgress.keys.door2Key = true;
                        }
                        else if (this.winState && key == 'trapdoor1Key') {
                            this.gameProgress.keys.trapdoor1Key = true;
                        }
                        console.log(this.gameProgress.keys);
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
            this.basicKey.play('key-left');
            this.gameProgress.inventory.finalKey = true;
            this.possessesKey = true;
        });
    }

    createWindow(x: number, y: number, width: number, height: number, id: string) {
        console.log('creating window');
        const uniqueIdentifier = id;

        const zone = this.add.zone(x, y, width, height).setInteractive();
        const scene = new Puzzle(uniqueIdentifier, zone, width, height);
        this.scene.add(uniqueIdentifier, scene, true);
    }

    generateBasicKey() {
        this.basicKey = this.physics.add.staticSprite(512, 100, 'basicKey', 0)
            .setScale(5)
            .setPosition(this.player.x + 100, this.player.y + 25)
            .refreshBody();

        this.basicKey.play('key-left');
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
        key.setPosition(this.player.x + x, this.player.y + y);

        key.refreshBody();
    }
}
