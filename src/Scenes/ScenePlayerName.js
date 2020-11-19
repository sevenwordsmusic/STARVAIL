import Audio from "../Audio.js";
import Tutorial from "./Levels/Tutorial.js";


export default class ScenePlayerName extends Phaser.Scene {
  constructor() {
    super("ScenePlayerName");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    this.game.inPlayerName = true;
    //AUDIO
      
    //
    this.showInput();

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Menu
    this.add.image(0,0,'menuBackground').setOrigin(0).setDepth(-100);

    //Imagen Player Name
    this.add.image(230,130,'playerNameImg').setOrigin(0);

    //MM field
    //var MMScreen=this.add.image(0,0,'MMScreen').setOrigin(0,0).setScale(0.25);

    //Boton exit
    this.btnExitOptionsMM = this.add.image(360,400,'btnBack').setAlpha(0.8).setScale(1.2);
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

    //Boton start
    this.botonStart = this.add.image(600,400, 'btnStart').setAlpha(0.8);
		this.botonStart.setInteractive()
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

    this.game.inPlayerName = false;

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
      //
    this.game.playerName = document.getElementById("playerName").value.toUpperCase();
    if(this.game.playerName==""){
      this.game.playerName="PLAYER";
    }
    this.hideInput();

    this.game.inPlayerName = false;

    //this.game.prepareScreen();

    this.botonStart.alpha=0.8;

    this.scene.sendToBack('ScenePlayerName');
		this.scene.stop('ScenePlayerName');
    //this.scene.run('tutorial1');
    this.game.scene.add('', new Tutorial('tutorial' + ((Tutorial.getNumber()+ 1))) , true);
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
