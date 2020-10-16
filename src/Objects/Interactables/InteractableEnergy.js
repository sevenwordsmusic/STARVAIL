import Interactable from "./Interactable.js"
import DropableGroundEnergy from "../Dropables/DropableGroundEnergy.js"
export default class InteractableEnergy extends Interactable {
  constructor(scene, x, y){
    super(scene, x, y, 'star', false);
    this.sprite.setScale(2);
    this.spSize = 2;
    this.spChangeSpeed = 0.005;
    this.spMaxSize = 2;
    this.spMinSize = 1.8;
  }

  onActivated(){
    super.onActivated();
    new DropableGroundEnergy(this.scene, this.sprite.x, this.sprite.y, 15);
    this.scene.events.off("update", this.update, this);
    this.sprite.setTint(0xff0000);
  }

  onDeactivated(){
    super.onDeactivated();
    this.scene.events.on("update", this.update, this);
    this.sprite.setTint(0xffffff);
  }
}
