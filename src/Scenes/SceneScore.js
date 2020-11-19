import Audio from "../Audio.js";
export default class SceneScore extends Phaser.Scene {
  constructor() {
    super("SceneScore");
  }

  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
      Audio.fullscreenMode(this);
      //

    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Final
    this.add.image(0,0,'endBackground').setOrigin(0).setDepth(-100);

    //Score field
    var ScoreScreen=this.add.image(0,0,'ScoreScreen').setOrigin(0,0);

    //Boton credits
    this.btnViewCreditsScore = this.add.image(214,459,'btnCreditsScore').setAlpha(0.8);
		this.btnViewCreditsScore.setInteractive()
    .on('pointerdown', () => this.viewCreditsScore());

    this.btnViewCreditsScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnViewCreditsScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton exit
    this.btnExitScore = this.add.image(746.8,457.5,'btnExitScore').setAlpha(0.8);
		this.btnExitScore.setInteractive()
    .on('pointerdown', () => this.exitScore());

    this.btnExitScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton ranking
    this.btnRankingScore = this.add.image(479,458.5,'btnRankingScore').setAlpha(0.8);
		this.btnRankingScore.setInteractive()
    .on('pointerdown', () => this.viewRankingScore());

    this.btnRankingScore.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnRankingScore.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

    //Boton review
    //this.btnReview = this.add.image(711,353.5,'btnReviewScore').setAlpha(0.8);
		/*this.btnReview.setInteractive()
    .on('pointerdown', () => this.irAlLink("https://forms.gle/Eh7LPkvHq3Zvgw2TA"));

    // this.btnReview.on('pointerover', function(pointer){
    //   this.alpha=1;
    // });

    this.btnReview.on('pointerout', function(pointer){
      this.alpha=0.8;
    });*/

    //Calcular puntuacion
    //En funcion del tiempo, kills, eventos especiales y tipo de final

    const totalTime = this.game.time/1000/60; //considerado en minutos
    const maxTime = this.game.maxTime/1000/60;
    const scoreForBestTime = 3000;

    var timeScore = Math.max(0,Math.min(scoreForBestTime, 2*scoreForBestTime - (maxTime/1000)*totalTime));

    const totalKills = this.game.enemiesKilled;
    const specialEvents = this.game.npcHelped;
    var tipoFinal="";

    //puntuacion por tiempo
    if(this.game.timeExpired){
      tipoFinal="Bad Ending"
      this.game.points -= 1000;
      timeScore = 0;
    }else{
      if(this.game.npcHelped >= 2){
        tipoFinal="Good Ending"
        this.game.points += 5000;
      }else{
        tipoFinal="Neutral Ending"
        this.game.points += 1000;
      }
    }

    //this.add.bitmapText(480,270,'font','0',100);

    //No se porque no sale la fuente bien
    var txt1 = this.add.text(140, 22,totalTime.toFixed(2) + " min >>>> " +timeScore + " pt");
    var txt2 = this.add.text(163, 94,totalKills);
    var txt3 = this.add.text(533, 166,specialEvents);
    var txt4 = this.add.text(342, 238,tipoFinal);
    var txt5 = this.add.text(363, 316,this.game.points + " pt");

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

  viewCreditsScore(){
    console.log("Se ha pulsado credits");

    this.btnViewCreditsScore.alpha=0.8;

    this.scene.run("SceneCreditsScore");
    this.scene.bringToTop("SceneCreditsScore");
    this.scene.stop('SceneScore');

  }

  exitScore(){
    console.log("Se ha pulsado exit");

    this.btnExitScore.alpha=0.8;

    this.scene.stop("SceneEffectBackground");

    this.scene.stop('SceneScore');

    this.game.initializeVariables(false);

    this.scene.start('SceneMM');
    this.scene.bringToTop("SceneMM");

   /*var SceneMMR = this.scene.get('SceneMM');

   SceneMMR.scene.restart();*/
  }

  viewRankingScore(){
    console.log("Se ha pulsado Ranking");

    this.btnRankingScore.alpha=0.8;

    this.scene.run("SceneRanking");
    this.scene.bringToTop("SceneRanking");
    this.scene.stop('SceneScore');
    this.scene.sendToBack("SceneScore");

  }

  irAlLink(urllink){
    //window.location.href = 'https://www.youtube.com/watch?v=5XjcUvaDTK4&t=408s&ab_channel=gammafp';

    this.url = urllink;
    window.open(this.url);
  }
}
