import Audio from "../Audio.js";
export default class SceneRanking extends Phaser.Scene {
  constructor() {
    super("SceneRanking");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){
    //AUDIO
      Audio.gameOver();
      
      //
    //Corners
    var corners =this.add.image(0,0,'corners').setOrigin(0);

    //Background Final
    this.add.image(0,0,'endBackground').setOrigin(0).setDepth(-100);

    //Ranking field
    var creditsScreen=this.add.image(0,0,'RankingScreen').setOrigin(0,0);

    var myStorage = window.localStorage;

    var localNamesArray = [10];
    var localScoresArray = [10];

    for(var i=0; i<10; i++){
      localNamesArray[i] = myStorage.getItem('player'+i);
      if(localNamesArray[i] == null){
        localNamesArray[i] = "---"
      }
      localScoresArray[i] = myStorage.getItem('score'+i);
      if(localScoresArray[i] == null){
        localScoresArray[i] = 0;
      }
    }
    localStorage.clear();

    if(!this.game.wroteRanking ){
      var nuevaPosicion = -1;
      for(var i=0; i<10; i++){
        if(this.game.points >= localScoresArray[i]){
          nuevaPosicion = i;
          break;
        }
      }
      if(nuevaPosicion != -1){
        localScoresArray.splice(nuevaPosicion, 0, this.game.points);
        localNamesArray.splice(nuevaPosicion, 0, this.game.playerName);

        localScoresArray.length = 10;
        localNamesArray.length = 10;
      }
    }
    for(var i=0; i<10; i++){
      localStorage.setItem('player'+i, localNamesArray[i]);
      localStorage.setItem('score'+i, localScoresArray[i]);
    }

    //No se porque no sale la fuente bien
    const initSpace = 80;
    const betweenSpacing = 34;
    const leftTextX = 330;
    const rightTextX = 630;

    var leftTextArray = [10];
    var rightTextArray = [10];

    for(var i=0; i<11; i++){
      if(i == 0){
        leftTextArray[i] = this.add.text(leftTextX, (i)*betweenSpacing + initSpace,"PLAYER NAME:");
        rightTextArray[i] = this.add.text(rightTextX, (i)*betweenSpacing + initSpace,"PLAYER SCORE:");
        leftTextArray[i].style.fontSize = "36px";
        rightTextArray[i].style.fontSize = "36px";
      }else{
        leftTextArray[i] = this.add.text(leftTextX, (i)*betweenSpacing + initSpace, localNamesArray[i-1]);
        rightTextArray[i] = this.add.text(rightTextX, (i)*betweenSpacing + initSpace, localScoresArray[i-1] + " pt");
        leftTextArray[i].style.fontSize = "32px";
        rightTextArray[i].style.fontSize = "32px";
      }

      leftTextArray[i].style.font = 'LeahFat';
      leftTextArray[i].style.fontFamily = 'LeahFat';
      leftTextArray[i].style.stroke = '#000000';
      leftTextArray[i].style.strokeThickness = 6;
      leftTextArray[i].style.fill = '#43d637';
      leftTextArray[i].originX = 0.5;
      leftTextArray[i].style.update(true);

      rightTextArray[i].style.font = 'LeahFat';
      rightTextArray[i].style.fontFamily = 'LeahFat';
      rightTextArray[i].style.stroke = '#000000';
      rightTextArray[i].style.strokeThickness = 6;
      rightTextArray[i].style.fill = '#43d637';
      rightTextArray[i].originX = 0.5;
      rightTextArray[i].style.update(true);
    }

    if(!this.game.wroteRanking){
      if(nuevaPosicion != -1){
        console.log(nuevaPosicion);
        leftTextArray[nuevaPosicion+1].style.stroke = '#ce6b01';
        rightTextArray[nuevaPosicion+1].style.stroke = '#ce6b01';
        leftTextArray[nuevaPosicion+1].style.update(true);
        rightTextArray[nuevaPosicion+1].style.update(true);
      }
    }


    this.game.wroteRanking = true;

    //Boton exit
    this.btnExitRanking = this.add.image(100,100,'btnExit').setAlpha(0.8).setScale(0.75);
		this.btnExitRanking.setInteractive()
    .on('pointerdown', () => this.exitRanking());

    this.btnExitRanking.on('pointerover', function(pointer){
      this.alpha=1;
    });

    this.btnExitRanking.on('pointerout', function(pointer){
      this.alpha=0.8;
    });

  }

  exitRanking(){
    console.log("Se ha pulsado exit");
      //AUDIO
        Audio.postGameOver();
        Audio.play2DinstanceRate(81, 1.0);
      //
    this.btnExitRanking.alpha=0.8;

    this.scene.sendToBack('SceneRanking');
		this.scene.stop('SceneRanking');
    this.scene.resume('SceneScore');
    this.scene.bringToTop("SceneScore");
  }
}
