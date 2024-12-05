import { Layout, LayoutObject } from '../types';

export default function generatePlatforms(
    platforms: Phaser.Physics.Arcade.StaticGroup,
    layout: Layout,
) {
    let currentY = 0;
    layout.platforms.forEach((platform: LayoutObject) => {
        const { x, y, type } = platform;
        currentY += y;
        platforms.create(x, currentY, type);
    });
}
