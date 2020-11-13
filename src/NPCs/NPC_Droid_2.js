import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_2 extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'dummy',0).setScale(2);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;
    this.enemiesLeft = 0;

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

    this.dialogArray = [];
    this.dialogArray[0] = 
    `[b]Vagrant Droid[/b]
    Hey, care lending me a hand!?`;

    this.dialogArray[1] = 
    `[b]Vagrant Droid[/b]
    Thank you, friendly android!
    I take you are a vagrant too, right?
    [b]Vagrant Droid[/b]
    I almost perish before realizing my dream, I
    must thank you for that. What's your name?
    [b]player[/b]
    My name is player.
    
    [b]Y04K3[/b]
    A pleasure to meet you, player
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
    as it may be, [i]I'll reach out to the truth![/i]
    [b]Y04K3[/b]
    What's truth, you say? It's different for everyone.
    The only one who really knows, is your [i]true self.[/i]
    [b]Y04K3[/b]
    Be sure to find your true self, player.
    As for me, I think I feel truer than ever, now
    [b]Y04K3[/b]
    that I got to meet you! Thank you, really.
    [b]Y04K3[/b]
    Now, before you part, please let me give you
    something to help you on your journey:
    OBTAINED PLUGIN WEAPON: [B]EXPLOSIVE BULLETS[/b]
    
    
    [b]Y04K3[/b]
    This explosive ammo will do more damage than
    your normal ammo, causing damage in area as well!
    [b]Y04K3[/b]
    Now nothing will stay in your way to find 
    your own truth, player!
    [b]Y04K3[/b]
    In my case, I don't think I need to see the birth
    of a new star to find truth, I just don't want
    [b]Y04K3[/b]
    to lie to myself, never again.
    Thank you for helping realizing this!
    [b]Y04K3[/b]
    May you find your own truth, player.
    Farewell!`;

    this.dialogArray[2] = 
    `[b]Y04K3[/b]
    May you find your own truth, player.
    Never lie to yourself, face the truth!
    [b]Y04K3[/b]
    Farewell!`;

    this.currentDialog = -1;

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
    }
  }

  enemyKilled(){
    this.enemiesLeft --;
    if(this.enemiesLeft<=0)
      this.goTo(1);
  }
}
