
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneCredits");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){

    //Credits menu
    this.load.image('CreditsScreen', 'assets/Credits menu/CMScreen.png'); //field
    this.load.image('btnExitCredits', 'assets/Credits menu/btnExitCredits.png'); //btn exit

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x091191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Credits field
    //var creditsScreen=this.add.image(0,0,'CreditsScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton exit
    this.btnExitCredits = this.add.image(480,455,'btnExitCredits').setScale(0.25).setAlpha(0.8);
		this.btnExitCredits.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitCredits());

    this.btnExitCredits.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitCredits.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitCredits(){
    console.log("Se ha pulsado exit");

    this.btnExitCredits.alpha=0.8;

    this.scene.sendToBack('SceneCredits');
		this.scene.stop('SceneCredits');
    this.scene.resume('SceneMM');
    this.scene.bringToTop("SceneMM");
  }
}
