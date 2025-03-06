import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'titleBackground').scale = 2;

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('platform', 'wood final allie pls.png');

        this.load.spritesheet('background', 'Wall.png', { frameWidth: 512, frameHeight: 384 });

        this.load.spritesheet('door', 'door.png', { frameWidth: 38, frameHeight: 36 });

        this.load.spritesheet('basicKey', 'commonKey.png', { frameWidth: 15, frameHeight: 32 });

        this.load.spritesheet('vine', 'Vines.png', { frameWidth: 9, frameHeight: 24 });

        this.load.spritesheet('spikes', 'spikes1.png', { frameWidth: 53, frameHeight: 18 });

        this.load.spritesheet('keyPedestal', 'Pedestal_Frames.png', { frameWidth: 36, frameHeight: 84 });

        this.load.spritesheet('Numbers', 'BetterNumbers.png', { frameWidth: 19, frameHeight: 19 });

        this.load.spritesheet('addison',
            'AddisonSpriteSheetRed.png',
            { frameWidth: 32, frameHeight: 32 },
        );
        this.load.spritesheet('finley',
            'finley4.png',
            { frameWidth: 32, frameHeight: 32 },
        );
        this.load.spritesheet('clare',
            'CLARE2.png',
            { frameWidth: 32, frameHeight: 32 },
        );
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.anims.create({
            key: 'background',
            frames: this.anims.generateFrameNumbers('background', { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: 'openDoor',
            frames: this.anims.generateFrameNumbers('door', { frames: [1, 2] }),
            frameRate: 4,
        });

        this.anims.create({
            key: 'closeDoor',
            frames: this.anims.generateFrameNumbers('door', { frames: [2, 1, 0] }),
            frameRate: 4,
        });

        this.anims.create({
            key: 'vine',
            frames: this.anims.generateFrameNumbers('vine', { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: 'keyPedestal',
            frames: this.anims.generateFrameNumbers('keyPedestal', { frames: [2, 3, 4, 5, 6] }),
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: 'pedestalFlash',
            frames: this.anims.generateFrameNumbers('keyPedestal', { frames: [7] }),
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: 'key-right',
            frames: this.anims.generateFrameNumbers('basicKey', { frames: [0, 1, 2] }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'key-left',
            frames: this.anims.generateFrameNumbers('basicKey', { frames: [3, 4, 5] }),
            frameRate: 5,
            repeat: -1,
        });

        // Make all the character animations
        this.makeAddisonAnimations();
        this.makeFinleyAnimations();
        this.makeBeanieFinleyAnimations();
        this.makeCapFinleyAnimations();
        this.makeBaldFinleyAnimations();
        this.makeClareAnimations();

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }

    makeAddisonAnimations() {
        this.anims.create({
            key: 'addison-left',
            frames: this.anims.generateFrameNumbers('addison', { frames: [2, 12] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'addison-forward',
            frames: [{ key: 'addison', frame: 0 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'addison-right',
            frames: this.anims.generateFrameNumbers('addison', { frames: [1, 11] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'addison-jump',
            frames: [{ key: 'addison', frame: 7 }],
            frameRate: 5,
        });

        this.anims.create({
            key: 'addison-crouch',
            frames: [{ key: 'addison', frame: 6 }],
            frameRate: 30,
        });

        this.anims.create({
            key: 'addison-climb',
            frames: this.anims.generateFrameNumbers('addison', { frames: [9, 10] }),
            frameRate: 4,
            repeat: -1,
        });
    }

    makeFinleyAnimations() {
        this.anims.create({
            key: 'finley-left',
            frames: this.anims.generateFrameNumbers('finley', { frames: [5, 7] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'finley-forward',
            frames: [{ key: 'finley', frame: 0 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'finley-right',
            frames: this.anims.generateFrameNumbers('finley', { frames: [8, 10] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'finley-jump',
            frames: [{ key: 'finley', frame: 2 }],
            frameRate: 5,
        });

        this.anims.create({
            key: 'finley-climb',
            frames: [{ key: 'finley', frame: 1 }],
            frameRate: -1,
        });
    }

    makeBeanieFinleyAnimations() {
        this.anims.create({
            key: 'beanieFinley-left',
            frames: this.anims.generateFrameNumbers('finley', { frames: [17, 19] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'beanieFinley-forward',
            frames: [{ key: 'finley', frame: 12 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'beanieFinley-right',
            frames: this.anims.generateFrameNumbers('finley', { frames: [20, 22] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'beanieFinley-jump',
            frames: [{ key: 'finley', frame: 14 }],
            frameRate: 5,
        });

        this.anims.create({
            key: 'beanieFinley-climb',
            frames: [{ key: 'finley', frame: 13 }],
            frameRate: -1,
        });
    }

    makeCapFinleyAnimations() {
        this.anims.create({
            key: 'capFinley-left',
            frames: this.anims.generateFrameNumbers('finley', { frames: [29, 31] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'capFinley-forward',
            frames: [{ key: 'finley', frame: 24 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'capFinley-right',
            frames: this.anims.generateFrameNumbers('finley', { frames: [32, 34] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'capFinley-jump',
            frames: [{ key: 'finley', frame: 26 }],
            frameRate: 5,
        });

        this.anims.create({
            key: 'capFinley-climb',
            frames: [{ key: 'finley', frame: 25 }],
            frameRate: -1,
        });
    }

    makeBaldFinleyAnimations() {
        this.anims.create({
            key: 'baldFinley-left',
            frames: this.anims.generateFrameNumbers('finley', { frames: [41, 43] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'baldFinley-forward',
            frames: [{ key: 'finley', frame: 36 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'baldFinley-right',
            frames: this.anims.generateFrameNumbers('finley', { frames: [44, 46] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'baldFinley-jump',
            frames: [{ key: 'finley', frame: 38 }],
            frameRate: 5,
        });

        this.anims.create({
            key: 'baldFinley-climb',
            frames: [{ key: 'finley', frame: 37 }],
            frameRate: -1,
        });
    }

    makeClareAnimations() {
        this.anims.create({
            key: 'clare-left',
            frames: this.anims.generateFrameNumbers('clare', { frames: [5, 7] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'clare-forward',
            frames: [{ key: 'clare', frame: 0 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'clare-right',
            frames: this.anims.generateFrameNumbers('clare', { frames: [8, 10] }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'clare-jump',
            frames: [{ key: 'clare', frame: 4 }],
            frameRate: 5,
        });
    }
}
