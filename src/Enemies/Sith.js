import Enemy from "./Enemy.js";
import DropableGroundEnergy from "../Objects/Dropables/DropableGroundEnergy.js"
import DropableGroundHealth from "../Objects/Dropables/DropableGroundHealth.js"
import TileController from "../TileController.js"
import Audio from "../Audio.js";

//enemigo que hereda de Enemy
export default class Sith extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'sith', 250, 43);
    this.sprite.setScale(2);

    //this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const body = Bodies.rectangle(0, 0, 30, 60);
    /*this.sensors = {
      left: Bodies.rectangle(-25, 6, 10, 20, { isSensor: true }),
      right: Bodies.rectangle(25 , 6, 10, 20, { isSensor: true }),
      bottom: Bodies.rectangle(0, 60, 10, 10, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [body, this.sensors.left, this.sensors.right, this.sensors.bottom]
    });

    this.sprite.setExistingBody(compoundBody).setOrigin(0.52, 0.55).setPosition(x, y).setFixedRotation();*/
    this.sprite.setExistingBody(body).setPosition(x, y).setFixedRotation().setOrigin(0.5,0.85);
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -3;
    this.sprite.body.restitution = 0;

    this.adjustedFriction = this.sprite.body.friction / this.scene.matter.world.getDelta();

    //Variables de IA
    //No Tocar
    this.standByReDistance = 400;
    this.standByDistance = 450;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    this.playerVector = new Phaser.Math.Vector2(0, 0);
    this.targetDir = false;
    //No Tocar

    //Ajustar estas
    this.points = 200;               //puntos al matar a enemigo
    this.detectSpeed = 4/this.scene.matter.world.getDelta();        //velocidad al detectarlo
    this.hitDistance = 80;                                            //distancia de la cual se pone a golpear
    this.hitSpeed = 1.4/this.scene.matter.world.getDelta();           //pequeña velocidad mientras está golpeando
    this.hitDamage = 150;                                              //daño al golpear
    this.teleportHitDamage = 90;                                       //daño al golpear
    this.healthDrop = 250;
    this.energyDrop = 500;                                             //drop de energia
    this.initialWaitTimer = 5000;                                       //tiempo de espera al descubrir enemigo antes de que te ataque
    this.teleportWaitTimerMin = 3000;                                      //tiempo minimo que espera si no alcanza al jugador antes de teleportarse
    this.teleportWaitTimerMax = 6000;                                      //tiempo maximo que espera si no alcanza al jugador antes de teleportarse
    //Ajustar estas
    //Variables de IA

    //IA
    this.initializeAI(5);
    this.stateOnStart(0, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.sprite.anims.stop();
      this.sprite.setIgnoreGravity(true);
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.sprite.body.friction = 10;
      TileController.disableEnemy(this.sprite);
    });
    this.stateOnEnd(0,function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      TileController.enableEnemy(this.sprite);
      this.sprite.body.friction = 0.1;
      this.sprite.setIgnoreGravity(false);
    })
    this.stateOnStart(1, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
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
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.attackTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(this.teleportWaitTimerMin, this.teleportWaitTimerMax),
        callback: () => (this.goTo(4))
      },this);
      this.sprite.anims.play('sithRun', true);
    });
    this.stateUpdate(2, function(time, delta){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.sprite.setFlipX(this.scene.game.player.sprite.x<this.sprite.x);

      this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
      this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
      this.distanceToCheck = Math.sqrt( Math.pow(this.playerVector.x ,2) +  Math.pow(this.playerVector.y ,2));
      if(this.distanceToCheck > this.hitDistance){
        if(Math.abs(this.playerVector.x) > this.hitDistance/2)
          this.sprite.setVelocityX(this.detectSpeed * Math.sign(this.playerVector.x) * delta);
        //console.log("persuing");
      }else{
        this.targetDir = this.scene.game.player.sprite.x<this.sprite.x;
        this.sprite.setFlipX(this.targetDir);
        this.goTo(3)
      }
    })
    this.stateOnEnd(2, function(){
      this.attackTimer.remove();
    });
    this.stateOnStart(3, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      //this.sprite.body.collisionFilter.group = -1;
      this.sprite.setFlipX(this.targetDir);
      this.sprite.anims.play('sithAttack', true)

      this.sprite.once('animationcomplete', function(){
        this.goTo(2);
      },this);
      this.scene.time.addEvent({
        delay: 400,
        callback: () => (this.inflictDamagePlayerArea(this.targetDir))
      },this);
      this.scene.time.addEvent({
        delay: 1000,
        callback: () => (this.tryFlipX())
      },this);
      this.scene.time.addEvent({
        delay: 1500,
        callback: () => (this.inflictDamagePlayerArea(this.targetDir))
      },this);
    });

    this.stateUpdate(3, function(time, delta){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      this.sprite.setVelocityX(this.hitSpeed * Math.sign(this.scene.game.player.sprite.x - this.sprite.x) * delta);
    });

    this.stateOnEnd(3, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      //this.sprite.body.collisionFilter.group = 0;
    });


    this.stateOnStart(4, function(){
      if(this.sprite == undefined || this.sprite.body == undefined)return;
      //AUDIO
        Audio.play3Dinstance(this, 84);
      //



      //this.sprite.body.collisionFilter.group = -1;
      this.scene.time.addEvent({
        delay: 200,
        callback: () => (this.sprite.x = this.scene.game.player.sprite.x, this.sprite.y = this.scene.game.player.sprite.y, this.sprite.setVelocityY(0))
      },this);
      this.sprite.anims.play('sithTeleport', true)
      /*this.sprite.once('animationcomplete', function(){
        this.goTo(2);
      },this);*/
      this.scene.time.addEvent({
        delay: 600,
        callback: () => (this.inflictDamagePlayerArea2())
      },this);
      this.scene.time.addEvent({
        delay: 1400,
        callback: () => (this.goTo(2))
      },this);
    });
    this.startAI();
    //IA


    //AUDIO
      this.sfx=Audio.play3DenemyInstance(this, 86);
      this.sfxDetect=Audio.play2Dinstance(54);
      this.stateChanged=false;
    //
  }

  tryFlipX(){
    if(this.sprite != undefined && this.sprite.body != undefined){
      this.targetDir =  this.scene.game.player.sprite.x<this.sprite.x;
      this.sprite.setFlipX(this.targetDir);
    }
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
      TileController.enemyHalfTouchBoundry(this.scene, this.sprite, 1, 2, 15);
  }

  inflictDamagePlayerArea(dir){
    if(this.sprite == undefined || this.sprite.body == undefined)return;
      //AUDIO
        Audio.play3DinstanceRnd(this, 85);
      //
    if(dir){
      if(super.playerHit(this.sprite.x-95, this.sprite.y-50, this.sprite.x+10, this.sprite.y+35)){
        //AUDIO
            Audio.play3Dinstance(this,55);
        //
        this.scene.game.player.playerDamage(this.hitDamage, true);
      }
    }else{
      if(super.playerHit(this.sprite.x-10, this.sprite.y-50, this.sprite.x + 95, this.sprite.y+35)){
        //AUDIO
            Audio.play3Dinstance(this,55);
        //
        this.scene.game.player.playerDamage(this.hitDamage, true);
      }
    }
  }
  inflictDamagePlayerArea2(){
    if(this.sprite == undefined || this.sprite.body == undefined)return;
    if(super.playerHit(this.sprite.x-55, this.sprite.y-65, this.sprite.x+55, this.sprite.y+55))
      this.scene.game.player.playerDamage(this.teleportHitDamage, true);
    //Nota para Seven con carinyo de Seven.
  }


  damage(dmg, v){
      //AUDIO
        if(Math.random()>0.85){
          Audio.chat(1,this.scene,"sithDroid");
        }
        if(Math.random()>0.75){
          var auxSfx=Audio.play3DinstanceRnd(this,45);
        }else{
           var auxSfx=Audio.play3DinstanceRnd(this,44);
        }
          auxSfx.setDetune(auxSfx.detune+150);
      //
    if(this.currentStateId() == 1){
      //AUDIO
        this.soundChangeState();
      //
      this.goTo(4);
    }else if(this.currentStateId() != 0)
      super.damage(dmg, v);
  }
  damageLaser(dmg, v){
      //AUDIO
        Audio.load.lasserSufferingLoop.setDetune(-50);
        if(Math.random()>0.9875){
          Audio.chat(1,this.scene,"sithDroid");
        }
      //
    if(this.currentStateId() == 1){
      //AUDIO
        this.soundChangeState();
      //
      this.goTo(4);
    }else if(this.currentStateId() != 0)
      super.damageLaser(dmg, v);
  }

  enemyDead(vXDmg){
    this.goTo(0);
    if(!this.dead){
      //AUDIO
          Audio.play3DinstanceRnd(this, 58);
          Audio.play3DinstanceRnd(this, 64);
          this.sfx.stop();
          this.sfxDetect.stop();
      //
      let explosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "enemyExplosion");
      explosion.setDepth(10).setScale(2.5);
      //al completar su animacion de explsion, dicha instancia se autodestruye
      explosion.on('animationcomplete', function(){
        explosion.destroy();
      });
      //animacion de explosion
      explosion.anims.play('enemyExplosion', true);
      super.enemyDead();
      if(Math.random() < 0.85){
        new DropableGroundHealth(this.scene, this.sprite.x, this.sprite.y, Math.sign(vXDmg),  this.healthDrop);
        }
        new DropableGroundEnergy(this.scene, this.sprite.x, this.sprite.y, Math.sign(vXDmg),  this.energyDrop);;
    }
  }

  updatePlayerPosition(dist){
    switch (this.currentStateId()) {
      case 0:
        if(dist <= this.standByDistance && !this.dead){
          //AUDIO
            this.soundChangeState();
          //
          this.goTo(1);
        }
      break;
      case 2:
        //AUDIO
        this.sfxDetect.setDetune(Audio.volume2D(dist)*1200);

        //
        if(dist > this.standByReDistance){
          this.goTo(4);
        }
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
      this.sfxDetect=Audio.play3Dinstance(this, 87);
      this.stateChanged=true;
    }
  }
  //
}
