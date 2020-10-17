import Dropable from "./Dropable.js";
export default class DropableAir extends Dropable{
  constructor(scene, x, y, spr, expTime){
    super(scene, x, y, spr, expTime);

    const sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,35);
    this.sprite.setExistingBody(sensor).setFixedRotation().setPosition(x, y);
    this.sprite.body.isSensor = true;
    this.sprite.setIgnoreGravity(true).setFixedRotation();
    this.sprite.body.frictionAir = 0.06;
    scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
      objectA: this.sprite.body,
      objectB: this.scene.game.player.mainBody,
      callback:() => (this.dropablePicked(this)),
      context: this
    });
  }

  bounce(spreadVelX, dirX, spreadVelY, dirY){
    var randomVec = new Phaser.Math.Vector2(Phaser.Math.Between(0.5, spreadVelX) * dirX, Phaser.Math.Between(0.5, spreadVelY) * dirY);
    this.sprite.setVelocity(randomVec.x, randomVec.y);
  }

  dropablePicked(drop){
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
