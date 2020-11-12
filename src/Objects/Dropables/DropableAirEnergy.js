import DropableAir from "./DropableAir.js";
export default class DropableAirEnergy extends DropableAir{
  constructor(scene, x, y, dirX, dirY, energy){
    super(scene, x, y, 'drop', 10000);
    this.energy = energy;
    this.bounce(5.01, dirX, 5.01, dirY);
    this.sprite.setFrame(1);
  }

  dropablePicked(drop){
    this.scene.game.player.playerGainEnergy(Math.min(this.energy, this.scene.game.totalPlayerEnergy-this.scene.game.player.energy));
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
