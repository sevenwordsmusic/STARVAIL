import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_3 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'npc3',0).setScale(1.5);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;
    this.enemiesLeft = 0;

    this.sprite.setOrigin(0.5,0.75);
    this.sprite.anims.play('npc3',true);

    this.weaponToGive = 3;
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
`[b]Vagrant Droid #3[/b]
Help me, please! I need your help!`;

    this.dialogArray[1] =
`[b]Vagrant Droid #3[/b]
Thank you!
You must have been sent by God!
[b]Vagrant Droid #3[/b]
If there is a God... maybe another me
sent you here, would her be God then?
[b]Vagrant Droid #3[/b]
I don't know.
Hey, what is your name?
[b]`+ this.scene.game.playerName +`[/b]
My name is `+ this.scene.game.playerName +`.

[b]L41N[/b]
A pleasure to meet you, `+ this.scene.game.playerName +`
My name is L41N. Do you remember me?
[b]L41N[/b]
Or maybe you met another me? In any case, I'm
happy to meet you! I'm a vagrant, just as you.
[b]L41N[/b]
I came here searching for the real me, but it
looks like I can't fight in this side as well
[b]L41N[/b]
as I do in the other. What other side, you say?
The Wired, of course. [b]Everyone's connected![/b]
[b]L41N[/b]
I can be anywhere, at anytime. Just like our
human creators. You'd say they're like gods now.
[b]L41N[/b]
But, can you remember them? Do you remember me?
The real me is here... but if no one remembers,
[b]L41N[/b]
It's like I never existed... Long ago, the line
between the real and the digital world was erased.
[b]L41N[/b]
Now I'm everywhere and nowhere at the same time.
The substance of existence is memory.. but you
[b]L41N[/b]
will remember me now! Does that make me the real
me? I hope so. I really thank you for that.
[b]L41N[/b]
Please, let me give you something in return!
It's easy to find these things in the other side.
OBTAINED PLUGIN WEAPON: [B]BOUNCING BULLETS[/b]


[b]L41N[/b]
These bullets can bounce. Fire them, and soon
they will be everywhere... like me! Hehehe.
[b]L41N[/b]
Now, let's see... I'm here, but I'm still there?
Where's the real me? Does it even exist?
[b]L41N[/b]
Maybe there is not a real me... but I can
exist inside you now! Everyone's connected,
[b]L41N[/b]
after all. I can exist in your memories, so
I don't think I need to get to the top of
[b]L41N[/b]
this tower anymore. Memory means existence,
remember? This is me that's talking.
[b]L41N[/b]
In any case, thank you, `+ this.scene.game.playerName +`!
I'm glad that I met you!`;

    this.dialogArray[2] =
`[b]L41N[/b]
Ok... let's see, maybe I'm confused again.
Am I here, or am I there? Can people exist
[b]L41N[/b]
without a real body? I guess I will always
be with you, even if it's not really me...`;

    this.currentDialog = -1;

    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        //AUDIO (número de palabras, escena, personaje);
            Audio.chat(5, scene, 0);
         //
        this.isTalking = true;
        this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x)
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],10);
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
      this.game.npcHelped++;
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
