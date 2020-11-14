import Enemy from "./Enemy.js";
import DropableGroundEnergy from "../Objects/Dropables/DropableGroundEnergy.js"
import MechGun from "./MechGun.js";
import Audio from "../Audio.js";
import TileController from "../TileController.js"

//enemigo que hereda de Enemy
export default class Mecha extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'mecha', 500);
    this.sprite.setScale(2.5);

    //this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const body = Bodies.rectangle(0, 0, 45, 100, {chamfer: { radius: 10 } });
    /*this.sensors = {
      left: Bodies.rectangle(-25, 6, 10, 20, { isSensor: true }),
      right: Bodies.rectangle(25 , 6, 10, 20, { isSensor: true }),
      bottom: Bodies.rectangle(0, 60, 10, 10, { isSensor: true })
    };*/

    this.sensor = Bodies.rectangle(0, 65, 10, 10, { isSensor: true });
    const compoundBody = Body.create({
      parts: [body, this.sensor]
    });

    this.sprite.setExistingBody(compoundBody).setPosition(x, y).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -3;
    this.sprite.body.restitution = 0.4;
    this.sprite.setOrigin(0.5,0.62);

    this.adjustedFriction = this.sprite.body.friction / this.scene.matter.world.getDelta();


    //Variables de IA
    //No Tocar
    this.patrolDir = (Math.round(Math.random()) == 1)?1:-1;
    this.standByReDistance = 950;
    this.patrolDistance = 900;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    this.traveledDistance = 0;
    this.playerVector = new Phaser.Math.Vector2(0, 0);
    this.leftMultiply = 1;
    this.rightMultiply = 1;
    //No Tocar

    //Ajustar estas
    this.patrolRouteLength = 100*this.scene.matter.world.getDelta();  //al patrullar cuanto se desplaza antes de darse la vuelta
    this.patrolSpeed = 1.5/this.scene.matter.world.getDelta();        //velocidad al patrullar
    this.detectDistance = 500;                                        //distancia a la uqe detecta el jugador cuando esta patrullando
    this.detectSpeed = 1.5/this.scene.matter.world.getDelta();        //velocidad al detectarlo
    this.retreatDistance = 300;                                            //distancia de la cual se pone a huir
    this.hitDamage = 10;                                                //daño al golpear
    this.fireRate = 800;                                               //fire rate del droid
    this.energyDrop = 100;                                             //drop de energia
    //Ajustar estas
    //Variables de IA

    this.gun = new MechGun(scene, this.sprite.x, this.sprite.y, this.hitDamage);


    /*this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });*/
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.sensor,
      callback: this.onSensorCollide2,
      context: this
    });

    //IA
    //this.initializeAI(4);
    this.initializeAI(3);
    this.stateOnStart(0, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.sprite.anims.stop();
      this.sprite.setIgnoreGravity(true);
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.sprite.body.friction = 10;
      this.gun.followPosition(this.sprite.x, this.sprite.y);
      TileController.disableEnemy(this.sprite);
    });
    this.stateOnEnd(0,function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      TileController.enableEnemy(this.sprite);
      this.sprite.body.friction = 0.1;
      this.sprite.setIgnoreGravity(false);
      this.gun.followPosition(this.sprite.x, this.sprite.y);
    })
    this.stateOnStart(1, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.sprite.body.friction = 0.1;
      this.sprite.setIgnoreGravity(false);
      this.gun.followPosition(this.sprite.x, this.sprite.y);
    });
    this.stateUpdate(1, function(time, delta){
      if(this.sprite == undefined || this.sprite.body == undefined)return;

      this.sprite.setVelocityX(this.patrolSpeed * this.patrolDir * ((this.patrolDir>=0)?this.rightMultiply:this.leftMultiply) * delta);
      this.traveledDistance += delta;
      if(this.traveledDistance >= this.patrolRouteLength){
        this.traveledDistance = 0;
        this.patrolDir = -this.patrolDir;
      }
      this.gun.followPosition(this.sprite.x, this.sprite.y);

      if(this.sprite.body.velocity.x >= 0.1){
        this.sprite.setFlipX(false);
        this.sprite.anims.play('mechaWalk', true);
      }else if(this.sprite.body.velocity.x <= -0.1){
        this.sprite.setFlipX(true);
        this.sprite.anims.play('mechaWalk', true);
      }else {
        this.sprite.anims.play('mechaWalk', true);
      }
    })
    this.stateOnStart(2, function(){
      this.fireTimer = this.scene.time.addEvent({
        delay: this.fireRate,
        callback: () => (this.gun.shoot()),
        repeat: -1
      },this);
    })
    this.stateUpdate(2, function(time, delta){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
      this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
      this.distanceToCheck = Math.sqrt( Math.pow(this.playerVector.x ,2) +  Math.pow(this.playerVector.y ,2));
      if(this.distanceToCheck <= this.retreatDistance){
        this.sprite.setVelocityX(this.detectSpeed * delta * ((this.playerVector.x >= 0)?-this.leftMultiply:this.rightMultiply));
      }
      else{
        this.sprite.setVelocityX(this.detectSpeed * delta * ((this.playerVector.x >= 0)?this.rightMultiply:-this.leftMultiply));
      }

      this.gun.followPosition(this.sprite.x, this.sprite.y);
      this.gun.aimGun(this.playerVector.angle());

      if(Math.abs(this.sprite.body.velocity.x) < 0.5){
        this.sprite.anims.play('mechaIdle', true);
      }
      if(Math.abs(this.distanceToCheck - this.retreatDistance) < 5){
        this.sprite.setVelocityX(0);
        this.sprite.anims.play('mechaIdle', true);
      }else{
        if(this.playerVector.x >= 0){
          this.sprite.setFlipX(false);
          if(this.sprite.body.velocity < 0)
            this.sprite.anims.play('mechaWalk', true);
          else
            this.sprite.anims.playReverse('mechaWalk', true);
        }else {
          this.sprite.setFlipX(true);
          if(this.sprite.body.velocity > 0)
            this.sprite.anims.playReverse('mechaWalk', true);
          else
            this.sprite.anims.play('mechaWalk', true);
        }
      }
    })
    this.stateOnEnd(2, function(){
      this.fireTimer.remove();
    })

    this.startAI();
    //IA

    //AUDIO
      this.sfx=Audio.play3DenemyInstance(this, 50);
      this.sfxDetect=Audio.play2Dinstance(54);
      this.stateChanged=false;
    //
  }

  update(time, delta){
    super.update(time, delta);
      //AUDIO
        this.sfx.volume=Audio.volume3D(this);
        this.sfxDetect.volume=Audio.volume3D(this);
      //
  }

  updateTouchBoundry(){
    if(this.sprite != undefined)
      TileController.enemyFullTouchBoundry(this.scene, this.sprite, 1, 2);
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
     if (bodyB.isSensor) return;
     this.leftMultiply = 1;
     this.rightMultiply = 1;
     if(this.scene.tileBodyMatrix[Math.floor(bodyB.position.x/32) - 2][Math.floor(bodyB.position.y/32)] === undefined){
       this.leftMultiply = 0;
     }else{
       this.leftMultiply = 1;
     }
     if(this.scene.tileBodyMatrix[Math.floor(bodyB.position.x/32) + 2][Math.floor(bodyB.position.y/32)] === undefined){
       this.rightMultiply = 0;
     }else{
       this.rightMultiply = 1;
     }
  }

  inflictDamagePlayerArea(position){
    if(this.sprite == undefined || this.sprite.body == undefined)return;
    this.scene.graphics.clear();
    this.scene.graphics.fillRect(this.sprite.x-50, this.sprite.y-50, 100, 100);
    if(super.playerHit(this.sprite.x-50, this.sprite.y-50, this.sprite.x+50, this.sprite.y+50))
      this.scene.game.player.playerDamage(this.hitDamage);
  }


  damage(dmg, v){
      //AUDIO
        if(Math.random()>0.5){
          var auxSfx=Audio.play3DinstanceRnd(this,45);
        }else{
         var auxSfx=Audio.play3DinstanceRnd(this,44);
        }
          auxSfx.setDetune(auxSfx.detune-100);
      //
    if(this.currentStateId() == 1){
      //AUDIO
        this.soundChangeState();
      //
      this.goTo( 2);
    }else if(this.currentStateId() != 0)
      super.damage(dmg, v);
  }
  damageLaser(dmg, v){
    //AUDIO
      Audio.load.lasserSufferingLoop.setDetune(-200);
    //
    if(this.currentStateId() == 1){
      //AUDIO
        this.soundChangeState();
      //
      this.goTo(2);
    }else if(this.currentStateId() != 0)
      super.damageLaser(dmg, v);
  }

  enemyDead(vXDmg){
    this.goTo(0);
    if(!this.dead){
      //AUDIO
          Audio.play3DinstanceRnd(this, 59);
          Audio.play3DinstanceRnd(this, 65);
          this.sfx.stop();
          this.sfxDetect.stop();
      //
      let explosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "enemyExplosion");
      explosion.setDepth(10).setScale(3);
      //al completar su animacion de explsion, dicha instancia se autodestruye
      explosion.on('animationcomplete', function(){
        explosion.destroy();
      });
      //animacion de explosion
      explosion.anims.play('enemyExplosion', true);
      super.enemyDead();
      new DropableGroundEnergy(this.scene, this.sprite.x, this.sprite.y, Math.sign(vXDmg),  this.energyDrop);
      this.gun.destroy();
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
        this.sfxDetect.setRate(Audio.volume2D(dist)+0.75);

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
  }
  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 512;    //ARREGLAR ESTO
  }

  //AUDIO
  soundChangeState(){
    if(!this.stateChanged){
      this.sfxDetect=Audio.play3Dinstance(this, 51);
      this.stateChanged=true;
    }
  }
  //
}
