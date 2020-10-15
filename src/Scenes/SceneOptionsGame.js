
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneOptionsGame");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){
    //Options menu
    this.load.image('OptionsScreen', 'assets/Options menu/OMScreen.png'); //field
    this.load.image('btnExit', 'assets/Options menu/btnExitOptionsMenu.png'); //btn exit
    this.load.image('btnMinus', 'assets/Options menu/btnMinusOptionsMenu.png'); //btn minus
    this.load.image('btnMusic', 'assets/Options menu/btnMusicOptionsMenu.png'); //btn music
    this.load.image('btnPlus', 'assets/Options menu/btnPlusOptionsMenu.png'); //btn plus
    this.load.image('btnSFX', 'assets/Options menu/btnSFXOptionsMenu.png'); //btn sfx
    
    //Corners
    this.load.image('corners', 'assets/Menu corners.png'); 
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    this.cameras.main.setBackgroundColor(0x000000);

    //Variables de prueba
    this.music=true;
    this.musicVolume=0;
    this.sfx=true;
    this.sfxVolume=0;

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x991191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Options field
    var optionsScreen=this.add.image(0,0,'OptionsScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton exit
    this.botonExit = this.add.image(480,455,'btnExit').setScale(0.25);
		this.botonExit.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitOptions());


    //MUSICA

    //Boton minus music
    this.botonMinusMusic = this.add.image(190,132,'btnMinus').setScale(0.25);
		this.botonMinusMusic.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.lowerMusic());

    //Boton music icon
    this.botonMusic = this.add.image(480,132,'btnMusic').setScale(0.25);
		this.botonMusic.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.muteUnmuteMusic());

    //Boton plus music
    this.botonPlusMusic = this.add.image(770,132,'btnPlus').setScale(0.25);
		this.botonPlusMusic.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.louderMusic());

    //SFX

    //Boton minus sfx
    this.botonMinusSFX = this.add.image(190,284,'btnMinus').setScale(0.25);
		this.botonMinusSFX.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.lowerSFX());

    //Boton sfx icon
    this.botonSFX = this.add.image(480,284,'btnSFX').setScale(0.25);
		this.botonSFX.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.muteUnmuteSFX());

    //Boton plus sfx
    this.botonPlusSFX = this.add.image(770,284,'btnPlus').setScale(0.25);
		this.botonPlusSFX.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.louderSFX());
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitOptions(){
    console.log("Se ha pulsado exit");

    this.scene.sendToBack('SceneOptionsGame');
		this.scene.stop('SceneOptionsGame');
    this.scene.resume('ScenePause');
    this.scene.bringToTop("ScenePause");
  }

  //Funciones musica
  lowerMusic(){
    if(!this.music){
    this.music=true;
    console.log("Musica se desmutea");
    }

    if(this.musicVolume>-3){
    this.musicVolume--;
    console.log("-1 en musica");
    }else{
      console.log("Musica al minimo");
    }
  }

  muteUnmuteMusic(){
    if(this.music){
      console.log("Musica se mutea");
      this.music=false;
    }else{
      this.music=true;
      console.log("Musica se desmutea");
    }
  }

  louderMusic(){
    if(!this.music){
    this.music=true;
    console.log("Musica se desmutea");
    }

    if(this.musicVolume<3){
    this.musicVolume++;
    console.log("+1 en musica");
    }else{
      console.log("Musica al maximo");
    }
  }

  //Funciones SFX
  lowerSFX(){
    if(!this.sfx){
    this.sfx=true;
    console.log("SFX se desmutea");
    }

    if(this.sfxVolume>-3){
    this.sfxVolume--;
    console.log("-1 en SFX");
    }else{
      console.log("SFX al minimo");
    }
  }

  muteUnmuteSFX(){
    if(this.sfx){
      console.log("SFX se mutea");
      this.sfx=false;
    }else{
      this.sfx=true;
      console.log("SFX se desmutea");
    }
  }

  louderSFX(){
    if(!this.sfx){
    this.sfx=true;
    console.log("SFX se desmutea");
    }
    
    if(this.sfxVolume<3){
    this.sfxVolume++;
    console.log("+1 en SFX");
    }else{
      console.log("SFX al maximo");
    }
  }


}
