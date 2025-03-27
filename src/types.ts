export interface GameProgress {
    coordinates: { x: number; y: number };
    scrollPosition: number;
    skills: {
        doubleJump: boolean;
        climb: boolean;
    };
    character: string;
    keys: {
        winKey: boolean;
        door2Key: boolean;
        trapdoor1Key: boolean;
    };
    inventory: {
        finalKey: boolean;
    };
}

export interface LayoutObject {
    type: string;
    x: number;
    y: number;
    scale?: number;
    verticalOffset?: number;
    nextScene?: string;
    key?: 'winKey' | 'door2Key' | 'trapdoor1Key';
}

export interface Layout {
    objects: LayoutObject [];
}

export interface LockableObject {
    key?: 'winKey' | 'door2Key' | 'trapdoor1Key';
    object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
}
