import Dropable from "./Dropable.js";
export default class DropableGround extends Dropable{
  constructor(scene, x, y, spr, expTime){
    super(scene, x, y, spr, expTime);

    const mainBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, this.sprite.width, this.sprite.height);
    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,35);
    this.sensor.isSensor = true;
    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [mainBody, this.sensor],
      frictionAir: 0.02
    });
    this.sprite.setExistingBody(compoundBody).setFixedRotation().setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.body.restitution = 0.5;
    scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
      objectA: this.sensor,
      objectB: this.scene.game.player.mainBody,
      callback:() => (this.dropablePicked(this)),
      context: this
    });
  }

  bounce(spreadX, speed, speedVar){
    var randomVec = new Phaser.Math.Vector2(Phaser.Math.Between(-spreadX, spreadX), -Phaser.Math.Between(speed, speed+speed));
    this.sprite.setVelocity(randomVec.x, randomVec.y);
  }

  dropablePicked(){
    super.dropablePicked();
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
