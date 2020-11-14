import Audio from "../Audio.js";
import SceneTest_1 from "./SceneTest_1.js";


export default class ScenePlayerName extends Phaser.Scene {
  constructor() {
    super("ScenePlayerName");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    this.showInput();

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x001191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //MM field
    //var MMScreen=this.add.image(0,0,'MMScreen').setOrigin(0,0).setScale(0.25);

    //Boton exit
    this.btnExitOptionsMM = this.add.image(360,455,'btnExitOptionsMM').setScale(0.25).setAlpha(0.8);
		this.btnExitOptionsMM.setInteractive({ useHandCursor: true  } )
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

    //Boton start
    this.botonStart = this.add.image(600,400, 'btnStart').setScale(0.25).setAlpha(0.8);
		this.botonStart.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.startGame());

    this.botonStart.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.botonStart.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitOptions(){
    console.log("Se ha pulsado exit");
      //AUDIO
        Audio.play2DinstanceRate(80, 1.0);
      //
    this.hideInput();

    this.btnExitOptionsMM.alpha=0.8;

    this.scene.sendToBack('ScenePlayerName');
		this.scene.stop('ScenePlayerName');
    this.scene.run('SceneMM');
    this.scene.bringToTop("SceneMM");
  }

  startGame(){
    console.log("Se ha pulsado start");
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
      Audio.play2DinstanceRate(83, 1.0);
      //
    this.game.playerName = document.getElementById("playerName").value;
    this.hideInput();

    this.game.prepareScreen();

    this.botonStart.alpha=0.8;

    this.scene.sendToBack('ScenePlayerName');
		this.scene.stop('ScenePlayerName');
    this.scene.run("levelFirst1");
    this.scene.bringToTop("levelFirst1");     //CAMBIAR
  }

  hideInput(){
    var input = document.getElementById("playerName");
    input.value = "";
    input.style.display = "none";
  }

  showInput(){
    var input = document.getElementById("playerName");
    input.value = "";
    input.style.display = "block";
  }

}
