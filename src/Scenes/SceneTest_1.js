//Zona de declaración de variables.
//Variables de la camara.

//Mirar luego para temas de camara
var cam;
var mouse;
//var firstFollow;
//var fadeOut;

//Imports en la escena.
import Player from "../PlayerStuff/Player.js";
import Blackboard from "../Enemies/Blackboard.js";
import ZapperGround from "../Enemies/ZapperGround.js";
import SwordGround from "../Enemies/SwordGround.js";
import Mecha from "../Enemies/Mecha.js";
import Sith from "../Enemies/Sith.js";
import ZapperAir from "../Enemies/ZapperAir.js";
import BombAir from "../Enemies/BombAir.js";
import GunnerAir from "../Enemies/GunnerAir.js";
import Dialog from "../Plugins/Dialog.js"
import Mentor from "../NPCs/Mentor.js"
import NPC_Droid_1 from "../NPCs/NPC_Droid_1.js"
import NPC_Droid_2 from "../NPCs/NPC_Droid_2.js"
import NPC_Droid_3 from "../NPCs/NPC_Droid_3.js"
import NPC_Droid_4 from "../NPCs/NPC_Droid_4.js"
import NPC_Droid_5 from "../NPCs/NPC_Droid_5.js"
import NPC_Droid_6 from "../NPCs/NPC_Droid_6.js"
import NPC_Droid_7 from "../NPCs/NPC_Droid_7.js"
import NPC_Droid_8 from "../NPCs/NPC_Droid_8.js"
import NPC_Droid_Default1 from "../NPCs/NPC_Droid_Default1.js"
import NPC_Droid_Default2 from "../NPCs/NPC_Droid_Default2.js"
import BossBefore from "../NPCs/BossBefore.js"
import Joystick_test from "./Joystick_test.js"
import LevelEnd from "../Objects/LevelEnd.js";
import Audio from "../Audio.js";
import InteractableChest from "../Objects/Interactables/InteractableChest.js"
import TileController from "../TileController.js"

//Clase Scene2, que extiende de Phaser.Scene.
export default class SceneTest_1 extends Phaser.Scene {
  static count = 0;
  static addNumber(){
    SceneTest_1.count = (SceneTest_1.getNumber() + 1) ;
  }
  static getNumber(){
    return SceneTest_1.count;
  }
  constructor() {
    super('test' + (SceneTest_1.getNumber() + 1));
    SceneTest_1.addNumber();
  }
  preload(){
    Dialog.preloadToScene(this);
    //this.load.scenePlugin('AnimatedTiles', 'AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
  }

  //Función create, que crea los elementos del propio juego.
  create() {
    console.log(this);
    this.playerStartX = 600;
    this.playerStartY = 4500;

    function WordCount(str) {
      return str.split(" ").length;
    }


    console.log("PALABRAS: " + WordCount(`[b]D42K-H[/b] Finally... player, here we are!
    Behold, here rises the Starvail Tower!
    [b]D42K-H[/b]
    This is the last bastion of our creators,
    the place where life borns and dies...`));

    //INTERFAZ

    //Options field
    //var ebi=this.add.image(0,0,'ebi').setOrigin(0,0).setScale(0.25);

    //Boton pause
    this.botonPause = this.add.image(880,78,'btnPause').setScale(0.25).setAlpha(0.8).setScrollFactor(0).setDepth(100);
		this.botonPause.setInteractive()
    .on('pointerdown', () => this.pauseGame());

    this.botonPause.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonPause.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Pausa a traves de teclado
    //Creamos la tecla correspondiente con ESCAPE
    this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.inPause=false;

    //INTERFAZ

    new Dialog(this, 50, 400, false,5000, {
      wrapWidth: 700,
      fixedWidth: 700,
      fixedHeight: 80,
    });

    //game.matter.world.pause();
    mouse = this.input.activePointer;

    //Camara.
    cam = this.cameras.main;
    cam.setBackgroundColor('#262626');
    this.matter.world.setBounds(0, 0, 3776, 4800);
    cam.setBounds(0, 0, 3776, 4800);

    cam.fadeIn(Audio.barRateDiv[2]);  //Constante de Audio para sincronía
    //fadeOut = false;


    //Backgrounds.
    this.add.image(480, 270, 'bg1').setScale(2).setScrollFactor(0.2,0.05).setDepth(-500);

    this.moon = this.add.sprite(this.game.moonPos.x, this.game.moonPos.y, 'star', 0).setScrollFactor(0).setDepth(-400);
    this.timeBg = this.add.sprite(480, 270, 'animatedBg').setScrollFactor(0).setDepth(-500).anims.play('bgAnimation',true, this.game.currentBgAnimation);


    //Inicializacion y creacion de mapa de tiles.
    this.map = this.make.tilemap({ key: "mapTest" });
    const tileset1 = this.map.addTilesetImage("background_layer", "tilesBackgorund1", 32, 32, 1, 2);
    const tileset2 = this.map.addTilesetImage("front_layer", "tilesFront1", 32, 32, 1, 2);
    const tileset3 = this.map.addTilesetImage("main_layer", "tilesMain1", 32, 32, 1, 2);
    const tileset4 = this.map.addTilesetImage("second_layer", "tilesSecond1", 32, 32, 1, 2);
    const tileset5 = this.map.addTilesetImage("animated_layer", "animatedLayer1", 32, 32, 1, 2);

    //Capas de tiles.
    const mainlayer = this.map.createDynamicLayer("Main_Layer", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    mainlayer.depth = -5;
    const lethallayer = this.map.createDynamicLayer("Lethal_Layer", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    lethallayer.depth = -10;
    const frontlayer = this.map.createDynamicLayer("Front_Layer", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    frontlayer.depth = 25;
    const secondlayer = this.map.createDynamicLayer("Second_Layer", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    secondlayer.depth = -25;
    const background = this.map.createDynamicLayer("Background_Layer", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    background.depth = -30;

    //Colisiones de las capas.
    mainlayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(mainlayer);

    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    //capa letal pasa a ser un senosr
    lethallayer.forEachTile(function (tile) {
      if(tile.physics.matterBody != undefined){
        tile.physics.matterBody.body.isSensor = true;
        tile.physics.matterBody.body.collisionFilter.category = 1;
        tile.physics.matterBody.body.collisionFilter.group = -4;
      }
    }, this);

    //inicializamos el controlador de enemigos
    this.enemyController = new Blackboard(this);
    /*
    //se crean objetos esenciales de cada nivel como el player, los npcs, el boss....
    this.map.getObjectLayer("Special_Layer").objects.forEach(point => {
      if(point.name == "player"){
        this.playerStartX = point.x;
        this.playerStartY = point.y;
      }
      else if(point.name == "goal"){
        this.goalX = point.x;
        this.goalY = point.y;
      }
      else if(point.name == "boss"){
        new BossBefore(this, point.x, point.y);
      }
      else if(point.name == "NPC1"){
        new NPC_Droid_Default1(this, point.x, point.y);
      }
      else if(point.name == "NPC2"){
        new NPC_Droid_Default2(this, point.x, point.y);
      }
      else if(point.name == "goal"){
        this.goalX = point.x;
        this.goalY = point.y;
      }
      else if(point.name == "NPC"){
        const randNumber = Math.floor(Math.random()*this.game.npcArray.length) + 1;
        const npcNumber = this.game.npcArray[randNumber];
        switch(npcNumber){
          case 1:
            this.encounterNPC =new NPC_Droid_1(this, point.x, point.y);
          break;
          case 2:
            this.encounterNPC =new NPC_Droid_2(this, point.x, point.y);
          break;
          case 3:
            this.encounterNPC =new NPC_Droid_3(this, point.x, point.y);
          break;
          case 4:
            this.encounterNPC =new NPC_Droid_4(this, point.x, point.y);
          break;
          case 5:
            this.encounterNPC =new NPC_Droid_5(this, point.x, point.y);
          break;
          case 6:
            this.encounterNPC =new NPC_Droid_6(this, point.x, point.y);
          break;
          case 7:
            this.encounterNPC =new NPC_Droid_7(this, point.x, point.y);
          break;
          case 8:
            this.encounterNPC =new NPC_Droid_8(this, point.x, point.y);
          break;
          default:
            this.encounterNPC =new NPC_Droid_8(this, point.x, point.y);
          break
        }
        this.game.npcArray.splice(randNumber,1);
      }
    });*/

    //Sistema dinámico de modificacion de collisiones
    var tileBodyMatrix = [];
    for (var i = 0; i < 155; i++) {
      tileBodyMatrix[i] = [];
      for (var j = 0; j < 155; j++) {
        tileBodyMatrix[i][j] = undefined;
      }
    }
    this.bulletInteracBodies = [];
    var counerAux = 0;
    mainlayer.forEachTile(function (tile) {
      //tile.setSize
      if (tile.physics.matterBody != undefined) {
        const tileBody = tile.physics.matterBody.body;
        tileBody.ignoreGravity = true;
        tileBody.ignorePointer = true;
        tileBody.original = undefined;
        tileBody.collisionFilter.category = 1;
        tileBody.collisionFilter.group = -4;
        //tileBody.gameObject.tile.setVisible(false);
        if (tileBody.position.x > this.playerStartX - 32*26 && tileBody.position.x < this.playerStartX + 32*26 && tileBody.position.y > this.playerStartY - 32*26 && tileBody.position.y < this.playerStartY + 32*26) {
          tileBodyMatrix[Math.floor(tileBody.position.x / 32)][Math.floor(tileBody.position.y / 32)] = new BodyWrapper(tileBody, true);
          tileBody.collisionFilter.mask = 1;
        } else {
          tileBodyMatrix[Math.floor(tileBody.position.x / 32)][Math.floor(tileBody.position.y / 32)] = new BodyWrapper(tileBody, false);
          tileBody.collisionFilter.mask = 0;
          tileBody.isSleeping = true;
          tileBody.gameObject.tile.setVisible(false);
          //Phaser.Physics.Matter.Matter.Composite.removeBody(tile.physics.matterBody.world.localWorld, tileBody);
        }
        this.bulletInteracBodies[counerAux] = tile.physics.matterBody.body;
        counerAux++;
      }
    }, this);

    this.tileBodyMatrix = new Proxy(tileBodyMatrix, {
      get(target, prop) {
        return target[Math.max(0, prop)];
      }
    });
    this.touchedTiles = [];
    this.matter.world.on("afterupdate", this.resetTiles, this);
    this.graphics = this.add.graphics({ fillStyle: { color: 0xff0000}});    //QUITAR LUEGO !!

    //animacion de tiles de la capa de tiels animada
    this.animatedTiles.init(this.map);

    //arrays de enemigos de tierra/aire disponibles
    this.availableEnemiesGround = [];
    this.availableEnemiesGround[0] = {name: "zapper1", probability: 1};
    /*this.availableEnemiesGround[1] = {name: "sword", probability: 1};
    this.availableEnemiesGround[2] = {name: "mecha", probability: 1};
    this.availableEnemiesGround[3] = {name: "sith", probability: 1};*/

    this.availableEnemiesAir = [];
    this.availableEnemiesAir[0] = {name: "zapper2", probability: 0.75};
    /*this.availableEnemiesAir[1] = {name: "gunner", probability: 1};
    this.availableEnemiesAir[2] = {name: "bomb", probability: 1};*/

    //funcion crear enemigo
    function spawnEnemy(enemyName, scene, xPos, yPos){
      switch(enemyName){
        case "zapper1X":
          return new ZapperGround(scene, xPos, yPos);
        case "zapper2X":
          return new ZapperAir(scene, xPos, yPos);
        case "swordX":
          return new SwordGround(scene, xPos, yPos);
        case "gunnerX":
          return new GunnerAir(scene, xPos, yPos);
        case "bombX":
          return new BombAir(scene, xPos, yPos);
        case "mechaX":
          return new Mecha(scene, xPos, yPos);
        case "sith":
          return new Sith(scene, xPos, yPos);
        default:
          console.log("Enemy does not exist");
          return null;
      }
    }

    //inicialización de enemigos y cofres de capa de enemigos
    if(this.map.getObjectLayer("Enemy_Layer") != null)
      this.map.getObjectLayer("Enemy_Layer").objects.forEach(point => {
          spawnEnemy(point.name, this, point.x, point.y);
      });

    if(this.map.getObjectLayer("EnemySpawn_Layer") != null)
      this.map.getObjectLayer("EnemySpawn_Layer").objects.forEach(area => {
          var enemiesToSpawnArray;
          if(area.name == "both"){
            enemiesToSpawnArray = this.availableEnemiesGround.concat(this.availableEnemiesAir);
          }else if(area.name == "ground"){
            enemiesToSpawnArray = this.availableEnemiesGround;
          }else if (area.name == "air") {
            enemiesToSpawnArray =  this.availableEnemiesAir;
          }else{
            enemiesToSpawnArray = [];
          }
          const minCounter = 0;
          const maxCounter = enemiesToSpawnArray.length - 1;
          var enemiesToSpawn = Phaser.Math.Between(area.properties[1].value, area.properties[0].value);
          var currentEnemy;
          var randomSpawner;
          var breaker = 0;
          while(enemiesToSpawn > 0 && breaker < 100){   //por si acaso
            breaker++;
            currentEnemy = Phaser.Math.Between(minCounter, maxCounter);
            randomSpawner = Math.random();
            if(randomSpawner <= enemiesToSpawnArray[currentEnemy].probability){
              enemiesToSpawn--;
              if(area.properties[2].value){
                var enemyAux = spawnEnemy(enemiesToSpawnArray[currentEnemy].name, this, Phaser.Math.Between(area.x, area.x + area.width), Phaser.Math.Between(area.y, area.y + area.height));
                /*enemyAux.encounterNPC = this.encounterNPC;
                this.encounterNPC.enemiesLeft++;*/
              }else {
                spawnEnemy(enemiesToSpawnArray[currentEnemy].name, this, Phaser.Math.Between(area.x, area.x + area.width), Phaser.Math.Between(area.y, area.y + area.height));
              }

            }
          }
      });

    if(this.map.getObjectLayer("Chest_Layer") != null)
      this.map.getObjectLayer("Chest_Layer").objects.forEach(point => {
        if(point.name == "tutorialSpecial")
        new InteractableChest(this, point.x, point.y, 10 ,20000);
      else
        new InteractableChest(this, point.x, point.y, 10 ,20);
      });




    if(this.map.getObjectLayer("Waypoint_Layer") != null) {
      var arrayPuntos = [8];
      var counter = 0;
      this.map.getObjectLayer("Waypoint_Layer").objects.forEach(point => {
        if(point.name == "01")
          this.mentor = new Mentor(this, point.x, point.y);

        /*array de posiciones aqui
          var arrayPuntos = []
          ...
          ...
          this.mentor.tutorialPositions = arrayPuntos;

          Una vez asignados los puntos en el tutorialPositions,
          debes ir a Mentor.js a la linea 64 y rellenar los dialogos.

          Para bloquear el movimiento del jugador,
          this.game.player.alive = false

          Si estas en la clase del mentor,
          this.scene.game.player.alive = false

          //por ultimo modifica el array de dialogos de Mentor.js
        */

        arrayPuntos[counter] = new Phaser.Math.Vector2(point.x,point.y);
        counter++;
        console.log(point.name + "    " +  point.x + "    " + point.y);
      });

      this.mentor.tutorialPositions = arrayPuntos;


    }

    //console.log("tu array contiene " + arrayPuntos.lenght +  " puntos");
    //jugador
    new Player(this, 600, 4500);
    //new Mentor(this, this.playerStartX + 400, this.playerStartY)

    cam.startFollow(this.game.player.sprite, false, 0.1, 0.1, 0, 0);
    //cam.setZoom(0.5);

    //inicialización de meta
    //new LevelEnd(this, this.goalX, this.goalY, 'star', 'testsec', SceneTest_2);

    this.input.setDefaultCursor('none');

  //AUDIO:
   Audio.startMusicEngineLevelOne(this);
   
  //
   this.maxMemory = 0;


  }





  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //AUDIO:
      Audio.audioUpdate(this);
    //
    this.moon.x += (delta/50);
    this.game.moonPos.x = this.moon.x;


    if (this.ESC.isDown){
      if (!this.inPause) {
        this.inPause = true;
      }
    }

    if (this.ESC.isUp) {
      if (this.inPause){
      this.inPause = false;
      this.pauseGame();
      }
    }

    /*console.log(Phaser.Physics.Matter.Matter.Composite.allBodies(this.matter.world.localWorld).length);
    console.log(this.matter.world.localWorld.bodies.length);
    console.log("   ");*/
    /*this.maxMemory = Math.max(this.maxMemory, Math.round((performance.memory.usedJSHeapSize/1024/1024)));
    console.log(this.maxMemory + "    " + Math.round((performance.memory.usedJSHeapSize/1024/1024)));*/
    /*const usedHeap = performance.memory.usedJSHeapSize/1024/1024;
    if(usedHeap > 90){
      console.log("USING TOO MUCH MEMORY:  " + usedHeap);
    }*/
  }
  resetTiles(){
    for(var i=0; i<this.touchedTiles.length; i++){
      TileController.resetTileBody(this.touchedTiles[i]);
      this.touchedTiles[i].touched = false;
    }
    this.touchedTiles.length = 0;
    this.touchedTiles = [];
  }

  pauseGame(){
    console.log("Juego pausado");

    this.game.pauseInfo = 'test' + (Level1.getNumber());

    this.botonPause.alpha=0.8;
    this.scene.run("ScenePause");
    this.scene.bringToTop("ScenePause");
    this.scene.pause('test' + (SceneTest_1.getNumber()));
  }

  startDebugLoop(deltaLoop, memoryLoop){
    if(deltaLoop)
      this.events.on("update", this.printDelta, this);

    if(memoryLoop)
      this.events.on("update", this.printMemory, this);
  }


  stopDebugLoop(){
    this.events.off("update", this.printDelta);
    this.events.off("update", this.printMemory);
  }



  printDelta(time, delta){
    //console.log("Last Delta:  " + (Math.round(delta))+ " ms");
  }
  printMemory(time, delta){
    //console.log("Used Memory: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");
  }


}

class BodyWrapper {
  constructor(body, active) {
    this.body = body;
    this.active = active;
    this.touched = false;
  }
}
