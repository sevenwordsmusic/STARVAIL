import Audio from "../Audio.js";


export default class SceneOptionsGame extends Phaser.Scene {
  constructor() {
    super("SceneOptionsGame");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    this.cameras.main.setBackgroundColor(0x000099);

    //Variables de prueba
    this.music=true;
    this.musicVolume=0;
    this.sfx=true;
    this.sfxVolume=0;

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000091);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Options field
    //var optionsScreen=this.add.image(0,0,'OptionsScreen').setOrigin(0,0).setScale(0.25);

    //Boton exit
    this.btnExitOptionsGame = this.add.image(480,455,'btnExitOptionsGame').setScale(0.25).setAlpha(0.8);
		this.btnExitOptionsGame.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitOptions());

    this.btnExitOptionsGame.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitOptionsGame.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
    this.showSliders();
  }


  showSliders(){
    var soundSliders = document.getElementById("soundSliders");
    soundSliders.style.display = "block";
  }


  hideSliders(){
    var soundSliders = document.getElementById("soundSliders");
    soundSliders.style.display = "none";
  }


  exitOptions(){
    console.log("Se ha pulsado exit");
    this.hideSliders();
      //AUDIO
        Audio.play2DinstanceRate(80, 1.0);
      //
    this.btnExitOptionsGame.alpha=0.8;

    this.scene.sendToBack('SceneOptionsGame');
		this.scene.stop('SceneOptionsGame');
    this.scene.resume('ScenePause');
    this.scene.bringToTop("ScenePause");
  }

}
