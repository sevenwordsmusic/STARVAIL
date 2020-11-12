import SceneTest_1 from "./SceneTest_1.js";


export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super("SceneMM");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x001191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //MM field
    //var MMScreen=this.add.image(0,0,'MMScreen').setOrigin(0,0).setScale(0.25);

    //Boton credits
    this.botonCredits = this.add.image(770,400,'btnCredits').setScale(0.25).setAlpha(0.8);
		this.botonCredits.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewCredits());

    this.botonCredits.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonCredits.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton start
    this.botonStart = this.add.image(480,400, 'btnStart').setScale(0.25).setAlpha(0.8);
		this.botonStart.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.startGame());

    this.botonStart.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonStart.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton options
		this.botonOptions = this.add.image(190,400, 'btnOptions').setScale(0.25).setAlpha(0.8);
		this.botonOptions.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewOptions());

    this.botonOptions.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonOptions.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  viewCredits(){
    console.log("Se ha pulsado credits");

    this.botonCredits.alpha=0.8;

    this.scene.run("SceneCredits");
    this.scene.bringToTop("SceneCredits");
    this.scene.pause("SceneMM");
  }

  startGame(){
    console.log("Se ha pulsado start");

    this.game.prepareScreen();
    
    this.botonStart.alpha=0.8;
    //CAMBIAR
    this.scene.run("levelFirst1");
    this.scene.bringToTop("levelFirst1");
    this.scene.remove("SceneMM");
  }

  viewOptions(){
    console.log("Se ha pulsado options");

    this.botonOptions.alpha=0.8;

    this.scene.run("SceneOptionsMM");
    this.scene.bringToTop("SceneOptionsMM");
    this.scene.pause("SceneMM");
  }

}
