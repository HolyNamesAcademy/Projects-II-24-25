import { Layout, LayoutObject } from '../types';
import { Scene } from 'phaser';

export default function generateLevel(
    game: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    layout: Layout,
) {
    const vines: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[] = [];
    const doors: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[] = [];
    const pedestals: Phaser.Types.Physics.Arcade.SpriteWithStaticBody [] = [];
    let currentY = 0;
    layout.objects.forEach((object: LayoutObject) => {
        const { x, y, type, verticalOffset } = object;
        currentY += y;
        if (type === 'platform') {
            platforms.create(x, currentY, type)
                .setOrigin(0.5, 0);
        }
        else if (type === 'vine') {
            let vineY = currentY;
            if (verticalOffset != null) {
                vineY += verticalOffset * 5;
            }
            const vine = game.physics.add.staticSprite(x, vineY, 'vine', 0)
                .setScale(5)
                .setOrigin(0.5, 0);
            vine.anims.play('vine');
            vines.push(vine);
        }
        else if (type === 'door') {
            const door = game.physics.add.staticSprite(x, currentY, 'door', 0)
                .setOrigin(0.5, 1)
                .setScale(5.5);
            doors.push(door);
        }
        else if (type === 'trapdoor') {
            const trapdoor = game.physics.add.staticSprite(x, currentY, 'trapdoor', 0)
                .setOrigin(0.5, 1);
            doors.push(trapdoor);
        }
        else if (type === 'keyPedestal') {
            const pedestal = game.physics.add.staticSprite(x, currentY, 'keyPedestal', 2)
                .setOrigin(0.5, 1)
                .setScale(2)
                .setInteractive();
            pedestal.anims.play('keyPedestal');
            pedestals.push(pedestal);
        }
    });
    return { vines, doors, pedestals };
}
