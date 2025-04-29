export default function getDoorCenterTop(door: Phaser.Types.Physics.Arcade.SpriteWithStaticBody): Phaser.Math.Vector2 {
    const doorBounds = door.getBounds();
    const doorCenter = new Phaser.Math.Vector2(doorBounds.centerX - doorBounds.width / 4, doorBounds.top);
    return doorCenter;
}
