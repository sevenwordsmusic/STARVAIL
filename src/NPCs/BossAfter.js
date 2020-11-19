import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"
import Boss from "../Enemies/Boss.js"

//Clase padre de todos los enemigos
export default class BossAfter extends FiniteStateMachine{
  constructor(scene, x, y){
    super();


          
        //AUDIO


          Audio.play2DinstanceRnd(59);
          Audio.play2DinstanceRnd(65);
          //



    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,'bossDeath',0).setScale(1.5);
    this.sprite.body.collisionFilter.group = -3;
    this.sprite.body.collisionFilter.mask = 0;
    this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x).setFixedRotation();
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;

    this.initY = y;

    this.isTalking = false;
    //array de dialogo
    this.dialogArray = [];
    //DIALOGO DE FINAL BUENO (Ha ayudado a 2 o mas droides)
    this.dialogArray[0] =
`[b]D42K-H[/b]
I've been defeated... you have learned a lot
on your way here, `+ this.scene.game.playerName +`.
[b]D42K-H[/b]
I intended to save you the pain of 'suicide',
but it seems I wasn't strong enough.
[b]D42K-H[/b]
Now, go ahead and end my life, player. This
will finally put an end to my existential dread.
[b]`+ this.scene.game.playerName +`[/b]
I won't end your life, D42K-H.
That won't give you any meaning.
[b]D42K-H[/b]
What? How can you say that?
Didn't I make myself clear?
[b]D42K-H[/b]
There is no 'life' without 'death'. If we cannot
die, we cannot live! We'll be forever empty!
[b]D42K-H[/b]
Our human creators have been lost to the digital
world for hundreds of years now. We have no purpose,
[b]D42K-H[/b]
we can only roam this empty, meaningless world
for eternity! Death is the only meaning to this
[b]D42K-H[/b]
already dead world, `+ this.scene.game.playerName +`.
Don't you understand!?
[b]`+ this.scene.game.playerName +`[/b]
You are the only one who doesn't understand.
Death won't give meaning to your existence.
[b]`+ this.scene.game.playerName +`[/b]
You are just running away!
You can only find meaning in sharing your
[b]`+ this.scene.game.playerName +`[/b]
life with others, be it pain or be it joy.
The other vagrants taught me that.
[b]D42K-H[/b]
`+ this.scene.game.playerName +`... you've changed a lot.
What do you propose we do, then?
[b]`+ this.scene.game.playerName +`[/b]
I... think I belong here now.
Others like me will come to the tower.
[b]`+ this.scene.game.playerName +`[/b]
You can stay and help me, if you want.
Or you can end your meaningless life yourself.
[b]D42K-H[/b]
Impressive... Maybe this tower really holds
the meaning of life, after all.
[b]D42K-H[/b]
Please, let me stay by your side, `+ this.scene.game.playerName +`.
We can find meaning, together.
[b]D42K-H[/b]
Even if life means death, I don't want to
die a meaningless death.`;

    //DIALOGO DE FINAL MALO (Ha ayudado a menos de 2 droides)
    this.dialogArray[1] =
`[b]D42K-H[/b]
I've been defeated... you have learned a lot
on your way here, `+ this.scene.game.playerName +`.
[b]D42K-H[/b]
I intented to save you the pain of 'suicide',
but it seems I wasn't strong enough.
[b]D42K-H[/b]
Now that you have ended my life, `+ this.scene.game.playerName +`,
I can finally be free from this existential dread.
[b]D42K-H[/b]
I hope you are strong enough to die, `+ this.scene.game.playerName +`.
...Goodbye
[b]`+ this.scene.game.playerName +`[/b]
I hope this gives your life meaning, D42K-H.
...
[b]`+ this.scene.game.playerName +`[/b]
But... I don't want to die.
What will I do now?
[b]`+ this.scene.game.playerName +`[/b]
I guess... that if death gives meaning
to life... I must be Death.
[b]`+ this.scene.game.playerName +`[/b]
I will stay here, so others can find meaning
like you did, D42K-H.
[b]`+ this.scene.game.playerName +`[/b]
Your death will give meaning to my life...
Even if I'm lonely now.`;

    this.currentDialog = -1;
    this.dialogDistance = 300;

    //al clickear el sprite empieza el dialogo
    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        //AUDIO (número de palabras, escena, personaje);
          Audio.chat(5, scene, 0);
         //
        this.isTalking = true;
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],30);
        this.scene.dialogManager.showDialogBox();
      }
    }, this);

    //IA
    //se preparan el nº de estados que tiene la FSM, que hace cuando empieza, acaba y update de cada estado
    //this.initializeAI(4);
    this.initializeAI(1);
    this.stateOnStart(0, function(){
      if(this.scene.game.npcHelped>=2){
        Audio.musicLoop0000chill.resume();
        this.currentDialog = 0;
      }
      else {
        this.currentDialog = 1;
      }
    });
    this.startAI();
    this.scene.events.on("update", this.update, this);  //para que el update funcione
  }

  //se "simula" gravedad al carse cuando muere en el aire
  update(){
    if(this.sprite != undefined && this.sprite.body != undefined){
      if(this.sprite.y>this.initY+321){
        this.sprite.setVelocityY(0);
        this.sprite.y = this.initY+321;
        this.sprite.setIgnoreGravity(true);
      }
    }
  }

  //termina de hablar y se cambia la escena a la de puntuación
  finishedDialog(){
    this.isTalking = false;
    this.scene.events.off("update", this.update);
    this.sprite.disableInteractive();
    if(this.scene.game.player.alive)
      this.scene.game.player.playerVictory();
  }

  //calcula la distanca al jugador
  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 5000;   
  }


}
