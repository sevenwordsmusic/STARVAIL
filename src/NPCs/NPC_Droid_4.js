import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_4 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'npc4',0).setScale(1.5);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;
    this.enemiesLeft = 0;

    this.sprite.setOrigin(0.5,0.75);
    this.sprite.anims.play('npc4',true);

    this.weaponToGive = 5;
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
`[b]Vagrant Droid #4[/b]
Hey, care helping me with this?`;

    this.dialogArray[1] =
`[b]Vagrant Droid #4[/b]
Thank you. I can't do much on this side,
after all. What does it matter, anyway?
[b]Vagrant Droid #4[/b]
But I'm grateful for your help.
You are one of those vagrants, right?
[b]Vagrant Droid #4[/b]
What is your name?

[b]`+ this.scene.game.playerName +`[/b]
My name is `+ this.scene.game.playerName +`.

[b]N14L[/b]
Hey, `+ this.scene.game.playerName +`.
My name is N14L. Maybe you already knew that.
[b]N14L[/b]
I was lurking on this side, when I suddenly
realized that these idiot droids could see me.
[b]N14L[/b]
Before I knew it, they attacked me. It's nice to
know you're not like them.
[b]N14L[/b]
Are you looking for the new star? Or maybe you're
looking for your human creators, to ask them the
[b]N14L[/b]
meaning of your creation? Hahaha, that's funny.
Did you know, your human creators don't 'exist'
[b]N14L[/b]
anymore? [i]After the Singularity, they vanished to[/i]
[i]the digital plane[/i], leaving you mechanical life forms
[b]N14L[/b]
behind, just to maintain the foundations of their
digital 'heaven'. But just like me, they have been
[b]N14L[/b]
forgotten as individuals. Without a body, or
someone to remember you, do you think it's worth
[b]N14L[/b]
it being like a omnipresent god? What is 'God',
anyways? Everything is so stupid.
[b]N14L[/b]
Me? I'm only the image of 'me' that exists within
you, nothing more. But I can give you something
[b]N14L[/b]
to help you find what you are looking for:

OBTAINED PLUGIN WEAPON: [B]MEGATON BOMB[/b]


[b]N14L[/b]
Those are very powerful bombs. Humans tended to
think these would end humanity, in fact. Hehehe
[b]N14L[/b]
You must use them with care, though. They
consume a lot of energy!
[b]N14L[/b]
Now, I think this me will vanish onto the Wired
once more. I never wanted to reach the top of
[b]N14L[/b]
the tower, but meeting you made me realize that
even I can search for meaning in my life, even
[b]N14L[/b]
if I'm 'everybody' at the same time. Wierd,
right? I don't know if that matters, anyway.
[b]N14L[/b]
If you meet another me, that thinks it's the
real me, maybe you can understand.
[b]N14L[/b]
Don't do anything stupid, though, I'll know.
Bye!`;

    this.dialogArray[2] =
`[b]N14L[/b]
If you meet another me, that thinks it's the
real me, maybe you can understand.
[b]N14L[/b]
Don't do anything stupid, though, I'll know.
Bye!`;

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
