
export default class SceneScore extends Phaser.Scene {
  constructor() {
    super("SceneScore");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x900990);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Score field
    var ScoreScreen=this.add.image(0,0,'ScoreScreen').setOrigin(0,0).setScale(0.25);

    //Boton credits
    this.btnViewCreditsScore = this.add.image(213,459,'btnCreditsScore').setScale(0.25).setAlpha(0.8);
		this.btnViewCreditsScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewCreditsScore());

    this.btnViewCreditsScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnViewCreditsScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton exit
    this.btnExitScore = this.add.image(746,459,'btnExitScore').setScale(0.25).setAlpha(0.8);
		this.btnExitScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.exitScore());

    this.btnExitScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton ranking
    this.btnRankingScore = this.add.image(479,459,'btnRankingScore').setScale(0.25).setAlpha(0.8);
		this.btnRankingScore.setInteractive({ useHandCursor: true  } )
    .on('pointerdown', () => this.viewRankingScore());

    this.btnRankingScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnRankingScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Calcular puntuacion
    //En funcion del tiempo, kills, eventos especiales y tipo de final
    var finalScore;

    var totalTime=2; //considerado en minutos
    var totalKills=20;
    var specialEvents=1;
    var tipoFinal="bueno";

    finalScore= specialEvents*3000+totalKills*50;

    if(tipoFinal=="bueno"){
      finalScore+=5000;
    }else if(tipoFinal=="malo"){
      finalScore-=5000;
    }else{
      finalScore+=1000;
    }

    if(totalTime<=5){
      finalScore+=2000;
    }else if(totalTime>5 && totalTime<=7){
      finalScore+=1500;
    }else if(totalTime>7 && totalTime<=10){
      finalScore+=750;
    }else{
      finalScore+=300;
    }


    //this.add.bitmapText(480,270,'font','0',100);

    //No se porque no sale la fuente bien
    this.add.text(10, 10, finalScore, {fontFamily: 'LeahFat', fontSize: '10em'});

  }

  //Método que se ejecuta una vez por frame.
  update(){

  }

  viewCreditsScore(){
    console.log("Se ha pulsado credits");

    this.btnViewCreditsScore.alpha=0.8;

    this.scene.run("SceneCreditsScore");
    this.scene.bringToTop("SceneCreditsScore");
    this.scene.pause("SceneScore");

  }

  exitScore(){
    console.log("Se ha pulsado exit");

    this.btnExitScore.alpha=0.8;

    this.scene.stop('SceneScore');

    /*
    this.scene.start('SceneMM');
    this.scene.bringToTop("SceneMM");
    */
   var SceneMMR = this.scene.get('SceneMM');

   SceneMMR.scene.restart();
  }

  viewRankingScore(){
    console.log("Se ha pulsado Ranking");

    this.btnRankingScore.alpha=0.8;

    this.scene.run("SceneRanking");
    this.scene.bringToTop("SceneRanking");
    this.scene.pause("SceneScore");

  }
}
