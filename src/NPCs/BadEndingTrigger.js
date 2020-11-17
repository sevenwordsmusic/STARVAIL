import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class BadEndingTrigger extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.isTalking = false;

    this.initX = x;
    this.initY = y;

    this.dialogArray = [];
    this.dialogArray[0] =
`[b]`+ this.scene.game.playerName +`[/b]
Hmm...?

[size=30]Only a dark hole was there.[/size]
There was no signs of D42K-H anywhere.

[b]`+ this.scene.game.playerName +`[/b]
...

It looks like you ran out of time.
Life waits no one. Remember that.`;

    this.currentDialog = -1;

    //IA
    //this.initializeAI(4);
    this.initializeAI(2);
    this.stateOnStart(0, function(){
      this.currentDialog = 0;
    });
    this.stateUpdate(0, function(){
      if(Math.sqrt(Math.pow(this.initX - this.scene.game.player.sprite.x,2) + Math.pow(this.initY - this.scene.game.player.sprite.y,2)) < 300){
        this.isTalking = true;
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],10);
        this.scene.dialogManager.showDialogBox();
        this.goTo(1);
      }
    });
    this.startAI();

    this.scene.events.on("update", this.update, this);
  }
  update(){
    this.updateAI();
  }
  finishedDialog(){
    this.isTalking = false;
    this.scene.events.off("update", this.updateAI);
    this.scene.game.player.playerVictory();
    this.goTo(1);
  }
}
