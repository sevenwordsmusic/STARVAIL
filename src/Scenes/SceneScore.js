
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneScore");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){

    //Score menu
    this.load.image('ScoreScreen', 'assets/Score screen menu/Botones Score.png'); //field
    this.load.image('btnExitScore', 'assets/Score screen menu/btnExitScoreMenu.png'); //btn exit
    this.load.image('btnCreditsScore', 'assets/Score screen menu/btnCreditsScoreMenu.png'); //btn credits

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
    
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x900990);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Score field
    var ScoreScreen=this.add.image(0,0,'ScoreScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton credits
    this.btnExitCreditsScore = this.add.image(213,459,'btnCreditsScore').setScale(0.25);
		this.btnExitCreditsScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewCreditsScore());

    //Boton exit
    this.btnExitScore = this.add.image(746,459,'btnExitScore').setScale(0.25);
		this.btnExitScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitScore());

  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  viewCreditsScore(){
    console.log("Se ha pulsado credits");

    this.scene.run("SceneCreditsScore");
    this.scene.bringToTop("SceneCreditsScore");
    this.scene.pause("SceneScore");

  }

  exitScore(){
    console.log("Se ha pulsado exit");

    this.scene.stop('SceneScore');
    
    /*
    this.scene.start('SceneMM');
    this.scene.bringToTop("SceneMM");
    */
   var SceneMMR = this.scene.get('SceneMM');

   SceneMMR.scene.restart();
  }
}
