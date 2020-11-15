import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import SuperiorQuery from "../SuperiorQuery.js"

//Clase padre de todos los enemigos
export default class Enemy extends FiniteStateMachine{
  constructor(scene, x, y, sprtImg, hp, optionalFrame = 0){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,sprtImg,optionalFrame);
    this.sprite.parent = this;
    this.hp = hp;
    this.dead = false;

    this.encounterNPC = undefined;

    this.sprite.body.collisionFilter.group = -1;
    this.adjustedFriction = 10;
    this.knockVector = new Phaser.Math.Vector2(0,0);
    this.knockVecNomralized = new Phaser.Math.Vector2(0,0);

    //cada vez que se crea un enemigo se añade su "body" al arrya de cuerpos que interaccionan con las balas y al array de cuerpos de enemigos

    this.currentBodyIndex = this.scene.bulletInteracBodies.length;
    this.scene.bulletInteracBodies[this.currentBodyIndex] = this.sprite.body;
    this.currentEnemyIndex = this.scene.enemyController.enemyBodies.length;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = this.sprite.body;

    this.tween = this.scene.tweens.add({
      targets: this.sprite,
      tint: {from: 0xffffff, to: 0xff0000},
      duration: 60,
      repeat: 0,
      yoyo: true
    })

  }

  update(time, delta){
    if(this.sprite != undefined && this.sprite.body !== undefined){
      if(this.knockVector.length() > this.adjustedFriction){
        this.knockVector.x -= this.knockVecNomralized.x * this.adjustedFriction;
        this.knockVector.y -= this.knockVecNomralized.y * this.adjustedFriction;
        this.sprite.x += this.knockVector.x * delta;
        this.sprite.y += this.knockVector.y * delta;
        this.knockVector.x -= this.adjustedFriction*Math.sign(this.knockVector.x);
        this.knockVector.y -= this.adjustedFriction*Math.sign(this.knockVector.y);
      }
    }
  }

  //funcion que quita vida y mata al enemigo
  damage(dmg, v){
    this.hp -= dmg;
    if(this.hp <= 0){
      this.enemyDead(v.x, v.y);
      return;
    }
    if(this.tween.progress == 1){
      this.tween.restart();
    }
  }

  damageLaser(dmg, v){
    this.hp -= dmg;
    if(this.hp <= 0){
      this.enemyDead(v.x, v.y);
      return;
    }
    if(this.tween.progress == 1 || this.tween.progress == 0.13833333333333334){
      this.tween.restart();
    }
  }

  damageAndKnock(dmg, knockback, v){
    this.knockVector.x = v.x;
    this.knockVector.y = v.y;
    this.knockVecNomralized = this.knockVector.normalize();
    this.knockVector.scale(knockback);

    this.damage(dmg, v);
  }

  playerHit(x1, y1, x2, y2){
    return (SuperiorQuery.superiorBoundBodyOverlap(x1, y1, x2, y2, this.scene.game.player.mainBody));
  }

  enemyDead(){
    this.dead = true;
    Audio.stingerKilling=true;
    this.scene.events.emit('noEnemy' + this.currentBodyIndex);
    this.scene.enemyController.addToRemove(this);
    //AUDIO
    //se emite un evento avisando a las balas que tienen a este enemigo como "target" para que cambien a un target nuevo
    this.scene.game.points += this.points;
    if(this.encounterNPC !== undefined)
      this.encounterNPC.enemyKilled();
  }
  destroy(){
    this.tween.remove();
    this.sprite.destroy();
    this.sprite.parent = undefined;
    this.sprite = undefined;
  } //incompleto, cada enemigo deberia eliminar sus cuerpos y objetos adicionales adicionales
}
