import Dropable from "./Dropable.js";
export default class DropableEnergy extends Dropable{
  constructor(scene, x, y, energy){
    super(scene, x, y, 'star', 10000);
    this.energy = energy

    //aleatoriedad al ser emitido por un enemigo
    const spreadX = 1.01;
    const speed = 4.5;
    const speedVar = 0.5;
    var randomVec = new Phaser.Math.Vector2(Phaser.Math.Between(-spreadX, spreadX), -Phaser.Math.Between(speed, speed+speed));
    this.sprite.setVelocity(randomVec.x, randomVec.y);
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
