import DropableAir from "./DropableAir.js";
export default class DropableAirEnergyAir extends DropableAir{
  constructor(scene, x, y, energy){
    super(scene, x, y, 'star', 10000);
    this.energy = energy;
    this.bounce(1.01, 1.01);
  }

  dropablePicked(){
    console.log("energy gained: " + this.energy);
    this.scene.game.player.playerGainEnergy(Math.min(this.energy, this.scene.game.totalPlayerEnergy-this.scene.game.player.energy));
    super.dropablePicked();
  }

  dropableExpire(drop){
    console.log("energy drop expired");
    super.dropableExpire(drop);
  }
}
