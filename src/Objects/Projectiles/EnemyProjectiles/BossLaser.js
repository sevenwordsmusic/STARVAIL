import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class BossLaser extends Projectile {
  constructor(scene, x, y, expTime){
    super(scene, x, y, expTime);

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'explodingBomb',0);
    bombExplosion.anims.play('explosion', true);

    this.sprite.setDepth(5);
    this.sprite.setStatic(true).setSensor(true).setIgnoreGravity(true);

    this.projectileArmed = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sprite.body,
      objectB: this.scene.game.player.mainBody,
      callback: this.onSensorCollide,
      context: this
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
      this.scene.game.player.playerDamageKnockback(10000, true);
  }

  itemExpire(proj){
    this.projectileArmed();
    super.itemExpire(proj);
  }
}
