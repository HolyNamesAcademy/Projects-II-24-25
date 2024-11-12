import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    dieButton: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;

        this.background = this.add.image(512, 384, 'background');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 810, 'platform').setScale(4).refreshBody();

        this.platforms.create(600, 400, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(750, 220, 'platform');

        this.player = this.physics.add.sprite(100, 450, 'addison');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input?.keyboard?.createCursorKeys();

        this.dieButton = this.add.text(150, 700, 'Kill Addison', {
            fontFamily: 'MedievalSharp', fontSize: 35, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.dieButton.setInteractive();
        this.dieButton.on('pointerover', () =>{
            this.dieButton.setScale(1.15);
            this.dieButton.setColor('#edd35f');
        });
        this.dieButton.on('pointerout', () => {
            this.dieButton.setScale(1);
            this.dieButton.setColor('#ffffff');
        });
        this.dieButton.on('pointerdown', () =>{
            window.localStorage.removeItem('stage');
            //window.localStorage.setItem('deathCount');
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
                this.player.setVelocityY(-330);
            }
            else if (!this.player.body.touching.down){
                this.player.anims.play('jump');//find way to stop if after bounce? //no bounce?
            }
    }
}
