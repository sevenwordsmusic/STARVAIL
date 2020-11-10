
export default class SceneOptionsMM extends Phaser.Scene {
  constructor() {
    super("SceneOptionsMM");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Variables de prueba
    this.music=true;
    this.musicVolume=0;
    this.sfx=true;
    this.sfxVolume=0;

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x990001);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Options field
    //var optionsScreen=this.add.image(0,0,'OptionsScreen').setOrigin(0,0).setScale(0.25);

    //Boton exit
    this.btnExitOptionsMM = this.add.image(480,455,'btnExitOptionsMM').setScale(0.25).setAlpha(0.8);
		this.btnExitOptionsMM.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitOptions());

    this.btnExitOptionsMM.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitOptionsMM.on('pointerout', function(pointer){
      this.alpha=0.8;
    });


    //MUSICA

    //Boton minus music
    this.botonMinusMusic = this.add.image(190,132,'btnMinus').setScale(0.25).setAlpha(0.8);
		this.botonMinusMusic.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.lowerMusic());

    this.botonMinusMusic.on('pointerup', function(pointer){
      this.clearTint();
    });

    this.botonMinusMusic.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonMinusMusic.on('pointerout', function(pointer){
      this.clearTint();
      this.alpha=0.8;
    });

    //Boton music icon
    this.botonMusic = this.add.image(480,132,'btnMusic').setScale(0.25).setAlpha(0.8);
		this.botonMusic.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.muteUnmuteMusic());

    this.botonMusic.on('pointerup', function(pointer){
      this.clearTint();
    });

    this.botonMusic.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonMusic.on('pointerout', function(pointer){
      this.clearTint();
      this.alpha=0.8;
    });

    //Boton plus music
    this.botonPlusMusic = this.add.image(770,132,'btnPlus').setScale(0.25).setAlpha(0.8);
		this.botonPlusMusic.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.louderMusic());

    this.botonPlusMusic.on('pointerup', function(pointer){
      this.clearTint();
    });

    this.botonPlusMusic.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonPlusMusic.on('pointerout', function(pointer){
      this.clearTint();
      this.alpha=0.8;
    });

    //SFX

    //Boton minus sfx
    this.botonMinusSFX = this.add.image(190,284,'btnMinus').setScale(0.25).setAlpha(0.8);
		this.botonMinusSFX.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.lowerSFX());

    this.botonMinusSFX.on('pointerup', function(pointer){
      this.clearTint();
    });

    this.botonMinusSFX.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonMinusSFX.on('pointerout', function(pointer){
      this.clearTint();
      this.alpha=0.8;
    });

    //Boton sfx icon
    this.botonSFX = this.add.image(480,284,'btnSFX').setScale(0.25).setAlpha(0.8);
		this.botonSFX.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.muteUnmuteSFX());

    this.botonSFX.on('pointerup', function(pointer){
      this.clearTint();
    });

    this.botonSFX.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonSFX.on('pointerout', function(pointer){
      this.clearTint();
      this.alpha=0.8;
    });

    //Boton plus sfx
    this.botonPlusSFX = this.add.image(770,284,'btnPlus').setScale(0.25).setAlpha(0.8);
		this.botonPlusSFX.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.louderSFX());

    this.botonPlusSFX.on('pointerup', function(pointer){
      this.clearTint();
    });

    this.botonPlusSFX.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.botonPlusSFX.on('pointerout', function(pointer){
      this.clearTint();
      this.alpha=0.8;
    });
  }

  //Método que se ejecuta una vez por frame.
  update(){

    //Cambiamos la posicion del boton de musica en funcion del valor del volumen de la musica
    switch(this.musicVolume){

      case -3:
        this.botonMusic.x = 300;
        break;

      case -2:
        this.botonMusic.x = 360;
        break;

      case -1:
        this.botonMusic.x = 420;
        break;

      case 0:
        this.botonMusic.x = 480;
        break;

      case 1:
        this.botonMusic.x = 540;
        break;

      case 2:
        this.botonMusic.x = 600;
        break;

      case 3:
        this.botonMusic.x = 660;
        break;
    }

    //Cambiamos la posicion del boton de SFX en funcion del valor del volumen del SFX
    switch(this.sfxVolume){

      case -3:
        this.botonSFX.x = 300;
        break;

      case -2:
        this.botonSFX.x = 360;
        break;

      case -1:
        this.botonSFX.x = 420;
        break;

      case 0:
        this.botonSFX.x = 480;
        break;

      case 1:
        this.botonSFX.x = 540;
        break;

      case 2:
        this.botonSFX.x = 600;
        break;

      case 3:
        this.botonSFX.x = 660;
        break;
    }

  }

  exitOptions(){
    console.log("Se ha pulsado exit");

    this.btnExitOptionsMM.alpha=0.8;

    this.scene.sendToBack('SceneOptionsMM');
		this.scene.stop('SceneOptionsMM');
    this.scene.resume('SceneMM');
    this.scene.bringToTop("SceneMM");
  }

  //Funciones musica
  lowerMusic(){

    this.botonMinusMusic.setTint(0x999999);

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

    this.botonMusic.setTint(0x999999);

    if(this.music){
      console.log("Musica se mutea");
      this.music=false;
    }else{
      this.music=true;
      console.log("Musica se desmutea");
    }
  }

  louderMusic(){

    this.botonPlusMusic.setTint(0x999999);

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

    this.botonMinusSFX.setTint(0x999999);

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

    this.botonSFX.setTint(0x999999);

    if(this.sfx){
      console.log("SFX se mutea");
      this.sfx=false;
    }else{
      this.sfx=true;
      console.log("SFX se desmutea");
    }
  }

  louderSFX(){

    this.botonPlusSFX.setTint(0x999999);

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
