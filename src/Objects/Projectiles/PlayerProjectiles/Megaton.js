import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class Megaton extends Projectile {
  constructor(scene, x, y, spr, dmg, area, knockback, extraEff, speed, velDir, dir, expTime){
    super(scene, x, y, expTime);
    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,spr,0);
    this.sprite.parent = this;
    this.dmg = dmg;
    this.area = area;
    this.knockback = knockback;
    this.extraEff = extraEff;

    this.mainBody = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,11);
    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,19);
    this.sensor.isSensor = true;

    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [this.mainBody, this.sensor],
    });
    this.sprite.setExistingBody(compoundBody).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setOrigin(0.5, 0.61).setDepth(5)
    this.sprite.setFlipX(dir >= 0);
    this.sprite.setAngularVelocity(0.2 * dir);
      this.sprite.body.collisionFilter.group = 0;
    this.sprite.body.collisionFilter.category = 4;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    const fAdjuster = Math.min(1, 0.4 + this.pVelocity.length()/400);
    this.pVelocity = this.pVelocity.normalize().scale(speed * fAdjuster);
    this.sprite.setVelocity(this.pVelocity.x -(1*dir), this.pVelocity.y - 4);

    this.sprite.body.restitution = 0.5;

    this.bombArmed1;
    this.bombArmed2;

    //AUDIO
      this.sfx=Audio.play3Dinstance(this, 13);
      this.touchDown=true;
      this.touchDelay=0;
    //
  }

  armBomb(){
    this.bombArmed1 = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensor,
      callback: this.onSensorCollide,
      context: this
    });
    this.bombArmed2 = this.scene.matterCollision.addOnCollideStart({
      objectA: this.mainBody,
      callback: this.onBodyCollide,
      context: this
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if(bodyB === undefined)return;
    if(bodyB.gameObject.parent !== undefined){
      this.timer.remove();
      if(bodyB.gameObject.parent.constructor.name === "Megaton")
        this.itemExpire(this, true);
      else
        this.itemExpire(this, false);
    }
  }
  onBodyCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    //AUDIO_BOMBA
      if(this.touchDown==true && this.touchDelay<3){
        this.touchDelay++;
        this.sfx.volume=Audio.play3Dinstance(this, 5).volume;
      }else if(this.touchDown==true && this.touchDelay== 3){
        this.touchDown=false;
        this.touchDelay=0;
      }
    //
  }

  itemExpire(proj, big = false){
    this.bombArmed1();
    this.bombArmed2();
    //AUDIO
    Audio.play3Dinstance(this,15);
    this.sfx.volume= 0.0;
    //
    var bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
    if(!big){
      bombExplosion.setDepth(10).setScale(this.area/15) //42
      this.damageEnemiesArea();
      this.scene.cameras.main.shake(300, 0.01);
    }else{
      bombExplosion.setDepth(10).setScale(this.area/15*this.extraEff) //42
      this.damageEnemiesArea2();
      this.scene.cameras.main.shake(350*this.extraEff, 0.015*this.extraEff);
    }

    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });
    //animacion de explosion
    bombExplosion.anims.play('explosion', true);

    super.itemExpire(proj);
  }

  damageEnemiesArea(){
    var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, this.area, this.scene.enemyController.enemyBodies);
    for(var i in damagedEnemies){
      if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
        damagedEnemies[i].gameObject.parent.damageAndKnock(this.dmg, this.knockback, new Phaser.Math.Vector2(damagedEnemies[i].gameObject.x - this.sprite.x, damagedEnemies[i].gameObject.y - this.sprite.y));
    }
  }
  damageEnemiesArea2(){
    console.log("Big Explosion");
    var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, this.area*this.extraEff, this.scene.enemyController.enemyBodies);
    for(var i in damagedEnemies){
      if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
        damagedEnemies[i].gameObject.parent.damageAndKnock(this.dmg*this.extraEff, this.knockback*this.extraEff, new Phaser.Math.Vector2(damagedEnemies[i].gameObject.x - this.sprite.x, damagedEnemies[i].gameObject.y - this.sprite.y));
    }
  }

  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }
}
