
export default class SceneGameOver extends Phaser.Scene {
  constructor() {
    super("SceneGameOver");
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

    this.game.prepareScreen();

    this.scene.stop('SceneGameOver');
    this.scene.start('SceneMM');
    this.scene.bringToTop("SceneMM");

    /*
    this.scene.start('SceneGameEbi');
    this.scene.bringToTop("SceneGameEbi");
    */
  }
}
