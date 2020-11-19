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
    this.sprite = scene.matter.add.sprite(x,y,'bullets',7);

    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,7);

    this.sprite.setExistingBody(body).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setDepth(5).setScale(1.25);
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

    //AUDIO
    Audio.play3Dinstance(this, 24);
    this.sfx=Audio.play3DinstanceNoRate(this, 12);
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


  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
    //AUDIO
        this.touchDelay=this.touchDelay*0.6;
        this.sfx.volume=Audio.volume3D(this);
        Audio.play3DinstanceVolume(this, 4, this.touchDelay);
    //
    if(bodyB === this.scene.game.player.mainBody){
      this.timer.remove();
      this.itemExpire(this);
    }
  }

  itemExpire(proj){
        //AUDIO
          Audio.play3DinstanceRnd(this,14);
          this.sfx.stop();
          this.scene.events.off("update", this.update, this);
        //

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
