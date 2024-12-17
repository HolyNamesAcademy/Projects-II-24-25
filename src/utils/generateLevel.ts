import { Layout, LayoutObject } from '../types';
import { Scene } from 'phaser';

export default function generateLevel(
    game: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    layout: Layout,
) {
    const vines: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[] = [];
    const doors: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[] = [];
    let currentY = 0;
    layout.objects.forEach((object: LayoutObject) => {
        const { x, y, type } = object;
        currentY += y;
        if (type === 'platform') {
            platforms.create(x, currentY, type);
        }
        else if (type === 'vine') {
            const vine = game.physics.add.staticSprite(x, currentY, 'vine', 0)
                .setScale(5)
                .setOrigin(0.5, 0);
            vine.anims.play('vine');
            vines.push(vine);
        }
        else if (type === 'door') {
            const door = game.physics.add.staticSprite(x, currentY, 'door', 0)
                .setOrigin(0.5, 1);
            doors.push(door);
        }
        else if (type === 'trapdoor') {
            const trapdoor = game.physics.add.staticSprite(x, currentY, 'trapdoor', 0)
                .setOrigin(0.5, 1);
            doors.push(trapdoor);
        }
    });
    return { vines, doors };
}
