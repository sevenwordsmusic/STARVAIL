import DropableGround from "./DropableGround.js";
export default class DropableBossEnergy extends DropableGround{
  constructor(scene, x, y, dir, energy){
    super(scene, x, y, 'star', 10000);
    this.mass = 1;
    this.energy = energy;
    this.bounce(Phaser.Math.FloatBetween(3,5), dir, 2.5, 0.5);
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
