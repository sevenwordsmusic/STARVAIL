import Projectile from "./Projectile.js";
import SuperiorQuery from "../../SuperiorQuery.js";

//proyectil que hereda de Projectile
export default class Bomb extends Projectile {
  constructor(scene, x, y, speed, dir, expTime){
    super(scene, x, y, expTime);
    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'explodingBomb',0);

    this.sprite.setCircle(11);
    this.sprite.setOrigin(0.5, 0.61);
    this.sprite.setDepth(5).setAngularVelocity(0.2 * dir);
    this.sprite.setFlipX(dir >= 0);
    this.sprite.body.collisionFilter.group = -1;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -x, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-y);
    const fAdjuster = Math.min(1, 0.4 + this.pVelocity.length()/400);
    this.pVelocity = this.pVelocity.normalize().scale(speed * fAdjuster);
    this.sprite.setVelocity(this.pVelocity.x -(1*dir), this.pVelocity.y - 4);

    //animacion de bomba
    this.sprite.anims.play('eBomb', true);
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.sprite.body,
      callback: this.onSensorCollide,
      context: this
    });
    //AUDIO
    this.touchDown=true;
    this.touchDelay=0;
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    //AUDIO_BOMBA_Collision (esto se invoca cada vez que choca contra algo como el suelo)
    if(this.touchDown==true && this.touchDelay<2){
      this.touchDelay++;
      this.scene.impact_01.play();
      this.scene.impact_01.setRate(0.85+(Math.random() * 0.3));
    }else if(this.touchDown==true){
      this.touchDown=false;
      this.touchDelay=0;
    }
  }

  itemExpire(proj){
      const bombExprosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "exprosion");
      bombExprosion.setDepth(10).setScale(3) //42

      var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, 40, this.scene.enemyBodies);
      for(var i in damagedEnemies){
        if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
          damagedEnemies[i].gameObject.parent.damage(100);
      }
      //al completar su animacion de explsion, dicha instancia se autodestruye
      bombExprosion.on('animationcomplete', function(){
        bombExprosion.destroy();
      });
      //animacion de explosion
      bombExprosion.anims.play('exprosion', true);

      //AUDIO_BOMBA_Explosion (aqui explotaria la bomba)
      super.itemExpire(proj);
  }
}
