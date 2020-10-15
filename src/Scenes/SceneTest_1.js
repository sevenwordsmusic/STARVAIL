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

    this.load.image('btnPause', 'assets/BtnPauseGame.png'); //btn pause
}

  //Función create, que crea los elementos del propio juego.
  create() {
    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x001191);
/*
    console.log(this);
    mouse = this.input.activePointer;

    const map2 = this.make.tilemap({ key: "map2" });
    const tileset2 = map2.addTilesetImage("electrical_tileset", "tiles2");

    const baselayer = map2.createStaticLayer("base_layer_0depth", tileset2, 0, 0);
    baselayer.depth = -5;
    const lethallayer = map2.createStaticLayer("lethal_layer_0depth", tileset2, 0, 0);
    lethallayer.depth = -5;

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

    new Player(this, 2400, -96);

    this.matterCollision.addOnCollideStart({
      objectA: this.game.player.mainBody,
      callback: lethalCollide,
      context: this.game.player
    });

    function lethalCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
      const tile = gameObjectB;
      if (tile.properties.lethal) {
        //this.damaged(new Phaser.Math.Vector2(this.sprite.x - gameObjectB.x, -(this.sprite.y - gameObjectB.y)), 60);
        console.log("damage");
      }
    }
    */

    console.log("Boton pausa creado");
    //Boton pause
    this.botonPause = this.add.image(910,50,'btnPause').setScale(0.25);
		this.botonPause.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.pauseGame());

    /*
    //Camara.
    cam = this.cameras.main;
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, -500, 10000, 1100);
    cam.startFollow(this.game.player.sprite, false, 0.05, 0.05, 0, 0);
    cam.setBackgroundColor('rgba(132, 167, 219, 1)');

    this.input.setDefaultCursor('none');
    */
  }
  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }

  pauseGame(){
    console.log("Juego pausado");
  }
}

class BodyWrapper{
  constructor(body, active){
    this.body = body;
    this.active = active;
  }
}
