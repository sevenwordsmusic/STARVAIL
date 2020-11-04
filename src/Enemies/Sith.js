import Enemy from "./Enemy.js";
import DropableGroundEnergy from "../Objects/Dropables/DropableGroundEnergy.js"

//enemigo que hereda de Enemy
export default class Sith extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'sith', 200);
    this.sprite.setScale(2);

    //this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const body = Bodies.rectangle(0, 0, 30, 50);
    /*this.sensors = {
      left: Bodies.rectangle(-25, 6, 10, 20, { isSensor: true }),
      right: Bodies.rectangle(25 , 6, 10, 20, { isSensor: true }),
      bottom: Bodies.rectangle(0, 60, 10, 10, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [body, this.sensors.left, this.sensors.right, this.sensors.bottom]
    });

    this.sprite.setExistingBody(compoundBody).setOrigin(0.52, 0.55).setPosition(x, y).setFixedRotation();*/
    this.sprite.setExistingBody(body).setPosition(x, y).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -1;
    this.sprite.body.restitution = 0.4;

    this.adjustedFriction = this.sprite.body.friction / this.scene.matter.world.getDelta();

    //Variables de IA
    //No Tocar
    this.standByReDistance = 400;
    this.standByDistance = 600;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    this.playerVector = new Phaser.Math.Vector2(0, 0);
    //No Tocar

    //Ajustar estas
    this.detectSpeed = 3.5/this.scene.matter.world.getDelta();        //velocidad al detectarlo
    this.hitDistance = 80;                                            //distancia de la cual se pone a golpear
    this.hitSpeed = 1/this.scene.matter.world.getDelta();           //pequeña velocidad mientras está golpeando
    this.hitDamage = 30;                                              //daño al golpear
    this.teleportHitDamage = 15;                                       //daño al golpear
    this.energyDrop = 150;                                             //drop de energia
    this.initialWaitTimer = 5000;                                       //tiempo de espera al descubrir enemigo antes de que te ataque
    this.teleportWaitTimerMin = 5000;                                      //tiempo minimo que espera si no alcanza al jugador antes de teleportarse
    this.teleportWaitTimerMax = 8000;                                      //tiempo maximo que espera si no alcanza al jugador antes de teleportarse
    //Ajustar estas
    //Variables de IA

    //IA
    this.initializeAI(5);
    this.stateOnStart(0, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.setIgnoreGravity(true);
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.sprite.body.friction = 10;
    });
    this.stateOnEnd(0,function(){
      if(this.sprite.body === undefined)return;
      this.sprite.body.friction = 0.1;
      this.sprite.setIgnoreGravity(false);
    })
    this.stateOnStart(1, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.body.friction = 0.1;
      this.sprite.setIgnoreGravity(false);

      this.attackTimer = this.scene.time.addEvent({
        delay: this.initialWaitTimer,
        callback: () => (this.goTo(4))
      },this);
    });
    this.stateOnEnd(1, function(){
      this.attackTimer.remove();
    });

    this.stateOnStart(2, function(){
      if(this.sprite.body === undefined)return;
      this.attackTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(this.teleportWaitTimerMin, this.teleportWaitTimerMax),
        callback: () => (this.goTo(4))
      },this);
    });
    this.stateUpdate(2, function(time, delta){
      if(this.sprite.body === undefined)return;
      this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
      this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
      this.distanceToCheck = Math.sqrt( Math.pow(this.playerVector.x ,2) +  Math.pow(this.playerVector.y ,2));
      if(this.distanceToCheck > this.hitDistance){
        if(Math.abs(this.playerVector.x) > this.hitDistance/2)
          this.sprite.setVelocityX(this.detectSpeed * Math.sign(this.playerVector.x) * delta);
        //console.log("persuing");
      }else{
        this.goTo(3)
      }
    })
    this.stateOnEnd(2, function(){
      this.attackTimer.remove();
    });
    this.stateOnStart(3, function(){
      if(this.sprite.body === undefined)return;
      //this.sprite.body.collisionFilter.group = -1;
      this.sprite.anims.play('dummy', true)
      this.sprite.once('animationcomplete', function(){
        this.goTo(2);
      },this);
      this.scene.time.addEvent({
        delay: 200,
        callback: () => (this.inflictDamagePlayerArea())
      },this);
      this.scene.time.addEvent({
        delay: 460,
        callback: () => (this.inflictDamagePlayerArea())
      },this);
    });

    this.stateUpdate(3, function(time, delta){
      if(this.sprite.body === undefined)return;
      this.sprite.setVelocityX(this.hitSpeed * Math.sign(this.scene.game.player.sprite.x - this.sprite.x) * delta);
    });

    this.stateOnEnd(3, function(){
      if(this.sprite.body === undefined)return;
      //this.sprite.body.collisionFilter.group = 0;
    });


    this.stateOnStart(4, function(){
      if(this.sprite.body === undefined)return;
      //this.sprite.body.collisionFilter.group = -1;
      this.scene.time.addEvent({
        delay: 200,
        callback: () => (this.sprite.x = this.scene.game.player.sprite.x, this.sprite.y = this.scene.game.player.sprite.y, this.sprite.setVelocityY(0))
      },this);
      this.sprite.anims.play('dummy', true)
      /*this.sprite.once('animationcomplete', function(){
        this.goTo(2);
      },this);*/
      this.scene.time.addEvent({
        delay: 500,
        callback: () => (this.inflictDamagePlayerArea2())
      },this);
      this.scene.time.addEvent({
        delay: 2000,
        callback: () => (this.goTo(2))
      },this);
    });
    this.startAI();
    //IA
  }

  update(time, delta){
    super.update(time, delta);
  }

  inflictDamagePlayerArea(position){
    if(this.sprite.body === undefined)return;
    this.scene.graphics.clear();
    this.scene.graphics.fillRect(this.sprite.x-50, this.sprite.y-50, 100, 100);
    if(super.playerHit(this.sprite.x-50, this.sprite.y-50, this.sprite.x+50, this.sprite.y+50))
      this.scene.game.player.playerDamage(this.hitDamage, true);
  }
  inflictDamagePlayerArea2(position){
    if(this.sprite.body === undefined)return;
    this.scene.graphics.clear();
    this.scene.graphics.fillRect(this.sprite.x-50, this.sprite.y-50, 100, 100);
    if(super.playerHit(this.sprite.x-50, this.sprite.y-50, this.sprite.x+50, this.sprite.y+50))
      this.scene.game.player.playerDamage(this.teleportHitDamage, true);
  }


  damage(dmg, v){
    if(this.currentStateId() == 1)
      this.goTo(4);
    else if(this.currentStateId() != 0)
      super.damage(dmg, v);
  }
  damageLaser(dmg, v){
    if(this.currentStateId() == 1)
      this.goTo(4);
    else if(this.currentStateId() != 0)
      super.damageLaser(dmg, v);
  }

  enemyDead(vXDmg){
    this.goTo(0);
    if(!this.dead){
      super.enemyDead();
      new DropableGroundEnergy(this.scene, this.sprite.x, this.sprite.y, Math.sign(vXDmg),  this.energyDrop);
    }
  }

  updatePlayerPosition(dist){
    switch (this.currentStateId()) {
      case 0:
        if(dist <= this.standByDistance && !this.dead)
          this.goTo(1);
      break;
      case 2:
        if(dist > this.standByReDistance)
          this.goTo(4);
      break;
    }
  }
}
