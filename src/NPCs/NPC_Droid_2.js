import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_2 extends FiniteStateMachine{
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

    //arma que proporciona al jugador
    this.weaponToGive = 2;
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

    //aray de dialogos
    this.dialogArray = [];
    this.dialogArray[0] =
`[b]Vagrant Droid #2[/b]
Hey, care lending me a hand!?`;

    this.dialogArray[1] =
`[b]Vagrant Droid #2[/b]
Thank you, friendly android!
I take you are a vagrant too, right?
[b]Vagrant Droid #2[/b]
I almost perish before realizing my dream, I
must thank you for that. What's your name?
[b]`+ this.scene.game.playerName +`[/b]
My name is `+ this.scene.game.playerName +`.

[b]Y04K3[/b]
A pleasure to meet you, `+ this.scene.game.playerName +`
My name is Y04K3
[b]Y04K3[/b]
I'm a vagrant droid, just as you, searching
for the truth in this desolated tower...
[b]Y04K3[/b]
I can't believe how fogged the hive mind of
the droids here has come to be, they're like
[b]Y04K3[/b]
empty killing machines, hiding from the fact
that their purpose is now meaningless, refusing
[b]Y04K3[/b]
to face this world as it is. They're just hiding
in this hollow, mechanical forest...
[b]Y04K3[/b]
You know, I refuse to be like them. As painful
as it may be, I'll reach out to the truth!
[b]Y04K3[/b]
What's truth, you say? It's different for everyone.
The only one who really knows, is your true self.
[b]Y04K3[/b]
Be sure to find your true self, `+ this.scene.game.playerName +`.
As for me, I think I feel truer than ever, now
[b]Y04K3[/b]
that I got to meet you! Thank you, really.

[b]Y04K3[/b]
Now, before you part, please let me give you
something to help you on your journey:
OBTAINED PLUGIN WEAPON: EXPLOSIVE BULLETS


[b]Y04K3[/b]
This explosive ammo will do more damage than
your normal ammo, causing damage in area as well!
[b]Y04K3[/b]
Now nothing will stay in your way to find
your own truth, `+ this.scene.game.playerName +`!
[b]Y04K3[/b]
In my case, I don't think I need to see the birth
of a new star to find truth, I just don't want
[b]Y04K3[/b]
to lie to myself, never again.
Thank you for helping realizing this!
[b]Y04K3[/b]
May you find your own truth, `+ this.scene.game.playerName +`.
Farewell!`;

    this.dialogArray[2] =
`[b]Y04K3[/b]
May you find your own truth, `+ this.scene.game.playerName +`.
Never lie to yourself, face the truth!
[b]Y04K3[/b]
Farewell!`;

    this.currentDialog = -1;

    //al presionar el sprite se activa el dialogo
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
    //se preparan el nº de estados que tiene la FSM, que hace cuando empieza, acaba y update de cada estado
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
  //termina de hablar y al matar los enemigos que le rodean da su arma al jugador
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

  //al matar a un enemigo que le rodea se actualiza este valor
  enemyKilled(){
    this.enemiesLeft --;
    if(this.enemiesLeft<=0){
      Audio.clearNPC(this.scene);
    }
    if(this.enemiesLeft<=0 && !this.isTalking)
      this.goTo(1);
  }
}
