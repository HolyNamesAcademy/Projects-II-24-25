import { Scene, Utils } from 'phaser';
import makeButton from '../utils/makeButton';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.TileSprite;
    msg_text: Phaser.GameObjects.Text;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    door: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    dieButton: Phaser.GameObjects.Text;
    winButton: Phaser.GameObjects.Text;
    nonCollisionItems: Phaser.Physics.Arcade.StaticGroup;

    backgroundX: number = 512;
    backgroundY: number = 384;
    scrollSpeed: number = 2;
    doubleJump: boolean = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.physics.world.TILE_BIAS = 8;

        this.background = this.add.tileSprite(this.backgroundX, this.backgroundY, 512, 384, 'background');
        this.background.scale = 2;

        this.nonCollisionItems = this.physics.add.staticGroup();

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(200, 300, 'platform');
        this.platforms.create(600, 300, 'platform');
        this.platforms.create(1150, 300, 'platform');

        this.platforms.create(900, 600, 'platform');
        this.platforms.create(350, 600, 'platform');
        
        this.platforms.create(550, 900, 'platform');

        this.player = this.physics.add.sprite(500, 100, 'addison');
        this.door = this.physics.add.staticSprite(200, 190, 'door', 0).setScale(5.5);
        this.nonCollisionItems.add(this.door);

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);
        this.player.setSize(16, 32);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input?.keyboard?.createCursorKeys();

        makeButton(this, "Win Addison", 35, 150, 650, () =>{
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('WinScene');
            });
        });

        makeButton(this, "Kill Addison", 35, 150, 700, () =>{
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('DeathScreen');
            });
        });
    }

    update () {
        if (this.cursors?.left.isDown)
            {
                this.player.setVelocityX(-160);

                this.player.anims.play('left', true);
            }
            else if (this.cursors?.right.isDown)
            {
                this.player.setVelocityX(160);

                this.player.anims.play('right', true);
            }
            else
            {
                this.player.setVelocityX(0);

                this.player.anims.play('turn');
            }

            if (this.cursors?.up.isDown && this.player.body.touching.down)
            {
                this.player.anims.play('crouch');//find way to delay jump until crouch frame remains for 1 sec
                this.player.setVelocityY(-430);
            }
            else if (!this.player.body.touching.down){
                this.player.anims.play('jump');//find way to stop if after bounce? //no bounce?
            }

            console.log(this.player.getBottomCenter());
            const {y: playerY} = this.player.getBottomCenter();
            if(playerY > 550)
            {
                this.backgroundY += 0.5 * this.scrollSpeed;
                this.background.tilePositionY = this.backgroundY;
                this.platforms.incY(-1 * this.scrollSpeed);
                this.nonCollisionItems.incY(-1 * this.scrollSpeed);
                this.nonCollisionItems.refresh();
                this.platforms.refresh();
            }
            if(playerY < 200 && this.backgroundY > 384)
            {
                this.backgroundY -= 0.5 * this.scrollSpeed;
                this.background.tilePositionY = this.backgroundY;
                this.platforms.incY(1 * this.scrollSpeed);
                this.nonCollisionItems.incY(1 * this.scrollSpeed);
                this.nonCollisionItems.refresh();
                this.platforms.refresh();
            }
    }
}
