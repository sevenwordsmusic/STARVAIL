import Audio from "../Audio.js";
import SceneTest_1 from "./SceneTest_1.js"
/*import SceneTest_2 from "./SceneTest_2.js"
import SceneTest_2 from "./SceneTest_2.js"*/

export default class ScenePause extends Phaser.Scene {
  constructor() {
    super("ScenePause");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
      Audio.pause(this);
    //

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Pausa
    const bg = this.add.image(0,0,'white_rectangle').setOrigin(0).setScale(35).setDepth(-100).setAlpha(0.25);
    bg.tint = 0x000000;
    bg.alpha = 0.5;

    //Credits field
    //var PauseScreen=this.add.image(0,0,'PauseScreen').setOrigin(0,0).setScale(0.25);

    //Boton resume
    this.btnResumeGamePause = this.add.image(480,140,'btnResumeGamePause').setAlpha(0.8);
		this.btnResumeGamePause.setInteractive()
    .on('pointerdown', () => this.resumeGamePause());

    this.btnResumeGamePause.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.btnResumeGamePause.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton options
    this.btnOptionsGame = this.add.image(480,270,'btnOptionsGame').setAlpha(0.8);
		this.btnOptionsGame.setInteractive()
    .on('pointerdown', () => this.viewOptions());

    this.btnOptionsGame.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.btnOptionsGame.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton exit
    this.btnExitPause = this.add.image(480,400,'btnExitPause').setAlpha(0.8);
		this.btnExitPause.setInteractive()
    .on('pointerdown', () => this.exitGame());

    this.btnExitPause.on('pointerover', function(pointer){
      this.alpha=1;
      //AUDIO
        Audio.play2DinstanceRate(79, 1.0);
      //
    });

    this.btnExitPause.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  resumeGamePause(){
    console.log("Volviendo al juego desde el menu de pausa");
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
        Audio.resume(this);
      //
    this.btnResumeGamePause.alpha=0.8;

    this.input.setDefaultCursor('none');

    this.scene.sendToBack('ScenePause');
		this.scene.stop('ScenePause');
    this.scene.resume(this.game.pauseInfo);
    this.scene.bringToTop(this.game.pauseInfo);
  }

  viewOptions(){
    console.log("Entrando a options");
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
      //
    this.btnOptionsGame.alpha=0.8;

    this.scene.run("SceneOptionsGame");
    this.scene.bringToTop("SceneOptionsGame");
    this.scene.pause("ScenePause");
    this.scene.sendToBack("ScenePause");
  }

  exitGame(){
      //AUDIO
        Audio.play2DinstanceRate(81, 1.0);
      //
    this.btnExitPause.alpha=0.8;

    this.scene.start("SceneMM");
    this.scene.bringToTop("SceneMM");
    this.scene.stop('test' + (SceneTest_1.getNumber()));
  }
}
