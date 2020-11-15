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
}
