import Projectile from "../Projectile.js";
import Enemy from "../../../Enemies/Enemy.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class BulletBounce extends Projectile {
  constructor(scene, x, y, spr, dmg, bounce, speed, velDirection, expTime, target, distanceToPlayer){
    super(scene, x, y,  expTime);
    //inicializacion
    this.sprite = scene.add.sprite(x,y,spr,0);
    this.target = target;

    this.dmg = dmg;
    this.bounce = bounce
    this.speed = speed;

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

    //AUDIO_bounce
    if(this.bounce>0){
      Audio.play3DinstanceRnd(this, 3);
      Audio.play3DinstanceRnd(this, 0);
    }else if(this.bounce==0){
      Audio.play3DinstanceRnd(this, 1);
    }
    //
    if(this.target.collided && this.target.colSpecialObj != undefined && Object.getPrototypeOf(this.target.colSpecialObj.constructor) === Enemy)
      this.target.colSpecialObj.damage(this.dmg, this.pVelocity);

    const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "exprosion");
    bombExplosion.setDepth(10).setScale(1) //42
    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });

    //animacion de explosion
    bombExplosion.anims.play('explosion', true);
    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    super.itemExpire(proj);


    if(this.bounce > 0 && this.target.body != undefined){
      this.bounce--;
      const vertices = this.target.body.parts[this.target.part].vertices;
      const currentVertex = vertices[this.target.vertex];
      const nextVertex = vertices[(this.target.vertex+1) % vertices.length];
      var normalVector = new Phaser.Math.Vector2(nextVertex.y - currentVertex.y, currentVertex.x - nextVertex.x );
      normalVector.normalize();
      const randNormalAngle = normalVector.angle() + Phaser.Math.FloatBetween(- Math.PI/3, Math.PI/3);
      normalVector.x = Math.cos(randNormalAngle);
      normalVector.y = Math.sin(randNormalAngle);

      var bulletCollision = SuperiorQuery.superiorRayCastBounce(xAux + normalVector.x * 48, yAux + normalVector.y * 48, normalVector, 14 ,this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - (xAux + normalVector.x * 14),2) + Math.pow(bulletCollision.colY - (yAux + normalVector.y * 14),2));
        return new BulletBounce(this.scene, xAux + normalVector.x * 14, yAux + normalVector.y * 14, this.sprite.texture, this.dmg, this.bounce, this.speed, normalVector, Math.min(1000,(bulletDistance * this.scene.matter.world.getDelta())/this.speed), bulletCollision, bulletDistance);
      }else{
        return new BulletBounce(this.scene, xAux + normalVector.x * 14, yAux + normalVector.y * 14, this.sprite.texture, this.dmg, this.bounce, this.speed, normalVector, 1000, bulletCollision, -1);
      }
    }
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
      this.target = SuperiorQuery.superiorRayCastBounce(x, y, auxDir, 14 ,this.scene.bulletInteracBodies);
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
