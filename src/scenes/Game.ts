import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';
import { GameProgress, Layout } from '../types';
import generateLevel from '../utils/generateLevel';
import { StageThree } from './StageThree';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 300 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 1150, y: 0 },
        { type: 'door', x: 200, y: 0 },
        { type: 'vine', x: 700, y: 0 },
        { type: 'vine', x: 700, y: 0, verticalOffset: 24 },

        { type: 'platform', x: 350, y: 400 },
        { type: 'platform', x: 900, y: 0 },
        { type: 'spikes', x: 920, y: 0 },
        { type: 'vine', x: 200, y: 0 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 },

        { type: 'platform', x: 550, y: 400 },
        { type: 'platform', x: 200, y: 0 },
        { type: 'platform', x: 700, y: 0 },
        { type: 'door', x: 150, y: 0 },
        { type: 'keyPedestal', x: 600, y: 0 },
    ],
};

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.TileSprite;
    msg_text: Phaser.GameObjects.Text;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    basicKey: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    nonCollisionItems: Phaser.Physics.Arcade.StaticGroup;

    crouching: boolean = false;

    scrollSpeed: number = 4;
    doubleJump: boolean = false;

    gameProgress: GameProgress;

    constructor() {
        super('Game');
    }

    init(data: GameProgress) {
        this.gameProgress = data;
    }

    create() {
        console.log(this.gameProgress);
        this.camera = this.cameras.main;

        this.background = this.add.tileSprite(512, 384, 512, 384, 'background');
        this.background.scale = 2;

        this.nonCollisionItems = this.physics.add.staticGroup();

        this.platforms = this.physics.add.staticGroup();
        const { doors, vines, pedestals, spikes } = generateLevel(this, this.platforms, layout);
        this.nonCollisionItems.addMultiple(doors);
        this.nonCollisionItems.addMultiple(vines);
        this.nonCollisionItems.addMultiple(pedestals);
        this.nonCollisionItems.addMultiple(spikes);

        this.player = this.physics.add.sprite(
            this.gameProgress.coordinates.x,
            this.gameProgress.coordinates.y,
            this.gameProgress.character,
        );

        this.basicKey = this.physics.add.staticSprite(512, 500, 'basicKey', 0).setScale(6);
        this.nonCollisionItems.add(this.basicKey);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);
        this.player.setSize(16, 32);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.platforms, () => {
            // If the player is inside a platform, move them up.
            this.player.y -= this.scrollSpeed * 2;
        });

        this.cursors = this.input?.keyboard?.createCursorKeys();

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

        this.setInitialPosition(this.gameProgress.scrollPosition);

        pedestals.forEach((pedestal) => {
            pedestal.on('pointerover', () => {
                pedestal.anims.play('keyPedestal', false);
                pedestal.anims.play('pedestalFlash', true);
            });
        });
        pedestals.forEach((pedestal) => {
            pedestal.on('pointerout', () => {
                pedestal.anims.play('pedestalFlash', false);
                pedestal.anims.play('keyPedestal', true);
            });
        });
        pedestals.forEach((pedestal) => {
            pedestal.on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('StageThree');
                });
            });
        });

        this.physics.add.collider(this.player, spikes, () => {
            this.scene.start('DeathScreen');
        });

        doors.forEach((door) => {
            door.on('pointerdown', () => {
                if (door.anims.currentAnim && door.anims.currentAnim.key === 'openDoor') {
                    door.anims.play('closeDoor', true);
                }
                else {
                    door.anims.play('openDoor', true);
                }
            });
        });

        this.physics.add.collider(this.player, this.basicKey, () => {
            this.basicKey.setVisible(false);
            console.log('hiding key');
        });

        this.createWindow(512, 300, 512, 300);
    }

    createWindow(x: number, y: number, width: number, height: number) {
        console.log('creating window');
        const uniqueIdentifier = 'popup' + Math.random();

        const zone = this.add.zone(x, y, width, height).setInteractive();
        const scene = new StageThree(uniqueIdentifier, zone, width, height);
        this.scene.add(uniqueIdentifier, scene, true);
    }

    update() {
        if (this.cursors?.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play(`${this.gameProgress.character}-left`, true);
        }
        else if (this.cursors?.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play(`${this.gameProgress.character}-right`, true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play(`${this.gameProgress.character}-forward`);
        }

        if (this.cursors?.up.isDown && this.player.body.touching.down) {
            this.player.anims.play(`${this.gameProgress.character}-crouch`);// find way to delay jump until crouch frame remains for 1 sec
            this.crouching = true;
        }

        else if (this.cursors?.up.isUp && this.crouching) {
            this.player.anims.play(`${this.gameProgress.character}-jump`);// find way to stop if after bounce? //no bounce?
            this.player.setVelocityY(-430);
            this.crouching = false;
        }

        else if (!this.player.body.touching.down) {
            this.player.anims.play(`${this.gameProgress.character}-jump`);
        }

        if (this.player.body.velocity.x == 0) {
            this.gameProgress.coordinates = this.player.getCenter();
            localStorage.setItem('gameProgress', JSON.stringify(this.gameProgress));
        }

        const { y: playerY } = this.player.getBottomCenter();

        if (playerY > 2000) {
            this.scene.start('DeathScreen');
        }
        if (playerY > 750) {
            this.player.setCollideWorldBounds(false);
        }

        if (playerY > 550) {
            this.scroll(-1 * this.scrollSpeed);
        }
        else if (playerY < 200 && this.gameProgress.scrollPosition > 384) {
            this.scroll(this.scrollSpeed);
        }
    }

    /**
     * @param y the amount to scroll the background and all other objects in positive Y (down) direction
     */
    scroll(y: number) {
        // The background scrolls at half the speed of the player and platforms (It is scaled to 2x).
        // It also scrolls in the opposite direction because it us using a tileSprite.
        this.gameProgress.scrollPosition += 0.5 * y * -1;
        this.background.tilePositionY = this.gameProgress.scrollPosition;

        // Move all platforms and the player in the same direction.
        this.platforms.incY(y);
        this.nonCollisionItems.incY(y);
        this.player.y += y;

        // Refresh the physics bodies to reflect the changes.
        this.platforms.refresh();
        this.nonCollisionItems.refresh();
    }

    /**
     * @param scrollPosition the position to set the background and all other objects to
     */
    setInitialPosition(scrollPosition: number) {
        // Set the background to the scrollPosition.
        this.gameProgress.scrollPosition = scrollPosition;
        this.background.tilePositionY = this.gameProgress.scrollPosition;

        // Move all the static objects to align with how far down the player is.
        // Subtract the scrollPosition from 384 to get the amount to move the objects.
        // Multiply by -1 to move the objects in the positive Y (down) direction.
        // Multiply by 2 to move the objects twice the distance as the background.
        this.platforms.incY((scrollPosition - 384) * -1 * 2);
        this.nonCollisionItems.incY((scrollPosition - 384) * -1 * 2);

        // Refresh the physics bodies to reflect the changes.
        this.platforms.refresh();
        this.nonCollisionItems.refresh();
    }
}
