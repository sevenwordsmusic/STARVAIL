import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class Megaton extends Projectile {
  constructor(scene, x, y, spr, dmg, area, knockback, extraEff, speed, velDir, dir, expTime){
    super(scene, x, y, expTime);
    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,"bullets",spr);
    this.sprite.setScale(1.15);
    this.sprite.parent = this;
    this.dmg = dmg;
    this.area = area;
    this.knockback = knockback;
    this.extraEff = extraEff;

    this.mainBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, 17, 8);
    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,19);
    this.sensor.isSensor = true;

    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [this.mainBody, this.sensor],
    });
    this.sprite.setExistingBody(compoundBody).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setDepth(5).setFlipX(dir >= 0);
    this.sprite.setAngularVelocity(0.15 * dir);
    this.sprite.body.collisionFilter.group = -2;
    //this.sprite.body.collisionFilter.category = 4;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    const fAdjuster = Math.min(1, 0.4 + this.pVelocity.length()/400);
    this.pVelocity = this.pVelocity.normalize().scale(speed * fAdjuster);
    this.sprite.setVelocity(this.pVelocity.x -(1*dir), this.pVelocity.y - 4);

    this.sprite.body.restitution = 0.5;

    this.bombArmed1;
    this.bombArmed2;

    //AUDIO
      this.sfx=Audio.play3DinstanceNoRate(this, 13);
      this.touchDelay=1.0;
    //
    this.scene.events.on("update", this.update, this);
  }

  //AUDIO
  update(time, delta){
    if(this.sprite!= undefined && Audio.waitForUpdate()){
        this.sfx.volume=Audio.volume3D(this)
    }
  }
  //

  armBomb(){
    this.bombArmed1 = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensor,
      objectB: this.scene.enemyController.enemyBodies.filter(body => body != undefined),
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
    if(bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
    this.timer.remove();
      if(bodyB.gameObject.parent != undefined){
        //AUDIO
            Audio.play3DinstanceRndVolume(this, 5, this.touchDelay);
        //
      this.itemExpire();
    }
  }
  onBodyCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    //AUDIO
        Audio.play3DinstanceRndVolume(this, 5, this.touchDelay);
        this.touchDelay=this.touchDelay*0.6;
        this.sfx.volume=Audio.volume3D(this);
    //
  }

  itemExpire(){
    this.bombArmed1();
    this.bombArmed2();
    //AUDIO
      Audio.play3DinstanceRnd(this,15);
      Audio.play3DinstanceRnd(this,18);
      this.sfx.stop();
      this.scene.events.off("update", this.update, this);
    //
    var bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "megatonExplosion");
    bombExplosion.setDepth(10).setScale(3) //42
    this.damageEnemiesArea();
    this.scene.cameras.main.shake(300, 0.01);

    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });
    //animacion de explosion
    bombExplosion.anims.play('megatonExplosion', true);

    this.mainBody = undefined;
    this.sensor = undefined;
    super.itemExpire();

    this.pVelocity = undefined;
    this.bombArmed1 = undefined;
    this.bombArmed2 = undefined;
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
  /*damageEnemiesArea2(){
    console.log("Big Explosion");
    var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, this.area*this.extraEff, this.scene.enemyController.enemyBodies);
    if(damagedEnemies.length > 0){AUDIO ENEMIGO DAÑADO}
    for(var i in damagedEnemies){
      if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
        damagedEnemies[i].gameObject.parent.damageAndKnock(this.dmg*this.extraEff, this.knockback*this.extraEff, new Phaser.Math.Vector2(damagedEnemies[i].gameObject.x - this.sprite.x, damagedEnemies[i].gameObject.y - this.sprite.y));
    }
  }*/

  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 5000;    //ARREGLAR ESTO
  }
}
