//Clase padre de todos los enemigos
export default class Enemy {
  constructor(scene, x, y, sprtImg, hp){
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,sprtImg,0);
    this.sprite.parent = this;
    this.hp = hp;
    this.airEnemy; //true si es aereo,  false si es terrestre

    this.sprite.body.collisionFilter.group = -1;

    //cada vez que se crea un enemigo se añade su "body" al arrya de cuerpos que interaccionan con las balas y al array de cuerpos de enemigos

    if(this.scene.enemyBodies == undefined)
      this.scene.enemyBodies = [];
    this.currentBodyIndex = this.scene.bulletInteracBodies.length;
    this.scene.bulletInteracBodies[this.currentBodyIndex] = this.sprite.body;
    this.currentEnemyIndex = this.scene.enemyBodies.length;
    this.scene.enemyBodies[this.currentEnemyIndex] = this.sprite.body;

  }

  //funcion que quita vida y mata al enemigo
  damage(dmg){
    if(this.hp < dmg){
      this.enemyDead()
    }
    else if(this.hp == dmg){
      this.hp -= dmg;
      this.enemyDead();
    }
    else{
      this.hp -= dmg;
    }
  }

  enemyDead(){
    //el "body" del enemigo se quita del array de cuerpos que interaccionan con balas
    this.scene.bulletInteracBodies[this.currentBodyIndex] = null;
    this.scene.enemyBodies[this.currentEnemyIndex] = null;

    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    this.sprite.destroy();
    //se emite un evento avisando a las balas que tienen a este enemigo como "target" para que cambien a un target nuevo
    this.scene.events.emit('noEnemy' + this.currentBodyIndex);
  }
}
