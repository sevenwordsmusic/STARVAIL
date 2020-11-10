import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class EnergyBall extends Projectile {
  constructor(scene, x, y, dmg, knockback, speed, velDir, expTime){
    super(scene, x, y, expTime);

    this.dmg = dmg;
    this.knockback = knockback;

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'bulletImpact5',0);

    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,9);

    this.sprite.setExistingBody(body).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setDepth(5).setScale(0.75);
    this.sprite.setSensor(true).setIgnoreGravity(true);
    this.sprite.body.frictionAir = 0;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    this.pVelocity = this.pVelocity.normalize();
    this.sprite.setVelocity(this.pVelocity.x * speed, this.pVelocity.y * speed);
    this.sprite.setAngularVelocity(0.2 * ((this.pVelocity.x >= 0)?1:-1));

    this.projectileArmed = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sprite.body,
      callback: this.onSensorCollide,
      context: this
    });
    //AUDIO
      //Audio.play3Dinstance(this,53);
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
    this.projectileArmed();

    const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "bulletImpact5");
    bombExplosion.setDepth(10).setScale(1);
    if(this.sprite != undefined)
      bombExplosion.angle = this.sprite.angle;

    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });
    //animacion de explosion
    bombExplosion.anims.play('bulletImpact5', true);
    super.itemExpire(proj);
  }
  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }
}
