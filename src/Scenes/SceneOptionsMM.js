import Audio from "../Audio.js";

export default class SceneOptionsMM extends Phaser.Scene {
  constructor() {
    super("SceneOptionsMM");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Background Menu
    this.add.image(0,0,'menuBackground').setOrigin(0).setDepth(-100);

    //Options field
    //var optionsScreen=this.add.image(0,0,'OptionsScreen').setOrigin(0,0).setScale(0.25);

    //Boton exit
    this.btnExitOptionsMM = this.add.image(480,455,'btnExitOptionsMM').setScale(0.25).setAlpha(0.8);
		this.btnExitOptionsMM.setInteractive()
    .on('pointerdown', () => this.exitOptions());

    this.btnExitOptionsMM.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.btnExitOptionsMM.on('pointerout', function(pointer){
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
    this.btnExitOptionsMM.alpha=0.8;

    this.scene.sendToBack('SceneOptionsMM');
		this.scene.stop('SceneOptionsMM');
    this.scene.resume('SceneMM');
    this.scene.bringToTop("SceneMM");
  }

  update(time, delta){
    //AUDIO
      Audio.updateVolumes(this.scene);
    //
  }

}
