//Zona de declaración de variables.
//Variables de la camara.

//Mirar luego para temas de camara
var cam;
var mouse;
//var firstFollow;
//var fadeOut;


//Texto prueba para el dialogo
var dialogTest;
var content = `[b]D42K-H[/b]
Así que [i]finalmente[/i] has venido

[b]D42K-H[/b]
4ULS82... Sabes que sólo hay una respuesta al dolor que sentimos por el mero hecho de [color=red][b]existir[/b][/color], ¿verdad?
[b]D42K-H[/b]
Si así es, ya sabes lo que tenemos que hacer.`;

//Imports en la escena.
import Player from "../PlayerStuff/Player.js";
import ZapperGround from "../Enemies/ZapperGround.js";
import ZapperAir from "../Enemies/ZapperAir.js";
import Dialog from "../Plugins/Dialog.js"
import SceneTest_2 from "./SceneTest_2.js"
import Joystick_test from "./Joystick_test.js"
import LevelEnd from "../Objects/LevelEnd.js";
import Audio from "../Audio.js";
import InteractableEnergyOnce from "../Objects/Interactables/InteractableEnergyOnce.js"
import InteractableEnergy from "../Objects/Interactables/InteractableEnergy.js"

//Clase Scene2, que extiende de Phaser.Scene.
export default class SceneTest_1 extends Phaser.Scene {
  static #count = 0;
  static addNumber(){
    SceneTest_1.#count = (SceneTest_1.getNumber() + 1)%5 ;
  }
  static getNumber(){
    return SceneTest_1.#count;
  }
  constructor() {
    super('test' + (SceneTest_1.getNumber() + 1));
    SceneTest_1.addNumber();
  }
  preload(){
    Dialog.preloadToScene(this);
  }

  //Función create, que crea los elementos del propio juego.
  create() {
    console.log(this);

    //game.matter.world.pause();
    mouse = this.input.activePointer;

    //Camara.
    cam = this.cameras.main;
    cam.setBackgroundColor('rgba(150, 174, 191, 1)');
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, -500, 10000, 10000);/*
    this.matter.world.setBounds(0, -500, 2900, 2800);
    cam.setBounds(0, -500, 2880, 2784);*/

    cam.fadeIn(Audio.barRateDiv[2]);  //Constante de Audio para sincronía
    //fadeOut = false;

    //TESTING DIALOG
    /*dialogTest = new Dialog(this, 50, 400,true,5000, {
      wrapWidth: 700,
      fixedWidth: 700,
      fixedHeight: 80,
    });

    dialogTest.textBox.start(content,10);*/


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
    const map = this.make.tilemap({ key: "map" });
    const tileset1 = map.addTilesetImage("background_layer", "tilesBackgorund", 32, 32, 0, 0);
    const tileset2 = map.addTilesetImage("front_layer", "tilesFront", 32, 32, 0, 0);
    const tileset3 = map.addTilesetImage("main_layer", "tilesMain", 32, 32, 0, 0);
    const tileset4 = map.addTilesetImage("second_layer", "tilesSecond", 32, 32, 0, 0);
    //Capas de tiles.

    const mainlayer = map.createDynamicLayer("Main_Layer", [tileset1, tileset2, tileset3, tileset4], 0, 0);
    console.log(mainlayer);
    mainlayer.depth = -5;
    const frontlayer = map.createDynamicLayer("Front_Layer", [tileset1, tileset2, tileset3, tileset4], 0, 0);
    frontlayer.depth = 25;
    const secondlayer = map.createDynamicLayer("Second_Layer", [tileset1, tileset2, tileset3, tileset4], 0, 0);
    secondlayer.depth = -25;
    const background = map.createStaticLayer("Background_Layer", [tileset1, tileset2, tileset3, tileset4], 0, 0);
    background.depth = -30;
    //Colisiones de las capas.
    mainlayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(mainlayer);
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
    mainlayer.forEachTile(function (tile) {
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
    this.graphics = this.add.graphics({ fillStyle: { color: 0xff0000}});    //QUITAR LUEGO !!

    //inicialización de enemigos y cofres de capa de enemigos (SIEMPRE POR ENCIMA DEL JUGADOR!)
    map.getObjectLayer("Enemy_Layer").objects.forEach(point => {
      if(point.name === "zapper1")
        new ZapperGround(this, point.x, point.y);
      if(point.name === "zapper2")
        new ZapperAir(this, point.x, point.y);
    });
    map.getObjectLayer("Chest_Layer").objects.forEach(point => {
      new InteractableEnergyOnce(this, point.x, point.y);
    });

    new Player(this, 416, 2624);
    cam.startFollow(this.game.player.sprite, false, 0.1, 0.1, 0, 0);

    //inicialización de meta (SIEMPRE POR DEBAJO DEL JUGADOR!)
    new LevelEnd(this, 704, 64, 'star', 'testsec', SceneTest_2);

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

  //AUDIO:
   Audio.startAudioEngine(this);
  }
  //Función update, que actualiza el estado de la escena.
  update(time, delta) {

  //AUDIO:
  Audio.audioUpdate(this);
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
