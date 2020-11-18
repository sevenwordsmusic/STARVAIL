import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class Bomb extends Projectile {
  constructor(scene, x, y, spr, dmg, area, knockback, speed, velDir, dir, expTime, isMini){
    super(scene, x, y, expTime);
    this.dmg = dmg;
    this.area = area;
    this.knockback = knockback;

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,"bullets",spr);
    this.sprite.setScale(1.5);

    this.mainBody = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,11);
    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,19);
    this.sensor.isSensor = true;

    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [this.mainBody, this.sensor],
    });
    this.sprite.setExistingBody(compoundBody).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setDepth(5).setFlipX(dir >= 0);
    this.sprite.setAngularVelocity(0.2 * dir);
    this.sprite.body.collisionFilter.group = -2;
    //this.sprite.body.collisionFilter.category = 1;        //por defecto
    //this.sprite.body.collisionFilter.mask = 4294967295;   //por defecto

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    const fAdjuster = Math.min(1, 0.4 + this.pVelocity.length()/400);
    this.pVelocity = this.pVelocity.normalize().scale(speed * fAdjuster);
    this.sprite.setVelocity(this.pVelocity.x -(1*dir), this.pVelocity.y - 4);

    this.sprite.body.restitution = 0.5;

    this.bombArmed1;
    this.bombArmed2;

    //AUDIO
    this.isMini=isMini;
    if(this.isMini){
      this.sfx=Audio.play3DinstanceNoRate(this, 31);
    }else{
      this.sfx=Audio.play3DinstanceNoRate(this, 12);
    }
    this.touchDelay=1.0;
    //
    this.scene.events.on("update", this.update, this);
  }

  //AUDIO
  update(time, delta){
    if(this.sprite!= undefined && Audio.waitForUpdate() ){
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

  delayArmBomb(delayTime){
    this.scene.time.addEvent({
      delay: delayTime,
      callback: () => (this.armBomb())
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if(bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
    if (bodyB.isSensor) return;
    //AUDIO
        if(this.isMini){
          Audio.play3DinstanceVolume(this, 6, this.touchDelay);
        }else{
          Audio.play3DinstanceVolume(this, 4, this.touchDelay);
        }
    //
    this.timer.remove();
    this.itemExpire();
  }
  onBodyCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    //AUDIO
        if(this.isMini){
          Audio.play3DinstanceVolume(this, 6, this.touchDelay);
        }else{
          Audio.play3DinstanceVolume(this, 4, this.touchDelay);
        }
        this.touchDelay=this.touchDelay*0.6;
        this.sfx.volume=Audio.volume3D(this);
    //
  }

  itemExpire(){
      this.bombArmed1();
      this.bombArmed2();
        //AUDIO
          if(this.isMini){
            Audio.play3DinstanceRnd(this,18);
          }else{
            Audio.play3DinstanceRnd(this,14);
          }
          this.sfx.stop();
          this.scene.events.off("update", this.update, this);
        //
      let bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
      bombExplosion.setDepth(10).setScale(this.area/15) //45
      this.damageEnemiesArea();
      //al completar su animacion de explsion, dicha instancia se autodestruye
      bombExplosion.on('animationcomplete', function(){
        bombExplosion.destroy();
      });
      //animacion de explosion
      bombExplosion.anims.play('explosion', true);

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
