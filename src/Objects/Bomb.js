import Projectile from "./Projectile.js";
import SuperiorQuery from "../SuperiorQuery.js";

//proyectil que hereda de Projectile
export default class Bomb extends Projectile {
  constructor(scene, x, y, dir){
    super(scene, x, y, 2000);
    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,'explodingBomb',0);

    this.sprite.setCircle(11);
    this.sprite.setOrigin(0.5, 0.61);
    this.sprite.setDepth(5).setAngularVelocity(0.2 * dir);
    this.sprite.body.collisionFilter.group = -1;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -x, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-y);
    const fAdjuster = Math.min(1, 0.4 + this.pVelocity.length()/400);
    this.pVelocity = this.pVelocity.normalize().scale(10 * fAdjuster);
    this.sprite.setVelocity(this.pVelocity.x -(1*dir), this.pVelocity.y - 4);

    //animacion de bomba
    this.sprite.anims.play('eBomb', true);
  }

  itemExpire(proj){
      const bombExprosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "exprosion");
      bombExprosion.setDepth(10).setScale(3) //42

      var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, 40, this.scene.game.enemyBodies);
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

      //var bombSound = scene.sound.add('bomb', {volume: scene.game.soundVolume});    //SONIDO BOMBA
      //bombSound.play();
      super.itemExpire(proj);
  }
}
