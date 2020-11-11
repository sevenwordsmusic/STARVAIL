import Enemy from "./Enemy.js";
import DropableAirEnergy from "../Objects/Dropables/DropableAirEnergy.js"
import Audio from "../Audio.js";

//enemigo que hereda de Enemy
export default class BombAir extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'bomb', 50);
    this.sprite.setScale(1.65);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, 25, 25, {chamfer: { radius: 8 } });
    /*this.sensors = {
      left:   Bodies.rectangle(-28, 0, 10, 20, { isSensor: true }),
      right:  Bodies.rectangle(28, 0, 10, 20, { isSensor: true }),
      top:    Bodies.rectangle(0, -28, 20, 10, { isSensor: true }),
      bottom: Bodies.rectangle(0, 28, 20, 10, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [body, this.sensors.left, this.sensors.right, this.sensors.top, this.sensors.bottom]
    });

    this.sprite.setExistingBody(compoundBody).setPosition(x, y).setFixedRotation();*/
    this.sprite.setExistingBody(body).setPosition(x, y).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -1;

    this.sprite.setIgnoreGravity(true);
    this.sprite.body.frictionAir = 0.06;
    this.sprite.body.friction = 0;

    this.adjustedFriction = this.sprite.body.frictionAir / this.scene.matter.world.getDelta();

    //Variables de IA
    //No Tocar
    this.patrolDir = new Phaser.Math.Vector2(0,0);
    this.standByReDistance = 700;
    this.patrolDistance = 650;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    this.stopper = false;
    this.playerVector = new Phaser.Math.Vector2(0, 0);
    //No Tocar

    //Ajustar estas
    this.patrolRouteLength = 100;  //al patrullar cuanto se desplaza antes de darse la vuelta
    this.patrolSpeed = 2;                                             //velocidad al patrullar
    this.detectDistance = 250;                                        //distancia a la uqe detecta el jugador cuando esta patrullando
    this.detectSpeed = 4/this.scene.matter.world.getDelta();        //velocidad al detectarlo
    this.hitDistance = 50;                                            //distancia de la cual se pone a golpear
    this.hitSpeed = 0.5/this.scene.matter.world.getDelta();           //pequeña velocidad mientras está golpeando
    this.hitDamage = 50;                                              //daño al golpear
    this.energyDrop = 50;                                             //drop de energia
    //Ajustar estas
    //Variables de IA
    /*
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.left, this.sensors.right, this.sensors.top, this.sensors.bottom],
      callback: this.onSensorCollide,
      context: this
    });*/

    //IA
    this.initializeAI(4);
    this.stateOnStart(0, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.anims.stop();
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.sprite.body.frictionAir = 10;
    })
    this.stateOnStart(1, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.body.frictionAir = 0.06;
      this.stopper = false;
      this.distanceToCheck= Math.sqrt( Math.pow(this.initPos.x - this.sprite.x,2) +  Math.pow(this.initPos.y - this.sprite.y,2));
      this.velX = Phaser.Math.FloatBetween(this.patrolSpeed/2, this.patrolSpeed);
      this.velY = Phaser.Math.FloatBetween(this.patrolSpeed/2, this.patrolSpeed);
      if(this.distanceToCheck < this.patrolRouteLength){
        this.patrolDir.x = (Math.random()<0.5)?-1:1;
        this.patrolDir.y = (Math.random()<0.5)?-1:1;
      }
      else{
        this.patrolDir.x = Math.sign(this.initPos.x - this.sprite.x);
        this.patrolDir.y = Math.sign(this.initPos.y - this.sprite.y);
      }

      this.sprite.anims.stop();

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
      if(!this.stopper){
        this.sprite.setVelocityX(this.velX * this.patrolDir.x);
        this.sprite.setVelocityY(this.velY * this.patrolDir.y);
      }
      this.sprite.setFlipX(this.sprite.body.velocity.x<0);
    })
    this.stateOnEnd(1, function(){
      if(this.sprite.body === undefined)return;
      this.patrolTimer1.remove();
      this.patrolTimer2.remove();
    });

    this.stateOnStart(2, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.anims.play('bombHoming', true);
    });
    this.stateUpdate(2, function(time, delta){
      if(this.sprite.body === undefined)return;
      this.sprite.setFlipX(this.scene.game.player.sprite.x<this.sprite.x);
      this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
      this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
      this.distanceToCheck = Math.sqrt( Math.pow(this.playerVector.x ,2) +  Math.pow(this.playerVector.y,2));
      if(this.distanceToCheck > this.hitDistance){
        this.sprite.setVelocityX((this.playerVector.x) *this.detectSpeed/this.distanceToCheck * delta);
        this.sprite.setVelocityY((this.playerVector.y) *this.detectSpeed/this.distanceToCheck * delta);
        //console.log("persuing");
      }else{
        this.targetDir = this.scene.game.player.sprite.x<this.sprite.x;
        this.sprite.setFlipX(this.targetDir);
        this.goTo(3);
      }
    })
    this.stateOnStart(3, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.setFlipX(this.targetDir);
      this.inflictDamagePlayerArea();
      this.enemyDead(0,0, false);
    });
    this.startAI();
    //IA

    //AUDIO
      this.sfx=Audio.play3DenemyInstance(this, 42);
      this.sfxDetect=Audio.play2Dinstance(54);
      this.stateChanged=false;
    //
  }

  update(time, delta){
      super.update(time, delta);
  }

  onSensorCollide({ bodyA, bodyB, pair }){
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.right || bodyA === this.sensors.left)
      this.patrolDir.x = -this.patrolDir.x;
    else if (bodyA === this.sensors.top || bodyA === this.sensors.bottom)
      this.patrolDir.y = -this.patrolDir.y;
  }

  inflictDamagePlayerArea(position){
    if(this.sprite.body === undefined)return;
    this.scene.graphics.clear();
    this.scene.graphics.fillRect(this.sprite.x-100, this.sprite.y-100, 200, 200);
    if(super.playerHit(this.sprite.x-100, this.sprite.y-100, this.sprite.x+100, this.sprite.y+100))
      this.scene.game.player.playerDamage(this.hitDamage);
  }


  damage(dmg, v){
      //AUDIO
        if(Math.random()>0.4){
          var auxSfx=Audio.play3DinstanceRnd(this,45);
        }else{
         var auxSfx=Audio.play3DinstanceRnd(this,44);
        }
          auxSfx.setDetune(auxSfx.detune+50);
      //
    if(this.currentStateId() == 1){
      //AUDIO
        this.soundChangeState();
      //
      this.goTo( 2);
    }
    if(this.currentStateId() != 0)
      super.damage(dmg, v);
  }
  damageLaser(dmg, v){
    //AUDIO
      Audio.load.lasserSufferingLoop.setDetune(-150);
    //
    if(this.currentStateId() == 1)
      //AUDIO
        this.soundChangeState();
      //
      this.goTo(2);
    if(this.currentStateId() != 0)
      super.damageLaser(dmg, v);
  }

  enemyDead(vXDmg, vYDmg, drop = true){
    this.goTo(0);
    if(!this.dead){
      //AUDIO
          Audio.play3DinstanceRnd(this, 52);
          Audio.play3DinstanceRnd(this, 64);
          this.sfx.stop();
          this.sfxDetect.stop();
      //
      super.enemyDead();
      if(drop)
        new DropableAirEnergy(this.scene, this.sprite.x, this.sprite.y, Math.sign(vXDmg), Math.sign(vYDmg),  this.energyDrop);
    }
  }
  updatePlayerPosition(dist){
    switch (this.currentStateId()) {
      case 0:
        if(dist <= this.patrolDistance)
          this.goTo(1);
        if(dist > this.standByReDistance)
          this.goTo(0);
      break;
      case 1:
        if(dist <= this.detectDistance){
          //AUDIO
            this.soundChangeState();
          //
          this.goTo(2);
        }
        if(dist > this.standByReDistance)
          this.goTo(0);
      break;
      case 2:
        //AUDIO
        this.sfx.rate=((Audio.volume2D(dist)*2)+0.75);
        this.sfxDetect.volume=Audio.volume2D(dist);
        //
        if(dist > this.standByReDistance){
          //AUDIO
          this.stateChanged=false;
          this.sfxDetect.stop();
          //
          this.goTo(0);
        }
      break;
      case 3:
        if(dist > this.standByReDistance)
          this.goTo(0);
      break;
    }
    //AUDIO
      this.sfx.volume=Audio.volume2D(dist);
    //
  }
  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }

  //AUDIO
  soundChangeState(){
    if(!this.stateChanged){
      this.sfxDetect=Audio.play3Dinstance(this, 43);
      this.stateChanged=true;
    }
  }
  //
}
