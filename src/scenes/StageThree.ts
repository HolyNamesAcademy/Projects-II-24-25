import { Scene } from 'phaser';
import makeButton from '../utils/makeButton';

const puzzleDimensions = [5, 2];
const maxTime = 10;
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Cell = {
    x: number;
    y: number;
    state: 'white' | 'red' | 'green';
    value: number;
};

enum GameState {
    Playing,
    Lost,
    Won,
}

export class StageThree extends Scene {
    parent: Phaser.GameObjects.Zone;
    width: number;
    height: number;

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    numbers: Phaser.Physics.Arcade.StaticGroup;
    clock: Phaser.GameObjects.Text;
    reset: Phaser.GameObjects.Text;
    win: Phaser.GameObjects.Text;

    currentNumber: number;
    startTime: number;
    timesLost: number;

    puzzle: Cell [][];
    gameState = GameState.Playing;

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

        this.createPuzzle();
        this.renderPuzzle();
        this.timesLost = 0;

        this.clock = this.add.text(300, 350, '0:20', {
            fontFamily: 'MedievalSharp', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center',
        }).setOrigin(0.5);

        this.reset = makeButton(this, 'Reset', 40, 150, 350, () => {
            this.reset.setVisible(false);
            this.gameState = GameState.Playing;
            this.numbers.clear(true, true);
            this.createPuzzle();
            this.renderPuzzle();
        }).setVisible(false);

        this.win = makeButton(this, 'Key', 40, 500, 350, () => {
            this.events.emit('passBoolean', true);
            this.scene.remove();
        }).setVisible(false);
    }

    createPuzzle() {
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

        this.puzzle = puzzle as Cell [][];
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
                        this.currentNumber++;
                        console.log('green');
                    }
                    else {
                        cell.state = 'red';
                        console.log('red');
                        this.lostPuzzle();
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
                if (this.gameState == GameState.Lost) {
                    number.setFrame(cell.value * 3 - 1);
                }
                else if (cell.state == 'white') {
                    number.setFrame(cell.value * 3 - 3);
                }
                else if (cell.state == 'green') {
                    number.setFrame(cell.value * 3 - 2);
                }
                else if (cell.state == 'red') {
                    number.setFrame(cell.value * 3 - 1);
                }
            });
        });
    }

    lostPuzzle() {
        this.clock.setText('0:00');
        this.gameState = GameState.Lost;
        this.updatePuzzle();
        this.timesLost++;
        this.reset.setVisible(true);
    }

    wonPuzzle() {
        this.gameState = GameState.Won;
        this.clock.setText('You won!');
        this.win.setVisible(true);
    }

    update() {
        if (this.gameState != GameState.Playing) {
            return;
        }

        const currentTime = Date.now();
        const time = maxTime - Math.floor((currentTime - this.startTime) / 1000);
        const formattedTime = String(time).padStart(2, '0');

        if (time >= 0) {
            this.clock.setText('0:' + formattedTime);
        }
        else {
            this.lostPuzzle();
        }

        if (this.currentNumber == puzzleDimensions[0] * puzzleDimensions[1] + 1) {
            this.wonPuzzle();
        }
    }
}
