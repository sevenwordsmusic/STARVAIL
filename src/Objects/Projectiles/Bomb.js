import Projectile from "./Projectile.js";
import SuperiorQuery from "../../SuperiorQuery.js";
import Audio from "../../Audio.js";

//proyectil que hereda de Projectile
export default class Bomb extends Projectile {
  constructor(scene, x, y, speed, dir, expTime){
    super(scene, x, y, expTime);
    //AUDIO:

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'explodingBomb',0);

    const mainBody = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,11);
    const sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,16);
    sensor.isSensor = true;

    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [mainBody, sensor],
    });
    this.sprite.setExistingBody(compoundBody).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setOrigin(0.5, 0.61).setDepth(5)
    this.sprite.setFlipX(dir >= 0);
    this.sprite.setAngularVelocity(0.2 * dir);
    this.sprite.body.collisionFilter.group = 0;
    this.sprite.body.collisionFilter.category = 4;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -x, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-y);
    const fAdjuster = Math.min(1, 0.4 + this.pVelocity.length()/400);
    this.pVelocity = this.pVelocity.normalize().scale(speed * fAdjuster);
    this.sprite.setVelocity(this.pVelocity.x -(1*dir), this.pVelocity.y - 4);

    this.sprite.body.restitution = 0.5;

    scene.matterCollision.addOnCollideStart({
      objectA: sensor,
      objectB: this.scene.enemyBodies.filter(body => body != undefined),
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideStart({
      objectA: mainBody,
      callback: this.onBodyCollide,
      context: this
    });

    //AUDIO
    this.sfx= Audio.playRate(Audio.load.wick_00,0.85+(Math.random() * 0.3));
    this.touchDown=true;
    this.touchDelay=0;
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    this.timer.remove();
    this.itemExpire(this);
  }
  onBodyCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    //AUDIO_BOMBA_Collision (esto se invoca cada vez que choca contra algo como el suelo)
    if(this.touchDown==true && this.touchDelay<3){
      this.touchDelay++;
      Audio.distancePlayRate(this,Audio.load.impact_01,0.85+(Math.random() * 0.3));
    }else if(this.touchDown==true && this.touchDelay== 3){
      this.touchDown=false;
      this.touchDelay=0;
    }
  }

  itemExpire(proj){
      const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
      bombExplosion.setDepth(10).setScale(3) //42

      var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, 40, this.scene.enemyBodies);
      for(var i in damagedEnemies){
        if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
          damagedEnemies[i].gameObject.parent.damage(100, this.sprite.x, this.sprite.y);
      }
      //al completar su animacion de explsion, dicha instancia se autodestruye
      bombExplosion.on('animationcomplete', function(){
        bombExplosion.destroy();
      });
      //animacion de explosion
      bombExplosion.anims.play('explosion', true);

      //AUDIO_BOMBA_Explosion (aqui explotaria la bomba)
      Audio.distancePlayRate(this,Audio.load.explosion_01,0.85+(Math.random() * 0.3));
      this.sfx.volume= 0.0;
      super.itemExpire(proj);
  }

  distanceToPlayer(){
    return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
  }
}
