import SceneTest_1 from "./SceneTest_1.js";
import Audio from "../Audio.js";

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super("SceneMM");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
      Audio.fullscreenMode(this);
      //

    if(!this.game.newGame){
      //parar musica anterior
      //poner musica de menu principal
    }

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Menu
    this.add.image(0,0,'menuBETABackground').setOrigin(0).setDepth(-100);

    //MM field
    //var MMScreen=this.add.image(0,0,'MMScreen').setOrigin(0,0).setScale(0.25);

    //Boton credits
    this.botonCredits = this.add.image(770,400,'btnCredits').setAlpha(0.8);
		this.botonCredits.setInteractive()
    .on('pointerdown', () => this.viewCredits());

    this.botonCredits.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.botonCredits.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton start
    this.botonStart = this.add.image(480,400, 'btnStart').setAlpha(0.8);
		this.botonStart.setInteractive()
    .on('pointerdown', () => this.startGame());

    this.botonStart.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.botonStart.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton options
		this.botonOptions = this.add.image(190,400, 'btnOptions').setAlpha(0.8);
		this.botonOptions.setInteractive()
    .on('pointerdown', () => this.viewOptions());

    this.botonOptions.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.botonOptions.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  viewCredits(){
    console.log("Se ha pulsado credits");
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
      //
    this.botonCredits.alpha=0.8;

    this.scene.run("SceneCredits");
    this.scene.bringToTop("SceneCredits");
    this.scene.pause("SceneMM");
  }

  startGame(){
    console.log("Se ha pulsado start");
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
      //
    this.game.prepareScreen();

    this.botonStart.alpha=0.8;

    this.scene.sendToBack('SceneMM');
    this.scene.stop('SceneMM');
    this.scene.run("ScenePlayerName");
    this.scene.bringToTop("ScenePlayerName");
  }

  viewOptions(){
    console.log("Se ha pulsado options");
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
      //
    this.botonOptions.alpha=0.8;

    this.scene.run("SceneOptionsMM");
    this.scene.bringToTop("SceneOptionsMM");
    this.scene.pause("SceneMM");
  }

}
