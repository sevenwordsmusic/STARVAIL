import Interactable from "./Interactable.js"
import DropableGroundEnergy from "../Dropables/DropableGroundEnergy.js"
import DropableGroundHealth from "../Dropables/DropableGroundHealth.js"
import Audio from "../../Audio.js";

export default class InteractableChest extends Interactable {
  constructor(scene, x, y, hp, energy){
    super(scene, x, y, 'chest', true, false);
    this.sprite.setOrigin(0.5,0.75);
    this.spSize = 1.5;
    this.spChangeSpeed = 0.0025;
    this.spMaxSize = 1.5;
    this.spMinSize = 1.4;

    this.energy = energy;
    this.hp = hp;
  }

  onActivated(){
    //AUDIO
      Audio.play3Dinstance(this,70);
      Audio.play3Dinstance(this,78);
    //
    super.onActivated();
    const dropAmount = 3;
    var maxHealthDrops = 2;
    for(var i=0; i<dropAmount; i++){
      if(Math.random() < 0.5){
        new DropableGroundEnergy(this.scene, this.sprite.x, this.sprite.y, Phaser.Math.Between(-1.6, 1.6),  this.energy);
      }else{
        if(maxHealthDrops>0)
          new DropableGroundHealth(this.scene, this.sprite.x, this.sprite.y, Phaser.Math.Between(-1.6, 1.6),  this.hp);
        else
          new DropableGroundEnergy(this.scene, this.sprite.x, this.sprite.y, Phaser.Math.Between(-1.6, 1.6),  this.energy);
        maxHealthDrops--;
      }
    }
  }

  onPermaDeactivated(){
    super.onPermaDeactivated();
    this.sprite.setFrame(1);
  }

  distanceToPlayer(){
    if(this.sprite != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }

}
