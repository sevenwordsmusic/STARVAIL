import DropableAir from "./DropableAir.js";
export default class DropableAirEnergyAir extends DropableAir{
  constructor(scene, x, y, dirX, dirY, energy){
    super(scene, x, y, 'star', 10000);
    this.energy = energy;
    this.bounce(5.01, dirX, 5.01, dirY);
  }

  dropablePicked(drop){
    console.log("energy gained: " + this.energy);
    this.scene.game.player.playerGainEnergy(Math.min(this.energy, this.scene.game.totalPlayerEnergy-this.scene.game.player.energy));
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    console.log("energy drop expired");
    super.dropableExpire(drop);
  }
}
