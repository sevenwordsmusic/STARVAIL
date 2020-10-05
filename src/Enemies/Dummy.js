import Enemy from "./Enemy.js";

var ddiirr = -1;
//enemigo que hereda de Enemy
export default class Dummy extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);
    this.sprite.setScale(0.4).setFixedRotation();
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate
  }

  damage(dmg){
    super.damage(dmg);
  }

  update(){
    if(this.sprite.body != undefined){
      if(this.sprite.y >= 600)
        ddiirr = 1;
      if(this.sprite.y <= 300){
        ddiirr = -1;
      }
      if(ddiirr == -1)
        this.sprite.y += 6*ddiirr;

    }
  }

  enemyDead(){
    this.scene.events.off("update", this.update, this);
    super.enemyDead();
  }
}
