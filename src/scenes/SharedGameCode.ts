import { Scene } from 'phaser';
import { GameProgress, Layout, PuzzleObject } from '../types';
import generateLevel from '../utils/generateLevel';
import timer from '../utils/timer';

export class SharedGameCode extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;

    background: Phaser.GameObjects.TileSprite;
    backgroundAnimation: Phaser.GameObjects.Sprite;

    platforms: Phaser.Physics.Arcade.StaticGroup;
    walls: Phaser.Physics.Arcade.StaticGroup;
    wallCollisions: Phaser.Physics.Arcade.Collider;
    platformCollisions: Phaser.Physics.Arcade.Collider;
    nonCollisionItems: Phaser.Physics.Arcade.StaticGroup;
    pedestals: PuzzleObject[];
    vines: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[];

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    // Add keyboard controls data structure
    private keyboardControls: {
        space: Phaser.Input.Keyboard.Key | undefined;
        w: Phaser.Input.Keyboard.Key | undefined;
        a: Phaser.Input.Keyboard.Key | undefined;
        s: Phaser.Input.Keyboard.Key | undefined;
        d: Phaser.Input.Keyboard.Key | undefined;
    };

    crouching: boolean = false;
    currentDoorAnim: string;

    gameProgress: GameProgress;
    layout: Layout;
    scrollSpeed: number = 4;

    // Add new properties for mobile controls
    private mobileControls: {
        up: Phaser.GameObjects.Container;
        left: Phaser.GameObjects.Container;
        right: Phaser.GameObjects.Container;
    };

    private isMobileButtonPressed: {
        left: boolean;
        right: boolean;
        up: boolean;
    };

    init(data: GameProgress) {
        this.gameProgress = data;
        console.log(this.gameProgress);
        this.currentDoorAnim = '';
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x1a1a1a);

        // Add 3 extra pointers for multitouch support
        this.input.addPointer(3);

        this.background = this.add.tileSprite(512, 384, 512, 384, 'background');
        this.background.scale = 2;
        this.backgroundAnimation = this.add.sprite(0, 0, 'background').setVisible(false).play('background');

        this.nonCollisionItems = this.physics.add.staticGroup();

        this.platforms = this.physics.add.staticGroup();
        this.walls = this.physics.add.staticGroup();
        const { doors, vines, pedestals, spikes } = generateLevel(this, this.platforms, this.walls, this.layout);
        this.nonCollisionItems.addMultiple(doors.map(d => d.object));
        this.nonCollisionItems.addMultiple(pedestals.map(p => p.object));
        this.nonCollisionItems.addMultiple(vines);
        this.nonCollisionItems.addMultiple(spikes);
        this.vines = vines;
        this.pedestals = pedestals;

        // Set the scroll position before creating the player.
        this.setInitialPosition(this.gameProgress.scrollPosition);

        this.player = this.physics.add.sprite(
            this.gameProgress.coordinates.x,
            this.gameProgress.coordinates.y,
            this.gameProgress.character,
        );

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);
        this.player.setSize(16, 32);

        this.player.anims.play(`${this.gameProgress.character}-forward`);

        this.wallCollisions = this.physics.add.collider(this.player, this.walls);
        this.platformCollisions = this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.platforms, () => {
            if (this.getOnVine()) {
                return;
            }
            this.player.y -= this.scrollSpeed * 2;
        });

        this.cursors = this.input?.keyboard?.createCursorKeys();

        // Initialize keyboard controls
        this.keyboardControls = {
            space: this.input.keyboard?.addKey('SPACE'),
            w: this.input.keyboard?.addKey('W'),
            a: this.input.keyboard?.addKey('A'),
            s: this.input.keyboard?.addKey('S'),
            d: this.input.keyboard?.addKey('D'),
        };

        pedestals.forEach(({
            object: pedestal,
        }) => {
            pedestal.on('pointerover', () => {
                pedestal.anims.play('keyPedestal', false);
                pedestal.anims.play('pedestalFlash', true);
            });
            pedestal.on('pointerout', () => {
                pedestal.anims.play('pedestalFlash', false);
                pedestal.anims.play('keyPedestal', true);
            });
        });

        this.physics.add.collider(this.player, spikes, () => {
            this.killPlayer();
        });

        doors.forEach(({
            next,
            key,
            object: door,
        }) => {
            if (this.gameProgress.doorLocks[door.name] == null) {
                this.gameProgress.doorLocks[door.name] = true;
            }

            this.physics.add.overlap(this.player, door, async () => {
                // Check if they have the key for this door.
                if (key && this.gameProgress.keys[key]) {
                    // Unlock the door.
                    this.gameProgress.doorLocks[door.name] = false;
                    // The key is now used.
                    this.gameProgress.keys[key] = false;
                }

                const locked = this.gameProgress.doorLocks[door.name];
                // Check that the door is unlocked, and we are not already going though the door.
                if (!locked && this.currentDoorAnim != door.name) {
                    this.currentDoorAnim = door.name;
                    door.anims.play('openDoor', true);
                    await timer(500);
                    this.player.setVisible(false);
                    door.anims.play('closeDoor', true);

                    if (next) {
                        await timer(500);
                        this.cameras.main.fadeOut(1000, 0, 0, 0);
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.gameProgress.coordinates = next.coordinates;
                            this.gameProgress.scrollPosition = next.scrollPosition;
                            this.gameProgress.scene = next.scene;

                            localStorage.setItem('gameProgress', JSON.stringify(this.gameProgress));

                            this.player.setX(next.coordinates.x);
                            this.player.setY(next.coordinates.y);
                            this.scene.start(next.scene, this.gameProgress);
                        });
                    }
                }
            });
        });

        // Add mobile controls at the end of create()
        this.createMobileControls();
    }

    private createMobileControls() {
        // Initialize the pressed state
        this.isMobileButtonPressed = {
            left: false,
            right: false,
            up: false,
        };

        // Calculate button positions
        const gameHeight = this.game.config.height as number;
        const gameWidth = this.game.config.width as number;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth < 1024;
        const buttonY = (isMobile || isSmallScreen) ? gameHeight - 384 : gameHeight - 100; // Center in the extra space
        const buttonRadius = (isMobile || isSmallScreen) ? 128 : 32; // Much larger buttons on mobile/small screens

        // Create a solid background for mobile controls area on mobile/small screens
        if (isMobile || isSmallScreen) {
            const maskHeight = gameHeight / 2; // Half screen height
            const maskWidth = gameWidth; // Full width of the game
            const maskY = gameHeight / 2; // Start from middle
            const mask = this.add.graphics();
            mask.fillStyle(0x1a1a1a); // Same color as background (0x1a1a1a)
            mask.fillRect(0, maskY, maskWidth, maskHeight);
            mask.setScrollFactor(0); // Make it fixed to camera
            mask.setDepth(0); // Ensure it's behind the controls
        }

        // Create mobile controls
        this.mobileControls = {
            up: this.createCircleButton(64, buttonY, buttonRadius, '↑'),
            left: this.createCircleButton(gameWidth - buttonRadius * 2 - 64 - buttonRadius * 2 - 32, buttonY, buttonRadius, '←'),
            right: this.createCircleButton(gameWidth - buttonRadius * 2 - 64, buttonY, buttonRadius, '→'),
        };

        // Set depth for all controls to ensure they're above the background
        Object.values(this.mobileControls).forEach((control) => {
            control.setDepth(1);
        });

        // Add touch events for each button
        Object.entries(this.mobileControls).forEach(([key, container]) => {
            const buttonKey = key as keyof typeof this.isMobileButtonPressed;
            container.setInteractive(new Phaser.Geom.Circle(buttonRadius, buttonRadius, buttonRadius), Phaser.Geom.Circle.Contains);

            container.on('pointerdown', () => {
                this.isMobileButtonPressed[buttonKey] = true;
                container.setAlpha(1);
            });

            container.on('pointerup', () => {
                this.isMobileButtonPressed[buttonKey] = false;
                container.setAlpha(0.7);
            });

            container.on('pointerout', () => {
                this.isMobileButtonPressed[buttonKey] = false;
                container.setAlpha(0.7);
            });
        });
    }

    private createCircleButton(x: number, y: number, radius: number, symbol: string): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        // Create the circle
        const circle = this.add.graphics();
        circle.fillStyle(0x000000, 0.5); // Semi-transparent black
        circle.lineStyle(4, 0xFFFFFF, 0.8); // Thicker white border
        circle.beginPath();
        circle.arc(radius, radius, radius, 0, Math.PI * 2);
        circle.closePath();
        circle.fill();
        circle.stroke();

        // Add the arrow symbol with larger font
        const text = this.add.text(radius, radius, symbol, {
            color: '#FFFFFF',
            fontSize: `${radius * 1.5}px`, // Scale font size with button size
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Add both to the container
        container.add([circle, text]);

        // Set initial alpha
        container.setAlpha(0.7);

        // Make it fixed to camera
        container.setScrollFactor(0);

        return container;
    }

    update() {
        const onVine = this.getOnVine();
        const touchingPlatform = this.getTouchingPlatform();

        // Update button appearances based on keyboard input
        if (this.isLeftPressed()) {
            this.mobileControls.left.setAlpha(1);
        }
        else if (!this.isMobileButtonPressed.left) {
            this.mobileControls.left.setAlpha(0.7);
        }

        if (this.isRightPressed()) {
            this.mobileControls.right.setAlpha(1);
        }
        else if (!this.isMobileButtonPressed.right) {
            this.mobileControls.right.setAlpha(0.7);
        }

        if (this.isUpPressed()) {
            this.mobileControls.up.setAlpha(1);
        }
        else if (!this.isMobileButtonPressed.up) {
            this.mobileControls.up.setAlpha(0.7);
        }

        this.background.setFrame(this.backgroundAnimation.frame.name);

        if (onVine) {
            // On a vine, either show forward when touching the platform
            if (touchingPlatform) {
                if (this.isLeftPressed()) {
                    this.moveLeft();
                }
                else if (this.isRightPressed()) {
                    this.moveRight();
                }
                else {
                    this.player.anims.play(`${this.gameProgress.character}-forward`);
                }
            }
            // or show climb when not touching the platform
            else if (this.player.anims.currentAnim?.key != `${this.gameProgress.character}-climb`) {
                this.player.anims.play(`${this.gameProgress.character}-climb`);
            }

            // If they are pressing up, move up and allow moving though platform.
            if (this.isUpPressed()) {
                this.player.setVelocityY(-200);
                this.platformCollisions.active = false;
            }
            else {
                this.platformCollisions.active = true;
            }

            // They can press left or right to move, but still show the climbing animation.
            if (this.isLeftPressed()) {
                this.player.setVelocityX(-160);
            }
            else if (this.isRightPressed()) {
                this.player.setVelocityX(160);
            }
            else {
                this.player.setVelocityX(0);
            }
        }
        else {
            this.platformCollisions.active = true;

            if (this.isLeftPressed()) {
                this.moveLeft();
                this.jumpWithoutAnimation();
            }
            else if (this.isRightPressed()) {
                this.moveRight();
                this.jumpWithoutAnimation();
            }
            else {
                this.player.setVelocityX(0);

                if (this.isUpPressed() && this.player.body.touching.down) {
                    this.player.anims.play(`${this.gameProgress.character}-crouch`);
                    this.crouching = true;
                }

                else if (!this.isUpPressed() && this.crouching) {
                    this.player.anims.play(`${this.gameProgress.character}-jump`);
                    this.player.setVelocityY(-430);
                    this.crouching = false;
                }

                else if (!this.player.body.touching.down) {
                    this.player.anims.play(`${this.gameProgress.character}-jump`);
                }

                else {
                    this.player.anims.play(`${this.gameProgress.character}-forward`);
                }
            }
        }

        if (this.player.body.velocity.x == 0) {
            const updatedCoordinates = {
                x: Math.round(this.player.getCenter().x),
                y: Math.round(this.player.getCenter().y),
            };
            const existingCoordinates = this.gameProgress.coordinates;
            const coordinatesChanged = updatedCoordinates.x != existingCoordinates.x || updatedCoordinates.y != existingCoordinates.y;

            if (coordinatesChanged) {
                this.gameProgress.coordinates = updatedCoordinates;
                console.log(this.gameProgress.coordinates, this.gameProgress.scrollPosition);
                localStorage.setItem('gameProgress', JSON.stringify(this.gameProgress));
            }
        }

        const { y: playerY } = this.player.getBottomCenter();

        if (playerY > 2000) {
            this.killPlayer();
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

    private isUpPressed(): boolean {
        return (this.cursors?.up.isDown ?? false)
            || (this.keyboardControls.space?.isDown ?? false)
            || (this.keyboardControls.w?.isDown ?? false)
            || this.isMobileButtonPressed.up;
    }

    private isLeftPressed(): boolean {
        return (this.cursors?.left.isDown ?? false)
            || (this.keyboardControls.a?.isDown ?? false)
            || this.isMobileButtonPressed.left;
    }

    private isRightPressed(): boolean {
        return (this.cursors?.right.isDown ?? false)
            || (this.keyboardControls.d?.isDown ?? false)
            || this.isMobileButtonPressed.right;
    }

    protected moveLeft() {
        this.player.setVelocityX(-160);
        if (this.player.anims.currentAnim?.key != `${this.gameProgress.character}-left`) {
            this.player.anims.play(`${this.gameProgress.character}-left`, true);
        }
    }

    protected moveRight() {
        this.player.setVelocityX(160);
        if (this.player.anims.currentAnim?.key != `${this.gameProgress.character}-right`) {
            this.player.anims.play(`${this.gameProgress.character}-right`, true);
        }
    }

    private jumpWithoutAnimation() {
        if (this.isUpPressed() && this.player.body.touching.down) {
            this.crouching = true;
        }
        else if (!this.isUpPressed() && this.crouching) {
            this.player.setVelocityY(-430);
            this.crouching = false;
        }
    }

    protected getOnVine() {
        return this.physics.overlap(this.vines, this.player);
    }

    private getTouchingPlatform() {
        return this.player.body.velocity.y < 5 && this.player.body.velocity.y > -5;
    }

    private killPlayer() {
        this.scene.start('DeathScreen', this.gameProgress);
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
        this.walls.incY(y);
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
