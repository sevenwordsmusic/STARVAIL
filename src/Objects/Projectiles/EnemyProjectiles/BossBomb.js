import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class BossBomb extends Projectile {
  constructor(scene, x, y, dmg, knockback, speed, velDir, expTime){
    super(scene, x, y, expTime);

    this.dmg = dmg;
    this.knockback = knockback;
    this.area = 45;

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'explodingBomb',0);

    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,6);

    this.sprite.setExistingBody(body).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setDepth(5).setScale(0.75);
    this.sprite.body.frictionAir = 0;
    this.sprite.body.collisionFilter.group = -3;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    this.pVelocity = this.pVelocity.normalize();
    this.sprite.setVelocity(this.pVelocity.x * speed, this.pVelocity.y * speed - 2);

    this.projectileArmed = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sprite.body,
      callback: this.onSensorCollide,
      context: this
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
    if(bodyB === this.scene.game.player.mainBody){
      this.timer.remove();
      this.itemExpire(this);
    }
  }

  itemExpire(proj){
    this.projectileArmed();
    var damagedPlayer = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, this.area, [this.scene.game.player.mainBody]);
    if(damagedPlayer != undefined && damagedPlayer[0] != undefined && damagedPlayer[0].gameObject != null)
      this.scene.game.player.playerDamageKnockback(this.dmg, this.knockback, this.pVelocity);

    const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
    bombExplosion.setDepth(10).setScale(this.area/15)

    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });
    //animacion de explosion
    bombExplosion.anims.play('explosion', true);
    super.itemExpire(proj);
  }
}
