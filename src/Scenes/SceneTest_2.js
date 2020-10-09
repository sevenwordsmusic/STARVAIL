//Zona de declaración de variables.
//Variables de la camara.

//Mirar luego para temas de camara
var cam;
var mouse
//var firstFollow;
//var fadeOut;

//Imports en la escena.
import Player from "../PlayerStuff/Player.js";

//Clase Scene2, que extiende de Phaser.Scene.
export default class SceneTest_2 extends Phaser.Scene {
  constructor() {
    super("test2");
  }

  preload() {

    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    this.load.spritesheet('androidRun', 'assets/Sprites/Player/male_android_running.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('androidIdle', 'assets/Sprites/Player/male_android_idle.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('androidJumpUp', 'assets/Sprites/Player/male_android_jumping_up.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('androidJumpDown', 'assets/Sprites/Player/male_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });

    this.load.image('bg_e', 'assets/Backgrounds/Sky/SkyBG.png');
    this.load.image('bg1_e', 'assets/Backgrounds/Sky/CloudsFar.png');
    this.load.image('bg2_e', 'assets/Backgrounds/Sky/CloudsMid.png');
    this.load.image('bg3_e', 'assets/Backgrounds/Sky/CloudsClose.png');

    this.load.image("tiles2", "../assets/Tilesets/Tileset_central_electrica.png");
    this.load.tilemapTiledJSON("map2", "../assets/Mapas/Electrical_medium.json");

  }
  //Función create, que crea los elementos del propio juego.
  create() {
    console.log(this);
    mouse = this.input.activePointer;
    //ANIMS
    this.anims.create({
        key: 'wRight',
        frames: this.anims.generateFrameNumbers('androidRun', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('androidIdle', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'jumpUp',
        frames: this.anims.generateFrameNumbers('androidJumpUp', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'jumpDown',
        frames: this.anims.generateFrameNumbers('androidJumpDown', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });
    //ANIMS


    this.shouldBeActive = true;
    //fadeOut = false;

    //Música. POR SI QUEREMOS MÚSICA
    /*
    this.game.currentMusic.stop();
    this.game.currentMusic = this.sound.add('theme', { loop: true, volume: this.game.musicVolume });
    this.game.currentMusic.play();
    */

    //Backgrounds.
    //Backgrounds.
    this.add.image(400, 300, 'sky');
    this.add.image(480, 270, 'bg_e').setScrollFactor(0).setDepth(-503);
    this.add.image(1300, 290, 'bg1_e').setScale(2).setScrollFactor(0.25).setDepth(-502);
    this.add.image(1100, 320, 'bg2_e').setScale(2).setScrollFactor(0.5).setDepth(-501);
    this.add.image(1200, 400, 'bg3_e').setScale(2).setScrollFactor(0.75).setDepth(-500);

    //Inicializacion y creacion de mapa de tiles.
    const map2 = this.make.tilemap({ key: "map2" });
    const tileset2 = map2.addTilesetImage("electrical_tileset", "tiles2");

    //Capas de tiles.
    const layerminus2 = map2.createStaticLayer("background_layer_-2depth", tileset2, 0, 0);
    layerminus2.depth = -20;
    const layerminus1 = map2.createStaticLayer("deco_layer_-1depth", tileset2, 0, 0);
    layerminus1.depth = -10;
    const baselayer = map2.createStaticLayer("base_layer_0depth", tileset2, 0, 0);
    baselayer.depth = -5;
    const lethallayer = map2.createStaticLayer("lethal_layer_0depth", tileset2, 0, 0);
    lethallayer.depth = -5;

    //Colisiones de las capas.
    layerminus1.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(layerminus1);
    baselayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(baselayer);
    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    //Generamos las teclas y las añadimos a cada jugador androide, creándolos.
    var cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S });
    this.game.player = new Player(this, 300, 300, cursors);
    console.log(this.game.player);

    //Colisiones con los jugadores androides.
    this.matterCollision.addOnCollideStart({
      objectA: this.game.player.mainBody,
      callback: lethalCollide,
      context: this.game.player
    });

    //Función lethalCollide, que comprueba si la colisión con los pinchos ha sido letal.
    function lethalCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
      const tile = gameObjectB;
      if (tile.properties.lethal) {
        //this.damaged(new Phaser.Math.Vector2(this.sprite.x - gameObjectB.x, -(this.sprite.y - gameObjectB.y)), 60);
        console.log("damage");
      }
    }

    /*
    //Colisiones con los jugadores androides.
    for (var i = 0; i < orangeRays.length; i++) {
      //Cambiamos el collider.
      orangeRays[i].setRectangle(16, 32);
      if (i >= 11)
        orangeRays[i].setAngle(90);
      orangeRays[i].setStatic(true).setSensor(true);
      this.matterCollision.addOnCollideStart({
        objectA: this.game.player.mainBody,
        objectB: orangeRays[i],
        callback: inflictDamage,
        context: this.game.player
      });
    }*/

    //Camara.
        cam = this.cameras.main;
        this.matter.world.setBounds(0, -500, 1000, 1000);
        cam.setBounds(0, 0, 1000, 1000);
        cam.startFollow(this.game.player, false, 0.05, 0.01, 0, 0);
  }

  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //humanInteractableItems.update(time, delta);
  }
}
