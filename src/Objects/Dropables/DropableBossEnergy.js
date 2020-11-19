import DropableGround from "./DropableGround.js";
export default class DropableBossEnergy extends DropableGround{
  constructor(scene, x, y, dir, energy){
    super(scene, x, y, 'drop', 10000);
    //inicializacion
    this.mass = 1;
    this.energy = energy;
    this.sprite.setFrame(1);
    this.bounce(Phaser.Math.FloatBetween(3,5), dir, 2.5, 0.5);
  }
  //al recoger dropable
  dropablePicked(drop){
    this.scene.game.player.playerGainEnergy(Math.min(this.energy, this.scene.game.totalPlayerEnergy-this.scene.game.player.energy));
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
