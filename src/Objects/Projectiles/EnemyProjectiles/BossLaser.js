import Projectile from "../Projectile.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class BossLaser {
  constructor(scene, x, y, dirVec, gun){
    this.scene = scene;
    this.gun = gun
    this.lethal = false;

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'laserNonLethal',0);
    this.sprite.parent = this;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite
    const body = Bodies.rectangle(0, 0, w, h);
    this.sprite.setExistingBody(body).setPosition(x, y);

    this.sprite.setDepth(5).setScale(4,0.75);
    this.sprite.setSensor(true).setIgnoreGravity(true);
    this.sprite.body.collisionFilter.group = -3;
    this.sprite.angle = dirVec.angle() * 180/Math.PI;

    this.sprite.anims.play('laserNonLethal', true);

   this.sprite.once('animationcomplete', function(){
      this.scene.boss.lethalLaser = true;
      this.sprite.anims.play('laserLethal', true);
      this.projectileArmed = this.scene.matterCollision.addOnCollideActive({
        objectA: this.sprite.body,
        objectB: this.scene.game.player.mainBody,
        callback: this.onSensorCollide,
        context: this
      });
      this.sprite.once('animationcomplete', function(){
        this.projectileArmed();
        this.itemExpire(this);
        this.scene.boss.lethalLaser = false;
        this.gun.laser = undefined;
      },this);
    },this);
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor ||  bodyB == undefined || bodyB.gameObject == undefined) return;
      this.scene.game.player.playerDamage(10000, true);
  }

  itemExpire(proj){
    this.scene.boss.gun.laser = undefined;
    this.sprite.destroy();
    this.sprite = undefined;
  }

  /*adjust(angle){
      this.sprite.angle = angle;
  }*/
}
