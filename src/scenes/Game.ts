import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;

        this.background = this.add.image(512, 384, 'background');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.player = this.physics.add.sprite(100, 400, 'clare');
        this.player.setBounce(0.2);
        this.player.setScale(4);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.input.once('pointerdown', () => {

        //     this.scene.start('GameOver');

        // });
    }

    update ()
    {
        if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-160);

                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(160);

                this.player.anims.play('right', true);
            }
            else
            {
                this.player.setVelocityX(0);

                this.player.anims.play('turn');
            }

            if (this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-330);
            }

    }
}
