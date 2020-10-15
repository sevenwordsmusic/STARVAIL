import Dropable from "./Dropable.js";
export default class DropableAir extends Dropable{
  constructor(scene, x, y, spr, expTime){
    super(scene, x, y, spr, expTime);

    this.sprite.setIgnoreGravity(true).setFixedRotation();
    this.sprite.body.frictionAir = 0.06;
    scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
      objectA: this.sprite.body,
      objectB: this.scene.game.player.mainBody,
      callback:() => (this.dropablePicked(this)),
      context: this
    });
  }

  bounce(spreadVelX, spreadVelX){
    var randomVec = new Phaser.Math.Vector2(Phaser.Math.Between(-spreadVelX, spreadVelX), Phaser.Math.Between(-spreadVelX, spreadVelX));
    this.sprite.setVelocity(randomVec.x, randomVec.y);
  }

  dropablePicked(){
    super.dropablePicked();
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
