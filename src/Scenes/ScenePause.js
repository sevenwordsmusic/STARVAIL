
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("ScenePause");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){


    //Pause menu
    this.load.image('PauseScreen', 'assets/Pause menu/Botones Mpausa.png'); //field
    this.load.image('btnResumeGamePause', 'assets/Pause menu/btnResumePauseMenu.png'); //btn resume
    this.load.image('btnOptionsGame', 'assets/Pause menu/btnOptionsPauseMenu.png'); //btn options
    this.load.image('btnExitPause', 'assets/Pause menu/btnExitPauseMenu.png'); //btn exit

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
    
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    this.cameras.main.setBackgroundColor(0x009000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    //var PauseScreen=this.add.image(0,0,'PauseScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton resume
    this.btnResumeGamePause = this.add.image(480,140,'btnResumeGamePause').setScale(0.25).setAlpha(0.8);
		this.btnResumeGamePause.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.resumeGamePause());

    this.btnResumeGamePause.on('pointerover', function(pointer){
      this.alpha=1;
    });
    
    this.btnResumeGamePause.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton options
    this.btnOptionsGame = this.add.image(480,270,'btnOptionsGame').setScale(0.25).setAlpha(0.8);
		this.btnOptionsGame.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewOptions());

    this.btnOptionsGame.on('pointerover', function(pointer){
      this.alpha=1;
    });
    
    this.btnOptionsGame.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton exit
    this.btnExitPause = this.add.image(480,400,'btnExitPause').setScale(0.25).setAlpha(0.8);
		this.btnExitPause.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitGame());

    this.btnExitPause.on('pointerover', function(pointer){
      this.alpha=1;
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

    this.btnResumeGamePause.alpha=0.8;

    this.scene.sendToBack('ScenePause');
		this.scene.stop('ScenePause');
    this.scene.resume('SceneGameEbi');
    this.scene.bringToTop("SceneGameEbi");
  }

  viewOptions(){
    console.log("Entrando a options");

    this.btnOptionsGame.alpha=0.8;
    
    this.scene.run("SceneOptionsGame");
    this.scene.bringToTop("SceneOptionsGame");
    this.scene.pause("ScenePause");
  }

  exitGame(){

    this.btnExitPause.alpha=0.8;

    this.scene.start("SceneMM");
    this.scene.bringToTop("SceneMM");
    this.scene.stop("SceneGameEbi");
  }
}
