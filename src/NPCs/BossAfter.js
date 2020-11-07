import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"
import Boss from "../Enemies/Boss.js"

//Clase padre de todos los enemigos
export default class BossAfter extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,'playerDeath',0).setScale(1.5);
    this.sprite.body.collisionFilter.group = -1;
    this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x).setFixedRotation();
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;

    this.isTalking = false;
    this.dialogArray = [];
    this.dialogArray[0] = `fin Pelea`;
    this.currentDialog = -1;
    this.dialogDistance = 300;

    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        //AUDIO (número de palabras, escena, personaje);
          Audio.chat(5, scene, 0);
         //
        this.isTalking = true;
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],10);
        this.scene.dialogManager.showDialogBox();
      }
    }, this);

    //IA
    //this.initializeAI(4);
    this.initializeAI(1);
    this.stateOnStart(0, function(){
      this.currentDialog = 0;
    });
    this.startAI();

  }

  finishedDialog(){
    this.isTalking = false;
  }



}
