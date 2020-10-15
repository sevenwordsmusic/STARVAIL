
export default class Interactable {
  constructor(scene, x, y, spr, singleUse){
    //inicializacion
    this.scene = scene;
    this.singleUse = singleUse;
    this.activated = false;
    this.sprite = scene.add.sprite(x,y, spr ,0);
    this.sprite.setInteractive().on('pointerdown', this.playerInteracted());
  }

  playerInteracted(){
    if(!this.singleUse){
      if(this.activated){
        this.onActivated();
      }else{
        this.onDeactivated();
      }
      this.activated = !this.activated;
    }
    else{
      this.onActivated();
      this.sprite.off('pointerdown', this.playerInteracted());
      this.disableInteractive();
    }
  }

  onActivated(){
    console.log("activated");
  }
  onDeactivated(){
    console.log("deactivated");
  }
}
