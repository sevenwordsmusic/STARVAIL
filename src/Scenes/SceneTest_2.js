//Zona de declaración de variables.
//Variables de la camara.

//Mirar luego para temas de camara
var cam;
var mouse;
//var firstFollow;
//var fadeOut;


//Texto prueba para el dialogo
var content = 'En un futuro lejano y una tierra cuyo nombre se ha olvidado, una torre se alza hasta lo alto del cielo. Se dice que aquellos individuos que se vean infectados por el virus de la angustia existencial peregrinarán a esta torre, con la intención de llegar a su cima y hallar el sentido a su vida inmortal';

//Imports en la escena.
import Player from "../PlayerStuff/Player.js";
import Dummy from "../Enemies/Dummy.js";
import Dialog from "../Plugins/Dialog.js"
import Joystick_test from "./Joystick_test.js"

//Clase Scene2, que extiende de Phaser.Scene.
export default class SceneTest_2 extends Phaser.Scene {
  static #count = 0;
  static addNumber(){
    SceneTest_2.#count = (SceneTest_2.getNumber() + 1)%5 ;
  }
  static getNumber(){
    return SceneTest_2.#count;
  }
  constructor() {
    super('testsec' + (SceneTest_2.getNumber() + 1));
    SceneTest_2.addNumber();
  }
  preload(){
    Dialog.preloadToScene(this);
  }

  //Función create, que crea los elementos del propio juego.
  create() {
    /*this.game.anims.remove('wRight');
    this.anims.create({
        key: 'wRight',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: -1
    });*/
    console.log(this);
    //game.matter.world.pause();
    mouse = this.input.activePointer;

    //Camara.
    cam = this.cameras.main;
    cam.setBackgroundColor('rgba(150, 174, 191, 1)');
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, -500, 10000, 1435);

    cam.fadeIn(1250);
    //fadeOut = false;

    /*//TESTING DIALOG
    var dialogTest = new Dialog(this, 100, 400, {
      wrapWidth: 500,
      fixedWidth: 500,
      fixedHeight: 65,
    });

    dialogTest.textBox.start(content,10);*/


    //Música. POR SI QUEREMOS MÚSICA
    /*
    this.game.currentMusic.stop();
    this.game.currentMusic = this.sound.add('theme', { loop: true, volume: this.game.musicVolume });
    this.game.currentMusic.play();
    */

    //Backgrounds.
    //this.add.image(480, 270, 'bg_e').setScrollFactor(0).setDepth(-503);
    //this.add.image(1300, 290, 'bg1_e').setScale(2).setScrollFactor(0.25).setDepth(-502);
    //this.add.image(1100, 320, 'bg2_e').setScale(2).setScrollFactor(0.5).setDepth(-501);
    //this.add.image(1200, 400, 'bg3_e').setScale(2).setScrollFactor(0.75).setDepth(-500);

    this.timeBg = this.add.sprite(480, 100/*270*/, 'animatedBg').setScrollFactor(0).setDepth(-500).anims.play('bgAnimation',true, this.game.currentBgAnimation);
    this.timeBg.once('animationcomplete', function(){
      if(this.timeBg.anims.currentFrame != undefined)
        this.game.currentBgAnimation = this.timeBg.anims.currentFrame.index-1;
      this.game.transitionToScene(this, 'Joystick', Joystick_test)
    },this);

    //Inicializacion y creacion de mapa de tiles.
    const map = this.make.tilemap({ key: "map2" });
    /*const tileset1 = map.addTilesetImage("Cyber_Tiles_1", "tiles1", 32, 32, 1, 2);
    const tileset2 = map.addTilesetImage("Cyber_Tiles_2", "tiles2", 32, 32, 1, 2);
    const tileset3 = map.addTilesetImage("Cyber_Tiles_3", "tiles3", 32, 32, 1, 2);*/
    const tilessetTest = map.addTilesetImage("1. main platforms", "tiles1", 32, 32, 0, 0);
    //Capas de tiles.
    const baselayer = map.createDynamicLayer("Base Layer", tilessetTest, 600, 0);
    baselayer.depth = -5;
    //const frontlayer = map.createDynamicLayer("Front Layer", [tileset1, tileset2, tileset3], 600, 0);
    //frontlayer.depth = 25;
    //const background1 = map.createDynamicLayer("Background 1", [tileset1, tileset2, tileset3], 600, 0);
    //background1.depth = -25;
    //const background2 = map.createStaticLayer("Background 2", [tileset1, tileset2, tileset3], 200, 0);
    //background2.depth = -30;
    //Colisiones de las capas.
    //layerminus1.setCollisionByProperty({ Collides: true });
    //this.matter.world.convertTilemapLayer(layerminus1);
    baselayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(baselayer);
    //Sistema de cargado dinamico de colliders
    var tileBodyMatrix = [];
    for (var i = 0; i < 240; i++) {
      tileBodyMatrix[i] = [];
      for (var j = 0; j < 20; j++) {
        tileBodyMatrix[i][j] = undefined;
      }
    }
    this.bulletInteracBodies = [];
    var counerAux = 0;
    baselayer.forEachTile(function (tile) {
      //tile.setSize
      if (tile.physics.matterBody != undefined) {
        const tileBody = tile.physics.matterBody.body;
        if (tileBody.position.x < 2000 /*&& tileBody.position.x > 1856 && tileBody.position.y < 576 && tileBody.position.y > -512*/) {
          tileBodyMatrix[Math.floor(tileBody.position.x / 32)][Math.floor(tileBody.position.y / 32)] = new BodyWrapper(tileBody, true);
          //Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        } else {
          tileBodyMatrix[Math.floor(tileBody.position.x / 32)][Math.floor(tileBody.position.y / 32)] = new BodyWrapper(tileBody, false);
          Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        }
        this.bulletInteracBodies[counerAux] = tile.physics.matterBody.body;
        counerAux++;
      }
      tile.x += 120;
    }, this);

    this.tileBodyMatrix = new Proxy(tileBodyMatrix, {
      get(target, prop) {
        return target[Math.max(0, prop)];
      }
    });

    //Generamos las teclas y las añadimos al jugador androide, creándolos.
    new Player(this, 900, 700);
    cam.startFollow(this.game.player.sprite, false, 0.1, 0.1, 0, 0);
    new Dummy(this, 900, 100);
    new Dummy(this, 800, 100);
    new Dummy(this, 1000, 100);
    //var sssd = new HealthBar(this, 400, 400, 300, 20, 0x00ff00, 0x000000, 0xffffff, 100);
    //Colisiones del escneario con el jugador
    /*this.matterCollision.addOnCollideStart({
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
    }*/

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


    this.input.setDefaultCursor('none');
    /*var keyObj = this.input.keyboard.addKey('K');  // Get key object
    keyObj.on('down', function(event) { console.log("k presionada"); });*/
  }
  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
  }
}
/*this.cameras.remove(this.cameras.main)
cam = new CameraTest(0,0);
cam.setScene(this);
this.cameras.addExisting(cam);*/
/*class CameraTest extends Phaser.Cameras.Scene2D.Camera{
  constructor(x,y){
    super(x,y,960,540);
  }
  preRender(resolution){
    var width = this.width;
    var height = this.height;

    var halfWidth = width * 0.5;
    var halfHeight = height * 0.5;

    var zoom = this.zoom * resolution;
    var matrix = this.matrix;

    var originX = width * this.originX;
    var originY = height * this.originY;

    var follow = this._follow;
    var deadzone = this.deadzone;

    var sx = this.scrollX;
    var sy = this.scrollY;

    if (deadzone)
    {
        CenterOn(deadzone, this.midPoint.x, this.midPoint.y);
    }

    if (follow && !this.panEffect.isRunning)
    {
        var fx = (follow.x - this.followOffset.x);
        var fy = (follow.y - this.followOffset.y);

        if (deadzone)
        {
            if (fx < deadzone.x)
            {
                sx = Phaser.Math.Linear(sx, sx - (deadzone.x - fx), this.lerp.x);
            }
            else if (fx > deadzone.right)
            {
                sx = Phaser.Math.Linear(sx, sx + (fx - deadzone.right), this.lerp.x);
            }

            if (fy < deadzone.y)
            {
                sy = Phaser.Math.Linear(sy, sy - (deadzone.y - fy), this.lerp.y);
            }
            else if (fy > deadzone.bottom)
            {
                sy = Phaser.Math.Linear(sy, sy + (fy - deadzone.bottom), this.lerp.y);
            }
        }
        else
        {
            sx = Phaser.Math.Linear(sx, fx - originX, this.lerp.x);
            sy = Phaser.Math.Linear(sy, fy - originY, this.lerp.y);
        }
    }

    if (this.useBounds)
    {
        sx = this.clampX(sx);
        sy = this.clampY(sy);
    }

    if (this.roundPixels)
    {
        originX = Math.round(originX);
        originY = Math.round(originY);
    }

    //  Values are in pixels and not impacted by zooming the Camera
    this.scrollX = sx;
    this.scrollY = sy;

    var midX = sx + halfWidth;
    var midY = sy + halfHeight;

    //  The center of the camera, in world space, so taking zoom into account
    //  Basically the pixel value of what it's looking at in the middle of the cam
    this.midPoint.set(midX, midY);

    var displayWidth = width / zoom;
    var displayHeight = height / zoom;

    this.worldView.setTo(
        midX - (displayWidth / 2),
        midY - (displayHeight / 2),
        displayWidth,
        displayHeight
    );

    matrix.applyITRS(this.x + originX, this.y + originY, this.rotation, zoom, zoom);
    matrix.translate(-originX, -originY);

    this.shakeEffect.preRender();
  }

}*/

class BodyWrapper {
  constructor(body, active) {
    this.body = body;
    this.active = active;
  }
}
