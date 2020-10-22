
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneCreditsScore");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){

    //Credits menu
    this.load.image('CreditsScoreScreen', 'assets/Credits menu/CMScreen.png'); //field
    this.load.image('btnExitCreditsScore', 'assets/Credits menu/btnExitCredits.png'); //btn exit

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x091191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    var CreditsScoreScreen=this.add.image(0,0,'CreditsScoreScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton exit
    this.btnExitCreditsScore = this.add.image(480,455,'btnExitCreditsScore').setScale(0.25).setAlpha(0.8);
		this.btnExitCreditsScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitCreditsScore());

    this.btnExitCreditsScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitCreditsScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitCreditsScore(){
    console.log("Se ha pulsado exit");

    this.btnExitCreditsScore.alpha=0.8;

    this.scene.sendToBack('SceneCreditsScore');
		this.scene.stop('SceneCreditsScore');
    this.scene.resume('SceneScore');
    this.scene.bringToTop("SceneScore");
  }
}
