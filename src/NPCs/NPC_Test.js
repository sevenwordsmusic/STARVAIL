import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class NPC_Test extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.add.sprite(x,y,'dummy',0).setScale(2);
    this.sprite.setInteractive();
    this.sprite.playerInteractable = true;
    this.isTalking = false;


    this.dialogArray = [];
    this.dialogArray[0] = `[b]D42K-H[/b]
    Así que [i]finalmente[/i] has venido
    [b]D42K-H[/b]
    4ULS82... Sabes que sólo hay una respuesta al dolor que sentimos por el mero hecho de [color=red][b]existir[/b][/color], ¿verdad?
    [b]D42K-H[/b]
    Si así es, ya sabes lo que tenemos que hacer.`;

    this.dialogArray[1] = `[b]asd[/b]
    blb bla bla bla
    [b]dasdas[/b]
    nmrnmortnmfgknmfknflgnmflkmnlfkgmnflkgnmflkmglkf`;

    this.dialogArray[2] = `[b]hhhhhhhhhhhhhhhhhhhhhhh[/b]
    hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh`;

    this.currentDialog = -1;

    this.sprite.on('pointerdown', function() {
      if(!this.isTalking){
        this.isTalking = true;
        this.scene.dialogManager.setCurrentSpeaker(this);
        this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],10);
        this.scene.dialogManager.showDialogBox();
        this.goTo((this.currentStateId() + 1)%this.numberOfStates());
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
    console.log("finished talking");
  }
}
