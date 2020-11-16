
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
    this.btnExitCreditsScore = this.add.image(480,455,'btnExitCreditsScore').setScale(0.25).setAlpha(0.8);
		this.btnExitCreditsScore.setInteractive()
    .on('pointerdown', () => this.exitCreditsScore());

    this.btnExitCreditsScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitCreditsScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin victor
    this.btnLinkedinScoreVictor = this.add.image(525,93,'btnLinkedinScore').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinScoreVictor.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinScoreVictor.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinScoreVictor.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin ebi
    this.btnLinkedinScoreEbi = this.add.image(510,120,'btnLinkedinScore').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinScoreEbi.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinScoreEbi.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinScoreEbi.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Alberto
    this.btnLinkedinScoreAlberto = this.add.image(536,206,'btnLinkedinScore').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinScoreAlberto.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinScoreAlberto.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinScoreAlberto.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Nikola
    this.btnLinkedinScoreNikola = this.add.image(525,293,'btnLinkedinScore').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinScoreNikola.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinScoreNikola.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinScoreNikola.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Seven
    this.btnLinkedinScoreSeven = this.add.image(525,379,'btnLinkedinScore').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinScoreSeven.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinScoreSeven.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinScoreSeven.on('pointerout', function(pointer){
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
