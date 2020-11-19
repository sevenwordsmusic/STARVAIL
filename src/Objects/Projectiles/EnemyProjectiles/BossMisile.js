import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class BossMisile extends Projectile {
  constructor(scene, x, y, dmg, knockback, speed, velDir, expTime){
    super(scene, x, y, expTime);

    this.dmg = dmg;
    this.knockback = knockback;

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'bullets',2);

    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,6);

    this.sprite.setExistingBody(body).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setDepth(5).setScale(1.75,1.3);
    this.sprite.setSensor(true).setIgnoreGravity(true);
    this.sprite.body.frictionAir = 0;
    this.sprite.body.collisionFilter.group = -3;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    this.pVelocity = this.pVelocity.normalize();
    this.sprite.setVelocity(this.pVelocity.x * speed, this.pVelocity.y * speed);
    this.sprite.angle = this.pVelocity.angle() * 180/Math.PI;

    this.projectileArmed = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sprite.body,
      callback: this.onSensorCollide,
      context: this
    });

    //AUDIO
      Audio.play3Dinstance(26);
      this.scene.events.on("update", this.update, this);
      this.sfx=Audio.play3Dinstance(this, 29);
    //

  }



  update(time, delta){
      //AUDIO
          if(!Audio.waitForUpdate()){
            this.sfx.volume=Audio.volume3D(this);
          }
      //

  }



  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
    if(bodyB === this.scene.game.player.mainBody){
      this.projectileArmed();
      this.timer.remove();
      this.scene.game.player.playerDamageKnockback(this.dmg, this.knockback, this.pVelocity);   //this.scene.game.player.playerDamage(this.dmg);
      this.itemExpire(this);
    }
    else if(bodyB.gameObject.parent == undefined){
      this.projectileArmed();
      this.timer.remove();
      this.itemExpire(this);
    }
  }

  itemExpire(proj){
      //AUDIO
        Audio.play3DinstanceRnd(this,16);
        this.sfx.volume= 0.0;
      //

    this.projectileArmed();

    const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
    bombExplosion.setDepth(10).setScale(2)

    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });
    //animacion de explosion
    bombExplosion.anims.play('explosion', true);
    super.itemExpire(proj);
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
