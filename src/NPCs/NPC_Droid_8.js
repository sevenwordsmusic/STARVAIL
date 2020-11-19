import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Droid_8 extends FiniteStateMachine{
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

    //arma que proporciona al jugador
    this.weaponToGive = 8;
    /*
    0 - balas normales
    1 - balas rapidas
    2 - balas explosivas
    3 - balas rebotantesw
    4 - bombas normales
    5 - bombas megaton
    6 - misiles
    7 - misiles que se separan en bombas
    8 - laser
    */

    //aray de dialogos
    this.dialogArray = [];
    this.dialogArray[0] = `Help, Help!!!`;

    this.dialogArray[1] = `Thank you for helping me, have this amazing weapon!`;

    this.dialogArray[2] = `...`;

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
