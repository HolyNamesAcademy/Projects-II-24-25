import { SharedGameCode } from './SharedGameCode';
import { Layout, Key } from '../types';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 150, y: 100 },
        { type: 'platform', x: 1000, y: 0 },
        { type: 'platform', x: 700, y: 0 },
        { type: 'vine', x: 850, y: 0, verticalOffset: 0 },
        { type: 'vine', x: 850, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 850, y: 0, verticalOffset: 48 },

        { type: 'platform', x: 200, y: 500 },
        { type: 'platform', x: 1000, y: 0 },
        { type: 'door', x: 200, y: 0, name: 'StageTwoDoor', next: { scene: 'MainLevel', coordinates: { x: 219, y: 468 }, scrollPosition: 660 } },
        { type: 'vine', x: 50, y: 0 },
        { type: 'vine', x: 50, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 200, y: 0 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 200, y: 0, verticalOffset: 48 + 24 },
        { type: 'vine', x: 250, y: 0 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 + 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 + 24 + 24 },
        { type: 'vine', x: 250, y: 0, verticalOffset: 48 + 24 + 24 + 24 },

        { type: 'keyPedestal', x: 950, y: 0, key: Key.WIN_KEY },
        { type: 'vine', x: 840, y: 0 },
        { type: 'vine', x: 840, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 990, y: 0 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 72 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 96 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 120 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 144 },
        { type: 'vine', x: 990, y: 0, verticalOffset: 168 },

        { type: 'wall', x: 780, y: 100 },
        { type: 'wall', x: 780, y: 0, verticalOffset: 100 },

        { type: 'platform', x: 290, y: 700 },
        { type: 'platform', x: 600, y: 0 },
        { type: 'platform', x: 730, y: 0 },
        // { type: 'spikes', x: 50, y: 0 },
        { type: 'spikes', x: 170, y: 0 },
        { type: 'spikes', x: 250, y: 0 },
        { type: 'spikes', x: 350, y: 0 },
        { type: 'spikes', x: 450, y: 0 },
        { type: 'spikes', x: 550, y: 0 },
        { type: 'spikes', x: 650, y: 0 },
        { type: 'spikes', x: 750, y: 0 },
        { type: 'spikes', x: 850, y: 0 },
        // { type: 'spikes', x: 950, y: 0 },
        { type: 'vine', x: 170, y: 0 },
        { type: 'vine', x: 170, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 370, y: 0 },
        { type: 'vine', x: 370, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 370, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 570, y: 0 },
        { type: 'vine', x: 570, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 570, y: 0, verticalOffset: 48 },
        { type: 'vine', x: 770, y: 0 },
        { type: 'vine', x: 770, y: 0, verticalOffset: 24 },
        { type: 'vine', x: 770, y: 0, verticalOffset: 48 },

        { type: 'platform', x: -10, y: 400 },
    ],

};

export class StageTwo extends SharedGameCode {
    constructor() {
        super('StageTwo');
        this.layout = layout;
    }
}
