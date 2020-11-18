import Dropable from "./Dropable.js";
export default class DropableAir extends Dropable{
  constructor(scene, x, y, spr, expTime){
    super(scene, x, y, spr, expTime);

    const mainBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, this.sprite.width, this.sprite.height);
    const sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,25);
    sensor.isSensor = true;
    //this.sprite.setExistingBody(sensor).setFixedRotation().setPosition(x, y);
    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [mainBody, sensor],
      frictionAir: 0.02,
      friction: 0,
      frictionStatic: 0
    });
    this.sprite.setExistingBody(compoundBody).setFixedRotation().setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    //this.sprite.body.isSensor = true;
    this.sprite.setIgnoreGravity(true).setFixedRotation();
    this.sprite.body.frictionAir = 0.06;
    scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
      objectA: sensor,
      objectB: this.scene.game.player.mainBody,
      callback:() => (this.dropablePicked(this)),
      context: this
    });
    this.sprite.body.collisionFilter.group = -3;
  }

  bounce(spreadVelX, spreadVelY, dir){
    const randomSpeed = Phaser.Math.FloatBetween(0.5 * spreadVelX, spreadVelX);
    var randomVec = new Phaser.Math.Vector2(randomSpeed * dir.x, randomSpeed * dir.y);
    this.sprite.setVelocity(randomVec.x, randomVec.y);
  }

  dropablePicked(drop){
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
