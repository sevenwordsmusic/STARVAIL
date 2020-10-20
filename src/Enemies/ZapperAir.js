import Enemy from "./Enemy.js";
import DropableAirEnergy from "../Objects/Dropables/DropableAirEnergy.js"

//enemigo que hereda de Enemy
export default class ZapperAir extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 10000);
    this.sprite.setScale(0.4);

    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, 40, 40, {chamfer: { radius: 8 } });
    this.sprite.setExistingBody(body).setPosition(x, y).setFixedRotation();
    console.log(this.sprite.body);
    this.scene.bulletInteracBodies[this.currentBodyIndex] = this.sprite.body;
    this.scene.enemyBodies[this.currentEnemyIndex] = this.sprite.body;
    this.sprite.body.collisionFilter.group = -1;

    this.sprite.setIgnoreGravity(true);
    this.sprite.body.frictionAir = 0.06;
    this.sprite.body.friction = 0;

    this.adjustedFriction = this.sprite.body.frictionAir / this.scene.matter.world.getDelta();
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate

    //Variables de IA
    this.patrolSpeed = 2;
    this.detectSpeed = 2.5;
    this.hitDamage = 15;
    this.patrolDistance = 1000;
    this.detectDistance = 250;
    this.hitDistance = 50;
    //Variables de IA

    //IA
    this.initializeAI(4);
    this.stateOnStart(0, function(){
      this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
      this.newPatrol = true;
    });
    this.stateUpdate(0, function(){
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x, this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      //console.log("w8ing");
      if(velocityVec.length() <= this.patrolDistance){
        this.goTo(1);
      }
    })
    this.stateOnStart(1, function(){
    this.sprite.body.frictionAir = 0;
      if(this.newPatrol)
        var objectiveVel = new Phaser.Math.Vector2(Phaser.Math.Between(-100, 100) ,Phaser.Math.Between(-100, 100));
      else
        var objectiveVel = new Phaser.Math.Vector2(Phaser.Math.Between(0, 100)*(((this.initPos.x - this.sprite.x)>=0)?1:-1) ,Phaser.Math.Between(0, 100)*(((this.initPos.y - this.sprite.y)>=0)?1:-1));
      this.newPatrol = !this.newPatrol;
      objectiveVel.normalize().scale(this.patrolSpeed);
      this.sprite.setVelocityX(objectiveVel.x);
      this.sprite.setVelocityY(objectiveVel.y);
      this.patrolTimer = this.scene.time.addEvent({
        delay: 3000,
        callback: () => (this.resetState())
      },this);
      this.patrolTimer = this.scene.time.addEvent({
        delay: 1000,
        callback: () => (this.sprite.body.frictionAir = 0.03)
      },this);
    });
    this.stateUpdate(1, function(){
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x,this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      if(velLength > this.detectDistance){
        //hace algo durante patrulla
      }else{
        this.goTo(2);
      }
    })
    this.stateOnEnd(1, function(){
      this.patrolTimer.remove();
      this.sprite.body.frictionAir = 0.06;
    });

    this.stateUpdate(2, function(){
      const velocityVec = new Phaser.Math.Vector2(this.scene.game.player.sprite.x - this.sprite.x,this.scene.game.player.sprite.y - this.sprite.y);
      const velLength = velocityVec.length()
      if(velLength > this.hitDistance){
        velocityVec.scale(this.detectSpeed/velLength);
        this.sprite.setVelocityX(velocityVec.x);
        this.sprite.setVelocityY(velocityVec.y);
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
        delay: 1000,
        callback: () => (this.inflictDamagePlayerArea(this.sprite.x-50, this.sprite.y-50, this.sprite.x+50, this.sprite.y+50))
      },this);
    });
    this.startAI();
    //IA
  }

  update(time, delta){
      super.update(time, delta);
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
