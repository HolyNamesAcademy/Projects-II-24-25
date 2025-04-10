export interface GameProgress {
    scene: 'MainLevel' | 'StageTwo' | 'VideoIntro' | 'WinScene' | 'DeathScreen';
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
    doorLocks: Record<string, boolean>;
    inventory: {
        finalKey: boolean;
    };
}

export enum Key {
    WIN_KEY = 'winKey',
    DOOR2_KEY = 'door2Key',
    TRAPDOOR1_KEY = 'trapdoor1Key',
}

export type LayoutObject = {
    type: string;
    x: number;
    y: number;
    scale?: number;
    verticalOffset?: number;
    next?: TransitionObject;
    key?: Key;
    name?: string;
};

export interface Layout {
    objects: LayoutObject [];
}

export interface LockableObject {
    next?: TransitionObject;
    key?: Key;
    object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
}

export interface PuzzleObject {
    key?: Key;
    object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
}

export interface TransitionObject {
    scene: 'StageTwo' | 'VideoIntro' | 'WinScene' | 'MainLevel';
    coordinates: { x: number; y: number };
    scrollPosition: number;
}
