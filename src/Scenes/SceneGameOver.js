
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneGameOver");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){
    //Game over menu
    this.load.image('GOScreen', 'assets/Game over menu/GOScreen.png'); //field
    this.load.image('btnExitGameOver', 'assets/Game over menu/btnExitGameOver.png'); //btn exit
    this.load.image('btnPlayAgainGameOver','assets/Game over menu/btnPlayAgainGameOver.png'); //btn play again

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
    
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x450045);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    var GOScreen=this.add.image(0,0,'GOScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton exit
    this.btnExitGameOver = this.add.image(746,459,'btnExitGameOver').setScale(0.25).setAlpha(0.8);
		this.btnExitGameOver.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitGameOver());

    this.btnExitGameOver.on('pointerover', function(pointer){
      this.alpha=1;
    });
    
    this.btnExitGameOver.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton play again
    this.btnPlayAgainGameOver = this.add.image(237,460,'btnPlayAgainGameOver').setScale(0.25).setAlpha(0.8);
		this.btnPlayAgainGameOver.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.playAgainGameOver());

    this.btnPlayAgainGameOver.on('pointerover', function(pointer){
      this.alpha=1;
    });
    
    this.btnPlayAgainGameOver.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitGameOver(){
    console.log("Se ha pulsado exit");

    this.btnExitGameOver.alpha=0.8;

		this.scene.stop('SceneGameOver');
    this.scene.start('SceneMM');
    this.scene.bringToTop("SceneMM");
  }

  playAgainGameOver(){

    console.log("Se ha pulsado play again");

    this.btnPlayAgainGameOver.alpha=0.8;

    this.scene.stop('SceneGameOver');
    
    /*
    this.scene.start('SceneGameEbi');
    this.scene.bringToTop("SceneGameEbi");
    */

   var SceneGameEbiR = this.scene.get('SceneGameEbi');

   SceneGameEbiR.scene.restart();
  }
}
