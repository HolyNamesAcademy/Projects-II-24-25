import { SharedGameCode } from './SharedGameCode';
import { Layout, Key } from '../types';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 300 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 1150, y: 0 },
        { type: 'door', x: 200, y: 0, key: Key.WIN_KEY, name: 'FinalDoor', next: { scene: 'WinScene', coordinates: { x: 10, y: 30 }, scrollPosition: 10 } },
        { type: 'vine', x: 700, y: 0 },
        { type: 'vine', x: 700, y: 0, verticalOffset: 24 },

        { type: 'platform', x: 350, y: 400 },
        { type: 'platform', x: 900, y: 0 },
        { type: 'spikes', x: 930, y: 0 }, // used to be x:920
        { type: 'vine', x: 200, y: 0 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 },

        { type: 'platform', x: 550, y: 400 },
        { type: 'platform', x: 200, y: 0 },
        { type: 'platform', x: 700, y: 0 },
        { type: 'door', x: 150, y: 0, key: Key.DOOR2_KEY, name: 'StageTwoDoor', next: { scene: 'StageTwo', coordinates: { x: 264, y: 468 }, scrollPosition: 410 } },
        { type: 'keyPedestal', x: 600, y: 0, key: Key.DOOR2_KEY },
    ],
};

export class MainLevel extends SharedGameCode {
    constructor() {
        super('MainLevel');
        this.layout = layout;
    }
}
