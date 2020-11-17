
export default class SceneCreditsScore extends Phaser.Scene {
  constructor() {
    super("SceneCreditsScore");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0xdbdace);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Background Final
    this.add.image(0,0,'endBackground').setOrigin(0).setDepth(-100);

    //Credits field
    var CreditsScoreScreen=this.add.image(0,0,'CreditsScoreScreen').setOrigin(0,0).setScale(0.25).setAlpha(0.8);

    //Boton exit
    this.btnExitCreditsScore = this.add.image(480,455,'btnBack').setScale(0.25).setAlpha(0.8);
		this.btnExitCreditsScore.setInteractive()
    .on('pointerdown', () => this.exitCreditsScore());

    this.btnExitCreditsScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitCreditsScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin victor
    this.btnScoreVictor = this.add.image(51,45,'btnContactoScore').setScale(0.25).setAlpha(0.8);
		this.btnScoreVictor.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/v%C3%ADctor-sierra-fern%C3%A1ndez-6a1a571bb/"));

    this.btnScoreVictor.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnScoreVictor.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Nikola
    this.btnScoreNikola = this.add.image(51,128,'btnContactoScore').setScale(0.25).setAlpha(0.8);
		this.btnScoreNikola.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://kilonovastudios.itch.io/"));

    this.btnScoreNikola.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnScoreNikola.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Seven
    this.btnScoreSeven = this.add.image(51,210,'btnContactoScore').setScale(0.25).setAlpha(0.8);
		this.btnScoreSeven.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.youtube.com/channel/UC_QZH47UacK5fEiKjB37Qjg"));

    this.btnScoreSeven.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnScoreSeven.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Alberto
    this.btnScoreAlberto = this.add.image(51,292,'btnContactoScore').setScale(0.25).setAlpha(0.8);
		this.btnScoreAlberto.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://twitter.com/lordarner"));

    this.btnScoreAlberto.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnScoreAlberto.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin ebi
    this.btnScoreEbi = this.add.image(51,374,'btnContactoScore').setScale(0.25).setAlpha(0.8);
		this.btnScoreEbi.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnScoreEbi.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnScoreEbi.on('pointerout', function(pointer){
      this.alpha=0.8;
    });


    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
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

  irAlLink(urllink){
    //window.location.href = 'https://www.youtube.com/watch?v=5XjcUvaDTK4&t=408s&ab_channel=gammafp';

    this.url = urllink;
    window.open(this.url);
  }
}
