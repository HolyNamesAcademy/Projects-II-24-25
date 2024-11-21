import {Scene} from "phaser";

export default function makeButton(
    game: Scene, 
    text: String,
    size: number,
    positionX: number, 
    positionY: number,
    click () => void 
    ): Phaser.GameObjects.Text {
        const button = game.add.text(positionX, positionY, text, {
            fontFamily: 'MedievalSharp', size, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
    
        button.setInteractive();
        button.on('pointerover', () =>{
            button.setScale(1.15);
            button.setColor('#edd35f');
        });
        button.on('pointerout', () => {
            button.setScale(1);
            button.setColor('#ffffff');
        });
        button.on('pointerdown', click);
    
        return button;
    }