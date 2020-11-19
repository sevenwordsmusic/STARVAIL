import Audio from "../Audio.js";
export default class SceneRanking extends Phaser.Scene {
  constructor() {
    super("SceneRanking");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
      Audio.fullscreenMode(this);
      //

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Final
    this.add.image(0,0,'endBackground').setOrigin(0).setDepth(-100);

    //Ranking field
    var creditsScreen=this.add.image(0,0,'RankingScreen').setOrigin(0,0);

    //Boton exit
    this.btnExitRanking = this.add.image(479,455,'btnExit').setAlpha(0.8);
		this.btnExitRanking.setInteractive()
    .on('pointerdown', () => this.exitRanking());

    this.btnExitRanking.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitRanking.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

  }

  exitRanking(){
    console.log("Se ha pulsado exit");

    this.btnExitRanking.alpha=0.8;

    this.scene.sendToBack('SceneRanking');
		this.scene.stop('SceneRanking');
    this.scene.run('SceneScore');
    this.scene.bringToTop("SceneScore");
  }
}
