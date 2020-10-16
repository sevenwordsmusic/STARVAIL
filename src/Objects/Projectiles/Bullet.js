import Projectile from "./Projectile.js";
import Enemy from "../../Enemies/Enemy.js";
import SuperiorQuery from "../../SuperiorQuery.js";

//proyectil que hereda de Projectile
export default class Bullet extends Projectile {
  constructor(scene, x, y, speed, velDirection, expTime, target, distanceToPlayer){
    super(scene, x, y,  expTime);
    //inicializacion
    this.sprite = scene.add.sprite(x,y,'bullet',0);
    this.target = target;

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = new Phaser.Math.Vector2(velDirection.x, velDirection.y);
    this.pVelocity.scale(speed / this.scene.matter.world.getDelta());

    this.distAcumulator = distanceToPlayer;
    //si el "target" del proyectil es un enemigo se invoca una funcion especial
    if(this.target.collided && this.target.colSpecialObj != undefined && Object.getPrototypeOf(this.target.colSpecialObj.constructor) === Enemy)
      this.prepareBullet(this.target.colSpecialObj.currentBodyIndex, x, y, this.scene.input.activePointer.x + this.scene.cameras.main.scrollX, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY , speed);

    this.sprite.setDepth(5);
    this.sprite.angle = this.pVelocity.angle() * 180/Math.PI + 90;
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate
  }

  //se para el update y si se trata de un enemigo, este recibe daño
  itemExpire(proj){
    this.scene.events.off("update", this.update, this);
    if(this.target.collided && this.target.colSpecialObj != undefined && Object.getPrototypeOf(this.target.colSpecialObj.constructor) === Enemy)
      this.target.colSpecialObj.damage(7);

    const bombExprosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "exprosion");
    bombExprosion.setDepth(10).setScale(1) //42
    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExprosion.on('animationcomplete', function(){
      bombExprosion.destroy();
    });
    //animacion de explosion
    bombExprosion.anims.play('exprosion', true);

    //AUDIO_BALAEXPLOSIVA_Collision (aqui explotaria)
    var distance= (920-this.distanceToPlayer())/920;
    if(distance<0.0){
        distance=0.0;
    }
    this.scene.impact_00.volume=distance;
    this.scene.impact_00.play();
    this.scene.impact_00.setRate(0.9+(Math.random() * 0.2));
    super.itemExpire(proj);
  }

  //update (al no tratarse de un cuerpo fisico, las posiciones nuevas se calculan "a mano")
  update(time, delta){
    this.sprite.x += (this.pVelocity.x * delta);
    this.sprite.y += (this.pVelocity.y * delta);
  }

  //funcion especial para balas dirigidas hacia enemigos que podrían morir antes de que estas lleguen
  prepareBullet(index, x, y, targetX, targetY, speed){
    //evento especial que espera a ver si el target desaparece y recalcula la nueva collision de la bala
    this.scene.events.once('noEnemy' + index, function(){
      var auxDir = new Phaser.Math.Vector2(this.pVelocity.x, this.pVelocity.y);
      auxDir.normalize();
      this.target = SuperiorQuery.superiorRayCast(x, y, auxDir, 14 ,this.scene.bulletInteracBodies);
      const bulletDistance = Math.sqrt(Math.pow(this.target.colX - this.sprite.x,2) + Math.pow(this.target.colY - this.sprite.y,2));
      this.expTime = Math.min(1000,(bulletDistance * this.scene.matter.world.getDelta())/speed);
      this.distAcumulator += bulletDistance;
      this.timer.reset({
        delay: this.expTime,
        callback: () => (this.itemExpire(this))
      });
    },this);
    //mejorar esto si las balas hacen mucho daño

    
  }

  distanceToPlayer(){
    return this.distAcumulator;
  }
}
