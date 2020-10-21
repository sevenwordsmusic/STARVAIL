import Projectile from "../Projectile.js";
import Enemy from "../../../Enemies/Enemy.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class LasserBullet extends Projectile {
  constructor(scene, x, y, dmg, speed, velDirection, expTime, target, distanceToPlayer){
    super(scene, x, y,  expTime);
    //inicializacion
    this.target = target;
    this.dmg = dmg;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = new Phaser.Math.Vector2(velDirection.x, velDirection.y);
    this.pVelocity.scale(speed / this.scene.matter.world.getDelta());

    this.distAcumulator = distanceToPlayer;
  }

  //se para el update y si se trata de un enemigo, este recibe daño
  itemExpire(proj){

   //AUDIO_BALAEXPLOSIVA_Collision (aqui explotaria)
      Audio.play3Dinstance(this, 0);
    //
    if(this.target.collided && this.target.colSpecialObj != undefined && Object.getPrototypeOf(this.target.colSpecialObj.constructor) === Enemy)
      this.target.colSpecialObj.damage(this.dmg, this.pVelocity);

    const bombExplosion = this.scene.add.sprite(this.target.colX, this.target.colY,  "explosion");
    bombExplosion.setDepth(10).setScale(1) //42
    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });
    //animacion de explosion
    bombExplosion.anims.play('explosion', true);

    proj = undefined;
  }

  distanceToPlayer(){
    return this.distAcumulator;
  }
}
