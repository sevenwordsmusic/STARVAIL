import Enemy from "./Enemy.js";

var ddiirr = -1;
//enemigo que hereda de Enemy
export default class Dummy extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);
    this.sprite.setScale(0.4);
    this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
  }

  damage(dmg){
    super.damage(dmg);
  }

  enemyDead(){
    super.enemyDead();
  }
}
