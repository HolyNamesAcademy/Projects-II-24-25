import { Scene } from 'phaser';

const framesPerRowAddison = 15;
const framesPerRowFinley = 13;
export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Set the background color of the camera to black
        this.cameras.main.setBackgroundColor('#000000');

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

        this.load.image('wall', 'Brick Wall.png');

        this.load.image('deathBackground', 'Death Background.png');

        this.load.spritesheet('background', 'Game Wall (1).png', { frameWidth: 512, frameHeight: 384 });

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
            'finley5.png',
            { frameWidth: 32, frameHeight: 32 },
        );
        this.load.spritesheet('clare',
            'CLARE3.png',
            { frameWidth: 32, frameHeight: 32 },
        );
        this.load.spritesheet('allie',
            'allie2.png',
            { frameWidth: 32, frameHeight: 32 },
        );
        this.load.spritesheet('lucy',
            'lucy3.png',
            { frameWidth: 32, frameHeight: 32 },
        );
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.anims.create({
            key: 'background',
            frames: this.anims.generateFrameNumbers('background', { frames: [0, 1, 2, 3] }),
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
            key: 'completedPuzzle',
            frames: this.anims.generateFrameNumbers('keyPedestal', { frames: [2] }),
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
        this.makePinkAddisonAnimations();
        this.makeDarkRedAddisonAnimations();
        this.makeCottonCandyAddisonAnimations();
        this.makeWigAddisonAnimations();
        this.makeAllieAnimations();
        this.makeLucyAnimations();
        this.makeFinleyAnimations();
        this.makeBlockFinleyAnimations();
        this.makeBeanieFinleyAnimations();
        this.makeCapFinleyAnimations();
        this.makeBaldFinleyAnimations();
        this.makeClareAnimations();

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }

    makeAddisonAnimations() {
        this.createFinleyStyleAnimations('addison', 'addison', framesPerRowFinley * 0);
    }

    makePinkAddisonAnimations() {
        this.createFinleyStyleAnimations('pinkAddison', 'addison', framesPerRowFinley * 1);
    }

    makeDarkRedAddisonAnimations() {
        this.createFinleyStyleAnimations('darkRedAddison', 'addison', framesPerRowFinley * 2);
    }

    makeCottonCandyAddisonAnimations() {
        this.createFinleyStyleAnimations('cottonCandyAddison', 'addison', framesPerRowFinley * 3);
    }

    makeWigAddisonAnimations() {
        this.createFinleyStyleAnimations('wigAddison', 'addison', framesPerRowFinley * 4);
    }

    makeAllieAnimations() {
        this.createAddisonStyleAnimations('allie', 'allie', 0);
    }

    makeLucyAnimations() {
        this.createAddisonStyleAnimations('lucy', 'lucy', 0);
    }

    makeFinleyAnimations() {
        this.createAddisonStyleAnimations('finley', 'finley', framesPerRowAddison * 0);
    }

    makeBlockFinleyAnimations() {
        this.createAddisonStyleAnimations('blockFinley', 'finley', framesPerRowAddison * 1);
    }

    makeBeanieFinleyAnimations() {
        this.createAddisonStyleAnimations('beanieFinley', 'finley', framesPerRowAddison * 2);
    }

    makeCapFinleyAnimations() {
        this.createAddisonStyleAnimations('capFinley', 'finley', framesPerRowAddison * 3);
    }

    makeBaldFinleyAnimations() {
        this.createAddisonStyleAnimations('baldFinley', 'finley', framesPerRowAddison * 4);
    }

    makeClareAnimations() {
        this.createAddisonStyleAnimations('clare', 'clare', 0);
    }

    private createAddisonStyleAnimations(key: string, sprite: string, offset: number) {
        const frames = {
            left: [8 + offset, 9 + offset, 10 + offset, 9 + offset],
            forward: [0 + offset],
            right: [11 + offset, 12 + offset, 13 + offset, 12 + offset],
            jump: [2 + offset],
            crouch: [2 + offset],
            climb: [4 + offset, 5 + offset],
            death: [14 + offset],
        };

        this.anims.create({
            key: `${key}-left`,
            frames: this.anims.generateFrameNumbers(sprite, { frames: frames.left }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: `${key}-forward`,
            frames: frames.forward.map(frame => ({ key: sprite, frame })),
            frameRate: 20,
        });

        this.anims.create({
            key: `${key}-right`,
            frames: this.anims.generateFrameNumbers(sprite, { frames: frames.right }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: `${key}-jump`,
            frames: frames.jump.map(frame => ({ key: sprite, frame })),
            frameRate: -1,
        });

        this.anims.create({
            key: `${key}-crouch`,
            frames: frames.crouch.map(frame => ({ key: sprite, frame })),
            frameRate: -1,
        });

        this.anims.create({
            key: `${key}-climb`,
            frames: frames.climb.map(frame => ({ key: sprite, frame })),
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: `${key}-death`,
            frames: frames.death.map(frame => ({ key: sprite, frame })),
            frameRate: -1,
        });
    }

    private createFinleyStyleAnimations(key: string, sprite: string, offset: number) {
        const frames = {
            left: [2 + offset, 12 + offset],
            forward: [0 + offset],
            right: [1 + offset, 11 + offset],
            jump: [7 + offset],
            crouch: [6 + offset],
            climb: [9 + offset, 10 + offset],
            death: [5 + offset],
            fall: [8 + offset],
        };

        this.anims.create({
            key: `${key}-left`,
            frames: this.anims.generateFrameNumbers(sprite, { frames: frames.left }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: `${key}-forward`,
            frames: frames.forward.map(frame => ({ key: sprite, frame })),
            frameRate: 20,
        });

        this.anims.create({
            key: `${key}-right`,
            frames: this.anims.generateFrameNumbers(sprite, { frames: frames.right }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: `${key}-jump`,
            frames: frames.jump.map(frame => ({ key: sprite, frame })),
            frameRate: -1,
        });

        this.anims.create({
            key: `${key}-crouch`,
            frames: frames.crouch.map(frame => ({ key: sprite, frame })),
            frameRate: -1,
        });

        this.anims.create({
            key: `${key}-climb`,
            frames: frames.climb.map(frame => ({ key: sprite, frame })),
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: `${key}-death`,
            frames: frames.death.map(frame => ({ key: sprite, frame })),
            frameRate: -1,
        });
    }
}
