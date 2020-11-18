import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_7 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'npc2',0).setScale(1.5);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;
    this.enemiesLeft = 0;

    this.sprite.setOrigin(0.5,0.75);
    this.sprite.anims.play('npc2',true);

    this.weaponToGive = 8;
    /*
    0 - balas normales
    1 - balas rapidas
    2 - balas explosivas
    3 - balas rebotantes
    4 - bombas normales
    5 - bombas megaton
    6 - misiles
    7 - misiles que se separan en bombas
    8 - laser
    */

    this.dialogArray = [];
    this.dialogArray[0] =
`[b]Vagrant Droid #7[/b]
Hey, you! Please, I need your help!`;

    this.dialogArray[1] =
`[b]Vagrant Droid #7[/b]
Thank you, stranger friend!
You saved my life!
[b]Vagrant Droid #7[/b]
That was very kind and altruist of you.
You must feel great for what you did!
[b]Vagrant Droid #7[/b]
That makes you a vagrant; acting for your own
benefit, first and foremost.
[b]Vagrant Droid #7[/b]
Hmm? Did I say anything strange?
In any case, please tell me your name.
[b]`+ this.scene.game.playerName +`[/b]
My name is `+ this.scene.game.playerName +`.

[b]K4N7[/b]
I'm pleasured to meet you, `+ this.scene.game.playerName +`.
My name is K4N7. I'm a vagrant, like you!
[b]K4N7[/b]
I'm really thankful that your ethic logic drove
you to save me; if you were like the others here,
[b]K4N7[/b]
I would have been destroyed for sure. That makes me
wonder, though, why would you save me? Why do you
[b]K4N7[/b]
act the way you do? You may say you're an altruist
for helping others in need, but you still had a
[b]K4N7[/b]
personal interest in helping me, right? You saved
me because that made you feel good, you did what
[b]K4N7[/b]
you felt must be done, for there is nothing higher
than reason, that's what makes you a vagrant!
[b]K4N7[/b]
Yo did help me for your own sake, indeed, but that
it's not bad. The death of dogma is the birth of
[b]K4N7[/b]
morality, and in your own benefit I can find mine
too. That's how everyone should be! Yes!
[b]K4N7[/b]
I didn't really know what I was searching in this
tower, but now that I have reached this conclusion,
[b]K4N7[/b]
I think I can find the meaning in my immortal life
and decisions, everything thanks to you, who
[b]K4N7[/b]
dares to make use of reason to defy the madness
of this world for your own existencial benefit!
[b]K4N7[/b]
Please, allow me to gift you this plugin weapon,
for I must reward this meeting with you:
OBTAINED PLUGIN WEAPON: LASER CANNON


[b]K4N7[/b]
This plugin will allow you to fire a powerful
laser that will melt away your enemies!
[b]K4N7[/b]
Be minfdul that you cannot fire this laser
indefinitely, for it consumes energy.
[b]K4N7[/b]
Now that I have obtained enlightenement,
I can leave Starvail Tower, thanks to you.
[b]K4N7[/b]
Never be afraid of the shadows of this world,
`+ this.scene.game.playerName +`. For you have the enlightenement of
[b]K4N7[/b]
reason that will guide you to the right places,
to the right choices, just like it happened
[b]K4N7[/b]
here. Good luck in your journey, take care!`;

    this.dialogArray[2] =
`[b]K4N7[/b]
Never be afraid of the shadows of this world,
`+ this.scene.game.playerName +`. For you have the enlightenement of
[b]K4N7[/b]
reason that will guide you to the right places,
to the right choices, just like it happened here.
[b]K4N7[/b]
here. Good luck in your journey, take care!`;

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
    this.initializeAI(3);
    this.stateOnStart(0, function(){
    this.currentDialog = 0;
    });
    this.stateOnStart(1, function(){
      this.currentDialog = 1;
    });
    this.stateOnStart(2, function(){
      this.currentDialog = 2;
    })
    this.startAI();


  }
  finishedDialog(){
    this.isTalking = false;
    if(this.currentStateId()==1){
      this.scene.game.obtainedWeapons.push(this.weaponToGive);
      this.scene.game.player.recieveWeapon(this.weaponToGive);
      console.log("arma conseguida");
      this.goTo(2);
      this.scene.game.npcHelped++;
      this.scene.game.points += 500;
    }
    else if(this.currentStateId() == 0 && this.enemiesLeft<=0){
      this.goTo(1);
    }
  }

  enemyKilled(){
    this.enemiesLeft --;
    if(this.enemiesLeft<=0 && !this.isTalking)
      this.goTo(1);
  }
}
