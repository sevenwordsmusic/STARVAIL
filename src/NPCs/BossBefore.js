import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"
import Boss from "../Enemies/Boss.js"

//Clase padre de todos los enemigos
export default class BossBefore extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'playerIdle',0).setScale(1.5).setFlipX(true);

    this.isFiring = false;

    this.isTalking = false;
    this.dialogArray = [];
    this.dialogArray[0] = `...`;
    this.currentDialog = -1;
    this.dialogDistance = 300;
    this.initX = x;
    this.initY = y;

    //IA
    //this.initializeAI(4);
    this.initializeAI(2);
    this.stateOnStart(0, function(){
      this.currentDialog = 0;
    });
    this.stateUpdate(0, function(){
      if(Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2)) < this.dialogDistance){
        this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x);
        this.isTalking = true;
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],10);
        this.scene.dialogManager.showDialogBox();
        this.goTo(1);
      }
    });
    this.startAI();
    this.scene.events.on("update", this.update, this);  //para que el update funcione

  }
  update(){
    if(this.sprite != undefined)
      this.updateAI();
  }
  finishedDialog(){
    this.scene.boss = new Boss(this.scene, this.initX, this.initY);
    this.scene.events.off("update", this.update);
    this.isTalking = false;
    this.sprite.destroy();
    console.log("Boss Fight Started");
  }



}
