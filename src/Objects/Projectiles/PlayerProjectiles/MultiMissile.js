import Projectile from "../Projectile.js";
import Bomb from "./Bomb.js";
import SuperiorQuery from "../../../SuperiorQuery.js";
import Audio from "../../../Audio.js";

//proyectil que hereda de Projectile
export default class MultiMissile extends Projectile {
  constructor(scene, x, y, spr, dmg, area, knockback, offsprings, offspringScale, speed, velDir, dir, expTime){
    super(scene, x, y, expTime);
    //AUDIO:

    //inicializacion
    this.sprite = scene.matter.add.sprite(x,y,spr,0);
    this.sprite.parent = this;
    this.dmg = dmg;
    this.area = area;
    this.knockback = knockback;
    this.offsprings = offsprings;
    this.offspringScale = offspringScale;
    this.initX = x;
    this.initY = y;

    this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(0,0,11);
    this.sensor.isSensor = true;

    this.sprite.setExistingBody(this.sensor).setPosition(x, y);/*.setFriction(0).setFrictionStatic(0)*/
    this.sprite.setOrigin(0.5, 0.61).setDepth(5)
    this.sprite.setFlipX(dir < 0);
    this.sprite.angle = velDir.angle() * 180/Math.PI + 90;
    //this.sprite.setAngularVelocity(0.2 * dir);
    this.sprite.body.collisionFilter.group = -1;
    this.sprite.body.collisionFilter.category = 4;

    this.sprite.setIgnoreGravity(true);

    //se calcula la direccion y magnitud del vector de velocidad
    this.pVelocity = velDir;
    this.pVelocity = this.pVelocity.normalize().scale(speed);
    this.sprite.setVelocity(this.pVelocity.x , this.pVelocity.y);

    this.sprite.body.restitution = 0.5;

    this.bombArmed1;
    //this.bombArmed2;


    //AUDIO
      this.sfx=Audio.play3Dinstance(this, 12);
      this.touchDown=true;
      this.touchDelay=0;
    //
  }

  armBomb(){
    this.sprite.body.collisionFilter.group = 0;
    this.bombArmed1 = this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensor,
      callback: this.onSensorCollide,
      context: this
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
      //AUDIO_BOMBA_Collision (esto se invoca cada vez que choca contra algo como el suelo)
      if(this.scene.game.player.weaponCounter==7){
        if(this.touchDown==true && this.touchDelay<3){
          this.touchDelay++;
          this.sfx.volume=Audio.play3Dinstance(this, 7).volume;
        }else if(this.touchDown==true && this.touchDelay== 3){
          this.touchDown=false;
          this.touchDelay=0;
        }
      }
      //
    this.reachedTarget(this, bodyB, pair);
  }

  reachedTarget(proj, bodyB, pair){
    if(this.sprite.body != undefined){
      this.bombArmed1();
      //AUDIO_BOMBA_Explosion (aqui explotaria la bomba)
        Audio.play3Dinstance(this, 15);
        this.sfx.volume= 0.0;
      //

      var bombExplosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, "explosion");
      bombExplosion.setDepth(10).setScale(this.area/15) //42
      this.damageEnemiesArea();

      //al completar su animacion de explsion, dicha instancia se autodestruye
      bombExplosion.on('animationcomplete', function(){
        bombExplosion.destroy();
      });
      //animacion de explosion
      bombExplosion.anims.play('explosion', true);

      const bombPreset = this.scene.game.player.weapons[4] //arma de bombas normales de player
      //que asco de collisiones..... tengo que usar un raycast mio proque matter no sabe como calcular collisones entre circulos y cubos.........
      var superiorColl = SuperiorQuery.superiorRayCastMisile(this.initX, this.initY, this.pVelocity, this.scene.bulletInteracBodies);
      if(superiorColl.body != undefined){
        const vertices = superiorColl.body.parts[superiorColl.part].vertices;
        const currentVertex = vertices[superiorColl.vertex];
        const nextVertex = vertices[(superiorColl.vertex+1) % vertices.length];
        var normalVector = new Phaser.Math.Vector2(nextVertex.y - currentVertex.y, currentVertex.x - nextVertex.x );

        const angleChangeRate = Math.PI/(2*(this.offsprings+1));
        var angle = normalVector.angle() + 0.25*Math.PI - angleChangeRate;

        var offspring;
        for(var i=0; i<this.offsprings; i++){
          const angleVector = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle))
          offspring = new Bomb(this.scene, this.sprite.x, this.sprite.y, bombPreset.wSprite, bombPreset.damage * this.offspringScale, bombPreset.area * this.offspringScale, bombPreset.knockback * this.offspringScale, Phaser.Math.FloatBetween(5, 10), angleVector, (angleVector.x < 0)?-1:1, Phaser.Math.FloatBetween(1750, 2250));
          offspring.sprite.setScale(this.offspringScale);
          offspring.delayArmBomb(300);
          angle -= angleChangeRate;
        }
        offspring = undefined;
      }
      else{
        for(var i=0; i<this.offsprings; i++){
          offspring = new Bomb(this.scene, this.sprite.x, this.sprite.y, bombPreset.wSprite, bombPreset.damage * this.offspringScale, bombPreset.area * this.offspringScale, bombPreset.knockback * this.offspringScale, 0, new Phaser.Math.Vector2(1, 1), 1, 2000);
          offspring.sprite.setScale(this.offspringScale);
          offspring.delayArmBomb(300);
        }
      }
      this.itemExpire(proj);
    }
  }

  itemExpire(proj){
    super.itemExpire(proj);
  }

  damageEnemiesArea(){
    var damagedEnemies = SuperiorQuery.superiorRegion(this.sprite.x, this.sprite.y, this.area, this.scene.enemyController.enemyBodies);
    for(var i in damagedEnemies){
      if(damagedEnemies[i] != undefined && damagedEnemies[i].gameObject != null)
        damagedEnemies[i].gameObject.parent.damageAndKnock(this.dmg, this.knockback, new Phaser.Math.Vector2(damagedEnemies[i].gameObject.x - this.sprite.x, damagedEnemies[i].gameObject.y - this.sprite.y));
    }
  }

  distanceToPlayer(){
    if(this.sprite.body != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }
}
