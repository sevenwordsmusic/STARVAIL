
export default class SceneScore extends Phaser.Scene {
  constructor() {
    super("SceneScore");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0x000000);

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0).setScale(0.25);

    //Background Final
    this.add.image(0,0,'endBackground').setOrigin(0).setDepth(-100);

    //Score field
    var ScoreScreen=this.add.image(0,0,'ScoreScreen').setOrigin(0,0).setScale(0.25);

    //Boton credits
    this.btnViewCreditsScore = this.add.image(213,459,'btnCreditsScore').setScale(0.25).setAlpha(0.8);
		this.btnViewCreditsScore.setInteractive()
    .on('pointerdown', () => this.viewCreditsScore());

    this.btnViewCreditsScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnViewCreditsScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton exit
    this.btnExitScore = this.add.image(746,459,'btnExitScore').setScale(0.25).setAlpha(0.8);
		this.btnExitScore.setInteractive()
    .on('pointerdown', () => this.exitScore());

    this.btnExitScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton ranking
    this.btnRankingScore = this.add.image(479,459,'btnRankingScore').setScale(0.25).setAlpha(0.8);
		this.btnRankingScore.setInteractive()
    .on('pointerdown', () => this.viewRankingScore());

    this.btnRankingScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnRankingScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Calcular puntuacion
    //En funcion del tiempo, kills, eventos especiales y tipo de final
    var finalScore = this.game.points;

    const totalTime = this.game.time/1000/60; //considerado en minutos
    const maxTime = this.game.maxTime/1000/60;
    const scoreForBestTime = 3000;

    var timeScore = Math.max(0,Math.min(scoreForBestTime, 2*scoreForBestTime - (maxTime/1000)*totalTime));

    const totalKills = this.game.enemiesKilled;
    const specialEvents = this.game.npcHelped;
    var tipoFinal="";

    if(this.game.timeExpired){
      tipoFinal="Bad Ending"
      finalScore -= 1000;
      timeScore = 0;
    }else{
      if(this.game.npcHelped >= 2){
        tipoFinal="Good Ending"
        finalScore += 5000;
        timeScore += 1000;
      }else{
      tipoFinal="Neutral Ending"
        finalScore += 1000;
      }
    }

    finalScore += timeScore;

    //this.add.bitmapText(480,270,'font','0',100);

    //No se porque no sale la fuente bien
    var txt1 = this.add.text(140, 22,totalTime.toFixed(2) + " min >>>> " +timeScore + " pt");
    var txt2 = this.add.text(163, 94,totalKills);
    var txt3 = this.add.text(533, 166,specialEvents);
    var txt4 = this.add.text(342, 238,tipoFinal);
    var txt5 = this.add.text(363, 316,finalScore + " pt");

    txt1.style.font = 'LeahFat';
    txt1.style.fontFamily = 'LeahFat';
    txt1.style.fontSize = "42px";
    txt1.style.stroke = '#000000';
    txt1.style.strokeThickness = 6;
    txt1.style.fill = '#43d637';
    txt1.style.update(true);

    txt2.style.font = 'LeahFat';
    txt2.style.fontFamily = 'LeahFat';
    txt2.style.fontSize = "42px";
    txt2.style.stroke = '#000000';
    txt2.style.strokeThickness = 6;
    txt2.style.fill = '#43d637';
    txt2.style.update(true);

    txt3.style.font = 'LeahFat';
    txt3.style.fontFamily = 'LeahFat';
    txt3.style.fontSize = "42px";
    txt3.style.stroke = '#000000';
    txt3.style.strokeThickness = 6;
    txt3.style.fill = '#43d637';
    txt3.style.update(true);

    txt4.style.font = 'LeahFat';
    txt4.style.fontFamily = 'LeahFat';
    txt4.style.fontSize = "42px";
    txt4.style.stroke = '#000000';
    txt4.style.strokeThickness = 6;
    txt4.style.fill = '#43d637';
    txt4.style.update(true);

    txt5.style.font = 'LeahFat';
    txt5.style.fontFamily = 'LeahFat';
    txt5.style.fontSize = "56px";
    txt5.style.stroke = '#000000';
    txt5.style.strokeThickness = 6;
    txt5.style.fill = '#43d637';
    txt5.style.update(true);


    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
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
