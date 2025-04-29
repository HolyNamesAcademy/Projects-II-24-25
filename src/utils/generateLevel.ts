import { Layout, LayoutObject, LockableObject, PuzzleObject } from '../types';
import { Scene } from 'phaser';

export default function generateLevel(
    game: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    walls: Phaser.Physics.Arcade.StaticGroup,
    layout: Layout,
) {
    const vines: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[] = [];
    const doors: LockableObject[] = [];
    const pedestals: PuzzleObject[] = [];
    const spikes: Phaser.Types.Physics.Arcade.SpriteWithStaticBody [] = [];
    let currentY = 0;
    layout.objects.forEach((object: LayoutObject) => {
        const { x, y, type, verticalOffset, key, next, name } = object;
        currentY += y;
        if (type === 'platform') {
            platforms.create(x, currentY, 'platform', 0)
                .setOrigin(0.5, 0)
                .setScale(4)
                .refreshBody();
        }
        else if (type === 'wall') {
            let wallY = currentY;
            if (verticalOffset != null) {
                wallY += verticalOffset;
            }
            walls.create(x, wallY, 'wall', 0)
                .setOrigin(0.5, 0)
                .setScale(2.5)
                .refreshBody();
        }
        else if (type === 'vine') {
            let vineY = currentY;
            if (verticalOffset != null) {
                vineY += verticalOffset * 5;
            }
            const vine = game.physics.add.staticSprite(x, vineY, 'vine', 0)
                .setScale(5)
                .refreshBody()
                .setOrigin(0.5, 0);
            vine.anims.play('vine');
            vines.push(vine);
        }
        else if (type === 'door') {
            const door = game.physics.add.staticSprite(x, currentY, 'door', 0)
                .setOrigin(0.5, 1)
                .setScale(5.5)
                .refreshBody()
                .setInteractive();
            door.body?.setSize(110, 200, false);
            if (!name) {
                throw new Error(`Door name is required: ${JSON.stringify(object)}`);
            }
            door.setName(name);
            doors.push({
                next: next,
                key: key,
                object: door,
            });
        }
        else if (type === 'trapdoor') {
            const trapdoor = game.physics.add.staticSprite(x, currentY, 'trapdoor', 0)
                .setOrigin(0.5, 1);
            if (!name) {
                throw new Error(`Trapdoor name is required: ${JSON.stringify(object)}`);
            }
            trapdoor.setName(name);
            doors.push({
                key: key,
                object: trapdoor,
            });
        }
        else if (type === 'keyPedestal') {
            const pedestal = game.physics.add.staticSprite(x, currentY, 'keyPedestal', 2)
                .setOrigin(0.5, 1)
                .setScale(2)
                .refreshBody()
                .setInteractive();
            pedestal.anims.play('keyPedestal');
            pedestals.push({
                key: key,
                object: pedestal,
            });
        }
        else if (type === 'spikes') {
            const spike = game.physics.add.staticSprite(x, currentY, 'spikes', 0)
                .setOrigin(0.5, 1)
                .setInteractive()
                .setScale(3)
                .refreshBody();
            spikes.push(spike);
        }
    });
    return { vines, doors, pedestals, spikes };
}
