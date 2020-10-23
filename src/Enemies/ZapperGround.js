import Enemy from "./Enemy.js";
import DropableGroundEnergy from "../Objects/Dropables/DropableGroundEnergy.js"
import EnergyBall from "../Objects/Projectiles/EnemyProjectiles/EnergyBall.js"

//enemigo que hereda de Enemy
export default class ZapperGround extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);
    this.sprite.setScale(0.4);

    //this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const body = Bodies.rectangle(0, 6, 30, 75);
    this.sensors = {
      left: Bodies.rectangle(-25, 6, 10, 20, { isSensor: true }),
      right: Bodies.rectangle(25 , 6, 10, 20, { isSensor: true }),
      bottom: Bodies.rectangle(0, 60, 10, 10, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [body, this.sensors.left, this.sensors.right, this.sensors.bottom]
    });

    this.sprite.setExistingBody(compoundBody).setOrigin(0.52, 0.55).setPosition(x, y).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -1;
    this.sprite.body.restitution = 0.4;

    this.adjustedFriction = this.sprite.body.friction / this.scene.matter.world.getDelta();
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate

    //Variables de IA
    //No Tocar
    this.patrolDir = (Math.round(Math.random()) == 1)?1:-1;
    this.patrolDistance = 1000;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    this.traveledDistance = 0;
    //No Tocar

    //Ajustar estas
    this.patrolRouteLength = 100*this.scene.matter.world.getDelta();  //al patrullar cuanto se desplaza antes de darse la vuelta
    this.patrolSpeed = 1/this.scene.matter.world.getDelta();        //velocidad al patrullar
    this.detectDistance = 100;                                        //distancia a la uqe detecta el jugador cuando esta patrullando
    this.detectSpeed = 2.5/this.scene.matter.world.getDelta();        //velocidad al detectarlo
    this.hitDistance = 50;                                            //distancia de la cual se pone a golpear
    this.hitSpeed = 0.5/this.scene.matter.world.getDelta();           //pequeña velocidad mientras está golpeando
    this.hitDamage = 15;                                              //daño al golpear
    //Ajustar estas
    //Variables de IA

    //IA
    this.initializeAI(4);
    this.stateOnStart(0, function(){
      this.scene.matterCollision.addOnCollideStart({
        objectA: [this.sensors.left, this.sensors.right],
        callback: this.onSensorCollide,
        context: this
      });
      this.scene.matterCollision.addOnCollideEnd({
        objectA: this.sensors.bottom,
        callback: this.onSensorCollide2,
        context: this
      });
    });
    this.stateUpdate(0, function(){
      this.sprite.setIgnoreGravity(true);
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x, this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      //console.log("w8ing");
      if(velocityVec.length() <= this.patrolDistance){
        this.goTo(1);
      }
    })
    this.stateUpdate(1, function(time, delta){
      this.sprite.setIgnoreGravity(false);
      if(this.sprite.body === undefined)return;
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x,this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      if(velLength > this.detectDistance){
        this.sprite.setVelocityX(this.patrolSpeed * this.patrolDir * delta);
        this.traveledDistance += delta;
        if(this.traveledDistance >= this.patrolRouteLength){
          this.traveledDistance = 0;
          this.patrolDir = -this.patrolDir;
        }
      }else{
        this.goTo(2);
      }
    })
    this.stateUpdate(2, function(time, delta){
      if(this.sprite.body === undefined)return;
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x,this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      if(velLength > this.hitDistance){
        if(Math.abs(this.scene.game.player.sprite.x - this.sprite.x) > this.hitDistance/2)
          this.sprite.setVelocityX(this.detectSpeed * Math.sign(this.scene.game.player.sprite.x - this.sprite.x) * delta);
        //console.log("persuing");
      }else{
        this.goTo(3)
      }
    })
    this.stateOnStart(3, function(){
      this.sprite.anims.play('dummy', true)
      this.sprite.once('animationcomplete', function(){
        this.goTo(2);
      },this);
      this.scene.time.addEvent({
        delay: 500,
        callback: () => (this.inflictDamagePlayerArea(this.sprite.x-50, this.sprite.y-50, this.sprite.x+50, this.sprite.y+50))
      },this);
    });

    this.stateUpdate(3, function(time, delta){
      this.sprite.setVelocityX(this.hitSpeed * Math.sign(this.scene.game.player.sprite.x - this.sprite.x) * delta);
    });
    this.startAI();
    //IA
  }

  update(time, delta){
      super.update(time, delta);
  }

  onSensorCollide({ bodyA, bodyB, pair }){
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.right)
      this.patrolDir = -1;
    else if (bodyA === this.sensors.left)
      this.patrolDir = 1;
    this.traveledDistance = 0;
  }

  onSensorCollide2({ bodyA, bodyB, pair }){
    // if (bodyB.isSensor) return;
    // const bodyB32X = Math.floor(bodyB.position.x/32);
    // const bodyB32Y = Math.floor(bodyB.position.y/32);
    // if(this.scene.tileBodyMatrix[bodyB32X + 2*this.patrolDir][bodyB32Y] === undefined){
    //   this.patrolDir = -this.patrolDir;
    //   this.traveledDistance = 0;
    // }
  }

  inflictDamagePlayerArea(x1, y1, x2, y2){
    this.scene.graphics.clear();
    this.scene.graphics.fillRect(x1,y1, x2-x1, y2-y1);
    if(super.playerHit(x1, y1, x2, y2))
      this.scene.game.player.playerDamage(this.hitDamage);
  }


  damage(dmg, v){
    if(this.currentStateId() < 2)
      this.goTo(2);
    super.damage(dmg, v);
  }

  enemyDead(vXDmg){
    if(this.sprite.body !== undefined){
      const xAux = this.sprite.x;
      const yAux = this.sprite.y;
      new EnergyBall(this.scene, xAux, yAux, 14, 0.1, 15, new Phaser.Math.Vector2(-1,0), 1000);
      super.enemyDead();
      new DropableGroundEnergy(this.scene, xAux, yAux, Math.sign(vXDmg),  150);
    }
  }
}
