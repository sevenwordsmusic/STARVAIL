
export default class SceneExample extends Phaser.Scene {
  constructor() {
    super("SceneRanking");
  }


  //Se carga antes de ejecutar la escena. En este sitio se asignan las variables, se buscan los assets que se van a usar, se llama a los plugins, etc.
  preload(){

    //Credits menu
    this.load.image('RankingScreen', 'assets/Ranking menu/Botones Ranking.png'); //field
    this.load.image('btnExitRanking', 'assets/Ranking menu/btnExitRanking.png'); //btn exit

    //Corners
    this.load.image('corners', 'assets/Menu corners.png');
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x091191);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Ranking field
    var creditsScreen=this.add.image(0,0,'RankingScreen').setOrigin(0,0).setScale(0.25);
    
    //Boton exit
    this.btnExitRanking = this.add.image(480,455,'btnExitRanking').setScale(0.25).setAlpha(0.8);
		this.btnExitRanking.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitRanking());

    this.btnExitRanking.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitRanking.on('pointerout', function(pointer){
      this.alpha=0.8;
    });
  
  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  exitRanking(){
    console.log("Se ha pulsado exit");

    this.btnExitRanking.alpha=0.8;

    this.scene.sendToBack('SceneRanking');
		this.scene.stop('SceneRanking');
    this.scene.resume('SceneScore');
    this.scene.bringToTop("SceneScore");
  }
}
