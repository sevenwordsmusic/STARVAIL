
export default class SceneSplashScreen extends Phaser.Scene {
  constructor() {
    super("SceneSplashScreen");
  }

  preload(){
    //Splash menu
    this.load.image('btnTitle', 'assets/lowResLogo.png');
    this.load.image('corners', 'assets/Menu corners.png');
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    this.game.prepareScreen();

    this.scene.run("Audio");

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x091191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Boton exit
    this.btnTitle = this.add.image(480,270,'btnTitle').setScale(0.5).setAlpha(0);

    this.game.spashScreen = this;

    this.tweens.add({
      targets: this.btnTitle,
      duration:1000,
      alpha:{ from: 0, to: 1 }
    })
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  finishedLoading(){
    this.tweens.add({
      targets: this.btnTitle,
      duration:1000,
      alpha:{ from: 1, to: 0 },
      onComplete:()=>this.startTheGame()
    })
    this.game.spashScreen = undefined;
  }

  startTheGame(){
    console.log("Empezamos el juego");

    this.scene.sendToBack('SceneSplashScreen');
		this.scene.stop('SceneSplashScreen');


    //SI SE QUIEREN TESTEAR MENUS
    //this.scene.start('SceneMM');

    //SI SE QUIEREN TESTEAR NIVELES
    this.scene.start("levelFirst1");

    //SI SE QUIERE IR AL NIVEL DE PRUEBA
    //this.scene.start("test1");
  }

}
