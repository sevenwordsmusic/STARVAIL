//Zona de declaración de variables.
//Variables de la camara.

//Mirar luego para temas de camara
var cam;
var mouse;
//var firstFollow;
//var fadeOut;

//Imports en la escena.
import Player from "../PlayerStuff/Player.js";
import Dummy from "../Enemies/Dummy.js";

//Clase Scene2, que extiende de Phaser.Scene.
export default class SceneTest_1 extends Phaser.Scene {
  constructor() {
    super("test1");
  }

  preload() {
    var url;

    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', url, true);
}

  //Función create, que crea los elementos del propio juego.
  create() {
    console.log(this);
    //game.matter.world.pause();
    mouse = this.input.activePointer;
    //fadeOut = false;

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

    //Inicializacion y creacion de mapa de tiles.
    const map2 = this.make.tilemap({ key: "map2" });
    const tileset2 = map2.addTilesetImage("electrical_tileset", "tiles2");

    //Capas de tiles.
    //const layerminus2 = map2.createStaticLayer("background_layer_-2depth", tileset2, 0, 0);
    //layerminus2.depth = -20;
    //const layerminus1 = map2.createStaticLayer("deco_layer_-1depth", tileset2, 0, 0);
    //layerminus1.depth = -10;
    const baselayer = map2.createStaticLayer("base_layer_0depth", tileset2, 0, 0);
    baselayer.depth = -5;
    const lethallayer = map2.createStaticLayer("lethal_layer_0depth", tileset2, 0, 0);
    lethallayer.depth = -5;

    //Colisiones de las capas.
    //layerminus1.setCollisionByProperty({ Collides: true });
    //this.matter.world.convertTilemapLayer(layerminus1);
    baselayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(baselayer);
    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    var tileBodyMatrix = [];
    for(var i=0; i<240; i++){
      tileBodyMatrix[i] = [];
      for(var j=0; j<20; j++){
        tileBodyMatrix[i][j] = undefined;
      }
    }
    this.bulletInteracBodies = [];
    var counerAux = 0;
    baselayer.forEachTile(function (tile){
      if(tile.physics.matterBody != undefined){
        const tileBody = tile.physics.matterBody.body;
        if(tileBody.position.x < 2944 && tileBody.position.x > 1856 && tileBody.position.y < 576 && tileBody.position.y > -512){
          tileBodyMatrix[Math.floor(tileBody.position.x/32)][Math.floor(tileBody.position.y/32)] = new BodyWrapper(tileBody, true);
          //Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        }else {
          tileBodyMatrix[Math.floor(tileBody.position.x/32)][Math.floor(tileBody.position.y/32)] = new BodyWrapper(tileBody, false);
          Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        }
        this.bulletInteracBodies[counerAux] = tile.physics.matterBody.body;
        counerAux++;
      }
    }, this);
    lethallayer.forEachTile(function (tile){
      if(tile.physics.matterBody != undefined){
        const tileBody = tile.physics.matterBody.body;
        if(tileBody.position.x < 2944 && tileBody.position.x > 1856 && tileBody.position.y < 576 && tileBody.position.y > -512){
          tileBodyMatrix[Math.floor(tileBody.position.x/32)][Math.floor(tileBody.position.y/32)] = new BodyWrapper(tileBody, true);
          //Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        }else {
          tileBodyMatrix[Math.floor(tileBody.position.x/32)][Math.floor(tileBody.position.y/32)] = new BodyWrapper(tileBody, false);
          Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        }
        this.bulletInteracBodies[counerAux] = tile.physics.matterBody.body;
        counerAux++;
      }
    }, this);

    this.tileBodyMatrix = new Proxy(tileBodyMatrix,{
      get(target, prop){
        return target[Math.max(0,prop)];
      }
    });
    /*console.time("plsWork");
    for(var i=0; i<100; i++){

      baselayer.forEachTile(function (tile){
        if(tile.physics.matterBody != undefined){
          //tile.physics.matterBody.removeBody()
          var aux1 = tile.physics.matterBody.body;
          Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tile.physics.matterBody.body);
          Phaser.Physics.Matter.Matter.Composite.addBody(tile.physics.matterBody.world.localWorld, tile.physics.matterBody.body);
          counerAux++;
        }
      }, this);
    }
    console.timeEnd("plsWork");*/
    //Generamos las teclas y las añadimos al jugador androide, creándolos.
    new Player(this, 2400, -96);
    //var en1 = new Dummy(this, 500, 300);
    //var en1 = new Dummy(this, 600, 300);
    //var en1 = new Dummy(this, 700, 300);
    //Colisiones del escneario con el jugador
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
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, -500, 10000, 1100);
    cam.startFollow(this.game.player.sprite, false, 0.05, 0.05, 0, 0);
    cam.setBackgroundColor('rgba(132, 167, 219, 1)');

    this.input.setDefaultCursor('none');
  }
  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}

class BodyWrapper{
  constructor(body, active){
    this.body = body;
    this.active = active;
  }
}
