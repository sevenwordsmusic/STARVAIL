import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_Default2 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'npc5',0).setScale(1.5);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;

    this.sprite.setOrigin(0.5,0.75);
    this.sprite.anims.play('npc5',true);

    this.dialogArray = [];
    this.dialogArray[0] =
`[b]Vagrant Droid #0[/b]
Oh, you found me! Congratulations!
You must be a really curious droid.
[b]Vagrant Droid #0[/b]
Are you planning to ascend to the top of
this tower? You must be so brave as well!
[b]Vagrant Droid #0[/b]
I don't have anything to give to you as a
reward for finding me, but my fellow droids might
[b]Vagrant Droid #0[/b]
Be sure to look out for them! They need your help!
Anyway... good luck!`;

    this.currentDialog = -1;

    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        this.isTalking = true;
        this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x)
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],30);
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
