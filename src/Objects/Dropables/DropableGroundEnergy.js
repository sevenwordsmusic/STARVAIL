import DropableGround from "./DropableGround.js";
import Audio from "../../Audio.js";
export default class DropableGroundEnergy extends DropableGround{
  constructor(scene, x, y, dir, energy){
    super(scene, x, y, 'drop', 10000);
    this.energy = energy;
    this.bounce(1.51, dir, 10, 0.5);
    this.sprite.setFrame(1);
    this.sprite.setScale(Phaser.Math.Clamp((energy/200),1,2));
  }

  dropablePicked(drop){
    //AUDIO
      Audio.play3DinstanceNoRate(this,68);
    //
    this.scene.game.player.playerGainEnergy(Math.min(this.energy, this.scene.game.totalPlayerEnergy-this.scene.game.player.energy));
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }

  distanceToPlayer(){
    if(this.sprite != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }

}
