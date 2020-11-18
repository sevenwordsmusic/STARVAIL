import Projectile from "../Projectile.js";
import Enemy from "../../../Enemies/Enemy.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class BulletBounce extends Projectile {
  constructor(scene, x, y, spr, dmg, bounce, speed, velDirection, expTime, target, distanceToPlayer){
    super(scene, x, y,  expTime);
    //inicializacion
    this.sprite = scene.add.sprite(x,y,"bullets",spr);
    this.sprite.setScale(0.9,0.8);
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
    this.sprite.angle = this.pVelocity.angle() * 180/Math.PI ;
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate

    //AUDIO
      this.sfx=Audio.play3Dinstance(this, 66);
    //
  }
  //se para el update y si se trata de un enemigo, este recibe daño
  itemExpire(){
    this.scene.events.off("update", this.update, this);


    const bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "bulletImpact");
    bombExplosion.setDepth(10).setFlipX(true) //42
    if(this.target.collided && this.target.colSpecialObj != undefined && Object.getPrototypeOf(this.target.colSpecialObj.constructor) === Enemy){
      this.target.colSpecialObj.damage(this.dmg, this.pVelocity);

      if(this.target != undefined && this.target.colSpecialObj != undefined && this.target.colSpecialObj.sprite != undefined && this.target.colSpecialObj.sprite.body != undefined){
        bombExplosion.x += (this.target.colSpecialObj.sprite.body.velocity.x*12);
        bombExplosion.y += (this.target.colSpecialObj.sprite.body.velocity.y*12);
      }

      //AUDIO ENEMIGO DAÑADO
      if(this.bounce>0){
        Audio.play3DinstanceRnd(this, 3);
        Audio.play3DinstanceRnd(this,37);
      }else if(this.bounce==0){
        Audio.play3DinstanceRnd(this,38);
      }
      //
    }else{
      //AUDIO
      if(this.bounce>0){
        Audio.play3DinstanceRnd(this, 3);
        Audio.play3DinstanceRnd(this, 0);
        Audio.play3DinstanceRnd(this, 67);
      }else if(this.bounce==0){
        Audio.play3DinstanceRnd(this, 1);
      }
      //
    }
      //AUDIO
        this.sfx.volume= 0.0;
      //

    //al completar su animacion de explsion, dicha instancia se autodestruye
    bombExplosion.on('animationcomplete', function(){
      bombExplosion.destroy();
    });

    //animacion de explosion
    bombExplosion.anims.play('bulletImpact', true);
    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    super.itemExpire();


    if(this.bounce > 0 && this.target.body != undefined){
      this.bounce--;
      const vertices = this.target.body.parts[this.target.part].vertices;
      const currentVertex = vertices[this.target.vertex];
      const nextVertex = vertices[(this.target.vertex+1) % vertices.length];
      const normalVector = new Phaser.Math.Vector2(currentVertex.x - nextVertex.x , currentVertex.y - nextVertex.y );
      const newAngle = 2*normalVector.angle() - this.pVelocity.angle();
      const directionVector = new Phaser.Math.Vector2(Math.cos(newAngle), Math.sin(newAngle) );
      bombExplosion.angle = newAngle * 180/Math.PI + 180;

      /*const randNormalAngle = reflectionVector.angle() + Phaser.Math.FloatBetween(- Math.PI/3, Math.PI/3);
      normalVector.x = Math.cos(randNormalAngle);
      normalVector.y = Math.sin(randNormalAngle);*/

      var bulletCollision = SuperiorQuery.superiorRayCastBounce(xAux + directionVector.x * 48, yAux + directionVector.y * 48, directionVector, 14 ,this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - (xAux + directionVector.x * 14),2) + Math.pow(bulletCollision.colY - (yAux + directionVector.y * 14),2));
        return new BulletBounce(this.scene, xAux + directionVector.x * 14, yAux + directionVector.y * 14, 1, this.dmg, this.bounce, this.speed, directionVector, Math.min(1000,(bulletDistance * this.scene.matter.world.getDelta())/this.speed), bulletCollision, bulletDistance);
      }else{
        return new BulletBounce(this.scene, xAux + directionVector.x * 14, yAux + directionVector.y * 14, 1, this.dmg, this.bounce, this.speed, directionVector, 1000, bulletCollision, -1);
      }
    }else{
      bombExplosion.angle = this.pVelocity.angle() * 180/Math.PI;
    }

  }

  //update (al no tratarse de un cuerpo fisico, las posiciones nuevas se calculan "a mano")
  update(time, delta){
    if(this.sprite != undefined){
      this.sprite.x += (this.pVelocity.x * delta);
      this.sprite.y += (this.pVelocity.y * delta);
      //AUDIO
          if(Audio.waitForUpdate()){
              this.sfx.volume=Audio.volume3D(this);
          }
      //
    }
  }

  //funcion especial para balas dirigidas hacia enemigos que podrían morir antes de que estas lleguen
  prepareBullet(index, x, y, targetX, targetY, speed){
    //evento especial que espera a ver si el target desaparece y recalcula la nueva collision de la bala
    this.scene.events.once('noEnemy' + index, function(){
      if(this.sprite == undefined)return;
      var auxDir = new Phaser.Math.Vector2(this.pVelocity.x, this.pVelocity.y);
      auxDir.normalize();
      this.target = SuperiorQuery.superiorRayCastBounce(x, y, auxDir, 14 ,this.scene.bulletInteracBodies);
      const bulletDistance = Math.sqrt(Math.pow(this.target.colX - this.sprite.x,2) + Math.pow(this.target.colY - this.sprite.y,2));
      this.expTime = Math.min(1000,(bulletDistance * this.scene.matter.world.getDelta())/speed);
      this.distAcumulator += bulletDistance;
      this.timer.reset({
        delay: this.expTime,
        callback: () => (this.itemExpire())
      });
    },this);
    //mejorar esto si las balas hacen mucho daño
  }

  distanceToPlayer(){
    if(this.distAcumulator == undefined)
      return Number.MAX_SAFE_INTEGER;
    else
      return this.distAcumulator;
  }
}
