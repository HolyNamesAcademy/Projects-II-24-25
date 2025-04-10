import { SharedGameCode } from './SharedGameCode';
// import makeButton from '../utils/makeButton';
import { Layout } from '../types';
// import { Puzzle } from './Puzzle';

const layout: Layout = {
    objects: [
        { type: 'platform', x: 200, y: 200 },
        { type: 'door', x: 200, y: 0, name: 'StageTwoDoor', next: { scene: 'MainLevel', coordinates: { x: 219, y: 468 }, scrollPosition: 660 } },
    ],
};

export class StageTwo extends SharedGameCode {
    constructor() {
        super('StageTwo');
        this.layout = layout;
    }

    create() {
        super.create();
    }
}
