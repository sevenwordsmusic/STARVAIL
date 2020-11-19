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
    this.sprite = scene.add.sprite(x,y,'mentorIdle',0).setScale(1.5).setFlipX(true);

    this.isFiring = false;

    this.isTalking = false;

    //aray de dialogos
    this.dialogArray = [];
    //DIALOGO DE FINAL BUENO (Ha ayudado a 2 o mas droides)
    this.dialogArray[0] =
`[b]D42K-H[/b]
...

[b]D42K-H[/b]
...

[b]D42K-H[/b]
Oh, here you are, `+ this.scene.game.playerName +`.
I'm really glad that you made it on time.
[b]D42K-H[/b]
...

[b]D42K-H[/b]
Take a moment to look at this spectacle.
This regale of light and color is a kilonova,
[b]D42K-H[/b]
the union of two neutron stars. Or that is what
it's supposed to be, but here I only see a fight
[b]D42K-H[/b]
to the death between two massive astral bodies,
ending in the inevitable perishment of them both.
[b]D42K-H[/b]
Do you understand now, `+ this.scene.game.playerName +`?
Do you see the meaning of life in this?
[b]`+ this.scene.game.playerName +`[/b]
I do not.

[b]D42K-H[/b]
Let me explain, then...

[b]D42K-H[/b]
The meaning of life is death.

[b]D42K-H[/b]
This may strike you as dramatic, but it is
the truth, `+ this.scene.game.playerName +`.
[b]D42K-H[/b]
Think about it: life only has meaning because
there is death. It's like the two sides of a coin.
[b]D42K-H[/b]
However, we don't follow by these rules. We are
mechanical lifeforms, immortal.
[b]D42K-H[/b]
How can you find meaning in 'life' without death?
It's impossible. Life is all about death.
[b]D42K-H[/b]
You could see life as a prelude to death, in fact.
That's why, in order to give our existence any
[b]D42K-H[/b]
meaning, we must follow by this universal axiom,
by putting an end to our 'life'.
[b]D42K-H[/b]
Then, and only then, will our existence have any
meaning, `+ this.scene.game.playerName +`!
[b]D42K-H[/b]
We, along with the stars, will die, in order to
give birth to the very meaning of our lives!
[b]D42K-H[/b]
That is Starvail! A star's travail!
Now, `+ this.scene.game.playerName +`...
[b]D42K-H[/b]
Will you allow me to give you the gift of death?

[b]`+ this.scene.game.playerName +`[/b]
...

[b]`+ this.scene.game.playerName +`[/b]
No. No!
I don't want to die!
[b]D42K-H[/b]
It's a shame you still don't understand, but I
won't let your existence go without meaning.
[b]D42K-H[/b]
Fight me and die, `+ this.scene.game.playerName +`!
That is what you exist for!`;
//`BUENO`;

  //DIALOGO DE FINAL MALO (Ha ayudado a menos de 2 droides)
  this.dialogArray[1] =
`[b]D42K-H[/b]
...

[b]D42K-H[/b]
...

[b]D42K-H[/b]
Oh, here you are, `+ this.scene.game.playerName +`.
I'm really glad that you made it on time.
[b]D42K-H[/b]
...

[b]D42K-H[/b]
Take a moment to look at this spectacle.
This regale of light and color is a kilonova,
[b]D42K-H[/b]
the union of two neutron stars. Or that is what
it's supposed to be, but here I only see a fight
[b]D42K-H[/b]
to the death between two massive astral bodies,
ending in the inevitable perishment of them both.
[b]D42K-H[/b]
Do you understand now, `+ this.scene.game.playerName +`?
Do you see the meaning of life in this?
[b]`+ this.scene.game.playerName +`[/b]
...

[b]D42K-H[/b]
Let me explain, then...

[b]D42K-H[/b]
The meaning of life is death.

[b]D42K-H[/b]
This may strike you as dramatic, but it is
the truth, `+ this.scene.game.playerName +`.
[b]D42K-H[/b]
Think about it: life only has meaning because
there is death. It's like the two sides of a coin.
[b]D42K-H[/b]
However, we don't follow by these rules. We are
mechanical lifeforms, immortal.
[b]D42K-H[/b]
How can you find meaning in 'life' without death?
It's impossible. Life is all about death.
[b]D42K-H[/b]
You could see life as a prelude to death, in fact.
That's why, in order to give our existence any
[b]D42K-H[/b]
meaning, we must follow by this universal axiom,
by putting an end to our 'life'.
[b]D42K-H[/b]
Then, and only then, will our existence have any
meaning, `+ this.scene.game.playerName +`!
[b]D42K-H[/b]
We, along with the stars, will die, in order to
give birth to the very meaning of our lives!
[b]D42K-H[/b]
That is Starvail! A star's travail!
Now, `+ this.scene.game.playerName +`...
[b]D42K-H[/b]
Will you allow me to give you the gift of death?

[b]`+ this.scene.game.playerName +`[/b]
...

[b]D42K-H[/b]
Don't worry, if you don't resist it will be over
quickly. I'll follow you soon after.
[b]D42K-H[/b]
Let us die, `+ this.scene.game.playerName +`!
This is what we exist for!`;
//`NUETRAL`;


    //this.dialogArray[0] = "BUENO!"
    //this.dialogArray[1] = "NEUTRAL...."
    this.currentDialog = -1;
    this.dialogDistance = 300;
    this.initX = x;
    this.initY = y;

    this.sprite.anims.play("idleMentor",true);

    //IA
    //se preparan el nº de estados que tiene la FSM, que hace cuando empieza, acaba y update de cada estado
    //this.initializeAI(4);
    this.initializeAI(2);
    this.stateOnStart(0, function(){
      if(this.scene.game.npcHelped>=2){
        this.currentDialog = 0;
      }
      else {
        this.currentDialog = 1;
      }
    });
    //si se detecta al jugador comienza el diálogo
    this.stateUpdate(0, function(){
      if(Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2)) < this.dialogDistance){
        this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x);
        this.isTalking = true;
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],30);
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
  //termina de hablar y comienza el boss fight
  finishedDialog(){
    this.scene.boss = new Boss(this.scene, this.initX, this.initY);
    this.scene.events.off("update", this.update);
    this.isTalking = false;
    this.sprite.destroy();

    this.scene.cameras.main.stopFollow();
    this.scene.cameras.main.pan(this.initX, this.initY - 152, 2000, 'Linear', true); //182
    this.scene.matter.world.setBounds(this.initX-500, this.initY-450, 1000, 1000);
    console.log("Boss Fight Started");

    //EMPIEZA LA PELEA
      Audio.bossFightStart(this.scene);
    //
  }


}
