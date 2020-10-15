
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("ScenePause");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){


    //Pause menu
    this.load.image('PauseScreen', 'assets/Pause menu/Botones Mpausa.png'); //field
    this.load.image('btnResume', 'assets/Pause menu/btnResumePauseMenu.png'); //btn resume
    this.load.image('btnOptions', 'assets/Pause menu/btnOptionsPauseMenu.png'); //btn options
    this.load.image('btnExit', 'assets/Pause menu/btnExitPauseMenu.png'); //btn exit

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
    
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    this.cameras.main.setBackgroundColor(0x000000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    var PauseScreen=this.add.image(0,0,'PauseScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton resume
    this.botonResume = this.add.image(480,140,'btnResume').setScale(0.25);
		this.botonResume.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.resumeGame());

    //Boton options
    this.btnOptions = this.add.image(480,270,'btnOptions').setScale(0.25);
		this.btnOptions.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewOptions());

    //Boton exit
    this.botonExit = this.add.image(480,400,'btnExit').setScale(0.25);
		this.botonExit.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitGame());

  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  resumeGame(){
    console.log("Volviendo al juego");

    this.scene.sendToBack('ScenePause');
		this.scene.stop('ScenePause');
    this.scene.resume('SceneGameEbi');
    //this.scene.bringToTop("SceneGameEbi");
  }

  viewOptions(){
    this.scene.run("SceneOptionsGame");
    this.scene.bringToTop("SceneOptionsGame");
    this.scene.pause("ScenePause");
  }

  exitGame(){
    this.scene.start("SceneMM");
    this.scene.bringToTop("SceneMM");
    this.scene.stop("SceneGameEbi");

  }
}
