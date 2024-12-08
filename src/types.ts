export interface GameProgress {
    coordinates: { x: number; y: number };
    scrollPosition: number;
    skills: {
        doubleJump: boolean;
        climb: boolean;
    };
    character: 'addison';
}

export interface LayoutObject {
    type: string;
    x: number;
    y: number;
    scale?: number;
}

export interface Layout {
    platforms: LayoutObject [];
}
