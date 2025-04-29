import { Boot } from './scenes/Boot';
import { MainLevel } from './scenes/MainLevel';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { CharacterSelection } from './scenes/CharacterSelection';
import { DeathScreen } from './scenes/DeathScreen';
import { StageTwo } from './scenes/StageTwo';
import { Puzzle } from './scenes/Puzzle';
import { WinScene } from './scenes/WinScene';
import { VideoIntro } from './scenes/VideoIntro';

import { Game, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isSmallScreen = window.innerWidth < 1024; // Consider screens smaller than game width as small
const extraHeight = (isMobile || isSmallScreen) ? 768 : 0; // Add 150px extra height for controls on mobile or small screens

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768 + extraHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        activePointers: 3, // Enable multitouch support
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
        MainLevel,
        GameOver,
        CharacterSelection,
        DeathScreen,
        StageTwo,
        Puzzle,
        WinScene,
    ],
};

export default new Game(config);
