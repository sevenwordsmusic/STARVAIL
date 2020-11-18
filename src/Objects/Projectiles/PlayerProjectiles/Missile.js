import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class Missile extends Projectile {
  constructor(scene, x, y, spr, dmg, area, knockback, autoAim, speed, velDir, dir, expTime){
    super(scene, x, y, expTime);
     //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,"bullets",spr);
    this.sprite.setScale(2,1.5);
    this.sprite.parent = this;
    this.dmg = dmg;
    this.area = area;
    this.knockback = knockback;
    this.speed = speed;
    this.autoAim = autoAim;

    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,12);
    this.sensor.isSensor = true;

    this.sprite.setExistingBody(this.sensor).setPosition(x, y).setDepth(5);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.angle = velDir.angle() * 180/Math.PI;
    //this.sprite.setAngularVelocity(0.2 * dir);
    this.sprite.body.collisionFilter.group = -2;
    //this.sprite.body.collisionFilter.category = 4;

    this.sprite.setIgnoreGravity(true);

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    this.pVelocity = this.pVelocity.normalize().scale(speed);
    this.sprite.setVelocity(this.pVelocity.x , this.pVelocity.y);
    this.sprite.body.frictionAir = 0;

    this.sprite.body.restitution = 0.5;

    this.scene.events.on("update", this.update, this);
    this.bombArmed1;
    //this.bombArmed2;
    this.comit = 1;
    if(this.scene.game.player.closestEnemy != undefined && this.scene.game.player.closestEnemy.sprite !== undefined && this.scene.game.player.closestEnemy.sprite.body !== undefined){
    const objectiveDirection3 = new Phaser.Math.Vector3(this.scene.game.player.closestEnemy.sprite.x - this.sprite.x,
                                                this.scene.game.player.closestEnemy.sprite.y - this.sprite.y, 0);
    const currentDir3 = new Phaser.Math.Vector3(this.pVelocity.x ,this.pVelocity.y  , 0);
    const crossProd = objectiveDirection3.cross(currentDir3);
    if(crossProd.z >= 0)
      this.comit = -1;
    else
      this.comit = 1;

    }

    //AUDIO
      this.sfx=Audio.play3Dinstance(this, 29);
    //
  }

  update(time, delta){
    if(this.sprite!= undefined && this.sprite.body != undefined){
      const currentVel = new Phaser.Math.Vector2(this.sprite.body.velocity.x, this.sprite.body.velocity.y);
      const currentAngle = currentVel.angle();

      if(this.scene.game.player.closestEnemy !== undefined && this.scene.game.player.closestEnemy.sprite !== undefined && this.scene.game.player.closestEnemy.sprite.body !== undefined){
        const objectiveDirection = new Phaser.Math.Vector2(this.scene.game.player.closestEnemy.sprite.x - this.sprite.x,
                                                  this.scene.game.player.closestEnemy.sprite.y - this.sprite.y);
        const objectiveAngle = objectiveDirection.angle();

        if(Math.abs(objectiveAngle - currentAngle) > this.autoAim * delta){
          currentVel.x = Math.cos(currentAngle + this.autoAim * delta * this.comit) * this.speed/2.5;
          currentVel.y = Math.sin(currentAngle + this.autoAim * delta * this.comit) * this.speed/2.5;
          this.sprite.setVelocity(currentVel.x, currentVel.y);
          this.sprite.angle = (currentAngle - this.autoAim) * 180/Math.PI;
        }
        else{
          objectiveDirection.normalize().scale(this.speed);
          this.sprite.setVelocity(objectiveDirection.x, objectiveDirection.y);
          this.sprite.angle = (objectiveAngle) * 180/Math.PI;
          this.scene.events.off("update", this.update, this);
        }
      }
      else{
        currentVel.x = Math.cos(currentAngle + this.autoAim * delta * this.comit) * this.speed/2.5;
        currentVel.y = Math.sin(currentAngle + this.autoAim * delta * this.comit) * this.speed/2.5;
        this.sprite.setVelocity(currentVel.x, currentVel.y);
        this.sprite.angle = (currentAngle - this.autoAim) * 180/Math.PI;
      }
      //AUDIO
          if(Audio.waitForUpdate()){
            this.sfx.volume=Audio.volume3D(this);
          }
      //
    }
  }

  armBomb(){
    //this.sprite.body.collisionFilter.group = 0;
    this.bombArmed1 = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensor,
      callback: this.onSensorCollide,
      context: this
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if(bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
    this.reachedTarget(this, bodyB, pair);
  }

  reachedTarget(proj, bodyB, pair){
    if(this.sprite.body != undefined){
      this.bombArmed1();

      const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
      bombExplosion.setDepth(10).setScale(this.area/15) //42
      this.damageEnemiesArea();

      //al completar su animacion de explsion, dicha instancia se autodestruye
      bombExplosion.on('animationcomplete', function(){
        bombExplosion.destroy();
      });
      //animacion de explosion
      bombExplosion.anims.play('explosion', true);

      this.itemExpire();
    }
  }

  itemExpire(){
    this.scene.events.off("update", this.update, this);
      //AUDIO
        Audio.play3DinstanceRnd(this,16);
        this.sfx.volume= 0.0;
      //
    this.sensor = undefined;
    super.itemExpire();

    this.pVelocity = undefined;
    this.bombArmed1 = undefined;
    this.sfx = undefined;
    this.scene = undefined
  }

  damageEnemiesArea(){
    var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, this.area, this.scene.enemyController.enemyBodies);
    if(damagedEnemies.length > 0){/*AUDIO ENEMIGO DAÑADO*/}
    for(var i in damagedEnemies){
      if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
        damagedEnemies[i].gameObject.parent.damageAndKnock(this.dmg, this.knockback, new Phaser.Math.Vector2(damagedEnemies[i].gameObject.x - this.sprite.x, damagedEnemies[i].gameObject.y - this.sprite.y));
    }
  }


  distanceToPlayer(){
    if(this.sprite == undefined || this.sprite.body == undefined || this.scene.game.player == undefined || this.scene.game.player.sprite == undefined  || this.scene.game.player.sprite.body == undefined)
      return Number.MAX_SAFE_INTEGER;
    const distance = Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    if(distance == undefined)
      return Number.MAX_SAFE_INTEGER;
    else
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
  }
}
