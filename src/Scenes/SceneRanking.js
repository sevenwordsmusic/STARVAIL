
export default class SceneRanking extends Phaser.Scene {
  constructor() {
    super("SceneRanking");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0xdbdace);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Background Final
    this.add.image(0,0,'endBackground').setOrigin(0).setDepth(-100);

    //Ranking field
    var creditsScreen=this.add.image(0,0,'RankingScreen').setOrigin(0,0).setScale(0.25);

    //Boton exit
    this.btnExitRanking = this.add.image(480,455,'btnExitRanking').setScale(0.25).setAlpha(0.8);
		this.btnExitRanking.setInteractive()
    .on('pointerdown', () => this.exitRanking());

    this.btnExitRanking.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitRanking.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitRanking(){
    console.log("Se ha pulsado exit");

    this.btnExitRanking.alpha=0.8;

    this.scene.sendToBack('SceneRanking');
		this.scene.stop('SceneRanking');
    this.scene.resume('SceneScore');
    this.scene.bringToTop("SceneScore");
  }
}
