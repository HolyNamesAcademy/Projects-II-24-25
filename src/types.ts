export interface GameProgress {
  coordinates: { x: number; y: number };
  scrollPosition: number;
  skills: {
    doubleJump: boolean;
    climb: boolean;
  }
  character: "addison";
}
