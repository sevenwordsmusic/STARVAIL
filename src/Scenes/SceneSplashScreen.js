import Audio from "../Audio.js";
export default class SceneSplashScreen extends Phaser.Scene {
  constructor() {
    super("SceneSplashScreen");
  }

  preload(){
    //AUDIO
      if (this.game.onPC) {
        this.load.audio('musicLoop0000chill', 'assets/audio/BGM/musicLoop0000chill.ogg');
      }else{
        this.load.audio('musicLoop0000chill', 'assets/audio/BGM/musicLoop0000chill_mobile.ogg');
      }
    //
    //Splash menu
    this.load.image('btnTitle', 'assets/lowResLogo.png');
    this.load.image('corners', 'assets/HUD/Menu corners.png');
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
    //Audio.fullscreenMode(this);

        Audio.musicLoop0000chill= this.sound.add('musicLoop0000chill', {
            volume: 0.0,
            loop: true
        })
        Audio.splashMusic(this);
    //

    //this.game.prepareScreen();

    this.scene.run("Audio");

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000000);


    //Boton exit
    this.btnTitle = this.add.image(480,270,'btnTitle').setScale(1.0).setAlpha(0);

    this.game.spashScreen = this;

    this.tweens.add({
      targets: this.btnTitle,
      duration: Audio.barRateDiv[2],
      alpha:{ from: 0, to: 1 }
    })

    this.input.setDefaultCursor('url(assets/HUD/cursor.png), pointer');
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  finishedLoading(){
    this.tweens.add({
      targets: this.btnTitle,
      duration: Audio.barRateDiv[2],
      alpha:{ from: 1, to: 0 },
      onComplete:()=>this.startTheGame()
    })
    //AUDIO
      Audio.startMusicEngine(this);
    //
    this.game.spashScreen = undefined;
  }

  startTheGame(){
    console.log("Empezamos el juego");
    this.scene.sendToBack('SceneSplashScreen');
		this.scene.stop('SceneSplashScreen');


    //SI SE QUIEREN TESTEAR MENUS
    this.scene.start('SceneMM');

    //SI SE QUIEREN TESTEAR NIVELES
    //this.scene.start("tutorial1");
    //this.scene.start("levelFirst1");
    //this.scene.start("levelSecond1");
    //this.scene.start("levelThird1");
    //this.scene.start("levelBoss1");
    //this.scene.start("SceneCreditsScore");

    //SI SE QUIERE IR AL NIVEL DE PRUEBA
    //this.scene.start("test1");

    //this.scene.start("SceneScore");
    //this.scene.start("ScenePause");

    //PUNTUACIONES
    //this.scene.start("SceneScore");
  }

}
