export interface GameProgress {
    coordinates: { x: number; y: number };
    scrollPosition: number;
    skills: {
        doubleJump: boolean;
        climb: boolean;
    };
    character: string;
}

export interface LayoutObject {
    type: string;
    x: number;
    y: number;
    scale?: number;
    verticalOffset?: number;
    nextScene?: string;
}

export interface Layout {
    objects: LayoutObject [];
}
