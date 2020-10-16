
export default class Interactable {
  constructor(scene, x, y, spr, singleUse){
    //inicializacion
    this.scene = scene;
    this.singleUse = singleUse;
    this.activated = false;
    this.sprite = scene.add.sprite(x,y, spr ,0);
    this.sprite.setInteractive().on('pointerdown', function(){this.playerInteracted()}, this);
    this.sprite.playerInteractable = true;

    this.spSize = 1;
    this.spChangeSpeed = 0.0025;
    this.spMultip = 1
    this.spMaxSize = 1;
    this.spMinSize = 0.9;
    this.scene.events.on("update", this.update, this);
  }

  playerInteracted(){
    if(!this.singleUse){
      if(!this.activated){
        this.onActivated();
      }else{
        this.onDeactivated();
      }
      this.activated = !this.activated;
    }
    else{
      this.onActivated();
      this.onPermaDeactivated();
    }
  }

  update(){
    if(this.spSize >= this.spMaxSize && this.spMultip == 1)
      this.spMultip = -1;
    if(this.spSize <= this.spMinSize && this.spMultip == -1)
      this.spMultip = 1;
    this.spSize = this.spSize + (this.spChangeSpeed * this.spMultip);
    this.sprite.setScale(this.spSize);
  }

  onActivated(){
    console.log("activated");
  }
  onDeactivated(){
    console.log("deactivated");
  }
  onPermaDeactivated(){
    this.scene.events.off("update", this.update, this);
    this.sprite.off('pointerdown');
    this.sprite.disableInteractive();
  }
}
