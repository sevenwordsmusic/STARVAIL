import Enemy from "./Enemy.js";
import DropableAirEnergy from "../Objects/Dropables/DropableAirEnergy.js"

//enemigo que hereda de Enemy
export default class ZapperAir extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);
    this.sprite.setScale(0.4);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, 40, 40, {chamfer: { radius: 8 } });
    this.sensors = {
      left:   Bodies.rectangle(-28, 0, 10, 20, { isSensor: true }),
      right:  Bodies.rectangle(28, 0, 10, 20, { isSensor: true }),
      top:    Bodies.rectangle(0, -28, 20, 10, { isSensor: true }),
      bottom: Bodies.rectangle(0, 28, 20, 10, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [body, this.sensors.left, this.sensors.right, this.sensors.top, this.sensors.bottom]
    });

    this.sprite.setExistingBody(compoundBody).setPosition(x, y).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -1;

    this.sprite.setIgnoreGravity(true);
    this.sprite.body.frictionAir = 0.06;
    this.sprite.body.friction = 0;

    this.adjustedFriction = this.sprite.body.frictionAir / this.scene.matter.world.getDelta();
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate

    //Variables de IA
    //No Tocar
    this.patrolDir = new Phaser.Math.Vector2(0,0);
    this.patrolDistance = 1000;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    this.stopper = false;
    //No Tocar

    //Ajustar estas
    this.patrolRouteLength = 100;  //al patrullar cuanto se desplaza antes de darse la vuelta
    this.patrolSpeed = 3;                                             //velocidad al patrullar
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
        objectA: [this.sensors.left, this.sensors.right, this.sensors.top, this.sensors.bottom],
        callback: this.onSensorCollide,
        context: this
      });
    })
    this.stateUpdate(0, function(){
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x, this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length();
      //console.log("w8ing");
      if(velocityVec.length() <= this.patrolDistance){
        this.goTo(1);
      }
    })
    this.stateOnStart(1, function(){
      this.stopper = false;
      const distanceFromStart = (new Phaser.Math.Vector2(this.initPos.x - this.sprite.x, this.initPos.y - this.sprite.y)).length();
      this.velX = Phaser.Math.FloatBetween(this.patrolSpeed/2, this.patrolSpeed);
      this.velY = Phaser.Math.FloatBetween(this.patrolSpeed/2, this.patrolSpeed);
      if(distanceFromStart < this.patrolRouteLength){
        this.patrolDir.x = (Math.random()<0.5)?-1:1;
        this.patrolDir.y = (Math.random()<0.5)?-1:1;
      }
      else{
        this.patrolDir.x = Math.sign(this.initPos.x - this.sprite.x);
        this.patrolDir.y = Math.sign(this.initPos.y - this.sprite.y);
      }
      this.patrolTimer1 = this.scene.time.addEvent({
        delay: 3000,
        callback: () => (this.resetState())
      },this);
      this.patrolTimer2 = this.scene.time.addEvent({
        delay: 1000,
        callback: () => (this.stopper = true)
      },this);
    });
    this.stateUpdate(1, function(time, delta){
      if(this.sprite.body === undefined)return;
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x,this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      if(velLength > this.detectDistance){
        if(!this.stopper){
          this.sprite.setVelocityX(this.velX * this.patrolDir.x);
          this.sprite.setVelocityY(this.velY * this.patrolDir.y);
        }
      }else{
        this.goTo(2);
      }
    })
    this.stateOnEnd(1, function(){
      this.patrolTimer1.remove();
      this.patrolTimer2.remove();
    });

    this.stateUpdate(2, function(time, delta){
      if(this.sprite.body === undefined)return;
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x,this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      if(velLength > this.hitDistance){
        velocityVec.scale(this.detectSpeed/velLength);
        this.sprite.setVelocityX(velocityVec.x * delta);
        this.sprite.setVelocityY(velocityVec.y * delta);
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
    this.startAI();
    //IA
  }

  update(time, delta){
      super.update(time, delta);
  }

  onSensorCollide({ bodyA, bodyB, pair }){
    if (bodyB.isSensor) return;
    console.log("s");
    if (bodyA === this.sensors.right)
      this.velX = -1;
    else if (bodyA === this.sensors.left)
      this.velX = 1;
    else if (bodyA === this.sensors.top)
      this.velY = 1;
    else if (bodyA === this.sensors.bottom)
      this.velY = -1;
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

  enemyDead(vXDmg, vYDmg){
    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    super.enemyDead();
    new DropableAirEnergy(this.scene, xAux, yAux, Math.sign(vXDmg), Math.sign(vYDmg),  50);
  }
}
