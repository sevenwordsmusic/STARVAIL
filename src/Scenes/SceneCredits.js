
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneCredits");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){

    //Credits menu
    this.load.image('CreditsScreen', 'assets/Credits menu/CMScreen.png'); //field
    this.load.image('btnExit', 'assets/Credits menu/btnExitCredits.png'); //btn exit

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x001191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    var creditsScreen=this.add.image(0,0,'CreditsScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton exit
    this.botonExit = this.add.image(480,455,'btnExit').setScale(0.25);
		this.botonExit.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitCredits());

  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitCredits(){
    console.log("Se ha pulsado exit");

    this.scene.sendToBack('SceneCredits');
		this.scene.stop('SceneCredits');
    this.scene.resume('SceneMM');
    this.scene.bringToTop("SceneMM");
  }
}
