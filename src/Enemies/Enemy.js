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

    //array de pedazos al morirse
    this.scrapArray = [];
    this.canDeathSpawn = true;

    this.encounterNPC = undefined;

    //variables fisicas
    this.sprite.body.collisionFilter.group = -1;
    this.adjustedFriction = 10;
    this.knockVector = new Phaser.Math.Vector2(0,0);
    this.knockVecNomralized = new Phaser.Math.Vector2(0,0);

    //cada vez que se crea un enemigo se añade su "body" al arrya de cuerpos que interaccionan con las balas y al array de cuerpos de enemigos
    this.currentBodyIndex = this.scene.bulletInteracBodies.length;
    this.scene.bulletInteracBodies[this.currentBodyIndex] = this.sprite.body;
    this.currentEnemyIndex = this.scene.enemyController.enemyBodies.length;
    this.scene.enemyController.enemyBodies[this.currentEnemyIndex] = this.sprite.body;

    //tween para tintear el sprite del enemigo a rojo cuando es dañado
    this.tween = this.scene.tweens.add({
      targets: this.sprite,
      tint: {from: 0xffffff, to: 0xff0000},
      duration: 60,
      repeat: 0,
      yoyo: true
    })
    //AUDIO
      this.sfx=Audio.play2Dinstance(54);
      this.sfxDetect=Audio.play2Dinstance(54);
    //
  }

  //update del enemigo
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
    //en ciertos estados se invocan otros métodos para ajustar audio y filtrado de collisiones
    if(this.currentStateId() > 0){
      //AUDIO
      if(Audio.waitForUpdate()){
        this.sfx.volume=Audio.volume3D(this);
        if(this.currentStateId() > 1)
          this.sfxDetect.volume=Audio.volume3D(this);
      }
      this.updateTouchBoundry();
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
  //funcion que quita vida y mata al enemigo con el laser
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
  //funcion que quita vida , mata y empuja al enemigo
  damageAndKnock(dmg, knockback, v){
    this.knockVector.x = v.x;
    this.knockVector.y = v.y;
    this.knockVecNomralized = this.knockVector.normalize();
    this.knockVector.scale(knockback);

    this.damage(dmg, v);
  }

  //funcion que comprueba si el jugador esta en un area
  playerHit(x1, y1, x2, y2){
    return (SuperiorQuery.superiorBoundBodyOverlap(x1, y1, x2, y2, this.scene.game.player.mainBody));
  }

  //funcion que se invoca al matar a un enemigo
  enemyDead(deathSpawn = true){
    if(this.scene.game.onPC && deathSpawn){
        this.deathSpawn(this.sprite.x,this.sprite.y, this.sprite.scale);
    }
    this.dead = true;
    Audio.stingerKilling=true;
    this.scene.events.emit('noEnemy' + this.currentBodyIndex);
    this.scene.enemyController.addToRemove(this);
    //AUDIO
    //se emite un evento avisando a las balas que tienen a este enemigo como "target" para que cambien a un target nuevo
    this.scene.game.points += this.points;
    this.scene.game.enemiesKilled ++;
    if(this.encounterNPC !== undefined)
      this.encounterNPC.enemyKilled();
  }
  //funcion que destruye el enemigo (se invoca al salir del juego o de la escena en la que se situa)
  destroy(){
    this.stopAudio();
    this.tween.remove();
    this.sprite.destroy();
    this.sprite.parent = undefined;
    this.sprite = undefined;
  } //incompleto, cada enemigo deberia eliminar sus cuerpos y objetos adicionales adicionales

  //AUDIO
  stopAudio(){
    if(this.sfx.isPlaying){
      this.sfx.stop();
    }
    if(this.sfxDetect.isPlaying){
      this.sfxDetect.stop();
    }
  }
  //
  //funcion que crea los pedazos de los enemigos al morir y les aplica la velocidad, direccion, velocidad angular... adecuada
  deathSpawn(x,y,scaleDeb) {
    if (this.canDeathSpawn) {
      this.canDeathSpawn = false;
      var remainVelocity = Phaser.Math.FloatBetween(4, 8);
      var randomAng;
      var randomVec;
      for (var i = 0; i < this.scrapArray.length; i++) {
        var debree = this.scene.matter.add.image(x, y, this.scrapArray[i], 0, { isSensor: true });
        debree.body.collisionFilter.mask = 0;
        debree.body.collisionFilter.group = -4;
        debree.setDepth(8).setScale(scaleDeb);
        randomAng = Phaser.Math.FloatBetween(Math.PI/4, (7*Math.PI)/4) + Math.PI/2;
        randomVec = new Phaser.Math.Vector2(Math.cos(randomAng), Math.sin(randomAng));
        randomVec.normalize();
        randomVec.scale(remainVelocity);
        debree.setVelocity(randomVec.x, randomVec.y);
        debree.setAngularVelocity(0.04 * randomVec.x);
        //debree.setAngularVelocity(Math.random()/10-0.05);
        this.scene.time.addEvent({
          delay: 2000,
          callback: (destroyDebree),
          args: [debree]
        });
      }
    }
    function destroyDebree(debree) { debree.destroy() }
  }

  //método que calcula la distancia al jugador (se usa sobretodo para el audio)
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
