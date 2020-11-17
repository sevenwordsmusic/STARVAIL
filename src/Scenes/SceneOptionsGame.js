import Audio from "../Audio.js";


export default class SceneOptionsGame extends Phaser.Scene {
  constructor() {
    super("SceneOptionsGame");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Options field
    //var optionsScreen=this.add.image(0,0,'OptionsScreen').setOrigin(0,0).setScale(0.25);

    //Background Pausa
    const bg = this.add.image(0,0,'white_rectangle').setOrigin(0).setScale(35).setDepth(-100).setAlpha(0.25);
    bg.tint = 0x000000;
    bg.alpha = 0.5;

    //Boton exit
    this.btnExitOptionsGame = this.add.image(480,455,'btnBack').setScale(0.25).setAlpha(0.8);
		this.btnExitOptionsGame.setInteractive()
    .on('pointerdown', () => this.exitOptions());

    this.btnExitOptionsGame.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
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

  update(time, delta){
    //AUDIO
      Audio.updateVolumes(this.scene);
    //
  }

}
