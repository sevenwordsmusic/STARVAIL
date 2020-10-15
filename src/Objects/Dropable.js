
export default class Dropable {
  constructor(scene, x, y, spr, expTime){
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,spr,0);

    const mainBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, 30, 30);

    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,35);
    this.sensor.isSensor = true;

    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [mainBody, this.sensor],
      frictionAir: 0.02
    });

    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)

    this.sprite.body.restitution = 0.5;

    //despues de un tiempo determinado el Dropable sera destruido por este timer
    this.timer = this.scene.time.addEvent({
      delay: expTime,
      callback: () => (this.dropableExpire(this))
    });

    scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
      objectA: this.sensor,
      objectB: this.scene.game.player.mainBody,
      callback:() => (this.dropablePicked(this)),
      context: this
    });
  }

  dropablePicked(drop){
    this.timer.destroy();
    this.sprite.destroy();
    drop = undefined;
  }

  //funcion que destruye al Dropable
  dropableExpire(drop){
    drop.sprite.destroy();
    drop = undefined;
  }
}
