
export default class Interactable {
  constructor(scene, x, y, spr, singleUse, toggle){
    //inicializacion
    this.scene = scene;
    this.singleUse = singleUse;
    this.toggle = toggle;
    this.activated = false;
    this.sprite = scene.add.sprite(x,y, spr ,0);
    this.sprite.setInteractive().on('pointerdown', function(){this.playerInteracted()}, this);
    this.sprite.playerInteractable = true;

    this.spSize = 1;
    this.spChangeSpeed = 0.0025;
    this.spMultip = 1
    this.spMaxSize = 1;
    this.spMinSize = 0.9;
    //this.scene.events.on("update", this.update, this);
  }

  playerInteracted(){
    if(this.singleUse){
      this.onActivated();
      this.onPermaDeactivated();
    }else{
      if(this.toggle){
        if(!this.activated){
          this.onActivated();
        }else{
          this.onDeactivated();
        }
      }else{
        this.onActivated();
      }
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
    this.activated = true;
    console.log("activated");
  }
  onDeactivated(){
    this.activated = false;
    console.log("deactivated");
  }
  onPermaDeactivated(){
    this.scene.events.off("update", this.update, this);
    this.sprite.off('pointerdown');
    this.sprite.disableInteractive();
  }
}
