import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"
import Boss from "../Enemies/Boss.js"

//Clase padre de todos los enemigos
export default class BossAfter extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
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
    this.dialogArray = [];
    //DIALOGO DE FINAL BUENO (Ha ayudado a 2 o mas droides)
    this.dialogArray[0] =
    `[b]D42K-H[/b]
    I've been defeated... you have learned a lot
    on your way here, player.
    [b]D42K-H[/b]
    I intended to save you the pain of 'suicide',
    but it seems I wasn't strong enough.
    [b]D42K-H[/b]
    Now, go ahead and end my life, player. This
    will finally put an end to my existential dread.
    [b]player[/b]
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
    already dead world, player.
    Don't you understand!?
    [b]player[/b]
    You are the only one who doesn't understand.
    Death won't give meaning to your existence.
    [b]player[/b]
    You are just running away!
    You can only find meaning in sharing your
    [b]player[/b]
    life with others, be it pain or be it joy.
    The other vagrants taught me that.
    [b]D42K-H[/b]
    player... you've changed a lot.
    What do you propose we do, then?
    [b]player[/b]
    I... think I belong here now.
    Others like me will come to the tower.
    [b]player[/b]
    You can stay and help me, if you want.
    Or you can end your meaningless life yourself.
    [b]D42K-H[/b]
    Impressive... Maybe this tower really holds
    the meaning of life, after all.
    [b]D42K-H[/b]
    Please, let me stay by your side, player.
    We can find meaning, together.
    [b]D42K-H[/b]
    Even if life means death, I don't want to
    die a meaningless death.`;

    //DIALOGO DE FINAL MALO (Ha ayudado a menos de 2 droides)
    this.dialogArray[1] =
    `[b]D42K-H[/b]
    I've been defeated... you have learned a lot
    on your way here, player.
    [b]D42K-H[/b]
    I intented to save you the pain of 'suicide',
    but it seems I wasn't strong enough.
    [b]D42K-H[/b]
    Now, go ahead and end my life, player. This
    will finally put an end to my existential dread.
    [b]player[/b]
    I hope that gave your life meaning, D42K-H.
    ...
    [b]player[/b]
    But... I don't want to die.
    What will I do now?
    [b]player[/b]
    I guess... that if death gives meaning
    to life... I must be Death.
    [b]player[/b]
    I will stay here, so others can find meaning
    like you did, D42K-H.
    [b]player[/b]
    Your death will give meaning to my life...
    Even if I'm lonely now.`;

    this.currentDialog = -1;
    this.dialogDistance = 300;

    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        //AUDIO (número de palabras, escena, personaje);
          Audio.chat(5, scene, 0);
         //
        this.isTalking = true;
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
    this.scene.events.on("update", this.update, this);  //para que el update funcione
  }

  update(){
    if(this.sprite != undefined && this.sprite.body != undefined){
      if(this.sprite.y>this.initY+321){
        this.sprite.setVelocityY(0);
        this.sprite.y = this.initY+321;
        this.sprite.setIgnoreGravity(true);
      }
    }
  }

  finishedDialog(){
    this.isTalking = false;
    this.scene.events.off("update", this.update);
  }



}
