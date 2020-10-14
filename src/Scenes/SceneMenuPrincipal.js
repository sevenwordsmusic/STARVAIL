
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneMP");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){

    //Menu principal
    this.load.image('fondoMenuPrinc', 'assets/Menu principal/Botones MP.png'); //fondo
    this.load.image('btnStart', 'assets/Menu principal/Boton start.png'); //btn start
    this.load.image('btnCredits', 'assets/Menu principal/Boton credits.png'); //btn credits
    this.load.image('btnOptions', 'assets/Menu principal/Boton options.png'); //btn options
    
    //Esquinas
    this.load.image('esquinas', 'assets/Esquinas Menus.png'); 
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x001191);

    //Esquinas
    var esquinas =this.add.image(this.centerX,this.centerY,'esquinas').setOrigin(0);
    esquinas.displayWidth=960;
    esquinas.displayHeight=540;

    //Fondo MP
    var menuPrinc=this.add.image(this.centerX,this.centerY,'fondoMenuPrinc').setOrigin(0,0).setScale(0.25);
    menuPrinc.displayWidth=960;
    menuPrinc.displayHeight=540;
    
    //Boton credits
    var btnCredits=this.botonCredits = this.add.image(100,100, 'btnCredits').setScale(0.25);
		this.botonCredits.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewCredits());
    
    /*
    //Boton start
    this.botonStart = this.add.image(this.centerX, this.centerY, 'btnStart');
		this.botonStart.setInteractive({ useHandCursor: true  } )
		.on('pointerdown', () => this.startGame());

    //Boton options
		this.botonOptions = this.add.image(this.centerX, this.centerY*1.2, 'btnOptions');
		this.botonOptions.setInteractive({ useHandCursor: true  } )
		.on('pointerdown', () => this.viewOptions());
*/
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  viewCredits(){
    console.log("Se ha pulsado credits");
  }

  startGame(){
		console.log("Se ha pulsado start");
  }
  
  viewOptions(){
    console.log("Se ha pulsado options");
  }

}
