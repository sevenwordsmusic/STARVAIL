import Audio from "../Audio.js";

export default class SceneCredits extends Phaser.Scene {
  constructor() {
    super("SceneCredits");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
      Audio.fullscreenMode(this);
      //
    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Menu
    this.add.image(0,0,'menuBackground').setOrigin(0).setDepth(-100);
    //Oscurecer background
    const bg = this.add.image(0,0,'white_rectangle').setOrigin(0).setScale(35).setDepth(-100).setAlpha(0.25);
    bg.tint = 0x000000;
    bg.alpha = 0.7;
    
    //Credits field
    var creditsScreen=this.add.image(0,0,'CreditsScreen').setOrigin(0,0).setAlpha(0.8);

    //Boton exit
    this.btnExitCredits = this.add.image(481,455,'btnBack').setAlpha(0.8);
		this.btnExitCredits.setInteractive()
    .on('pointerdown', () => this.exitCredits());

    this.btnExitCredits.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.btnExitCredits.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin victor
    this.btnVictor = this.add.image(51,45,'btnContacto').setScale(0.25).setAlpha(0.8);
		this.btnVictor.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/v%C3%ADctor-sierra-fern%C3%A1ndez-6a1a571bb/"));

    this.btnVictor.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnVictor.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Nikola
    this.btnNikola = this.add.image(51,128,'btnContacto').setScale(0.25).setAlpha(0.8);
		this.btnNikola.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/nikola-hristov-kalamov/"));

    this.btnNikola.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnNikola.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Seven
    this.btnSeven = this.add.image(51,210,'btnContacto').setScale(0.25).setAlpha(0.8);
		this.btnSeven.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://www.youtube.com/channel/UC_QZH47UacK5fEiKjB37Qjg"));

    this.btnSeven.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnSeven.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Alberto
    this.btnAlberto = this.add.image(51,292,'btnContacto').setScale(0.25).setAlpha(0.8);
		this.btnAlberto.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://twitter.com/lordarner"));

    this.btnAlberto.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnAlberto.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

     //Boton linkedin ebi
     this.btnEbi = this.add.image(51,374,'btnContacto').setScale(0.25).setAlpha(0.8);
     this.btnEbi.setInteractive()
     .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));
 
     this.btnEbi.on('pointerover', function(pointer){
       this.alpha=1;
     });
 
     this.btnEbi.on('pointerout', function(pointer){
       this.alpha=0.8;
     });

    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitCredits(){
    console.log("Se ha pulsado exit");
      //AUDIO
        Audio.play2DinstanceRate(80, 1.0);
      //
    this.btnExitCredits.alpha=0.8;

    this.scene.sendToBack('SceneCredits');
		this.scene.stop('SceneCredits');
    this.scene.resume('SceneMM');
    this.scene.bringToTop("SceneMM");
  }

  irAlLink(urllink){
    //window.location.href = 'https://www.youtube.com/watch?v=5XjcUvaDTK4&t=408s&ab_channel=gammafp';

    this.url = urllink;
    window.open(this.url);
  }
}
