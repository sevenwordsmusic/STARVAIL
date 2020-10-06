"use strict";

//todas las clases necesarias (incluyendo todas las escenas-modulos)
import Player from "./PlayerStuff/Player.js";
import SceneLoading from "./Scenes/SceneLoading.js";
import SceneTest_1 from "./Scenes/SceneTest_1.js";
import SceneTest_2 from "./Scenes/SceneTest_2.js";

//Configuración de Phaser 3
var config = {
    type: Phaser.AUTO,
    //Dimensiones de la ventana de juego (ancho y alto)
    width: 960,
    height: 540,
    audio: {
      disableWebAudio: true
    },
    //Físicas del juego
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.98 },
            debug: true
        }
    },
    //escenas principales
    scene: [
      SceneLoading,
      SceneTest_1,
      SceneTest_2
    ],
	plugins: {
    //plugin de collisiones de matter  https://github.com/mikewesthad/phaser-matter-collision-plugin
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  }
};

//Declaramos nuestro juego
var game = new Phaser.Game(config);

//Declaramos variables globales del juego.
game.musicVolume = 0.3;
game.soundVolume = 0.2;
game.moveVelocity = 0.215;
game.jetVelocity = 0.215;
game.airVelocityFraction = 0.3;

game.bulletInteracBodies = [];
game.enemyBodies = [];
