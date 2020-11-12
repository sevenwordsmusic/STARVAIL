import Enemy from "./Enemy.js"

//Clase padre de todos los enemigos
export default class Blackboard{
  constructor(scene){
    this.scene = scene;
    this.enemyBodies = [];
    this.removeBodies = [];
    this.playerPos = new Phaser.Math.Vector2(0, 0);
    this.enemyCounter = 0;
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate
    this.noUpdate = false;
  }

  /*updatePlayerPosition(){
    this.playerPos.x = this.scene.game.player.sprite.x;
    this.playerPos.y = this.scene.game.player.sprite.y;
    for(var i=0; i<this.enemyBodies.length; i++){
      if(this.enemyBodies[i] !== undefined){
        const distToPlayer = Math.sqrt(Math.pow(this.playerPos.x - this.enemyBodies[i].gameObject.x,2) + Math.pow(this.playerPos.y - this.enemyBodies[i].gameObject.y,2));
        this.enemyBodies[i].gameObject.parent.updatePlayerPosition(distToPlayer);
        if(distToPlayer < this.closeseEnemyDistance){
          this.closestEnemy = this.enemyBodies[i];
          this.closeseEnemyDistance = distToPlayer;
        }
      }
    }
  }*/

  addToRemove(enemy){
    this.removeBodies.push(enemy);
  }

  update(time, delta){
    if(this.noUpdate){return;}
    for(var i=0; i<this.removeBodies.length; i++){
      //el "body" del enemigo se quita del array de cuerpos que interaccionan con balas
      this.scene.bulletInteracBodies[this.removeBodies[i].currentBodyIndex] = undefined;
      this.scene.enemyController.enemyBodies[this.removeBodies[i].currentEnemyIndex] = undefined;
      this.removeBodies[i].sprite.destroy();
    }
    this.removeBodies.length = 0;

    for(var i=0; i<this.enemyBodies.length; i++){
      if(this.enemyBodies[i] !== undefined){
        this.enemyBodies[i].gameObject.parent.updateTouchBoundry();
        this.enemyBodies[i].gameObject.parent.update(time, delta);
        this.enemyBodies[i].gameObject.parent.updateAI(time, delta);
      }
    }
    if(this.enemyBodies[this.enemyCounter] !== undefined){
      const distToPlayer = Math.sqrt(Math.pow(this.scene.game.player.sprite.x - this.enemyBodies[this.enemyCounter].gameObject.x,2) + Math.pow(this.scene.game.player.sprite.y - this.enemyBodies[this.enemyCounter].gameObject.y,2));
      this.enemyBodies[this.enemyCounter].gameObject.parent.updatePlayerPosition(distToPlayer);
      if(this.enemyBodies[this.enemyCounter].gameObject.parent != this.scene.game.player.closestEnemy){
        if(distToPlayer < this.scene.game.player.getClosestEnemyDistance())
          this.scene.game.player.closestEnemy = this.enemyBodies[this.enemyCounter].gameObject.parent;
      }
    }
    if(this.enemyBodies.length != 0)
      this.enemyCounter = (this.enemyCounter+1)%this.enemyBodies.length;

    /*if(this.enemyBodies[this.enemyCounter] !== undefined){
      const distToPlayer = Math.sqrt(Math.pow(this.scene.game.player.sprite.x - this.enemyBodies[this.enemyCounter].gameObject.x,2) + Math.pow(this.scene.game.player.sprite.y - this.enemyBodies[this.enemyCounter].gameObject.y,2));
      this.enemyBodies[this.enemyCounter].gameObject.parent.updatePlayerPosition(distToPlayer);
      if(this.enemyBodies[this.enemyCounter].gameObject.parent != this.scene.game.player.closestEnemy){
        if(distToPlayer < this.scene.game.player.getClosestEnemyDistance())
          this.scene.game.player.closestEnemy = this.enemyBodies[this.enemyCounter].gameObject.parent;
      }
    }
    this.enemyCounter = (this.enemyCounter+1)%this.enemyBodies.length;*/
  }

  destroy(){
    this.noUpdate = true;
    for(var i=0; i<this.removeBodies.length; i++){
      //el "body" del enemigo se quita del array de cuerpos que interaccionan con balas
      this.scene.bulletInteracBodies[this.removeBodies[i].currentBodyIndex] = undefined;
      this.scene.enemyController.enemyBodies[this.removeBodies[i].currentEnemyIndex] = undefined;
      this.removeBodies[i].sprite.destroy();
    }
    for(var i=0; i<this.enemyBodies.length; i++){
      if(this.enemyBodies[i] !== undefined){
        this.enemyBodies[i].gameObject.parent.destroy();
      }
    }
    this.removeBodies.length = 0;
    this.enemyBodies.length = 0;
    this.scene.events.off("update", this.update);
  }
}
