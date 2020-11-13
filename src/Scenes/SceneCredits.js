import Audio from "../Audio.js";

export default class SceneCredits extends Phaser.Scene {
  constructor() {
    super("SceneCredits");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x091191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    var creditsScreen=this.add.image(0,0,'CreditsScreen').setOrigin(0,0).setScale(0.25).setAlpha(0.8);

    //Boton exit
    this.btnExitCredits = this.add.image(480,455,'btnExitCredits').setScale(0.25).setAlpha(0.8);
		this.btnExitCredits.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitCredits());

    this.btnExitCredits.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.2);
      //
    });

    this.btnExitCredits.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin victor
    this.btnLinkedinVictor = this.add.image(525,93,'btnLinkedin').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinVictor.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinVictor.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinVictor.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin ebi
    this.btnLinkedinEbi = this.add.image(510,120,'btnLinkedin').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinEbi.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinEbi.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinEbi.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Alberto
    this.btnLinkedinAlberto = this.add.image(536,206,'btnLinkedin').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinAlberto.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinAlberto.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinAlberto.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Nikola
    this.btnLinkedinNikola = this.add.image(525,293,'btnLinkedin').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinNikola.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinNikola.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinNikola.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton linkedin Seven
    this.btnLinkedinSeven = this.add.image(525,379,'btnLinkedin').setScale(0.25).setAlpha(0.8);
		this.btnLinkedinSeven.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.irAlLink("https://www.linkedin.com/in/eusebiu-costinel-delcea/"));

    this.btnLinkedinSeven.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnLinkedinSeven.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitCredits(){
    console.log("Se ha pulsado exit");
      //AUDIO
        Audio.play2DinstanceRate(80, 1.2);
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
