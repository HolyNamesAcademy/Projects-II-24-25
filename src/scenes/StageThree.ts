import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';

const puzzleDimensions = [5, 2];
const maxTime = 20;
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Cell = {
    x: number;
    y: number;
    state: 'white' | 'red' | 'green';
    value: number;
};

export class StageThree extends Scene {
    parent: Phaser.GameObjects.Zone;
    width: number;
    height: number;

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    numbers: Phaser.Physics.Arcade.StaticGroup;
    puzzle: Cell[][];
    currentNumber: number;
    clock: Phaser.GameObjects.Text;
    reset: Phaser.GameObjects.Text;
    startTime: number;
    lost: boolean;
    timesLost: number;

    constructor(key: string = 'StageThree', parent: Phaser.GameObjects.Zone, width: number, height: number) {
        super(key);
        this.parent = parent;
        this.width = width;
        this.height = height;
    }

    create() {
        window.localStorage.setItem('stage', '3');
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.camera.setViewport(this.parent.x - this.width / 2, this.parent.y - this.height / 2, this.width, this.height);

        this.puzzle = this.createPuzzle();
        this.renderPuzzle();
        this.timesLost = 0;

        this.clock = this.add.text(300, 350, '0:20', {
            fontFamily: 'MedievalSharp', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center',
        }).setOrigin(0.5);
    }

    createPuzzle(): Cell[][] {
        const shuffledNumbers = numbers
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        const puzzle = [];
        for (let i = 0; i < puzzleDimensions[0]; i++) {
            const row = [];
            for (let j = 0; j < puzzleDimensions[1]; j++) {
                row.push({
                    x: i,
                    y: j,
                    state: 'white',
                    value: shuffledNumbers[i * puzzleDimensions[1] + j],
                });
            }
            puzzle.push(row);
        }
        this.currentNumber = 1;
        this.startTime = Date.now();
        return puzzle as Cell [][];
    }

    renderPuzzle() {
        this.numbers = this.physics.add.staticGroup();

        this.puzzle.forEach((row, i) => {
            row.forEach((cell, j) => {
                const number = this.numbers.create(100 + i * 100, j * 100 + 125, 'Numbers', cell.value * 3 - 3);
                number.setInteractive();
                number.setScale(4);
                number.refreshBody();
                number.on('pointerdown', () => {
                    if (this.currentNumber == cell.value) {
                        cell.state = 'green';
                        console.log('green');
                        this.currentNumber++;
                    }
                    else {
                        cell.state = 'red';
                        console.log('red');
                    }
                    this.updatePuzzle();
                });
            });
        });
    }

    updatePuzzle() {
        const numbers = this.numbers.getChildren();
        this.puzzle.forEach((row, i) => {
            row.forEach((cell, j) => {
                const number = numbers[puzzleDimensions[1] * i + j] as Phaser.Physics.Arcade.Sprite;
                if (this.lost) {
                    number.setFrame(cell.value * 3 - 1);
                }
                else if (cell.state == 'green') {
                    number.setFrame(cell.value * 3 - 2);
                }
                else if (cell.state == 'red') {
                    number.setFrame(cell.value * 3 - 1);
                    this.lostPuzzle();
                }
            });
        });
    }

    lostPuzzle() {
        this.clock.setText('0:00');
        this.lost = true;
        this.updatePuzzle();
        this.timesLost++;
        makeButton(this, 'Reset', 40, 150, 350, () => {
            this.lost = false;
            this.createPuzzle();
            // this.updatePuzzle();
        });
    }

    update() {
        const currentTime = Date.now();
        const time = maxTime - Math.floor((currentTime - this.startTime) / 1000);
        const formattedTime = String(time).padStart(2, '0');
        if (time >= 0) {
            this.clock.setText('0:' + formattedTime);
        }
        else {
            this.lostPuzzle();
        }
    }
}
