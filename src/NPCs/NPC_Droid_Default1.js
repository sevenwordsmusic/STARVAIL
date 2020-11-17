import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_Default1 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'npc4',0).setScale(1.5);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;

    this.sprite.setOrigin(0.5,0.75);
    this.sprite.anims.play('npc4',true);

    this.dialogArray = [];
    this.dialogArray[0] =
`[b]Vagrant Droid #0[/b]
Hello, stranger droid. Are you here to go
up the tower as well?
[b]Vagrant Droid #0[/b]
If that's the case, please help other androids
like me... not everyone is as capable for combat
[b]Vagrant Droid #0[/b]
as you are, so many like me may need your help.
Thanks for stopping by to talk to me! Good luck!`;

    this.currentDialog = -1;

    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        this.isTalking = true;
        this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x)
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
