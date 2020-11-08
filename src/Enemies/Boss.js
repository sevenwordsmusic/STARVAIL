import Enemy from "./Enemy.js";
import DropableBossEnergy from "../Objects/Dropables/DropableBossEnergy.js"
import BossGun from "./BossGun.js";
import Audio from "../Audio.js";
import BossAfter from "../NPCs/BossAfter.js"

//enemigo que hereda de Enemy
export default class Boss extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'playerIdle', 20);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite
    const body = Bodies.rectangle(0, 6, w * 0.45, h * 0.85, { chamfer: { radius: 5 } })
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
    this.sprite.setExistingBody(body).setPosition(x, y).setScale(1.5).setIgnoreGravity(true).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = body;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = body;
    this.sprite.body.collisionFilter.group = -2;

    this.sprite.body.frictionAir = 0.06;
    this.sprite.body.friction = 0;

    this.adjustedFriction = this.sprite.body.frictionAir / this.scene.matter.world.getDelta();

    //Variables de IA
    //No Tocar
    this.patrolDir = new Phaser.Math.Vector2(0,0);
    this.initDir = new Phaser.Math.Vector2(0,0);
    this.patrolDistance = 650;
    this.initPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y-100);
    this.stopper = false;
    this.playerVector = new Phaser.Math.Vector2(0, 0);
    this.stopper = false;
    this.velX = 0;
    this.velY = 0;
    this.randPatrolSpeed = 0;
    this.currentWeapon = Math.floor(Math.random()*3);
    this.lethalLaser = false;
    //No Tocar

    //Ajustar estas
    this.patrolSpeed = 3;                                           //velocidad al patrullar
    this.patrolRouteLength = 300;                                     //al patrullar cuanto se desplaza antes de darse la vuelta
    this.landSpeed = 5/this.scene.matter.world.getDelta();           //velocidad mientras aterriza para dispara laser
    this.lastSpeed = 2/this.scene.matter.world.getDelta();           //velocidad mientras se va al punto de lanzamiento de su ultimo ataque
    /*
    Arma 0 = balas
    Arma 1 = misiles
    Arma 2 = bombas
    */
    this.fireRate = [3];                                              //fire rate de cada arma
    this.fireRate[0] = 100;
    this.fireRate[1] = 500;
    this.fireRate[2] = 300;
    this.fireDamage = [3]                                             //daño de cada arma
    this.fireDamage[0] = 1;
    this.fireDamage[1] = 10;
    this.fireDamage[2] = 10;


    this.nextEnergy = 20;                                            //cada cuanta vida gastada suelta energia
    this.energyDrop = 10;                                             //drop de energia

    this.weaponSwitch = 2000;                                          //cada cuanto tiempo cambia de arm_airUp
    this.weaponSwitchRand = 500;                                       //varianza aleatoria del cambio de arma
    this.laserFire = 4000;                                             //cada cuanto dispara lasser
    this.laserFireRand = 1000;                                         //varianza aleatoria de disparo de laser
    //Ajustar estas
    //Variables de IA

    this.gun = new BossGun(scene, this.sprite.x, this.sprite.y, this.fireDamage[0], this.fireDamage[1], this.fireDamage[2]);
    this.hpBoundry = this.nextEnergy;
    this.weasponSwitchTimer = this.scene.time.addEvent({
      delay: Phaser.Math.Between(this.weaponSwitch - this.weaponSwitchRand, this.weaponSwitch + this.weaponSwitchRand),
      callback: () => (this.cycleWeapon()),
      repeat: -1
    },this);
    /*
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.left, this.sensors.right, this.sensors.top, this.sensors.bottom],
      callback: this.onSensorCollide,
      context: this
    });*/

    //IA
    this.initializeAI(6);
    this.stateOnStart(0, function(){
      if(this.sprite.body === undefined)return;

      this.sprite.body.frictionAir = 0.06;
      this.stopper = false;
      this.velX = Phaser.Math.FloatBetween(this.patrolSpeed/2, this.patrolSpeed);
      this.velY = Phaser.Math.FloatBetween(this.patrolSpeed/2, this.patrolSpeed);

      if(this.sprite.y < this.initPos.y - 300){
        this.patrolDir.y = 1;
      }
      else if(this.sprite.y < this.initPos.y){
        this.patrolDir.y = (Math.random()<0.5)?-1:1;
      }else{
        this.patrolDir.y = -1;
      }

      if(this.sprite.x < this.initPos.x - 300){
        this.patrolDir.x = 1;
      }
      else if(this.sprite.x > this.initPos.x + 300){
        this.patrolDir.x = -1;
      }else{
        this.patrolDir.x = (Math.random()<0.5)?-1:1;
      }
      this.patrolTimer1 = this.scene.time.addEvent({
        delay: Phaser.Math.Between(2000, 2400),
        callback: () => (this.resetState())
      },this);
      this.patrolTimer2 = this.scene.time.addEvent({
        delay: Phaser.Math.Between(1800, 2200),
        callback: () => (this.stopper = true)
      },this);
      this.fireTimer = this.scene.time.addEvent({
        delay: this.fireRate[this.currentWeapon],
        callback: () => (this.gun.shoot(this.currentWeapon)),
        repeat: -1
      },this);
      this.laserTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(this.laserFire - this.laserFireRand, this.laserFire + this.laserFireRand),
        callback: () => (this.goTo(1), this.laserTimer.remove())
      },this);
    })

    this.stateUpdate(0, function(time, delta){
      if(this.sprite.body === undefined)return;
      if(!this.stopper){
        if(this.patrolDir.y <= 0 || this.sprite.y < this.initPos.y){
          this.sprite.setVelocityX(this.velX * this.patrolDir.x);
          this.sprite.setVelocityY(this.velY * this.patrolDir.y);
        }
      }
      this.playAnimation1();
      this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
      this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
      this.gun.followPosition(this.sprite.x,this.sprite.y);
      this.gun.aimGun(this.playerVector.angle());
    })
    this.stateOnEnd(0, function(){
      if(this.sprite.body === undefined)return;
      this.patrolTimer1.remove();
      this.patrolTimer2.remove();
      this.fireTimer.remove();
    });

    this.stateUpdate(1, function(time, delta){
      if(this.sprite.body === undefined)return;
      this.playAnimation1();
      this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
      this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
      this.gun.followPosition(this.sprite.x,this.sprite.y);
      this.gun.aimGun(this.playerVector.angle());
      this.initDir.x = this.initPos.x - this.sprite.x;
      this.initDir.y = this.initPos.y - this.sprite.y + 100;
      if(Math.abs(this.initDir.x) > 4 || Math.abs(this.initDir.y) > 4){
        this.initDir.normalize();
        this.sprite.setVelocityX(this.initDir.x * this.landSpeed * delta);
        this.sprite.setVelocityY(this.initDir.y * this.landSpeed * delta);
      }
      else{
        this.goTo(2);
      }
    })

    this.stateOnStart(2, function(){
      if(this.sprite.body === undefined)return;
      this.playAnimation2();
      this.sprite.x = this.initPos.x;
      this.sprite.y = this.initPos.y + 100;
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.patrolTimer1 = this.scene.time.addEvent({
        delay: 350,
        callback: () => (this.gun.fireLaser())
      },this);
    })

    this.stateUpdate(2, function(time, delta){
      if(this.sprite.body === undefined)return;
      this.gun.followPosition(this.sprite.x,this.sprite.y);
      this.gun.followLaser();
      if(!this.lethalLaser){
        this.playerVector.x = this.scene.game.player.sprite.x - this.sprite.x;
        this.playerVector.y = this.scene.game.player.sprite.y - this.sprite.y;
        this.gun.adjustLaser(this.playerVector.angle(), delta);
      }
    })

    this.stateUpdate(3, function(time, delta){
      if(this.sprite.body === undefined)return;
      this.playAnimation1();
      this.gun.followPosition(this.sprite.x,this.sprite.y);
      this.gun.sprite.angle = -90;
      this.initDir.x = this.initPos.x - this.sprite.x;
      this.initDir.y = this.initPos.y - this.sprite.y -300;
      if(Math.abs(this.initDir.x) > 4 || Math.abs(this.initDir.y) > 4){
        this.initDir.normalize();
        this.sprite.setVelocityX(this.initDir.x * this.lastSpeed * delta);
        this.sprite.setVelocityY(this.initDir.y * this.lastSpeed * delta);
      }
      else{
        this.goTo(4);
      }
    })

    this.stateOnStart(4, function(){
      if(this.sprite.body === undefined)return;
      this.sprite.x = this.initPos.x;
      this.sprite.y = this.initPos.y - 300;
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.gun.fireMegaLaser()
      this.patrolTimer1 = this.scene.time.addEvent({
        delay: 2000,
        callback: () => (this.goTo(5), this.gun.destroy())
      },this);
      this.playAnimation1();
    })

    this.stateOnStart(5, function(){
      this.scene.events.emit('noEnemy' + this.currentBodyIndex);
      this.scene.bulletInteracBodies[this.currentBodyIndex] = undefined;
      this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = undefined;
      this.sprite.destroy();
      new BossAfter(this.scene, this.initPos.x, this.initPos.y - 300);
      this.scene.time.addEvent({
        delay: 5000,
        callback: () => (console.log("irse a escena final"))
      },this);
    })


    this.startAI();
    //IA

    //AUDIO
      this.sfx=Audio.play3DenemyInstance(this, 40);
      this.sfxDetect=Audio.play2Dinstance(54);
      this.stateChanged=false;
    //
  }

  update(time, delta){
      super.update(time, delta);
  }

  playAnimation1(){
    const dir = this.scene.game.player.sprite.x < this.sprite.x;
    if(!this.stopper){
      if(this.sprite.body.velocity.y > 0.1){
        this.sprite.anims.play('airDown', true);
        this.gun.adjustOffset(5 * ((dir)?1:-1), 4);
      }else if(Math.abs(this.sprite.body.velocity.x) > 0.1){
        this.sprite.anims.play('airMove', true);
        this.gun.adjustOffset(-2 * ((dir)?1:-1), 4);
      }else if(this.sprite.body.velocity.y < -0.1){
        this.sprite.anims.play('airUp', true);
        this.gun.adjustOffset(3 * ((dir)?1:-1), -1);
      }
    }
    /*else{
      this.sprite.anims.play('airIdle', true);
      this.gun.adjustOffset(3 * ((dir)?1:-1), -1);
    }*/

    this.sprite.setFlipX(dir);

  }

  playAnimation2(){
    const dir = this.scene.game.player.sprite.x < this.sprite.x;
    this.sprite.anims.play('idle', true);
    this.gun.adjustOffset(5 * ((dir)?1:-1), 0);
    this.sprite.setFlipX(dir);
  }

  cycleWeapon(){
    const nextWeapon = Math.floor(Math.random()*3);
    this.currentWeapon = (this.currentWeapon+nextWeapon)%3;
    this.fireTimer.delay = this.fireRate[this.currentWeapon];
    console.log("Boss ha cambiado de arma: " + this.currentWeapon);
  }

  damage(dmg, v){
    //AUDIO
    if(Math.random()>0.3){
      var auxSfx=Audio.play3DinstanceRnd(this,45);
    }else{
      var auxSfx=Audio.play3DinstanceRnd(this,44);
    }
    auxSfx.setDetune(auxSfx.detune+100);

    if(this.sprite != undefined){
      const hpDiff = this.hpBoundry - dmg;
      if(hpDiff <= 0){
        const energyDrops = Math.floor(Math.abs(hpDiff)/this.nextEnergy);
        for(var i=0; i<energyDrops+1; i++){
          new DropableBossEnergy(this.scene, this.sprite.x, this.sprite.y, (this.sprite.x < this.scene.game.player.sprite.x)?1:-1,  this.energyDrop);
        }
        this.hpBoundry = this.nextEnergy;
      }else{
        this.hpBoundry -= dmg
      }
    }


    super.damage(dmg, v);
  }
  damageLaser(dmg, v){
    //AUDIO
      Audio.load.lasserSufferingLoop.setDetune(-100);
    //
    if(this.sprite != undefined){
      const hpDiff = this.hpBoundry - dmg;
      if(hpDiff <= 0){
        const energyDrops = Math.floor(Math.abs(hpDiff)/this.nextEnergy);
        for(var i=0; i<energyDrops+1; i++){
          new DropableBossEnergy(this.scene, this.sprite.x, this.sprite.y, (this.sprite.x < this.scene.game.player.sprite.x)?1:-1,  this.energyDrop);
        }
        this.hpBoundry = this.nextEnergy;
      }else{
        this.hpBoundry -= dmg
      }
    }

    super.damageLaser(dmg, v);
  }
  damageAndKnock(dmg, knockback, v){
    if(this.sprite != undefined){
      const hpDiff = this.hpBoundry - dmg;
      if(hpDiff <= 0){
        const energyDrops = Math.floor(Math.abs(hpDiff)/this.nextEnergy);
        for(var i=0; i<energyDrops+1; i++){
          new DropableBossEnergy(this.scene, this.sprite.x, this.sprite.y, (this.sprite.x < this.scene.game.player.sprite.x)?1:-1,  this.energyDrop);
        }
        this.hpBoundry = this.nextEnergy;
      }else{
        this.hpBoundry -= dmg
      }
    }

    super.damageAndKnock(dmg, knockback, v);
  }

  enemyDead(vXDmg, vYDmg, drop = true){
    this.goTo(3);
    if(!this.dead){
      //AUDIO
      Audio.play3DinstanceRnd(this, 52);
      this.sfx.stop();
      this.sfxDetect.stop();
      //
      this.weasponSwitchTimer.destroy();
      this.patrolTimer1.destroy();
      this.patrolTimer2.destroy();
      this.fireTimer.destroy();
      this.laserTimer.destroy()


      this.dead = true;
    }
  }
  updatePlayerPosition(dist){
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
      this.sfxDetect=Audio.play3Dinstance(this, 41);
      this.stateChanged=true;
    }
  }
  //
}
