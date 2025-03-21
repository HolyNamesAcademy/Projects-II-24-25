import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { CharacterSelection } from './scenes/CharacterSelection';
import { DeathScreen } from './scenes/DeathScreen';
import { StageTwo } from './scenes/StageTwo';
import { StageThree } from './scenes/StageThree';
import { WinScene } from './scenes/WinScene';
import { VideoIntro } from './scenes/VideoIntro';

import { Game, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 550 },
            debug: window.location.hostname === 'localhost',
        },
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        VideoIntro,
        MainGame,
        GameOver,
        CharacterSelection,
        DeathScreen,
        StageTwo,
        StageThree,
        WinScene,
    ],
};

export default new Game(config);
