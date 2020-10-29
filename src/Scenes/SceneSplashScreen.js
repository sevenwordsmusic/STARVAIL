
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneSplashScreen");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){
    
    //Splash menu
    this.load.image('btnTitle', 'assets/Credits menu/btnExitCredits.png'); //btn titulo

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');

  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x091191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Boton exit
    this.btnTitle = this.add.image(480,455,'btnTitle').setScale(0.25).setAlpha(0);

    this.tweens.add({
      targets: this.btnTitle,
      duration:1500,
      alpha:1,
      yoyo:true,
      hold:2000,
      delay:500,
      completeDelay:500,
      onComplete:()=>this.startTheGame()
    })
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  startTheGame(){
    console.log("Empezamos el juego");

    this.scene.sendToBack('SceneSplashScreen');
		this.scene.stop('SceneSplashScreen');
    this.scene.start('SceneMM');
    this.scene.bringToTop("SceneMM");
  }

}
