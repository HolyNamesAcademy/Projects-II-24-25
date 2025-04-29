import { SharedGameCode } from './SharedGameCode';
// import makeButton from '../utils/makeButton';
import { Layout, Key } from '../types';
import { Puzzle } from './Puzzle';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 200 },
        { type: 'platform', x: 1000, y: 0 },
        { type: 'door', x: 200, y: 0, name: 'StageTwoDoor', next: { scene: 'MainLevel', coordinates: { x: 219, y: 468 }, scrollPosition: 660 } },
        { type: 'vine', x: 50, y: 0 },
        { type: 'vine', x: 50, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 200, y: 0 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 48 + 24 },
        { type: 'vine', x: 250, y: 0 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 + 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 + 24 + 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 + 24 + 24 + 24 },

        { type: 'keyPedestal', x: 950, y: 0, key: Key.WIN_KEY },
        { type: 'vine', x: 840, y: 0 },
        { type: 'vine', x: 840, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 990, y: 0 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 72 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 96 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 120 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 144 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 168 },

        { type: 'wall', x: 780, y: 100 },
        { type: 'wall', x: 780, y: 0, verticalOffset: 100 },

        { type: 'platform', x: 290, y: 500 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 730, y: 0 },
        // { type: 'spikes', x: 50, y: 0 },
        { type: 'spikes', x: 170, y: 0 },
        { type: 'spikes', x: 250, y: 0 },
        { type: 'spikes', x: 350, y: 0 },
        { type: 'spikes', x: 450, y: 0 },
        { type: 'spikes', x: 550, y: 0 },
        { type: 'spikes', x: 650, y: 0 },
        { type: 'spikes', x: 750, y: 0 },
        { type: 'spikes', x: 850, y: 0 },
        // { type: 'spikes', x: 950, y: 0 },
        { type: 'vine', x: 170, y: 0 },
        { type: 'vine', x: 250, y: 0 },
        { type: 'vine', x: 450, y: 0 },

        { type: 'platform', x: -10, y: 400 },
    ],

};

const keyToScale = {
    [Key.WIN_KEY]: 5,
    [Key.DOOR2_KEY]: 4,
    [Key.TRAPDOOR1_KEY]: 4,
};

export class StageTwo extends SharedGameCode {
    key: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;

    constructor() {
        super('StageTwo');
        this.layout = layout;
    }

    create() {
        super.create();

        if (this.gameProgress.keys[Key.WIN_KEY]) {
            this.generateKey(Key.WIN_KEY);
        }

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
