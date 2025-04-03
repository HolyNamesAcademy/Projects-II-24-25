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
    nextScene?: 'StageTwo' | 'VideoIntro' | 'WinScene';
    key?: 'winKey' | 'door2Key' | 'trapdoor1Key';
}

export interface Layout {
    objects: LayoutObject [];
}

export interface LockableObject {
    nextScene?: 'StageTwo' | 'VideoIntro' | 'WinScene';
    key?: 'winKey' | 'door2Key' | 'trapdoor1Key';
    object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
}

export interface PuzzleObject {
    key?: 'winKey' | 'door2Key' | 'trapdoor1Key';
    object: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
}

export interface TransitionObject {
    scene: 'StageTwo' | 'VideoIntro' | 'WinScene' | 'MainLevel';
    coordinates: { x: number; y: number };
    scrollPosition: number;
}
