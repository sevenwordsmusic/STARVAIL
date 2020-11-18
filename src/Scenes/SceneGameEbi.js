
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneGameEbi");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){
    //AUDIO
      Audio.fullscreenMode(this);
      //
    this.load.image('ebi', 'assets/Escena boton pausa.png'); //field
    this.load.image('btnPause', 'assets/BtnPauseGame.png'); //btn pause
    this.load.image('btnMuerte', 'assets/BtnPauseGame.png'); //btn pause
    this.load.image('btnScore', 'assets/BtnPauseGame.png'); //btn pause


    //Corners
    this.load.image('corners', 'assets/Menu corners.png');

  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    this.cameras.main.setBackgroundColor(0x009991);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Options field
    //var ebi=this.add.image(0,0,'ebi').setOrigin(0,0).setScale(0.25);

    //Boton pause
    this.botonPause = this.add.image(880,78,'btnPause').setScale(0.25).setAlpha(0.8);
		this.botonPause.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.pauseGame());

    this.botonPause.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonPause.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Pausa a traves de teclado
    //Creamos la tecla correspondiente con ESCAPE
    this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.inPause=false;

    //Boton muerte
    this.botonMuerte = this.add.image(260,270,'btnMuerte').setScale(0.25);
		this.botonMuerte.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.gameOver());

    //Boton score
    this.botonScore = this.add.image(700,270,'btnScore').setScale(0.25);
		this.botonScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.gameScore());
  }

  //Método que se ejecuta una vez por frame.
  update(){

    console.log(this.inPause);

    if (this.ESC.isDown){
      if (!this.inPause) {
        this.inPause = true;
      }
    }


    if (this.ESC.isUp) {
      if (this.inPause){
      this.inPause = false;
      this.pauseGame();
      }
    }
  }

  pauseGame(){
    console.log("Juego pausado");

    this.botonPause.alpha=0.8;

    this.scene.run("ScenePause");
    this.scene.bringToTop("ScenePause");
    this.scene.pause("SceneGameEbi");
  }

  gameOver(){
    console.log("Juego terminado");

    this.scene.start("SceneGameOver");
    this.scene.bringToTop("SceneGameOver");
    this.scene.stop("SceneGameEbi");

  }

  gameScore(){
    console.log("Pantalla de puntuacion");

    this.scene.start("SceneScore");
    this.scene.bringToTop("SceneScore");
    this.scene.stop("SceneGameEbi");

  }
}
