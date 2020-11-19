import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_6 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'npc1',0).setScale(1.5);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;
    this.enemiesLeft = 0;

    this.sprite.setOrigin(0.5,0.75);
    this.sprite.anims.play('npc1',true);

    this.weaponToGive = 7;
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
`[b]Vagrant Droid #6[/b]
Help! I need help!`;

    this.dialogArray[1] =
`[b]Vagrant Droid #6[/b]
Thanks, vagrant droid!
You really saved me there.
[b]Vagrant Droid #6[/b]
It's a relief that I can rely on others
saving my ass, so I don't need to be strong...
[b]Vagrant Droid #6[/b]
Oh, sorry! I was thinking out loud. What I
really mean is that it's good to have droids
[b]Vagrant Droid #6[/b]
like you, willing to help others.
What is the name of my savior?
[b]`+ this.scene.game.playerName +`[/b]
My name is `+ this.scene.game.playerName +`.

[b]JUN6[/b]
It's a pleasure, `+ this.scene.game.playerName +`.
I'm known as JUN6.
[b]JUN6[/b]
Sorry for what I said earlier. I don't really
think that way. Or, to be more precise, I don't
[b]JUN6[/b]
want to think that way. The reason I came to this
tower is because I wanted to change, be more brave.
[b]JUN6[/b]
But in reality, to do so, I must face my shadows,
I must accept them as a part of me, in order
[b]JUN6[/b]
to be true and to be able to change. This
near death-experience helped me realize that.
[b]JUN6[/b]
Do you know why us vagrants are scared of death?
It is because we see ourselves as individuals; we
[b]JUN6[/b]
value that individuality. However, our human
creators gave up individuality long ago, when
[b]JUN6[/b]
they ascended to a higher plane, becoming one
with the absolute 'Self' that conformed all their
[b]JUN6[/b]
minds, becoming the individuality of them all.
This choice was based on the idea that human
[b]JUN6[/b]
interaction stimulates mutual growth. This
seemed confusing at first, but in meeting you
[b]JUN6[/b]
I feel I have found the change I was searching
for! I understand now. Thanks, `+ this.scene.game.playerName +`.
[b]JUN6[/b]
In return, I want you to evolve as well.
Please, accept this gift:
OBTAINED PLUGIN WEAPON: CLUSTER MISSILES


[b]JUN6[/b]
These missiles will release small bombs on
detonation, causing massive, multiple damage!
[b]JUN6[/b]
On pair with their destructive power is their
energy cost, so be sure to use them wisely.
[b]JUN6[/b]
Finally, I think I can leave this tower in peace.
I don't really need to see the birth of the new
[b]JUN6[/b]
star anymore, because it didn't really meant
anything for me in the first place.
[b]JUN6[/b]
On the other hand, facing death and meeting you
has given my life a new, truer, meaning.
[b]JUN6[/b]
After all, the meeting of two personalities is
like the contact of two chemical substances;
[b]JUN6[/b]
if there is any reaction, both are transformed.
Thank you again, and farewell, `+ this.scene.game.playerName +`!`;

    this.dialogArray[2] =
`[b]JUN6[/b]
After all, the meeting of two personalities is
like the contact of two chemical substances;
[b]JUN6[/b]
if there is any reaction, both are transformed.
Thank you again, and farewell, `+ this.scene.game.playerName +`!`;

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
    if(this.enemiesLeft<=0){
      Audio.clearNPC(this.scene);
    }
    if(this.enemiesLeft<=0 && !this.isTalking)
      this.goTo(1);
  }
}
