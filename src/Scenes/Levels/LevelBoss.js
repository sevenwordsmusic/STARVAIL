//Zona de declaración de variables.
//Variables de la camara.

//Mirar luego para temas de camara
var cam;
var mouse;
//var firstFollow;
//var fadeOut;

//Imports en la escena.
import Player from "../../PlayerStuff/Player.js";
import Blackboard from "../../Enemies/Blackboard.js";
import ZapperGround from "../../Enemies/ZapperGround.js";
import SwordGround from "../../Enemies/SwordGround.js";
import Mecha from "../../Enemies/Mecha.js";
import Sith from "../../Enemies/Sith.js";
import ZapperAir from "../../Enemies/ZapperAir.js";
import BombAir from "../../Enemies/BombAir.js";
import GunnerAir from "../../Enemies/GunnerAir.js";
import Dialog from "../../Plugins/Dialog.js"
import Mentor from "../../NPCs/Mentor.js"
import NPC_Droid_1 from "../../NPCs/NPC_Droid_1.js"
import NPC_Droid_2 from "../../NPCs/NPC_Droid_2.js"
import NPC_Droid_3 from "../../NPCs/NPC_Droid_3.js"
import NPC_Droid_4 from "../../NPCs/NPC_Droid_4.js"
import NPC_Droid_5 from "../../NPCs/NPC_Droid_5.js"
import NPC_Droid_6 from "../../NPCs/NPC_Droid_6.js"
import NPC_Droid_7 from "../../NPCs/NPC_Droid_7.js"
import NPC_Droid_8 from "../../NPCs/NPC_Droid_8.js"
import NPC_Droid_Default1 from "../../NPCs/NPC_Droid_Default1.js"
import NPC_Droid_Default2 from "../../NPCs/NPC_Droid_Default2.js"
import BossBefore from "../../NPCs/BossBefore.js"
import LevelEnd from "../../Objects/LevelEnd.js";
import Audio from "../../Audio.js";
import InteractableChest from "../../Objects/Interactables/InteractableChest.js"
import TileController from "../../TileController.js"

//Clase Scene2, que extiende de Phaser.Scene.
export default class LevelBoss extends Phaser.Scene {
  static #count = 0;
  static addNumber(){
    LevelBoss.#count = (LevelBoss.getNumber() + 1)%5 ;
  }
  static getNumber(){
    return LevelBoss.#count;
  }
  constructor() {
    super('levelBoss' + (LevelBoss.getNumber() + 1));
    LevelBoss.addNumber();
  }
  preload(){
    Dialog.preloadToScene(this);
    //this.load.scenePlugin('AnimatedTiles', 'AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
  }

  //Función create, que crea los elementos del propio juego.
  create() {
    console.log(this);

    //INTERFAZ

    //Options field
    //var ebi=this.add.image(0,0,'ebi').setOrigin(0,0).setScale(0.25);

    //Boton pause
    this.botonPause = this.add.image(880,78,'btnPause').setScale(0.25).setAlpha(0.8).setScrollFactor(0);
		this.botonPause.setInteractive({ useHandCursor: true  } )
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
    cam.setBackgroundColor('#dddddd');
    this.matter.world.setBounds(0, -500, 4000, 6000);
    cam.setBounds(0, -500, 4000, 6000);/*
    this.matter.world.setBounds(0, -500, 2900, 2800);
    cam.setBounds(0, -500, 2880, 2784);*/

    cam.fadeIn(Audio.barRateDiv[2]);  //Constante de Audio para sincronía
    //fadeOut = false;


    //Backgrounds.
    //this.add.image(480, 270, 'bg_e').setScrollFactor(0).setDepth(-503);
    //this.add.image(1300, 290, 'bg1_e').setScale(2).setScrollFactor(0.25).setDepth(-502);
    //this.add.image(1100, 320, 'bg2_e').setScale(2).setScrollFactor(0.5).setDepth(-501);
    //this.add.image(1200, 400, 'bg3_e').setScale(2).setScrollFactor(0.75).setDepth(-500);

    this.moon = this.add.sprite(this.game.moonPos.x, this.game.moonPos.y, 'star', 0).setScrollFactor(0).setDepth(-400);
    this.timeBg = this.add.sprite(480, 100/*270*/, 'animatedBg').setScrollFactor(0).setDepth(-500).anims.play('bgAnimation',true, this.game.currentBgAnimation);
    this.timeBg.once('animationcomplete', function(){
      if(this.timeBg.anims.currentFrame != undefined)
        this.game.currentBgAnimation = this.timeBg.anims.currentFrame.index-1;
      this.game.transitionToScene(this, 'Joystick', Joystick_test)
    },this);

    console.log("a: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");

    //Inicializacion y creacion de mapa de tiles.
    this.map = this.make.tilemap({ key: "map4" });
    console.log("b: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");
    const tileset1 = this.map.addTilesetImage("background_layer", "tilesBackgorund1", 32, 32, 0, 0);
    const tileset2 = this.map.addTilesetImage("front_layer", "tilesFront1", 32, 32, 0, 0);
    const tileset3 = this.map.addTilesetImage("main_layer", "tilesMain1", 32, 32, 0, 0);
    const tileset4 = this.map.addTilesetImage("second_layer", "tilesSecond1", 32, 32, 0, 0);
    const tileset5 = this.map.addTilesetImage("animated_layer", "animatedLayer1", 32, 32, 0, 0);
    console.log("c: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");

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
    console.log("1: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");
    this.matter.world.convertTilemapLayer(mainlayer);
    console.log("2: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");

    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    //capa letal pasa a ser un senosr
    lethallayer.forEachTile(function (tile) {
      if(tile.physics.matterBody != undefined)
        tile.physics.matterBody.body.isSensor = true;
    }, this);

    //inicializamos el controlador de enemigos
    this.enemyController = new Blackboard(this);

    //se crean objetos esenciales de cada nivel como el player, los npcs, el boss....
    this.map.getObjectLayer("Special_Layer").objects.forEach(point => {
      if(point.name == "player"){
        this.playerStartX = point.x;
        this.playerStartY = point.y;
      }
      else if(point.name == "goal"){
        //nada
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
    });

    //Sistema dinámico de modificacion de collisiones
    var tileBodyMatrix = [];
    for (var i = 0; i < 145; i++) {
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
        case "zapper1":
          return new ZapperGround(scene, xPos, yPos);
        case "zapper2":
          return new ZapperAir(scene, xPos, yPos);
        case "sword":
          return new SwordGround(scene, xPos, yPos);
        case "gunner":
          return new GunnerAir(scene, xPos, yPos);
        case "bomb":
          return new BombAir(scene, xPos, yPos);
        case "mecha":
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
                enemyAux.encounterNPC = this.encounterNPC;
                this.encounterNPC.enemiesLeft++;
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

    if(this.map.getObjectLayer("Waypoint_Layer") != null)
      this.map.getObjectLayer("Waypoint_Layer").objects.forEach(point => {
        if(point.name == "01")
          this.mentor = new Mentor(this, point.x, point.y);

        /*array de posiciones aqui
          var arrayPuntos = []
          ...
          ...
          this.mentor.tutorialPositions = arrayPuntos;
          //por ultimo modifica el array de dialogos de Mentor.js
        */
      });

    //jugador
    new Player(this, this.playerStartX, this.playerStartY);
    //new Mentor(this, this.playerStartX + 400, this.playerStartY)

    cam.startFollow(this.game.player.sprite, false, 0.1, 0.1, 0, 0);

    this.input.setDefaultCursor('none');

  //AUDIO:
   Audio.startAudioEngine(this);
   this.maxMemory = 0;
  }
  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //AUDIO:
    Audio.audioUpdate(this);

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

    this.botonPause.alpha=0.8;

    this.scene.run("ScenePause");
    this.scene.bringToTop("ScenePause");
    this.scene.pause('levelBoss' + (LevelBoss.getNumber()));
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
    console.log("Last Delta:  " + (Math.round(delta))+ " ms");
  }
  printMemory(time, delta){
    console.log("Used Memory: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");
  }
}


class BodyWrapper {
  constructor(body, active) {
    this.body = body;
    this.active = active;
    this.touched = false;
  }
}