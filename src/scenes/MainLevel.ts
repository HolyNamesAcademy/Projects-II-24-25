import { SharedGameCode } from './SharedGameCode';
// import makeButton from '../utils/makeButton';
import { Layout, Key } from '../types';
import { Puzzle } from './Puzzle';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 300 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 1150, y: 0 },
        { type: 'door', x: 200, y: 0, key: Key.WIN_KEY, name: 'FinalDoor', next: { scene: 'WinScene', coordinates: { x: 10, y: 30 }, scrollPosition: 10 } },
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
        { type: 'door', x: 150, y: 0, key: Key.DOOR2_KEY, name: 'StageTwoDoor', next: { scene: 'StageTwo', coordinates: { x: 275, y: 368 }, scrollPosition: 260 } },
        { type: 'keyPedestal', x: 600, y: 0, key: Key.DOOR2_KEY },
    ],
};

const keyToScale = {
    [Key.WIN_KEY]: 5,
    [Key.DOOR2_KEY]: 4,
    [Key.TRAPDOOR1_KEY]: 4,
};

export class MainLevel extends SharedGameCode {
    key: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;

    constructor() {
        super('MainLevel');
        this.layout = layout;
    }

    create() {
        super.create();

        // makeButton(this, 'Win Addison', 35, 150, 650, () => {
        //     this.cameras.main.fadeOut(1000, 0, 0, 0);
        //     this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        //         this.scene.start('WinScene');
        //     });
        // });

        // makeButton(this, 'Kill Addison', 35, 150, 700, () => {
        //     this.cameras.main.fadeOut(1000, 0, 0, 0);
        //     this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        //         this.killPlayer();
        //     });
        // });

        this.pedestals.forEach(({
            key: key,
            object: pedestal,
        }) => {
            pedestal.on('pointerdown', () => {
                if (this.scene.get('puzzle1') == null) {
                    this.createWindow(512, 300, 600, 400, 'puzzle1');
                    this.scene.get('puzzle1').events.once('passBoolean', (value: boolean) => {
                        if (value && key) {
                            this.gameProgress.keys[key] = true;
                            this.generateKey(key);
                        }
                    });
                }
                else {
                    this.scene.remove('puzzle1');
                }
            });
        });

        // Generate the keys that this level uses.
        if (this.gameProgress.keys[Key.WIN_KEY]) {
            this.generateKey(Key.WIN_KEY);
        }
        if (this.gameProgress.keys[Key.DOOR2_KEY]) {
            this.generateKey(Key.DOOR2_KEY);
        }

        console.log('MainLevel created');
    }

    createWindow(x: number, y: number, width: number, height: number, id: string) {
        console.log('creating window');
        const uniqueIdentifier = id;

        const zone = this.add.zone(x, y, width, height).setInteractive();
        const scene = new Puzzle(uniqueIdentifier, zone, width, height);
        this.scene.add(uniqueIdentifier, scene, true);
    }

    generateKey(key: Key) {
        const scale = keyToScale[key] || 1;
        this.key = this.physics.add.staticSprite(512, 100, 'basicKey', 0)
            .setScale(scale)
            .setPosition(this.player.x + 100, this.player.y + 25)
            .refreshBody();

        this.key.play('key-left');
        this.nonCollisionItems.add(this.key);
    }

    update() {
        super.update();

        const onVine = this.getOnVine();

        if (onVine) {
            // They can press left or right to move, but still show the climbing animation.
            if (this.cursors?.left.isDown) {
                this.updateKeyPosition(this.key, 125, 25);
            }
            else if (this.cursors?.right.isDown) {
                this.updateKeyPosition(this.key, -125, 25);
            }
            else {
                this.updateKeyPosition(this.key, 0, 150);
            }
        }
    }

    moveLeft() {
        super.moveLeft();

        if (this.key && this.key.active) {
            if (this.key.anims.currentAnim?.key != 'key-left') {
                this.key.play('key-left');
            }
            this.updateKeyPosition(this.key, 125, 25);
        }
    }

    moveRight() {
        super.moveRight();

        if (this.key && this.key.active) {
            if (this.key.anims.currentAnim?.key != 'key-right') {
                this.key.play('key-right');
            }
            this.updateKeyPosition(this.key, -125, 25);
        }
    }

    updateKeyPosition(
        key: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
        x: number,
        y: number) {
        if (!key || !key.active) {
            return;
        };

        key.setPosition(this.player.x + x, this.player.y + y);
        key.refreshBody();
    }
}
